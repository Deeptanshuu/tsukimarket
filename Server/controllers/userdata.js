const jwt = require('jsonwebtoken');
const { client } = require("../controllers/db");
const mongo = require('mongodb');

exports.userphone = async (req, res) => {
    const { token, phone } = req.body; // Destructure token and phone from req.body


    if (!token) return res.status(401).send('Missing token');
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        if (!phone) return res.status(400).send('Phone number is required');
        
        // Your phone number validation logic here
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
        if (!phoneRegex.test(phone)) return res.status(400).send('Invalid phone number');

        const db = client.db("Tsuki");
        const collection = db.collection("Users");
        const user = await collection.findOne({ username: decoded.username, email: decoded.email });

        if (!user) {
            return res.status(400).send('User not found');
        }
        
        await collection.updateOne(
            { username: decoded.username, email: decoded.email },
            { $set: { phone: phone } }
        );

        const newuser = await collection.findOne({ username: decoded.username, email: decoded.email });
        const userdata = {
            username: newuser.username,
            email: newuser.email,
            phone: newuser.phone,
            id: newuser._id,
            address: newuser.address
        };       

        const newtoken = jwt.sign(userdata, process.env.JWT_KEY, { expiresIn: '1h' });
        return res.status(200).send(newtoken);

    } catch (error) {
        //console.error(error);
        return res.status(401).send(error.message);
    }
};

exports.useraddress = async (req, res) => {
    const token = req.body.token;

    if (!token) return res.status(401).send('Missing token');

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const { address } = req.body;

        if (!address) return res.status(400).send('Address is required');


        const db = client.db("Tsuki");
        const collection = db.collection("Users");
        const user = await collection.findOne({ username: decoded.username, email: decoded.email });

        if (!user) {
            return res.status(400).send('User not found');
        }

        await collection.updateOne(
            { username: decoded.username, email: decoded.email },
            { $set: { address: address } }
        );
        
        const newuser = await collection.findOne({ username: decoded.username, email: decoded.email });
        const userdata = {
            username: newuser.username,
            email: newuser.email,
            phone: newuser.phone,
            id: newuser._id,
            address: newuser.address
        };

        const newtoken = jwt.sign(userdata, process.env.JWT_KEY, { expiresIn: '1h' });
        return res.status(200).send(newtoken);

    } catch (error) {
        console.error(error);
        return res.status(401).send('Invalid token');
    }
}

exports.orderhistory = async (req, res) => {
    const token = req.body.token;
    if (!token) return res.status(401).send('Missing token');

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const db = client.db("Tsuki");
        const collection = db.collection("Order");

        const user = await collection.find({
            customer: decoded.username,
            customer_email: decoded.email,
            status: { $in: ["paid", "cancelled"] }
        }).sort({ date: -1 }).toArray();
        
        //console.log(user);
        if (user.length === 0) {
            var payload = {
                status: 400,
                message: "No order history",
            }
            return res.status(400).send(payload);
        }

        const order = user.map((item) => ({
            id: item._id,
            name: item.customer,
            item: item.order,
            status: item.status,
            quantity: item.quantity,
            price: item.price,
            date: item.date
        }));

        return res.status(200).send(order);

    } catch (error) {
        console.error(error);
        return res.status(401).send('Invalid token');
    }
}

exports.invoice = async (req, res) => {
    const order_id = req.body.id;
    const o_id = new mongo.ObjectId(order_id);
    const token = req.body.token;
    if (!token) return res.status(401).send('Missing token');

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const db = client.db("Tsuki");

        const collection_user = db.collection("Users");

        const user = await collection_user.findOne({
            email: decoded.email
        });
        
        if (!user) {
            return res.status(400).send('User not found');
        }

        const collection_order = db.collection("Order");

        const user_order = await collection_order.findOne({
            '_id': o_id,
        });
        
        if (!user_order) {
            return res.status(400).send('You have no order history');
        }

        const payload = {
            id: user_order._id,
            user: decoded.username,
            user_email: decoded.email,
            user_phone: decoded.phone,
            user_address: decoded.address,
            order: user_order.order,
            status: user_order.status,
            quantity: user_order.quantity,
            price: user_order.price,
            date: user_order.date
        };

        return res.status(200).send({ payload });

    } catch (error) {
        console.error(error);
        return res.status(401).send('Invalid token');
    }

}
