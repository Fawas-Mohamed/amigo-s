import { Link } from "react-router-dom";
import { useShop } from "../store.js";

export default function Categories() {
  const { categories, products } = useShop();
  const list = categories.filter((c) => c.active);
  return (
    <section className="sec" id="categories">
      <div className="head-c"><span className="eyebrow">✿ Menu categories</span><h2 className="serif">Browse the Menu</h2><p>Four easy places to start, each one made with intention.</p></div>
      <div className="cats">
        {list.map((c) => {
          const n = products.filter((p) => p.category === c.name && p.status === "active").length;
          return (
            <Link to={`/menu?cat=${encodeURIComponent(c.name)}`} className="cat" key={c.id}>
              <img src={c.image} alt={c.name} loading="lazy" />
              <span className="cat-badge">{n} {n === 1 ? "item" : "items"}</span>
              <div className="cat-label"><b>{c.name}</b><i>↗</i></div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
