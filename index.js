const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const path = require('path')
const mysql = require('mysql')
const store = require('./store')
require('dotenv').config();

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(pino);

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({greeting: `Hello ${name}!`}));
});

app.post('/api/knitgrid', (req, res) => {

  res.setHeader('Content-Type', 'application/json')

  let friendlyId = req.body.friendlyId
  let name = req.body.name
  let grid = req.body.grid

  if (!friendlyId) {
    res.send(JSON.stringify({message: "error: friendlyId is required"}))
    return;
  }

  if (!name) {
    res.send(JSON.stringify({message: "error: name is required"}))
    return;
  }

  if (!grid) {
    res.send(JSON.stringify({message: "error: grid is required"}))
    return;
  }

  store.createKnitGrid({friendlyId, name, grid}, (message) => {
    res.send(JSON.stringify({message: message}))
  })

})

app.get('/api/knitgrid', (req, res) => {

  res.setHeader('Content-Type', 'application/json');

  const friendlyId = req.query.friendlyId;

  if (!friendlyId) {
    res.send(JSON.stringify({error: "error: friendlyId is required", data: []}));
    return;
  }

  store.readKnitGrid({friendlyId}, (data, error) => {
    if (error) {
      console.log("*** error: " + error);
      res.send(JSON.stringify({error: error, data: []}));
      return;
    }

    let grid = data.map((row) => {
      return ({
        friendlyId: row.FRIENDLY_ID,
        name: row.NAME,
        grid: JSON.parse(row.GRID_DATA)
      })
    })

    res.send(JSON.stringify({data: grid}))
  })
})

app.put('/api/knitgrid', (req, res) => {

  res.setHeader('Content-Type', 'application/json');

  const friendlyId = req.body.friendlyId;
  const grid = req.body.grid;

  if (!friendlyId) {
    res.send(JSON.stringify({error: "error: friendlyId is required"}));
    return;
  }

  if (!grid) {
    res.send(JSON.stringify({error: "error: grid is required"}));
    return;
  }

  store.updateKnitGrid({friendlyId, grid}, (data, error) => {
    if (error) {
      console.log("*** error: " + error);
      res.send(JSON.stringify({error: error, data: []}));
      return;
    }

    let grid = data.map((row) => {
      return ({
        friendlyId: row.FRIENDLY_ID,
        name: row.NAME,
        grid: JSON.parse(row.GRID_DATA)
      })
    })

    res.send(JSON.stringify({ data: grid}))
  })
})

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 5000;

app.listen(port, () =>
    console.log('Express server is listening on port ' + port)
);
