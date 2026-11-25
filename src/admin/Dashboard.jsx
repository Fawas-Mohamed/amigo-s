import { Link } from "react-router-dom";
import { useShop, orderTotal, money, ORDER_STATUSES } from "../store.js";
import { Card, Badge, Empty } from "./ui.jsx";

export default function Dashboard() {
  const { orders, products, settings } = useShop();
  const cur = settings.currency;
  const live = orders.filter((o) => o.status !== "Cancelled");
  const revenue = live.reduce((s, o) => s + orderTotal(o), 0);
  const low = products.filter((p) => p.stock < 10);
  const days = [...Array(7)].map((_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (6 - i)); return d; });
  const series = days.map((d) => ({
    label: d.toLocaleDateString("en", { weekday: "short" }),
    value: live.filter((o) => new Date(o.date).toDateString() === d.toDateString()).reduce((s, o) => s + orderTotal(o), 0),
  }));
  const max = Math.max(...series.map((s) => s.value), 1);
  const kpis = [
    ["Revenue", money(revenue, cur), "All non-cancelled orders"], ["Orders", orders.length, `${orders.filter((o) => o.status === "Pending").length} waiting`],
    ["Menu items", products.length, `${products.filter((p) => p.status === "active").length} live on the menu`], ["Low stock", low.length, "Fewer than 10 left"],
  ];
  return (
    <>
      <div className="ad-kpis">{kpis.map(([t, v, s]) => <div className="ad-kpi" key={t}><span>{t}</span><b>{v}</b><small>{s}</small></div>)}</div>
      <div className="ad-two">
        <Card title="Revenue, last 7 days">
          <svg viewBox="0 0 560 230" className="ad-chart" role="img" aria-label="Revenue per day for the last seven days">
            {series.map((s, i) => {
              const h = Math.max(4, (s.value / max) * 170), x = 14 + i * 77;
              return (<g key={i}>
                <rect x={x} y={190 - h} width="52" height={h} rx="12" className={s.value ? "bar" : "bar empty"} />
                <text x={x + 26} y="216" textAnchor="middle">{s.label}</text>
                {s.value > 0 && <text x={x + 26} y={182 - h} textAnchor="middle" className="v">{Math.round(s.value / 1000)}k</text>}
              </g>);
            })}
          </svg>
        </Card>
        <Card title="Orders by status">
          {ORDER_STATUSES.map((s) => { const n = orders.filter((o) => o.status === s).length; return (
            <div className="ad-bar" key={s}><span>{s}</span><div><i className={s.toLowerCase()} style={{ width: `${(n / Math.max(orders.length, 1)) * 100}%` }} /></div><b>{n}</b></div>); })}
        </Card>
      </div>
      <div className="ad-two">
        <Card title="Recent orders" action={<Link className="ad-link" to="/admin/orders">View all</Link>}>
          <div className="ad-scroll"><table className="ad-table"><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>{orders.slice(0, 6).map((o) => <tr key={o.id}><td><b>{o.id}</b></td><td>{o.customer}</td><td>{money(orderTotal(o), cur)}</td><td><Badge>{o.status}</Badge></td></tr>)}</tbody></table></div>
        </Card>
        <Card title="Low stock" action={<Link className="ad-link" to="/admin/products">Manage</Link>}>
          {low.length === 0 ? <Empty text="All products are well stocked." /> : low.map((p) => (
            <div className="ad-row" key={p.id}><img src={p.image} alt="" /><div><b>{p.name}</b><small>{p.category}</small></div><Badge tone={p.stock < 5 ? "cancelled" : "pending"}>{p.stock} left</Badge></div>))}
        </Card>
      </div>
    </>
  );
}
