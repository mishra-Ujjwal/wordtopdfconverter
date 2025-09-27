const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();  // load .env variables

const app = express();

app.use(cors());

// Test route
app.get('/', (req, res) => {
    res.send('Hello world');
});

module.exports = app;
