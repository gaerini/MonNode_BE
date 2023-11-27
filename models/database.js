const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("Monnode", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
