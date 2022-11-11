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
            const cursor = serviceCollection.find(query).sort({ _id: -1 });
            const services = await cursor.toArray();
            res.send(services);
        })
        // Add Service
        app.post("/services", async (req, res) => {
            const service = req.body;
            const addService = await serviceCollection.insertOne(service);
            res.send(addService);
        })
        // Load a single service from mongodb server
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })
        // ADD Review to the database
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const addReview = await reviewCollection.insertOne(review);
            res.send(addReview);
        })
        // Show Review for individual service
        app.get("/reviews", async (req, res) => {
            let query = {}
            // Show reviews on service page
            if (req.query.serviceId) {
                query = {
                    serviceId: req.query.serviceId
                }
            }
            // Show an single users all reviews that he gave
            else if (req.query.userEmail) {
                query = {
                    userEmail: req.query.userEmail
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);

            // Delete a review
            app.delete("/reviews/:id", async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) };
                const review = await reviewCollection.deleteOne(query);
                res.send(review)
            })
        })
    }
    finally { }
}
mongodbOperation().catch(error => console.error(error))
app.listen(port, () => {
    console.log("Server is running");
})