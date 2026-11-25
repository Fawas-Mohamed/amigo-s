import { Link, NavLink } from "react-router-dom";
import { useShop } from "../store.js";

export default function Nav() {
  const { settings } = useShop();
  return (
    <nav className="nav" aria-label="Main">
      <div className="nav-l">
        <NavLink to="/menu">Menu</NavLink><NavLink to="/about">About</NavLink>
        <Link to="/#story">Our ritual</Link><Link to="/#instagram">Gallery</Link>
      </div>
      <Link to="/" className="nav-logo">{settings.name}</Link>
      <div className="nav-r">
        <Link to="/#contact">Find us ⌖</Link>
        <a className="pill dark" href={`https://wa.me/${settings.phone}`} target="_blank" rel="noreferrer">Order Now</a>
      </div>
    </nav>
  );
}
