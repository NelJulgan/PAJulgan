/**
 * ============================================================================
 * PAJULGAN — Architecture & Engineering
 * Professional Motion Architecture & Cinematic Interactive Movement
 * File: js/modules/animations.js
 * ============================================================================
 *
 * Senior Mentorship Architecture Sequence:
 *
 * 1st — Foundation Code
 * - Centralized Motion Timing configuration & GSAP plugin registration.
 * - Global scroll progress bar indicator.
 * - Dynamic velocity-scaled animation durations.
 *
 * 2nd — Core Functionality
 * - Architectural split-line heading reveals with 3D rotational tilt.
 * - Kinetic word & character opacity reveal in Studio.
 * - Progressive service accordion disclosure with debounced refresh.
 * - Sticky 4-phase architectural process crossfade.
 *
 * 3rd — Enhancement, Animation & Optimization
 * - Hero Holographic Drafting Table Parallax (multi-plane depth across CAD elements).
 * - Selected Works 3D Card Aperture Parallax (horizontal track counter-pan + scale).
 * - Floating Architectural Section Tags (differential vertical velocity).
 * - Centered Footer Liquid Ink Displacement Mask & Pointer Attraction physics.
 * - Debounced asset load & font-ready recalibration.
 */

import { DOM } from '../core/dom.js';
import { MOTION_TIMING, splitLineReveal, physicsEngine } from '../core/motion.js';

export function initAnimations() {
  if (typeof window === 'undefined' || !window.gsap || !window.ScrollTrigger) return;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  // ============================================================================
  // 1st — Foundation Code: Engine Initialization & Throttles
  // ============================================================================

  // STEP 1: Register GSAP plugins & configure frame sync
  document.body.classList.add('motion-ready');
  gsap.registerPlugin(ScrollTrigger);

  // Why this code exists:
  // Throttling ScrollTrigger synchronization to 100ms decouples scroll calculation bursts
  // from layout rendering, preventing micro-stutters and sustaining 60-120 FPS.
  ScrollTrigger.config({
    limitCallbacks: true,
    syncInterval: 100
  });

  gsap.defaults({
    ease: 'power3.out',
    duration: MOTION_TIMING.durations.base
  });

  // STEP 2: Global Viewport Scroll Progress Bar
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

  const responsiveMedia = gsap.matchMedia();

  // ============================================================================
  // 2nd — Core Functionality: Typographic & Section Reveals
  // ============================================================================

  // STEP 1: Connect Architectural Split-Line Heading Reveals
  // Headings emerge line-by-line from hardware-accelerated clipping planes with 3D tilt.
  if (DOM.workHeading?.querySelector('h2')) {
    splitLineReveal(DOM.workHeading.querySelector('h2'), 'top 85%');
  }
  if (DOM.servicesH2) {
    splitLineReveal(DOM.servicesH2, 'top 85%');
  }
  if (DOM.approachHead?.querySelector('h2')) {
    splitLineReveal(DOM.approachHead.querySelector('h2'), 'top 85%');
  }
  if (DOM.contactSection?.querySelector('h2')) {
    splitLineReveal(DOM.contactSection.querySelector('h2'), 'top 85%');
  }

  // STEP 2: Kinetic Word & Character Opacity Reveal in Studio
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
      gsap.fromTo(
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

  // STEP 3: Studio Bottom Content Staggered Entrance
  if (DOM.studioBottom) {
    gsap.fromTo(
      DOM.studioBottom.children,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: MOTION_TIMING.durations.extended,
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

  // STEP 4: Selected Works Heading Aside Entrance
  if (DOM.workHeading) {
    const headingAside = DOM.workHeading.querySelector('.work-aside');
    if (headingAside) {
      gsap.fromTo(
        headingAside,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: MOTION_TIMING.durations.base,
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

  // STEP 5: Progressive Services Accordions Disclosure
  if (DOM.serviceList) {
    const serviceItems = DOM.serviceList.querySelectorAll('details');

    let accordionRefreshTimer = null;
    function debouncedScrollTriggerRefresh() {
      clearTimeout(accordionRefreshTimer);
      accordionRefreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    }

    gsap.fromTo(
      serviceItems,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: MOTION_TIMING.durations.base,
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

      if (item.open && !gsap.isTweening(body) && body.offsetHeight > 0) return;

      gsap.killTweensOf(body);
      if (!item.open) {
        item.open = true;
        gsap.set(body, { height: 0, opacity: 0, overflow: 'hidden' });
      }

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
          ease: 'power3.out',
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

      // Automatic ScrollTrigger unfolding restricted strictly to Desktop
      responsiveMedia.add('(min-width: 601px)', () => {
        ScrollTrigger.create({
          trigger: item,
          start: 'top 74%',
          onEnter: () => openServiceItem(item),
          onLeaveBack: () => closeServiceItem(item)
        });
      });
    });
  }

  // STEP 6: Approach Heading Eyebrow Entrance
  if (DOM.approachHead?.querySelector('.eyebrow')) {
    gsap.fromTo(
      DOM.approachHead.querySelector('.eyebrow'),
      { y: 25, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: MOTION_TIMING.durations.base,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: DOM.approachHead,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // STEP 7: Contact Section Entrance
  if (DOM.contactSection) {
    const contactTag = DOM.contactSection.querySelector('.section-tag');
    const contactEyebrow = DOM.contactSection.querySelector('.eyebrow');
    const contactBottom = DOM.contactSection.querySelector('.contact-bottom');

    if (contactTag) {
      gsap.fromTo(
        contactTag,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: MOTION_TIMING.durations.base,
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
      gsap.fromTo(
        contactEyebrow,
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: MOTION_TIMING.durations.base,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: DOM.contactSection,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    if (contactBottom) {
      gsap.fromTo(
        contactBottom.children,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: MOTION_TIMING.durations.extended,
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

  // ============================================================================
  // 3rd — Enhancement, Animation & Optimization: Unrestricted Parallax & 3D Depth
  // ============================================================================

  // STEP 1: Hero Holographic Drafting Table Parallax (Desktop)
  responsiveMedia.add('(min-width: 601px)', () => {
    if (DOM.heroInkPath && DOM.heroPinWrapper) {
      const finalMaskPath = DOM.heroInkPath.dataset.valueFinal || 'M 0 1000 Q 500 1250 1000 1000 L 1000 0 L 0 0 Z';

      const heroPinTimeline = gsap.timeline({
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

      // Layer 1: Liquid SVG mask morphing
      heroPinTimeline.fromTo(
        DOM.heroInkPath,
        { attr: { d: 'M 0 1 Q 500 2 1000 1 L 1000 0 L 0 0 Z' } },
        { attr: { d: finalMaskPath }, ease: 'none', duration: 1 },
        0
      );

      // Layer 2: Midground Building scale & vertical float
      heroPinTimeline.to('#building', { y: -30, scale: 1.03, ease: 'none', duration: 1 }, 0);

      // Layer 3: Background drafting metadata drift
      if (DOM.drawingTop) heroPinTimeline.to(DOM.drawingTop, { y: -20, opacity: 0.7, ease: 'none', duration: 1 }, 0);
      if (DOM.drawingBottom) heroPinTimeline.to(DOM.drawingBottom, { y: 20, opacity: 0.7, ease: 'none', duration: 1 }, 0);
      if (DOM.drawingLabel) heroPinTimeline.to(DOM.drawingLabel, { y: -40, ease: 'none', duration: 1 }, 0);

      // Layer 4: Foreground Hero Copy upward drift
      if (DOM.heroCopy) heroPinTimeline.to(DOM.heroCopy, { y: -50, opacity: 0.85, ease: 'none', duration: 1 }, 0);
    }
  });

  // Mobile Hero: Natural fluid scrub without viewport lock or touch lag
  responsiveMedia.add('(max-width: 600px)', () => {
    if (DOM.heroInkPath && DOM.heroPinWrapper) {
      const finalMaskPath = DOM.heroInkPath.dataset.valueFinal || 'M 0 1000 Q 500 1250 1000 1000 L 1000 0 L 0 0 Z';

      gsap.fromTo(
        DOM.heroInkPath,
        { attr: { d: 'M 0 1 Q 500 2 1000 1 L 1000 0 L 0 0 Z' } },
        {
          attr: { d: finalMaskPath },
          ease: 'none',
          scrollTrigger: {
            trigger: DOM.heroPinWrapper,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.85,
            invalidateOnRefresh: true
          }
        }
      );
    }
  });

  // STEP 2: Selected Works 3D Card Aperture Parallax (Desktop & Mobile)
  responsiveMedia.add('(min-width: 601px)', () => {
    if (!DOM.workTrack) return;
    const calculateDistance = () => Math.max(0, DOM.workTrack.scrollWidth - window.innerWidth);

    // Track horizontal translation
    gsap.to(DOM.workTrack, {
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
          if (DOM.workProgressSpan) gsap.set(DOM.workProgressSpan, { scaleX: self.progress });
        }
      }
    });

    // Internal 3D image aperture parallax for each project card
    document.querySelectorAll('.project').forEach((card) => {
      const cardImg = card.querySelector('.project-image img');
      if (cardImg) {
        gsap.fromTo(
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

  // Mobile: Lightweight vertical card entrance with feather-light internal parallax
  responsiveMedia.add('(max-width: 600px)', () => {
    document.querySelectorAll('.project').forEach((el) => {
      gsap.fromTo(
        el,
        { y: 35, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.75,
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
        gsap.fromTo(
          cardImg,
          { yPercent: -6, scale: 1.08 },
          {
            yPercent: 6,
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

  // STEP 3: Floating Architectural Section Tags Parallax
  responsiveMedia.add('(min-width: 601px)', () => {
    if (DOM.sectionTags && DOM.sectionTags.length > 0) {
      DOM.sectionTags.forEach((tag) => {
        const parentSection = tag.closest('.section') || tag.parentElement;
        if (!parentSection) return;

        gsap.fromTo(
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

  // STEP 4: Sticky Process Image Showcase Controller (4-Phase Methodology)
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
          duration: 0.65,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      } else {
        img.classList.remove('active');
        gsap.to(img, {
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
    gsap.from(step, {
      opacity: 0.25,
      y: 40,
      scrollTrigger: {
        trigger: step,
        start: 'top 85%',
        end: 'top 45%',
        scrub: 0.9
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

  // STEP 5: Centered Footer Liquid Ink Displacement Mask & Pointer Attraction
  if (DOM.footerWord && DOM.footerInkCircle) {
    gsap.fromTo(
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

      gsap.to(DOM.footerInkCircle, {
        attr: { cx: svgX, cy: svgY },
        duration: 0.6,
        ease: 'power3.out',
        overwrite: 'auto'
      });

      if (DOM.footerInkPulse) {
        gsap.killTweensOf(DOM.footerInkPulse);
        gsap.fromTo(
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

  // STEP 6: Asset Load & Font-Ready Recalibration
  let imageRefreshTimer = null;
  const debouncedGlobalRefresh = () => {
    clearTimeout(imageRefreshTimer);
    imageRefreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
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
