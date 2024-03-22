const express = require("express");
const cors = require("cors");
const PORT = 8181;
const fs = require('fs');
const { connect, client } = require("./db"); // Import connect and client from db.js
const app = express();

app.use(cors({ origin: `http://localhost:${PORT}` })); // For Middleware CORS
app.use(express.urlencoded({ extended: false })); // For POST

connect() // Connect to MongoDB
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.get("/items", async (req, res) => {
  try {
    const db = client.db("Tsuki");
    const collection = db.collection("Items");
    const result = await collection.find({}).toArray(); // Assuming you only have one document in the collection
    res.json(result);
    // Serialize items to JSON
    const jsonData = JSON.stringify(result, null, 2);
    console.log(jsonData);
    // Write JSON data to a file named Items.json
    fs.writeFileSync('Items.json', jsonData);

  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
