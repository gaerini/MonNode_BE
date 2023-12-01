const { DataTypes } = require("sequelize");
const sequelize = require("./database");
const { Op } = require("sequelize");
const User = require("./user");

const Friend = sequelize.define("Friend");
Friend.belongsTo(User, { foreignKey: "FollowerId" });
Friend.belongsTo(User, { foreignKey: "FolloweeId" });

Friend.Follow = async function (FollowerId, FolloweeId) {
  try {
    const currentFollow = await Friend.findAll({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ FollowerId: FollowerId }, { FolloweeId: FolloweeId }],
          },
          {
            [Op.and]: [{ FollowerId: FolloweeId }, { FolloweeId: FollowerId }],
          },
        ],
      },
    });

    if (currentFollow.length === 0) {
      const newFollow = await Friend.create({
        FollowerId: FollowerId,
        FolloweeId: FolloweeId,
      });
      return newFollow;
    } else {
      return "이미 있는 요청이거나 없는 사용자!";
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Friend.updateFriendship = async function (requesterId, addresseeId, action) {
//   try {
//     const friend = await Friend.findOne({
//       where: {
//         requesterId: requesterId,
//         addresseeId: addresseeId,
//         status: "requested",
//       },
//     });

//     if (friend.length === 0) {
//       return "없는 요청입니다";
//     }

//     friend.status = action === "accept" ? "accepted" : "rejected";
//     await friend.save();

//     return friend;
//   } catch (err) {
//     throw err;
//   }
// };

Friend.retrieveFriends = async function (userId) {
  try {
    const friends = await Friend.findAll({
      where: {
        [Op.or]: [{ FollowerId: userId }, { FolloweeId: userId }],
      },
    });
    if (friends.length === 0) {
      return [];
    } else {
      friendsIdList = [];
      friends.map((friend) => {
        if (friend.FollowerId === userId) {
          friendsIdList.push(friend.FolloweeId);
        } else if (friend.FolloweeId === userId) {
          friendsIdList.push(friend.FollowerId);
        }
      });
    }
    return friendsIdList;
  } catch (err) {
    throw err;
  }
};

module.exports = Friend;
