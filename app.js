const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('morgan');
require('dotenv').config();
const knitGridApiRouter = require('./routes/knitgrid');
const projectApiRouter = require('./routes/project');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api/knitgrids', knitGridApiRouter);
app.use('/api/projects', projectApiRouter);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

function clientErrorHandler(err, req, res, next) {
  console.log("***  clientErrorHandler ");
  res.setHeader('Content-Type', 'application/json');
  let statusCode = err.statusCode || 500;
  res.status = statusCode;
  res.json(statusCode, {
    message: err.message,
    error: err
  });
}

app.use(clientErrorHandler);


const port = process.env.PORT || 5000;

app.listen(port, () =>
    console.log('Express server is listening on port ' + port)
);
