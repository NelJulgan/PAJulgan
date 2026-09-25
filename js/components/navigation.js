/**
 * ============================================================================
 * 1st — Foundation Code: Navigation & Anchor Smooth Scrolling
 * File: js/components/navigation.js
 * ============================================================================
 */

import { DOM } from '../core/dom.js';
import { getLenis } from '../core/lenis.js';

// STEP 2: Mobile Navigation Controller & Accessible Internal Anchor Links
// Why this code exists:
// Consolidates mobile menu toggle, full-screen overlay state, keyboard escape dismissal,
// and accessible anchor link routing into a single unified controller.
// Tricky logic:
// When the 100vh mobile navigation opens, we apply 'nav-open' to document.body and temporarily
// pause Lenis ('lenis.stop()') to prevent background scrolling and double scrollbars.
// Upon closing, Lenis is safely restarted if no modal dialogs remain active.
// TODO: Consider trapping tab focus within nav when open on mobile for enhanced screen-reader flow.
export function closeMenu() {
  if (!DOM.nav || !DOM.menuButton) return;
  DOM.nav.classList.remove('open');
  document.body.classList.remove('nav-open');
  DOM.menuButton.setAttribute('aria-expanded', 'false');

  const lenis = getLenis();
  if (lenis && !document.querySelector('dialog[open]')) {
    lenis.start();
  }
}

export function initNavigation() {
  if (DOM.menuButton && DOM.nav) {
    DOM.menuButton.addEventListener('click', () => {
      const isOpen = DOM.nav.classList.toggle('open');
      document.body.classList.toggle('nav-open', isOpen);
      DOM.menuButton.setAttribute('aria-expanded', String(isOpen));

      const lenis = getLenis();
      if (lenis) {
        if (isOpen) {
          lenis.stop();
        } else if (!document.querySelector('dialog[open]')) {
          lenis.start();
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // Unified Internal Anchor Link Smooth Scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();
      closeMenu();

      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(targetElement, {
          offset: -40,
          duration: 1.35,
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
}
