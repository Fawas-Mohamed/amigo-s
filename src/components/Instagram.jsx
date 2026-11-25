import { useEffect, useState } from "react";
import { INSTA } from "../data.js";
import { useShop } from "../store.js";

export default function Instagram() {
  const SHOP = useShop().settings;
  const [i, setI] = useState(2);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if (hover) return;
    const t = setInterval(() => setI((x) => (x + 1) % INSTA.length), 3500);
    return () => clearInterval(t);
  }, [hover]);
  return (
    <section className="sec insta" id="instagram" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="insta-tabs">
        {INSTA.map((p, k) => <button key={p.tag} className={"chip" + (k === i ? " on" : "")} onClick={() => setI(k)}>{p.tag}</button>)}
      </div>
      <div className="deck">
        {INSTA.map((p, k) => {
          const d = k - i;
          return <img key={k} src={p.image} alt={p.tag} loading="lazy" onClick={() => setI(k)}
            className={"deck-card" + (d === 0 ? " center" : "")}
            style={{ "--d": d, "--a": Math.abs(d) }} />;
        })}
      </div>
      <div className="insta-foot">
        <div><span className="eyebrow">✿ Follow along</span><h2 className="serif">@{SHOP.instagram}</h2></div>
        <a className="pill orange" href={SHOP.instagramUrl} target="_blank" rel="noreferrer">Follow on Instagram ↗</a>
      </div>
    </section>
  );
}
