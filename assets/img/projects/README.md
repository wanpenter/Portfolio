# Project screenshots

Drop project images here. One pair per project, same basename:

```
vaultbreak.webp     vaultbreak.jpg
ipetro.webp         ipetro.jpg
workshop-system.webp  workshop-system.jpg
```

## Requirements

| | |
|---|---|
| **Aspect ratio** | 16:9 — export at **1600 × 900** |
| **Formats** | `.webp` (served first) plus a `.jpg` fallback |
| **Weight** | aim under 200 KB each; the site has no build step, so nothing compresses them for you |

The card slot itself is 4:3, so a 16:9 image is centre-cropped by
`object-fit:cover`. Keep the subject away from the left and right edges.

## Turning a slot on

In `index.html`, each project card has a commented `<picture>` block directly
above its `<svg class="pcard-motif">`. To switch a card over to a real image:

1. Uncomment the `<picture>` block.
2. Delete the `<svg class="pcard-motif">` element below it.
3. Replace the `TODO` in the `alt` attribute with a real description of what
   the screenshot shows — not the project name, which is already in the
   heading right beneath it.

`loading="lazy"` is already set on every card; the cards sit below the fold.
The `--img-ph` placeholder colour is painted on `.pcard-media`, so the slot
holds its shape and colour while the file decodes.
