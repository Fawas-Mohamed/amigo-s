import { useSyncExternalStore } from "react";
import { SHOP, CATEGORIES, PRODUCTS } from "./data.js";

const KEY = "amigos-coffee-v2";
const hoursAgo = (h) => new Date(Date.now() - h * 36e5).toISOString();
const uid = () => Math.random().toString(36).slice(2, 9);

function seed() {
  const cats = CATEGORIES.map((c) => ({ id: uid(), name: c.name, image: c.image, active: true }));
  const products = PRODUCTS.map((p) => ({ ...p, id: uid(), status: "active" }));
  const people = [
    ["Nimal Perera", "0771234567", "12 Dockyard Rd, Trincomalee"], ["Fathima Rizna", "0762345678", "5 Beach Rd, Kinniya"],
    ["Arun Kumar", "0753456789", "44 Uppuveli Rd, Trincomalee"], ["Sanduni Silva", "0714567890", "18 Galle Rd, Colombo"],
    ["Mohamed Ismail", "0725678901", "9 Lake View, Nilaveli"], ["Priya Selvam", "0786789012", "27 Main St, Trincomalee"],
  ];
  const sts = ["Delivered", "Delivered", "Shipped", "Processing", "Pending", "Delivered", "Cancelled", "Shipped", "Pending", "Delivered", "Processing", "Delivered", "Pending", "Pending"];
  const orders = sts.map((status, i) => {
    const [name, phone, address] = people[i % 6];
    const items = [0, 1, 2].slice(0, 1 + (i % 3)).map((k) => {
      const p = products[(i * 2 + k * 5) % products.length];
      return { productId: p.id, name: p.name, price: p.price, qty: 1 + ((i + k) % 2) };
    });
    return { id: `#${1040 + i}`, customer: name, phone, address, items, status, date: hoursAgo(i * 11 + 2), note: "" };
  }).reverse();
  return { settings: { ...SHOP, currency: "LKR" }, categories: cats, products, orders };
}

function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.products) return s; } catch {}
  return seed();
}
let state = load();
const subs = new Set();
function commit(next) {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage full: keep in memory */ }
  subs.forEach((f) => f());
}
export const useShop = () => useSyncExternalStore((cb) => { subs.add(cb); return () => subs.delete(cb); }, () => state);

export const actions = {
  saveProduct(p) { commit({ ...state, products: p.id ? state.products.map((x) => (x.id === p.id ? p : x)) : [{ ...p, id: uid() }, ...state.products] }); },
  deleteProduct(id) { commit({ ...state, products: state.products.filter((x) => x.id !== id) }); },
  saveCategory(c) {
    if (!c.id) return commit({ ...state, categories: [...state.categories, { ...c, id: uid() }] });
    const old = state.categories.find((x) => x.id === c.id);
    commit({ ...state,
      categories: state.categories.map((x) => (x.id === c.id ? c : x)),
      products: state.products.map((p) => (p.category === old.name ? { ...p, category: c.name } : p)) });
  },
  deleteCategory(id) { commit({ ...state, categories: state.categories.filter((x) => x.id !== id) }); },
  setOrderStatus(id, status) { commit({ ...state, orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)) }); },
  deleteOrder(id) { commit({ ...state, orders: state.orders.filter((o) => o.id !== id) }); },
  saveSettings(s) { commit({ ...state, settings: s }); },
  reset() { commit(seed()); },
};

export const orderTotal = (o) => o.items.reduce((s, i) => s + i.price * i.qty, 0);
export const money = (n, cur = "LKR") => `${cur} ${Number(n || 0).toLocaleString()}`;
export const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
