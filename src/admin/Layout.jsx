import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { useShop } from "../store.js";
import { Toaster } from "./ui.jsx";

const NAV = [
  ["/admin", "Dashboard", "▦", true], ["/admin/products", "Menu items", "◇"], ["/admin/categories", "Categories", "❖"],
  ["/admin/orders", "Orders", "✉"], ["/admin/customers", "Customers", "☺"], ["/admin/settings", "Settings", "⚙"],
];

export default function Layout({ onLogout }) {
  const { orders, settings } = useShop();
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const title = (NAV.find(([to]) => to === loc.pathname) || NAV[0])[1];
  const pending = orders.filter((o) => o.status === "Pending").length;
  const sidebarRef = useRef(null);
  const burgerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sidebarRef.current?.querySelector("a")?.focus();

    const close = () => {
      setOpen(false);
      window.requestAnimationFrame(() => burgerRef.current?.focus());
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...sidebarRef.current.querySelectorAll("a[href], button:not([disabled])")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!sidebarRef.current.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth > 820) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [loc.pathname, loc.search, loc.hash]);
  return (
    <div className="ad">
      <aside id="admin-side" ref={sidebarRef} aria-label="Admin navigation" className={"ad-side" + (open ? " open" : "")}>
        <div className="ad-logo">{settings.name} <small>Admin</small></div>
        <nav>
          {NAV.map(([to, label, icon, end]) => (
            <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)} className={({ isActive }) => "ad-nav" + (isActive ? " on" : "")}>
              <i>{icon}</i>{label}{label === "Orders" && pending > 0 && <em>{pending}</em>}
            </NavLink>
          ))}
        </nav>
        <div className="ad-side-f"><Link to="/" className="ad-nav"><i>↗</i>View store</Link><button className="ad-nav" onClick={onLogout}><i>⎋</i>Sign out</button></div>
      </aside>
      {open && <button type="button" className="ad-shade" aria-label="Close admin menu" onClick={() => setOpen(false)} />}
      <div className="ad-main">
        <header className="ad-top"><button ref={burgerRef} type="button" className="ad-burger" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} aria-controls="admin-side">☰</button><h1>{title}</h1>
          <div className="ad-me"><span>Shop owner</span><b>A</b></div></header>
        <div className="ad-page"><Outlet /></div>
      </div>
      <Toaster />
    </div>
  );
}
