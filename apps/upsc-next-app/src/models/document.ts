import mongoose from "mongoose";

import { PageModel } from "./page";
const dbref = require("mongoose-dbref");

dbref.install(mongoose);

// @ts-ignore
var DBRef = mongoose.SchemaTypes.DBRef;

// Define the Document schema
const DocumentSchema = new mongoose.Schema({
  s3_object_name: {
    type: String,
    required: true,
  },
  pages: [
    {
      _ref: {
        type: DBRef,
        resolve: true,
        ref: "Page",
      },
      _cls: {
        type: String,
        default: "Page", // Make sure this matches the name of your PageSchema
      },
    },
  ],
  num_pages: {
    type: Number,
    default: null,
  },
  document_type: {
    type: Number,
    default: null,
    required: false,
  },
  topper: {
    name: {
      type: String,
      default: null,
      required: false,
    },
    rank: {
      type: String,
      default: null,
      required: false,
    },
    year: {
      type: String,
      default: null,
      required: false,
    },
  },
});

export const DocumentModel =
  mongoose.models["Document"] ||
  mongoose.model("Document", DocumentSchema, "document");
