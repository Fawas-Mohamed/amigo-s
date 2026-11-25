import { useState } from "react";
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
  return (
    <div className="ad">
      <aside className={"ad-side" + (open ? " open" : "")}>
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
      {open && <div className="ad-shade" onClick={() => setOpen(false)} />}
      <div className="ad-main">
        <header className="ad-top"><button className="ad-burger" onClick={() => setOpen(true)} aria-label="Open menu">☰</button><h1>{title}</h1>
          <div className="ad-me"><span>Shop owner</span><b>A</b></div></header>
        <div className="ad-page"><Outlet /></div>
      </div>
      <Toaster />
    </div>
  );
}
