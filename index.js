import express from 'express';
import bodyParser from 'body-parser'; 

const app = express();

app.use(express.json()); 

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  console.log("Messages reçus:", messages);

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 100,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const answer = response.data.choices[0].message;
    res.json({ choices: [{ message: answer }] });

  } catch (error) {
    console.error("Erreur OpenAI:", error);
    res.status(500).json({ error: 'Erreur avec OpenAI' });
  }
});