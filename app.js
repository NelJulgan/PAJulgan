/**
 * ============================================================================
 * PAJULGAN — Architecture & Engineering
 * Production Application Script — Professional Motion & Cinematic Scrolling Engine
 * File: app.js
 * ============================================================================
 *
 * Senior Mentorship Architecture Sequence:
 *
 * 1st — Foundation Code
 * - Centralized DOM cache & utility helpers.
 * - Mathematical cubic-bezier(0.16, 1, 0.3, 1) solver.
 * - Lenis 1.3+ smooth momentum scroll engine with dynamic velocity tracking.
 * - Mobile navigation & accessible anchor scrolling.
 *
 * 2nd — Core Functionality
 * - Preloader curtain sequence.
 * - Accessible modal dialogs (Project detail & Project brief).
 * - Project brief generator and client-side download.
 *
 * 3rd — Enhancement, Animation & Optimization
 * - Centralized MOTION_SYSTEM architecture & reusable animation presets.
 * - Architectural split-line heading reveals with 3D tilt & overflow clip.
 * - Hero Holographic Drafting Table Parallax (multi-plane depth across CAD elements).
 * - Kinetic word & character opacity reveal in Studio.
 * - Selected Works 3D Card Aperture Parallax (horizontal track counter-pan + scale).
 * - Floating Architectural Section Tags (differential vertical velocity).
 * - Progressive service accordion disclosure with debounced refresh.
 * - Sticky 4-phase architectural process crossfade.
 * - Centered footer liquid ink displacement mask & pointer attraction physics.
 * ============================================================================
 */

/* ============================================================================
   1st — Foundation Code: DOM Cache, Utilities & Smooth Scroll Engine
   ============================================================================ */

// STEP 1: Centralized DOM query caching
// Why this code exists:
// Querying the DOM repeatedly inside render loops, scroll events, or button clicks causes
// unnecessary layout reflows and Garbage Collection overhead. Caching critical references once
// guarantees high-performance runtime execution.
const DOM = {
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
  formStatus: document.querySelector('#form-status'),
  sectionTags: document.querySelectorAll('.section-tag'),
  drawingTop: document.querySelector('.drawing-top'),
  drawingBottom: document.querySelector('.drawing-bottom'),
  drawingLabel: document.querySelector('.drawing-label'),
  heroCopy: document.querySelector('.hero-copy'),
  building: document.querySelector('#building')
};

// Update copyright year dynamically
if (DOM.year) {
  DOM.year.textContent = String(new Date().getFullYear());
}

// STEP 2: Mobile Navigation Controller
// Why this code exists:
// Toggles the full-screen 100vh mobile navigation drawer and locks background scrolling.
// Tricky logic:
// Toggling 'body.nav-open' allows CSS to lock the viewport, while pausing Lenis ensures
// touch swipe momentum cannot scroll the page behind the 100vh overlay.
function closeMenu() {
  if (!DOM.nav || !DOM.menuButton) return;
  DOM.nav.classList.remove('open');
  document.body.classList.remove('nav-open');
  DOM.menuButton.setAttribute('aria-expanded', 'false');
  if (lenisInstance && !document.querySelector('dialog[open]')) {
    lenisInstance.start();
  }
}

if (DOM.menuButton && DOM.nav) {
  DOM.menuButton.addEventListener('click', () => {
    const isOpen = DOM.nav.classList.toggle('open');
    document.body.classList.toggle('nav-open', isOpen);
    DOM.menuButton.setAttribute('aria-expanded', String(isOpen));
    if (lenisInstance) {
      if (isOpen) {
        lenisInstance.stop();
      } else if (!document.querySelector('dialog[open]')) {
        lenisInstance.start();
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 600 && document.body.classList.contains('nav-open')) {
      closeMenu();
    }
  });

  window.addEventListener('orientationchange', () => {
    closeMenu();
  });
}

// STEP 3: Mathematical Cubic-Bezier Easing Solver (cubic-bezier(0.16, 1, 0.3, 1))
// Why: Provides exact physics-based acceleration and deceleration curves to JS loops.
function solveCubicBezier(x1, y1, x2, y2) {
  const ax = 1 - 3 * x2 + 3 * x1;
  const bx = 3 * x2 - 6 * x1;
  const cx = 3 * x1;

  const ay = 1 - 3 * y2 + 3 * y1;
  const by = 3 * y2 - 6 * y1;
  const cy = 3 * y1;

  function sampleCurveX(t) {
    return ((ax * t + bx) * t + cx) * t;
  }
  function sampleCurveY(t) {
    return ((ay * t + by) * t + cy) * t;
  }
  function sampleCurveDerivativeX(t) {
    return (3 * ax * t + 2 * bx) * t + cx;
  }

  function solveCurveX(x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const xSample = sampleCurveX(t) - x;
      if (Math.abs(xSample) < 1e-6) return t;
      const dX = sampleCurveDerivativeX(t);
      if (Math.abs(dX) < 1e-6) break;
      t -= xSample / dX;
    }
    let t0 = 0;
    let t1 = 1;
    t = x;
    while (t0 < t1) {
      const xSample = sampleCurveX(t);
      if (Math.abs(xSample - x) < 1e-6) return t;
      if (x > xSample) t0 = t;
      else t1 = t;
      t = (t1 + t0) * 0.5;
      if (t1 - t0 < 1e-6) break;
    }
    return t;
  }

  return function (x) {
    return sampleCurveY(solveCurveX(x));
  };
}

const cinematicEase = solveCubicBezier(0.16, 1, 0.3, 1);

// STEP 4: Initialize Lenis Smooth Scrolling Engine with Velocity & Momentum
let lenisInstance = null;
let currentVelocity = 0;
let isScrollingActive = false;
let scrollEndTimer = null;

if (typeof window !== 'undefined' && window.Lenis) {
  lenisInstance = new window.Lenis({
    duration: 1.3, // Weight-based glide duration
    easing: cinematicEase, // Master cubic-bezier(0.16, 1, 0.3, 1) curve
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.95, // Calibrated to eliminate mousewheel micro-stutters
    syncTouch: true, // Enables buttery smooth momentum scrolling on mobile touch
    syncTouchLerp: 0.08, // Buttery drag-and-glide momentum interpolation
    touchInertiaExponent: 1.65, // Gentle deceleration curve upon finger release
    touchMultiplier: 1.0, // 1:1 direct tactile finger tracking
    infinite: false,
    anchors: false,
    overscroll: true
  });

  const rootDoc = document.documentElement;

  // Real-time Velocity & Direction State Tracking
  lenisInstance.on('scroll', (event) => {
    if (window.ScrollTrigger) {
      window.ScrollTrigger.update();
    }

    currentVelocity = event.velocity || 0;
    const direction = event.direction === 1 ? 'down' : 'up';

    if (rootDoc.dataset.scrollDirection !== direction) {
      rootDoc.dataset.scrollDirection = direction;
    }

    if (!isScrollingActive && Math.abs(currentVelocity) > 0.05) {
      isScrollingActive = true;
      rootDoc.dataset.scrolling = 'true';
    }

    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(() => {
      isScrollingActive = false;
      rootDoc.dataset.scrolling = 'false';
    }, 120);
  });

  if (window.gsap) {
    window.gsap.ticker.add((time) => lenisInstance.raf(time * 1000));
    window.gsap.ticker.lagSmoothing(500, 33);
  }
}

// STEP 5: Unified Internal Anchor Link Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    e.preventDefault();
    closeMenu();

    if (lenisInstance) {
      lenisInstance.scrollTo(targetElement, {
        offset: -40,
        duration: 1.25,
        onComplete: () => {
          history.replaceState(null, '', targetId);
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus({ preventScroll: true });
        }
      });
    } else {
      targetElement.scrollIntoView({ behavior: 'smooth' });
      targetElement.setAttribute('tabindex', '-1');
      targetElement.focus({ preventScroll: true });
    }
  });
});

/* ============================================================================
   2nd — Core Functionality: Preloader Curtain, Dialog Modals & Brief Form
   ============================================================================ */

// STEP 1: Preloader Curtain Entrance Timeline
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

// STEP 2: Accessible Modal Dialogs Controller
const projectData = [
  {
    name: 'The Courtyard House',
    type: 'PG—001 / RESIDENTIAL CONCEPT',
    image: 'assets/courtyard.jpg',
    description: 'An exploration of living around light. A sheltered courtyard brings landscape into the everyday, while deep thresholds create a gentle transition between inside and out. A simple structural rhythm allows generous, adaptable spaces. This conceptual direction pairs an original axonometric study with reference photography.'
  },
  {
    name: 'The Common Ground',
    type: 'PG—002 / CULTURAL CONCEPT',
    image: 'assets/pavilion.jpg',
    description: 'A study in gathering. An open pavilion makes room for chance encounters, shared activities, and moments of pause. Its sculptural form explores the relationship between civic identity, shade, and a welcoming human scale. Reference photography illustrates the intended atmosphere.'
  },
  {
    name: 'Framework / 03',
    type: 'PG—003 / WORKPLACE CONCEPT',
    image: 'assets/structure.jpg',
    description: 'An investigation into structural rhythm and the changing workplace. Repeated elements establish a clear framework, with flexible spaces that can adapt over time. The facade is conceived as both an environmental filter and an expression of the structure within. Reference photography illustrates this design direction.'
  }
];

function openModal(dialogElement) {
  if (!dialogElement) return;
  dialogElement.showModal();
  lenisInstance?.stop();
}

function closeModal(dialogElement) {
  if (!dialogElement) return;
  dialogElement.close();
  if (!document.querySelector('dialog[open]')) {
    lenisInstance?.start();
  }
}

document.querySelectorAll('[data-project]').forEach((button) => {
  button.addEventListener('click', () => {
    const projectIndex = Number(button.dataset.project);
    const project = projectData[projectIndex];
    if (!project || !DOM.projectDialog) return;

    if (DOM.projectTitle) DOM.projectTitle.textContent = project.name;
    if (DOM.projectType) DOM.projectType.textContent = project.type;
    if (DOM.projectDescription) DOM.projectDescription.textContent = project.description;
    if (DOM.projectImage) {
      DOM.projectImage.src = project.image;
      DOM.projectImage.alt = `${project.name} — architectural reference`;
    }

    openModal(DOM.projectDialog);
  });
});

if (DOM.briefOpen && DOM.briefDialog) {
  DOM.briefOpen.addEventListener('click', () => openModal(DOM.briefDialog));
}

if (DOM.projectEnquire && DOM.projectDialog && DOM.briefDialog) {
  DOM.projectEnquire.addEventListener('click', () => {
    closeModal(DOM.projectDialog);
    openModal(DOM.briefDialog);
  });
}

document.querySelectorAll('dialog').forEach((dialog) => {
  const closeBtn = dialog.querySelector('.dialog-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal(dialog));
  }

  dialog.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) {
      lenisInstance?.start();
    }
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      const isOutside =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;
      if (isOutside) closeModal(dialog);
    }
  });
});

// STEP 3: Project Brief Export Controller
if (DOM.briefForm) {
  DOM.briefForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.target);

    const briefText = [
      '==================================================',
      'PAJULGAN — ARCHITECTURAL & ENGINEERING PROJECT BRIEF',
      '==================================================\n',
      `Client Name:  ${data.get('name')}`,
      `Email:        ${data.get('email')}`,
      `Project Type: ${data.get('type')}\n`,
      'PROJECT VISION & REQUIREMENTS:',
      '--------------------------------------------------',
      `${data.get('message')}\n`,
      '--------------------------------------------------',
      `Generated on: ${new Date().toLocaleDateString()}`,
      'Stored locally in-browser. Please share with your design consultant.',
      '=================================================='
    ].join('\n');

    const blob = new Blob([briefText], { type: 'text/plain;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');

    downloadLink.href = downloadUrl;
    downloadLink.download = 'PAJULGAN-project-brief.txt';
    downloadLink.click();

    setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);

    if (DOM.formStatus) {
      DOM.formStatus.textContent = 'Your brief is ready. Keep the downloaded file to share with your design team.';
    }
  });
}

/* ============================================================================
   3rd — Enhancement, Animation & Optimization: GSAP & ScrollTrigger Suite
   ============================================================================ */

if (window.gsap && window.ScrollTrigger) {
  document.body.classList.add('motion-ready');
  window.gsap.registerPlugin(window.ScrollTrigger);

  window.ScrollTrigger.config({
    limitCallbacks: true,
    syncInterval: 100
  });

  const MOTION_CONFIG = {
    ease: {
      cinematic: cinematicEase,
      smooth: 'power2.out',
      expo: 'power4.out',
      gentle: 'power1.out',
      none: 'none'
    },
    duration: {
      quick: 0.45,
      base: 0.85,
      extended: 1.25,
      cinematic: 1.65
    }
  };

  window.gsap.defaults({
    ease: 'power3.out',
    duration: MOTION_CONFIG.duration.base
  });

  // STEP 1: Global Viewport Scroll Progress Bar
  if (DOM.scrollProgress) {
    window.gsap.to(DOM.scrollProgress, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        start: 0,
        end: 'max',
        scrub: true
      }
    });
  }

  const responsiveMedia = window.gsap.matchMedia();

  // STEP 2: Architectural Split-Line Heading Reveal Preset
  function splitLineReveal(element, triggerStart = 'top 85%') {
    if (!element) return;
    const rawHtml = element.innerHTML.trim();
    const lines = rawHtml.split(/<br\s*\/?>/i);

    if (lines.length > 1) {
      element.innerHTML = lines
        .map((line) => `<span class="motion-line"><span class="motion-line-inner">${line.trim()}</span></span>`)
        .join('');

      const inners = element.querySelectorAll('.motion-line-inner');
      window.gsap.fromTo(
        inners,
        {
          yPercent: 110,
          rotateX: 4,
          opacity: 0
        },
        {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          duration: MOTION_CONFIG.duration.extended,
          stagger: 0.12,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: element,
            start: triggerStart,
            toggleActions: 'play none none reverse'
          }
        }
      );
    } else {
      window.gsap.fromTo(
        element,
        { y: 45, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: MOTION_CONFIG.duration.extended,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: element,
            start: triggerStart,
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }

  // STEP 3: Hero Holographic Drafting Table Parallax (Desktop)
  responsiveMedia.add('(min-width: 601px)', () => {
    if (DOM.heroInkPath && DOM.heroPinWrapper) {
      const finalMaskPath = DOM.heroInkPath.dataset.valueFinal || 'M 0 1000 Q 500 1250 1000 1000 L 1000 0 L 0 0 Z';

      const heroPinTimeline = window.gsap.timeline({
        scrollTrigger: {
          trigger: DOM.heroPinWrapper,
          start: 'top top',
          end: '+=900',
          pin: true,
          scrub: 1.1,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      // Layer 1: Liquid SVG mask morphing from CAD wireframe to render
      heroPinTimeline.fromTo(
        DOM.heroInkPath,
        { attr: { d: 'M 0 1 Q 500 2 1000 1 L 1000 0 L 0 0 Z' } },
        { attr: { d: finalMaskPath }, ease: 'none', duration: 1 },
        0
      );

      // Layer 2: Midground Building subtle scale & vertical float
      heroPinTimeline.to(
        '#building',
        { y: -30, scale: 1.03, ease: 'none', duration: 1 },
        0
      );

      // Layer 3: Drawing metadata background drift
      if (DOM.drawingTop) {
        heroPinTimeline.to(DOM.drawingTop, { y: -20, opacity: 0.7, ease: 'none', duration: 1 }, 0);
      }
      if (DOM.drawingBottom) {
        heroPinTimeline.to(DOM.drawingBottom, { y: 20, opacity: 0.7, ease: 'none', duration: 1 }, 0);
      }
      if (DOM.drawingLabel) {
        heroPinTimeline.to(DOM.drawingLabel, { y: -40, ease: 'none', duration: 1 }, 0);
      }

      // Layer 4: Foreground Hero Copy upward drift
      if (DOM.heroCopy) {
        heroPinTimeline.to(DOM.heroCopy, { y: -50, opacity: 0.85, ease: 'none', duration: 1 }, 0);
      }
    }
  });

  // Mobile Hero: Natural fluid scrub without viewport lock
  responsiveMedia.add('(max-width: 600px)', () => {
    if (DOM.heroInkPath && DOM.heroPinWrapper) {
      const finalMaskPath = DOM.heroInkPath.dataset.valueFinal || 'M 0 1000 Q 500 1250 1000 1000 L 1000 0 L 0 0 Z';

      window.gsap.fromTo(
        DOM.heroInkPath,
        { attr: { d: 'M 0 1 Q 500 2 1000 1 L 1000 0 L 0 0 Z' } },
        {
          attr: { d: finalMaskPath },
          ease: 'none',
          scrollTrigger: {
            trigger: DOM.heroPinWrapper,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.9,
            invalidateOnRefresh: true
          }
        }
      );
    }
  });

  // STEP 4: Kinetic Word & Character Opacity Reveal
  if (DOM.wordReveals && DOM.wordReveals.length > 0) {
    DOM.wordReveals.forEach((el) => {
      const words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words
        .map((word) => {
          const chars = word.split('').map((char) => `<span class="char">${char}</span>`).join('');
          return `<span class="word">${chars}</span>`;
        })
        .join(' ');

      const chars = el.querySelectorAll('.char');
      window.gsap.fromTo(
        chars,
        { opacity: 0.12, y: 4 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.035,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            end: 'bottom 45%',
            scrub: 0.85
          }
        }
      );
    });
  }

  // STEP 5: Studio Bottom Content Staggered Entrance
  if (DOM.studioBottom) {
    window.gsap.fromTo(
      DOM.studioBottom.children,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: MOTION_CONFIG.duration.extended,
        stagger: 0.16,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: DOM.studioBottom,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // STEP 6: Selected Works Heading Mask Reveal
  if (DOM.workHeading) {
    const headingH2 = DOM.workHeading.querySelector('h2');
    const headingAside = DOM.workHeading.querySelector('.work-aside');

    if (headingH2) splitLineReveal(headingH2, 'top 85%');

    if (headingAside) {
      window.gsap.fromTo(
        headingAside,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: MOTION_CONFIG.duration.base,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: DOM.workHeading,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }

  // STEP 7: Works Horizontal Scroll Pin & 3D Card Aperture Parallax
  responsiveMedia.add('(min-width: 601px)', () => {
    if (!DOM.workTrack) return;
    const calculateDistance = () => Math.max(0, DOM.workTrack.scrollWidth - window.innerWidth);

    // Track horizontal translation
    window.gsap.to(DOM.workTrack, {
      x: () => -calculateDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: '.work',
        start: 'top top',
        end: () => `+=${calculateDistance() + 450}`,
        pin: true,
        scrub: 1.1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (DOM.workProgressSpan) {
            window.gsap.set(DOM.workProgressSpan, { scaleX: self.progress });
          }
        }
      }
    });

    // Internal 3D image aperture parallax for each project card
    document.querySelectorAll('.project').forEach((card) => {
      const cardImg = card.querySelector('.project-image img');
      if (cardImg) {
        window.gsap.fromTo(
          cardImg,
          { xPercent: 12, scale: 1.14 },
          {
            xPercent: -12,
            scale: 1.05,
            ease: 'none',
            scrollTrigger: {
              trigger: '.work',
              start: 'top top',
              end: () => `+=${calculateDistance() + 450}`,
              scrub: true
            }
          }
        );
      }
    });
  });

  // Mobile: Staggered vertical cards with vertical internal image parallax
  responsiveMedia.add('(max-width: 600px)', () => {
    document.querySelectorAll('.project').forEach((el) => {
      window.gsap.fromTo(
        el,
        { y: 40, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      const cardImg = el.querySelector('.project-image img');
      if (cardImg) {
        window.gsap.fromTo(
          cardImg,
          { yPercent: -8, scale: 1.1 },
          {
            yPercent: 8,
            scale: 1.02,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      }
    });
  });

  // STEP 8: Floating Architectural Section Tags Parallax
  responsiveMedia.add('(min-width: 601px)', () => {
    if (DOM.sectionTags && DOM.sectionTags.length > 0) {
      DOM.sectionTags.forEach((tag) => {
        const parentSection = tag.closest('.section') || tag.parentElement;
        if (!parentSection) return;

        window.gsap.fromTo(
          tag,
          { y: -25 },
          {
            y: 25,
            ease: 'none',
            scrollTrigger: {
              trigger: parentSection,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      });
    }
  });

  // STEP 9: Services Heading & Disciplines Accordion Progressive Disclosure
  if (DOM.servicesH2) {
    splitLineReveal(DOM.servicesH2, 'top 85%');
  }

  if (DOM.serviceList) {
    const serviceItems = DOM.serviceList.querySelectorAll('details');

    let accordionRefreshTimer = null;
    function debouncedScrollTriggerRefresh() {
      clearTimeout(accordionRefreshTimer);
      accordionRefreshTimer = setTimeout(() => {
        window.ScrollTrigger.refresh();
      }, 250);
    }

    window.gsap.fromTo(
      serviceItems,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: MOTION_CONFIG.duration.base,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: DOM.serviceList,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    function openServiceItem(item) {
      const body = item.querySelector('.service-body');
      if (!body) {
        item.open = true;
        debouncedScrollTriggerRefresh();
        return;
      }

      if (item.open && !window.gsap.isTweening(body) && body.offsetHeight > 0) return;

      window.gsap.killTweensOf(body);
      if (!item.open) {
        item.open = true;
        window.gsap.set(body, { height: 0, opacity: 0, overflow: 'hidden' });
      }

      const targetHeight = body.scrollHeight;
      const startHeight = body.offsetHeight;
      const startOpacity = parseFloat(window.gsap.getProperty(body, 'opacity')) || 0;

      window.gsap.fromTo(
        body,
        { height: startHeight, opacity: startOpacity, overflow: 'hidden' },
        {
          height: targetHeight,
          opacity: 1,
          duration: 0.65,
          ease: 'power3.out',
          overwrite: 'auto',
          onComplete: () => {
            window.gsap.set(body, { height: 'auto', overflow: 'hidden' });
            debouncedScrollTriggerRefresh();
          }
        }
      );
    }

    function closeServiceItem(item) {
      if (!item.open) return;
      const body = item.querySelector('.service-body');
      if (!body) {
        item.open = false;
        debouncedScrollTriggerRefresh();
        return;
      }

      window.gsap.killTweensOf(body);
      const currentHeight = body.offsetHeight;
      const currentOpacity = parseFloat(window.gsap.getProperty(body, 'opacity')) || 1;

      window.gsap.fromTo(
        body,
        { height: currentHeight, opacity: currentOpacity, overflow: 'hidden' },
        {
          height: 0,
          opacity: 0,
          duration: 0.45,
          ease: 'power2.inOut',
          overwrite: 'auto',
          onComplete: () => {
            item.open = false;
            window.gsap.set(body, { clearProps: 'height,opacity,overflow' });
            debouncedScrollTriggerRefresh();
          }
        }
      );
    }

    serviceItems.forEach((item) => {
      const summary = item.querySelector('summary');
      if (summary) {
        summary.addEventListener('click', (e) => {
          e.preventDefault();
          if (item.open && !window.gsap.isTweening(item.querySelector('.service-body'))) {
            closeServiceItem(item);
          } else {
            openServiceItem(item);
          }
        });
      }

      responsiveMedia.add('(min-width: 601px)', () => {
        window.ScrollTrigger.create({
          trigger: item,
          start: 'top 74%',
          onEnter: () => openServiceItem(item),
          onLeaveBack: () => closeServiceItem(item)
        });
      });
    });
  }

  // STEP 10: Approach Heading & Methodology Section
  if (DOM.approachHead) {
    const approachEyebrow = DOM.approachHead.querySelector('.eyebrow');
    const approachH2 = DOM.approachHead.querySelector('h2');

    if (approachEyebrow) {
      window.gsap.fromTo(
        approachEyebrow,
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: MOTION_CONFIG.duration.base,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: DOM.approachHead,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    if (approachH2) splitLineReveal(approachH2, 'top 85%');
  }

  // STEP 11: Contact Section Entrance
  if (DOM.contactSection) {
    const contactTag = DOM.contactSection.querySelector('.section-tag');
    const contactEyebrow = DOM.contactSection.querySelector('.eyebrow');
    const contactH2 = DOM.contactSection.querySelector('h2');
    const contactBottom = DOM.contactSection.querySelector('.contact-bottom');

    if (contactTag) {
      window.gsap.fromTo(
        contactTag,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: MOTION_CONFIG.duration.base,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: DOM.contactSection,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    if (contactEyebrow) {
      window.gsap.fromTo(
        contactEyebrow,
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: MOTION_CONFIG.duration.base,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: DOM.contactSection,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    if (contactH2) splitLineReveal(contactH2, 'top 85%');

    if (contactBottom) {
      window.gsap.fromTo(
        contactBottom.children,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: MOTION_CONFIG.duration.extended,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contactBottom,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }

  // STEP 12: Sticky Process Image Showcase Controller (4-Phase Methodology)
  const phaseLabels = [
    'PHASE // 01 DISCOVER',
    'PHASE // 02 DESIGN',
    'PHASE // 03 RESOLVE',
    'PHASE // 04 REALISE'
  ];

  let currentActiveProcessIndex = 0;

  function switchProcessImage(targetIndex) {
    if (targetIndex === currentActiveProcessIndex && DOM.processImages[targetIndex]?.classList.contains('active')) {
      return;
    }
    currentActiveProcessIndex = targetIndex;

    DOM.processImages.forEach((img, i) => {
      if (i === targetIndex) {
        img.classList.add('active');
        window.gsap.to(img, {
          opacity: 1,
          scale: 1,
          duration: 0.65,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      } else {
        img.classList.remove('active');
        window.gsap.to(img, {
          opacity: 0,
          scale: 1.04,
          duration: 0.55,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      }
    });

    if (DOM.processCurrent) {
      DOM.processCurrent.textContent = String(targetIndex + 1).padStart(2, '0');
    }
    if (DOM.processCaption) {
      DOM.processCaption.textContent = phaseLabels[targetIndex] || '';
    }
  }

  DOM.processSteps.forEach((step, i) => {
    window.gsap.from(step, {
      opacity: 0.25,
      y: 40,
      scrollTrigger: {
        trigger: step,
        start: 'top 85%',
        end: 'top 45%',
        scrub: 0.9
      }
    });

    window.ScrollTrigger.create({
      trigger: step,
      start: 'top 55%',
      end: 'bottom 55%',
      onEnter: () => switchProcessImage(i),
      onEnterBack: () => switchProcessImage(i),
      onLeaveBack: () => switchProcessImage(Math.max(0, i - 1))
    });
  });

  // STEP 13: Centered Footer Liquid Ink Displacement Mask & Pointer Attraction
  if (DOM.footerWord && DOM.footerInkCircle) {
    window.gsap.fromTo(
      DOM.footerInkCircle,
      { attr: { r: 0, cx: 500, cy: 110 } },
      {
        attr: { r: 750 },
        ease: 'power2.out',
        scrollTrigger: {
          trigger: DOM.footerWordFallback || DOM.footerWord,
          start: 'top 80%',
          end: 'bottom 45%',
          scrub: 1.2,
          invalidateOnRefresh: true
        }
      }
    );

    let lastRippleTimestamp = 0;

    const triggerPointerInk = (clientX, clientY) => {
      const rect = DOM.footerWord.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const svgX = Math.max(0, Math.min(1000, ((clientX - rect.left) / rect.width) * 1000));
      const svgY = Math.max(0, Math.min(220, ((clientY - rect.top) / rect.height) * 220));

      window.gsap.to(DOM.footerInkCircle, {
        attr: { cx: svgX, cy: svgY },
        duration: 0.6,
        ease: 'power3.out',
        overwrite: 'auto'
      });

      if (DOM.footerInkPulse) {
        window.gsap.killTweensOf(DOM.footerInkPulse);
        window.gsap.fromTo(
          DOM.footerInkPulse,
          { attr: { cx: svgX, cy: svgY, r: 15 }, opacity: 0.85 },
          {
            attr: { r: 350 },
            opacity: 0,
            duration: 0.95,
            ease: 'power3.out'
          }
        );
      }
    };

    DOM.footerWord.addEventListener('pointerenter', (e) => triggerPointerInk(e.clientX, e.clientY));
    DOM.footerWord.addEventListener('pointermove', (e) => {
      const now = performance.now();
      if (now - lastRippleTimestamp > 65) {
        lastRippleTimestamp = now;
        triggerPointerInk(e.clientX, e.clientY);
      }
    });
    DOM.footerWord.addEventListener('pointerdown', (e) => triggerPointerInk(e.clientX, e.clientY));
  }

  // STEP 14: High-Performance Asset Load & Font-Ready Recalibration
  let imageRefreshTimer = null;
  const debouncedGlobalRefresh = () => {
    clearTimeout(imageRefreshTimer);
    imageRefreshTimer = setTimeout(() => {
      window.ScrollTrigger.refresh();
    }, 150);
  };

  document.querySelectorAll('img').forEach((img) => {
    if (img.complete) return;
    img.addEventListener('load', debouncedGlobalRefresh);
  });

  if (document.fonts?.ready) {
    document.fonts.ready.then(debouncedGlobalRefresh);
  }

  window.addEventListener('load', debouncedGlobalRefresh);
}
