# Portfolio — Ikhwanuddin

Personal portfolio site for a Game Technology student. Built and maintained from scratch.

**Live:** [ikhwanuddin.online](https://ikhwanuddin.online)

---

## About

A single-page portfolio designed around a game engine viewport aesthetic — perspective
grid floor, rotating wireframe object, and a HUD-style scroll readout. The visual language
borrows from the tools of the trade rather than generic portfolio templates.

Sections: About, Projects, Skills, Journey, Education, Contact.

## Tech stack

- Plain HTML, CSS, and JavaScript — no framework, no build step
- CSS custom properties for theming (all colours defined in one `:root` block)
- `IntersectionObserver` for scroll-triggered reveals
- Google Fonts: Archivo, IBM Plex Sans, IBM Plex Mono

Each page is self-contained — styles and scripts live inline in the file they belong to.

## Structure

```
.
├── index.html              # the main site: markup, styles, scripts
├── work/                   # project case studies, one page each
│   ├── ipetro.html
│   ├── vaultbreak.html
│   └── workshop-system.html
├── assets/                 # everything served to the browser
│   ├── img/projects/       # project screenshots (see its README)
│   ├── favicon.svg
│   ├── ikhwanuddin-resume.pdf
│   ├── og-image.png        # rendered — regenerate from og-source.html
│   └── og-source.html      # template for the OG image
├── docs/                   # reference material, not deployed
│   └── inspo-website.jpg
├── _redirects              # Netlify: old root URLs → /work/
├── DESIGN.md               # visual system (read by the Impeccable skill)
├── PRODUCT.md              # product context (read by the Impeccable skill)
└── README.md
```

Case-study pages sit one level down, so their links back to the site are
relative to the parent: `../index.html#projects`, `../assets/favicon.svg`.

## Development

No dependencies to install. Open `index.html` in a browser to preview locally.

To edit the theme, change the variables at the top of the `<style>` block:

```css
:root {
  --mist:     #F2F4F7;   /* light section background */
  --card:     #FFFFFF;   /* card surfaces on light sections */
  --signal:   #00A8B5;   /* primary accent — cyan */
  --depth:    #5B3EE8;   /* secondary accent — violet */
  --ink:      #0E1116;   /* text on light, background on dark */
  --ink-soft: #4A5260;   /* secondary text on light */
  --on-dark:  #E6E9EE;   /* text on dark sections */
}
```

Two accent variants exist because neither accent passes WCAG AA on both
backgrounds: `--signal-text` (#00747D) carries cyan text on light sections,
and `--depth-on-dark` (#9B8AF2) carries violet text on dark ones. The
originals keep every non-text job.

Sections alternate light and dark via two utility classes, `.section-light`
and `.section-dark`. Each rebinds a small set of contextual variables
(`--fg`, `--fg-soft`, `--hair`, `--surface`, `--eyebrow`, `--accent-text`),
so components are written once and adapt to whichever band they sit in.

Accent discipline: `--signal` is for buttons, link hover, the active nav item
and underline accents. `--depth` is for section eyebrow numbers and tech tag
pills. Everything else stays neutral.

Note that the token block is duplicated verbatim in all four HTML files —
there is no build step to share it. Change one, change all four.

## Deployment

Hosted on Netlify with a custom domain. Pushes to `main` deploy automatically —
no build command, publish directory is the repository root.

`_redirects` 301s the pre-`/work/` case-study URLs to their current homes; leave it
in place as long as anything out there still links to `/ipetro.html` and friends.

## License

Code is free to reference. Content, copy, and project descriptions are not.
