# DevEdge Solutions - Official Website

The official website for **DevEdge Solutions**, an Australian software development agency linking ideas to execution.

## 🚀 The Redesign

This project has been completely re-designed from the ground up as an immersive, highly interactive vertical presentation web application. It features a custom premium design system, smooth scroll-snapping mechanics, and dynamic micro-animations.

**Live Site:** [https://devedge.com.au](https://devedge.com.au)

## 🛠 Tech Stack

*   **Framework:** [React 19](https://react.dev/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
*   **Routing:** [Wouter](https://github.com/molefrog/wouter)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **UI Primitives:** [Radix UI](https://www.radix-ui.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)

## 📂 Project Structure

```
devedge-website/
├── client/
│   ├── public/          # Static assets (images, robots.txt, sitemap.xml)
│   ├── src/
│   │   ├── components/  # Core UI components
│   │   │   ├── slides/  # Vertical snap slides (Hero, Problem, Services, etc.)
│   │   │   └── ui/      # Radix UI implementations
│   │   ├── contexts/    # React contexts (Theme, Auth)
│   │   ├── pages/       # Route views (Home, Adminashboard, ClientPortal, etc.)
│   │   ├── lib/         # Utility functions
│   │   ├── App.tsx      # Main application router
│   │   └── index.css    # Global styles & Tailwind configuration
├── server/              # Backend services 
└── package.json         # Dependencies and scripts
```

## ⚡ Key Features

*   **Slide-based Navigation:** Desktop users experience a full-screen, snap-scroll journey across 9 distinct slides outlining the DevEdge philosophy and services.
*   **Interactive UI Elements:** Mouse-reactive parallax effects, simulated code terminals, smooth modal transitions, and dynamic progress indicators.
*   **Secure Client Portals:** Dedicated internal sections for authorized client access and admin management.
*   **Responsive Design:** Flawless adaptation from full presentation mode on Desktop to standard responsive scrolling flow on Mobile.
*   **SEO & Analytics:** Enhanced meta tags and structured data for optimal search presence.

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

4.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Building for Production

To create a production-ready build:

```bash
pnpm build
```

The output files will be in the `dist` directory, ready to be deployed to any static hosting provider.

## 📄 License

Proprietary software. All rights reserved by **DevEdge Solutions**.
