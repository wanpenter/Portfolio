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

Everything lives in a single `index.html` file — styles and scripts included.

## Structure

```
.
├── index.html              # main page: markup, styles, scripts
├── ipetro.html             # case study
├── vaultbreak.html         # case study
├── workshop-system.html    # case study
├── assets/
│   ├── img/projects/       # project screenshots (see its README)
│   ├── favicon.svg
│   ├── og-image.png        # rendered — regenerate from og-source.html
│   └── og-source.html      # template for the OG image
└── README.md
```

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

## License

Code is free to reference. Content, copy, and project descriptions are not.
