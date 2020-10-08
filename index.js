const newrelic = require('newrelic');
const express = require('express');
const serveStatic = require('serve-static');
const morgan = require('morgan');
const PORT = process.env.PORT || 3000;
const server = express();
const axios = require('axios');
server.use(morgan('dev'));
server.use(serveStatic('./client/'));

server.get('/product/:itemId', (req, res) => {
  const itemIdNumber = req.params.itemId;
  console.log('IN PRODUCT!', itemIdNumber);
  if (
    itemIdNumber < 99 ||
    itemIdNumber > 10000099 ||
    itemIdNumber === undefined
  ) {
    res.status(404).send('itemID invalid');
  } else {
    axios
      .get(`http://54.176.112.135:3002/descriptionObject/${itemIdNumber}`)
      .then(({ data }) => res.send(data));
  }
});

server.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
