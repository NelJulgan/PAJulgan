/**
 * ============================================================================
 * 2nd — Core Functionality: Accessible Modal Dialogs Controller
 * File: js/components/dialogs.js
 * ============================================================================
 *
 * Senior Mentorship Note:
 * // STEP 2: Accessible Modal Dialogs Controller
 * Why this code exists:
 * Manages modal state using HTML5 native `<dialog>` elements for full accessibility.
 *
 * Tricky logic:
 * When opening native HTML5 <dialog> modally, Lenis momentum scroll must be temporarily
 * paused (`lenis.stop()`) so background mousewheel/touch events do not scroll the page behind
 * the backdrop, and restored (`lenis.start()`) upon dismissal.
 */

import { DOM } from '../core/dom.js';
import { getLenis } from '../core/lenis.js';

export const projectData = [
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

export function openModal(dialogElement) {
  if (!dialogElement) return;
  dialogElement.showModal();
  const lenis = getLenis();
  if (lenis) lenis.stop();
}

export function closeModal(dialogElement) {
  if (!dialogElement) return;
  dialogElement.close();
  if (!document.querySelector('dialog[open]')) {
    const lenis = getLenis();
    if (lenis) lenis.start();
  }
}

export function initDialogs() {
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

  // Close listeners for all dialog elements (close buttons, backdrop clicks, escape key)
  document.querySelectorAll('dialog').forEach((dialog) => {
    const closeBtn = dialog.querySelector('.dialog-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(dialog));
    }

    dialog.addEventListener('close', () => {
      if (!document.querySelector('dialog[open]')) {
        const lenis = getLenis();
        if (lenis) lenis.start();
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
}
