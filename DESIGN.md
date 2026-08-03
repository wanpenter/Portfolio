---
name: Ikhwanuddin Portfolio
description: A dark technical-console portfolio for a game/XR/full-stack developer, with a single red signal accent
colors:
  void-black: "#0B0B10"
  panel-charcoal: "#15161C"
  hairline: "#24252C"
  off-white-ink: "#F4F4F6"
  slate-muted: "#8C8D97"
  signal-red: "#FF3355"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(52px, 9vw, 120px)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(28px, 4.4vw, 44px)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "21px"
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
    letterSpacing: "0.14em"
rounded:
  pill: "20px"
  card: "6px"
  tag: "2px"
spacing:
  section-x: "clamp(20px, 5vw, 72px)"
  section-y: "100px"
  card-gap: "24px"
components:
  button-nav-link:
    textColor: "{colors.slate-muted}"
    typography: "{typography.label}"
  button-nav-link-hover:
    textColor: "{colors.off-white-ink}"
  card-project:
    backgroundColor: "{colors.panel-charcoal}"
    rounded: "{rounded.card}"
    padding: "20px 22px 24px"
  card-project-hover:
    backgroundColor: "{colors.panel-charcoal}"
  pill-tag:
    backgroundColor: "{colors.void-black}"
    textColor: "{colors.off-white-ink}"
    rounded: "{rounded.pill}"
    typography: "{typography.label}"
    padding: "7px 14px"
  pill-tag-hover:
    textColor: "{colors.signal-red}"
---

# Design System: Ikhwanuddin Portfolio

## Overview

**Creative North Star: "The Signal Terminal"**

The site reads as a dark technical console rather than a conventional marketing page: a near-black surface, oversized ghost typography watermarking the hero, and monospace labels that behave like system readouts (`STATUS`, tag numbers, coordinates-style stat labels). Signal Red is the one live wire in an otherwise restrained, engineered palette — it marks status, hover state, and the numbers that matter, the way a status light or a highlighted diagnostic line would on a terminal screen.

The system is confident but economical: one accent color, one neutral ramp, three type roles (display, body, mono-label), and a consistent hairline-border vocabulary that does the structural work shadows would do elsewhere. Motion is subdued — scroll-triggered fade-ups, short hover transitions, a slow-spinning emblem ring — never decorative for its own sake, and it fully respects `prefers-reduced-motion`.

**Key Characteristics:**
- Near-black void background with a single desaturated-neutral panel tone for raised surfaces
- One accent (Signal Red) used sparingly against a five-step neutral scale
- Mixed type system: heavy display sans for headings, humanist sans for reading copy, monospace for all labels/meta/system text
- Structure conveyed by 1px hairlines more than by shadows or fills
- Soft, wide, red-tinted ambient glow (not hard material shadow) on the emblem and on card hover

## Colors

A near-monochrome dark palette (void black → charcoal panel → hairline → muted slate → off-white ink) with exactly one live accent.

### Primary
- **Signal Red** (#FF3355): The system's only accent. Marks role labels, the status dot, key stat numbers, project numbers, award lines, active/hover states on nav links, pills, and cards, and the focus ring. Never used as a large fill — always as text, thin stroke, border, or glow.

### Neutral
- **Void Black** (#0B0B10): Page background. Slightly cool/violet-tinted near-black, not a pure `#000`.
- **Panel Charcoal** (#15161C): Raised surface for project cards and pill backgrounds — one step lighter than the void.
- **Hairline** (#24252C): The system's only border/divider color — topbar bottom border, section top borders, card borders, stat dividers, edu-item dividers.
- **Off-White Ink** (#F4F4F6): Primary text color and the "on" state for links, pill text, and headings.
- **Slate Muted** (#8C8D97): Secondary text — nav links at rest, body copy in descriptions, meta labels, timestamps.

### Named Rules
**The One Signal Rule.** Signal Red appears only as accent — text, thin stroke/border, dot, or glow — never as a background fill larger than a status pill. Its rarity is what makes it register as a signal rather than decoration.

**The Hairline Structure Rule.** Structure (topbar, section breaks, card edges, stat dividers, list dividers) is drawn with a single 1px `--line` color, not with shadows or background blocks. Depth is reserved for the small set of elements in Elevation & Depth.

## Typography

**Display Font:** Archivo (weight 700–800), with system-ui, sans-serif fallback
**Body Font:** IBM Plex Sans (weight 400–500), with system-ui, sans-serif fallback
**Label/Mono Font:** IBM Plex Mono (weight 400–500), with ui-monospace, monospace fallback

**Character:** A heavy, tightly-tracked grotesk for statements (names, headings) paired with a plain humanist sans for reading, and monospace for everything that behaves like metadata or system output. The pairing reads as "engineered," not editorial.

### Hierarchy
- **Display** (800, `clamp(52px, 9vw, 120px)`, line-height 0.92, letter-spacing -0.04em): The hero name/headline only (`h1`). Tightest tracking in the system.
- **Headline** (800, `clamp(28px, 4.4vw, 44px)`, letter-spacing -0.03em): Section headings (`.sec-head h2`). The contact section scales this up to `clamp(32px, 6vw, 64px)` at letter-spacing -0.035em as its own emphasis moment.
- **Title** (700, 19–21px, letter-spacing -0.01em to -0.02em): Project card titles, education entry titles.
- **Body** (400–500, 14.5–17px, line-height 1.65): Paragraph copy across About, project descriptions, education notes. Long-form text stays under ~44ch (`.hero-note`, `.contact-note`).
- **Label** (400–500, 9–12.5px, letter-spacing 0.03em–0.16em, uppercase): All monospace usage — nav links, tags, stat captions, role lines, feature pills, footer marks. Uppercase + wide tracking is the system's consistent "this is metadata" signal.

### Named Rules
**The Mono-Means-Metadata Rule.** Monospace type is reserved for labels, meta, and system-style text (tags, roles, stats, nav, footer) — never for body prose or headings. If it's monospace, it's not the main content.

## Layout

Single-column content max-width of 1200px, centered, with fluid outer gutters (`clamp(20px, 5vw, 72px)`) that scale from 20px on small screens to 72px on wide viewports. Sections stack vertically, each separated by a hairline top border and 100px of vertical padding — a consistent rhythm rather than variable whitespace.

The hero is the one asymmetric layout: a 3-column grid (`1.3fr .55fr .45fr` — copy, emblem, stats) that collapses to a single stacked column under 900px. The project grid is 3 columns down to 900px, then 1 column. About and Contact use 2-column grids (1:1 and 1.2:1) that collapse to 1 column at 760px. Hero stats switch from a bordered vertical list to a wrapped horizontal row on mobile.

## Elevation & Depth

The system is flat at rest — nearly everything is separated by hairline borders, not shadows. Depth appears only as soft, wide, low-opacity **ambient glow** on two elements: the hero emblem and project cards on hover. These shadows are large-blur, negative-spread, and often red-tinted, reading as light emission rather than physical material lift.

### Shadow Vocabulary
- **Emblem glow** (`box-shadow: 0 24px 60px -22px rgba(255,51,85,.45), inset 0 1px 0 rgba(255,255,255,.05)`): Sits under the hero emblem at rest — a permanent soft red aura plus a faint inner highlight for glass-like depth.
- **Card rest shadow** (`box-shadow: 0 30px 60px -40px rgba(0,0,0,.7)`): Neutral, very soft black shadow under project cards at rest — barely perceptible separation from the void background.
- **Card hover glow** (`box-shadow: 0 34px 70px -32px rgba(255,51,85,.28)`): Replaces the rest shadow on hover, shifting the ambient light from neutral to red alongside a -4px translateY lift and a red border.

### Named Rules
**The Ambient-Not-Material Rule.** Where depth exists, it reads as glow (wide blur, low opacity, often color-tinted) rather than a crisp material shadow. Hairlines carry structure; glow carries the rare moment of emphasis.

## Shapes

Two corner languages coexist deliberately: small **card radius** (6px, `.pcard`) and **tag radius** (2px, `.pstatus`) read as precise/technical, while **pill radius** (20px, fully rounded) is reserved for tag-like chips (`.pfeatures span`, `.pills span`) to visually distinguish "a piece of metadata" from "a container." The hero emblem uses a squircle-like 22% border-radius, the one organic shape in an otherwise rectilinear system. Borders are uniformly 1px hairline; there is no heavier border weight anywhere in the system.

## Components

### Buttons
There is no traditional filled button in the current implementation — interactive affordances are links, pills, and cards. If a filled button is introduced, it should follow **Card Project**'s surface logic: `panel-charcoal` background, hairline border, `signal-red` border/glow on hover, never a red fill.

### Navigation
- **Style:** Mono label type, uppercase-by-convention (though current labels are sentence case), `slate-muted` at rest.
- **Hover:** Text shifts to `off-white-ink`; a 1px red underline animates in from 0 to full width (`transition: width .25s ease`).
- **Mobile:** Nav links are hidden entirely under 900px — no hamburger/drawer exists yet.

### Cards / Containers
- **Corner Style:** 6px radius (`rounded.card`).
- **Background:** `panel-charcoal`, with the media area using a diagonal charcoal gradient (`linear-gradient(155deg, #1B1C22, #101116)`).
- **Shadow Strategy:** See Elevation & Depth — soft black at rest, red ambient glow + border-color shift + -4px lift on hover.
- **Border:** 1px hairline at rest, 1px `signal-red` on hover.
- **Internal Padding:** `20px 22px 24px` for the body region.

### Pills / Tags
- **Style:** Fully rounded (20px), hairline border, `panel-charcoal` or transparent-white-tint background, mono label type.
- **State:** On hover (`.pills span`), border and text shift to `signal-red` with a faint red-tinted background wash (`rgba(255,51,85,.08)`).

### Status Badge
- **Style:** 2px radius, 1px solid `signal-red` border, red text, translucent void-black background (`rgba(11,11,16,.85)`) — reads as an overlay chip on media, not a surface-level pill.

### Signature Component: Ghost Watermark
An oversized (`clamp(90px, 19vw, 280px)`), stroke-only (no fill) headline sits behind the hero content at low opacity, using the same Display font. It establishes scale and brand presence without competing with the real hero heading, and is hidden entirely under 640px where the space can't support it.

## Do's and Don'ts

### Do:
- **Do** keep Signal Red to a single accent role — text, thin border/stroke, dot, or glow. (The One Signal Rule.)
- **Do** build structure with 1px hairline borders/dividers before reaching for a shadow or background block.
- **Do** reserve monospace type for labels and metadata, never for headings or body prose. (The Mono-Means-Metadata Rule.)
- **Do** keep shadows soft, wide, and low-opacity — glow, not material lift. (The Ambient-Not-Material Rule.)
- **Do** respect `prefers-reduced-motion` for every transition, animation, and the scroll-reveal system.

### Don't:
- **Don't** use Signal Red as a large fill or background color anywhere.
- **Don't** introduce a second accent color; the system is deliberately single-accent.
- **Don't** apply the 20px pill radius to structural containers (cards, panels) — it's reserved for tag/chip-like elements only.
- **Don't** add hard, dark, high-opacity drop shadows; they break the ambient-glow depth language.
- **Don't** set body copy or headings in the mono font family.
