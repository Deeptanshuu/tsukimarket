const express = require("express");
const cors = require("cors");
const PORT = 8181;
const { connect } = require("./controllers/db");
const dbroutes = require("./routes/items");
const authroutes = require("./routes/authroutes")

const app = express();

// Allow requests from the frontend application at http://localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Parse JSON bodies

app.use("/db", dbroutes); 
app.use("/auth", authroutes);

connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
