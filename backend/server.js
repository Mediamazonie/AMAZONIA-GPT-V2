const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const visionRoute = require('./vision');
app.use('/api', visionRoute);

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  try {
    const axios = require('axios');
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4-turbo",
      messages: messages,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
