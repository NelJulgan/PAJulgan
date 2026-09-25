/**
 * ============================================================================
 * 2nd — Core Functionality: Project Brief Export Controller
 * File: js/components/brief.js
 * ============================================================================
 *
 * Senior Mentorship Note:
 * // STEP 2: Project Brief Export Controller
 * Why this code exists:
 * In accordance with privacy and architectural concept guidelines, user project briefs
 * are formatted and downloaded as a clean `.txt` document directly in the client's browser
 * without requiring external server dependencies, cookies, or telemetry tracking.
 */

import { DOM } from '../core/dom.js';

export function initBrief() {
  if (!DOM.briefForm) return;

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
