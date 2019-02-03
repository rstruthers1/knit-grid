const express = require('express');
const router = express.Router();
const store = require('../database/store');


router.post('/', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');

  let projectId = req.body.projectId;
  let name = req.body.name;
  let description = req.body.description;
  let grid = req.body.grid;

  if (!projectId) {
    res.send(JSON.stringify({message: "error: projectId is required"}));
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

  store.createKnitGrid({projectId, name, description, grid}, (knitgridId, error) => {
    console.log("**** createKnitGrid, id: " + knitgridId);
    if (error) {
      console.log("There was an error: " + JSON.stringify(error));
      next(error);
      return;
    }
    res.send(JSON.stringify({knitgridId: knitgridId}));
  })

});



module.exports = router;
