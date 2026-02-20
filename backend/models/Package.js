import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
      index: true,
    },

    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },

    price: { type: Number, required: true, min: 0, index: true },
    durationDays: { type: Number, required: true, min: 1, index: true },

    groupType: {
      type: String,
      enum: ["solo", "couple", "family", "group"],
      default: "group",
    },

    tripType: {
      type: String,
      enum: ["trek", "hiking", "tour", "adventure", "cultural", "wildlife"],
      default: "tour",
    },

    images: [
      {
        data: { type: Buffer, required: true },
        contentType: { type: String, required: true },
      },
    ],

    isActive: { type: Boolean, default: true, index: true },

    avgRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Package", packageSchema);