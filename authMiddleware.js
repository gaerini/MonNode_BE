const jwt= require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const auth = (req, res, next) => {
    const key = process.env.JWT_SECRET;
    
    try {
      const token = req.headers["Authorization"];
      const decoded = jwt.verify(token, key);
      req.decoded = decoded;
      req.userId = decoded.userId;
      return next();
    } catch (error) {
      console.error(error);
  
      if (error.name === "TokenExpiredError") {
        return res.status(419).json({
          code: 419,
          message: "토큰이 만료되었습니다.",
        });
      }
  
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          code: 401,
          message: "유효하지 않은 토큰입니다.",
        });
      }
      
      return res.status(500).json({
        code: 500,
        message: "서버 에러",
      });
    }
  };

module.exports = auth;