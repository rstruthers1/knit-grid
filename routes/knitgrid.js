const express = require('express');
const router = express.Router();
const store = require('../database/store');

router.param('knitgridId', function (req, res, next, knitgridId) {
  console.log("*** knitgridId: " + knitgridId);
  // once validation is done save the new item in the req
  req.knitgridId = knitgridId;
  // go to the next thing
  next();
});

router.get('/:knitgridId', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const knitgridId = req.params.knitgridId;

  console.log("*** knitgridId: " + knitgridId);

  let id = knitgridId;
  store.readKnitGridWithId({id}, (data, error) => {
    if (error) {
      console.log("*** error: " + error);
      res.send(JSON.stringify({error: error, data: []}));
      return;
    }

    console.log("*** data: " + JSON.stringify(data));
    if (data.length === 0) {
      res.send(JSON.stringify({knitgrid: null}));
      return;
    }

    let knitgrid = {};
    knitgrid.id = data[0].ID;
    knitgrid.name = data[0].NAME;
    knitgrid.grid = JSON.parse(data[0].GRID_DATA);

    console.log("*** knitgrid: " + JSON.stringify(knitgrid));

    res.send(JSON.stringify({data: knitgrid}));
  })
});


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
