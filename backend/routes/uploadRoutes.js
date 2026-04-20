import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});

// single image
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

  return res.status(200).json({
    message: "Image uploaded successfully",
    imageUrl,
  });
});

// multiple images
router.post("/multiple", upload.array("images", 6), (req, res) => {
  const files = req.files || [];

  if (!files.length) {
    return res.status(400).json({ message: "No images uploaded" });
  }

  const imageUrls = files.map(
    (file) => `http://localhost:5000/uploads/${file.filename}`
  );

  return res.status(200).json({
    message: "Images uploaded successfully",
    imageUrls,
  });
});

const documentFilter = (req, file, cb) => {
  if (
    file.mimetype &&
    (file.mimetype.startsWith("image/") || 
     file.mimetype === "application/pdf" ||
     file.mimetype.includes("pdf") ||
     file.mimetype.includes("word") ||
     file.mimetype.includes("document"))
  ) {
    cb(null, true);
  } else {
    req.fileValidationError = "Invalid file type. Only images and PDFs are allowed.";
    cb(null, false);
  }
};

const documentUpload = multer({
  storage,
  fileFilter: documentFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});

// single document
router.post("/document", documentUpload.single("document"), (req, res) => {
  if (req.fileValidationError) {
    return res.status(400).json({ message: req.fileValidationError });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No document uploaded" });
  }

  const documentUrl = `http://localhost:5000/uploads/${req.file.filename}`;

  return res.status(200).json({
    message: "Document uploaded successfully",
    documentUrl,
  });
});

export default router;