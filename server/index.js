// ecoeats/server/index.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

const openaiApiKey = process.env.OPENAI_API_KEY;

const getMockResponse = () => ({
  nonVegan: ['Eggs', 'Milk'],
  harmful: [
    {
      name: 'Ingredient1',
      harms: 'Harms description',
      dailyLimit: 'Limit info',
      avoid: 'Who should avoid'
    },
    {
      name: 'Ingredient2',
      harms: 'Harms description',
      dailyLimit: 'Limit info',
      avoid: 'Who should avoid'
    },
    {
      name: 'Ingredient3',
      harms: 'Harms description',
      dailyLimit: 'Limit info',
      avoid: 'Who should avoid'
    },
    {
      name: 'Ingredient4',
      harms: 'Harms description',
      dailyLimit: 'Limit info',
      avoid: 'Who should avoid'
    },
    {
      name: 'Ingredient5',
      harms: 'Harms description',
      dailyLimit: 'Limit info',
      avoid: 'Who should avoid'
    },
    {
      name: 'Ingredient6',
      harms: 'Harms description',
      dailyLimit: 'Limit info',
      avoid: 'Who should avoid'
    },
    {
      name: 'Ingredient7',
      harms: 'Harms description',
      dailyLimit: 'Limit info',
      avoid: 'Who should avoid'
    },
    {
      name: 'Ingredient8',
      harms: 'Harms description',
      dailyLimit: 'Limit info',
      avoid: 'Who should avoid'
    },
    {
      name: 'Ingredient9',
      harms: 'Harms description',
      dailyLimit: 'Limit info',
      avoid: 'Who should avoid'
    },
    // More harmful ingredients
  ]
});

// Handle API check
app.post('/api/check', async (req, res) => {
  const { ingredients } = req.body;

  if (!openaiApiKey) {
    // Return mock response if API key is not set
    const mockResponse = getMockResponse();
    return res.json({ message: 'Checked ingredients', details: mockResponse });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/gpt-3.5-turbo/completions',
      {
        model: 'gpt-3.5-turbo',
        prompt: `Analyze the following ingredients list and provide information about harmful and non-vegan ingredients:\n\nIngredients: ${ingredients}\n\nPlease format the response as follows:\n1. Non-vegan Ingredients:\n2. Harmful Ingredients:\n   - Ingredient Name:\n     - Harms:\n     - Daily Limit:\n     - Who Should Avoid:`,
        max_tokens: 1000,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const generatedText = response.data.choices[0].text;
    const result = parseChatGPTResponse(generatedText);

    res.json({ message: 'Checked ingredients', details: result });
  } catch (error) {
    console.error('Error contacting ChatGPT:', error.message);
    console.error('Full error details:', error.response ? error.response.data : error.message);

    if (error.response && error.response.status === 401) {
      // API key is invalid, return mock response
      const mockResponse = getMockResponse();
      return res.json({ message: 'Checked ingredients (mock response due to invalid API key)', details: mockResponse });
    }

    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

// Function to parse ChatGPT response
const parseChatGPTResponse = (text) => {
  const nonVegan = [];
  const harmful = [];

  const lines = text.split('\n');
  let section = '';
  lines.forEach(line => {
    if (line.startsWith('Non-vegan Ingredients:')) {
      section = 'nonVegan';
    } else if (line.startsWith('Harmful Ingredients:')) {
      section = 'harmful';
    } else if (section === 'nonVegan') {
      if (line.trim()) nonVegan.push(line.trim());
    } else if (section === 'harmful') {
      if (line.trim()) {
        const parts = line.split(':');
        if (parts.length > 1) {
          const ingredient = {
            name: parts[0].trim(),
            harms: parts[1].trim(),
            dailyLimit: parts[2]?.trim() || 'N/A',
            avoid: parts[3]?.trim() || 'N/A',
          };
          harmful.push(ingredient);
        }
      }
    }
  });

  return { nonVegan, harmful };
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
