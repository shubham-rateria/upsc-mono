import mongoose from "mongoose";

// Define the Page schema
export const PageSchema = new mongoose.Schema({
  page_number: {
    type: Number,
    required: true,
  },
  ocr: {
    type: mongoose.Schema.Types.Mixed, // Using 'Mixed' for 'Any' data type in MongoEngine
    default: null,
  },
});

export const PageModel = mongoose.models.Page || mongoose.model('Page', PageSchema, 'page');