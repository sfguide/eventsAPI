{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const express = require('express');\
const cors = require('cors');\
const fs = require('fs');\
\
const app = express();\
const PORT = process.env.PORT || 3000;\
\
app.use(cors()); // Enable CORS for all origins\
\
// Load and serve the filtered events\
app.get('/events', (req, res) => \{\
  fs.readFile('events.json', 'utf8', (err, data) => \{\
    if (err) \{\
      console.error('Failed to read events file:', err);\
      return res.status(500).json(\{ error: 'Could not load events' \});\
    \}\
\
    try \{\
      const events = JSON.parse(data);\
      const today = new Date();\
      const sixMonthsLater = new Date();\
      sixMonthsLater.setMonth(today.getMonth() + 6);\
\
      const filtered = events.filter(event => \{\
        const eventStart = new Date(event.startDate);\
        return eventStart >= today && eventStart <= sixMonthsLater;\
      \});\
\
      res.json(filtered);\
    \} catch (parseErr) \{\
      console.error('Error parsing JSON:', parseErr);\
      res.status(500).json(\{ error: 'Invalid events data' \});\
    \}\
  \});\
\});\
\
app.get('/', (req, res) => \{\
  res.send('Events API is running.');\
\});\
\
app.listen(PORT, () => \{\
  console.log(`Server running on port $\{PORT\}`);\
\});}