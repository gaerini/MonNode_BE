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
  nickname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: true,
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
    throw err;
  }
};

User.retrieveUserName = async function (userId) {
  try {
    const user = await this.findOne({
      where: {
        id: userId,
      },
    });
    return user.dataValues.username;
  } catch (err) {
    throw err;
  }
};

User.findUserByEmail = async function (email) {
  try {
    const user = await this.findOne({
      where: {
        email: email,
      },
    });
    if (user) {
      return user.dataValues.id;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
}.bind(User);

module.exports = User;
