/**
 * projects.js
 *
 * Manages project data and dynamic rendering for the Featured Projects section.
 *
 * Exports:
 *   - projectsData          : Array of ProjectObject — the canonical project list.
 *   - renderProjectCardHTML : Pure function → HTML string for a single project card.
 *   - renderProjects        : Renders all project cards into the DOM.
 */

// ---------------------------------------------------------------------------
// Inline SVG helpers (aria-hidden, currentColor stroke)
// ---------------------------------------------------------------------------

const SVG_CHECK_CIRCLE = `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
  <polyline points="22 4 12 14.01 9 11.01"/>
</svg>`;

const SVG_EXTERNAL_LINK = `<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
  <polyline points="15 3 21 3 21 9"/>
  <line x1="10" y1="14" x2="21" y2="3"/>
</svg>`;

const SVG_ARROW_RIGHT = `<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="5" y1="12" x2="19" y2="12"/>
  <polyline points="12 5 19 12 12 19"/>
</svg>`;

/** Code2 SVG used as a placeholder when a project image fails to load. */
const SVG_CODE2_PLACEHOLDER = `<svg aria-hidden="true" width="48" height="48" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
  style="color: var(--muted-foreground); opacity: 0.3;">
  <polyline points="16 18 22 12 16 6"/>
  <polyline points="8 6 2 12 8 18"/>
</svg>`;

// ---------------------------------------------------------------------------
// onerror handler injected as an attribute string (no inline functions)
// ---------------------------------------------------------------------------
const IMG_ONERROR = `this.onerror=null;this.style.display='none';this.nextElementSibling.style.display='flex';`;

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} ProjectObject
 * @property {string}   id           - Unique slug identifier.
 * @property {string}   title        - Project title (max 100 chars).
 * @property {string}   category     - Category label shown as a badge (max 60 chars).
 * @property {string}   description  - Short description (max 300 chars).
 * @property {string[]} features     - Feature list (max 8 items, each max 50 chars).
 * @property {string[]} technologies - Tech stack badges (max 10 items).
 * @property {string}   liveUrl      - Live demo URL, or empty string.
 * @property {string}   caseStudyUrl - Case study URL, or empty string.
 * @property {string}   imageUrl     - Relative/absolute image URL, or empty string.
 * @property {boolean}  featured     - True for the hero-layout featured project.
 */

/** @type {ProjectObject[]} */
export const projectsData = [
  {
    id: "jastipmayla",
    title: "JastipMayla",
    category: "Real-world Web Application",
    description:
      "A web-based catalog solution designed to help a jastip business showcase and manage products more efficiently.",
    features: [
      "Product Catalog",
      "Admin Dashboard",
      "Authentication",
      "Product Management",
      "Image Upload",
      "Product Status",
      "WhatsApp Ordering",
      "Responsive Design",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "Supabase", "Netlify"],
    liveUrl: "",
    caseStudyUrl: "",
    imageUrl: "assets/images/jastipmayla.jpg",
    featured: true,
  },
  {
    id: "laundry-management",
    title: "Laundry Management Website",
    category: "Web Application",
    description:
      "A practical solution for managing laundry orders and customer data.",
    features: [],
    technologies: [],
    liveUrl: "",
    caseStudyUrl: "",
    imageUrl: "assets/images/laundry.jpg",
    featured: false,
  },
  {
    id: "future-fullstack",
    title: "Future Full Stack Project",
    category: "Full Stack",
    description:
      "Currently in development. Focusing on advanced backend integration.",
    features: [],
    technologies: [],
    liveUrl: "",
    caseStudyUrl: "",
    imageUrl: "",
    featured: false,
  },
];

// ---------------------------------------------------------------------------
// Pure render helpers
// ---------------------------------------------------------------------------

/**
 * Builds the HTML string for the featured project hero card (2-column layout).
 *
 * @param {ProjectObject} project
 * @returns {string} HTML string
 */
function renderFeaturedProjectHTML(project) {
  const featuresHTML =
    project.features.length > 0
      ? `<div class="project-features">
          <h4 class="project-features__heading">Key Features</h4>
          <div class="project-features__grid">
            ${project.features
              .slice(0, 8)
              .map(
                (f) => `<div class="project-feature-item">
                  <span class="project-feature-item__icon" style="color: var(--primary);">${SVG_CHECK_CIRCLE}</span>
                  <span>${f}</span>
                </div>`
              )
              .join("")}
          </div>
        </div>`
      : "";

  const techBadgesHTML =
    project.technologies.length > 0
      ? `<div class="project-tech-badges">
          ${project.technologies
            .slice(0, 10)
            .map(
              (t) =>
                `<span class="project-tech-badge">${t}</span>`
            )
            .join("")}
        </div>`
      : "";

  const liveBtn = project.liveUrl
    ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer"
          class="btn-primary project-card__btn" aria-label="Live demo of ${project.title}">
          Live Demo ${SVG_EXTERNAL_LINK}
        </a>`
    : `<button class="btn-primary project-card__btn" disabled aria-disabled="true"
          aria-label="Live demo not available">
          Live Demo ${SVG_EXTERNAL_LINK}
        </button>`;

  const caseStudyBtn = project.caseStudyUrl
    ? `<a href="${project.caseStudyUrl}" target="_blank" rel="noopener noreferrer"
          class="btn-outline project-card__btn" aria-label="View case study for ${project.title}">
          View Case Study ${SVG_ARROW_RIGHT}
        </a>`
    : `<button class="btn-outline project-card__btn" disabled aria-disabled="true"
          aria-label="Case study not available">
          View Case Study ${SVG_ARROW_RIGHT}
        </button>`;

  const imageHTML = project.imageUrl
    ? `<img
          src="${project.imageUrl}"
          alt="${project.title} project screenshot"
          class="project-featured__img"
          loading="lazy"
          onerror="${IMG_ONERROR}"
        />
        <div class="project-img-fallback" style="display:none;" aria-hidden="true">
          ${SVG_CODE2_PLACEHOLDER}
        </div>`
    : `<div class="project-img-fallback" aria-hidden="true">
          ${SVG_CODE2_PLACEHOLDER}
        </div>`;

  return `
    <article class="project-card project-card--featured" id="project-${project.id}">
      <div class="project-card__content">
        <div class="project-card__category">${project.category}</div>
        <h3 class="project-card__title">${project.title}</h3>
        <p class="project-card__desc">${project.description}</p>
        ${featuresHTML}
        ${techBadgesHTML}
        <div class="project-card__actions">
          ${liveBtn}
          ${caseStudyBtn}
        </div>
      </div>
      <div class="project-featured__image-wrap">
        ${imageHTML}
      </div>
    </article>`;
}

/**
 * Builds the HTML string for a non-featured project grid card.
 *
 * @param {ProjectObject} project
 * @returns {string} HTML string
 */
function renderGridProjectHTML(project) {
  const imageHTML = project.imageUrl
    ? `<img
          src="${project.imageUrl}"
          alt="${project.title} project screenshot"
          class="project-grid__img"
          loading="lazy"
          onerror="${IMG_ONERROR}"
        />
        <div class="project-img-fallback" style="display:none;" aria-hidden="true">
          ${SVG_CODE2_PLACEHOLDER}
        </div>`
    : `<div class="project-img-fallback" aria-hidden="true">
          ${SVG_CODE2_PLACEHOLDER}
        </div>`;

  return `
    <article class="project-card project-card--grid" id="project-${project.id}">
      <div class="project-grid__image-wrap">
        ${imageHTML}
      </div>
      <div class="project-grid__body">
        <h4 class="project-card__title project-card__title--grid">${project.title}</h4>
        <p class="project-card__desc project-card__desc--grid">${project.description}</p>
        <span class="project-grid__coming-soon">Coming Soon</span>
      </div>
    </article>`;
}

/**
 * Returns the HTML string for a single project card — featured or grid layout.
 * This is a pure function suitable for property-based testing.
 *
 * @param {ProjectObject} project
 * @returns {string} HTML string
 */
export function renderProjectCardHTML(project) {
  return project.featured
    ? renderFeaturedProjectHTML(project)
    : renderGridProjectHTML(project);
}

// ---------------------------------------------------------------------------
// DOM renderer
// ---------------------------------------------------------------------------

/**
 * Renders all project cards into the DOM.
 *
 * Featured entries (project.featured === true) are injected into
 * `#projects-featured-container`. Non-featured entries go into
 * `#projects-grid-container`. When data is empty, an empty-state message
 * is rendered and no cards are created.
 *
 * @param {Object} config       - Site-wide config (unused by this function
 *                                directly, passed for future extensibility).
 * @param {ProjectObject[]} [data=projectsData] - Project data array; defaults
 *                                to the module-level projectsData.
 * @returns {void}
 */
export function renderProjects(config, data = projectsData) {
  const featuredContainer = document.getElementById(
    "projects-featured-container"
  );
  const gridContainer = document.getElementById("projects-grid-container");

  if (!featuredContainer || !gridContainer) {
    console.warn("[projects] Mount containers not found in DOM.");
    return;
  }

  // Clear existing content
  featuredContainer.innerHTML = "";
  gridContainer.innerHTML = "";

  if (data.length === 0) {
    featuredContainer.innerHTML = `
      <div class="projects-empty-state" role="status">
        <p>No projects to display yet. Check back soon!</p>
      </div>`;
    return;
  }

  const featuredProjects = data.filter((p) => p.featured);
  const gridProjects = data.filter((p) => !p.featured);

  featuredContainer.innerHTML = featuredProjects
    .map((p) => renderFeaturedProjectHTML(p))
    .join("");

  gridContainer.innerHTML = gridProjects
    .map((p) => renderGridProjectHTML(p))
    .join("");
}
