import { useState } from "react";
import { Link } from "react-router-dom";
import { useShop, money } from "../store.js";

export default function Products() {
  const { products, settings } = useShop();
  const [added, setAdded] = useState({});
  const live = products.filter((p) => p.status === "active");
  const shown = (live.some((p) => p.featured) ? live.filter((p) => p.featured) : live).slice(0, 8);
  const order = (p) => {
    setAdded((a) => ({ ...a, [p.id]: true }));
    const msg = `Hello! I'd like to order: ${p.name} (${money(p.price, settings.currency)})`;
    window.open(`https://wa.me/${settings.phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };
  return (
    <section className="sec" id="products">
      <div className="head-c"><span className="eyebrow">✿ Signature picks</span><h2 className="serif">Crafted for the Season</h2><p>Our most-loved drinks, ready when you are.</p></div>
      <div className="prods">
        {shown.map((p) => (
          <article className="prod" key={p.id}>
            <div className="prod-img"><img src={p.image} alt={p.name} loading="lazy" /><span className="prod-icon">✦</span></div>
            <h4>{p.name}</h4><p>{p.desc}</p>
            <div className="prod-row"><b>{money(p.price, settings.currency)}</b>
              <button className="plus" disabled={p.stock === 0} aria-label={p.stock === 0 ? `${p.name} is out of stock` : `Order ${p.name} on WhatsApp`} onClick={() => order(p)}>{p.stock === 0 ? "–" : added[p.id] ? "✓" : "+"}</button>
            </div>
          </article>
        ))}
      </div>
      <div className="center-cta"><Link className="pill dark" to="/menu">View full menu ↗</Link></div>
      <svg width="0" height="0" aria-hidden="true"><defs><clipPath id="wave" clipPathUnits="objectBoundingBox"><path d="M0,0.12 C0.12,0 0.22,0.08 0.34,0.05 C0.5,0.01 0.62,0.1 0.76,0.05 C0.88,0.01 0.95,0.03 1,0.09 L1,1 L0,1 Z" /></clipPath></defs></svg>
    </section>
  );
}
