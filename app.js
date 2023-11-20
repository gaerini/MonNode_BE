const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
//Auth 관련
const jwt = require('jsonwebtoken');
const auth = require('./authMiddleware.js');
const User = require("./models/user");
const sequelize = require("./models/database");

require('dotenv').config();

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
  res.send("Welcome!!");
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

app.listen(port, () => {
  console.log("listening on port: ", port);
});


app.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 이메일과 패스워드를 사용하여 사용자를 찾습니다.
    const user = await User.findOne({
      where: {
        email: email,
        password: password,
      },
    });

    // 사용자가 없으면 인증 실패
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: '인증실패',
      });
    }

    // 사용자가 있으면 토큰 발급
    const key = process.env.JWT_SECRET;
    console.log('Key: ',key);
    const token = jwt.sign(
      {
        type: 'JWT',
        userId: user.id,
        email: user.email,
      },
      key,
      {
        expiresIn: '15m', // 15분후 만료
        issuer: '토큰발급자',
      }
    );

    // 응답
    return res.status(200).json({
      code: 200,
      message: '토큰이 생성되었습니다.',
      token: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
});

app.get("/payload", auth, (req, res) => {
  const userId = req.userId;

  // 여기에서는 사용자 ID를 기반으로 사용자 정보를 가져오는 예시로 Sequelize를 사용합니다.
  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          code: 404,
          message: "사용자를 찾을 수 없습니다.",
        });
      }

      return res.status(200).json({
        code: 200,
        message: "토큰이 정상입니다.",
        data: {
          username: user.username,
          email: user.email,
        },
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: "서버 에러",
      });
    });
});