// server/index.js
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const Tesseract = require('tesseract.js');
const cors = require('cors');

const app = express();
const port = 5008;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/ocr', upload.single('image'), async (req, res) => {
  try {
    const imageBuffer = Buffer.from(req.body.image.split(',')[1], 'base64');
    const processedImage = await sharp(imageBuffer)
      .resize({ width: 1191, height: 2000 }) // Resize image
      .greyscale() // Convert to grayscale
      .sharpen({ // Apply unsharp mask
        sigma: 6.8,
        m1: 2.69,
        m2: 2.69,
        x1: 0,
        y2: 0,
        y3: 0
      })
      .toFormat('jpg', { quality: 100 }) // Save as a new jpg at 100% quality
      .toBuffer();

    Tesseract.recognize(
      processedImage,
      'eng',
      { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
      res.json({ text });
    }).catch(err => {
      res.status(500).json({ error: 'OCR processing failed', details: err });
    });
  } catch (error) {
    res.status(500).json({ error: 'Image processing failed', details: error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});