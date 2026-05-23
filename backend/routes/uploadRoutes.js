import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Make sure the uploads folder exists on disk before saving any files
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure where uploaded files go and how they are named
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir); // Save all uploads to the /uploads folder
  },
  filename(req, file, cb) {
    // Create a unique filename using timestamp + random number to avoid conflicts
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

// Only allow image file types — reject anything else
const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only image files are allowed"), false); // Reject the file
  }
};

// Set up the image uploader (max 20MB per file)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
});

// Upload a single image — used when only one photo is needed
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  // Return the public URL path of the saved image
  const imageUrl = `/uploads/${req.file.filename}`;

  return res.status(200).json({
    message: "Image uploaded successfully",
    imageUrl,
  });
});

// Upload multiple images at once (max 6) — used when creating a package with multiple photos
router.post("/multiple", upload.array("images", 6), (req, res) => {
  const files = req.files || [];

  if (!files.length) {
    return res.status(400).json({ message: "No images uploaded" });
  }

  // Return an array of public URL paths for all uploaded images
  const imageUrls = files.map(
    (file) => `/uploads/${file.filename}`
  );

  return res.status(200).json({
    message: "Images uploaded successfully",
    imageUrls,
  });
});

// Allow images AND documents (PDF, Word) — used for uploading travel documents
const documentFilter = (req, file, cb) => {
  if (
    file.mimetype &&
    (file.mimetype.startsWith("image/") ||
     file.mimetype === "application/pdf" ||
     file.mimetype.includes("pdf") ||
     file.mimetype.includes("word") ||
     file.mimetype.includes("document"))
  ) {
    cb(null, true); // Accept images and documents
  } else {
    req.fileValidationError = "Invalid file type. Only images and PDFs are allowed.";
    cb(null, false); // Reject the file
  }
};

// Set up the document uploader (max 20MB)
const documentUpload = multer({
  storage,
  fileFilter: documentFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});

// Upload a single document (image or PDF) — used for passport/visa document uploads
router.post("/document", documentUpload.single("document"), (req, res) => {
  if (req.fileValidationError) {
    return res.status(400).json({ message: req.fileValidationError });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No document uploaded" });
  }

  // Return the public URL path of the saved document
  const documentUrl = `/uploads/${req.file.filename}`;

  return res.status(200).json({
    message: "Document uploaded successfully",
    documentUrl,
  });
});

export default router;