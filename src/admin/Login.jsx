import { useState } from "react";
import { Link } from "react-router-dom";

// Demo credentials: replace with real authentication once a backend exists.
const DEMO = { email: "admin@amigos.lk", password: "amigos123" };

export default function Login({ onLogin }) {
  const [f, setF] = useState({ email: DEMO.email, password: "" });
  const [err, setErr] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (f.email.trim().toLowerCase() === DEMO.email && f.password === DEMO.password) onLogin();
    else setErr("Email or password is incorrect.");
  };
  return (
    <div className="ad-login">
      <form className="ad-login-card" onSubmit={submit}>
        <div className="ad-logo">Amigo’s <small>Admin</small></div>
        <h1>Welcome back</h1>
        <p>Sign in to manage products, orders and your storefront.</p>
        <label className="ad-field"><span>Email</span><input type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
        <label className="ad-field"><span>Password</span><input type="password" required autoFocus placeholder="amigos123" value={f.password} onChange={(e) => { setF({ ...f, password: e.target.value }); setErr(""); }} /></label>
        {err && <div className="ad-err" role="alert">{err}</div>}
        <button className="ad-btn">Sign in</button>
        <Link to="/" className="ad-link">← Back to store</Link>
        <p className="ad-demo">Demo login: {DEMO.email} / {DEMO.password}</p>
      </form>
    </div>
  );
}
