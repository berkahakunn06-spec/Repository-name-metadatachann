const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
dest:"uploads/"
});

/* CLEAN TITLE */

function makeTitle(filename){

const cleanName = filename
.replace(/\.[^/.]+$/, "")
.replace(/[-_]/g," ")
.replace(/\s+/g," ")
.trim();

const title = cleanName
.split(" ")
.map(word =>

word.charAt(0).toUpperCase() +
word.slice(1)

)
.join(" ");

return title + " PNG";

}

/* KEYWORDS */

function makeKeywords(filename){

const cleanName = filename
.replace(/\.[^/.]+$/, "")
.toLowerCase()
.replace(/[-_]/g," ");

const baseKeywords =
cleanName.split(" ");

const extraKeywords = [

"png",
"isolated",
"transparent",
"design",
"graphic",
"element",
"clipart",
"illustration",
"icon",
"creative",
"digital",
"modern",
"object",
"decoration",
"collection",
"set",
"template",
"high quality",
"graphic resource",
"cut out",
"background",
"editable",
"professional",
"visual",
"branding",
"marketing",
"commercial",
"graphic design",
"minimal",
"mockup",
"clean",
"simple",
"decorative",
"art",
"download",
"printable",
"vector",
"sticker",
"symbol",
"template design",
"modern style",
"isolated object",
"transparent background",
"high resolution",
"creative design",
"web element",
"ui element",
"decor",
"artwork"

];

const keywords = [

...new Set([
...baseKeywords,
...extraKeywords
])

].slice(0,49);

return keywords;

}

/* DESCRIPTION */

function makeDescription(title){

return `High quality ${title} isolated on transparent background for graphic design, branding, digital content, commercial use, and creative projects.`;

}

/* CSV ESCAPE */

function escapeCSV(value){

if(!value) return "";

return `"${String(value)
.replace(/"/g,'""')}"`;

}

/* UPLOAD */

app.post(
"/upload",
upload.array("images"),
async(req,res)=>{

try{

const files = req.files;

const savefolder =
req.body.savefolder || "metadata";

if(!fs.existsSync(savefolder)){

fs.mkdirSync(savefolder);

}

let results = [];

let csvRows = [];

csvRows.push(
[
"Filename",
"Title",
"Keywords",
"Category",
"Releases"
].join(",")
);

for(const file of files){

const title =
makeTitle(file.originalname);

const keywords =
makeKeywords(file.originalname);

const description =
makeDescription(title);

const metadata = {

filename:file.originalname,

title:title,

description:description,

keywords:keywords,

category:"Graphic Resources",

releases:""

};

results.push(metadata);

/* TXT SAVE */

const txtContent = `

FILE:
${metadata.filename}

TITLE:
${metadata.title}

KEYWORDS:
${metadata.keywords.join(", ")}

DESCRIPTION:
${metadata.description}

CATEGORY:
${metadata.category}

`;

const txtPath = path.join(
savefolder,
file.originalname + ".txt"
);

fs.writeFileSync(
txtPath,
txtContent
);

/* CSV */

csvRows.push([

escapeCSV(metadata.filename),

escapeCSV(metadata.title),

escapeCSV(
metadata.keywords.join(", ")
),

escapeCSV(metadata.category),

escapeCSV(metadata.releases)

].join(","));

}

/* SAVE CSV */

const csvContent =
csvRows.join("\n");

const csvPath = path.join(
savefolder,
"adobe_stock_metadata.csv"
);

fs.writeFileSync(
csvPath,
csvContent
);

/* RESPONSE */

res.json({

success:true,
total:results.length,
failed:0,
csv:"adobe_stock_metadata.csv",
data:results

});

}catch(err){

res.status(500).json({
error:err.message
});

}

}
);

/* START */

app.listen(3001,()=>{

console.log(
"🚀 Server jalan di http://localhost:3001"
);

});