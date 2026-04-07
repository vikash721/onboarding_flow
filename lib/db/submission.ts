import clientPromise from "./mongodb";
import { onboardingSubmissionSchema } from "../schemas/submission";

export async function createSubmission(submissionData: unknown) {
  try {
    const validatedData = onboardingSubmissionSchema.parse(submissionData);

    const client = await clientPromise;
    const db = client.db("test");
    const collection = db.collection("submissions");

    const result = await collection.insertOne(validatedData);
    return result;
  } catch (error) {
    console.error("Failed to create onboarding submission:", error);
    throw error;
  }
}

export async function hasSubmissionForUser(clerkId: string) {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const collection = db.collection("submissions");

    const existing = await collection.findOne(
      { clerkId },
      { projection: { _id: 1 } }
    );

    return Boolean(existing);
  } catch (error) {
    console.error("Failed to check onboarding submission:", error);
    throw error;
  }
}

export async function getLatestSubmissionForUser(clerkId: string) {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const collection = db.collection("submissions");

    const latestSubmission = await collection.findOne(
      { clerkId },
      { sort: { submittedAt: -1 } }
    );

    return latestSubmission;
  } catch (error) {
    console.error("Failed to fetch onboarding submission:", error);
    throw error;
  }
}

export async function countSubmissionsForUser(clerkId: string) {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const collection = db.collection("submissions");
    return await collection.countDocuments({ clerkId });
  } catch (error) {
    console.error("Failed to count onboarding submissions:", error);
    throw error;
  }
}

export async function deleteSubmissionsForUser(clerkId: string) {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const collection = db.collection("submissions");
    const result = await collection.deleteMany({ clerkId });
    return result;
  } catch (error) {
    console.error("Failed to delete onboarding submissions:", error);
    throw error;
  }
}
