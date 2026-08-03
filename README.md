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
├── index.html    # entire site: markup, styles, scripts
└── README.md
```

## Development

No dependencies to install. Open `index.html` in a browser to preview locally.

To edit the theme, change the variables at the top of the `<style>` block:

```css
:root {
  --bg:   #121620;   /* background */
  --z:    #4DA3FF;   /* accent — Z axis blue */
  --x:    #FF4D6D;   /* accent — X axis red */
}
```

## Deployment

Hosted on Netlify with a custom domain. Pushes to `main` deploy automatically —
no build command, publish directory is the repository root.

## License

Code is free to reference. Content, copy, and project descriptions are not.
