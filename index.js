const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const path = require('path')
const mysql = require('mysql')
require('dotenv').config();




const app = express();
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(pino);

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});


app.post('/api/saveKnitData', (req, res) => {
  console.log("***** Data: " + JSON.stringify(req.body))
  res.setHeader('Content-Type', 'application/json')
  // res.send(JSON.stringify({message: "success"}))

  const connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL)
  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      res.send(JSON.stringify({message: "error connecting to database"}))
      return;
    }

    console.log('connected as id ' + connection.threadId);
    res.send(JSON.stringify({message: "success", connectionId: connection.threadId}))

  });

  connection.end();




})

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;

app.listen(port, () =>
    console.log('Express server is listening on port ' + port)
);
