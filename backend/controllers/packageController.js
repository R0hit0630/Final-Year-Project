import Package, { REGION_OPTIONS, TYPE_OPTIONS } from "../models/Package.js";

const normalizeImages = (images) => {
  if (!images) return [];

  let parsed = images;

  if (typeof images === "string") {
    try {
      parsed = JSON.parse(images);
    } catch {
      parsed = [images];
    }
  }

  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((img) => String(img).trim())
    .filter(Boolean)
    .slice(0, 6);
};

const normalizeItinerary = (itinerary) => {
  if (!itinerary) return [];

  let parsed = itinerary;

  if (typeof itinerary === "string") {
    try {
      parsed = JSON.parse(itinerary);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(parsed)) return [];

  return parsed.map((item) => ({
    title: String(item?.title || "").trim(),
    details: String(item?.details || "").trim(),
  }));
};

// ================= PUBLIC =================

// GET /api/packages/public?q=&region=&type=&maxPrice=&minDays=&maxDays=&sort=
export const getPublicPackages = async (req, res) => {
  try {
    const {
      q,
      region,
      type,
      maxPrice,
      minDays,
      maxDays,
      sort = "latest",
    } = req.query;

    const filter = { isActive: true };

    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), "i");
      filter.$or = [
        { title: regex },
        { region: regex },
        { type: regex },
        { description: regex },
      ];
    }

    if (region && REGION_OPTIONS.includes(region)) {
      filter.region = region;
    }

    if (type && TYPE_OPTIONS.includes(type)) {
      filter.type = type;
    }

    if (maxPrice) {
      filter.price = { ...(filter.price || {}), $lte: Number(maxPrice) };
    }

    if (minDays || maxDays) {
      filter.days = {};
      if (minDays) filter.days.$gte = Number(minDays);
      if (maxDays) filter.days.$lte = Number(maxDays);
    }

    let query = Package.find(filter).populate("agency", "username email");

    if (sort === "price_asc") query = query.sort({ price: 1 });
    else if (sort === "price_desc") query = query.sort({ price: -1 });
    else if (sort === "duration_asc") query = query.sort({ days: 1 });
    else if (sort === "rating_desc") query = query.sort({ averageRating: -1 });
    else query = query.sort({ createdAt: -1 });

    const packages = await query;

    return res.status(200).json(packages);
  } catch (err) {
    console.error("getPublicPackages error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/packages
export const getAllPackages = async (req, res) => {
  try {
    const items = await Package.find({ isActive: true })
      .populate("agency", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json(items);
  } catch (err) {
    console.error("getAllPackages error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// GET /api/packages/compare?ids=id1,id2,id3
export const comparePackages = async (req, res) => {
  try {
    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({ message: "Package IDs are required" });
    }

    const idArray = ids
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (idArray.length < 2) {
      return res
        .status(400)
        .json({ message: "Select at least 2 packages to compare" });
    }

    if (idArray.length > 4) {
      return res
        .status(400)
        .json({ message: "You can compare maximum 4 packages" });
    }

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
      packages,
    });
  } catch (err) {
    console.error("comparePackages error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/packages/:id
export const getSinglePackage = async (req, res) => {
  try {
    const item = await Package.findById(req.params.id).populate(
      "agency",
      "username email"
    );

    if (!item || !item.isActive) {
      return res.status(404).json({ message: "Package not found" });
    }

    return res.status(200).json(item);
  } catch (err) {
    console.error("getSinglePackage error:", err);
    return res.status(400).json({ message: "Invalid package ID" });
  }
};

// ================= AGENCY =================

// GET /api/packages/mine
export const getMyPackages = async (req, res) => {
  try {
    const packages = await Package.find({
      agency: req.user._id,
      isActive: true,
    }).sort({ createdAt: -1 });

    return res.status(200).json(packages);
  } catch (err) {
    console.error("getMyPackages error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// GET /api/packages/mine/:id
export const getMySinglePackage = async (req, res) => {
  try {
    const pkg = await Package.findOne({
      _id: req.params.id,
      agency: req.user._id,
      isActive: true,
    });

    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    return res.status(200).json(pkg);
  } catch (err) {
    console.error("getMySinglePackage error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// POST /api/packages
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
      images,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!region?.trim()) {
      return res.status(400).json({ message: "Region is required" });
    }

    if (!REGION_OPTIONS.includes(region.trim())) {
      return res.status(400).json({ message: "Invalid region selected" });
    }

    if (!type?.trim()) {
      return res.status(400).json({ message: "Experience type is required" });
    }

    if (!TYPE_OPTIONS.includes(type.trim())) {
      return res
        .status(400)
        .json({ message: "Invalid experience type selected" });
    }

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

    const imageUrls = normalizeImages(images);

    if (imageUrls.length === 0) {
      return res.status(400).json({ message: "At least 1 image is required" });
    }

    const parsedItinerary = normalizeItinerary(itinerary);

    const pkg = await Package.create({
      agency: req.user._id,
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
    });

    return res.status(201).json({
      message: "Package created successfully",
      package: pkg,
    });
  } catch (err) {
    console.error("createPackage error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// PUT /api/packages/:id
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

    const pkg = await Package.findOne({
      _id: req.params.id,
      agency: req.user._id,
      isActive: true,
    });

    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

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

    await pkg.save();

    return res.status(200).json({
      message: "Package updated successfully",
      package: pkg,
    });
  } catch (err) {
    console.error("updatePackage error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// DELETE /api/packages/:id
export const deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    if (pkg.agency.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    pkg.isActive = false;
    await pkg.save();

    return res.status(200).json({ message: "Package deleted successfully" });
  } catch (err) {
    console.error("deletePackage error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};