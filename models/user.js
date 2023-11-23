const { DataTypes } = require("sequelize");
const sequelize = require("./database");
const Genre = require("./genre");

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.createNewUser = async function (userData) {
  try {
    const newUser = await this.create(userData);
    return newUser;
  } catch (err) {
    throw error;
  }
};

User.hasMany(Genre, { foreignKey: "genereId" });

module.exports = User;
