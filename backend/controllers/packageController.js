// backend/controllers/packageController.js
import Package from "../models/Package.js";

// ================= PUBLIC =================

// GET /api/packages/public?q=&region=&activity=&maxPrice=&minDays=&maxDays=&sort=
export const getPublicPackages = async (req, res) => {
  try {
    const {
      q,
      region,
      activity,
      maxPrice,
      minDays,
      maxDays,
      sort = "popularity",
    } = req.query;

    const filter = { isActive: true };

    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), "i");
      filter.$or = [{ title: regex }, { region: regex }, { type: regex }];
    }

    if (region) filter.region = region;

    // only works if you later add activities field in schema
    if (activity) filter.activities = { $in: [activity] };

    if (maxPrice) filter.price = { $lte: Number(maxPrice) };

    if (minDays || maxDays) {
      filter.days = {};
      if (minDays) filter.days.$gte = Number(minDays);
      if (maxDays) filter.days.$lte = Number(maxDays);
    }

    let query = Package.find(filter);

    if (sort === "price_asc") query = query.sort({ price: 1 });
    else if (sort === "price_desc") query = query.sort({ price: -1 });
    else if (sort === "duration") query = query.sort({ days: 1 });
    else query = query.sort({ createdAt: -1 });

    const packages = await query.populate("agency", "username email");

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
      .sort("-createdAt");

    return res.status(200).json(items);
  } catch (err) {
    console.error("getAllPackages error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
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
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json(item);
  } catch (err) {
    console.error("getSinglePackage error:", err);
    return res.status(400).json({ message: "Invalid ID" });
  }
};

// ================= AGENCY =================

// GET /api/packages/mine
export const getMyPackages = async (req, res) => {
  try {
    const packages = await Package.find({
      agency: req.user._id,
      isActive: true,
    }).sort("-createdAt");

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
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!region?.trim()) {
      return res.status(400).json({ message: "Region is required" });
    }

    if (!type?.trim()) {
      return res.status(400).json({ message: "Type is required" });
    }

    const nPrice = Number(price);
    const nDays = Number(days);

    if (!nPrice || nPrice <= 0) {
      return res.status(400).json({ message: "Valid price is required" });
    }

    if (!nDays || nDays <= 0) {
      return res.status(400).json({ message: "Valid days is required" });
    }

    const minG = Number(minGroupSize ?? 1);
    const maxG = Number(maxGroupSize ?? 10);

    if (!Number.isFinite(minG) || minG < 1) {
      return res.status(400).json({ message: "Min group size must be >= 1" });
    }

    if (!Number.isFinite(maxG) || maxG < minG) {
      return res
        .status(400)
        .json({ message: "Max group size must be >= min group size" });
    }

    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({ message: "At least 1 image is required" });
    }

    const imageUrls = files.map((f) => `/uploads/${f.filename}`);

    let parsedItinerary = [];
    if (itinerary) {
      try {
        parsedItinerary =
          typeof itinerary === "string" ? JSON.parse(itinerary) : itinerary;

        if (!Array.isArray(parsedItinerary)) {
          parsedItinerary = [];
        }
      } catch {
        parsedItinerary = [];
      }
    }

    const pkg = await Package.create({
      agency: req.user._id,
      title: title.trim(),
      region: region.trim(),
      type: type.trim(),
      price: nPrice,
      days: nDays,
      difficulty: difficulty || "Moderate",
      description: description || "",
      images: imageUrls,
      itinerary: parsedItinerary,
      minGroupSize: minG,
      maxGroupSize: maxG,
    });

    return res.status(201).json({
      message: "Package created",
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
    } = req.body;

    const pkg = await Package.findOne({
      _id: req.params.id,
      agency: req.user._id,
      isActive: true,
    });

    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    if (title !== undefined) pkg.title = title.trim();
    if (region !== undefined) pkg.region = region.trim();
    if (type !== undefined) pkg.type = type.trim();
    if (price !== undefined) pkg.price = Number(price);
    if (days !== undefined) pkg.days = Number(days);
    if (difficulty !== undefined) pkg.difficulty = difficulty;
    if (description !== undefined) pkg.description = description;
    if (minGroupSize !== undefined) pkg.minGroupSize = Number(minGroupSize);
    if (maxGroupSize !== undefined) pkg.maxGroupSize = Number(maxGroupSize);

    if (itinerary !== undefined) {
      try {
        const parsed =
          typeof itinerary === "string" ? JSON.parse(itinerary) : itinerary;
        pkg.itinerary = Array.isArray(parsed) ? parsed : [];
      } catch {
        pkg.itinerary = [];
      }
    }

    const files = req.files || [];
    if (files.length > 0) {
      const imageUrls = files.map((f) => `/uploads/${f.filename}`);
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
      return res.status(404).json({ message: "Not found" });
    }

    if (pkg.agency.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    pkg.isActive = false;
    await pkg.save();

    return res.status(200).json({ message: "Package deleted" });
  } catch (err) {
    console.error("deletePackage error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};