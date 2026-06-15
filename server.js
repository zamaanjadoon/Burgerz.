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
    image: "https://stock.adobe.com/search?k=grill+chicken+burger",
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
    image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=600&auto=format&fit=crop&q=80",
    rating: 4.3,
    tags: ["Classic", "Vibe"]
  },
  {
    id: "f2",
    name: "Garlic Mayo Fries",
    price: 150,
    category: "fries",
    description: "Our golden fries loaded with a rich dressing of customized creamy home-made garlic powder mayo and a sprinkling of minced parsley.",
    image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=600&auto=format&fit=crop&q=80",
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
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4B7kjoKbFBkyT0vYNLzlX_K5xLGUqPrHFndqgJosuMQ&s=10",
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
data:image/jpeg;base64,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    rating: 4.4,
    tags: ["Toasted", "Filling"]
  },
  // Drinks
  {
    id: "dr1",
    name: "Mint Margarita",
    price: 150,
    category: "drinks",
    description: "Wonderfully chilled summer absolute refresher blend of cool ice, sparkling soda, sweet citrus juice, and freshly ground vibrant green organic mint leaves.",
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1543002588-bfa5c5d1bdf9?w=600&auto=format&fit=crop&q=80",
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
    avatar: "https://media-cdn.tripadvisor.com/media/photo-s/0c/ea/8e/f0/wehshi-zinger.jpg",
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
