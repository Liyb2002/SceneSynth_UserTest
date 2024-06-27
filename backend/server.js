const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;

let counter = 0; // Initialize a counter for the filenames

// Set up storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './saved';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `edited_image_${counter}${ext}`;
    counter++;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Endpoint to handle image upload
app.post('/upload', upload.single('image'), (req, res) => {
  res.send('Image uploaded successfully');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
