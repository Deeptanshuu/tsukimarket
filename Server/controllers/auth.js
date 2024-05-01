const { client } = require("../controllers/db");
const jwt = require("jsonwebtoken");


// Function to handle login form submission
exports.login = async (req, res) => {
    const { username, password } = req.body;

    if(!username || !password) {
        return res.status(400).send('Please fill all required fields');
    }

    const db = client.db("Tsuki");
    const collection = db.collection("Users");

    try {
        const user = await collection.findOne({ username });

        if (user && user.password === password) {
            const userdata = {
                username: user.username,
                email: user.email,
                id: user._id,
                phone: user.phone,
                address: user.address
            };
            //console.log(process.env.JWT_KEY);
            const token = jwt.sign(userdata, process.env.JWT_KEY, { expiresIn: '3h' });
            return res.status(200).send(token);

        } else {
            return res.status(401).send('Invalid credentials. Try again');
        }
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

    // Function to check if an email is valid
    function isValidEmail(email) {
        return emailRegex.test(email);
    }

    if (!username || !password || !email) {
        return res.status(400).send('Please fill all required fields');
    }
    if (!isValidEmail(email)) {
        return res.status(400).send('Invalid email address');
    }

    // Check if username or email already exists

    const db = client.db("Tsuki");
    const collection = db.collection("Users");

    try {
        // Check if the username or email already exists
        const existingUser = await collection.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            return res.status(400).send('Account already exists');
        }
        // Insert the new user into the database
        await collection.insertOne({ username, password, email });
        res.send('Sign Up successful');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Internal Server Error');
    }
};
