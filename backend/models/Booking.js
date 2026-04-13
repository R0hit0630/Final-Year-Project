import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
      index: true,
    },

    travelers: {
      type: Number,
      required: true,
      min: 1,
    },

    startDate: {
      type: Date,
      required: true,
      index: true,
    },

    endDate: {
      type: Date,
      required: true,
      index: true,
    },

    totalPrice: {
      type: Number,
      min: 0,
      default: 0,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "ongoing", "cancelled", "completed"],
      default: "pending",
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },

    transactionUuid: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    paymentReference: {
      type: String,
      default: "",
    },

    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guide",
      default: null,
    },

    guideAssigned: {
      type: Boolean,
      default: false,
    },

    isReviewed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);