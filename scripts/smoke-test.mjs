#!/usr/bin/env node
// End-to-end smoke test for the Tsuki Market API.
//
//   node scripts/smoke-test.mjs                          # tests https://tsukimarket.vercel.app
//   node scripts/smoke-test.mjs http://localhost:8181    # tests a local server
//
// Creates throwaway users named tsuki_smoke_<random> (they stay in the database),
// starts a Stripe checkout with a tampered cart and checks the server ignores the
// fake price. Prints the Stripe sandbox checkout URL at the end if you want to pay
// it with a test card (India accounts: 4000 0035 6000 0008, any future date, any CVC).

const BASE = (process.argv[2] || "https://tsukimarket.vercel.app").replace(/\/$/, "");
const rand = () => Math.random().toString(36).slice(2, 8);
const userA = { username: `tsuki_smoke_${rand()}`, password: `pw_${rand()}${rand()}` };
userA.email = `${userA.username}@example.com`;

let passed = 0, failed = 0;
const check = (name, ok, extra = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? `  (${extra})` : ""}`);
  ok ? passed++ : failed++;
};

async function call(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = text;
  try { data = JSON.parse(text); } catch {}
  return { status: res.status, type: res.headers.get("content-type") || "", data };
}

console.log(`Testing ${BASE}\n`);

// --- basics
let r = await call("GET", "/db/items");
check("GET /db/items returns JSON (api routes not swallowed by the react catch-all)", r.status === 200 && r.type.includes("json"));
r = await call("GET", "/");
check("GET / serves the react app", r.status === 200 && String(r.data).includes('id="root"'));

// --- auth
r = await call("POST", "/auth/signup", userA);
check("signup works", r.status === 200, r.status !== 200 ? `${r.status} ${r.data}` : "");
r = await call("POST", "/auth/signup", userA);
check("duplicate username rejected", r.status === 400);
r = await call("POST", "/auth/login", { username: userA.username, password: "wrong-password" });
check("wrong password rejected", r.status === 401);
r = await call("POST", "/auth/login", { username: { $ne: null }, password: { $ne: null } });
check("mongo operator injection rejected", r.status === 400);
r = await call("POST", "/auth/login", { username: userA.username, password: userA.password });
let token = typeof r.data === "string" ? r.data : "";
check("login works (bcrypt)", r.status === 200 && token.split(".").length === 3);

// --- profile (checkout needs phone + address in the token)
r = await call("POST", "/db/user_phone", { token, phone: "9876543210" });
check("set phone", r.status === 200);
if (r.status === 200) token = r.data;
r = await call("POST", "/db/user_address", { token, address: "221B Smoke Test Street, Mumbai" });
check("set address", r.status === 200);
if (r.status === 200) token = r.data;

// --- checkout with a tampered price
const cart = [{ id: "m-1 M", ref: "m-1", name: "Melted Sweater", size: "M", price: 1, quantity: 1 }];
r = await call("POST", "/db/payment", { token: JSON.stringify(token), cart: JSON.stringify(cart) });
const session = r.data || {};
check("checkout session created", r.status === 200 && String(session.id).startsWith("cs_"), r.status !== 200 ? `${r.status} ${JSON.stringify(r.data)}` : "");
check("server returns a hosted checkout url", typeof session.url === "string" && session.url.startsWith("https://checkout.stripe.com"));
r = await call("POST", "/db/payment", { token: "not-a-token", cart: JSON.stringify(cart) });
check("checkout without a valid login rejected", r.status === 401);
r = await call("POST", "/db/payment", { token: JSON.stringify(token), cart: JSON.stringify([{ ref: "does-not-exist", quantity: 1 }]) });
check("unknown product rejected", r.status === 400);

// --- payment verification
if (session.id) {
  r = await call("POST", "/db/payment_status", { token, status: "ok", session_id: session.id });
  check("unpaid session is NOT marked paid", r.status === 402, `got ${r.status}`);
}
r = await call("POST", "/db/payment_status", { token: "not-a-token", status: "ok", session_id: "cs_test_x" });
check("payment_status with bad token -> 401 (no crash)", r.status === 401);
r = await call("POST", "/db/invoice", { token, id: "not-an-id" });
check("invoice with bad order id -> 400 (no crash)", r.status === 400);

console.log(`\n${passed} passed, ${failed} failed`);
console.log(`Throwaway user created: ${userA.username}`);
if (session.url) {
  console.log(`\nStripe sandbox checkout (should say ₹10,000.00 even though the cart said ₹1):\n${session.url}`);
}
process.exit(failed ? 1 : 0);
