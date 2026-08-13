/**
 * links.js — Script untuk halaman links.html
 * Mengisi semua href dari config dan merender project cards.
 */

import { config } from './main.js';
import { projectsData } from './projects.js';

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Isi semua link dari config ────────────────────────────────
  const wa = document.getElementById('lnk-wa');
  if (wa && config.whatsappNumber) {
    wa.href = `https://wa.me/${config.whatsappNumber}`;
  }

  const email = document.getElementById('lnk-email');
  const emailSub = document.getElementById('lnk-email-sub');
  if (email && config.email) {
    email.href = `mailto:${config.email}`;
    if (emailSub) emailSub.textContent = config.email;
  }

  const fiverr = document.getElementById('lnk-fiverr');
  if (fiverr && config.fiverrUrl) fiverr.href = config.fiverrUrl;
  else if (fiverr && !config.fiverrUrl) fiverr.style.display = 'none';

  const upwork = document.getElementById('lnk-upwork');
  if (upwork && config.upworkUrl) upwork.href = config.upworkUrl;
  else if (upwork && !config.upworkUrl) upwork.style.display = 'none';

  // Isi semua [data-config-link] (GitHub, LinkedIn, social icons)
  document.querySelectorAll('[data-config-link]').forEach(el => {
    const key = el.getAttribute('data-config-link');
    const val = config[key];
    if (val) {
      el.href = val;
    } else {
      // Sembunyikan jika link kosong
      el.style.display = 'none';
    }
  });

  // ── 2. Render project cards ──────────────────────────────────────
  const container = document.getElementById('links-projects-container');
  if (!container) return;

  if (!projectsData || projectsData.length === 0) {
    container.innerHTML = `<p style="color:rgba(255,255,255,0.5);font-size:0.875rem;text-align:center;padding:1rem 0;">
      Belum ada project yang ditampilkan.
    </p>`;
    return;
  }

  container.innerHTML = projectsData.map(project => {
    // Tentukan URL yang akan dibuka: liveUrl > caseStudyUrl > '#'
    const href = project.liveUrl || project.caseStudyUrl || '#';
    const isExternal = href !== '#';
    const targetAttr = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';

    // Status badge
    const statusLabel = project.liveUrl
      ? '<span class="links-project-status links-project-status--live">Live</span>'
      : '<span class="links-project-status">In Dev</span>';

    // Thumbnail
    const thumb = project.imageUrl
      ? `<img src="${project.imageUrl}" alt="${project.title}" loading="lazy"
             onerror="this.onerror=null;this.style.display='none';">`
      : `<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none"
             stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
           <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
         </svg>`;

    return `
      <a href="${href}" ${targetAttr} class="links-project-card">
        <div class="links-project-thumb">${thumb}</div>
        <div class="links-project-info">
          <div class="links-project-title">${project.title}</div>
          <div class="links-project-cat">${project.category}</div>
        </div>
        ${statusLabel}
      </a>`;
  }).join('');
});
