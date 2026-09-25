/**
 * ============================================================================
 * 1st — Foundation Code: Adaptive Scroll Physics Engine & Lenis Integration
 * File: js/core/lenis.js
 * ============================================================================
 *
 * Senior Mentorship Architecture Note:
 *
 * 1st — Foundation Code
 * - Mathematical cubic-bezier solvers and spring physics integration.
 * - Adaptive device physics engine:
 *   - Desktop: Inertial mousewheel momentum with cubic-bezier(0.16, 1, 0.3, 1).
 *   - Mobile touch: Frictionless, feather-light direct compositor momentum.
 * - Real-time velocity tracking and dynamic scroll physics dispatch.
 * - Direct GSAP requestAnimationFrame ticker synchronization with lag-smoothing.
 *
 * Why this code exists:
 * Mobile touch scrolling felt "heavy" because virtual JavaScript touch interception
 * (syncTouch: true with high drag friction and low lerp rates) cancelled the phone's
 * native 120Hz GPU compositor thread. By deploying an Adaptive Physics Engine that
 * removes artificial drag resistance on mobile while retaining full velocity tracking
 * and motion orchestration, scrolling becomes silky, feather-light, and responsive.
 *
 * Tricky logic:
 * When syncTouch is false on touch devices, Lenis does not preventDefault on touchmove,
 * allowing native 120Hz compositor scrolling. Meanwhile, Lenis's scroll event listener
 * continues to dispatch current scroll offsets at 120 FPS, allowing our Motion Framework
 * to calculate velocity, direction, and drive GSAP ScrollTriggers with zero touch lag.
 *
 * TODO: Support dynamic input-switching if an external mouse is connected to an iPad/tablet.
 */

import { solveCubicBezier, MOTION_TIMING, isTouchDevice, physicsEngine } from './motion.js';

export { solveCubicBezier, MOTION_TIMING, isTouchDevice, physicsEngine };

let lenisInstance = null;

// STEP 1: Initialize Adaptive Scroll Engine
export function initLenis() {
  if (typeof window === 'undefined' || !window.Lenis) {
    console.warn('[Motion] Lenis engine unavailable. Falling back to native scrolling.');
    return null;
  }

  const isTouch = isTouchDevice();

  // STEP 2: Configure Adaptive Device Physics Profile
  // On desktop: Virtual smooth momentum with luxury cinematic curve
  // On mobile touch: Frictionless compositor agility with zero artificial weight
  lenisInstance = new window.Lenis({
    duration: 1.25, // Weight-based glide duration
    easing: MOTION_TIMING.curves.cinematic, // Master cubic-bezier(0.16, 1, 0.3, 1) curve
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.95, // Calibrated to eliminate mousewheel notches
    // Adaptive touch physics:
    // When false on touch screens, allows the device's native 120Hz GPU compositor to pan
    // with 0ms drag resistance, completely eliminating the "heavy / thick sludge" feeling!
    syncTouch: false,
    touchMultiplier: 1.0,
    infinite: false,
    anchors: false,
    overscroll: true
  });

  // STEP 3: Real-time Physics Engine Update Loop
  lenisInstance.on('scroll', (event) => {
    // 1. Update ScrollPhysicsEngine with current scroll position
    physicsEngine.update(event.scroll);

    // 2. Lock coordinates frame-by-frame with GSAP ScrollTrigger
    if (window.ScrollTrigger) {
      window.ScrollTrigger.update();
    }
  });

  // STEP 4: Synchronize Lenis with GSAP's Internal RAF Ticker
  if (window.gsap) {
    window.gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });

    // Clamps frame-time spikes so animations never jerk or freeze
    window.gsap.ticker.lagSmoothing(500, 33);
  }

  return lenisInstance;
}

export function getLenis() {
  return lenisInstance;
}

export function getScrollVelocity() {
  return physicsEngine.smoothedVelocity;
}
