const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connect } = require("./controllers/db");
const dbroutes = require("./routes/DB");
const authroutes = require("./routes/authroutes");

const PORT = process.env.PORT || 8181;
const app = express();

// CLIENT_ORIGIN can be a comma separated list, falls back to allowing everyone
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((o) => o.trim())
  : "*";
app.use(cors({ origin: allowedOrigins }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser());

app.use("/db", dbroutes);
app.use("/auth", authroutes);

// Serve the React build, catch-all has to come after the api routes
// otherwise it swallows GET /db/items etc.
app.use(express.static(path.join(__dirname, "build")));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"), function (err) {
    if (err) {
      res.status(500).send("Something went wrong");
    }
  });
});

connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });
