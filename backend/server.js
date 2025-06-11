const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // ← must use node-fetch v2


const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/leetcode', async (req, res) => {
  const { username } = req.body;

  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { username } })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data from LeetCode' });
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
