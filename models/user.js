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

User.findUserByEmail = async function(email){
  try{
    const user = await this.findOne({
      where:{
        email: email,
      },
    });
    return user.dataValues.userId;
  } catch (err) {
    throw err;
  }
};

module.exports = User;
