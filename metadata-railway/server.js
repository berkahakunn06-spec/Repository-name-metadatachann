const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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

app.post("/upload", upload.array("files"), async (req, res) => {

    try {

        const files = req.files || [];

        const result = files.map(file => {

            return {
                filename: file.originalname,
                title: file.originalname
                    .replace(/\.[^/.]+$/, "")
                    .replace(/[-_]/g, " "),
                keywords: [
                    "adobe stock",
                    "metadata",
                    "ai generated",
                    "design"
                ],
                description:
                    "Professional AI generated metadata for Adobe Stock."
            };

        });

        res.json({
            success: true,
            total: result.length,
            data: result
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});