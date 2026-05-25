const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

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

        const apiKey = req.body.apiKey;
        const provider = req.body.provider || "grok";

        if (!apiKey) {
            return res.status(400).json({
                error: "API Key kosong"
            });
        }

        const results = [];

        for (const file of req.files) {

            let endpoint = "";
            let model = "";

            // =========================
            // PROVIDER
            // =========================

            if (provider === "grok") {

                endpoint = "https://api.x.ai/v1/chat/completions";
                model = "grok-2-latest";

            } else if (provider === "openai") {

                endpoint = "https://api.openai.com/v1/chat/completions";
                model = "gpt-4o-mini";

            } else if (provider === "openrouter") {

                endpoint = "https://openrouter.ai/api/v1/chat/completions";
                model = "openai/gpt-4o-mini";

            }

            // =========================
            // AI REQUEST
            // =========================

            const aiResponse = await axios.post(

                endpoint,

                {
                    model: model,

                    messages: [
                        {
                            role: "user",
                            content:
`Buat metadata Adobe Stock dari nama file ini:

${file.originalname}

Balas JSON saja format:

{
"title":"",
"description":"",
"keywords":[]
}`
                        }
                    ],

                    temperature: 0.7
                },

                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    }
                }

            );

            let content =
                aiResponse.data.choices[0].message.content;

            // bersihkan markdown
            content = content
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            let parsed;

            try {

                parsed = JSON.parse(content);

            } catch {

                parsed = {
                    title: "AI Metadata",
                    description: "Generated automatically",
                    keywords: [
                        "ai",
                        "metadata",
                        "adobe stock"
                    ]
                };

            }

            results.push({

                filename: file.originalname,

                title:
                    parsed.title || "AI Metadata",

                description:
                    parsed.description ||
                    "Generated automatically",

                keywords:
                    parsed.keywords || []

            });

        }

        res.json({
            success: true,
            total: results.length,
            results
        });

    } catch (err) {

        console.log(err.response?.data || err.message);

        res.status(500).json({
            error:
                err.response?.data ||
                err.message
        });

    }

});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(
        "Server running on port " + PORT
    );
});