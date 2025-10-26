const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config(); 

const app = express();
app.use(express.json());
app.use(express.static("public")); 

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html"); 
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
