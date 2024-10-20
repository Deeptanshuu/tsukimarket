// API tests with MongoDB and Stripe stubbed out, no network or real database needed.
// Run: npm test
const path = require("path");
const SERVER = path.join(__dirname, "..");
const req = (m) => require(require.resolve(m, { paths: [SERVER] }));
const Module = require("module");
const { ObjectId } = req("mongodb");
const jwt = req("jsonwebtoken");
const bcrypt = req("bcrypt");

process.env.MONGODB_URI = "mongodb://stub";
process.env.JWT_KEY = "test-key";
process.env.STRIPE_SECRET_KEY = "sk_test_stub";
process.env.PORT = "18181";
delete process.env.CLIENT_ORIGIN; delete process.env.STRIPE_WEBHOOK_SECRET;

// ---- fake mongo
const match = (doc, f) => Object.entries(f).every(([k, v]) => {
  const d = doc[k];
  if (v && typeof v === "object" && !(v instanceof ObjectId)) {
    if ("$ne" in v) return String(d) !== String(v.$ne);
    if ("$in" in v) return v.$in.includes(d);
  }
  return String(d) === String(v);
});
const dbs = {};
const coll = (name) => {
  const rows = (dbs[name] ||= []);
  return {
    rows,
    async findOne(f) { return rows.find((r) => match(r, f)) || null; },
    find(f) { const r = rows.filter((x) => match(x, f)); return { sort() { return this; }, toArray: async () => r }; },
    async insertOne(d) { const _id = new ObjectId(); rows.push({ _id, ...d }); return { insertedId: _id }; },
    async updateOne(f, u) { const r = rows.find((x) => match(x, f)); if (r) Object.assign(r, u.$set); return { matchedCount: r ? 1 : 0 }; },
    async deleteOne(f) { const i = rows.findIndex((x) => match(x, f)); if (i >= 0) rows.splice(i, 1); },
  };
};
const fakeClient = { db: () => ({ collection: coll }), connect: async () => {} };
const dbPath = path.join(SERVER, "controllers", "db.js");
require.cache[dbPath] = { id: dbPath, filename: dbPath, loaded: true, exports: { client: fakeClient, connect: async () => {} } };

// ---- fake stripe
const sessions = {};
let lastCreate;
const fakeStripe = () => ({
  checkout: { sessions: {
    create: async (o) => { lastCreate = o; const id = "cs_test_" + Object.keys(sessions).length; sessions[id] = { id, url: "https://checkout.stripe.com/c/pay/" + id, payment_status: "unpaid", metadata: o.metadata }; return sessions[id]; },
    retrieve: async (id) => { if (!sessions[id]) throw new Error("no such session"); return sessions[id]; },
  } },
  webhooks: { constructEvent: () => { throw new Error("bad sig"); } },
});
const origLoad = Module._load;
Module._load = function (r, ...rest) { return r === "stripe" ? fakeStripe : origLoad.call(this, r, ...rest); };

require(path.join(SERVER, "app.js"));

const base = "http://localhost:18181";
const post = (p, body) => fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json", Origin: "http://localhost:3000" }, body: JSON.stringify(body) });
let fails = 0;
const check = (name, ok, extra = "") => { console.log((ok ? "PASS " : "FAIL ") + name + (extra ? "  " + extra : "")); if (!ok) fails++; };

setTimeout(async () => {
  try {
    coll("Items").rows.push({ melts: [] });
    let r = await fetch(base + "/db/items");
    check("GET /db/items returns JSON, not index.html", (r.headers.get("content-type") || "").includes("json"));
    r = await fetch(base + "/shop");
    check("GET /shop still serves the react app", (await r.text()).includes("<div id=\"root\">"));

    r = await post("/auth/signup", { username: "alice", password: "secret1", email: "a@x.com" });
    check("signup ok", r.status === 200);
    const alice = coll("Users").rows.find((u) => u.username === "alice");
    check("password stored as bcrypt hash", /^\$2[aby]\$/.test(alice.password));
    r = await post("/auth/login", { username: "alice", password: "secret1" });
    const tokA = await r.text();
    check("login with hash works", r.status === 200 && jwt.verify(tokA, "test-key").username === "alice");
    r = await post("/auth/login", { username: "alice", password: "wrong" });
    check("wrong password rejected", r.status === 401);
    r = await post("/auth/login", { username: { $ne: null }, password: { $ne: null } });
    check("operator injection rejected", r.status === 400);

    coll("Users").rows.push({ _id: new ObjectId(), username: "old", password: "plain123", email: "o@x.com", phone: "1", address: "x" });
    r = await post("/auth/login", { username: "old", password: "plain123" });
    const tokO = await r.text();
    check("legacy plaintext login works", r.status === 200);
    check("legacy password upgraded to hash", await bcrypt.compare("plain123", coll("Users").rows.find((u) => u.username === "old").password));

    // checkout with a tampered price
    const cart = [{ id: "m-1 M", ref: "m-1", name: "Melted Sweater", size: "M", price: 1, quantity: 2 }];
    r = await post("/db/payment", { token: JSON.stringify(tokO), cart: JSON.stringify(cart) });
    const pay = await r.json();
    check("payment session created", r.status === 200 && pay.id, JSON.stringify(pay));
    check("response includes the hosted checkout url", typeof pay.url === "string" && pay.url.startsWith("https://checkout.stripe.com"));
    const li = lastCreate.line_items;
    check("item priced from catalog (9000 not 1)", li[0].price_data.unit_amount === 900000 && li[0].quantity === 2);
    check("shipping 100 x 2 items", li[1].price_data.unit_amount === 10000 && li[1].quantity === 2);
    check("tax 10% of 18000", li[2].price_data.unit_amount === 180000);
    check("success_url uses CHECKOUT_SESSION_ID template", lastCreate.success_url.endsWith("session_id={CHECKOUT_SESSION_ID}"));
    const order = coll("Order").rows[0];
    check("order stored with server price + session id", order.order[0].price === 9000 && order.stripe_session_id === pay.id && order.status === "unpaid");

    r = await post("/db/payment", { token: JSON.stringify(tokO), cart: JSON.stringify([{ ref: "nope", quantity: 1 }]) });
    check("unknown item rejected", r.status === 400);
    r = await post("/db/payment", { token: "garbage", cart: JSON.stringify(cart) });
    check("bad token on payment -> 401", r.status === 401);

    r = await post("/db/payment_status", { token: tokO, status: "ok", session_id: pay.id });
    check("unpaid session NOT marked paid", r.status === 402 && order.status === "unpaid");
    sessions[pay.id].payment_status = "paid";
    r = await post("/db/payment_status", { token: tokA, status: "ok", session_id: pay.id });
    check("other user can't confirm someone else's order", order.status === "unpaid");
    r = await post("/db/payment_status", { token: tokO, status: "ok", session_id: pay.id });
    check("paid session marks order paid + responds", r.status === 200 && order.status === "paid");
    r = await post("/db/payment_status", { token: "garbage", status: "ok", session_id: pay.id });
    check("bad token on payment_status -> 401 (no hang)", r.status === 401);

    r = await post("/db/invoice", { token: tokA, id: String(order._id) });
    check("invoice for another user's order -> 404", r.status === 404);
    r = await post("/db/invoice", { token: tokO, id: String(order._id) });
    check("invoice for own order -> 200", r.status === 200);
    r = await post("/db/invoice", { token: tokO, id: "not-an-id" });
    check("invalid order id -> 400", r.status === 400);

    r = await fetch(base + "/db/payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: JSON.stringify(tokO), cart: JSON.stringify(cart) }) });
    check("checkout works without an Origin header (falls back to request host)", r.status === 200 && lastCreate.success_url.startsWith("http://localhost:18181/success"));

    r = await post("/webhook", {});
    check("webhook not mounted without secret (falls to 404/SPA)", r.status !== 200 || !(await r.text()).includes("Webhook"));
  } catch (e) { console.error(e); fails++; }
  console.log(fails ? `${fails} FAILED` : "ALL PASSED");
  process.exit(fails ? 1 : 0);
}, 500);
