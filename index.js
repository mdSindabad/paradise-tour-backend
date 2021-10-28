const express = require("express");
const cors = require("cors");


// initialize express app
const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.get('/', (req, res) => {
    res.send("Welcome to paradise travel...")
})

const port = process.env.PORT || 5000;
// start server
app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
})
