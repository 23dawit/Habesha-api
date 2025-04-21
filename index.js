// Express.js API with Bing Search Integration + Mock Option
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const useMock = true; // Toggle this to false to use real Bing API
const BING_API_KEY = process.env.BING_API_KEY;
const BING_ENDPOINT = "https://api.bing.microsoft.com/v7.0/search";

const mockResults = [
  {
    title: "Habesha Cultural Festival 2025",
    url: "https://example.com/habesha-festival",
    snippet: "Join the annual Habesha festival featuring Ethiopian and Eritrean culture.",
    source: "Eventbrite",
    timestamp: new Date().toISOString()
  },
  {
    title: "Top 10 Ethiopian Restaurants in DC",
    url: "https://foodieblog.com/top-ethiopian-dc",
    snippet: "Explore the best Ethiopian food spots in Washington, DC.",
    source: "FoodieBlog",
    timestamp: new Date().toISOString()
  }
];

app.get('/api/search', async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: 'Query is required' });

  if (useMock) {
    const filtered = mockResults.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.snippet.toLowerCase().includes(query.toLowerCase())
    );
    return res.json({ results: filtered });
  }

  try {
    const response = await axios.get(BING_ENDPOINT, {
      headers: { 'Ocp-Apim-Subscription-Key': BING_API_KEY },
      params: { q: query, count: 10 }
    });

    const results = response.data.webPages?.value.map(item => ({
      title: item.name,
      url: item.url,
      snippet: item.snippet,
      source: item.displayUrl,
      timestamp: new Date().toISOString()
    })) || [];

    res.json({ results });
  } catch (error) {
    console.error('Bing Search Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch results from Bing' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
