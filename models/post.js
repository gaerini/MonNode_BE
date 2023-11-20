const { DataTypes } = require("sequelize");
const sequelize = require("./database");
const User = require("./user");

const Post = sequelize.define("Post", {
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  decibels: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Post.createNewPost = async function (postData) {
  try {
    const newPost = await this.create(postData);
    return newPost;
  } catch (err) {
    throw error;
  }
};

Post.belongsTo(User, { foreignKey: "userId" });

module.exports = Post;
