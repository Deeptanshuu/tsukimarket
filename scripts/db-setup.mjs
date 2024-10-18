#!/usr/bin/env node
// One-shot database setup / maintenance for Tsuki Market. Safe to run more than once.
//
//   node scripts/db-setup.mjs            # uses Server/.env
//   node scripts/db-setup.mjs --dry-run  # only report what it would do
//
// - seeds the Items collection from Server/items.json (what GET /db/items returns)
// - creates indexes (unique username/email, order lookups)
// - hashes any passwords still stored in plaintext
// - marks orders paid when Stripe says their checkout session was paid
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(path.join(root, "Server", "package.json"));
require("dotenv").config({ path: path.join(root, "Server", ".env") });
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const catalog = require(path.join(root, "Server", "items.json"));

const DRY = process.argv.includes("--dry-run");
const log = (...a) => console.log(DRY ? "[dry-run]" : "", ...a);

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI missing, fill in Server/.env first");
  process.exit(1);
}

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db("Tsuki");

// 1. Items
const Items = db.collection("Items");
const docs = (Array.isArray(catalog) ? catalog : [catalog]).map(({ _id, ...rest }) => ({
  _id: _id && ObjectId.isValid(_id) ? new ObjectId(_id) : new ObjectId(),
  ...rest,
}));
for (const doc of docs) {
  if (!DRY) await Items.replaceOne({ _id: doc._id }, doc, { upsert: true });
}
log(`Items: upserted ${docs.length} catalog document(s)`);

// 2. Indexes
const indexes = [
  ["Users", { username: 1 }, { unique: true, name: "username_unique" }],
  ["Users", { email: 1 }, { unique: true, name: "email_unique" }],
  ["Order", { customer: 1, date: -1 }, { name: "customer_date" }],
  ["Order", { stripe_session_id: 1 }, { name: "stripe_session", sparse: true }],
];
for (const [col, keys, opts] of indexes) {
  if (!DRY) await db.collection(col).createIndex(keys, opts);
  log(`Index: ${col}.${opts.name}`);
}

// 3. Plaintext passwords -> bcrypt
const Users = db.collection("Users");
const plain = await Users.find({ password: { $type: "string", $not: /^\$2[aby]\$/ } }).toArray();
for (const u of plain) {
  if (!DRY) await Users.updateOne({ _id: u._id }, { $set: { password: await bcrypt.hash(u.password, 10) } });
}
log(`Users: hashed ${plain.length} plaintext password(s)`);

// 4. Reconcile unpaid orders with Stripe
const Order = db.collection("Order");
const unpaid = await Order.find({ status: "unpaid", stripe_session_id: { $exists: true } }).toArray();
let fixed = 0;
if (unpaid.length && process.env.STRIPE_SECRET_KEY) {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  for (const o of unpaid) {
    try {
      const s = await stripe.checkout.sessions.retrieve(o.stripe_session_id);
      if (s.payment_status === "paid") {
        if (!DRY) await Order.updateOne({ _id: o._id }, { $set: { status: "paid" } });
        fixed++;
      }
    } catch (e) {
      // session from an old/rotated Stripe account, leave it alone
    }
  }
}
log(`Orders: ${fixed} of ${unpaid.length} unpaid order(s) were actually paid on Stripe and got marked paid`);

await client.close();
