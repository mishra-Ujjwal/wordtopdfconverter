const express = require("express");
const multer = require("multer");
const cors = require("cors");
const docxToPDF = require("docx-pdf");
const path = require("path");
const app = express();
const port = 3000;
const dotenv = require("dotenv")
dotenv.config();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

//setting of the storage

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/convertFile", upload.single("file"), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "please upload a file",
      });
    }
    //defining the output file path'
    let outputPath = path.join(
      __dirname,
      "files",
      `${req.file.originalname}.pdf`,
    );

    docxToPDF(req.file.path, outputPath, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "error converting to pdf",
        });
      }
      res.download(outputPath, () => {
        console.log("file download");
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
    });
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
