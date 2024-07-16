const path = require('path');
const express = require('express');

module.exports = (app) => {
  app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
  );

  app.get('/manifest.json', (req, res) =>
    res.sendFile(path.join(__dirname, '../client/dist/manifest.json'))
  );

  app.use('/assets', express.static(path.join(__dirname, '../client/dist/assets')));
};
