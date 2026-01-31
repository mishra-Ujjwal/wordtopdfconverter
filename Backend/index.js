const express = require("express");
const multer = require("multer");
const cors = require("cors");
const libre = require("libreoffice-convert");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

/* -------------------- CORS -------------------- */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

/* -------------------- CREATE FOLDERS -------------------- */
const uploadDir = path.join(__dirname, "uploads");
const filesDir = path.join(__dirname, "files");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(filesDir)) fs.mkdirSync(filesDir);

/* -------------------- MULTER SETUP -------------------- */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* -------------------- ROUTE -------------------- */
app.post("/convertFile", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    const inputPath = req.file.path;
    const outputPath = path.join(
      filesDir,
      `${path.parse(req.file.filename).name}.pdf`
    );

    const docxBuffer = fs.readFileSync(inputPath);

    libre.convert(docxBuffer, ".pdf", undefined, (err, done) => {
      if (err) {
        console.error("LibreOffice error:", err);
        return res.status(500).json({
          message: "Error converting DOCX to PDF",
        });
      }

      fs.writeFileSync(outputPath, done);

      res.download(outputPath, () => {
        // cleanup (optional but good practice)
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/* -------------------- SERVER -------------------- */
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
