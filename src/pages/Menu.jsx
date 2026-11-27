import { useEffect, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useShop, money } from "../store.js";
import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";

export default function Menu() {
  const { products, categories, settings } = useShop();
  const [params, setParams] = useSearchParams();
  const cat = params.get("cat") || "All";
  const [q, setQ] = useState("");
  const [cart, setCart] = useState({});
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const openerRef = useRef(null);
  const closeRef = useRef(null);
  const drawerRef = useRef(null);

  const closeDrawer = () => {
    setOpen(false);
    window.requestAnimationFrame(() => openerRef.current?.focus());
  };

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        window.requestAnimationFrame(() => openerRef.current?.focus());
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...drawerRef.current.querySelectorAll("button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!drawerRef.current.contains(document.activeElement)) {
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
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search, location.hash]);
  const cur = settings.currency;

  const live = products.filter((p) => p.status === "active");
  const cats = categories.filter((c) => c.active);
  const sections = cats
    .filter((c) => cat === "All" || c.name === cat)
    .map((c) => ({ ...c, items: live.filter((p) => p.category === c.name && (p.name + p.desc).toLowerCase().includes(q.toLowerCase())) }))
    .filter((s) => s.items.length);

  const lines = live.filter((p) => cart[p.id]);
  const count = lines.reduce((n, p) => n + cart[p.id], 0);
  const total = lines.reduce((s, p) => s + p.price * cart[p.id], 0);
  const add = (id, d = 1) => setCart((c) => { const n = { ...c, [id]: (c[id] || 0) + d }; if (n[id] <= 0) delete n[id]; return n; });
  const send = () => {
    const msg = `Hello ${settings.name}! I'd like to order:\n` + lines.map((p) => `• ${p.name} x${cart[p.id]}`).join("\n") + `\nTotal: ${money(total, cur)}`;
    window.open(`https://wa.me/${settings.phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <>
      <div className="subhead"><Nav /></div>
      <main className="sec menu-page">
        <div className="page-title">
          <span className="eyebrow">✿ Fresh every day</span>
          <h1 className="serif">The Menu</h1>
          <p>Coffee, tea, cold drinks and warm bakes. Tap + to build your order and send it to us on WhatsApp.</p>
        </div>

        <div className="menu-tabs">
          <div className="insta-tabs">
            {["All", ...cats.map((c) => c.name)].map((n) => (
              <button key={n} className={"chip" + (n === cat ? " on" : "")} onClick={() => setParams(n === "All" ? {} : { cat: n })}>{n}</button>
            ))}
          </div>
          <input className="menu-search" type="search" placeholder="Search the menu" aria-label="Search the menu" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        {sections.length === 0 && <p className="menu-empty">Nothing matches “{q}”. Try another word or category.</p>}
        {sections.map((s) => (
          <section className="menu-sec" key={s.id}>
            <h2 className="serif">{s.name}<small>{s.items.length} {s.items.length === 1 ? "item" : "items"}</small></h2>
            <div className="prods">
              {s.items.map((p) => (
                <article className="prod" key={p.id}>
                  <div className="prod-img"><img src={p.image} alt={p.name} loading="lazy" />{p.stock === 0 && <span className="sold">Sold out</span>}</div>
                  <h4>{p.name}</h4><p>{p.desc}</p>
                  <div className="prod-row"><b>{money(p.price, cur)}</b>
                    <button className="plus" disabled={p.stock === 0} aria-label={`Add ${p.name} to order`} onClick={() => add(p.id)}>{cart[p.id] ? cart[p.id] : "+"}</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
        <svg width="0" height="0" aria-hidden="true"><defs><clipPath id="wave" clipPathUnits="objectBoundingBox"><path d="M0,0.12 C0.12,0 0.22,0.08 0.34,0.05 C0.5,0.01 0.62,0.1 0.76,0.05 C0.88,0.01 0.95,0.03 1,0.09 L1,1 L0,1 Z" /></clipPath></defs></svg>
      </main>

      {count > 0 && !open && <button ref={openerRef} className="order-fab" onClick={() => setOpen(true)}>Your order · {count} {count === 1 ? "item" : "items"} · {money(total, cur)}</button>}
      {open && (
        <>
          <button type="button" className="shade" aria-label="Close order dialog" onClick={closeDrawer} />
          <aside ref={drawerRef} className="drawer" role="dialog" aria-modal="true" aria-label="Your order">
            <div className="drawer-h"><h3 className="serif">Your order</h3><button type="button" ref={closeRef} className="plus" onClick={closeDrawer} aria-label="Close order">×</button></div>
            <div className="drawer-body">
              {lines.length === 0 && <p className="menu-empty">Your order is empty.</p>}
              {lines.map((p) => (
                <div className="line" key={p.id}><img src={p.image} alt="" />
                  <div><b>{p.name}</b><small>{money(p.price, cur)}</small></div>
                  <div className="qty"><button onClick={() => add(p.id, -1)} aria-label={`Remove one ${p.name}`}>−</button><span>{cart[p.id]}</span><button onClick={() => add(p.id)} aria-label={`Add one ${p.name}`}>+</button></div>
                </div>
              ))}
            </div>
            <div className="drawer-f"><div className="prod-row"><span>Total</span><b>{money(total, cur)}</b></div>
              <button className="pill orange" disabled={!lines.length} onClick={send}>Send order on WhatsApp</button></div>
          </aside>
        </>
      )}
      <Footer />
    </>
  );
}
