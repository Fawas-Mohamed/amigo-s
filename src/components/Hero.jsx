import { Link } from "react-router-dom";
import { HERO } from "../data.js";
import { useShop } from "../store.js";
import Nav from "./Nav.jsx";

export default function Hero() {
  const SHOP = useShop().settings;
  return (
    <header className="hero" id="top">
      <Nav />
      <h1 className="wordmark" aria-label={SHOP.name}>{SHOP.name.toUpperCase()}</h1>
      <div className="hero-stage">
        <img className="hero-img" src={HERO.image} alt="Inside the coffee house" />
        <article className="float-card">
          <img src={HERO.card.image} alt="" />
          <div className="fc-top"><h3>{HERO.card.title}</h3><b>{HERO.card.price}</b></div>
          <p>{HERO.card.meta}</p>
          <div className="fc-btns"><Link className="pill ghost-d" to="/menu">View Menu</Link><a className="pill orange" href={`https://wa.me/${SHOP.phone}`} target="_blank" rel="noreferrer">Order Now</a></div>
        </article>
        <div className="hero-copy">
          <p>{HERO.text}</p>
          <div className="row">
            <Link className="pill outline" to="/menu">Explore Menu ↗</Link>
            <Link className="pill orange" to="/about">Our Story ↗</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
