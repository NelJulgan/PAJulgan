/**
 * ============================================================================
 * 3rd — Enhancement, Animation & Optimization: GSAP & ScrollTrigger Suite
 * File: js/modules/animations.js
 * ============================================================================
 *
 * Senior Mentorship Note:
 * For animation projects, always follow this coding order:
 * 1st: Build the HTML structure (Sections, pinned wrappers, drawing containers)
 * 2nd: Build the CSS foundation (Positioning, perspective, transforms, responsive behavior)
 * 3rd: Add JavaScript functionality (Select elements, register plugins, create timelines)
 * 4th: Add ScrollTrigger behavior (Pin sections, connect scrub, calibrate thresholds)
 * 5th: Add advanced effects (Morphing SVG masks, pointer displacement ripples, Lenis integration)
 */

import { DOM } from '../core/dom.js';

export function initAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  document.body.classList.add('motion-ready');
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out', duration: 1 });

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
          scrub: 1,
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
  // Why this code exists:
  // Splits editorial headings into words and characters, starting them at faint ghosted opacity (0.1)
  // and lighting them up to solid opacity (1.0) as the user scrolls into view.
  if (DOM.wordReveals && DOM.wordReveals.length > 0) {
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
          stagger: 0.04,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'bottom 45%',
            scrub: 1
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
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
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

  // 2. Work Section Heading
  if (DOM.workHeading) {
    gsap.fromTo(
      DOM.workHeading.children,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.95,
        stagger: 0.18,
        ease: 'power3.out',
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
        scrub: 1,
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
          ease: 'power3.out',
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
      { y: 45, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.95,
        ease: 'power3.out',
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
  // Automatically unfolds each service discipline as the user scrolls down (threshold 72vh),
  // creating a progressive editorial disclosure experience. Retracts smoothly when scrolling back up.
  // Tricky logic:
  // 1. Animates .service-body height (0 -> auto) and opacity (0 -> 1) via GSAP with power2.out.
  // 2. Dynamic height expansion shifts layout positions. Calling ScrollTrigger.refresh() on complete
  //    keeps approach, contact, and footer triggers accurately calibrated.
  if (DOM.serviceList) {
    const serviceItems = DOM.serviceList.querySelectorAll('details');

    // Entrance fade-up for accordion items
    gsap.fromTo(
      serviceItems,
      { y: 35, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.85,
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
      if (item.open) return;
      const body = item.querySelector('.service-body');
      item.open = true;

      if (body) {
        gsap.killTweensOf(body);
        gsap.fromTo(
          body,
          { height: 0, opacity: 0, paddingBottom: 0, overflow: 'hidden' },
          {
            height: 'auto',
            opacity: 1,
            paddingBottom: 27,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto',
            onComplete: () => ScrollTrigger.refresh()
          }
        );
      } else {
        ScrollTrigger.refresh();
      }
    }

    function closeServiceItem(item) {
      if (!item.open) return;
      const body = item.querySelector('.service-body');

      if (body) {
        gsap.killTweensOf(body);
        gsap.to(body, {
          height: 0,
          opacity: 0,
          paddingBottom: 0,
          duration: 0.38,
          ease: 'power2.inOut',
          overwrite: 'auto',
          onComplete: () => {
            item.open = false;
            gsap.set(body, { clearProps: 'height,opacity,paddingBottom,overflow' });
            ScrollTrigger.refresh();
          }
        });
      } else {
        item.open = false;
        ScrollTrigger.refresh();
      }
    }

    // Bind manual click toggles and automatic scroll opening
    serviceItems.forEach((item) => {
      const summary = item.querySelector('summary');
      if (summary) {
        summary.addEventListener('click', (e) => {
          e.preventDefault();
          if (item.open) {
            closeServiceItem(item);
          } else {
            openServiceItem(item);
          }
        });
      }

      ScrollTrigger.create({
        trigger: item,
        start: 'top 72%', // Triggers open when summary reaches 72% viewport height
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
          duration: 0.8,
          ease: 'power3.out',
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
        { y: 45, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.95,
          ease: 'power3.out',
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
      { y: 45, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.95,
        stagger: 0.14,
        ease: 'power3.out',
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
          duration: 0.85,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      } else {
        img.classList.remove('active');
        gsap.to(img, {
          opacity: 0,
          scale: 1.04,
          filter: 'saturate(0.65) brightness(0.92)',
          duration: 0.75,
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
  if (DOM.processSteps && DOM.processSteps.length > 0) {
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
  }

  // STEP 4: Centered Footer Liquid Ink Displacement Mask
  // Why this code exists:
  // Creates an organic ink-filter circle mask animation on the centered footer word 'P JULGAN'.
  // Tricky logic:
  // 1. Dual-circle SVG mask: The primary circle expands on scroll to reveal the solid ink typography,
  //    while the secondary pulse circle triggers dynamic organic liquid ripples at pointer coordinates.
  // 2. Coordinates from clientX/clientY are projected into the SVG viewBox (0..1000 x 0..220).
  // 3. ScrollTrigger scrub: Smooth bi-directional scrub (starts at 80vh, retracts to r:0 on scroll-up).
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
          scrub: 1, // Scrubs forward on scroll-down, retracts on scroll-up
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
  // Recalculates ScrollTrigger layout coordinates after images and web fonts load.
  document.querySelectorAll('img').forEach((img) => {
    if (img.complete) return;
    img.addEventListener('load', () => ScrollTrigger.refresh());
  });

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
}
