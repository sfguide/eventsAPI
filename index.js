const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allow CORS for all origins

app.get('/events', (req, res) => {
  const { startDate, classificationName } = req.query;

  fs.readFile('events.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading events.json:', err);
      return res.status(500).json({ error: 'Could not read events data' });
    }

    try {
      const events = JSON.parse(data);

      const filtered = events.filter(event => {
        const eventStart = new Date(event.startDate);
        const now = new Date();
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(now.getMonth() + 6);

        let match = eventStart >= now && eventStart <= sixMonthsFromNow;

        if (startDate) {
          const queryDate = new Date(startDate);
          match = match && eventStart >= queryDate;
        }

        if (classificationName) {
          match = match && event.classificationName?.toLowerCase().includes(classificationName.toLowerCase());
        }

        return match;
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
