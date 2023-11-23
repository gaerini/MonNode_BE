const { DataTypes } = require("sequelize");
const sequelize = require("./database");

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.createNewUser = async function (userData) {
  try {
    const newUser = await this.create(userData);
    return newUser;
  } catch (err) {
    throw err;
  }
};

module.exports = User;
