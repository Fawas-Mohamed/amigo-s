import { RIBBON, PRODUCTS } from "../data.js";

function Strip({ reverse }) {
  const items = [...RIBBON, ...RIBBON, ...RIBBON, ...RIBBON];
  return (
    <div className="strip"><div className={"track" + (reverse ? " rev" : "")}>
      {items.map((t, i) => <span key={i}>{t}<em>✦</em></span>)}
    </div></div>
  );
}

export default function Ribbons() {
  return (
    <section className="ribbons" aria-label="Highlights">
      <div className="rib a"><Strip /></div>
      <div className="rib b"><Strip reverse /></div>
      <div className="orb"><img src={PRODUCTS[0].image} alt="" /><span /><span /><span /><span /><span /></div>
      <h2 className="rib-title">Your next favourite cup starts right here.</h2>
    </section>
  );
}
