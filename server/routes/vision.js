// routes/vision.js
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const prompt = req.body.prompt;

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${fs.readFileSync(imagePath, { encoding: 'base64' })}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    // Nettoyage de l'image temporaire
    fs.unlinkSync(imagePath);

    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error("Erreur Vision:", error.message);
    res.status(500).send("Erreur Vision");
  }
});

export default router;