'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'tb_roleguru', // table name
        'id_jadwal', // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('tb_roleguru', 'id_jadwal'),
    ]);
  }
};
