const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

require('dotenv').config();

// Middle Wares
app.use(cors());
app.use(express());

app.get("/", (req, res) => {
    res.send("Welcome to Westford Immigration")
})



app.listen(port, () => {
    console.log("Server is running");
})