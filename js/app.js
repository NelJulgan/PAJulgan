/**
 * ============================================================================
 * PAJULGAN — Architecture & Engineering
 * Master Application Bootstrap (Zero-Build Modular Architecture)
 * File: js/app.js
 * ============================================================================
 *
 * Senior Mentorship Architecture Sequence:
 *
 * 1st — Foundation Code
 * - Centralized DOM querying & element caching (core/dom.js)
 * - Lenis momentum scrolling engine initialization & ticker binding (core/lenis.js)
 * - Mobile navigation & accessible anchor scrolling (components/navigation.js)
 *
 * 2nd — Core Functionality
 * - Preloader arrival sequence (modules/intro.js)
 * - Accessible native <dialog> modals for projects and briefs (components/dialogs.js)
 * - Client-side architectural brief export (components/brief.js)
 *
 * 3rd — Enhancement, Animation & Optimization
 * - Hero pinned liquid ink showcase (0..850px scrub runway)
 * - Kinetic word & character opacity reveal
 * - Calibrated section fade-up entrances (85vh threshold)
 * - Pinned horizontal works gallery (desktop) & vertical stack (mobile)
 * - Progressive service accordion disclosure (72vh threshold)
 * - Sticky 4-phase architectural process crossfade
 * - Centered footer liquid ink displacement mask & ripple
 * - Asset load & font-ready recalibration
 * ============================================================================
 */

import { initLenis } from './core/lenis.js';
import { initNavigation } from './components/navigation.js';
import { initIntro } from './modules/intro.js';
import { initDialogs } from './components/dialogs.js';
import { initBrief } from './components/brief.js';
import { initAnimations } from './modules/animations.js';

function bootstrap() {
  // 1st — Foundation Code
  initLenis();
  initNavigation();

  // 2nd — Core Functionality
  initIntro();
  initDialogs();
  initBrief();

  // 3rd — Enhancement, Animation & Optimization
  initAnimations();
}

// Execute bootstrap when DOM is interactive
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

export { bootstrap };
