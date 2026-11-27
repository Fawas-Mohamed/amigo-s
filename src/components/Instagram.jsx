import { useEffect, useRef, useState } from "react";
import { INSTA } from "../data.js";
import { useShop } from "../store.js";

export default function Instagram() {
  const SHOP = useShop().settings;
  const [i, setI] = useState(2);
  const [hover, setHover] = useState(false);
  const touchStart = useRef(null);
  const swiped = useRef(false);

  useEffect(() => {
    if (hover) return undefined;
    const timer = setInterval(() => setI((value) => (value + 1) % INSTA.length), 3500);
    return () => clearInterval(timer);
  }, [hover]);

  const onTouchStart = (event) => {
    touchStart.current = event.touches[0]?.clientX ?? null;
    swiped.current = false;
  };
  const onTouchEnd = (event) => {
    if (touchStart.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(delta) < 40) return;
    swiped.current = true;
    setI((value) => (value + (delta < 0 ? 1 : INSTA.length - 1)) % INSTA.length);
    window.setTimeout(() => { swiped.current = false; }, 500);
  };
  const chooseCard = (index) => {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    setI(index);
  };

  return (
    <section className="sec insta" id="instagram" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="insta-tabs" role="group" aria-label="Gallery images">
        {INSTA.map((p, k) => <button key={p.tag} type="button" className={"chip" + (k === i ? " on" : "")} aria-pressed={k === i} onClick={() => setI(k)}>{p.tag}</button>)}
      </div>
      <div className="deck" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {INSTA.map((p, k) => {
          const d = k - i;
          return <img key={k} src={p.image} alt={p.tag} loading="lazy"
            onClick={() => chooseCard(k)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setI(k);
              }
            }}
            role="button" tabIndex={0} aria-label={"Show " + p.tag + " image"} aria-pressed={k === i}
            className={"deck-card" + (d === 0 ? " center" : "")}
            style={{ "--d": d, "--a": Math.abs(d) }} />;
        })}
      </div>
      <div className="insta-foot">
        <div><span className="eyebrow">&#10047; Follow along</span><h2 className="serif">@{SHOP.instagram}</h2></div>
        <a className="pill orange" href={SHOP.instagramUrl} target="_blank" rel="noreferrer">Follow on Instagram &#8599;</a>
      </div>
    </section>
  );
}