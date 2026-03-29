# Rumi — 3D AI Portfolio

A modern, fully responsive 3D portfolio website built with **Three.js**, **GSAP**, and **Glassmorphism** design.

## ✨ Features

- 🎮 **Interactive 3D Hero** — Floating particles & geometric shapes with mouse parallax (Three.js)
- ⌨️ **Typing Effect** — Animated role subtitle
- 🌗 **Dark / Light Mode** toggle
- 🎯 **Scroll Reveal** animations on all sections
- 📊 **Animated Skill Bars** and stat counters
- 🃏 **3D Card Tilt** on project hover (mousemove perspective)
- 🖱️ **Custom Cursor** with smooth follower
- 📱 **Fully Mobile Responsive**
- 🧭 **Smooth scrolling** navbar with active section tracking

## 📂 Structure

```
rumi/
├── index.html          ← All sections (Hero, About, Projects, Experience, Skills, Contact)
├── css/
│   └── style.css       ← Full styles (glassmorphism, animations, responsive, dark/light)
├── js/
│   ├── three-scene.js  ← Three.js 3D hero canvas + skills canvas
│   ├── cursor.js       ← Custom cursor with follower
│   └── main.js         ← GSAP, typing, scroll-reveal, theme, form, tilt
└── README.md
```

## 🚀 Deploy on GitHub Pages

1. Push this folder to a GitHub repository
2. Go to **Settings → Pages → Source: main branch / root**
3. Your portfolio is live! ✅

## 🛠 Tech Stack

| Tech | Purpose |
|------|---------|
| HTML5 + CSS3 | Structure & styles |
| Three.js | 3D hero canvas + skills animation |
| GSAP 3 | Hero entrance animations |
| Font Awesome | Icons |
| Google Fonts | Outfit + JetBrains Mono |
| Intersection Observer API | Scroll-triggered animations |
