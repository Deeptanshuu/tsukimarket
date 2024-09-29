const { client } = require("../controllers/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

const isHashed = (password) => typeof password === "string" && /^\$2[aby]\$/.test(password);

// Function to handle login form submission
exports.login = async (req, res) => {
    const { username, password } = req.body;

    // only accept plain strings, stops stuff like { "$ne": null } reaching mongo
    if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
        return res.status(400).send('Please fill all required fields');
    }

    const db = client.db("Tsuki");
    const collection = db.collection("Users");

    try {
        const user = await collection.findOne({ username });

        let valid = false;
        if (user && isHashed(user.password)) {
            valid = await bcrypt.compare(password, user.password);
        } else if (user && user.password === password) {
            // old account from before hashing, upgrade it now that we know the password
            valid = true;
            const hash = await bcrypt.hash(password, SALT_ROUNDS);
            await collection.updateOne({ _id: user._id }, { $set: { password: hash } });
        }

        if (!valid) {
            return res.status(401).send('Invalid credentials. Try again');
        }

        const userdata = {
            username: user.username,
            email: user.email,
            id: user._id,
            phone: user.phone,
            address: user.address
        };
        const token = jwt.sign(userdata, process.env.JWT_KEY, { expiresIn: '6h' });
        return res.status(200).send(token);

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Function to handle sign up form submission
exports.signup = async (req, res) => {
    const { username, password, email } = req.body;
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (typeof username !== "string" || typeof password !== "string" || typeof email !== "string"
        || !username || !password || !email) {
        return res.status(400).send('Please fill all required fields');
    }
    if (!emailRegex.test(email)) {
        return res.status(400).send('Invalid email address');
    }
    if (password.length < 6) {
        return res.status(400).send('Password must be at least 6 characters');
    }

    const db = client.db("Tsuki");
    const collection = db.collection("Users");

    try {
        // Check if the username or email already exists
        const existingUser = await collection.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already in use');
        }

        const existingEmail = await collection.findOne({ email });
        if (existingEmail) {
            return res.status(400).send('Email already in use');
        }

        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        await collection.insertOne({ username, password: hash, email });
        res.send('Sign Up successful');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Internal Server Error');
    }
};
