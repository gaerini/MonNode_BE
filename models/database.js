const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("Monnode", "root", "1364", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
