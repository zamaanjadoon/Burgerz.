import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';

// esbuild bundling defaults to CJS unless we tell it otherwise.
// Provide robust __dirname/__filename without relying on import.meta in production bundle.


import {
  BRAND_INFO,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  PROMOTION_BANNERS,
  INITIAL_COUPONS,
} from './src/data';
import { Product, Review, Promotion, Order } from './src/types';

dotenv.config();

const app = express();

// Ensure we can resolve paths in both TS/ESM and bundled environments.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT ?? 3000);
const NODE_ENV = process.env.NODE_ENV ?? 'development';

const JWT_SECRET = process.env.JWT_SECRET ?? 'fast_burgerz_secret_key_123!';

const DATA_ROOT = __dirname; // server.ts is at project root
const DB_PATH = path.join(DATA_ROOT, 'db.json');

type Customer = {
  id: string;
  role: 'customer' | 'admin';
  name: string;
  phone: string; // unique identifier for login
  passwordHash: string; // sha256
  passwordSalt: string;
  createdAt: string;
};

type DBShape = {
  customers: Customer[];
  products: Product[];
  promotions: Promotion[];
  reviews: Review[];
  orders: (Order & { customerId?: string })[];
  meta: {
    seededFrom: string;
    version: number;
    seededAt?: string;
  };
};

type JwtPayload = {
  sub: string; // customer id
  role: 'customer' | 'admin';
};

function readDB(): DBShape {
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(raw) as DBShape;
}

function writeDB(db: DBShape) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

function ensureSeededDB() {
  if (!fs.existsSync(DB_PATH)) {
    const seeded: DBShape = {
      customers: [],
      products: INITIAL_PRODUCTS,
      promotions: PROMOTION_BANNERS,
      reviews: INITIAL_REVIEWS,
      orders: [],
      meta: { seededFrom: 'src/data.ts', version: 1, seededAt: new Date().toISOString() },
    };

    // Seed admin account
    // Default admin credentials from prompt
    const adminPhone = '03409631937';
    const adminPass = 'admin123';
    const salt = cryptoRandomString(16);
    const hash = sha256Hex(salt + adminPass);

    seeded.customers.push({
      id: 'admin-1',
      role: 'admin',
      name: 'FAST Burgerz Admin',
      phone: adminPhone,
      passwordHash: hash,
      passwordSalt: salt,
      createdAt: new Date().toISOString(),
    });

    writeDB(seeded);
    return;
  }

  const db = readDB();
  let changed = false;

  // Seed missing arrays if empty
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


  // Seed admin if missing
  const adminPhone = '03409631937';
  const hasAdmin = (db.customers ?? []).some((c) => c.role === 'admin' && c.phone === adminPhone);
  if (!hasAdmin) {
    const adminPass = 'admin123';
    const salt = cryptoRandomString(16);
    const hash = sha256Hex(salt + adminPass);
    db.customers.push({
      id: 'admin-1',
      role: 'admin',
      name: 'FAST Burgerz Admin',
      phone: adminPhone,
      passwordHash: hash,
      passwordSalt: salt,
      createdAt: new Date().toISOString(),
    });
    changed = true;
  }

  if (changed) {
    db.meta = db.meta ?? { seededFrom: 'src/data.ts', version: 1 };
    db.meta.seededFrom = db.meta.seededFrom || 'src/data.ts';
    db.meta.version = db.meta.version ?? 1;
    db.meta.seededAt = db.meta.seededAt || new Date().toISOString();
    writeDB(db);
  }
}

import crypto from 'crypto';

function cryptoRandomString(len: number) {
  return crypto.randomBytes(len).toString('hex').slice(0, len);
}

function sha256Hex(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function signToken(customer: Customer) {
  const payload: JwtPayload = { sub: customer.id, role: customer.role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  authMiddleware(req, res, () => {
    const user = (req as any).user as JwtPayload;
    if (user?.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    next();
  });
}

function requireRole(role: 'customer' | 'admin') {
  return (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, () => {
      const user = (req as any).user as JwtPayload;
      if (user?.role !== role) return res.status(403).json({ error: 'Wrong role' });
      next();
    });
  };
}

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

ensureSeededDB();

// --- Auth ---
app.post('/api/auth/register', (req, res) => {
  const { name, phone, password } = req.body as { name: string; phone: string; password: string };
  if (!name?.trim() || !phone?.trim() || !password?.trim()) {
    return res.status(400).json({ error: 'name, phone, password required' });
  }

  const db = readDB();
  const existing = db.customers.find((c) => c.phone === phone);
  if (existing) return res.status(409).json({ error: 'Phone already registered' });

  const salt = cryptoRandomString(16);
  const passwordHash = sha256Hex(salt + password);

  const customer: Customer = {
    id: 'cust-' + Date.now().toString(36) + '-' + cryptoRandomString(4),
    role: 'customer',
    name: name.trim(),
    phone: phone.trim(),
    passwordHash,
    passwordSalt: salt,
    createdAt: new Date().toISOString(),
  };

  db.customers.push(customer);
  writeDB(db);

  return res.json({ ok: true });
});

app.post('/api/auth/login', (req, res) => {
  const { phone, password, role } = req.body as {
    phone: string;
    password: string;
    role?: 'customer' | 'admin';
  };

  if (!phone?.trim() || !password?.trim()) {
    return res.status(400).json({ error: 'phone and password required' });
  }

  const db = readDB();
  const customer = db.customers.find((c) => c.phone === phone.trim() && (role ? c.role === role : true));
  if (!customer) return res.status(401).json({ error: 'Invalid credentials' });

  const computedHash = sha256Hex(customer.passwordSalt + password);
  if (computedHash !== customer.passwordHash) return res.status(401).json({ error: 'Invalid credentials' });

  const token = signToken(customer);
  return res.json({ token, user: { id: customer.id, role: customer.role, name: customer.name, phone: customer.phone } });
});

app.get('/api/auth/me', authMiddleware, (req: Request, res: Response) => {
  const { sub } = (req as any).user as JwtPayload;
  const db = readDB();
  const customer = db.customers.find((c) => c.id === sub);
  if (!customer) return res.status(404).json({ error: 'User not found' });
  return res.json({ id: customer.id, role: customer.role, name: customer.name, phone: customer.phone });
});

// --- Products ---
app.get('/api/products', (_req, res) => {
  const db = readDB();
  res.json(db.products);
});

app.post('/api/products', requireAdmin, (req, res) => {
  const db = readDB();
  const body = req.body as Omit<Product, 'id'> & { id?: string };

  const item: Product = {
    id: body.id?.trim() || 'custom-' + Date.now().toString(36),
    name: body.name,
    price: body.price,
    category: body.category,
    description: body.description,
    image: body.image,
    rating: body.rating ?? 4.5,
    isPopular: body.isPopular,
    isNew: body.isNew,
    tags: body.tags,
  };

  db.products = [item, ...(db.products ?? [])];
  writeDB(db);
  res.json(item);
});

app.put('/api/products/:id', requireAdmin, (req, res) => {
  const db = readDB();
  const id = req.params.id;
  const idx = db.products.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  db.products[idx] = { ...db.products[idx], ...req.body };
  writeDB(db);
  res.json(db.products[idx]);
});

app.delete('/api/products/:id', requireAdmin, (req, res) => {
  const db = readDB();
  const id = req.params.id;
  db.products = (db.products ?? []).filter((p) => p.id !== id);
  writeDB(db);
  res.json({ ok: true });
});

// --- Promotions ---
app.get('/api/promotions', (_req, res) => {
  const db = readDB();
  res.json(db.promotions ?? []);
});

app.post('/api/promotions', requireAdmin, (req, res) => {
  const db = readDB();
  const body = req.body as Omit<Promotion, 'id'> & { id?: string };

  const item: Promotion = {
    id: body.id?.trim() || 'promo-' + Date.now().toString(36),
    title: body.title,
    description: body.description,
    badge: body.badge,
    bgImage: body.bgImage,
    code: body.code,
  };

  db.promotions = [item, ...(db.promotions ?? [])];
  writeDB(db);
  res.json(item);
});

app.delete('/api/promotions/:id', requireAdmin, (req, res) => {
  const db = readDB();
  const id = req.params.id;
  db.promotions = (db.promotions ?? []).filter((p) => p.id !== id);
  writeDB(db);
  res.json({ ok: true });
});

// --- Reviews ---
app.get('/api/reviews', (_req, res) => {
  const db = readDB();
  res.json(db.reviews ?? []);
});

app.post('/api/reviews', requireRole('customer'), (req, res) => {
  const db = readDB();
  const { name, rating, comment, tag, avatar } = req.body as Partial<Review>;
  if (!name?.trim() || !rating || !comment?.trim()) return res.status(400).json({ error: 'Missing fields' });

  const review: Review = {
    id: 'rev-' + Date.now(),
    name: name.trim(),
    rating: Number(rating),
    comment: comment.trim(),
    date: 'Just now',
    avatar: avatar?.trim() || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    tag: tag || 'Customer',
  };

  db.reviews = [review, ...(db.reviews ?? [])];
  writeDB(db);
  res.json(review);
});

// --- Orders ---
app.get('/api/orders', authMiddleware, (req, res) => {
  const user = (req as any).user as JwtPayload;
  const db = readDB();

  if (user.role === 'admin') {
    return res.json(db.orders ?? []);
  }

  const mine = (db.orders ?? []).filter((o) => o.customerId === user.sub);
  return res.json(mine);
});

app.post('/api/orders', (req, res) => {
  const body = req.body as {
    token?: string;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    items: Order['items'];
    subtotal: number;
    discount: number;
    deliveryCharges: number;
    total: number;
    status?: Order['status'];
    paymentMethod: Order['paymentMethod'];
    notes?: string;
  };

  // Optional auth: link order to customer if token is present
  let customerId: string | undefined = undefined;
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : undefined;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      customerId = decoded.sub;
    } catch {
      // ignore
    }
  }

  const required = ['customerName', 'customerPhone', 'deliveryAddress', 'items', 'subtotal', 'deliveryCharges', 'total', 'paymentMethod'] as const;
  for (const k of required) {
    if ((body as any)[k] === undefined || (typeof (body as any)[k] === 'string' && !(body as any)[k].trim())) {
      return res.status(400).json({ error: `Missing ${k}` });
    }
  }

  const trackCode = body.items?.length
    ? 'FB-' + Math.floor(100000 + Math.random() * 900000)
    : 'FB-000000';

  const orderId = 'ORD-' + Date.now().toString().slice(-6);
  const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const newOrder: Order & { customerId?: string } = {
    id: orderId,
    customerName: body.customerName,
    customerPhone: body.customerPhone,
    deliveryAddress: body.deliveryAddress,
    items: body.items,
    subtotal: body.subtotal,
    discount: body.discount,
    deliveryCharges: body.deliveryCharges,
    total: body.total,
    status: body.status ?? 'Pending',
    paymentMethod: body.paymentMethod,
    placedAt: now,
    notes: body.notes,
    trackCode,
    customerId,
  };

  const db = readDB();
  db.orders = [newOrder, ...(db.orders ?? [])];
  writeDB(db);

  res.json({ ok: true, order: { ...newOrder, customerId: undefined } });
});

app.put('/api/orders/:id', requireAdmin, (req, res) => {
  const db = readDB();
  const id = req.params.id;
  const idx = (db.orders ?? []).findIndex((o) => o.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  db.orders[idx] = { ...db.orders[idx], ...req.body };
  writeDB(db);
  res.json(db.orders[idx]);
});

app.delete('/api/orders/:id', requireAdmin, (req, res) => {
  const db = readDB();
  const id = req.params.id;
  db.orders = (db.orders ?? []).filter((o) => o.id !== id);
  writeDB(db);
  res.json({ ok: true });
});

// Track lookup for public UX (search by trackCode)
app.get('/api/orders/lookup/:track', (req, res) => {
  const { track } = req.params;
  const db = readDB();
  const user = (req as any).user as JwtPayload;

  const cleaned = track.trim().toUpperCase();
  const matches = (db.orders ?? []).filter((o) => o.trackCode?.toUpperCase() === cleaned || o.id?.toUpperCase() === cleaned);
  if (user.role === 'admin') return res.json(matches[0] ?? null);

  const mine = matches.find((m) => m.customerId === user.sub);
  res.json(mine ?? null);
});

// --- Dev integration with Vite (single port) ---
async function start() {
  if (NODE_ENV !== 'production') {
    const vite = await import('vite');
    const { createServer } = vite;
    const viteServer = await createServer({
      server: { middlewareMode: true, watch: { usePolling: true } },
    });
    // In middlewareMode, Vite must NOT be asked to listen separately.
    app.use(viteServer.middlewares);

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[server] Dev server listening on http://0.0.0.0:${PORT}`);
    });
    return;
  }

  // Production static serving
  const distDir = path.join(DATA_ROOT, 'dist');
  app.use(express.static(distDir));

  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[server] Production server listening on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});

