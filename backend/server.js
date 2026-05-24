import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";

const app = express();

app.use(cors());

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const upload = multer({
  dest: "uploads/",
});

app.post("/process", upload.array("files"), async (req, res) => {
  try {

    const results = [];

    for (const file of req.files) {

      const keywords = [
        "industrial",
        "production",
        "engineering",
        "factory",
        "manufacturing",
        "icon",
        "industry",
        "automation",
        "machine",
        "technology",
        "process",
        "workflow",
        "equipment",
        "vector",
        "eps",
        "editable stroke",
        "outline",
        "symbol",
        "pictogram",
        "isolated",
      ];

      const title =
        "Industrial Production Engineering Factory Manufacturing Icon Set";

      const category = "Industrial";

      results.push({
        filename: file.originalname,
        title,
        keywords: keywords.join(", "),
        category,
      });
    }

    res.json({
      success: true,
      results,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Processing failed",
    });
  }
});

app.listen(5000, () => {
  console.log("SERVER RUNNING ON 5000");
});