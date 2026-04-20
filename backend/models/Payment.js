import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionUuid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["esewa", "khalti", "connectips"],
      default: "esewa",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    paymentReference: {
      type: String,
      default: "",
    },
    paymentDetails: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
