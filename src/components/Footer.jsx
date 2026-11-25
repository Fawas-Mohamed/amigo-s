import { Link } from "react-router-dom";
import { useShop } from "../store.js";

export default function Footer() {
  const SHOP = useShop().settings;
  return (
    <footer className="footer" id="contact">
      <div className="foot-grid">
        <div><div className="nav-logo big">Amigo’s</div><p>{SHOP.address}</p><p>{SHOP.hours}</p></div>
        <div><h5>Explore</h5><Link to="/menu">Menu</Link><Link to="/about">About us</Link><Link to="/#story">Our ritual</Link><Link to="/admin">Admin login</Link></div>
        <div><h5>Contact</h5><a href={`https://wa.me/${SHOP.phone}`}>{SHOP.phoneLabel}</a><a href={SHOP.instagramUrl}>Instagram</a></div>
        <form className="foot-news" onSubmit={(e) => { e.preventDefault(); e.target.reset(); }}>
          <h5>Exclusive updates</h5><input type="email" required placeholder="Your email" aria-label="Email" /><button className="pill orange">Subscribe</button>
        </form>
      </div>
      <p className="copy">© {new Date().getFullYear()} {SHOP.name} All rights reserved.</p>
    </footer>
  );
}
