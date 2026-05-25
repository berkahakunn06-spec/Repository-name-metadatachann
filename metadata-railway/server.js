const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

const upload = multer({
    dest: "uploads/"
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/upload", upload.array("images"), async (req, res) => {

    try {

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                error: "No files uploaded"
            });
        }

        const results = req.files.map((file, index) => {
            return {
                filename: file.originalname,
                title: "AI Generated Metadata",
                description: "Generated automatically",
                keywords: [
                    "ai",
                    "metadata",
                    "adobe stock",
                    "image"
                ]
            };
        });

        res.json({
            success: true,
            total: results.length,
            data: results
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: err.message
        });

    }

});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});