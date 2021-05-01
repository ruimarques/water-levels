import express from 'express';

import { runAlgo } from '.';

const app = express();

// use the express-static middleware
// app.use(express.static('public'));
app.use(express.json());

app.post('/', function (req, res) {
  const { rain, buckets } = req.body;
  console.log(rain, buckets);

  const result = runAlgo(rain, buckets);

  res.json(result);
});

// start the server listening for requests
app.listen(process.env.PORT || 3000, () => console.log('Server is running...'));
