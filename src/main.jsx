import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import App from "./App.jsx";
import Menu from "./pages/Menu.jsx";
import About from "./pages/About.jsx";
import AdminRoutes from "./admin/index.jsx";
import "./styles.css";

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) { const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" }), 60); return () => clearTimeout(t); }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ScrollManager />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/about" element={<About />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  </BrowserRouter>
);
