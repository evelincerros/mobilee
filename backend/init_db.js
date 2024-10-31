const { MongoClient } = require("mongodb");
require("dotenv").config();
// Replace <username>, <password>, and <cluster-url> with your actual values
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

async function run() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Specify the database and collection
    const database = client.db("mobile_app"); // Create a database called 'userdb'
    const collection = database.collection("users"); // Create a collection called 'users'

    // Insert a sample user
    const user = {
      name: "John Doe",
      email: "johndoe@example.com",
      age: 30,
    };

    const result = await collection.insertOne(user);
    console.log(`User inserted with _id: ${result.insertedId}`);
  } catch (err) {
    console.error(err);
  } finally {
    // Close the connection
    await client.close();
  }
}

run().catch(console.dir);
