const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

require('dotenv').config();

// Middle Wares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to Westford Immigration")
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.e4yec41.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function mongodbOperation() {
    try {
        const serviceCollection = client.db("westfordDb").collection("services");
        const reviewCollection = client.db("westfordDb").collection("reviews");
        // Load all services from mongodb server
        app.get("/services", async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        // Load a single service from mongodb server
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })
        // Set Review to the database
        app.post("/addreview", async (req, res) => {
            const review = req.body;
            const addReview = await reviewCollection.insertOne(review);
            res.send(addReview);
        })
    }
    finally { }
}
mongodbOperation().catch(error => console.error(error))
app.listen(port, () => {
    console.log("Server is running");
})