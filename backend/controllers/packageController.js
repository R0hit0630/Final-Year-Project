import Package, { REGION_OPTIONS, TYPE_OPTIONS } from "../models/Package.js";

// ─── HELPER: NORMALIZE IMAGES ─────────────────────────────────────────────────
// Accepts images as either a JSON string or an array, cleans each URL,
// and enforces a maximum of 6 images per package.
const normalizeImages = (images) => {
  if (!images) return [];

  let parsed = images;

  // If images came in as a JSON string (e.g. from a form POST), parse it
  if (typeof images === "string") {
    try {
      parsed = JSON.parse(images);
    } catch {
      parsed = [images]; // Single URL string — wrap it in an array
    }
  }

  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((img) => String(img).trim()) // Trim whitespace from each URL
    .filter(Boolean)                  // Remove any empty strings
    .slice(0, 6);                     // Cap at 6 images maximum
};

// ─── HELPER: NORMALIZE ITINERARY ─────────────────────────────────────────────
// Accepts itinerary as either a JSON string or an array of { title, details } objects.
// Returns a clean array safe to store in the database.
const normalizeItinerary = (itinerary) => {
  if (!itinerary) return [];

  let parsed = itinerary;

  // If itinerary was sent as a JSON string, parse it first
  if (typeof itinerary === "string") {
    try {
      parsed = JSON.parse(itinerary);
    } catch {
      return []; // If parsing fails, return empty
    }
  }

  if (!Array.isArray(parsed)) return [];

  // Map each day entry and ensure title and details are strings
  return parsed.map((item) => ({
    title: String(item?.title || "").trim(),
    details: String(item?.details || "").trim(),
  }));
};

// ─── HELPER: FORMAT PACKAGE FOR CLIENT ───────────────────────────────────────
// Normalizes field names between backend schema and frontend expectations.
// e.g. "averageRating" → "rating", "numReviews" → "reviewsCount"
const formatPackageForClient = (pkg) => {
  const obj = pkg.toObject ? pkg.toObject({ virtuals: true }) : pkg;

  return {
    ...obj,
    rating: Number(obj.averageRating ?? obj.rating ?? 0),
    reviewsCount: Number(obj.numReviews ?? obj.reviewsCount ?? 0),
    reviews: Number(obj.numReviews ?? obj.reviews ?? 0),
    // Normalize activities: use the array if present, else wrap the type string
    activities: Array.isArray(obj.activities)
      ? obj.activities
      : obj.type
        ? [obj.type]
        : [],
  };
};

// ─── GET PUBLIC PACKAGES (SEARCH + FILTER) ───────────────────────────────────
// [FLOW FEATURE: EXPLORE PAGE - BACKEND]
// GET /api/packages/public?q=&region=&type=&maxPrice=&minDays=&maxDays=&sort=  (Public)
// Powers the Explore page search and filter bar.
// Accepts optional query parameters for text search, region, type, price, days, and sort order.
export const getPublicPackages = async (req, res) => {
  try {
    const {
      q,           // Free-text search string
      region,      // Region filter (must match REGION_OPTIONS enum)
      type,        // Experience type filter (must match TYPE_OPTIONS enum)
      maxPrice,    // Maximum price ceiling
      minDays,     // Minimum trip duration
      maxDays,     // Maximum trip duration
      sort = "latest", // Default sort: newest first
    } = req.query;

    // Start with only active packages
    const filter = { isActive: true };

    // Text search: matches title, region, type, or description (case-insensitive)
    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), "i");
      filter.$or = [
        { title: regex },
        { region: regex },
        { type: regex },
        { description: regex },
      ];
    }

    // Region filter: only apply if it's a valid region option
    if (region && REGION_OPTIONS.includes(region)) {
      filter.region = region;
    }

    // Type filter: only apply if it's a valid experience type
    if (type && TYPE_OPTIONS.includes(type)) {
      filter.type = type;
    }

    // Price ceiling filter
    if (maxPrice) {
      filter.price = { ...(filter.price || {}), $lte: Number(maxPrice) };
    }

    // Duration range filter (days)
    if (minDays || maxDays) {
      filter.days = {};
      if (minDays) filter.days.$gte = Number(minDays);
      if (maxDays) filter.days.$lte = Number(maxDays);
    }

    // Build the query with agency info populated for display
    let query = Package.find(filter).populate("agency", "username email");

    // Apply the selected sort order
    if (sort === "price_asc") query = query.sort({ price: 1 });
    else if (sort === "price_desc") query = query.sort({ price: -1 });
    else if (sort === "duration_asc") query = query.sort({ days: 1 });
    else if (sort === "rating_desc") query = query.sort({ averageRating: -1 });
    else query = query.sort({ createdAt: -1 }); // default: newest first

    const packages = await query;

    // Format each package before returning to normalize field names
    return res.status(200).json(packages.map(formatPackageForClient));
  } catch (err) {
    console.error("getPublicPackages error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ─── GET ALL PACKAGES ────────────────────────────────────────────────────────
// [FLOW FEATURE: EXPLORE PAGE]
// GET /api/packages  (Public)
// Returns all active packages sorted by newest first. No filters applied.
export const getAllPackages = async (req, res) => {
  try {
    const items = await Package.find({ isActive: true })
      .populate("agency", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json(items.map(formatPackageForClient));
  } catch (err) {
    console.error("getAllPackages error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// ─── COMPARE PACKAGES ────────────────────────────────────────────────────────
// [FLOW FEATURE: COMPARE PACKAGES - BACKEND]
// GET /api/packages/compare?ids=id1,id2,id3  (Public)
// Called by the Compare Packages page. Validates 2–4 IDs, fetches them,
// and returns all their details for side-by-side display.
export const comparePackages = async (req, res) => {
  try {
    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({ message: "Package IDs are required" });
    }

    // Step 1: Parse the comma-separated IDs from the query string
    const idArray = ids
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    // Step 2: Enforce minimum of 2 packages for a meaningful comparison
    if (idArray.length < 2) {
      return res
        .status(400)
        .json({ message: "Select at least 2 packages to compare" });
    }

    // Step 3: Enforce maximum of 4 packages (UI layout limit)
    if (idArray.length > 4) {
      return res
        .status(400)
        .json({ message: "You can compare maximum 4 packages" });
    }

    // Step 4: Fetch all matching active packages from the database
    const packages = await Package.find({
      _id: { $in: idArray },
      isActive: true,
    })
      .populate("agency", "username email")
      .sort({ createdAt: -1 });

    if (!packages.length) {
      return res.status(404).json({ message: "No packages found" });
    }

    return res.status(200).json({
      count: packages.length,
      packages: packages.map(formatPackageForClient),
    });
  } catch (err) {
    console.error("comparePackages error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ─── GET SINGLE PACKAGE ──────────────────────────────────────────────────────
// [FLOW FEATURE: PACKAGE DETAILS PAGE - BACKEND]
// GET /api/packages/:id  (Public)
// Fetches a single package by its MongoDB ID for the Package Details page.
export const getSinglePackage = async (req, res) => {
  try {
    const item = await Package.findById(req.params.id).populate(
      "agency",
      "username email"
    );

    // Return 404 if not found or if the package has been soft-deleted (isActive: false)
    if (!item || !item.isActive) {
      return res.status(404).json({ message: "Package not found" });
    }

    return res.status(200).json(formatPackageForClient(item));
  } catch (err) {
    console.error("getSinglePackage error:", err);
    return res.status(400).json({ message: "Invalid package ID" });
  }
};

// ─── GET MY PACKAGES (Agency) ─────────────────────────────────────────────────
// [FLOW FEATURE: AGENCY PACKAGES LIST]
// GET /api/packages/mine  (Private - Agency)
// Returns all active packages belonging to the logged-in agency.
export const getMyPackages = async (req, res) => {
  try {
    const packages = await Package.find({
      agency: req.user._id, // Only packages owned by this agency
      isActive: true,
    }).sort({ createdAt: -1 });

    return res.status(200).json(packages.map(formatPackageForClient));
  } catch (err) {
    console.error("getMyPackages error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// ─── GET SINGLE MY PACKAGE (Agency) ──────────────────────────────────────────
// [FLOW FEATURE: AGENCY PACKAGE EDIT]
// GET /api/packages/mine/:id  (Private - Agency)
// Returns one specific package — only if it belongs to the requesting agency.
export const getMySinglePackage = async (req, res) => {
  try {
    const pkg = await Package.findOne({
      _id: req.params.id,
      agency: req.user._id, // Security: must be owned by this agency
      isActive: true,
    });

    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    return res.status(200).json(formatPackageForClient(pkg));
  } catch (err) {
    console.error("getMySinglePackage error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// ─── CREATE PACKAGE ───────────────────────────────────────────────────────────
// [FLOW FEATURE: CREATE PACKAGE - BACKEND]
// POST /api/packages  (Private - Agency)
// Saves a new travel package to the database after validating all required fields.
// The image URLs passed here are already uploaded — this just stores the paths.
export const createPackage = async (req, res) => {
  try {
    const {
      title,
      region,
      type,
      price,
      days,
      difficulty,
      description,
      itinerary,
      minGroupSize,
      maxGroupSize,
      images,      // Array of uploaded image URL paths
    } = req.body;

    // Step 1: Validate all required text fields
    if (!title?.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!region?.trim()) {
      return res.status(400).json({ message: "Region is required" });
    }

    // Step 2: Validate region against allowed enum values
    if (!REGION_OPTIONS.includes(region.trim())) {
      return res.status(400).json({ message: "Invalid region selected" });
    }

    if (!type?.trim()) {
      return res.status(400).json({ message: "Experience type is required" });
    }

    // Step 3: Validate experience type against allowed enum values
    if (!TYPE_OPTIONS.includes(type.trim())) {
      return res
        .status(400)
        .json({ message: "Invalid experience type selected" });
    }

    // Step 4: Validate and parse numeric fields
    const nPrice = Number(price);
    const nDays = Number(days);
    const minG = Number(minGroupSize ?? 1);
    const maxG = Number(maxGroupSize ?? 10);

    if (!Number.isFinite(nPrice) || nPrice <= 0) {
      return res.status(400).json({ message: "Valid price is required" });
    }

    if (!Number.isFinite(nDays) || nDays <= 0) {
      return res
        .status(400)
        .json({ message: "Valid duration in days is required" });
    }

    if (!Number.isFinite(minG) || minG < 1) {
      return res
        .status(400)
        .json({ message: "Min group size must be at least 1" });
    }

    if (!Number.isFinite(maxG) || maxG < minG) {
      return res.status(400).json({
        message:
          "Max group size must be greater than or equal to min group size",
      });
    }

    // Step 5: Normalize images — parse JSON strings, cap at 6, strip blank entries
    const imageUrls = normalizeImages(images);

    if (imageUrls.length === 0) {
      return res.status(400).json({ message: "At least 1 image is required" });
    }

    // Step 6: Normalize itinerary — parse JSON if needed, ensure title+details structure
    const parsedItinerary = normalizeItinerary(itinerary);

    // Step 7: Create and save the Package document in the database
    const pkg = await Package.create({
      agency: req.user._id,   // Link to the logged-in agency
      title: title.trim(),
      region: region.trim(),
      type: type.trim(),
      price: nPrice,
      days: nDays,
      difficulty: difficulty || "Moderate",
      description: description?.trim() || "",
      itinerary: parsedItinerary,
      minGroupSize: minG,
      maxGroupSize: maxG,
      images: imageUrls,
      averageRating: 0,        // Starts at 0 — updated by review helpers
      numReviews: 0,
    });

    return res.status(201).json({
      message: "Package created successfully",
      package: formatPackageForClient(pkg),
    });
  } catch (err) {
    console.error("createPackage error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// ─── UPDATE PACKAGE ───────────────────────────────────────────────────────────
// [FLOW FEATURE: EDIT PACKAGE - BACKEND]
// PUT /api/packages/:id  (Private - Agency)
// Updates only the fields provided in the request body (partial update / PATCH-style).
// Each field is validated individually before being saved.
export const updatePackage = async (req, res) => {
  try {
    const {
      title,
      region,
      type,
      price,
      days,
      difficulty,
      description,
      itinerary,
      minGroupSize,
      maxGroupSize,
      images,
    } = req.body;

    // Step 1: Find the package and confirm it belongs to this agency
    const pkg = await Package.findOne({
      _id: req.params.id,
      agency: req.user._id, // Security: agency can only edit their own packages
      isActive: true,
    });

    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Step 2: Update only the fields that were actually sent in the request

    if (title !== undefined) {
      if (!String(title).trim()) {
        return res.status(400).json({ message: "Title cannot be empty" });
      }
      pkg.title = String(title).trim();
    }

    if (region !== undefined) {
      const nextRegion = String(region).trim();
      if (!REGION_OPTIONS.includes(nextRegion)) {
        return res.status(400).json({ message: "Invalid region selected" });
      }
      pkg.region = nextRegion;
    }

    if (type !== undefined) {
      const nextType = String(type).trim();
      if (!TYPE_OPTIONS.includes(nextType)) {
        return res
          .status(400)
          .json({ message: "Invalid experience type selected" });
      }
      pkg.type = nextType;
    }

    if (price !== undefined) {
      const nPrice = Number(price);
      if (!Number.isFinite(nPrice) || nPrice <= 0) {
        return res.status(400).json({ message: "Valid price is required" });
      }
      pkg.price = nPrice;
    }

    if (days !== undefined) {
      const nDays = Number(days);
      if (!Number.isFinite(nDays) || nDays <= 0) {
        return res
          .status(400)
          .json({ message: "Valid duration in days is required" });
      }
      pkg.days = nDays;
    }

    if (difficulty !== undefined) {
      if (!["Hard", "Moderate", "Easy"].includes(difficulty)) {
        return res.status(400).json({ message: "Invalid difficulty selected" });
      }
      pkg.difficulty = difficulty;
    }

    if (description !== undefined) {
      pkg.description = String(description || "").trim();
    }

    // Use the existing values as fallback if not provided
    const nextMinGroupSize =
      minGroupSize !== undefined ? Number(minGroupSize) : pkg.minGroupSize;
    const nextMaxGroupSize =
      maxGroupSize !== undefined ? Number(maxGroupSize) : pkg.maxGroupSize;

    if (!Number.isFinite(nextMinGroupSize) || nextMinGroupSize < 1) {
      return res
        .status(400)
        .json({ message: "Min group size must be at least 1" });
    }

    if (
      !Number.isFinite(nextMaxGroupSize) ||
      nextMaxGroupSize < nextMinGroupSize
    ) {
      return res.status(400).json({
        message:
          "Max group size must be greater than or equal to min group size",
      });
    }

    pkg.minGroupSize = nextMinGroupSize;
    pkg.maxGroupSize = nextMaxGroupSize;

    if (itinerary !== undefined) {
      pkg.itinerary = normalizeItinerary(itinerary);
    }

    if (images !== undefined) {
      const imageUrls = normalizeImages(images);
      if (imageUrls.length === 0) {
        return res.status(400).json({ message: "At least 1 image is required" });
      }
      pkg.images = imageUrls;
    }

    // Step 3: Save all changes to the database
    await pkg.save();

    return res.status(200).json({
      message: "Package updated successfully",
      package: formatPackageForClient(pkg),
    });
  } catch (err) {
    console.error("updatePackage error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// ─── DELETE PACKAGE ───────────────────────────────────────────────────────────
// [FLOW FEATURE: DELETE PACKAGE - BACKEND]
// DELETE /api/packages/:id  (Private - Agency)
// Performs a SOFT DELETE by setting isActive = false.
// The package record is kept in the database but will no longer appear in any listings.
export const deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Security: only the agency that created this package can delete it
    if (pkg.agency.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Soft-delete: mark as inactive instead of removing the database record
    pkg.isActive = false;
    await pkg.save();

    return res.status(200).json({ message: "Package deleted successfully" });
  } catch (err) {
    console.error("deletePackage error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};