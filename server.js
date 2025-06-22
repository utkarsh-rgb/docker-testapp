const express = require("express");
const app = express();
const path = require("path");
const { MongoClient } = require("mongodb");

const PORT = 5050;
const MONGO_URL = "mongodb://root:12345678@localhost:27017";
const client = new MongoClient(MONGO_URL);

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add this if you're using JSON in requests
app.use(express.static("public"));

let db; // to store the connected DB instance

// Connect to MongoDB once at server start
async function startServer() {
    try {
        await client.connect();
        db = client.db("fakewhatsapp"); // set your default DB here
        console.log("Connected successfully to MongoDB");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1);
    }
}

// GET all users
app.get("/getUsers", async (req, res) => {
    try {
        const data = await db.collection("chats").find({}).toArray();
        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching users");
    }
});

// POST new user
app.post("/addUser", async (req, res) => {
    try {
        const userObj = req.body;
        const data = await db.collection("chats").insertOne(userObj);
        console.log("Data inserted in DB", data);
        res.send({ success: true, insertedId: data.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error inserting user");
    }
});

// Start server
startServer();
