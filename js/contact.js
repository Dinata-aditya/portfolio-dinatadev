/**
 * contact.js
 *
 * Handles contact form submission for the DinataDev portfolio static site.
 *
 * Exported functions:
 *   - validateContactInputs({ name, email, message }) → boolean
 *       Pure validation function; returns true only when all three fields are
 *       non-empty, non-whitespace, and the email value contains an "@" character.
 *       Designed for isolated unit/property testing without DOM involvement.
 *
 *   - initContactForm(config)
 *       Binds the submit handler to #contact-form, sets the WhatsApp CTA href,
 *       and wires up success / error display logic. Should be called once on
 *       DOMContentLoaded from js/main.js.
 *
 * Requirements: 12.2, 12.4, 12.5, 12.6, 12.7, 12.8, 21.6, 21.7
 */

/** Timeout duration for the fetch request in milliseconds (Req 21.6). */
const FETCH_TIMEOUT_MS = 10_000;

/**
 * Validates the three required contact form inputs.
 *
 * Rules:
 *  - name, email, and message must each be a non-empty, non-whitespace string.
 *  - email must contain the "@" character.
 *
 * This is a pure function with no side-effects so it can be exercised directly
 * in property-based and unit tests without a DOM environment.
 *
 * @param {{ name: string, email: string, message: string }} inputs
 * @returns {boolean} true when all inputs pass validation, false otherwise.
 */
export function validateContactInputs({ name, email, message }) {
  if (typeof name !== "string" || name.trim() === "") return false;
  if (typeof email !== "string" || email.trim() === "") return false;
  if (!email.includes("@")) return false;
  if (typeof message !== "string" || message.trim() === "") return false;
  return true;
}

/**
 * Initialises the contact section: wires the WhatsApp CTA link and attaches
 * the submit event handler to #contact-form.
 *
 * @param {{ whatsappNumber: string, [key: string]: string }} config
 *   Site-wide config object. Only `whatsappNumber` is consumed here.
 */
export function initContactForm(config) {
  /* ── WhatsApp CTA ── */
  const whatsappBtn = document.querySelector("#whatsapp-cta");
  if (whatsappBtn) {
    whatsappBtn.href = `https://wa.me/${config.whatsappNumber}`;
  }

  /* ── Form elements ── */
  const form = document.querySelector("#contact-form");
  if (!form) return; // section not present in DOM — bail silently

  const submitBtn = document.querySelector("#submit-btn");
  const successMsg = document.querySelector("#form-success-msg");
  const errorMsg = document.querySelector("#form-error-msg");

  /**
   * Shows an element by removing the "hidden" class / resetting display.
   * @param {Element|null} el
   */
  function show(el) {
    if (el) el.hidden = false;
  }

  /**
   * Hides an element.
   * @param {Element|null} el
   */
  function hide(el) {
    if (el) el.hidden = true;
  }

  /** Resets the submit button to its default enabled state. */
  function resetBtn() {
    if (!submitBtn) return;
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Message";
  }

  /* ── Submit handler ── */
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Hide stale messages from a previous attempt
    hide(successMsg);
    hide(errorMsg);

    // Gather current field values
    const nameField = form.querySelector("#contact-name");
    const emailField = form.querySelector("#contact-email");
    const messageField = form.querySelector("#contact-message");

    const inputs = {
      name: nameField ? nameField.value : "",
      email: emailField ? emailField.value : "",
      message: messageField ? messageField.value : "",
    };

    // Client-side validation — do NOT call fetch when invalid (Req 12.4)
    if (!validateContactInputs(inputs)) {
      // HTML5 native validation already shows browser-level messages via
      // the `required` attributes on each field. We return early without
      // disabling the button so the user can correct and resubmit.
      return;
    }

    // Disable button and show progress state (Req 12.6)
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    // AbortController for 10-second timeout (Req 21.6)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const formData = new FormData(form);

      const response = await fetch(form.action || "/", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        // 2xx — success (Req 12.7)
        hide(form);
        show(successMsg);

        // Clear all field values
        if (nameField) nameField.value = "";
        if (emailField) emailField.value = "";
        if (messageField) messageField.value = "";
      } else {
        // HTTP ≥ 400 — show error, re-enable button, preserve values (Req 12.8)
        show(errorMsg);
        resetBtn();
      }
    } catch {
      // Network error or AbortError (timeout) — treated as failure (Req 12.8, 21.6)
      clearTimeout(timeoutId);
      show(errorMsg);
      resetBtn();
    }
  });
}
