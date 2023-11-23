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

Friend.updateFriendship = async function (requesterId, addresseeId, action) {
  try {
    const friend = await Friend.findOne({
      where: {
        requesterId: requesterId,
        addresseeId: addresseeId,
        status: "requested",
      },
    });

    if (!friend) {
      return res.status(404).json({
        code: 404,
        message: "Friend request not found",
      });
    }

    friend.status = action === "accept" ? "accepted" : "rejected";
    await friend.save();

    return friend;
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      code: 500,
      message: "Interner server error",
    });
  }
};

module.exports = Friend;
