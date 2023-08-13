import mongoose from "mongoose";

import { PageModel } from "./page";

// Define the Document schema
const DocumentSchema = new mongoose.Schema({
  s3_object_name: {
    type: String,
    required: true,
  },
  pages: [
    {
      _ref: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Page'
      },
      _cls: {
        type: String,
        default: 'Page' // Make sure this matches the name of your PageSchema
      }
    }
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
      type: Number,
      default: null,
      required: false,
    },
    year: {
      type: Number,
      default: null,
      required: false,
    }
  }
});

DocumentSchema.virtual('populatedPages', {
  ref: 'Page',
  localField: 'pages._ref.$id',
  foreignField: '_id',
  justOne: false
});

export const DocumentModel = mongoose.models["Document"] || mongoose.model('Document', DocumentSchema, 'document');