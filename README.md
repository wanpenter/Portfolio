# Portfolio

Portfolio peribadi untuk pelajar Game Technology — memaparkan gameplay programming,
3D asset, dan prototaip game dalam satu halaman single-page.

## Tech Stack

- **Plain HTML/CSS/JS** — tiada framework, tiada build step
- Semua CSS dan JS ditulis inline dalam `index (1).html` (guna tag `<style>` dan `<script>`)
- **Google Fonts** (Archivo, IBM Plex Sans, IBM Plex Mono) dimuatkan terus dari CDN
- Tiada dependency, tiada `package.json`, tiada langkah `npm install` / `build`

## Struktur Fail

```
Portfolio/
├── index (1).html   # Seluruh laman — markup, styling, dan logic dalam satu fail
├── clip.mp4          # Video/klip dirujuk dalam bahagian showcase
└── README.md
```

## Deploy (Netlify)

Repo ini di-deploy secara auto ke Netlify setiap kali ada push ke branch `main`:

1. Sambungkan repo GitHub ni ke Netlify (New site from Git → pilih repo `Portfolio`)
2. Build command: kosongkan (tiada build step)
3. Publish directory: `.` (root repo)
4. Setiap push ke `main` akan trigger deploy baru secara automatik

Tiada konfigurasi `netlify.toml` diperlukan buat masa ini kerana laman ini statik sepenuhnya.
