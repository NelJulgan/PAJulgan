/**
 * ============================================================================
 * 2nd — Core Functionality: Preloader Curtain Sequence
 * File: js/modules/intro.js
 * ============================================================================
 *
 * Senior Mentorship Note:
 * // STEP 1: Preloader Curtain Entrance Timeline
 * Why this code exists:
 * Provides an elegant architectural arrival curtain. Five vertical ink-columns stagger
 * upwards revealing the header and hero copy, then completely unmounts from the DOM
 * to eliminate memory overhead and avoid blocking clicks.
 */

import { DOM } from '../core/dom.js';

export function initIntro() {
  if (DOM.intro && window.gsap) {
    DOM.intro.classList.add('active');

    const introTimeline = window.gsap.timeline({
      onComplete: () => {
        DOM.intro.remove();
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      }
    });

    introTimeline
      .from('.intro > span', { y: 25, opacity: 0, duration: 0.65, ease: 'power3.out' })
      .to('.intro > span', { y: -20, opacity: 0, duration: 0.4, ease: 'power2.in' }, '+=0.1')
      .to('.intro > div', { yPercent: -100, duration: 1.05, stagger: 0.075, ease: 'power4.inOut' }, '-=0.1')
      .from('h1 > span', { yPercent: 110, stagger: 0.09, duration: 1.15, ease: 'power3.out' }, '-=0.7')
      .from('.hero-copy > .eyebrow, .hero-description, .hero-copy > .text-link', {
        opacity: 0,
        y: 16,
        stagger: 0.1,
        duration: 0.85,
        ease: 'power3.out'
      }, '-=0.8')
      .from('.hero-ink-mask', { opacity: 0, y: 25, scale: 1.04, duration: 1.35, ease: 'power3.out' }, '-=1.1')
      .from('.drawing-top, .drawing-bottom, .drawing-label', { opacity: 0, duration: 0.8 }, '-=0.7');
  }
}
