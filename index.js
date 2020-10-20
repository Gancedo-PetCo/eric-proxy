const newrelic = require('newrelic');
const express = require('express');
const serveStatic = require('serve-static');
const morgan = require('morgan');
const PORT = process.env.PORT || 3000;
const server = express();
const axios = require('axios');
// server.use(morgan('dev'));
const redis = require('redis');
const port_redis = process.env.PORT || 6379;
const redis_client = redis.createClient(port_redis);

redis_client.on('error', (err) => {
  console.log('Error ' + err);
});
server.use(serveStatic('./client/'));

server.get('/product/:itemId', (req, res) => {
  const itemIdNumber = req.params.itemId;
  const description1Address = '54.176.112.135';
  const description2Address = '54.151.77.163';
  const NGINX_ADDRESS = '54.176.165.15';
  const NGINX_ADDRESS_BIG = '3.101.36.3';

  if (
    itemIdNumber < 99 ||
    itemIdNumber > 10000099 ||
    itemIdNumber === undefined
  ) {
    res.status(404).send('itemID invalid');
  }

  return redis_client.get(
    `descriptionObjectServer${itemIdNumber}`,
    (err, descriptionObject) => {
      // check if the object is present in redis already
      if (descriptionObject) {
        res.send(descriptionObject);
      }
      //
      else {
        axios
          .get(`http://${NGINX_ADDRESS}:3002/descriptionObject/${itemIdNumber}`)
          .then(({ data }) => {
            redis_client.setex(
              `descriptionObjectServer${itemIdNumber}`,
              300,
              JSON.stringify(data)
            );
            res.send(data);
          })
          .catch((response) => res.status(500));
      }
    }
  );
});

server.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
