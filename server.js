const express = require('express');
const dotenv = require('dotenv').config();
const server = express();
const port = process.env.PORT || 5000;

server.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
