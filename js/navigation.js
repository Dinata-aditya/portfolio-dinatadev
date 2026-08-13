/**
 * navigation.js — Hamburger toggle, mobile menu, and smooth scroll with header offset.
 *
 * Exported functions:
 *   initNavigation() — Wires up all navigation event listeners. Call once on
 *                      DOMContentLoaded from main.js.
 *
 * Behaviour summary:
 *   - Hamburger button (#hamburger-btn) toggles the "is-open" class on
 *     #mobile-menu and keeps aria-label in sync.
 *   - Clicking any link inside the mobile menu closes the menu.
 *   - A resize listener auto-closes the menu when the viewport reaches the
 *     768 px desktop breakpoint.
 *   - All anchor links with href="#<id>" use CSS scroll-behavior:smooth when
 *     the browser supports it; otherwise a JS scrollIntoView fallback is used.
 *
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 18.6, 20.3, 20.4, 20.5
 */

/** Viewport width at which the desktop nav is shown and the mobile menu hidden. */
const DESKTOP_BREAKPOINT = 768;

/** aria-label values for the hamburger button in each state. */
const ARIA_LABEL_OPEN  = 'Open navigation menu';
const ARIA_LABEL_CLOSE = 'Close navigation menu';

/**
 * Close the mobile menu and reset the hamburger button to its default state.
 *
 * @param {HTMLElement} hamburgerBtn - The hamburger toggle button element.
 * @param {HTMLElement} mobileMenu   - The mobile menu container element.
 */
function closeMenu(hamburgerBtn, mobileMenu) {
  mobileMenu.classList.remove('is-open');
  hamburgerBtn.setAttribute('aria-label', ARIA_LABEL_OPEN);
  hamburgerBtn.setAttribute('aria-expanded', 'false');
}

/**
 * Smoothly scroll to a target element, with a fallback for browsers that do
 * not support CSS scroll-behavior:smooth (Req 20.5).
 *
 * @param {HTMLElement} target - The element to scroll into view.
 */
function smoothScrollTo(target) {
  if (CSS && CSS.supports && CSS.supports('scroll-behavior', 'smooth')) {
    // CSS handles it via `html { scroll-behavior: smooth }` in style.css.
    target.scrollIntoView({ block: 'start' });
  } else {
    // JS polyfill for browsers without CSS scroll-behavior support.
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Initialise all navigation behaviour:
 *   1. Hamburger button click — toggle mobile menu open/closed.
 *   2. Mobile nav link clicks — close menu, then scroll to target.
 *   3. Desktop nav link clicks — scroll to target (CSS handles smoothness).
 *   4. Viewport resize — auto-close menu when switching to desktop width.
 *
 * Safe to call when the elements are absent (no-op with console warning).
 */
export function initNavigation() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu   = document.getElementById('mobile-menu');

  if (!hamburgerBtn || !mobileMenu) {
    console.warn('[navigation] #hamburger-btn or #mobile-menu not found in DOM.');
    return;
  }

  // ── 1. Hamburger toggle ───────────────────────────────────────────────────
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    hamburgerBtn.setAttribute(
      'aria-label',
      isOpen ? ARIA_LABEL_CLOSE : ARIA_LABEL_OPEN
    );
    hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // ── 2. Mobile nav link clicks — close menu first, then scroll ─────────────
  const mobileNavLinks = mobileMenu.querySelectorAll('a[href^="#"]');
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      const targetId = href ? href.slice(1) : null;
      const targetEl = targetId ? document.getElementById(targetId) : null;

      // Close the menu and reset the button before scrolling (Req 20.4).
      closeMenu(hamburgerBtn, mobileMenu);

      if (targetEl) {
        event.preventDefault();
        smoothScrollTo(targetEl);
      }
    });
  });

  // ── 3. Desktop nav link clicks — smooth scroll fallback ──────────────────
  // Only the links outside the mobile menu; prevents double-binding.
  const desktopNavLinks = document.querySelectorAll(
    '#main-nav a[href^="#"]:not(#mobile-menu a)'
  );
  desktopNavLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      const targetId = href ? href.slice(1) : null;
      const targetEl = targetId ? document.getElementById(targetId) : null;

      if (targetEl) {
        event.preventDefault();
        smoothScrollTo(targetEl);
      }
    });
  });

  // ── 4. Resize — auto-close menu at desktop breakpoint (Req 5.6) ──────────
  const handleResize = () => {
    if (
      window.innerWidth >= DESKTOP_BREAKPOINT &&
      mobileMenu.classList.contains('is-open')
    ) {
      closeMenu(hamburgerBtn, mobileMenu);
    }
  };

  window.addEventListener('resize', handleResize);
}
