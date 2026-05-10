import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Emergency contacts schema
const emergencyContactSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    phone: { type: String, trim: true, required: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "agency", "admin"],
      default: "user",
      index: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    nationality: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    isActive: { type: Boolean, default: true },

    // USER PROFILE
    fullName: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    avatar: { type: String, trim: true, default: "" },


    preferences: {
      difficulty: {
        type: String,
        enum: ["Easy", "Moderate", "Challenging", "Extreme"],
        default: "Challenging",
      },
      interests: [{ type: String, trim: true }],
    },

    emergencyContacts: [emergencyContactSchema],

    // AGENCY PROFILE
    agencyName: { type: String, trim: true, default: "" },
    agencyAddress: { type: String, trim: true, default: "" },
    agencyPhone: { type: String, trim: true, default: "" },
    agencyLogo: { type: String, trim: true, default: "" },

    tagline: { type: String, trim: true, default: "" },
    about: { type: String, trim: true, default: "" },
    instagram: { type: String, trim: true, default: "" },
    tripadvisor: { type: String, trim: true, default: "" },

    agencyVerified: { type: Boolean, default: false },
    agencyVerifiedAt: { type: Date, default: null },

    agencyCredentials: {
      license: { type: String, default: "" },
      insurance: { type: String, default: "" },
      vat: { type: String, default: "" },
    },

    // Aggregate rating fields (updated by reviewController on each review)
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);