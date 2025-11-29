const express = require('express')
const cors = require('cors');
const app = express()
const { ObjectId } = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 3000

// middleware
app.use(express.json())
app.use(cors());


// connect to mongodb
const uri = "mongodb+srv://shuvo:NlFKFddOyqtW5tiM@mongodb-basics.ydmvj9o.mongodb.net/?appName=mongodb-basics";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const db = client.db("mydatabase");
        const userCollection = db.collection("users");
        const userJob = db.collection("jobs");

        app.post("/add-user", async (req, res) => {
            try {
                const newUser = req.body;
                const result = await userCollection.insertOne(newUser);
                console.log(result)
                res.status(200).json({
                    message: "User created Succesfully",
                    result
                })
            } catch (error) {
                res.status(403).json({
                    message:"Failed to create user",
                    error
                })
            }
        })

        // find all users
        app.get("/users", async (req, res) =>{
            try {
                const users = await userCollection.find().toArray();
                res.status(200).json({
                    message: "Users fetched successfully",
                    users
                })
            } catch (error) {
                res.status(403).json({
                    message:"Failed to fetch users",
                    error
                })
            }
        })
        // find single user
        app.get("/users/:id", async (req, res) =>{
            try {
                const id = req.params.id;
                const user = await userCollection.findOne({ _id: new ObjectId(id) });
                res.status(200).json({
                    message: "User fetched successfully",
                    user
                })
            } catch (error) {
                res.status(403).json({
                    message:"Failed to fetch users",
                    error
                })
            }
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello MongoDB!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
