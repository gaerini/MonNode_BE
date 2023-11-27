const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const bodyParser = require("body-parser");

//Auth 관련
const jwt = require("jsonwebtoken");
const auth = require("./authMiddleware.js");
const User = require("./models/user");
const Post = require("./models/post");
const Friend = require("./models/friend");

const sequelize = require("./models/database");

require("dotenv").config();

sequelize
  .sync()
  .then(() => {
    console.log("테이블이 성공적으로 생성되었습니다.");
  })
  .catch((err) => {
    console.error("테이블 생성 중 오류 발생: ", err);
  });

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("yay!");
});

//post api
app.get("/myposts", async (req, res) => {
  console.log(req.body.email);
  try {
    const userId = await User.findUserByEmail(req.body.email);
    console.log(userId);
    const userPosts = await Post.findAllbyUserId(userId);

    res.json({ success: true, userPosts: userPosts });
  } catch (err) {
    console.error("Error retrieving user posts:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.post("/signup", async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, genre, profile } = req.body;

    const newUser = await User.createNewUser({
      username,
      email,
      genre,
      profile,
    });

    res.json({ success: true, user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.post("/newpost", async (req, res) => {
  try {
    console.log(req.body);
    const userId = await User.findUserByEmail(req.body.email);
    const { imageList, decibels, content } = req.body;

    const newPost = await Post.createNewPost({
      imageList,
      decibels,
      content,
      userId,
    });
    res.send({ success: true, post: newPost });
  } catch (err) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

//auth api; we don't use this api

app.post("/login", async (req, res, next) => {
  const { username } = req.body;

  try {
    // find user by email and password
    const user = await User.findOne({
      where: {
        username: username,
      },
    });

    // cannot find user
    if (!user) {
      return res.status(401).json({ message: "Cannot find user" });
    }

    // token is issued
    const key = process.env.JWT_SECRET;
    console.log("Key: ", key);
    const token = jwt.sign(
      {
        type: "JWT",
        userId: user.id,
        email: user.email,
      },
      key,
      {
        expiresIn: "1h", // 1시간 후 만료

        issuer: "토큰발급자",
      }
    );

    return res.status(200).json({
      message: "Token has been created",
      token: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Interner sever error" });
  }
});

app.post("/friendRequest", async (req, res) => {
  console.log(req.body);
  const requesterId = User.findUserByEmail(req.requsterEmail);
  const addresseeId = User.findUserByEmail(req.addresseeEmail); //find req, add user by email
  try {
    const newRequest = await Friend.requestFriendship(requesterId, addresseeId);
    res.json({ success: true, user: newRequest });
  } catch (err) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "서버 에러",
    });
  }
});

app.get("/friendRetrieve", async (req, res) => {
  console(req.body);
  const userId = User.findUserByEmail(req.email);
  try {
    const friendsIdList = await Friend.retrieveFriends(userId);
    const usernamePromises = friendsIdList.map((friendId) =>
      User.retrieveUserName(friendId)
    );
    const usernameList = await Promise.all(usernamePromises);
    res.json({ success: true, friends: usernameList });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      code: 500,
      message: "서버 에러",
    });
  }
});

app.post("/friendUpdate", async (req, res) => {
  console.log(req.body);
  const requesterId = User.findUserByEmail(req.requsterEmail);
  const addresseeId = User.findUserByEmail(req.addresseeEmail); //find req, add user by email
  const { action } = req.body;
  try {
    const newUpdate = await Friend.updateFriendship(
      requesterId,
      addresseeId,
      action
    );
    res.json({ success: true, status: newUpdate });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      code: 500,
      message: "Interner server error",
    });
  }
});

app.get("/payload", auth, (req, res) => {
  console.log(req.body);
  const userId = User.findUserByEmail(req.email);

  // Load user's info by userId
  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Cannot find user" });
      }

      return res.status(200).json({
        message: "Token is valid",
        data: {
          email: user.email,
          password: user.password,
        },
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: "Interner server error",
      });
    });
});

app.post("/user", async (req, res) => {
  console.log(req);
  const { username, email, genre, profile } = req.body;
  try {
    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      const newUser = await User.create({
        username,
        email,
        genre,
        profile,
      });
      return res.status(200).json(newUser);
    }

    return res.status(200).json(existingUser);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/deletePost", async (req, res) => {
  const postId = req.postId;
  try {
    await Post.removePost(postId);
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log("listening on port: ", port);
});
