import { useEffect, useRef, useState } from "react";

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
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => closeRef.current?.focus());

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...dialogRef.current.querySelectorAll("button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!dialogRef.current.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      if (opener?.isConnected) opener.focus();
    };
  }, []);

  return (
    <div className="ad-back" onClick={onClose}>
      <div ref={dialogRef} className={"ad-modal" + (wide ? " wide" : "")} role="dialog" aria-modal="true" aria-labelledby="ad-dialog-title" onClick={(event) => event.stopPropagation()}>
        <div className="ad-modal-h"><h3 id="ad-dialog-title">{title}</h3><button ref={closeRef} type="button" className="ad-x" onClick={onClose} aria-label="Close">&#215;</button></div>
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
