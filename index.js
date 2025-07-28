const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allow CORS for all origins

app.get('/events', (req, res) => {
  fs.readFile('events.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading events.json:', err);
      return res.status(500).json({ error: 'Could not read events data' });
    }

    try {
      const events = JSON.parse(data);
      const today = new Date();
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(today.getMonth() + 6);

      const filtered = events.filter(event => {
        const eventStart = new Date(event.startDate);
        return eventStart >= today && eventStart <= sixMonthsFromNow;
      });

      res.json(filtered);
    } catch (err) {
      console.error('Invalid JSON format:', err);
      res.status(500).json({ error: 'Invalid JSON format' });
    }
  });
});

app.get('/', (req, res) => {
  res.send('Events API is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
