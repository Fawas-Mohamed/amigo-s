import { useState } from "react";
import { useShop, actions } from "../store.js";
import { Card, Field, toast } from "./ui.jsx";

export default function Settings() {
  const { settings, ...data } = useShop();
  const [s, setS] = useState(settings);
  const set = (k) => (e) => setS({ ...s, [k]: e.target.value });
  const save = (e) => { e.preventDefault(); actions.saveSettings({ ...s, phone: s.phone.replace(/\D/g, "") }); toast("Settings saved"); };
  const exportData = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify({ settings, ...data }, null, 2)], { type: "application/json" }));
    a.download = "amigos-backup.json"; a.click(); URL.revokeObjectURL(a.href);
  };
  const reset = () => { if (confirm("Reset all menu items, categories, orders and settings to the demo data?")) { actions.reset(); setS(JSON.parse(localStorage.getItem("amigos-coffee-v2")).settings); toast("Demo data restored"); } };
  return (
    <>
      <form onSubmit={save}>
        <Card title="Shop details">
          <div className="ad-form">
            <div className="ad-grid2"><Field label="Shop name"><input required value={s.name} onChange={set("name")} /></Field>
              <Field label="Currency"><select value={s.currency} onChange={set("currency")}><option>LKR</option><option>USD</option><option>EUR</option></select></Field></div>
            <div className="ad-grid2"><Field label="WhatsApp number" hint="Include country code, e.g. 94771234567. Orders from the store arrive here."><input required value={s.phone} onChange={set("phone")} /></Field>
              <Field label="Phone shown on the store"><input value={s.phoneLabel} onChange={set("phoneLabel")} /></Field></div>
            <Field label="Address"><input value={s.address} onChange={set("address")} /></Field>
            <div className="ad-grid2"><Field label="Opening hours"><input value={s.hours} onChange={set("hours")} /></Field>
              <Field label="Instagram username"><input value={s.instagram} onChange={(e) => setS({ ...s, instagram: e.target.value.replace("@", ""), instagramUrl: `https://www.instagram.com/${e.target.value.replace("@", "")}/` })} /></Field></div>
            <div className="ad-modal-f"><button className="ad-btn">Save settings</button></div>
          </div>
        </Card>
      </form>
      <Card title="Data" className="ad-mt">
        <p className="ad-muted">This frontend keeps data in this browser only. Export a backup, or restore the demo content. A backend is needed to share data across devices.</p>
        <div className="ad-act ad-mt"><button className="ad-btn ghost" onClick={exportData}>Export backup (JSON)</button><button className="ad-btn danger" onClick={reset}>Reset demo data</button></div>
      </Card>
    </>
  );
}
