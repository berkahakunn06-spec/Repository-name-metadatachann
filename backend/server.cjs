const express = require("express")
const cors = require("cors")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const { exiftool } = require("exiftool-vendored")

const app = express()

app.use(cors())
app.use(express.json())

const upload = multer({
  dest: "uploads/",
})

function generateKeywords(filename) {
  const clean = filename
    .replace(path.extname(filename), "")
    .replace(/[-_]/g, " ")

  const words = clean.split(" ")

  const extra = [
    "adobe stock",
    "stock image",
    "design",
    "creative",
    "modern",
    "premium",
    "background",
    "illustration",
    "digital",
  ]

  return [...new Set([...words, ...extra])]
}

app.post("/generate", upload.array("files"), async (req, res) => {
  try {
    const results = []

    for (const file of req.files) {
      const title = file.originalname
        .replace(path.extname(file.originalname), "")
        .replace(/[-_]/g, " ")

      const keywords = generateKeywords(file.originalname)

      const metadata = {
        Title: title,
        XPKeywords: keywords.join(";"),
        Subject: keywords.join(", "),
      }

      const fullPath = path.join(__dirname, file.path)

      await exiftool.write(fullPath, metadata)

      results.push({
        filename: file.originalname,
        savedFile: fullPath,
        metadata: {
          title,
          keywords,
        },
      })
    }

    res.json({
      success: true,
      results,
    })
  } catch (err) {
    console.log(err)

    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

app.listen(3001, () => {
  console.log("Backend jalan di http://localhost:3001")
})