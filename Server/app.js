const express = require("express");
const cors = require("cors");
const PORT = 8181;
const { connect } = require("./controllers/db");
const dbroutes = require("./routes/DB");
const authroutes = require("./routes/authroutes");
const app = express();
const cookieParser = require('cookie-parser');


// Serve static files from the React app buil folder or server folder

/*
const path = require('path');

app.use(express.static(path.join(__dirname, '../Client/build')));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../Client/build', 'index.html'),
   function(err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});
*/

const dotenv = require("dotenv");
dotenv.config({path: './.env' });


app.use(cors({ origin: '*' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser());


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

  app.use("/", (res,req)=>{
    res.send("Peta the serverless function is here.");
  })