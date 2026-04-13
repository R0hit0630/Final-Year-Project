import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    details: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const packageSchema = new mongoose.Schema(
  {
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: { type: String, required: true, trim: true, index: true },
    region: { type: String, required: true, trim: true, index: true },
    type: { type: String, required: true, trim: true },

    description: { type: String, default: "", trim: true },

    price: { type: Number, required: true, min: 0, index: true },
    days: { type: Number, required: true, min: 1, index: true },

    minGroupSize: { type: Number, default: 1, min: 1 },
    maxGroupSize: { type: Number, default: 10, min: 1 },

    difficulty: {
      type: String,
      enum: ["Hard", "Moderate", "Easy"],
      default: "Moderate",
      index: true,
    },

    averageRating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },

    images: { type: [String], default: [] },

    itinerary: { type: [itinerarySchema], default: [] },

    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.model("Package", packageSchema);