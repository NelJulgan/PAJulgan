/**
 * ============================================================================
 * 1st — Foundation Code: Lenis Smooth Scrolling Engine
 * File: js/core/lenis.js
 * ============================================================================
 *
 * Senior Mentorship Note:
 * // STEP 3: Initialize Lenis Smooth Scrolling Engine
 * Why this code exists:
 * Modern high-end architectural sites require momentum scrolling that feels natural,
 * weighted, and fluid while maintaining 100% native accessibility and keyboard control.
 *
 * Tricky logic:
 * Lenis must be synchronized directly to GSAP's internal requestAnimationFrame ticker
 * via `gsap.ticker.add((time) => lenisInstance.raf(time * 1000))` and `lagSmoothing(0)`
 * so ScrollTrigger coordinates remain strictly frame-locked with zero jitter.
 */

let lenisInstance = null;

export function initLenis() {
  if (typeof window !== 'undefined' && window.Lenis) {
    lenisInstance = new window.Lenis({
      duration: 1.35, // Refined momentum glide duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth exponential ease-out
      smoothWheel: true,
      wheelMultiplier: 0.95, // Suppresses trackpad/mousewheel micro-stutters
      touchMultiplier: 1.5,
      infinite: false,
      anchors: false
    });

    // Connect Lenis scroll events to ScrollTrigger ticker
    if (window.ScrollTrigger) {
      lenisInstance.on('scroll', window.ScrollTrigger.update);
    }

    // Drive Lenis updates directly through GSAP's internal requestAnimationFrame ticker
    if (window.gsap) {
      window.gsap.ticker.add((time) => lenisInstance.raf(time * 1000));
      window.gsap.ticker.lagSmoothing(0);
    }
  }

  return lenisInstance;
}

export function getLenis() {
  return lenisInstance;
}
