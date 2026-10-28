import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

const root = document.getElementById("root")!;

// Public pages arrive pre-rendered (scripts/prerender.mjs); the portal does not
if (root.firstElementChild) {
  hydrateRoot(root, <App />);
} else {
  createRoot(root).render(<App />);
}
