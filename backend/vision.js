const express = require('express');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/vision', upload.single('image'), async (req, res) => {
  try {
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString('base64');
    const prompt = req.body.prompt;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4-turbo",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: `data:image/jpeg;base64,${base64Image}`
            }
          ]
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    fs.unlinkSync(req.file.path); // delete temp file
    res.json({ response: response.data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
