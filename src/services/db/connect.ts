import mongoose from "mongoose";

const MONGODB_URI =
  process.env.NODE_ENV === "production"
    ? process.env.DB_URL_PROD
    : process.env.DB_URL_LOCAL;

const connectToDatabase = async () => {
  if (!MONGODB_URI) {
    throw new Error("Mongo uri unspecified.");
  }
  try {
    if (mongoose.connections[0]?.readyState !== 1) {
      await mongoose.connect(MONGODB_URI, {
        dbName: "upsc_scraper"
      });
      console.log("Connected to MongoDB");
    }
  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectToDatabase;
