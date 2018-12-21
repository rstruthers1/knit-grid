
exports.up = function(knex, Promise) {
  return knex.schema.createTable('KNIT_GRID', function (t) {
    t.increments('ID').primary()
    t.string('FRIENDLY_ID').notNullable().unique()
    t.string('NAME').notNull()
    t.json('GRID_DATA')
    t.timestamps(true, true)

  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('KNIT_GRID')
};
