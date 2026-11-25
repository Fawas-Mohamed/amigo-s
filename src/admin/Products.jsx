import { useMemo, useState } from "react";
import { useShop, actions, money } from "../store.js";
import { Card, Badge, Modal, Field, ImageInput, Empty, toast } from "./ui.jsx";

const blank = (cat) => ({ name: "", desc: "", category: cat, price: "", stock: "", image: "", status: "active", featured: false });

export default function Products() {
  const { products, categories, settings } = useShop();
  const [q, setQ] = useState(""); const [cat, setCat] = useState("All"); const [st, setSt] = useState("All");
  const [edit, setEdit] = useState(null);
  const list = useMemo(() => products.filter((p) =>
    (cat === "All" || p.category === cat) && (st === "All" || p.status === st) && p.name.toLowerCase().includes(q.toLowerCase())), [products, q, cat, st]);

  const save = (e) => {
    e.preventDefault();
    if (!edit.image) return toast("Please add a photo");
    actions.saveProduct({ ...edit, price: +edit.price, stock: +edit.stock });
    toast(edit.id ? "Item updated" : "Item added"); setEdit(null);
  };
  const del = (p) => { if (confirm(`Delete “${p.name}”? This cannot be undone.`)) { actions.deleteProduct(p.id); toast("Item deleted"); } };
  const set = (k) => (e) => setEdit({ ...edit, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  return (
    <>
      <div className="ad-bar-top">
        <input className="ad-search" placeholder="Search menu items" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search menu items" />
        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Filter by category"><option>All</option>{categories.map((c) => <option key={c.id}>{c.name}</option>)}</select>
        <select value={st} onChange={(e) => setSt(e.target.value)} aria-label="Filter by status"><option value="All">All status</option><option value="active">Active</option><option value="draft">Draft</option></select>
        <button className="ad-btn" onClick={() => setEdit(blank(categories[0]?.name || ""))}>+ Add item</button>
      </div>
      <Card>
        {list.length === 0 ? <Empty text="No items match. Try a different filter or add a new item." /> :
          <div className="ad-scroll"><table className="ad-table">
            <thead><tr><th>Item</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th /></tr></thead>
            <tbody>{list.map((p) => (
              <tr key={p.id}>
                <td><div className="ad-prod"><img src={p.image} alt="" /><div><b>{p.name}</b>{p.featured && <small>★ Signature pick</small>}</div></div></td>
                <td>{p.category}</td><td>{money(p.price, settings.currency)}</td>
                <td><Badge tone={p.stock === 0 ? "cancelled" : p.stock < 10 ? "pending" : "delivered"}>{p.stock === 0 ? "Out of stock" : p.stock}</Badge></td>
                <td><Badge tone={p.status === "active" ? "delivered" : "draft"}>{p.status === "active" ? "Active" : "Draft"}</Badge></td>
                <td className="ad-act"><button className="ad-btn ghost sm" onClick={() => setEdit(p)}>Edit</button><button className="ad-btn danger sm" onClick={() => del(p)}>Delete</button></td>
              </tr>))}</tbody></table></div>}
      </Card>
      {edit && (
        <Modal title={edit.id ? "Edit item" : "Add item"} onClose={() => setEdit(null)}>
          <form onSubmit={save} className="ad-form">
            <Field label="Item name"><input required value={edit.name} onChange={set("name")} /></Field>
            <Field label="Description"><textarea rows="3" value={edit.desc} onChange={set("desc")} /></Field>
            <div className="ad-grid3">
              <Field label="Category"><select required value={edit.category} onChange={set("category")}>{categories.map((c) => <option key={c.id}>{c.name}</option>)}</select></Field>
              <Field label={`Price (${settings.currency})`}><input required type="number" min="0" value={edit.price} onChange={set("price")} /></Field>
              <Field label="Stock"><input required type="number" min="0" value={edit.stock} onChange={set("stock")} /></Field>
            </div>
            <Field label="Image"><ImageInput value={edit.image} onChange={(v) => setEdit({ ...edit, image: v })} /></Field>
            <div className="ad-grid3">
              <Field label="Status"><select value={edit.status} onChange={set("status")}><option value="active">Active (visible)</option><option value="draft">Draft (hidden)</option></select></Field>
              <label className="ad-check"><input type="checkbox" checked={edit.featured} onChange={set("featured")} /> Show in Signature Picks (home page)</label>
            </div>
            <div className="ad-modal-f"><button type="button" className="ad-btn ghost" onClick={() => setEdit(null)}>Cancel</button><button className="ad-btn">{edit.id ? "Save changes" : "Add item"}</button></div>
          </form>
        </Modal>)}
    </>
  );
}
