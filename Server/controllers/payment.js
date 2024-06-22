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
        const item_name = item.name + " -" + item.size + "- ";
        return {
            price_data: {
                currency: "inr",
                product_data: {
                    name: item_name,
                    metadata: {
                        size: item.size,
                    }
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        };
    });

    //console.log(lineitems);

    const origin = req.get('origin');

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineitems,
        mode: "payment",
        success_url: `${origin}/success?id=session.id`,
        cancel_url: `${origin}/cancel`,
    });

    //console.log(session);

    const order = cart.map((item) => ({
        item: item.name + " -" + item.size + "- ",
        quantity: item.quantity,
        price: item.price,
    }));
    
    //console.log(order);
    //console.log(session.payment_status);
    

    try {
        const db = client.db("Tsuki");
        const Order = db.collection("Order");
        
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const date = new Date();
        await Order.insertOne({
            customer: decoded.username,
            customer_email: decoded.email,
            order: order,
            status: session.payment_status,
            date: date.toLocaleString(),
        });

    } catch (error) {
        console.error("Error inserting order into database:", error);
        return res.status(500).send("Internal Server Error");
    } 

    res.json({ id: session.id });
}

exports.paymentstatus = async (req, res) => {

    const { token, status } = req.body;

    const db = client.db("Tsuki");
    const Order = db.collection("Order");
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    if (!decoded) {
        return res.status(401).send("Unauthorized");
    }

    const filter = { customer: decoded.username, status:"unpaid" };
    const sort = { date: -1 };

    switch (status) {
        case "ok":
            var update = { $set: { status: "paid" } };

            var result = await Order.findOneAndUpdate(filter, update, {
                sort,
                returnOriginal: false,
            });

            break;

        case "fail":
            var update = { $set: { status: "cancelled" } };
            var result = await Order.findOneAndUpdate(filter, update, {
                sort,
                returnOriginal: false,
            });
            break;

        default:
            console.error("Unknown status:", status);
            return res.status(400).send("Bad Request");
    }

}

