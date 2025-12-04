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
                    message: "Failed to create user",
                    error
                })
            }
        })

        // find all users
        app.get("/users", async (req, res) => {
            try {
                const users = await userCollection.find().sort({ age:-1}).toArray();
                res.status(200).json({
                    message: "Users fetched successfully",
                    users
                })
            } catch (error) {
                res.status(403).json({
                    message: "Failed to fetch users",
                    error
                })
            }
        })
        // find single user
        app.get("/users/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const user = await userCollection.findOne({ _id: new ObjectId(id) });
                res.status(200).json({
                    message: "User fetched successfully",
                    user
                })
            } catch (error) {
                res.status(403).json({
                    message: "Failed to update users",
                    error
                })
            }
        })

        // update user
        app.patch("/update-user/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const userData = req.body;

                const filter = { _id: new ObjectId(id) };

                const updatedInfo = {
                    $set: {
                        ...userData
                    }
                };

                const result = await userCollection.updateOne(filter, updatedInfo);

                res.status(200).json({
                    message: "User updated successfully",
                    result
                });

            } catch (error) {
                res.status(403).json({
                    message: "Failed to update user",
                    error
                });
            }
        });

        // update many users
        app.patch("/users/increase-age", async (req, res) => {
            try {
                const result = await userCollection.updateMany(
                    { age: { $type: "int" } },   // only where age is numeric
                    {
                        $inc: { age: 2 },        // increase age
                        $set: { status: "pending" }  // add/update status
                    }
                );

                res.json({
                    message: "Users updated successfully",
                    result
                });

            } catch (error) {
                res.status(403).json({
                    message: "Failed to update users",
                    error
                });
            }
        });


        // delete user 
        app.delete("/delete-user/:id", async (req, res) => {
            const { id } = req.params;
            try {
                const deletedUser = await userCollection.deleteOne({ _id: new ObjectId(id) });
                res.json({
                    message: "User deleted successfully",
                    deletedUser
                })
            } catch (error) {
                res.status(403).json({
                    message: "Failed to delete user",
                    error
                });
            }
        })
        // delete many users
        app.delete("/delete-user/status/:status", async (req, res) => {
            try {
                const status = req.params.status;

                const deletedUsers = await userCollection.deleteMany({ status });

                res.json({
                    message: "Users deleted successfully",
                    deletedUsers
                });

            } catch (error) {
                res.status(403).json({
                    message: "Failed to delete users",
                    error
                });
            }
        });

        // find users using $gt operator
        app.get("/users/older-than/:age", async (req, res)=>{
            const age = req.params.age;
            const users = await userCollection.find({age: {$gte: parseInt(age)}}).toArray();
            res.json({
                message: "Users filterd succesfully",
                users
            })
        })

        // logical operators
        app.get("/users/logical-operators/and", async (req, res)=>{
            const users = await userCollection.find({$and: [
                {age: {$gte: 31}},
                {status: "active"} ]}).toArray();
            res.json({
                message: "Users filterd succesfully",
                users
            })
        })

        // element operators
        app.get("/users/element-operators/with-status", async (req, res)=>{
            const users = await userCollection.find({
                dream: {$exists: true}
            }).toArray();
            res.json(users);
        } )

        app.get("/array/operators/skills", async (req, res)=>{
            const users = await userCollection.find({
                skils: {$all: ["javascript"]}
            }).toArray();
            res.json(users);
        })

        // pagination
        app.get("/users/page/:page", async(req, res)=>{
            const page = parseInt(req.params.page) || 1;
            const limit = 5;
            const skip = (page - 1) * limit;
            const users = await userCollection.find().sort({age:-1}).skip(skip).limit(limit).toArray();
            res.json(users);
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
