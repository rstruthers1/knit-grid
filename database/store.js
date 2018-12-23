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
  updateKnitGrid({friendlyId, grid}, cb) {
    return knex('KNIT_GRID')
    .where('FRIENDLY_ID', '=', friendlyId)
    .update( {
      GRID_DATA: JSON.stringify(grid)
    })
    .then(updatedRows => cb(updatedRows, null))
    .error(reason => cb([], reason))
    .catch(error => cb([], error))
  }
}

/**
 * Check out: https://www.guillermocava.com/is-there-a-mysql-option-feature-to-track-history-of-changes-to-records/
 */
