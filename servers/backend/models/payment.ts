import mongoose from "mongoose";

// Define the Page schema
export const PaymentSchema = new mongoose.Schema({
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
  document_object_name: {
    type: String,
    required: true,
  },
});

export const PaymentModel =
  mongoose.models.PaymentModel ||
  mongoose.model("Payment", PaymentSchema, "payment");
