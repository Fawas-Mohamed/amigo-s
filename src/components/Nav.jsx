import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useShop } from "../store.js";

export default function Nav() {
  const { settings } = useShop();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector("a")?.focus();

    const close = () => {
      setOpen(false);
      window.requestAnimationFrame(() => toggleRef.current?.focus());
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };
    const onResize = () => {
      if (window.innerWidth > 640) setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search, location.hash]);

  const closeOnNavigate = () => setOpen(false);

  return (
    <nav className="nav" aria-label="Main">
      <div className="nav-l">
        <NavLink to="/menu">Menu</NavLink><NavLink to="/about">About</NavLink>
        <Link to="/#story">Our ritual</Link><Link to="/#instagram">Gallery</Link>
      </div>
      <Link to="/" className="nav-logo">{settings.name}</Link>
      <div className="nav-r">
        <Link to="/#contact">Find us &#x2316;</Link>
        <a className="pill dark" href={"https://wa.me/" + settings.phone} target="_blank" rel="noreferrer">Order Now</a>
      </div>
      <button
        ref={toggleRef}
        type="button"
        className="nav-toggle"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">{open ? "\u00d7" : "\u2630"}</span>
      </button>
      {open && (
        <div id="mobile-navigation" className="nav-mobile" ref={panelRef}>
          <Link to="/" onClick={closeOnNavigate}>Home</Link>
          <Link to="/menu" onClick={closeOnNavigate}>Menu</Link>
          <Link to="/about" onClick={closeOnNavigate}>About</Link>
          <Link to="/#story" onClick={closeOnNavigate}>Our ritual</Link>
          <Link to="/#instagram" onClick={closeOnNavigate}>Gallery</Link>
          <Link to="/#contact" onClick={closeOnNavigate}>Find us</Link>
          <a className="pill dark" href={"https://wa.me/" + settings.phone} target="_blank" rel="noreferrer">Order Now</a>
        </div>
      )}
    </nav>
  );
}
