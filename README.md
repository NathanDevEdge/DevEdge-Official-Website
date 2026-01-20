# DevEdge Solutions - Official Website

The official website for **DevEdge Solutions**, a premier Australian software development agency linking ideas to execution.

## 🚀 Project Overview

This project is a high-performance, static landing page built with modern web technologies. It features a custom "Modern Engineering" design aesthetic, fully responsive layout, and comprehensive SEO optimization.

**Live Site:** [https://devedge.com.au](https://devedge.com.au)

## 🛠 Tech Stack

*   **Framework:** [React 19](https://react.dev/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
*   **Routing:** [Wouter](https://github.com/molefrog/wouter)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Animations:** CSS Transitions & Tailwind Animate

## 📂 Project Structure

```
devedge-website/
├── client/
│   ├── public/          # Static assets (images, robots.txt, sitemap.xml)
│   ├── src/
│   │   ├── components/  # Reusable UI components (Hero, Navigation, etc.)
│   │   ├── pages/       # Page views (Home, NotFound)
│   │   ├── lib/         # Utility functions
│   │   ├── App.tsx      # Main application entry & routing
│   │   └── index.css    # Global styles & Tailwind configuration
├── server/              # (Optional) Backend placeholder
└── package.json         # Dependencies and scripts
```

## ⚡ Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   pnpm (v9 or higher)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/YOUR_USERNAME/DevEdge-Official-Website.git
    cd DevEdge-Official-Website
    ```

2.  Install dependencies:
    ```bash
    pnpm install
    ```

3.  Start the development server:
    ```bash
    pnpm dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Building for Production

To create a production-ready build:

```bash
pnpm build
```

The output files will be in the `dist` directory, ready to be deployed to any static hosting provider (Vercel, Netlify, Cloudflare Pages, etc.).

## 🎨 Design System

*   **Primary Font:** Space Grotesk (Headings)
*   **Secondary Font:** Inter (Body)
*   **Colors:**
    *   Background: `#050505` (Deep Black)
    *   Text: `#FFFFFF` (White)
    *   Accent: `#8B5CF6` (Light Purple)

## 🔍 SEO & Analytics

*   **Meta Tags:** Fully optimized for "Custom Software & Web Development Australia".
*   **Open Graph:** Custom social preview images included.
*   **Structured Data:** JSON-LD schema for `ProfessionalService`.
*   **Sitemap:** Auto-generated at `/sitemap.xml`.

## 📄 License

Proprietary software. All rights reserved by **DevEdge Solutions**.
