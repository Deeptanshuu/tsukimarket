const dotenv = require("dotenv");
dotenv.config({path: './.env' });
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const jwt = require("jsonwebtoken");
const { client } = require("../controllers/db");



exports.makePayment = async (req, res) => {
    //console.log(req.body);

    const cart = JSON.parse(req.body.cart);
    const token = JSON.parse(req.body.token);

    const lineitems = cart.map((item) => {
        return {
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        };
    });

    //console.log(lineitems);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineitems,
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
    });

    console.log(session);

    const order = cart.map((item) => ({
        item: item.name,
        quantity: item.quantity,
        price: item.price,
    }));
    

    res.json({ id: session.id });
}

