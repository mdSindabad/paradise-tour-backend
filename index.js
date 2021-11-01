const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;



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
        const teams = database.collection('teams');
        const purchases = database.collection('purchases');


        // get all services
        app.get('/service', async (req, res) => {
            const cursor = destinations.find({});
            const data = await cursor.toArray();
            res.json(data)
        });

        // add services
        app.post('/add-destination', async (req, res) => {
            const data = req.body;
            const result = await destinations.insertOne(data);
            res.json(result)
        })

        // get all team members
        app.get('/teams', async (req, res) => {
            const cursor = teams.find({});
            const data = await cursor.toArray();
            res.json(data)
        });

        // get single service
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const destination = await destinations.findOne(query);

            res.json(destination)
        })

        // get purchases
        app.get('/purchase', async (req, res) => {
            const cursor = purchases.find({});
            const data = await cursor.toArray();
            res.json(data)
        })

        // post purchases
        app.post('/purchase', async (req, res) => {
            const data = req.body;
            const result = await purchases.insertOne(data);
            res.json(result)
        })

        // update status
        app.put('/update-status/:id', async (req, res) => {
            const id = req.params.id;
            const updateDoc = {
                $set: {
                    status: req.body.status
                },
            };
            const query = { _id: ObjectId(id) }
            const result = await purchases.updateOne(query, updateDoc);

            res.send(result)
        })

        // cancel order
        app.delete('/cancel-order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await purchases.deleteOne(query);

            res.send(result)
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
