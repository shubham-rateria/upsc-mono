import dotenv from "dotenv";
import path from "path";

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config({
  path: path.resolve(__dirname, "./.env.local"),
});
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  port: 3000,
  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI,
};
