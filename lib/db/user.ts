import clientPromise from "./mongodb";
import { userSchema } from "../schemas/user";

export async function createUser(userData: unknown) {
  try {
    // Validate with Zod
    const validatedData = userSchema.parse(userData);
    
    // Connect to MongoDB
    const client = await clientPromise;
    
    // Use the database named 'test'
    const db = client.db("test");
    const collection = db.collection("users");

    // Insert user into MongoDB
    const result = await collection.insertOne(validatedData);
    return result;
  } catch (error) {
    console.error("Failed to create user in DB:", error);
    throw error;
  }
}

export async function upsertUser(userData: unknown) {
  try {
    // Validate with Zod (strips unknown fields and checks types)
    const validatedData = userSchema.parse(userData);
    
    const client = await clientPromise;
    const db = client.db("test");
    const collection = db.collection("users");

    // Upsert: if the user exists (by clerkId), do nothing or update. 
    // Here we use $setOnInsert to only set fields if the document is newly created.
    const result = await collection.updateOne(
      { clerkId: validatedData.clerkId },
      { $setOnInsert: validatedData },
      { upsert: true }
    );
    
    return result;
  } catch (error) {
    console.error("Failed to upsert user in DB:", error);
    throw error;
  }
}
