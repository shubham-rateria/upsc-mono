import { Request, Response, Router } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { PaymentModel } from "../../../models/payment";

const route = Router();

function generateRandomAlphaNumeric(length) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }
  return result;
}

export default (app: Router) => {
  app.use("/payments", route);

  route.post("/orders", async (req: Request, res: Response) => {
    const { amount } = req.body;

    try {
      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY || "",
        key_secret: process.env.RAZORPAY_SECRET || "",
      });

      const receipt_alpha = generateRandomAlphaNumeric(5);

      const options = {
        amount: 200, // amount in smallest currency unit
        currency: "INR",
        receipt: `receipt_order_${receipt_alpha}`,
      };

      const order = await instance.orders.create(options);

      if (!order) return res.status(500).send("Some error occured");

      res.json(order);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  route.post("/success", async (req: Request, res: Response) => {
    try {
      // getting the details back from our font-end
      const {
        orderCreationId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        userId,
        documentObjectName,
      } = req.body;

      console.log("success", req.body);

      // Creating our own digest
      // The format should be like this:
      // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
      const shasum = crypto.createHmac(
        "sha256",
        process.env.RAZORPAY_SECRET || ""
      );

      shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

      const digest = shasum.digest("hex");

      // comaparing our digest with the actual signature
      if (digest !== razorpaySignature)
        return res.status(400).json({ msg: "Transaction not legit!" });

      const paymentModel = new PaymentModel({
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        user_id: userId,
        document_object_name: documentObjectName,
        date: Date.now(),
      });

      await paymentModel.save();

      res.json({
        msg: "success",
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        valid: true,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  });
};
