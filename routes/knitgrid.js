const express = require('express');
const router = express.Router();
const store = require('../database/store');

router.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const friendlyId = req.query.friendlyId;

  if (!friendlyId) {
    res.send(
        JSON.stringify({error: "error: friendlyId is required", data: []}));
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
    });

    res.send(JSON.stringify({data: grid}))
  })
});

router.post('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  let friendlyId = req.body.friendlyId;
  let name = req.body.name;
  let grid = req.body.grid;

  if (!friendlyId) {
    res.send(JSON.stringify({message: "error: friendlyId is required"}));
    return;
  }

  if (!name) {
    res.send(JSON.stringify({message: "error: name is required"}));
    return;
  }

  if (!grid) {
    res.send(JSON.stringify({message: "error: grid is required"}));
    return;
  }

  store.createKnitGrid({friendlyId, name, grid}, (message) => {
    res.send(JSON.stringify({message: message}))
  })

});

router.put('/', (req, res) => {
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

  store.updateKnitGrid({friendlyId, grid}, (result, error) => {
    if (error) {
      console.log("*** error: " + error);
      res.send(JSON.stringify({error: error}));
      return;
    }

    let message = JSON.stringify(result);
    if (result == 1) {
      message += " row updated"
    } else {
      message += " rows updated"
    }
    res.send(JSON.stringify({message: message}))
  })
});

module.exports = router;
