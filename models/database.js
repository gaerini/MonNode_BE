const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("Monnode", "root", "", {
  host: "mairiadb",
  dialect: "mariadb",
});

module.exports = sequelize;
