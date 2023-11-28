const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("Monnode", "root", "1234", {
  host: "mariadb",
  dialect: "mariadb",
});

module.exports = sequelize;
