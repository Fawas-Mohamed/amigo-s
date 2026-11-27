import { Link } from "react-router-dom";
import { useShop } from "../store.js";

export default function Footer() {
  const SHOP = useShop().settings;
  return (
    <footer className="footer" id="contact">
      <div className="foot-grid">
        <div className="foot-brand">
          <div className="foot-brand-name">AMIGO'S</div>
          <p>Artisan bakery &amp; caf&eacute; in Trincomalee, Sri Lanka. Slow bread, honest coffee.</p>
                    <Link to="/admin" className="footer-admin-link">Admin Login</Link>
        </div>
        <div className="foot-links">
          <h5>Explore</h5>
          <Link to="/menu">Menu</Link>
          <Link to="/about">Our Story</Link>
          <Link to="/menu#products">Shop</Link>
        </div>
        <div className="foot-links">
          <h5>Follow</h5>
          <a href={SHOP.instagramUrl}>Instagram</a>
          <a href={`https://wa.me/${SHOP.phone}`}>WhatsApp</a>

        </div>
        <div className="foot-visit">
          <h5>Visit</h5>
          <p>{SHOP.address}</p>
          <p>{SHOP.hours}</p>
        </div>
      </div>
      <div className="foot-wordmark" aria-hidden="true">AMIGO'S</div>
      <p className="copy">&copy; {new Date().getFullYear()} {SHOP.name}. All rights reserved.</p>
    </footer>
  );
}