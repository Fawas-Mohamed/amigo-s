import { useMemo, useState } from "react";
import { useShop, actions, orderTotal, money, ORDER_STATUSES } from "../store.js";
import { Card, Badge, Modal, Empty, toast } from "./ui.jsx";

const fmtDate = (d) => new Date(d).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

export default function Orders() {
  const { orders, settings } = useShop();
  const cur = settings.currency;
  const [tab, setTab] = useState("All"); const [q, setQ] = useState(""); const [openId, setOpenId] = useState(null);
  const list = useMemo(() => orders.filter((o) => (tab === "All" || o.status === tab) &&
    (o.id + o.customer + o.phone).toLowerCase().includes(q.toLowerCase())), [orders, tab, q]);
  const open = orders.find((o) => o.id === openId);
  const change = (o, s) => { actions.setOrderStatus(o.id, s); toast(`${o.id} marked ${s}`); };
  const remove = (o) => { if (confirm(`Delete order ${o.id}?`)) { actions.deleteOrder(o.id); setOpenId(null); toast("Order deleted"); } };
  return (
    <>
      <div className="ad-bar-top">
        <div className="ad-tabs" role="tablist">{["All", ...ORDER_STATUSES].map((s) => (
          <button key={s} role="tab" aria-selected={tab === s} className={tab === s ? "on" : ""} onClick={() => setTab(s)}>{s}<em>{s === "All" ? orders.length : orders.filter((o) => o.status === s).length}</em></button>))}</div>
        <input className="ad-search" placeholder="Search order, name or phone" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search orders" />
      </div>
      <Card>{list.length === 0 ? <Empty text="No orders in this view." /> :
        <div className="ad-scroll"><table className="ad-table">
          <thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th /></tr></thead>
          <tbody>{list.map((o) => (
            <tr key={o.id}><td><b>{o.id}</b></td><td>{fmtDate(o.date)}</td><td>{o.customer}<small className="ad-sub">{o.phone}</small></td>
              <td>{o.items.reduce((s, i) => s + i.qty, 0)}</td><td>{money(orderTotal(o), cur)}</td><td><Badge>{o.status}</Badge></td>
              <td className="ad-act"><button className="ad-btn ghost sm" onClick={() => setOpenId(o.id)}>View</button></td></tr>))}</tbody></table></div>}</Card>
      {open && (
        <Modal title={`Order ${open.id}`} onClose={() => setOpenId(null)} wide>
          <div className="ad-od">
            <div><h4>Customer</h4><p><b>{open.customer}</b></p><p>{open.phone}</p><p>{open.address}</p><p className="ad-muted">Placed {fmtDate(open.date)}</p>
              <a className="ad-btn ghost sm" target="_blank" rel="noreferrer" href={`https://wa.me/${open.phone.replace(/^0/, "94")}?text=${encodeURIComponent(`Hi ${open.customer}, about your order ${open.id} from ${settings.name}:`)}`}>Message on WhatsApp</a></div>
            <div><h4>Status</h4><div className="ad-steps">{ORDER_STATUSES.map((s) => <button key={s} className={"ad-step " + s.toLowerCase() + (open.status === s ? " on" : "")} onClick={() => change(open, s)}>{s}</button>)}</div></div>
          </div>
          <table className="ad-table"><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
            <tbody>{open.items.map((i, k) => <tr key={k}><td>{i.name}</td><td>{i.qty}</td><td>{money(i.price, cur)}</td><td>{money(i.price * i.qty, cur)}</td></tr>)}
              <tr className="ad-total"><td colSpan="3">Total</td><td>{money(orderTotal(open), cur)}</td></tr></tbody></table>
          <div className="ad-modal-f"><button className="ad-btn danger" onClick={() => remove(open)}>Delete order</button><button className="ad-btn" onClick={() => setOpenId(null)}>Done</button></div>
        </Modal>)}
    </>
  );
}
