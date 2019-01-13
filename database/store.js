// See: https://knexjs.org

const knex = require('knex')(require('./knexfile'))

module.exports = {
  createKnitGrid ({ friendlyId, name, grid }, cb) {
    return knex('KNIT_GRID').insert({
      FRIENDLY_ID: friendlyId,
      NAME: name,
      GRID_DATA: JSON.stringify(grid)
    })
    .then(value => cb(value))
    .error(reason => cb(reason))
    .catch(error => cb(error))
  },
  readKnitGrid({friendlyId}, cb) {
    return knex.select('FRIENDLY_ID', 'NAME', 'GRID_DATA')
    .from('KNIT_GRID')
    .where({FRIENDLY_ID: friendlyId})
    .then(rows => cb(rows, null))
    .error(reason => cb([], reason))
    .catch(error => cb([], error))
  },
  readKnitGridWithId({id}, cb) {
    return knex.select('ID', 'NAME', 'GRID_DATA')
    .from('KNIT_GRID')
    .where({ID: id})
    .then(rows => cb(rows, null))
    .error(reason => cb([], reason))
    .catch(error => cb([], error))
  },
  updateKnitGrid({friendlyId, grid}, cb) {
    return knex('KNIT_GRID')
    .where('FRIENDLY_ID', '=', friendlyId)
    .update( {
      GRID_DATA: JSON.stringify(grid)
    })
    .then(updatedRows => cb(updatedRows, null))
    .error(reason => cb([], reason))
    .catch(error => cb([], error))
  },
  createProject ({ name, description }, cb) {
    return knex('PROJECT').insert({
      NAME: name,
      DESCRIPTION: description
    })
    .then(value => cb(value))
    .error(reason => cb(reason))
    .catch(error => cb(error))
  },
  readProjects(cb) {
    return knex.select('ID', 'NAME', 'DESCRIPTION', 'CREATED_AT', 'UPDATED_AT')
    .from('PROJECT')
    .then(rows => cb(rows, null))
    .error(reason => cb([], reason))
    .catch(error => cb([], error))
  },
  readProjectWithIdPlusKnitGrids(projectId, cb) {
    return knex.select('p.ID', 'p.NAME', 'p.DESCRIPTION', 'p.CREATED_AT', 'p.UPDATED_AT',
        'k.ID as KNIT_GRID_ID',
        'k.NAME as KNIT_GRID_NAME',
        'k.GRID_DATA')
    .from('PROJECT AS p')
    .leftJoin('KNIT_GRID as k', 'p.ID', 'k.PROJECT_ID')
    .where('p.ID', '=', projectId)
    .then(rows => cb(rows, null))
    .error(reason => cb([], reason))
    .catch(error => cb([], error))
  }
}

/**
 * Check out: https://www.guillermocava.com/is-there-a-mysql-option-feature-to-track-history-of-changes-to-records/
 */
