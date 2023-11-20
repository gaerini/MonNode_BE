const { DataTypes } = require("sequelize");
const sequelize = require("./database");

const Genre = sequelize.define("Genre", {
  genreName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Genre;
