import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema(
  {
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: { type: String, required: true, trim: true, index: true },
    region: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },

    images: [
      {
        data: {
          type: Buffer,
          required: true,
        },
        contentType: {
          type: String,
          required: true,
        },
      },
    ],

    activities: [{ type: String, index: true }],
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);



export default mongoose.model("Destination", destinationSchema);