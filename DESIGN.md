---
name: Ikhwanuddin Portfolio
description: A committed red-and-void developer portfolio built around an oversized wordmark, a low-poly placeholder figure, and one full-bleed red field as its closing crescendo
colors:
  void-black: "#0B0B10"
  panel-charcoal: "#15161C"
  panel-raised: "#1B1C22"
  hairline: "#24252C"
  off-white-ink: "#F4F4F6"
  slate-muted: "#8C8D97"
  signal-red: "#FF3355"
  red-field: "#B4102F"
  on-red-muted: "#FFC7CE"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(44px, 7.4vw, 92px)"
    fontWeight: 800
    lineHeight: 0.96
    letterSpacing: "-0.035em"
  ghost:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(80px, 11vw, 155px)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(30px, 4.4vw, 46px)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.1em"
rounded:
  pill: "20px"
  card: "8px"
  tag: "2px"
spacing:
  section-x: "clamp(20px, 5vw, 72px)"
  section-y: "104px"
  card-gap: "28px"
components:
  card-project:
    backgroundColor: "{colors.panel-charcoal}"
    rounded: "{rounded.card}"
    padding: "22px 22px 26px"
  card-project-hover:
    backgroundColor: "{colors.panel-charcoal}"
  pill-tag:
    backgroundColor: "{colors.panel-charcoal}"
    textColor: "{colors.off-white-ink}"
    rounded: "{rounded.pill}"
    typography: "{typography.label}"
    padding: "7px 14px"
  pill-tag-hover:
    textColor: "{colors.signal-red}"
  cta-field:
    backgroundColor: "{colors.red-field}"
    textColor: "#FFFFFF"
---

# Design System: Ikhwanuddin Portfolio

## Overview

**Creative North Star: "The Signal Field"**

This is a redesign, not a refinement — the incumbent "Signal Terminal" world (restrained red accent on hairline structure) is superseded. The new system commits red at page scale: an oversized solid wordmark spans the hero as a graphic device, not a decoration, and the closing Contact section flips to a full-bleed red field rather than treating red as a rare accent. The rest of the page stays disciplined — void-black, hairline dividers, one accent — so the two committed red moments (the ghost wordmark, the contact field) read as intentional crescendos rather than the palette losing control.

The direction was pinned directly by the user's own reference image (`inspo website.jpg`): dark ground, oversized red display type, a portrait-led hero, a stat strip, a project grid, and a device-mockup contact close. Two adaptations were made deliberately rather than copied literally: the hero photograph is replaced with an honest low-poly silhouette placeholder (no real portrait exists yet), and the inspo's agency "work process" section was dropped rather than fabricated, since it doesn't describe how a student developer actually works.

**Key Characteristics:**
- One oversized solid-red wordmark ("PORTFOLIO") as a graphic watermark behind the hero name and figure — not a decoration, a scale statement
- A single full-bleed red field (Contact) as the page's only other saturated-color region — color commits at page scale in exactly two places, never scattered as accent elsewhere
- A low-poly geometric silhouette stands in for the missing profile photo — deliberately non-photorealistic so it reads as a placeholder, not a fabricated portrait
- Structure still carried by 1px hairlines everywhere outside the two committed-red zones
- No stacked kicker/eyebrow labels above headings; a greeting like "Hai, saya" sits inline with the name it introduces, never on its own line above it

## Colors

Two color regions: a disciplined void-black system for most of the page, and one deep saturated red field reserved for the Contact close.

### Primary
- **Signal Red** (#FF3355): The accent for the void-black regions — role labels, stat numbers, project numbers, hover states, focus rings — and the fill color of the oversized ghost wordmark itself.

### Secondary
- **Red Field** (#B4102F): A deeper, less saturated red reserved exclusively for the Contact section's full-bleed background. Never used as a small accent; it only ever owns an entire section.

### Neutral
- **Void Black** (#0B0B10): Page background for every section except Contact.
- **Panel Charcoal** (#15161C) / **Panel Raised** (#1B1C22): Card and pill surfaces, one to two steps lighter than the void.
- **Hairline** (#24252C): The only border/divider color outside the red field.
- **Off-White Ink** (#F4F4F6): Primary text on dark surfaces.
- **Slate Muted** (#8C8D97): Secondary text on dark surfaces.
- **On-Red Muted** (#FFC7CE, or `rgba(255,255,255,.6–.78)` composited over Red Field): Secondary text inside the Contact field — a tint of white through the red, never gray-on-red.

### Named Rules
**The Two-Field Rule.** Saturated red owns exactly two regions at full commitment — the hero ghost wordmark and the Contact section's background — and nowhere else. Every other red usage in the system is a thin accent (text, stroke, dot), never a fill.

**The No-Red-On-Red Rule.** Signal Red accent text must never sit where it overlaps the ghost wordmark's fill; foreground text crossing the wordmark is always off-white, never red, or the wordmark is positioned clear of it.

**The Light-on-Red Rule.** Inside the Contact field, primary text is white and secondary text is white at reduced opacity (tinted by the red it sits on). Dark text on Red Field fails contrast and is never used, however close it reads to the field's own hue.

## Typography

**Display Font:** Archivo (weight 700–900), with system-ui, sans-serif fallback
**Body Font:** IBM Plex Sans (weight 400–500), with system-ui, sans-serif fallback
**Label/Mono Font:** IBM Plex Mono (weight 400–500), with ui-monospace, monospace fallback — reserved for genuinely technical/data content (stats, tech stack lines, dates, skill/tag pills), not used as a blanket "technical" costume for navigation or captions.

**Character:** The same heavy grotesk + humanist sans + mono trio as the prior system, now pushed to a more extreme display weight (900 on the ghost wordmark) to carry the Committed color strategy's scale.

### Hierarchy
- **Ghost** (900, `clamp(80px, 11vw, 155px)`, letter-spacing -0.045em): The oversized watermark word behind the hero. A graphic device, not reading copy — sized and positioned to clear all foreground text and stat numbers, never to overlap same-hue foreground content.
- **Display** (800, `clamp(44px, 7.4vw, 92px)`, line-height 0.96): The hero name. The greeting ("Hai, saya") sits inline before it at 0.26em, baseline-aligned in the same heading — not stacked above it as a separate kicker line.
- **Headline** (800, `clamp(30px, 4.4vw, 46px)`): Section headings, paired inline with their numeric index (`01`–`05`) at the same baseline.
- **Title** (700, 20px): Project card titles, education entry titles.
- **Body** (400–500, 14.5–17px, line-height 1.65): Paragraph copy.
- **Label** (400–500, 9–13px, tracked, mono): Stats, tech stack, dates, tags — data only.

### Named Rules
**The No-Stacked-Kicker Rule.** No small label sits alone on its own line directly above a heading. A greeting, category, or index either joins the heading's own line (baseline-aligned, same element) or is dropped. This is an absolute rule, not a default — it holds even though the pinned inspo reference itself uses stacked micro-labels above its hero name.

## Layout

Same spacing rhythm as the prior system — 1200–1240px content width, fluid `clamp(20px,5vw,72px)` gutters, hairline-separated sections at ~104px vertical rhythm — with one structural exception: the Contact section discards the shared max-width container so its red background can run full-bleed edge to edge; its content re-applies the same 1240px measure via an inner wrapper so reading width stays consistent with the rest of the page.

The hero grid (copy / figure / stats, `1.15fr .8fr .45fr`) bottom-aligns its columns so the silhouette figure and stat strip sit grounded at the same baseline as the name block, echoing the pinned reference's portrait-anchored composition.

## Elevation & Depth

Unchanged from the prior system: flat at rest, hairlines carry structure, and the only shadows are soft ambient glow (wide blur, low opacity) under the hero figure and on project-card hover. The Contact field adds one new depth device — a top-right-anchored radial darkening (`rgba(0,0,0,.28)` fading to transparent) — to keep the flat red field from feeling like a solid sticker; it is a wash, not a shadow, and never gets a hard edge.

### Named Rules
**The Ambient-Not-Material Rule.** (Carried over.) Depth reads as glow or wash, never a crisp material shadow.

## Shapes

Unchanged: 8px card radius, 20px pill radius (chips/tags only), 2px status-badge radius, hairline 1px borders throughout. The device-mockup in Contact reuses the card radius language (10px screen bezel, tighter 3–4px inner screen corners) so it reads as part of the same shape family rather than a separate skeuomorphic object.

## Components

### Buttons
No traditional filled button exists yet. If introduced, it follows Card Project's surface logic outside the red field (panel background, hairline border, red border/glow on hover) or the Contact field's light-on-red logic inside it — never a red fill button, per the Two-Field Rule.

### Navigation
Unchanged from the prior system: sans-serif tracked labels, muted at rest, off-white + animating red underline on hover.

### Cards / Containers
Unchanged shape/surface logic; card grid gap increased slightly (28px) to match the bolder overall scale.

### Pills / Tags
Unchanged.

### Hero Laser Vault (signature component)
A real-time WebGL volume (Three.js, loaded from CDN as an ES module — no build step) occupying the hero figure slot: a hairline wireframe cage crossed by thin sweeping Signal Red laser beams, with a wireframe pearl at its centre and a small control box at its base. It is a direct reference to VaultBreak MR — the laser security field, the objective, and the control boxes you disable — so the hero demonstrates the subject's actual discipline rather than describing it.

It obeys the Two-Field Rule: every red element here is a **stroke or point, never a fill**, so the volume stays an accent region rather than becoming a third committed-red zone. Because it sits in front of the ghost wordmark, a near-opaque void-black radial wash sits behind the canvas — without it, red beams cross red letterforms and both lose contrast (the No-Red-On-Red Rule applied to non-text marks).

Constraints it must keep: `aria-hidden`, pixel ratio capped at 2, beam count reduced below 900px, the render loop paused whenever the hero is off-screen or the tab is hidden, and a single static frame (no loop, no pointer tracking) under `prefers-reduced-motion`.

### Hero Silhouette (fallback placeholder)
A low-poly geometric bust (SVG polygons, no facial detail) stands in for the missing profile photo — dark panel-toned facets with one red-lit rim facet, bottom-aligned in the hero grid, overlapping the ghost wordmark the way a portrait would in the pinned reference. It is explicitly `aria-hidden` and commented in source as a placeholder, never presented as if it were real photography. It now serves as the no-WebGL fallback: the laser vault reveals itself only once Three.js has booted, so a browser that cannot render it keeps this figure instead of an empty gap.

### Device Mockup (signature component)
A pure CSS/SVG laptop frame in the Contact field (rounded bezel, three window-chrome dots, a clipped trapezoid base) containing a miniature illustrated preview of the site itself — a mini wordmark, greeked content bars, and an accent CTA bar. It stands in for the pinned reference's photographic laptop-and-prop mockup without fabricating a photograph.

## Do's and Don'ts

### Do:
- **Do** keep saturated red confined to exactly two full-commitment zones (ghost wordmark, Contact field); everywhere else it is a thin accent. (The Two-Field Rule.)
- **Do** use white/off-white for any text that crosses the ghost wordmark or sits inside the Contact field. (The No-Red-On-Red / Light-on-Red Rules.)
- **Do** join a greeting or index label to its heading's own baseline rather than stacking it above as a separate line. (The No-Stacked-Kicker Rule.)
- **Do** label placeholder imagery (the silhouette, the device-mockup preview) as clearly synthetic in source comments — never let a stand-in read as real photography.

### Don't:
- **Don't** let Signal Red accent text overlap the ghost wordmark's fill.
- **Don't** use dark/near-black text on the Red Field background, regardless of how close it reads to the field's own hue.
- **Don't** add a third saturated-red region; the Two-Field Rule caps it at two.
- **Don't** stack a small label directly above an `h1`/`h2` on its own line, even when a reference image does.
- **Don't** invent a "work process" or agency-style section that doesn't reflect how the subject actually works, just because a reference image includes one.
