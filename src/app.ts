import express from 'express';

import { runAlgo } from '.';

const app = express();

// use the express-static middleware
// app.use(express.static('public'));
app.use(express.json());

// define the first route
app.get('/', function (req, res) {
  console.log(req.body);
  // res.json(req.body)
  res.send('<h1>Hello World! ' + JSON.stringify(req.body) + '</h1>');
});

app.post('/', function (req, res) {
  const { rain, buckets } = req.body;
  console.log(rain, buckets);

  const result = runAlgo(rain, buckets);

  // res.send(JSON.stringify({ ...req.body, rain: 2 }));
  res.json(result);
});

// start the server listening for requests
app.listen(process.env.PORT || 3000, () => console.log('Server is running...'));
