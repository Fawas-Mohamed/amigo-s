import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { HERO } from "../data.js";
import { useShop } from "../store.js";
import Nav from "./Nav.jsx";

export default function Hero() {
  const SHOP = useShop().settings;
  const wordmarkRef = useRef(null);

  useLayoutEffect(() => {
    const title = wordmarkRef.current;
    if (!title) return undefined;

    const fitText = () => {
      title.style.fontSize = "";
      title.style.whiteSpace = "";
      const styles = window.getComputedStyle(title);
      const baseSize = Number.parseFloat(styles.fontSize);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context || !baseSize) return;
      context.font = styles.font;
      const text = title.textContent || "";
      const spacing = Number.parseFloat(styles.letterSpacing) || 0;
      const measured = context.measureText(text).width + spacing * Math.max(0, text.length - 1);
      const available = title.clientWidth;
      if (measured > available && measured > 0) {
        title.style.whiteSpace = "normal";
        const targetLines = window.innerWidth <= 640 ? 3 : 2;
        const minimumSize = window.innerWidth <= 640 ? 32 : 44;
        const fittedSize = Math.max(minimumSize, baseSize * Math.min(1, available * targetLines / measured));
        title.style.fontSize = fittedSize + "px";
      }
    };

    fitText();
    const observer = "ResizeObserver" in window ? new ResizeObserver(fitText) : null;
    if (observer) observer.observe(title.parentElement);
    window.addEventListener("resize", fitText);
    document.fonts?.ready.then(fitText);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", fitText);
    };
  }, [SHOP.name]);

  return (
    <header className="hero" id="top">
      <Nav />
      <h1 ref={wordmarkRef} className="wordmark" aria-label={SHOP.name}>{SHOP.name.toUpperCase()}</h1>
      <div className="hero-stage">
        <img className="hero-img" src={HERO.image} alt="Inside the coffee house" />
        <article className="float-card">
          <img src={HERO.card.image} alt="" />
          <div className="fc-top"><h3>{HERO.card.title}</h3><b>{HERO.card.price}</b></div>
          <p>{HERO.card.meta}</p>
          <div className="fc-btns"><Link className="pill ghost-d" to="/menu">View Menu</Link><a className="pill orange" href={"https://wa.me/" + SHOP.phone} target="_blank" rel="noreferrer">Order Now</a></div>
        </article>
        <div className="hero-copy">
          <p>{HERO.text}</p>
          <div className="row">
            <Link className="pill outline" to="/menu">Explore Menu &#8599;</Link>
            <Link className="pill orange" to="/about">Our Story &#8599;</Link>
          </div>
        </div>
      </div>
    </header>
  );
}