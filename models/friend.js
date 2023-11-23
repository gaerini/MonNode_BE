const { DataTypes } = require("sequelize");
const sequelize = require("./database");
const { Op } = require("sequelize");
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
    const currentRequest = await Friend.findAll({
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              { requesterId: requesterId },
              { addresseeId: addresseeId },
            ],
          },
          {
            [Op.and]: [
              { requesterId: addresseeId },
              { addresseeId: requesterId },
            ],
          },
        ],
      },
    });

    if (!currentRequest) {
      const newRequest = await Friend.create({
        requesterId: requesterId,
        addresseeId: addresseeId,
      });
      return newRequest;
    } else {
      return "이미 있는 요청이거나 없는 사용자!";
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      code: 500,
      message: "서버 에러",
    });
  }
};

Friend.retrieveFriends = async function (userId) {
  try {
    const friends = await Friend.findAll({
      where: {
        [Op.or]: [
          { requesterId: userId, status: "accepted" },
          { addresseeId: userId, status: "accepted" },
        ],
      },
    });
    return friends;
  } catch (err) {
    throw err;
  }
};

module.exports = Friend;
