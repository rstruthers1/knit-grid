const express = require('express');
const router = express.Router();
const store = require('../database/store');

router.param('projectId', function (req, res, next, projectId) {
  console.log("*** projectId: " + projectId);
  // once validation is done save the new item in the req
  req.projectId = projectId;
  // go to the next thing
  next();
});

router.get('/:projectId', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const projectId = req.params.projectId;

  console.log("*** projectId: " + projectId);

  store.readProjectWithIdPlusKnitGrids(projectId, (data, error) => {
    if (error) {
      console.log("*** error: " + error);
      res.send(JSON.stringify({error: error, data: []}));
      return;
    }

    console.log("*** data: " + JSON.stringify(data));
    if (data.length === 0) {
      res.send(JSON.stringify({project: null}));
      return;
    }

    let project = {};
    project.id = data[0].ID;
    project.name = data[0].NAME;
    project.description = data[0].DESCRIPTION;

    let knitgrids = data.map((row) => {
      return ({
        id: row.KNIT_GRID_ID,
        name: row.KNIT_GRID_NAME,
        grid: JSON.parse(row.GRID_DATA)
      })
    });

    if (knitgrids === null || knitgrids.length === 0 ||
        knitgrids[0].id === null) {
      knitgrids = null;
    }

    project.knitgrids = knitgrids;
    console.log("*** project: " + JSON.stringify(project));

    res.send(JSON.stringify({project: project}));
  })
});

router.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  store.readProjects((data, error) => {
    if (error) {
      console.log("*** error: " + error);
      res.send(JSON.stringify({error: error, data: []}));
      return;
    }

    let projects = data.map((row) => {
      return ({
        id: row.ID,
        name: row.NAME,
        description: row.DESCRIPTION,
        createdAt: row.CREATED_AT,
        updatedAt: row.UPDATED_AT
      })
    });

    console.log("*** projects: " + JSON.stringify(projects));

    res.send(JSON.stringify({projects: projects}));
  })
});

router.put('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const name = req.body.name;
  const description = req.body.description;

  if (!name) {
    res.send(JSON.stringify({error: "error: name is required"}));
    return;
  }

  store.createProject({name, description}, (result, error) => {
    if (error) {
      console.log("*** error: " + error);
      res.send(JSON.stringify({error: error}));
      return;
    }

    let message = JSON.stringify(result);
    if (result == 1) {
      message += " project created"
    }
    res.send(JSON.stringify({message: message}))
  })
});

module.exports = router;
