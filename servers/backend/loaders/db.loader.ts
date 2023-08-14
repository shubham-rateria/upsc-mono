import mongoose from "mongoose";
// @ts-ignore
import dbref from "mongoose-dbref";

import config from "../config";

const connectToDatabase = async () => {
  if (!config.databaseURL) {
    throw new Error("Mongo uri unspecified.");
  }
  try {
    if (mongoose.connections[0]?.readyState !== 1) {
      await mongoose.connect(config.databaseURL, {
        dbName: "upsc_scraper",
      });
      dbref.install(mongoose);
      console.log("Connected to MongoDB");
    }
  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectToDatabase;
