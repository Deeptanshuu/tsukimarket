const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "..", ".env") });
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const { client } = require("../controllers/db");
const catalog = require("../items.json");

const TAX_RATE = 0.1;          // 10%, same as the cart page
const SHIPPING_PER_ITEM = 100; // ₹100 per item, same as the cart page
const MAX_QTY = 10;

// id -> item, prices always come from here and never from the client
const itemsById = {};
(Array.isArray(catalog) ? catalog : [catalog]).forEach((group) => {
    Object.values(group).forEach((list) => {
        if (Array.isArray(list)) list.forEach((item) => { itemsById[item.id] = item; });
    });
});

// client sends some fields JSON.stringify-ed, accept both
const parseMaybeJSON = (value) => {
    if (typeof value !== "string") return value;
    try { return JSON.parse(value); } catch { return value; }
};

const toPaise = (rupees) => Math.round(rupees * 100);

const getOrigin = (req) => {
    const allowed = process.env.CLIENT_ORIGIN
        ? process.env.CLIENT_ORIGIN.split(",").map((o) => o.trim())
        : null;
    // no Origin header (curl, scripts) -> assume the frontend is served by this same host
    const proto = (req.get("x-forwarded-proto") || req.protocol).split(",")[0];
    const origin = req.get("origin") || `${proto}://${req.get("host")}`;
    if (!allowed) return origin;
    return allowed.includes(origin) ? origin : allowed[0];
};

exports.makePayment = async (req, res) => {
    let decoded;
    try {
        decoded = jwt.verify(parseMaybeJSON(req.body.token), process.env.JWT_KEY);
    } catch (error) {
        return res.status(401).json({ error: "Session expired, please login again" });
    }

    const cart = parseMaybeJSON(req.body.cart);
    if (!Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ error: "Your cart is empty" });
    }

    // rebuild the cart from the catalog
    const order = [];
    for (const entry of cart) {
        const ref = entry.ref || String(entry.id || "").split(" ")[0];
        const product = itemsById[ref];
        const quantity = Number(entry.quantity);
        const size = String(entry.size || "").slice(0, 10);

        if (!product || !product.inStock) {
            return res.status(400).json({ error: `Item not available: ${entry.name || ref}` });
        }
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY) {
            return res.status(400).json({ error: `Invalid quantity for ${product.name}` });
        }

        order.push({
            ref: product.id,
            item: product.name + " -" + size + "- ",
            size,
            quantity,
            price: product.price,
        });
    }

    const subtotal = order.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalItems = order.reduce((sum, i) => sum + i.quantity, 0);

    const lineitems = order.map((i) => ({
        price_data: {
            currency: "inr",
            product_data: { name: i.item, metadata: { size: i.size, ref: i.ref } },
            unit_amount: toPaise(i.price),
        },
        quantity: i.quantity,
    }));
    lineitems.push({
        price_data: {
            currency: "inr",
            product_data: { name: `Shipping (₹${SHIPPING_PER_ITEM}/item)` },
            unit_amount: toPaise(SHIPPING_PER_ITEM),
        },
        quantity: totalItems,
    });
    lineitems.push({
        price_data: {
            currency: "inr",
            product_data: { name: `Tax (${TAX_RATE * 100}%)` },
            unit_amount: toPaise(subtotal * TAX_RATE),
        },
        quantity: 1,
    });

    const db = client.db("Tsuki");
    const Order = db.collection("Order");
    let orderId;

    try {
        const inserted = await Order.insertOne({
            customer: decoded.username,
            customer_email: decoded.email,
            order: order,
            status: "unpaid",
            date: new Date(),
        });
        orderId = inserted.insertedId;

        const origin = getOrigin(req);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineitems,
            mode: "payment",
            customer_email: decoded.email,
            client_reference_id: String(orderId),
            metadata: { order_id: String(orderId) },
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cancel?order_id=${orderId}`,
        });

        await Order.updateOne({ _id: orderId }, { $set: { stripe_session_id: session.id } });
        // session.url is stripe's hosted checkout page, the client just redirects to it
        return res.json({ id: session.id, url: session.url });

    } catch (error) {
        console.error("Error creating checkout session:", error.message);
        if (orderId) await Order.deleteOne({ _id: orderId }).catch(() => {});
        return res.status(500).json({ error: "Could not start checkout, try again" });
    }
};

// Marks an order paid only if stripe says the session is actually paid
const markOrderPaid = async (session, username) => {
    if (!session || session.payment_status !== "paid" || !session.metadata?.order_id) return null;

    const filter = { _id: new ObjectId(session.metadata.order_id), stripe_session_id: session.id };
    if (username) filter.customer = username;

    const Order = client.db("Tsuki").collection("Order");
    await Order.updateOne({ ...filter, status: { $ne: "paid" } }, { $set: { status: "paid" } });
    return Order.findOne(filter);
};
exports.markOrderPaid = markOrderPaid;

exports.paymentstatus = async (req, res) => {
    const { status, session_id, order_id } = req.body;

    let decoded;
    try {
        decoded = jwt.verify(parseMaybeJSON(req.body.token), process.env.JWT_KEY);
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const Order = client.db("Tsuki").collection("Order");

        switch (status) {
            case "ok": {
                if (typeof session_id !== "string" || !session_id) {
                    return res.status(400).json({ error: "Missing session id" });
                }
                const session = await stripe.checkout.sessions.retrieve(session_id);
                const updated = await markOrderPaid(session, decoded.username);
                if (!updated) {
                    return res.status(402).json({ status: session.payment_status });
                }
                return res.json({ status: updated.status });
            }

            case "fail": {
                if (!ObjectId.isValid(order_id)) {
                    return res.status(400).json({ error: "Missing order id" });
                }
                await Order.updateOne(
                    { _id: new ObjectId(order_id), customer: decoded.username, status: "unpaid" },
                    { $set: { status: "cancelled" } }
                );
                return res.json({ status: "cancelled" });
            }

            default:
                return res.status(400).json({ error: "Unknown status" });
        }
    } catch (error) {
        console.error("Error updating payment status:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
