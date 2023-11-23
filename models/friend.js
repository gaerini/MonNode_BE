const { DataTypes } = require("sequelize");
const sequelize = require("./database");
const User = require("./user");

const Friend = sequelize.define("Friend", {
  status: {
    type: DataTypes.ENUM("requested", "accepted", "rejected"),
    defaultValue: "requested",
  },
});
Friendship.belongsTo(User, { as: "requester", foreignKey: "requesterId" });
Friendship.belongsTo(User, { as: "addressee", foreignKey: "addresseeId" });

module.exports = Friend;

Friend.requestFriendship = async function sendFriendRequest(
  requesterId,
  addresseeId
) {
  await Friendship.create({
    requesterId: requesterId,
    addresseeId: addresseeId,
    status: "requested",
  });
};
