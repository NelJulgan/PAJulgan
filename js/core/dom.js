/**
 * ============================================================================
 * 1st — Foundation Code: Centralized DOM Cache
 * File: js/core/dom.js
 * ============================================================================
 *
 * Senior Mentorship Note:
 * // STEP 1: Centralized DOM query caching
 * Why this code exists:
 * Querying the DOM repeatedly inside render loops, scroll events, or button clicks causes
 * unnecessary layout reflows and Garbage Collection overhead. Caching critical references once
 * at initialization guarantees high-performance runtime execution.
 */

export const DOM = {
  menuButton: document.querySelector('.menu-button'),
  nav: document.querySelector('#navigation'),
  year: document.querySelector('#year'),
  scrollProgress: document.querySelector('.scroll-progress'),
  intro: document.querySelector('.intro'),
  heroPinWrapper: document.querySelector('#heroPinWrapper'),
  heroInkPath: document.querySelector('#heroInkPath'),
  wordReveals: document.querySelectorAll('.word-reveal'),
  studioBottom: document.querySelector('.studio-bottom'),
  workHeading: document.querySelector('.work-heading'),
  workTrack: document.querySelector('.project-track'),
  workProgressSpan: document.querySelector('.work-progress span'),
  servicesH2: document.querySelector('.services h2, .service-section h2'),
  serviceList: document.querySelector('.service-list'),
  approachHead: document.querySelector('.approach-head'),
  contactSection: document.querySelector('.contact.section'),
  processVisual: document.querySelector('.process-visual'),
  processImages: window.gsap?.utils?.toArray
    ? window.gsap.utils.toArray('.process-img')
    : Array.from(document.querySelectorAll('.process-img')),
  processSteps: window.gsap?.utils?.toArray
    ? window.gsap.utils.toArray('.process-step')
    : Array.from(document.querySelectorAll('.process-step')),
  processCurrent: document.querySelector('.process-current'),
  processCaption: document.querySelector('.process-caption'),
  footerWord: document.querySelector('.ink-footer-word'),
  footerWordFallback: document.querySelector('.footer-word-fallback'),
  footerInkCircle: document.querySelector('#footerInkCircle'),
  footerInkPulse: document.querySelector('#footerInkPulse'),
  projectDialog: document.querySelector('#project-dialog'),
  projectTitle: document.querySelector('#project-title'),
  projectType: document.querySelector('#project-type'),
  projectDescription: document.querySelector('#project-description'),
  projectImage: document.querySelector('#project-detail-image'),
  projectEnquire: document.querySelector('#project-enquire'),
  briefDialog: document.querySelector('#brief-dialog'),
  briefOpen: document.querySelector('#brief-open'),
  briefForm: document.querySelector('#brief-form'),
  formStatus: document.querySelector('#form-status')
};

// Update copyright year dynamically
if (DOM.year) {
  DOM.year.textContent = String(new Date().getFullYear());
}
