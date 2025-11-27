const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 3000

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
    const user = {name:"Shuvo", email:"eng.shuvo03@gmail.com", age:25, job:"Software Engineeer"}
    // add user to the users collection
    userCollection.insertOne(user);




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
