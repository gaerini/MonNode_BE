const { DataTypes } = require("sequelize");
const sequelize = require("./database");

const User = require("./user");

const Post = sequelize.define("Post", {
  imageList: {
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
    throw err;
  }
};

Post.findAllbyUserId = async function (userId) {
  try {
    const posts = await this.findAll({
      where: { userId: userId },
    });
    return posts;
  } catch (err) {
    throw err;
  }
};

Post.removePost = async function (postId) {
  try {
    const post = await this.findOne({
      where: { id: postId },
    });
    if (post) {
      await this.destroy();
    }
  } catch (err) {
    throw err;
  }
};

Post.belongsTo(User, { foreignKey: "userId" });

module.exports = Post;
