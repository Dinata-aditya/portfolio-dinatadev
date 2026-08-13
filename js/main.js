/**
 * main.js — ES Module entry point for the DinataDev portfolio static site.
 *
 * Responsibilities:
 *   1. Define and export the site-wide `config` object (URLs, contact info).
 *   2. Import and initialise all feature modules (navigation, projects,
 *      certificates, contact form) inside isolated try/catch blocks so that
 *      a failure in one module never prevents the others from loading.
 *   3. Export `populateLinks(config)` — walks every anchor tagged with a
 *      `[data-config-link]` attribute and sets its `href` value from config.
 *
 * To update site URLs or contact details, edit the `config` object below.
 * No other files need to change.
 *
 * Requirements: 1.6, 1.7, 15.1, 15.2, 15.5, 15.6, 17.6, 21.8
 */

import { initNavigation }    from './navigation.js';
import { renderProjects }    from './projects.js';
import { renderCertificates } from './certificates.js';
import { initContactForm }   from './contact.js';

// ── Site-wide configuration ───────────────────────────────────────────────────

/**
 * Central config object.  All 9 properties are required; use an empty string
 * for URLs that are not yet active (the corresponding links will be hidden or
 * left as "#" by populateLinks).
 *
 * @type {{
 *   whatsappNumber: string,
 *   email: string,
 *   githubUrl: string,
 *   linkedinUrl: string,
 *   dribbbleUrl: string,
 *   fiverrUrl: string,
 *   upworkUrl: string,
 *   instagramUrl: string,
 *   tiktokUrl: string,
 * }}
 */
export const config = {
  whatsappNumber: '62812345678',   // digits only, no "+" prefix
  email: 'aditya@example.com',
  githubUrl: 'https://github.com/dinatadev',
  linkedinUrl: 'https://linkedin.com/in/dinatadev',
  dribbbleUrl: 'https://dribbble.com/dinatadev',
  fiverrUrl: 'https://fiverr.com/dinatadev',
  upworkUrl: 'https://upwork.com/freelancers/dinatadev',
  instagramUrl: 'https://instagram.com/dinatadev',
  tiktokUrl: '',
};

// ── Link population ───────────────────────────────────────────────────────────

/**
 * Populate all `[data-config-link]` anchor elements with their corresponding
 * `href` values from the config object.
 *
 * How it works:
 *  - Each anchor that should receive a config URL carries a `data-config-link`
 *    attribute whose value is a key in the config object (e.g. "githubUrl").
 *  - If `data-config-type="mailto"` is also present the href is prefixed with
 *    "mailto:".
 *  - If the config value for a key is an empty string the anchor's href is
 *    left as "#" so it degrades gracefully (no broken external link).
 *  - The WhatsApp CTA button (#whatsapp-cta) is handled separately by
 *    initContactForm; this function does not need to touch it.
 *
 * @param {{ [key: string]: string }} cfg - The site config object.
 * @returns {void}
 */
export function populateLinks(cfg) {
  const anchors = document.querySelectorAll('[data-config-link]');

  anchors.forEach((anchor) => {
    const key      = anchor.getAttribute('data-config-link');
    const type     = anchor.getAttribute('data-config-type');
    const rawValue = cfg[key];

    // Skip if the config key is missing or the value is empty
    if (!rawValue) return;

    if (type === 'mailto') {
      anchor.href = `mailto:${rawValue}`;
    } else {
      anchor.href = rawValue;
    }
  });
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────

/**
 * Wire up all modules once the DOM is fully parsed.
 * Each module is initialised inside its own try/catch so that an error in one
 * module does not prevent the others from running (Req 21.8).
 */
document.addEventListener('DOMContentLoaded', () => {
  try { initNavigation();        } catch (e) { console.error('[navigation]',    e); }
  try { renderProjects(config);  } catch (e) { console.error('[projects]',      e); }
  try { renderCertificates();    } catch (e) { console.error('[certificates]',  e); }
  try { initContactForm(config); } catch (e) { console.error('[contact]',       e); }
  try { populateLinks(config);   } catch (e) { console.error('[links]',         e); }
});
