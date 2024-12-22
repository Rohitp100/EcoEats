const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enable CORS
app.use(cors());  

// Middleware to parse JSON requests
app.use(express.json());

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

// Endpoint to search for ingredients
app.get('/ingredients/search', async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).send({ error: 'Query parameter is required' });
  }

  try {
    const response = await axios.get(
      `https://api.spoonacular.com/food/ingredients/search`, {
        params: {
          query: query,
          apiKey: SPOONACULAR_API_KEY,
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching ingredient search data:', error);
    res.status(500).send({ error: 'Failed to fetch ingredient data' });
  }
});

// Endpoint to get ingredient details by ID
app.get('/ingredients/:id/information', async (req, res) => {
  const { id } = req.params;
  const amount = req.query.amount || 100;  // Default to 100g

  try {
    const response = await axios.get(
      `https://api.spoonacular.com/food/ingredients/${id}/information`, {
        params: {
          amount: amount,
          unit: 'grams',
          locale: 'en_US',
          apiKey: SPOONACULAR_API_KEY,
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching information for ingredient ID ${id}:`, error);
    res.status(500).send({ error: 'Failed to fetch ingredient information' });
  }
});

// Start the server on port 5000 or change to the desired one.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
