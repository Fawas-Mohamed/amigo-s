import { useEffect, useState } from "react";

export const toast = (msg) => window.dispatchEvent(new CustomEvent("ad-toast", { detail: msg }));
export function Toaster() {
  const [m, setM] = useState(null);
  useEffect(() => {
    let t;
    const on = (e) => { setM(e.detail); clearTimeout(t); t = setTimeout(() => setM(null), 2400); };
    window.addEventListener("ad-toast", on);
    return () => { window.removeEventListener("ad-toast", on); clearTimeout(t); };
  }, []);
  return m ? <div className="ad-toast" role="status">{m}</div> : null;
}

export function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="ad-back" onMouseDown={onClose}>
      <div className={"ad-modal" + (wide ? " wide" : "")} role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.stopPropagation()}>
        <div className="ad-modal-h"><h3>{title}</h3><button className="ad-x" onClick={onClose} aria-label="Close">×</button></div>
        {children}
      </div>
    </div>
  );
}

export const Field = ({ label, children, hint }) => (
  <label className="ad-field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>
);
export const Badge = ({ children, tone }) => <span className={"ad-badge " + (tone || String(children).toLowerCase())}>{children}</span>;
export const Empty = ({ text }) => <div className="ad-empty">{text}</div>;
export const Card = ({ title, action, children, className = "" }) => (
  <section className={"ad-card " + className}>{(title || action) && <div className="ad-card-h"><h3>{title}</h3>{action}</div>}{children}</section>
);

export function fileToDataUrl(file, max = 800) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        res(c.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = rej; img.src = r.result;
    };
    r.onerror = rej; r.readAsDataURL(file);
  });
}

export function ImageInput({ value, onChange }) {
  const pick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try { onChange(await fileToDataUrl(f)); } catch { toast("Could not read that image"); }
  };
  return (
    <div className="ad-img">
      <div className="ad-img-prev">{value ? <img src={value} alt="Preview" /> : <span>No image</span>}</div>
      <div className="ad-img-in">
        <input placeholder="Paste image URL" value={value?.startsWith("data:") ? "" : value || ""} onChange={(e) => onChange(e.target.value)} />
        <label className="ad-btn ghost sm">Upload photo<input type="file" accept="image/*" hidden onChange={pick} /></label>
      </div>
    </div>
  );
}
