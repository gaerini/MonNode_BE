const { DataTypes } = require("sequelize");
const sequelize = require("./database");
const User = require("./user");

const Friend = sequelize.define("Friend", {
  status: {
    type: DataTypes.ENUM("requested", "accepted", "rejected"),
    defaultValue: "requested",
  },
});
Friend.belongsTo(User, { foreignKey: "requesterId" });
Friend.belongsTo(User, { foreignKey: "addresseeId" });

Friend.requestFriendship = async function (requesterId, addresseeId) {
  try {
    const newRequest = await Friend.create({
      requesterId: requesterId,
      addresseeId: addresseeId,
    });
    return newRequest;
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      code: 500,
      message: "서버 에러",
    });
  }
};

module.exports = Friend;
