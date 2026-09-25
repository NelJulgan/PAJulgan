/**
 * ============================================================================
 * PAJULGAN — Architecture & Engineering
 * Production Application Script
 * ============================================================================
 *
 * Senior Mentorship Architecture Sequence:
 *
 * 1st — Foundation Code
 * - DOM cache & utility helpers
 * - Lenis smooth momentum scroll engine with lag-smoothing synchronization
 * - Mobile navigation & accessible anchor scrolling
 *
 * 2nd — Core Functionality
 * - Preloader curtain sequence
 * - Accessible modal dialogs (Project detail & Project brief)
 * - Project brief generator and client-side download
 *
 * 3rd — Enhancement, Animation & Optimization
 * - Hero pinned liquid ink showcase (0..850px scrub runway)
 * - Kinetic word & character opacity reveal
 * - Calibrated section fade-up entrances (85vh threshold with bi-directional reverse)
 * - Selected works horizontal scroll track pin (desktop) & responsive vertical stack
 * - Services progressive accordion disclosure (74vh threshold & GPU height expansion)
 * - Sticky process crossfade showcase (4-phase architectural methodology)
 * - Centered footer liquid ink displacement mask (80vh threshold & pointer tracking)
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
  processImages: gsap?.utils?.toArray ? gsap.utils.toArray('.process-img') : Array.from(document.querySelectorAll('.process-img')),
  processSteps: gsap?.utils?.toArray ? gsap.utils.toArray('.process-step') : Array.from(document.querySelectorAll('.process-step')),
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

// STEP 2: Mobile Navigation Controller
// Why this code exists:
// Toggles the full-screen 100vh mobile navigation drawer and locks background scrolling.
// Tricky logic:
// Toggling 'body.nav-open' allows CSS to lock the viewport, while pausing Lenis ensures
// touch swipe momentum cannot scroll the page behind the 100vh overlay.
// TODO: Test touch-drag responsiveness on mobile Safari iOS with address bar retraction.
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
}

// STEP 3: Initialize Lenis Smooth Scrolling Engine
// Why this code exists:
// Creates silk-smooth inertial momentum scrolling. We synchronize Lenis with GSAP's ticker
// and configure lagSmoothing(500, 33) to cushion any dropped frames gracefully.
let lenisInstance = null;

if (typeof window !== 'undefined' && window.Lenis) {
  lenisInstance = new Lenis({
    duration: 1.25, // Luxurious, graceful momentum deceleration
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth exponential ease-out
    smoothWheel: true,
    wheelMultiplier: 1.0, // Soft, non-aggressive wheel response for silk-smooth trackpad & mousewheel
    touchMultiplier: 1.25,
    infinite: false,
    anchors: false
  });

  // Connect Lenis scroll events to ScrollTrigger ticker
  if (window.ScrollTrigger) {
    lenisInstance.on('scroll', ScrollTrigger.update);
  }

  // Drive Lenis updates directly through GSAP's internal requestAnimationFrame ticker
  if (window.gsap) {
    gsap.ticker.add((time) => lenisInstance.raf(time * 1000));
    // Clamps frame-time spikes so animations never jerk or skip when heavy DOM calculations occur
    gsap.ticker.lagSmoothing(500, 33);
  }
}

// STEP 2: Unified Internal Anchor Link Smooth Scrolling
// Why this code exists:
// Replaces disjointed click handlers with a single, consolidated navigation controller.
// Handles menu closing, smooth momentum scrolling via Lenis, URL hash persistence,
// and accessible focus management without jarring browser jumps.
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
        duration: 1.4,
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

  const introTimeline = gsap.timeline({
    onComplete: () => {
      DOM.intro.remove();
      if (window.ScrollTrigger) ScrollTrigger.refresh();
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

// Bind project cards
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

// Bind brief open trigger
if (DOM.briefOpen && DOM.briefDialog) {
  DOM.briefOpen.addEventListener('click', () => openModal(DOM.briefDialog));
}

// Transition from project modal to brief modal
if (DOM.projectEnquire && DOM.projectDialog && DOM.briefDialog) {
  DOM.projectEnquire.addEventListener('click', () => {
    closeModal(DOM.projectDialog);
    openModal(DOM.briefDialog);
  });
}

// Close listeners for all dialog elements
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

// STEP 2: Project Brief Export Controller
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
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power2.out', duration: 1.05 });

  // STEP 4: Global Scroll Progress Bar
  if (DOM.scrollProgress) {
    gsap.to(DOM.scrollProgress, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        start: 0,
        end: 'max',
        scrub: true
      }
    });
  }

  // STEP 4: Hero Section Liquid Ink Showcase & Responsive Pin Controller
  // Why this code exists:
  // On desktop screens (min-width: 601px), pins '#heroPinWrapper' for 850px of dedicated scrub runway
  // while the liquid ink mask morphs from CAD sketch to photorealistic render.
  // On mobile view (max-width: 600px), pinning is completely removed ('pin: false' / unpinned)
  // so the viewport flows naturally without hijacking mobile scroll.
  // Tricky logic:
  // 'gsap.matchMedia()' automatically cleans up ScrollTriggers, resets pinned spacers,
  // and recalculates timeline scrub bounds when switching breakpoints or rotating mobile devices.
  // TODO: Add touch friction modulation for high-refresh 120Hz mobile displays.
  const responsiveMedia = gsap.matchMedia();

  // Desktop (min-width: 601px): Pinned Hero with 850px scrub runway
  responsiveMedia.add('(min-width: 601px)', () => {
    if (DOM.heroInkPath && DOM.heroPinWrapper) {
      const finalMaskPath = DOM.heroInkPath.dataset.valueFinal || 'M 0 1000 Q 500 1250 1000 1000 L 1000 0 L 0 0 Z';

      const heroPinTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: DOM.heroPinWrapper,
          start: 'top top',
          end: '+=850',
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      // Morph the SVG mask curve
      heroPinTimeline.fromTo(
        DOM.heroInkPath,
        { attr: { d: 'M 0 1 Q 500 2 1000 1 L 1000 0 L 0 0 Z' } },
        { attr: { d: finalMaskPath }, ease: 'none', duration: 1 },
        0
      );

      // Subtle depth parallax during the pin scrub
      heroPinTimeline.to(
        '.hero-ink-mask .ink-mask-img.main img',
        { scale: 1.03, opacity: 0.88, ease: 'none', duration: 1 },
        0
      );
      heroPinTimeline.to(
        '#building',
        { y: -15, ease: 'none', duration: 1 },
        0
      );
    }
  });

  // Mobile (max-width: 600px): Unpinned Hero — Natural scroll flow without viewport lock
  responsiveMedia.add('(max-width: 600px)', () => {
    if (DOM.heroInkPath && DOM.heroPinWrapper) {
      const finalMaskPath = DOM.heroInkPath.dataset.valueFinal || 'M 0 1000 Q 500 1250 1000 1000 L 1000 0 L 0 0 Z';

      const heroMobileTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: DOM.heroPinWrapper,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true
        }
      });

      heroMobileTimeline.fromTo(
        DOM.heroInkPath,
        { attr: { d: 'M 0 1 Q 500 2 1000 1 L 1000 0 L 0 0 Z' } },
        { attr: { d: finalMaskPath }, ease: 'none', duration: 1 },
        0
      );
    }
  });

  // STEP 3: Kinetic Word & Character Opacity Reveal
  if (DOM.wordReveals.length > 0) {
    DOM.wordReveals.forEach((el) => {
      const words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map((word) => {
        const chars = word.split('').map((char) => `<span class="char">${char}</span>`).join('');
        return `<span class="word">${chars}</span>`;
      }).join(' ');

      const chars = el.querySelectorAll('.char');
      gsap.fromTo(
        chars,
        { opacity: 0.1 },
        {
          opacity: 1,
          stagger: 0.035,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'bottom 45%',
            scrub: 0.9
          }
        }
      );
    });
  }

  // STEP 4: Calibrated Section Fade-Up Entrances
  // Master Threshold: All section entrance animations calibrated to 85vh (top 85% of viewport)
  // Master Action: 'play none none reverse' retracts smoothly when scrolling back up.

  // 1. Studio Manifesto Bottom Content
  if (DOM.studioBottom) {
    gsap.fromTo(
      DOM.studioBottom.children,
      { y: 35, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.05,
        stagger: 0.16,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: DOM.studioBottom,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // 2. Work Section Heading
  if (DOM.workHeading) {
    gsap.fromTo(
      DOM.workHeading.children,
      { y: 35, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.05,
        stagger: 0.18,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: DOM.workHeading,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // 3. Works Horizontal Scroll Pin & Responsive Stack
  // CRITICAL ARCHITECTURE RULE:
  // This pin MUST be instantiated before '.services' and '.approach' triggers below!
  // GSAP calculates pin-spacing offsets chronologically. Creating this pin first
  // ensures all subsequent trigger positions accurately reflect the 2000px+ horizontal scroll runway.
  responsiveMedia.add('(min-width: 601px)', () => {
    if (!DOM.workTrack) return;
    const calculateDistance = () => Math.max(0, DOM.workTrack.scrollWidth - window.innerWidth);

    gsap.to(DOM.workTrack, {
      x: () => -calculateDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: '.work',
        start: 'top top',
        end: () => `+=${calculateDistance() + 450}`,
        pin: true,
        scrub: 1.2,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (DOM.workProgressSpan) {
            gsap.set(DOM.workProgressSpan, { scaleX: self.progress });
          }
        }
      }
    });
  });

  responsiveMedia.add('(max-width: 600px)', () => {
    document.querySelectorAll('.project').forEach((el) => {
      gsap.fromTo(
        el,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  });

  // 4. Services Heading (Calculated accurately AFTER .work's pin spacer)
  if (DOM.servicesH2) {
    gsap.fromTo(
      DOM.servicesH2,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.05,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: DOM.servicesH2,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // 5. Services Section List: Progressive ScrollTrigger Open & Smooth Accordion
  // Why this code exists:
  // Automatically unfolds each service discipline smoothly as the user scrolls down (threshold 74vh),
  // creating a progressive editorial disclosure experience. Retracts smoothly when scrolling back up.
  // Tricky logic:
  // 1. Measuring scrollHeight: We dynamically measure the exact natural height of .service-body and
  //    animate height (0 -> targetHeight) with power2.out.
  // 2. Debounced ScrollTrigger refresh: Synchronous refresh during scrolling pauses the render loop
  //    and causes micro-stutters. Debouncing the refresh (250ms) ensures silky 60/120fps motion.
  // 3. Handles both automatic ScrollTrigger thresholds (start: 'top 74%') and manual click toggles.
  if (DOM.serviceList) {
    const serviceItems = DOM.serviceList.querySelectorAll('details');

    // Debounced ScrollTrigger refresh to prevent layout thrashing while scrolling
    let accordionRefreshTimer = null;
    function debouncedScrollTriggerRefresh() {
      clearTimeout(accordionRefreshTimer);
      accordionRefreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    }

    // Entrance fade-up for accordion items
    gsap.fromTo(
      serviceItems,
      { y: 35, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.95,
        stagger: 0.12,
        ease: 'power2.out',
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

      // If already open and not currently tweening closed, nothing to do
      if (item.open && !gsap.isTweening(body) && body.offsetHeight > 0) return;

      gsap.killTweensOf(body);

      // Open the container element in DOM if not open
      if (!item.open) {
        item.open = true;
        gsap.set(body, { height: 0, opacity: 0, overflow: 'hidden' });
      }

      // Measure full natural scroll height
      const targetHeight = body.scrollHeight;
      const startHeight = body.offsetHeight;
      const startOpacity = parseFloat(gsap.getProperty(body, 'opacity')) || 0;

      gsap.fromTo(
        body,
        { height: startHeight, opacity: startOpacity, overflow: 'hidden' },
        {
          height: targetHeight,
          opacity: 1,
          duration: 0.65,
          ease: 'power2.out',
          overwrite: 'auto',
          onComplete: () => {
            gsap.set(body, { height: 'auto', overflow: 'hidden' });
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

      gsap.killTweensOf(body);
      const currentHeight = body.offsetHeight;
      const currentOpacity = parseFloat(gsap.getProperty(body, 'opacity')) || 1;

      gsap.fromTo(
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
            gsap.set(body, { clearProps: 'height,opacity,overflow' });
            debouncedScrollTriggerRefresh();
          }
        }
      );
    }

    // Bind manual click toggles and automatic scroll opening
    serviceItems.forEach((item) => {
      const summary = item.querySelector('summary');
      if (summary) {
        summary.addEventListener('click', (e) => {
          e.preventDefault();
          if (item.open && !gsap.isTweening(item.querySelector('.service-body'))) {
            closeServiceItem(item);
          } else {
            openServiceItem(item);
          }
        });
      }

      ScrollTrigger.create({
        trigger: item,
        start: 'top 74%', // Triggers open smoothly when summary reaches 74% viewport height
        onEnter: () => openServiceItem(item),
        onLeaveBack: () => closeServiceItem(item)
      });
    });
  }

  // 6. Approach Heading
  if (DOM.approachHead) {
    const approachEyebrow = DOM.approachHead.querySelector('.eyebrow');
    const approachH2 = DOM.approachHead.querySelector('h2');

    if (approachEyebrow) {
      gsap.fromTo(
        approachEyebrow,
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: DOM.approachHead,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    if (approachH2) {
      gsap.fromTo(
        approachH2,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: DOM.approachHead,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }

  // 7. Contact Section Entrance
  if (DOM.contactSection) {
    const contactElements = [
      DOM.contactSection.querySelector('.section-tag'),
      DOM.contactSection.querySelector('.eyebrow'),
      DOM.contactSection.querySelector('h2'),
      DOM.contactSection.querySelector('.contact-bottom')
    ].filter(Boolean);

    gsap.fromTo(
      contactElements,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.05,
        stagger: 0.14,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: DOM.contactSection,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // STEP 3: Sticky Process Image Showcase Controller (4-Phase Architectural Methodology)
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
        gsap.to(img, {
          opacity: 1,
          scale: 1,
          filter: 'saturate(1) brightness(1)',
          duration: 0.9,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      } else {
        img.classList.remove('active');
        gsap.to(img, {
          opacity: 0,
          scale: 1.04,
          filter: 'saturate(0.65) brightness(0.92)',
          duration: 0.8,
          ease: 'power2.out',
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

  // STEP 4: Bind ScrollTriggers to each process step & synchronize image switches
  // Why this code exists:
  // Dynamically crossfades the pinned process visual imagery and updates chapter metadata
  // as the user scrolls each methodology phase into and out of the active reading zone.
  // Tricky logic:
  // 1. 'start: top 55%' triggers on forward scroll when the step enters below the pinned visual.
  // 2. 'onEnterBack' re-activates phase 'i' when scrolling upward from a later phase.
  // 3. 'onLeaveBack' drops back to 'Math.max(0, i - 1)' when the step scrolls back below the threshold,
  //    guaranteeing bidirectional synchronization without stuck or skipped phases.
  // TODO: Add micro-haptic pulse on mobile devices when phase index changes.
  DOM.processSteps.forEach((step, i) => {
    gsap.from(step, {
      opacity: 0.25,
      y: 35,
      scrollTrigger: {
        trigger: step,
        start: 'top 85%',
        end: 'top 45%',
        scrub: 1
      }
    });

    ScrollTrigger.create({
      trigger: step,
      start: 'top 55%',
      end: 'bottom 55%',
      onEnter: () => switchProcessImage(i),
      onEnterBack: () => switchProcessImage(i),
      onLeaveBack: () => switchProcessImage(Math.max(0, i - 1))
    });
  });

  // STEP 4: Centered Footer Liquid Ink Displacement Mask
  if (DOM.footerWord && DOM.footerInkCircle) {
    gsap.fromTo(
      DOM.footerInkCircle,
      { attr: { r: 0, cx: 500, cy: 110 } },
      {
        attr: { r: 720 },
        ease: 'power2.out',
        scrollTrigger: {
          trigger: DOM.footerWordFallback || DOM.footerWord,
          start: 'top 80%', // Threshold: 80vh of viewport
          end: 'bottom 45%',
          scrub: 1.2, // Silk-smooth retraction and expansion
          invalidateOnRefresh: true
        }
      }
    );

    // Dynamic pointer tracking and ripple pulses
    let lastRippleTimestamp = 0;

    const triggerPointerInk = (clientX, clientY) => {
      const rect = DOM.footerWord.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const svgX = Math.max(0, Math.min(1000, ((clientX - rect.left) / rect.width) * 1000));
      const svgY = Math.max(0, Math.min(220, ((clientY - rect.top) / rect.height) * 220));

      // Drift main circle center towards cursor
      gsap.to(DOM.footerInkCircle, {
        attr: { cx: svgX, cy: svgY },
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto'
      });

      // Expanding ripple pulse
      if (DOM.footerInkPulse) {
        gsap.killTweensOf(DOM.footerInkPulse);
        gsap.fromTo(
          DOM.footerInkPulse,
          { attr: { cx: svgX, cy: svgY, r: 15 }, opacity: 0.85 },
          {
            attr: { r: 340 },
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
      if (now - lastRippleTimestamp > 75) {
        lastRippleTimestamp = now;
        triggerPointerInk(e.clientX, e.clientY);
      }
    });

    DOM.footerWord.addEventListener('pointerdown', (e) => triggerPointerInk(e.clientX, e.clientY));
  }

  // STEP 5: Asset Load & Font-Ready Recalibration
  document.querySelectorAll('img').forEach((img) => {
    if (img.complete) return;
    img.addEventListener('load', () => ScrollTrigger.refresh());
  });

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
}
