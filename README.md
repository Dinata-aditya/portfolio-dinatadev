# DinataDev Portfolio — Static Site

A pure static portfolio site built with HTML5, CSS3, and Vanilla JavaScript ES6+ modules. No build step required — the `portfolio/` folder is the final deploy artifact.

---

## Project Structure

```
portfolio/
├── index.html              ← Single page entry point
├── css/
│   ├── style.css           ← Design tokens, reset, base styles, utilities
│   ├── components.css      ← All component styles
│   └── responsive.css      ← All media queries
├── js/
│   ├── main.js             ← Entry point; config object; module wiring
│   ├── navigation.js       ← Hamburger toggle and smooth scroll
│   ├── projects.js         ← Project data and renderer
│   ├── certificates.js     ← Certificate data and renderer
│   └── contact.js          ← Contact form submission handler
└── assets/
    ├── images/             ← Profile photo and project screenshots
    ├── icons/              ← SVG icon files
    └── certificates/       ← Certificate thumbnail images
```

---

## Developer Workflows

### Adding a new project

Open `js/projects.js` and add a new object to the `projectsData` array.

```js
// js/projects.js
export const projectsData = [
  // ... existing entries ...
  {
    id: 'my-new-project',           // unique slug (URL-safe, no spaces)
    title: 'My New Project',        // max 100 chars
    category: 'Web Application',    // max 60 chars; shown as a badge
    description: 'A short description of what this project does.', // max 300 chars
    features: [                     // max 8 items, each max 50 chars
      'Feature One',
      'Feature Two',
    ],
    technologies: ['HTML', 'CSS', 'JavaScript'], // max 10 items
    liveUrl: 'https://my-project.netlify.app',   // '' = disabled button
    caseStudyUrl: '',                             // '' = disabled button
    imageUrl: 'assets/images/my-project.jpg',    // '' = code placeholder shown
    featured: false,                // true = full-width hero layout (one at a time)
  },
];
```

**Tips:**
- Set `featured: true` on only one project at a time — it renders in the full-width hero layout at the top of the section. All other projects appear in the two-column grid below.
- Leave `liveUrl` or `caseStudyUrl` as `''` to render that button in a disabled state.
- Place the image file in `assets/images/` and use a relative path (e.g. `assets/images/my-project.jpg`). The card handles a missing image gracefully with a placeholder.

No HTML edits are needed. The page renders the new card automatically on the next load.

---

### Adding a certificate

Open `js/certificates.js` and add a new object to the `certificatesData` array.

```js
// js/certificates.js
export const certificatesData = [
  {
    id: 'my-cert-slug',                          // unique slug
    name: 'Certificate Name',                    // max 120 chars
    organization: 'Issuing Organization',        // max 80 chars
    date: '2024-06',                             // "YYYY-MM" format
    imageUrl: 'assets/certificates/my-cert.jpg', // '' = placeholder shown
    viewUrl: 'https://link-to-original-cert',    // '' = disabled button
    credentialId: 'ABC-123-XYZ',                 // optional; omit or set to undefined
  },
];
```

**Tips:**
- The `date` field must be in `YYYY-MM` format — it is displayed as "Jun 2024" automatically.
- Place the thumbnail image in `assets/certificates/` at an aspect ratio of 4:3 for the best fit.
- The section shows an "Certificates will be added soon." message when the array is empty (the initial deploy state). Adding any entry removes that message.
- `credentialId` is optional. If included, it appears below the date on the card.

No HTML edits are needed.

---

### Changing config URLs

Open `js/main.js` and edit the `config` object near the top of the file.

```js
// js/main.js
export const config = {
  whatsappNumber: '628xxxxxxxxx',              // digits only — no "+", no spaces
  email: 'your@email.com',
  githubUrl: 'https://github.com/your-handle',
  linkedinUrl: 'https://linkedin.com/in/your-handle',
  dribbbleUrl: 'https://dribbble.com/your-handle',
  fiverrUrl: 'https://fiverr.com/your-handle',
  upworkUrl: 'https://upwork.com/freelancers/your-handle',
  instagramUrl: 'https://instagram.com/your-handle',
  tiktokUrl: '',                               // set to '' to hide the link
};
```

**Tips:**
- All social links in the nav and footer read from this single object — you only need to change it once.
- The WhatsApp CTA button uses `whatsappNumber` to build the `https://wa.me/{number}` URL automatically. Provide digits only (no `+`, no dashes).
- Set any URL to `''` (empty string) to leave that link pointing to `#` (graceful no-op).
- The email link in the contact section uses `email` and is prefixed with `mailto:` automatically.

---

### Deploying to Netlify

No build step is required. The `portfolio/` folder is the complete site.

**Option 1 — Drag and drop (fastest):**

1. Go to [netlify.com](https://netlify.com) and log in.
2. From the dashboard, click **"Add new site"** → **"Deploy manually"**.
3. Drag and drop the entire `portfolio/` folder onto the upload area.
4. Netlify assigns a URL immediately. Done.

**Option 2 — Git push (recommended for ongoing updates):**

1. Push your repository to GitHub (or GitLab / Bitbucket).
2. In Netlify, click **"Add new site"** → **"Import an existing project"**.
3. Connect your repository.
4. Set **Publish directory** to `portfolio` (no build command needed — leave that field empty).
5. Click **"Deploy site"**.

**Netlify Forms:**

The contact form uses `data-netlify="true"` and `name="contact"` — Netlify detects this automatically and starts collecting submissions. No backend or third-party service is required. Submissions appear under **Forms** in the Netlify dashboard.

**Custom domain:**

Add a custom domain under **Site configuration → Domain management** in the Netlify dashboard after the first deploy.
