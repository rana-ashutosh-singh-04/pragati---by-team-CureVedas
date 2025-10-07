// Step 1: Import the MongoDB client
import { MongoClient } from "mongodb";

// Step 2: Define the connection URI (adjust if using Atlas or custom config)
const uri = "mongodb://localhost:27017";

// Step 3: Create a function to check MongoDB connectivity
const checkMongoDB = async () => {
  const client = new MongoClient(uri);

  try {
    // Step 4: Attempt to connect
    await client.connect();

    // Step 5: Run a simple ping command to verify connection
    const result = await client.db("admin").command({ ping: 1 });

    if (result.ok === 1) {
      console.log("✅ MongoDB connection successful!");
    } else {
      console.error("⚠️ MongoDB ping command returned unexpected response:", result);
    }
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  } finally {
    // Step 6: Always close the connection
    await client.close();
  }
};

// Step 7: Run the check
checkMongoDB();

