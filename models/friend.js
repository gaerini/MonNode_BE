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

    if (currentRequest.length === 0) {
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
    throw err;
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

    if (friend.length === 0) {
      return "없는 요청입니다";
    }

    friend.status = action === "accept" ? "accepted" : "rejected";
    await friend.save();

    return friend;
  } catch (err) {
    throw err;
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
    if (friends.length === 0) {
      return "친구가 없습니다.";
    } else {
      friendsIdList = [];
      friends.map((friend) => {
        if (friend.requesterId === userId) {
          friendsIdList.push(friend.requesterId);
        } else if (friend.addresseeId === userId) {
          friendsIdList.push(friend.addresseeId);
        }
      });
    }
    return friendsIdList;
  } catch (err) {
    throw err;
  }
};

module.exports = Friend;
