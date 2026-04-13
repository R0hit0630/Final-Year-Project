import mongoose from "mongoose";

const guideSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    region: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
      default: "",
    },
    specialization: {
      type: String,
      trim: true,
      default: "",
    },
    certification: {
      type: String,
      trim: true,
      default: "",
    },
    languages: {
      type: String,
      trim: true,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    photo: {
      type: String,
      default: "",
    },
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    averageRating: {
  type: Number,
  default: 0,
},
numReviews: {
  type: Number,
  default: 0,
},
  },
  { timestamps: true }
);

export default mongoose.model("Guide", guideSchema);