const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const upload = multer({
  dest: "uploads/"
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/upload", upload.array("images"), async (req, res) => {

  try {

    const files = req.files || [];

    const results = files.map(file => {

      return {

        filename: file.originalname,

        title:
          "Futuristic Technology Interface Background",

        description:
          "Professional futuristic digital technology interface with modern neon cyberpunk design.",

        keywords: [

          "technology",
          "digital",
          "innovation",
          "modern",
          "creative",
          "professional",
          "business",
          "future",
          "abstract",
          "background",
          "design",
          "visual",
          "interface",
          "automation",
          "artificial intelligence",
          "cyberpunk",
          "gradient",
          "neon",
          "software",
          "dashboard",
          "user interface",
          "desktop",
          "online",
          "network",
          "system",
          "virtual",
          "workspace",
          "application",
          "data",
          "computer",
          "coding",
          "developer",
          "web",
          "tech",
          "futuristic",
          "ui design",
          "productivity",
          "electronics",
          "smart technology",
          "digital workspace",
          "modern interface",
          "high tech",
          "glowing",
          "virtual system",
          "innovation concept",
          "future technology",
          "tech background",
          "cyber interface",
          "advanced system"

        ]

      };

    });

    res.json({

      total: results.length,
      failed: 0,
      data: results

    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

const PORT =
process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    "Server running on port " + PORT
  );

});