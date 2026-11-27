// ===== Edit this file with the client's real content =====
const U = (id, w = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const SHOP = {
  name: "Amigo’s",
  phone: "94770000000",
  phoneLabel: "+94 77 000 0000",
  address: "Main Street, Trincomalee, Sri Lanka",
  hours: "Open daily 11am – 11pm",
  instagram: "amigos_trinco",
  instagramUrl: "https://www.instagram.com/amigos_trinco/",
};

export const HERO = {
  image: "/images/hero/Amigo’s Café Storefront Experience.png",
  card: { image: U("photo-1461023058943-07fcbe16d735", 600), title: "Signature Latte", meta: "Hot or iced · Bestseller", price: "LKR 700" },
  text: "Freshly roasted coffee, slow-brewed drinks and warm bakes in the heart of Trincomalee, made for sharing with friends.",
};

export const CATEGORIES = [
  { name: "Coffee", image: U("photo-1495474472287-4d71bcdd2085", 700) },
  { name: "Tea & Matcha", image: U("photo-1536256263959-770b48d82b0a", 700) },
  { name: "Cold Drinks", image: U("photo-1517701604599-bb29b565090c", 700) },
  { name: "Pastries & Bites", image: U("photo-1555507036-ab1f4038808a", 700) },
];

export const STORY = {
  title: "The Amigo’s coffee ritual.",
  text: "A good cup takes patience. Every coffee we serve follows the same four steps, from the first bean to your table.",
  steps: [
    { n: "01", t: "Beans we trust", d: "We choose small-batch beans from growers we know, picked for sweetness and balance.", image: U("photo-1447933601403-0c6688de566e", 700) },
    { n: "02", t: "Slow roasting", d: "Roasted in small amounts so each batch keeps its character and stays fresh.", image: U("photo-1521017432531-fbd92d768814", 700) },
    { n: "03", t: "Brewed to order", d: "Every drink is ground, measured and brewed when you order it. Never batch-made.", image: U("photo-1495474472287-4d71bcdd2085", 700) },
    { n: "04", t: "Served with care", d: "Poured, topped and handed over with a smile, to enjoy here or take away.", image: U("photo-1514432324607-a09d9b4aefdd", 700) },
  ],
};

// Starting menu. Admin changes are saved in the browser on top of this.
export const PRODUCTS = [
  { name: "Espresso", category: "Coffee", price: 450, stock: 99, featured: false, desc: "Rich double shot with a golden crema.", image: U("photo-1510707577719-ae7c14805e3a", 600) },
  { name: "Americano", category: "Coffee", price: 500, stock: 99, featured: false, desc: "Espresso lengthened with hot water, clean and bold.", image: U("photo-1497935586351-b67a49e012bf", 600) },
  { name: "Cappuccino", category: "Coffee", price: 650, stock: 99, featured: true, desc: "Silky microfoam over a balanced double shot.", image: U("photo-1572442388796-11668a67e53d", 600) },
  { name: "Signature Latte", category: "Coffee", price: 700, stock: 99, featured: true, desc: "Smooth, milky and finished with latte art.", image: U("photo-1461023058943-07fcbe16d735", 600) },
  { name: "Flat White", category: "Coffee", price: 700, stock: 99, featured: false, desc: "Velvety steamed milk with a stronger coffee note.", image: U("photo-1514432324607-a09d9b4aefdd", 600) },
  { name: "Mocha", category: "Coffee", price: 750, stock: 99, featured: false, desc: "Espresso, dark chocolate and steamed milk.", image: U("photo-1578314675249-a6910f80cc4e", 600) },
  { name: "Ceylon Milk Tea", category: "Tea & Matcha", price: 400, stock: 99, featured: false, desc: "Strong Ceylon tea, brewed the local way with milk.", image: U("photo-1544787219-7f47ccb76574", 600) },
  { name: "Matcha Latte", category: "Tea & Matcha", price: 850, stock: 40, featured: true, desc: "Ceremonial-style matcha whisked with oat or dairy milk.", image: U("photo-1536256263959-770b48d82b0a", 600) },
  { name: "Chai Latte", category: "Tea & Matcha", price: 650, stock: 99, featured: false, desc: "Spiced black tea with steamed milk and honey.", image: U("photo-1557006021-b85faa2bc5e2", 600) },
  { name: "Iced Latte", category: "Cold Drinks", price: 750, stock: 99, featured: false, desc: "Double espresso over ice and cold milk.", image: U("photo-1517701604599-bb29b565090c", 600) },
  { name: "Cold Brew", category: "Cold Drinks", price: 800, stock: 30, featured: true, desc: "Slow-steeped for 18 hours for a smooth, low-acid cup.", image: U("photo-1592663527359-cf6642f54cff", 600) },
  { name: "Iced Mocha", category: "Cold Drinks", price: 850, stock: 99, featured: false, desc: "Chocolate, espresso and milk poured over ice.", image: U("photo-1556679343-c7306c1976bc", 600) },
  { name: "Mango Smoothie", category: "Cold Drinks", price: 700, stock: 99, featured: false, desc: "Ripe local mango blended with yoghurt and ice.", image: U("photo-1623065422902-30a2d299bbe4", 600) },
  { name: "Butter Croissant", category: "Pastries & Bites", price: 550, stock: 14, featured: false, desc: "Flaky, buttery and baked fresh each morning.", image: U("photo-1555507036-ab1f4038808a", 600) },
  { name: "Chocolate Cake Slice", category: "Pastries & Bites", price: 750, stock: 9, featured: false, desc: "Dense, moist chocolate cake with ganache.", image: U("photo-1578985545062-69928b1d9587", 600) },
  { name: "Banana Bread", category: "Pastries & Bites", price: 450, stock: 12, featured: false, desc: "Warm spiced banana bread, lightly toasted on request.", image: U("photo-1586985289688-ca3cf47d3e6e", 600) },
  { name: "Cheese Toastie", category: "Pastries & Bites", price: 900, stock: 20, featured: false, desc: "Melted cheese on toasted sourdough with a side salad.", image: U("photo-1528735602780-2552fd46c7af", 600) },
];

export const RIBBON = ["Espresso", "Cold brew", "Matcha", "Fresh bakes", "Brewed to order", "Locally loved"];

export const INSTA = [
  { tag: "Latte art", image: U("photo-1461023058943-07fcbe16d735", 700) },
  { tag: "Our space", image: U("photo-1554118811-1e0d58224f24", 700) },
  { tag: "Fresh bakes", image: U("photo-1555507036-ab1f4038808a", 700) },
  { tag: "Cold brew", image: U("photo-1517701604599-bb29b565090c", 700) },
  { tag: "The beans", image: U("photo-1447933601403-0c6688de566e", 700) },
];

// About page copy: placeholder text, replace with the owner's real story.
export const ABOUT = {
  title: "Coffee, with company.",
  intro: "Amigo means friend. That is the whole idea behind our little coffee house in Trincomalee: good coffee, warm bakes and a table for everyone.",
  images: [U("photo-1554118811-1e0d58224f24", 900), U("photo-1495474472287-4d71bcdd2085", 700), U("photo-1555507036-ab1f4038808a", 700)],
  storyImage: U("photo-1559496417-e7f25cb247f3", 900),
  story: [
    "We started Amigo’s because we wanted a place in town where you could slow down. A spot with honest coffee, fair prices and no rush to leave.",
    "Our menu is small on purpose. We would rather make a few things really well than a long list of things that are just fine. Every drink is made to order and every bake is made fresh.",
    "Whether you are grabbing a quick espresso on the way to work or settling in for the afternoon with friends, you are welcome here.",
  ],
  values: [
    ["☕", "Coffee first", "Carefully chosen beans, ground fresh and brewed to order for every cup."],
    ["♡", "Made fresh", "Pastries and bites are prepared daily in small batches, never frozen."],
    ["✦", "Everyone’s welcome", "A friendly seat for students, families, remote workers and regulars alike."],
  ],
};
