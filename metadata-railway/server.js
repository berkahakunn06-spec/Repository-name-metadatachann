app.post("/upload", upload.array("files"), async (req, res) => {

    try {

        const provider = req.body.provider;
        const apiKey = req.body.apiKey;

        const results = [];

        for (const file of req.files) {

            let endpoint = "";
            let model = "";

            // =================
            // PROVIDER
            // =================

            if (provider === "grok") {

                endpoint =
                    "https://api.x.ai/v1/chat/completions";

                model =
                    "grok-2-latest";

            }

            else if (provider === "openai") {

                endpoint =
                    "https://api.openai.com/v1/chat/completions";

                model =
                    "gpt-4o-mini";

            }

            else if (provider === "openrouter") {

                endpoint =
                    "https://openrouter.ai/api/v1/chat/completions";

                model =
                    "openai/gpt-4o-mini";

            }

            // =================
            // REQUEST AI
            // =================

            const response = await axios.post(

                endpoint,

                {
                    model: model,

                    messages: [
                        {
                            role: "user",
                            content:
`Generate Adobe Stock metadata.

Filename:
${file.originalname}

Return JSON only:

{
"title":"",
"description":"",
"keywords":[]
}`
                        }
                    ]

                },

                {
                    headers: {

                        Authorization:
                            `Bearer ${apiKey}`,

                        "Content-Type":
                            "application/json"

                    }
                }

            );

            const text =
                response.data.choices[0].message.content;

            // =================
            // CLEAN JSON
            // =================

            let clean = text
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            let parsed;

            try {

                parsed = JSON.parse(clean);

            } catch {

                parsed = {

                    title:
                        "AI Generated Metadata",

                    description:
                        "Professional Adobe Stock image.",

                    keywords: [
                        "ai",
                        "adobe stock",
                        "design"
                    ]

                };

            }

            results.push({

                filename:
                    file.originalname,

                title:
                    parsed.title,

                description:
                    parsed.description,

                keywords:
                    parsed.keywords

            });

        }

        res.json({

            success: true,
            total: results.length,
            data: results

        });

    }

    catch (err) {

        console.log(err.response?.data || err.message);

        res.status(500).json({

            error:
                err.response?.data ||
                err.message

        });

    }

});