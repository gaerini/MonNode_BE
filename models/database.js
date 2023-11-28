const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("Monnode", "root", "", {
  host: "mariadb",
  dialect: "mariadb",
});

module.exports = sequelize;
