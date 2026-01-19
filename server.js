const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const BASE_UPLOAD_PATH = path.join(__dirname, "uploads");

// uploads folder serve karna (download ke liye)
app.use("/files", express.static(BASE_UPLOAD_PATH));

// multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subject = req.body.subject;
    const subjectPath = path.join(BASE_UPLOAD_PATH, subject);

    if (!fs.existsSync(subjectPath)) {
      fs.mkdirSync(subjectPath, { recursive: true });
    }
    cb(null, subjectPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// upload API
app.post("/upload", upload.single("note"), (req, res) => {
  res.json({ message: "Note uploaded successfully" });
});

// get all subjects
app.get("/subjects", (req, res) => {
  if (!fs.existsSync(BASE_UPLOAD_PATH)) {
    return res.json([]);
  }
  const subjects = fs.readdirSync(BASE_UPLOAD_PATH);
  res.json(subjects);
});

// get notes of a subject
app.get("/notes/:subject", (req, res) => {
  const subjectPath = path.join(BASE_UPLOAD_PATH, req.params.subject);
  if (!fs.existsSync(subjectPath)) {
    return res.json([]);
  }
  const files = fs.readdirSync(subjectPath);
  res.json(files);
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
