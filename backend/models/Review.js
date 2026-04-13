import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    type: {
      type: String,
      enum: ["package", "guide"],
      required: true,
    },

    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      default: null,
    },

    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guide",
      default: null,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  { timestamps: true }
);

// one package review per booking per user
reviewSchema.index(
  { booking: 1, user: 1, type: 1 },
  { unique: true }
);

export default mongoose.model("Review", reviewSchema);