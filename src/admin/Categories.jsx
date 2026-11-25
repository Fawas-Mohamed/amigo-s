import { useState } from "react";
import { useShop, actions } from "../store.js";
import { Card, Badge, Modal, Field, ImageInput, Empty, toast } from "./ui.jsx";

export default function Categories() {
  const { categories, products } = useShop();
  const [edit, setEdit] = useState(null);
  const save = (e) => {
    e.preventDefault();
    if (!edit.image) return toast("Please add a category image");
    if (categories.some((c) => c.id !== edit.id && c.name.toLowerCase() === edit.name.trim().toLowerCase())) return toast("That category already exists");
    actions.saveCategory({ ...edit, name: edit.name.trim() }); toast(edit.id ? "Category updated" : "Category added"); setEdit(null);
  };
  const del = (c) => {
    const n = products.filter((p) => p.category === c.name).length;
    if (n) return toast(`Move or delete the ${n} item${n > 1 ? "s" : ""} in “${c.name}” first`);
    if (confirm(`Delete category “${c.name}”?`)) { actions.deleteCategory(c.id); toast("Category deleted"); }
  };
  return (
    <>
      <div className="ad-bar-top"><p className="ad-muted">These appear in “Browse the Menu” on the storefront.</p><button className="ad-btn" onClick={() => setEdit({ name: "", image: "", active: true })}>+ Add category</button></div>
      {categories.length === 0 ? <Card><Empty text="No categories yet. Add your first one." /></Card> :
        <div className="ad-cats">{categories.map((c) => (
          <Card key={c.id} className="ad-cat">
            <img src={c.image} alt={c.name} />
            <div className="ad-cat-b"><div><b>{c.name}</b><small>{products.filter((p) => p.category === c.name).length} items</small></div><Badge tone={c.active ? "delivered" : "draft"}>{c.active ? "Visible" : "Hidden"}</Badge></div>
            <div className="ad-act"><button className="ad-btn ghost sm" onClick={() => setEdit(c)}>Edit</button><button className="ad-btn danger sm" onClick={() => del(c)}>Delete</button></div>
          </Card>))}</div>}
      {edit && (
        <Modal title={edit.id ? "Edit category" : "Add category"} onClose={() => setEdit(null)}>
          <form onSubmit={save} className="ad-form">
            <Field label="Name"><input required value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></Field>
            <Field label="Cover image"><ImageInput value={edit.image} onChange={(v) => setEdit({ ...edit, image: v })} /></Field>
            <label className="ad-check"><input type="checkbox" checked={edit.active} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} /> Visible on the storefront</label>
            <div className="ad-modal-f"><button type="button" className="ad-btn ghost" onClick={() => setEdit(null)}>Cancel</button><button className="ad-btn">Save category</button></div>
          </form>
        </Modal>)}
    </>
  );
}
