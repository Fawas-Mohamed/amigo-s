import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./admin.css";
import Login from "./Login.jsx";
import Layout from "./Layout.jsx";
import Dashboard from "./Dashboard.jsx";
import Products from "./Products.jsx";
import Categories from "./Categories.jsx";
import Orders from "./Orders.jsx";
import Customers from "./Customers.jsx";
import Settings from "./Settings.jsx";

const AUTH = "amigos-auth";
export default function AdminRoutes() {
  const [authed, setAuthed] = useState(() => localStorage.getItem(AUTH) === "1");
  if (!authed) return <Login onLogin={() => { localStorage.setItem(AUTH, "1"); setAuthed(true); }} />;
  const logout = () => { localStorage.removeItem(AUTH); setAuthed(false); };
  return (
    <Routes>
      <Route element={<Layout onLogout={logout} />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
