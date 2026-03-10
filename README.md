<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/GSAP-3-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP" />
  <img src="https://img.shields.io/badge/Three.js-r168-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

# ✨ Maowiz — AI/ML Engineer Portfolio

> A **premium, award-winning personal portfolio** built with React, Vite, GSAP, and WebGL — designed to impress CTOs, hiring managers, and recruiters at first glance.

<p align="center">
  <strong>🔗 <a href="#">Live Demo</a></strong> &nbsp;·&nbsp;
  <strong>📄 <a href="https://linkedin.com/in/muhammad-maowiz-saleem-0700272b1">LinkedIn</a></strong> &nbsp;·&nbsp;
  <strong>📬 maowizsaleem009@gmail.com</strong>
</p>

---

## 🎯 Overview

This is my personal portfolio website, engineered to stand out in a sea of generic templates. Every design decision — from the warm dark color palette to the purposeful animations — is crafted to communicate **technical depth, professionalism, and craft**.

### Why This Portfolio Stands Out

| Feature | Detail |
|---|---|
| **WebGL Backgrounds** | 4 distinct animated backgrounds (LaserFlow, LetterGlitch, GridScan, Particles) — each confined to its own section for performance |
| **Impact-First Copy** | Every bullet point leads with quantifiable results, not generic descriptions |
| **WCAG AA Accessible** | All text meets 4.5:1 contrast ratios on the dark background |
| **Smooth Scroll** | Lenis-powered locomotion with GSAP ScrollTrigger reveals |
| **Responsive** | Mobile-first design that works flawlessly across all breakpoints |
| **Fast** | Vite-powered HMR, lazy-loaded images, GPU-accelerated animations |

---

## 🖼️ Sections

| # | Section | Background Effect | Description |
|---|---------|-------------------|-------------|
| 1 | **Hero** | `LaserFlow` (Three.js) | Name, title, tagline, resume CTA, and animated stats |
| 2 | **About** | — | ScrollReveal-powered summary with blur-in text |
| 3 | **Experience** | `LetterGlitch` | Timeline of work experience with impact-first highlights |
| 4 | **Projects** | — | Full-width cards with real screenshots, metrics, and tech stacks |
| 5 | **Skills** | `GridScan` | Categorized bento cards + LogoLoop marquee |
| 6 | **Credentials** | — | Education & certifications with large visual cards |
| 7 | **Contact** | `Particles` (OGL WebGL) | CTA with email, LinkedIn, GitHub, and resume links |

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | React 19 + Vite 6 |
| **Styling** | Tailwind CSS v4 + Custom CSS Design System |
| **Animations** | GSAP 3 + ScrollTrigger + Lenis Smooth Scroll |
| **WebGL** | Three.js (LaserFlow) · OGL (Particles) |
| **Components** | TiltedCard · DecryptedText · ScrollReveal · AnimatedCounter · LogoLoop · Dock |
| **Icons** | react-icons (Feather set) |
| **Fonts** | Inter · JetBrains Mono (Google Fonts) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/maowiz/My_Portfolio.git
cd My_Portfolio

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at **http://localhost:5173**

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder, ready for deployment to Vercel, Netlify, or any static host.

---

## 📁 Project Structure

```
maowiz-portfolio/
├── public/
│   └── assets/              # Images, resume PDF, project screenshots
│       ├── profile.jpeg     # Profile photo
│       ├── retailflow.png   # Project screenshot
│       ├── ulton.png        # Project screenshot
│       ├── botm.jpg         # Project screenshot
│       ├── comsats.png      # University logo
│       ├── IBM.jpg          # IBM certification
│       ├── kaggle.jpg       # Kaggle certification
│       └── maowiz_resume.pdf
├── src/
│   ├── components/
│   │   ├── Counter/         # GSAP-powered animated number counter
│   │   ├── DecryptedText/   # Text decryption reveal effect
│   │   ├── Dock/            # macOS-style bottom navigation dock
│   │   ├── GridScan/        # Animated grid + scan line background
│   │   ├── LaserFlow/       # Three.js laser beam hero background
│   │   ├── LetterGlitch/    # Glitching letter matrix background
│   │   ├── LogoLoop/        # Infinite logo marquee scroller
│   │   ├── Particles/       # OGL WebGL particle field
│   │   ├── ScrollReveal/    # Word-by-word scroll reveal text
│   │   └── TiltedCard/      # 3D tilt-on-hover card component
│   ├── App.jsx              # Main application — all sections
│   ├── data.js              # Portfolio content (experience, projects, etc.)
│   ├── index.css            # Design system (tokens, layout, components)
│   └── main.jsx             # React entry point
├── index.html               # HTML entry point
├── vite.config.js           # Vite configuration
├── package.json
├── .gitignore
├── LICENSE                  # MIT License
└── README.md
```

---

## 🎨 Design System

The portfolio uses a custom **warm dark design system** with these core tokens:

| Token | Value | Purpose |
|-------|-------|---------|
| `--bg-base` | `#0c0c0c` | Page background |
| `--bg-elevated` | `#141414` | Cards, modals |
| `--bg-card` | `#1a1a1a` | Interactive cards |
| `--text-primary` | `#f0f0f0` | Headings (15.3:1 contrast) |
| `--text-secondary` | `#a8a8b3` | Body text (6.8:1 contrast) |
| `--accent` | `#8B5CF6` | Purple accent color |
| Spacing | 8px base grid | `--sp-1` (4px) through `--sp-32` (128px) |
| Typography | Inter + JetBrains Mono | Clean sans-serif + monospace code |

---

## 📊 Performance

- **Single WebGL per viewport** — only one background is active at a time as the user scrolls
- **Lazy-loaded images** — project screenshots load on demand
- **GPU-accelerated animations** — all transforms use `transform` and `opacity` only
- **Lenis smooth scroll** — 60fps scroll with GSAP ticker integration
- **Code-split ready** — Vite's built-in chunking for production builds

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel --prod
```

### Netlify

```bash
npm run build
# Drag & drop the dist/ folder to Netlify
```

### GitHub Pages

```bash
npm run build
# Deploy the dist/ folder using gh-pages or Actions
```

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contact

| Channel | Link |
|---------|------|
| **Email** | maowizsaleem009@gmail.com |
| **LinkedIn** | [Muhammad Maowiz Saleem](https://linkedin.com/in/muhammad-maowiz-saleem-0700272b1) |
| **GitHub** | [maowiz](https://github.com/maowiz) |

---

<p align="center">
  <sub>Designed & built with precision by <strong>Muhammad Maowiz Saleem</strong> · © 2026</sub>
</p>
