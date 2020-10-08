const newrelic = require('newrelic');
const express = require('express');
const serveStatic = require('serve-static');
const morgan = require('morgan');
const PORT = process.env.PORT || 3000;
const server = express();

// server.use(morgan('dev'));
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
    res.sendFile(`${__dirname}/client/index.html`);
  }
});

server.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
