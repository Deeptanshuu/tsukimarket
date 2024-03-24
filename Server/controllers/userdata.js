const jwt = require('jsonwebtoken');
const { client } = require("../controllers/db");

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
