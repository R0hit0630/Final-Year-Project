import mongoose from "mongoose";

export const REGION_OPTIONS = [
  "Koshi Province",
  "Madhesh Province",
  "Bagmati Province",
  "Gandaki Province",
  "Lumbini Province",
  "Karnali Province",
  "Sudurpashchim Province",

  "Himalayan Region (Himal)",
  "Hilly Region (Pahad)",
  "Terai Region",

  "Eastern Development Region (Purbanchal)",
  "Central Development Region (Madhyamanchal)",
  "Western Development Region (Pashchimanchal)",
  "Mid-Western Development Region (Madhya Pashchimanchal)",
  "Far-Western Development Region (Sudur Pashchimanchal)",

  "Everest Region (Khumbu)",
  "Annapurna Region",
  "Langtang Region",
  "Manaslu Region",
  "Mustang Region",
  "Dolpo Region",
];

export const TYPE_OPTIONS = [
  "Adventure Experiences",
  "Spiritual & Wellness Experiences",
  "Cultural & Heritage Experiences",
  "Nature & Wildlife Experiences",
  "Outdoor & Recreational Experiences",
  "Culinary Experiences",
  "Luxury & Leisure Experiences",
  "Family & Leisure Experiences",
  "Photography & Scenic Experiences",
  "Volunteer & Educational Experiences",
  "Urban & Lifestyle Experiences",
];

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

    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    region: {
      type: String,
      required: true,
      trim: true,
      enum: REGION_OPTIONS,
      index: true,
    },

    type: {
      type: String,
      required: true,
      trim: true,
      enum: TYPE_OPTIONS,
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },

    days: {
      type: Number,
      required: true,
      min: 1,
      index: true,
    },

    minGroupSize: {
      type: Number,
      default: 1,
      min: 1,
    },

    maxGroupSize: {
      type: Number,
      default: 10,
      min: 1,
      validate: {
        validator: function (value) {
          return value >= this.minGroupSize;
        },
        message: "Max group size must be greater than or equal to min group size",
      },
    },

    difficulty: {
      type: String,
      enum: ["Hard", "Moderate", "Easy"],
      default: "Moderate",
      index: true,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      index: true,
    },

    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length > 0 && arr.length <= 6;
        },
        message: "Package must have between 1 and 6 images",
      },
    },

    itinerary: {
      type: [itinerarySchema],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

packageSchema.virtual("rating").get(function () {
  return this.averageRating ?? 0;
});

packageSchema.virtual("reviewsCount").get(function () {
  return this.numReviews ?? 0;
});

packageSchema.virtual("activities").get(function () {
  return this.type ? [this.type] : [];
});

export default mongoose.model("Package", packageSchema);