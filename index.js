const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require('dotenv').config();


// initialize express app
const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASS}@cluster0.bmdl2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('paradise_travel');
        const destinations = database.collection('destinations');

        app.get('/', async (req, res) => {
            const cursor = destinations.find({});
            const data = await cursor.toArray();
            res.json(data)
        })

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

const port = process.env.PORT || 5000;
// start server
app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
})
