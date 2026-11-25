import { useMemo, useState } from "react";
import { useShop, orderTotal, money } from "../store.js";
import { Card, Empty } from "./ui.jsx";

export default function Customers() {
  const { orders, settings } = useShop();
  const [q, setQ] = useState("");
  const customers = useMemo(() => {
    const m = new Map();
    orders.forEach((o) => {
      const c = m.get(o.phone) || { name: o.customer, phone: o.phone, address: o.address, orders: 0, spent: 0, last: o.date };
      c.orders += 1; if (o.status !== "Cancelled") c.spent += orderTotal(o); if (o.date > c.last) c.last = o.date;
      m.set(o.phone, c);
    });
    return [...m.values()].sort((a, b) => b.spent - a.spent).filter((c) => (c.name + c.phone).toLowerCase().includes(q.toLowerCase()));
  }, [orders, q]);
  return (
    <>
      <div className="ad-bar-top"><p className="ad-muted">Built automatically from your orders.</p><input className="ad-search" placeholder="Search customers" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search customers" /></div>
      <Card>{customers.length === 0 ? <Empty text="No customers found." /> :
        <div className="ad-scroll"><table className="ad-table"><thead><tr><th>Customer</th><th>Phone</th><th>Address</th><th>Orders</th><th>Total spent</th><th>Last order</th></tr></thead>
          <tbody>{customers.map((c) => (
            <tr key={c.phone}><td><div className="ad-prod"><span className="ad-av">{c.name[0]}</span><b>{c.name}</b></div></td><td>{c.phone}</td><td>{c.address}</td><td>{c.orders}</td>
              <td>{money(c.spent, settings.currency)}</td><td>{new Date(c.last).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</td></tr>))}</tbody></table></div>}</Card>
    </>
  );
}
