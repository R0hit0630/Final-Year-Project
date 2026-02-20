import express from "express";
import multer from "multer";
import Destination from "../models/Destination.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* -----------------------------
   MULTER MEMORY STORAGE
------------------------------ */
const upload = multer({
  storage: multer.memoryStorage(), // store file directly in memory as Buffer
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed"), false);
    }
  },
});


router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { name, region, description, activities } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }


    const destination = await Destination.create({
      agency: req.user._id,   // 🔥 IMPORTANT
      name,
      region,
      description,
      activities: activities ? activities.split(",") : [],
      images: [
        {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        },
      ],
    });

    res.status(201).json({
      message: "Destination created",
      id: destination._id,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* =====================================================
   GET ALL DESTINATIONS (SEND BASE64)
===================================================== */
router.get("/", async (req, res) => {
  try {
    const items = await Destination.find({ isActive: true })
      .populate("agency", "username email role")
      .sort("-createdAt");

    const formatted = items.map((item) => {
      const obj = item.toObject();

      obj.images = obj.images.map((img) => ({
        contentType: img.contentType,
        data: `data:${img.contentType};base64,${img.data.toString("base64")}`,
      }));

      return obj;
    });

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
/* =====================================================
   GET SINGLE DESTINATION
===================================================== */
router.get("/:id", async (req, res) => {
  try {
    const item = await Destination.findById(req.params.id);

    if (!item || !item.isActive) {
      return res.status(404).json({ message: "Not found" });
    }

    const obj = item.toObject();

    obj.images = obj.images.map((img) => ({
      contentType: img.contentType,
      data: `data:${img.contentType};base64,${img.data.toString("base64")}`,
    }));

    res.json(obj);

  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});


/* =====================================================
   UPDATE DESTINATION (OPTIONAL IMAGE REPLACE)
===================================================== */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, region, description, activities } = req.body;

    const updateData = {
      name,
      region,
      description,
      activities: activities ? activities.split(",") : [],
    };

    if (req.file) {
      updateData.images = [
        {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        },
      ];
    }

    const updated = await Destination.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ message: "Updated successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/destination/:id", async (req, res) => {
  try {
    const packages = await Package.find({
      destination: req.params.id,
    })
      .populate("destination")
      .populate("agency");

    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
/* =====================================================
   SOFT DELETE
===================================================== */
router.delete("/:id", async (req, res) => {
  try {
    await Destination.findByIdAndUpdate(req.params.id, {
      isActive: false,
    });

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;