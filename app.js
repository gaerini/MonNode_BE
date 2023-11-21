const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const bodyParser = require("body-parser");

const User = require("./models/user");
const Post = require("./models/post");

const sequelize = require("./models/database");
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

app.post("/signup", async (req, res) => {
  try {
    console.log(req);
    const { username, email, password } = req.body;

    const newUser = await User.createNewUser({
      username,
      email,
      password,
    });

    res.json({ success: true, user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.post("/newpost", async (req, res) => {
  try {
    console.log(req.body);
    const { image, decibels, content } = req.body;

    const newPost = await Post.createNewPost({ image, decibels, content });
    res.send({ success: true, post: newPost });
  } catch (err) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log("listening on port: ", port);
});
