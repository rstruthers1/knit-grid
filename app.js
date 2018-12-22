const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('morgan');
require('dotenv').config();
const knitGridApiRouter = require('./routes/knitgrid');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api/knitgrid', knitGridApiRouter);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});


const port = process.env.PORT || 5000;

app.listen(port, () =>
    console.log('Express server is listening on port ' + port)
);
