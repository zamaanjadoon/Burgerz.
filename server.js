// server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";

// src/data.ts
var INITIAL_PRODUCTS = [
  // Burgers
  {
    id: "b1",
    name: "Jalapeno Beef Burger",
    price: 470,
    category: "burgers",
    description: "Fresh beef patty grilled to perfection, topped with spicy pickled jalapenos, melted cheese, and our signature fiery burger sauce inside a brioche bun.",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    isPopular: true,
    tags: ["Beef", "Spicy", "Best Seller"]
  },
  {
    id: "b2",
    name: "Beef Smash Burger (Regular)",
    price: 450,
    category: "burgers",
    description: "Smashed house beef patty crispy-edged on the flat top, layered with American cheese slices, dill pickles, onions, and classic burger sauce.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80",
    rating: 4.6,
    isPopular: false,
    tags: ["Beef", "Classic"]
  },
  {
    id: "b3",
    name: "Beef Smash Burger (Special)",
    price: 650,
    category: "burgers",
    description: "Double smashed beef patties with double melted cheese, grilled mushrooms, caramelized onions, house special sauce, served fresh and warm.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    isPopular: true,
    isNew: true,
    tags: ["Double Beef", "Premium"]
  },
  {
    id: "b4",
    name: "Zinger Burger",
    price: 400,
    category: "burgers",
    description: "Golden, crispy hand-breaded chicken breast fillet fried to crunch perfection, drizzled with creamy mayo and fresh shredded lettuce.",
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    isPopular: true,
    tags: ["Chicken", "Crispy"]
  },
  {
    id: "b5",
    name: "Wahshi Zinger Burger",
    price: 650,
    category: "burgers",
    description: "The monumental beast! Double crispy zinger chicken patties, layered with thick melted cheese, jalapeno pepper rings, and spicy Wahshi chili mayo.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyU9PaA5jJ7smRhCLWFQFy0o9amfqtGRMYoTWAm_MvVQ&s=10",
    rating: 4.9,
    isPopular: true,
    tags: ["Double Chicken", "Gigantic", "Spicy"]
  },
  {
    id: "b6",
    name: "Chicken Grill Burger",
    price: 450,
    category: "burgers",
    description: "Flame-grilled marinated chicken breast fillet, served with sliced tomatoes, crisp red onions, lettuce, and a light smokey mustard mayo sauce.",
    image: "https://images.unsplash.com/photo-1521305916504-4a1121188589?w=600&auto=format&fit=crop&q=80",
    rating: 4.5,
    tags: ["Chicken", "Grilled", "Healthy Choice"]
  },
  {
    id: "b7",
    name: "Chicken Grill Burger Special",
    price: 650,
    category: "burgers",
    description: "Premium grilled chicken breast fillet smothered in melted cheddar, customized premium herb spices, layered with saut\xE9ed bell peppers and garlic-aioli squeeze.",
    image: "https://www.shutterstock.com/image-photo/chicken-burger-isolated-on-transparent-260nw-2618558073.jpg",
    rating: 4.8,
    isNew: true,
    tags: ["Grilled", "Exclusive", "Premium"]
  },
  // Fries
  {
    id: "f1",
    name: "Plain Fries",
    price: 120,
    category: "fries",
    description: "Classic salted hand-cut crisp golden French fries, fried to perfection and seasoned with our home-made seasoning. Ideal savory side.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi0KO8uz6QJvyzsjQl608QpSjzNRdbNSGr3g&s",
    rating: 4.3,
    tags: ["Classic", "Vibe"]
  },
  {
    id: "f2",
    name: "Garlic Mayo Fries",
    price: 150,
    category: "fries",
    description: "Our golden fries loaded with a rich dressing of customized creamy home-made garlic powder mayo and a sprinkling of minced parsley.",
    image: "https://static.tossdown.com/images/cd443e3c-2599-46fb-8818-7f2b21841cd0.webp",
    rating: 4.6,
    isPopular: true,
    tags: ["Creamy", "Garlic"]
  },
  {
    id: "f3",
    name: "Loaded Fries",
    price: 550,
    category: "fries",
    description: "A colossal bowl of crispy fries smothered in melted hot dynamic cheese sauce, shredded chicken chunk tidbits, jalapeno rings, and dynamic herbs.",
    image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    isPopular: true,
    tags: ["Loaded", "Cheesy", "Meal Size"]
  },
  // Wraps & Shawarma
  {
    id: "w1",
    name: "Zinger Wrap",
    price: 420,
    category: "wraps",
    description: "Crispy structural golden zinger chicken strips wrapped in a warm soft tortilla, tossed with dynamic pepper mayo, crisp green cabbage and fresh lettuce.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyU9PaA5jJ7smRhCLWFQFy0o9amfqtGRMYoTWAm_MvVQ&s=10",
    rating: 4.7,
    isPopular: true,
    tags: ["Crispy Chicken", "Wrap"]
  },
  {
    id: "w2",
    name: "Shawarma",
    price: 200,
    category: "wraps",
    description: "Authentic local chicken shawarma rolled in flatbread with traditional spicy red sauce, creamy tahini style mayo spread, and pickled cucumber strips.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVjYIeoqAt7-ueX_9K9L0OFEmfZJvXJoow0Y6oNBg8Uw&s=10",
    rating: 4.8,
    isPopular: true,
    tags: ["Traditional", "Value Deal"]
  },
  // Wings
  {
    id: "ng1",
    name: "Crispy Wings (6 pcs)",
    price: 350,
    category: "wings",
    description: "Six piece crunchy hand-battered chicken wings fried to structural perfection, sprinkled with a touch of local spices and served with visual savory-dip sauce.",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80",
    rating: 4.6,
    tags: ["Appetizer", "Crispy"]
  },
  {
    id: "ng2",
    name: "Crispy Wings (12 pcs)",
    price: 700,
    category: "wings",
    description: "Twelve piece ultimate party portion chicken wings, dry-crunchy or tossed lightly with dipping sauce. Best shared with boys.",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    tags: ["Party Size", "Crunchy"]
  },
  // Sandwich
  {
    id: "sd1",
    name: "Club Sandwich",
    price: 370,
    category: "sandwiches",
    description: "Triple decker classic toasted sandwich containing loaded chicken breast chunks, fried egg layers, fresh sliced tomatoes, lettuce, cucumber slice grids, and light sandwich mayo.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-9vJdtM4KzbRVGylTph9l_F48ISJ_OjRpew&s",
    rating: 4.4,
    tags: ["Toasted", "Filling"]
  },
  // Drinks
  {
    id: "dr1",
    name: "Mint Margarita",
    price: 150,
    category: "drinks",
    description: "Wonderfully chilled summer absolute refresher blend of cool ice, sparkling soda, sweet citrus juice, and freshly ground vibrant green organic mint leaves.",
    image: "https://static.tossdown.com/images/a18d1984-8640-45b2-93e0-c5ff60ada1ee.webp",
    rating: 4.7,
    isPopular: true,
    tags: ["Ice Cold", "Cooling"]
  },
  {
    id: "dr2",
    name: "Lemon Soda",
    price: 120,
    category: "drinks",
    description: "Sparkling aerated water mixed with direct freshly squeezed lemon pulp and dynamic local rock salt, served in an overflowing glass of crushed ice cubes.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThPSh2Up2fS6SnvtiaNLFJI8OXOQoNbGfSCg&s",
    rating: 4.5,
    tags: ["Bubbly", "Refreshing"]
  }
];
var PROMOTION_BANNERS = [
  {
    id: "p1",
    title: "TODAY'S SPECIAL OFFER",
    description: "Get FREE Fries on purchase of any 2 Burgers!",
    badge: "Limited Offer",
    bgImage: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=1000&auto=format&fit=crop&q=80"
  },
  {
    id: "p2",
    title: "WEEKEND SMASH BONANZA",
    description: "10% Off on all Smashed Beef Burger Platters above Rs. 800",
    badge: "Promo: FASTWEEKEND",
    code: "FASTWEEKEND",
    bgImage: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1000&auto=format&fit=crop&q=80"
  },
  {
    id: "p3",
    title: "NEW MONSTER ARRIVAL",
    description: "Meet the Wahshi Zinger - Double stack chicken with Wahshi chili sauce",
    badge: "Chili Spicy \u{1F525}",
    bgImage: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?w=1000&auto=format&fit=crop&q=80"
  },
  {
    id: "p4",
    title: "THE BOYS FEAST COMBO",
    description: "2 Zinger Wraps + Loaded Fries + 2 Lemon Sodas for only Rs. 1400",
    badge: "Save 15%",
    bgImage: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=1000&auto=format&fit=crop&q=80"
  }
];
var INITIAL_REVIEWS = [
  {
    id: "r1",
    name: "Hamza Malik",
    rating: 5,
    comment: "The Wahshi Zinger Burger is literally out of this world! Massive chicken portion, crispy exterior, and the spice level is perfectly customizable. Living in Second Home Hostel, we order this almost every lock-in night! Highly recommended!",
    date: "2 Days ago",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    tag: "Hostel Resident"
  },
  {
    id: "r2",
    name: "Zainab Qazi",
    rating: 5,
    comment: "Extremely fresh and top-notch hygiene! The Jalapeno Beef Smash is juicy, with perfectly smashed thin edges. Mint Margarita is perfect refreshment on hot days. Delivery was extremely fast, took only 25 minutes to our location.",
    date: "1 Week ago",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    tag: "Verified Diner"
  },
  {
    id: "r3",
    name: "Daniyal Ahmed",
    rating: 4.8,
    comment: "Solid price-to-portion value. Plain Shawarma is super authentic, and Garlic Mayo Fries are thick and creamy. Excellent delivery service by M. D. M. Irfan\u2019s team directly to Bherapul Soneri Bank area. Will order again!",
    date: "3 Days ago",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    tag: "Regular Customer"
  }
];

// server.ts
import crypto from "crypto";
dotenv.config();
var app = express();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var PORT = Number(process.env.PORT ?? 3e3);
var NODE_ENV = process.env.NODE_ENV ?? "development";
var JWT_SECRET = process.env.JWT_SECRET ?? "fast_burgerz_secret_key_123!";
var DATA_ROOT = __dirname;
var DB_PATH = path.join(DATA_ROOT, "db.json");
function readDB() {
  const raw = fs.readFileSync(DB_PATH, "utf8");
  return JSON.parse(raw);
}
function writeDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}
function ensureSeededDB() {
  if (!fs.existsSync(DB_PATH)) {
    const seeded = {
      customers: [],
      products: INITIAL_PRODUCTS,
      promotions: PROMOTION_BANNERS,
      reviews: INITIAL_REVIEWS,
      orders: [],
      meta: { seededFrom: "src/data.ts", version: 1, seededAt: (/* @__PURE__ */ new Date()).toISOString() }
    };
    const adminPhone2 = "03409631937";
    const adminPass = "admin123";
    const salt = cryptoRandomString(16);
    const hash = sha256Hex(salt + adminPass);
    seeded.customers.push({
      id: "admin-1",
      role: "admin",
      name: "FAST Burgerz Admin",
      phone: adminPhone2,
      passwordHash: hash,
      passwordSalt: salt,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    writeDB(seeded);
    return;
  }
  const db = readDB();
  let changed = false;
  if (!Array.isArray(db.products) || db.products.length === 0) {
    db.products = INITIAL_PRODUCTS;
    changed = true;
  }
  if (!Array.isArray(db.promotions) || db.promotions.length === 0) {
    db.promotions = PROMOTION_BANNERS;
    changed = true;
  }
  if (!Array.isArray(db.reviews) || db.reviews.length === 0) {
    db.reviews = INITIAL_REVIEWS;
    changed = true;
  }
  if (!Array.isArray(db.customers)) {
    db.customers = [];
    changed = true;
  }
  if (!Array.isArray(db.orders)) {
    db.orders = [];
    changed = true;
  }
  const adminPhone = "03409631937";
  const hasAdmin = (db.customers ?? []).some((c) => c.role === "admin" && c.phone === adminPhone);
  if (!hasAdmin) {
    const adminPass = "admin123";
    const salt = cryptoRandomString(16);
    const hash = sha256Hex(salt + adminPass);
    db.customers.push({
      id: "admin-1",
      role: "admin",
      name: "FAST Burgerz Admin",
      phone: adminPhone,
      passwordHash: hash,
      passwordSalt: salt,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    changed = true;
  }
  if (changed) {
    db.meta = db.meta ?? { seededFrom: "src/data.ts", version: 1 };
    db.meta.seededFrom = db.meta.seededFrom || "src/data.ts";
    db.meta.version = db.meta.version ?? 1;
    db.meta.seededAt = db.meta.seededAt || (/* @__PURE__ */ new Date()).toISOString();
    writeDB(db);
  }
}
function cryptoRandomString(len) {
  return crypto.randomBytes(len).toString("hex").slice(0, len);
}
function sha256Hex(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}
function signToken(customer) {
  const payload = { sub: customer.id, role: customer.role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
function requireAdmin(req, res, next) {
  authMiddleware(req, res, () => {
    const user = req.user;
    if (user?.role !== "admin") return res.status(403).json({ error: "Admin only" });
    next();
  });
}
function requireRole(role) {
  return (req, res, next) => {
    authMiddleware(req, res, () => {
      const user = req.user;
      if (user?.role !== role) return res.status(403).json({ error: "Wrong role" });
      next();
    });
  };
}
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
ensureSeededDB();
app.post("/api/auth/register", (req, res) => {
  const { name, phone, password } = req.body;
  if (!name?.trim() || !phone?.trim() || !password?.trim()) {
    return res.status(400).json({ error: "name, phone, password required" });
  }
  const db = readDB();
  const existing = db.customers.find((c) => c.phone === phone);
  if (existing) return res.status(409).json({ error: "Phone already registered" });
  const salt = cryptoRandomString(16);
  const passwordHash = sha256Hex(salt + password);
  const customer = {
    id: "cust-" + Date.now().toString(36) + "-" + cryptoRandomString(4),
    role: "customer",
    name: name.trim(),
    phone: phone.trim(),
    passwordHash,
    passwordSalt: salt,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.customers.push(customer);
  writeDB(db);
  return res.json({ ok: true });
});
app.post("/api/auth/login", (req, res) => {
  const { phone, password, role } = req.body;
  if (!phone?.trim() || !password?.trim()) {
    return res.status(400).json({ error: "phone and password required" });
  }
  const db = readDB();
  const customer = db.customers.find((c) => c.phone === phone.trim() && (role ? c.role === role : true));
  if (!customer) return res.status(401).json({ error: "Invalid credentials" });
  const computedHash = sha256Hex(customer.passwordSalt + password);
  if (computedHash !== customer.passwordHash) return res.status(401).json({ error: "Invalid credentials" });
  const token = signToken(customer);
  return res.json({ token, user: { id: customer.id, role: customer.role, name: customer.name, phone: customer.phone } });
});
app.get("/api/auth/me", authMiddleware, (req, res) => {
  const { sub } = req.user;
  const db = readDB();
  const customer = db.customers.find((c) => c.id === sub);
  if (!customer) return res.status(404).json({ error: "User not found" });
  return res.json({ id: customer.id, role: customer.role, name: customer.name, phone: customer.phone });
});
app.get("/api/products", (_req, res) => {
  const db = readDB();
  res.json(db.products);
});
app.post("/api/products", requireAdmin, (req, res) => {
  const db = readDB();
  const body = req.body;
  const item = {
    id: body.id?.trim() || "custom-" + Date.now().toString(36),
    name: body.name,
    price: body.price,
    category: body.category,
    description: body.description,
    image: body.image,
    rating: body.rating ?? 4.5,
    isPopular: body.isPopular,
    isNew: body.isNew,
    tags: body.tags
  };
  db.products = [item, ...db.products ?? []];
  writeDB(db);
  res.json(item);
});
app.put("/api/products/:id", requireAdmin, (req, res) => {
  const db = readDB();
  const id = req.params.id;
  const idx = db.products.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  db.products[idx] = { ...db.products[idx], ...req.body };
  writeDB(db);
  res.json(db.products[idx]);
});
app.delete("/api/products/:id", requireAdmin, (req, res) => {
  const db = readDB();
  const id = req.params.id;
  db.products = (db.products ?? []).filter((p) => p.id !== id);
  writeDB(db);
  res.json({ ok: true });
});
app.get("/api/promotions", (_req, res) => {
  const db = readDB();
  res.json(db.promotions ?? []);
});
app.post("/api/promotions", requireAdmin, (req, res) => {
  const db = readDB();
  const body = req.body;
  const item = {
    id: body.id?.trim() || "promo-" + Date.now().toString(36),
    title: body.title,
    description: body.description,
    badge: body.badge,
    bgImage: body.bgImage,
    code: body.code
  };
  db.promotions = [item, ...db.promotions ?? []];
  writeDB(db);
  res.json(item);
});
app.delete("/api/promotions/:id", requireAdmin, (req, res) => {
  const db = readDB();
  const id = req.params.id;
  db.promotions = (db.promotions ?? []).filter((p) => p.id !== id);
  writeDB(db);
  res.json({ ok: true });
});
app.get("/api/reviews", (_req, res) => {
  const db = readDB();
  res.json(db.reviews ?? []);
});
app.post("/api/reviews", requireRole("customer"), (req, res) => {
  const db = readDB();
  const { name, rating, comment, tag, avatar } = req.body;
  if (!name?.trim() || !rating || !comment?.trim()) return res.status(400).json({ error: "Missing fields" });
  const review = {
    id: "rev-" + Date.now(),
    name: name.trim(),
    rating: Number(rating),
    comment: comment.trim(),
    date: "Just now",
    avatar: avatar?.trim() || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    tag: tag || "Customer"
  };
  db.reviews = [review, ...db.reviews ?? []];
  writeDB(db);
  res.json(review);
});
app.get("/api/orders", authMiddleware, (req, res) => {
  const user = req.user;
  const db = readDB();
  if (user.role === "admin") {
    return res.json(db.orders ?? []);
  }
  const mine = (db.orders ?? []).filter((o) => o.customerId === user.sub);
  return res.json(mine);
});
app.post("/api/orders", (req, res) => {
  const body = req.body;
  let customerId = void 0;
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : void 0;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      customerId = decoded.sub;
    } catch {
    }
  }
  const required = ["customerName", "customerPhone", "deliveryAddress", "items", "subtotal", "deliveryCharges", "total", "paymentMethod"];
  for (const k of required) {
    if (body[k] === void 0 || typeof body[k] === "string" && !body[k].trim()) {
      return res.status(400).json({ error: `Missing ${k}` });
    }
  }
  const trackCode = body.items?.length ? "FB-" + Math.floor(1e5 + Math.random() * 9e5) : "FB-000000";
  const orderId = "ORD-" + Date.now().toString().slice(-6);
  const now = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const newOrder = {
    id: orderId,
    customerName: body.customerName,
    customerPhone: body.customerPhone,
    deliveryAddress: body.deliveryAddress,
    items: body.items,
    subtotal: body.subtotal,
    discount: body.discount,
    deliveryCharges: body.deliveryCharges,
    total: body.total,
    status: body.status ?? "Pending",
    paymentMethod: body.paymentMethod,
    placedAt: now,
    notes: body.notes,
    trackCode,
    customerId
  };
  const db = readDB();
  db.orders = [newOrder, ...db.orders ?? []];
  writeDB(db);
  res.json({ ok: true, order: { ...newOrder, customerId: void 0 } });
});
app.put("/api/orders/:id", requireAdmin, (req, res) => {
  const db = readDB();
  const id = req.params.id;
  const idx = (db.orders ?? []).findIndex((o) => o.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  db.orders[idx] = { ...db.orders[idx], ...req.body };
  writeDB(db);
  res.json(db.orders[idx]);
});
app.delete("/api/orders/:id", requireAdmin, (req, res) => {
  const db = readDB();
  const id = req.params.id;
  db.orders = (db.orders ?? []).filter((o) => o.id !== id);
  writeDB(db);
  res.json({ ok: true });
});
app.get("/api/orders/lookup/:track", (req, res) => {
  const { track } = req.params;
  const db = readDB();
  const user = req.user;
  const cleaned = track.trim().toUpperCase();
  const matches = (db.orders ?? []).filter((o) => o.trackCode?.toUpperCase() === cleaned || o.id?.toUpperCase() === cleaned);
  if (user.role === "admin") return res.json(matches[0] ?? null);
  const mine = matches.find((m) => m.customerId === user.sub);
  res.json(mine ?? null);
});
async function start() {
  if (NODE_ENV !== "production") {
    const vite = await import("vite");
    const { createServer } = vite;
    const viteServer = await createServer({
      server: { middlewareMode: true, watch: { usePolling: true } }
    });
    app.use(viteServer.middlewares);
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[server] Dev server listening on http://0.0.0.0:${PORT}`);
    });
    return;
  }
  const distDir = path.join(DATA_ROOT, "dist");
  app.use(express.static(distDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[server] Production server listening on http://0.0.0.0:${PORT}`);
  });
}
start().catch((err) => {
  console.error(err);
  process.exit(1);
});
