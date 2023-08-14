import express from "express";
import dbLoader from "./db.loader";
import expressLoader from "./express.loader";

export default async (app: express.Application) => {
  await dbLoader();
  console.log("db loaded...");

  expressLoader({ app });
  console.log("express loaded...");
};
