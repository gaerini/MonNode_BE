const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
//Auth
const jwt = require("jsonwebtoken");
const auth = require("./authMiddleware.js");
const User = require("./models/user");
const Post = require("./models/post");

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
app.get("/myposts", auth, async (req, res) => {
  console.log(req.userId);
  try {
    const userId = req.userId;
    const userPosts = await Post.findAllbyUserId(userId);

    res.json({ success: true, userPosts: userPosts });
  } catch (err) {
    console.error("Error retrieving user posts:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.post("/newpost", auth, async (req, res) => {
  try {
    console.log(req.body);
    const { imageList, decibels, content, userId } = req.body;

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

//auth api

app.post("/signup", async (req, res) => {
  try {
    console.log(req);
    const { username, email, password, profile} = req.body;

    const newUser = await User.createNewUser({
      username,
      email,
      password,
      profile,
    });

    res.json({ message:"User is created successfully", user: newUser });
  } catch (err) {
    res.status(500).json({message: "Internal Server Error" });
  }
});

app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // find user by email and password
    const user = await User.findOne({
      where: {
        email: email,
        password: password,
      },
    });

    // cannot find user
    if (!user) {
      return res.status(401).json({message: "Cannot find user",});
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
        expiresIn: "15m", // valid time
        issuer: "토큰발급자",
      }
    );

    return res.status(200).json({
      message: "Token has been created",
      token: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Interner sever error",});
  }
});

app.get("/payload", auth, (req, res) => {
  const userId = req.userId;

  // Load user's info by userId
  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({message: "Cannot find user",});
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
  const {username, email, password, profile} = req.body;
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
        password,
        profile,
      });
      return res.status(200).json(newUser);
    }

    return res.status(200).json(existingUser);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  
});

app.listen(port, () => {
  console.log("listening on port: ", port);
});
