// See: https://knexjs.org

const knex = require('knex')(require('./knexfile'));
const Promise = require('bluebird');

module.exports = {
  createKnitGrid({projectId, name, description, grid}, cb) {
    return knex('KNIT_GRID').insert({
      PROJECT_ID: projectId,
      NAME: name,
      DESCRIPTION: description,
      GRID_DATA: JSON.stringify(grid)
    })
    .then(value => {
      return knex.raw("SELECT LAST_INSERT_ID() as ID")
      .then(rows => {
        console.log("*** rows: " + JSON.stringify(rows));
        cb(rows[0][0].ID, null);
      })
      .error(reason => cb(null, reason))
      .catch(error => cb(null, error))
    })
    .error(reason => cb(null, reason))
    .catch(error => cb(null, error))
  },
  createProject({name, description}, cb) {
    return knex('PROJECT').insert({
      NAME: name,
      DESCRIPTION: description
    })
    .then(value => {
      return knex.raw("SELECT LAST_INSERT_ID() as ID")
      .then(rows => {
        console.log("*** rows: " + JSON.stringify(rows));
        cb(rows[0][0].ID, null);
      })
      .error(reason => cb(null, reason))
      .catch(error => cb(null, error))
    })
    .error(reason => cb(null, reason))
    .catch(error => cb(null, error))
  },
  readProjects(cb) {
    return knex.select('ID', 'NAME', 'DESCRIPTION', 'CREATED_AT', 'UPDATED_AT')
    .from('PROJECT')
    .then(rows => cb(rows, null))
    .error(reason => cb([], reason))
    .catch(error => cb([], error))
  },
  readProjectWithIdPlusKnitGrids(projectId, cb) {
    return knex.select('p.ID', 'p.NAME', 'p.DESCRIPTION', 'p.CREATED_AT',
        'p.UPDATED_AT',
        'k.ID as KNIT_GRID_ID',
        'k.NAME as KNIT_GRID_NAME',
        'k.GRID_DATA')
    .from('PROJECT AS p')
    .leftJoin('KNIT_GRID as k', 'p.ID', 'k.PROJECT_ID')
    .where('p.ID', '=', projectId)
    .then(rows => cb(rows, null))
    .error(reason => cb([], reason))
    .catch(error => cb([], error))
  },
  saveProjectKnitGrids(projectId, knitgrids, cb) {
    knex.transaction(async function (trx) {
      for (let i = 0; i < knitgrids.length; i++) {
        let knitgrid = knitgrids[i];
        await trx.where("PROJECT_ID", projectId)
        .andWhere("ID", knitgrid.id)
        .update({
          GRID_DATA: JSON.stringify(knitgrid.grid)
        })
        .into("KNIT_GRID")
      }
    })
    .then(() => {
      console.log('Transaction was executed and committed correctly!');
      cb([]);
    })
    .error(reason => {
      console.log("error, reason: " + reason.message);
      cb([], reason)
    })
    .catch(err => {
      console.log('Transaction failed:', err.message);
      cb([], err);
    })

  }
}

/**
 * Check out: https://www.guillermocava.com/is-there-a-mysql-option-feature-to-track-history-of-changes-to-records/
 */
