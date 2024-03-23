const express = require("express");
const router = express.Router();
//const fs = require('fs');
const { client } = require("../controllers/db");

router.get("/items", async (req, res) => {
  try {
    const db = client.db("Tsuki");
    const collection = db.collection("Items");
    const result = await collection.find({}).toArray();
    res.json(result);
    
    // Serialize items to JSON
    const jsonData = JSON.stringify(result, null, 2);
    
    // Write JSON data to a file named Items.json
    //fs.writeFileSync('Items.json', jsonData);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
