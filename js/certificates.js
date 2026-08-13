/**
 * certificates.js — Certificate data store and DOM rendering for the Certificates section.
 *
 * Exported values / functions:
 *   certificatesData               — Array of CertificateObjects (initially empty for first deploy).
 *   formatCertDate(dateStr)        — Pure helper. Converts "YYYY-MM" → "MMM YYYY" (e.g. "Jun 2024").
 *   renderCertificateCardHTML(cert) — Pure function returning an HTML string for one card.
 *   renderCertificates(data)       — Renders all cards (or empty state) into #certificates-grid.
 *
 * CertificateObject schema:
 *   {
 *     id: string,            // unique slug
 *     name: string,          // max 120 chars
 *     organization: string,  // max 80 chars
 *     date: string,          // "YYYY-MM" format — rendered as "MMM YYYY"
 *     imageUrl: string,      // path to thumbnail (displayed at aspect-ratio 4/3)
 *     viewUrl: string,       // absolute URL to original certificate (empty string = disabled)
 *     credentialId?: string, // optional credential ID, max 100 chars
 *   }
 *
 * To add a certificate: push a CertificateObject into certificatesData below.
 * The page will render the new card on the next load — no HTML changes required.
 *
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 15.4
 */

// ── Data ──────────────────────────────────────────────────────────────────────

/**
 * Initial deployment value is an empty array (Req 15.4).
 * Add CertificateObjects here to populate the Certificates section.
 *
 * @type {Array<{
 *   id: string,
 *   name: string,
 *   organization: string,
 *   date: string,
 *   imageUrl: string,
 *   viewUrl: string,
 *   credentialId?: string
 * }>}
 */
export const certificatesData = [];

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Format a "YYYY-MM" date string into a human-readable "MMM YYYY" string.
 *
 * Examples:
 *   formatCertDate("2024-06") → "Jun 2024"
 *   formatCertDate("2023-01") → "Jan 2023"
 *
 * Returns the original string unchanged if it does not match the expected format.
 *
 * @param {string} dateStr - Date string in "YYYY-MM" format.
 * @returns {string} Formatted date string, e.g. "Jun 2024".
 */
export function formatCertDate(dateStr) {
  if (!dateStr || !/^\d{4}-\d{2}$/.test(dateStr)) {
    return dateStr || '';
  }

  const [year, month] = dateStr.split('-');
  const monthIndex = parseInt(month, 10) - 1;

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const monthName = monthNames[monthIndex];
  if (!monthName) return dateStr;

  return `${monthName} ${year}`;
}

// ── Rendering ─────────────────────────────────────────────────────────────────

/**
 * Build the HTML string for a single certificate card.
 *
 * Pure function — performs no DOM reads or writes. Suitable for unit and
 * property-based testing in isolation.
 *
 * @param {{
 *   id: string,
 *   name: string,
 *   organization: string,
 *   date: string,
 *   imageUrl: string,
 *   viewUrl: string,
 *   credentialId?: string
 * }} cert - A CertificateObject.
 * @returns {string} HTML markup for one certificate card.
 */
export function renderCertificateCardHTML(cert) {
  const formattedDate = formatCertDate(cert.date);

  // ── Image section (Req 11.7) ──────────────────────────────────────────────
  // Shows the image with lazy loading; onerror hides the img and reveals the
  // styled placeholder div (.certificate-img-placeholder) in its place.
  const imageSection = cert.imageUrl
    ? `<div class="certificate-card-image">
        <img
          src="${escapeAttr(cert.imageUrl)}"
          alt="Certificate thumbnail for ${escapeAttr(cert.name)}"
          loading="lazy"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
        />
        <div class="certificate-img-placeholder" style="display:none;" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round" aria-hidden="true">
            <rect width="18" height="18" x="3" y="3" rx="2"/>
            <path d="M3 9h18M9 21V9"/>
          </svg>
        </div>
      </div>`
    : `<div class="certificate-card-image">
        <div class="certificate-img-placeholder" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round" aria-hidden="true">
            <rect width="18" height="18" x="3" y="3" rx="2"/>
            <path d="M3 9h18M9 21V9"/>
          </svg>
        </div>
      </div>`;

  // ── Optional credential ID row (Req 11.3) ─────────────────────────────────
  const credentialRow = cert.credentialId
    ? `<p class="certificate-credential">
        <span>Credential ID: ${escapeHtml(cert.credentialId)}</span>
      </p>`
    : '';

  // ── "View Certificate" button (Req 11.6) ──────────────────────────────────
  // Renders as an anchor with target="_blank" when viewUrl is set.
  // Renders as a disabled button when viewUrl is empty.
  const viewButton = cert.viewUrl
    ? `<a
        href="${escapeAttr(cert.viewUrl)}"
        target="_blank"
        rel="noopener noreferrer"
        class="btn-primary"
        aria-label="View certificate: ${escapeAttr(cert.name)}"
      >
        View Certificate
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round" aria-hidden="true">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </a>`
    : `<button class="btn-primary" disabled aria-disabled="true">
        View Certificate
      </button>`;

  return `<article class="certificate-card" data-cert-id="${escapeAttr(cert.id)}">
    ${imageSection}
    <div class="certificate-card-body">
      <h3 class="certificate-name">${escapeHtml(cert.name)}</h3>
      <p class="certificate-org">${escapeHtml(cert.organization)}</p>
      <p class="certificate-date">${escapeHtml(formattedDate)}</p>
      ${credentialRow}
      <div class="certificate-actions">
        ${viewButton}
      </div>
    </div>
  </article>`;
}

/**
 * Render the certificates section into the #certificates-grid container.
 *
 * - When data contains one or more entries: renders one .certificate-card per
 *   entry, preserving the order of the array (Req 11.2).
 * - When data is empty: renders the .certificates-empty-state message; no
 *   .certificate-card elements are rendered (Req 11.5).
 *
 * Accepts an optional data parameter so tests can pass arbitrary arrays without
 * relying on or mutating the module-level certificatesData.
 *
 * @param {Array} [data=certificatesData] - Array of CertificateObjects to render.
 * @returns {void}
 */
export function renderCertificates(data = certificatesData) {
  const container = document.getElementById('certificates-grid');
  if (!container) {
    console.warn('[certificates] #certificates-grid not found in DOM.');
    return;
  }

  // ── Empty state (Req 11.5) ────────────────────────────────────────────────
  if (!data || data.length === 0) {
    container.innerHTML = `
      <div class="certificates-empty-state">
        <div style="margin-bottom:1rem;" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="8" r="6"/>
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
          </svg>
        </div>
        <p>Certificates will be added soon.</p>
      </div>`;
    return;
  }

  // ── Render one card per certificate (Req 11.2) ────────────────────────────
  container.innerHTML = data.map(renderCertificateCardHTML).join('');
}

// ── Private utilities ─────────────────────────────────────────────────────────

/**
 * Escape a string for safe insertion as HTML text content (innerHTML).
 * Prevents XSS when certificate data fields are injected into the DOM.
 *
 * @param {string} str - Raw string value.
 * @returns {string} HTML-escaped string.
 */
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Escape a string for safe insertion into an HTML attribute value (double-quoted).
 *
 * @param {string} str - Raw string value.
 * @returns {string} Attribute-safe escaped string.
 */
function escapeAttr(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
