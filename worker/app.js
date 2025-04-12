const express = require('express');
const bodyParser = require('body-parser');
const deployRoute = require('./routes/deployRoute');
const { log } = require('./utils/logger');

const app = express();
app.use(bodyParser.json());

app.use('/deploy', deployRoute);

app.listen(5001, () => {
  log('Worker listening on port 5001');
});
