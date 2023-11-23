const jwt= require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const auth = (req, res, next) => {
    const key = process.env.JWT_SECRET;
    
    try {
      const authorizationHeader = req.headers["authorization"];
        
      if (!authorizationHeader) {
          throw new Error('토큰이 제공되지 않았습니다.');
      }

      const token = authorizationHeader.split(' ')[1];
      console.log(token);
      const decoded = jwt.verify(token, key);
      req.decoded = decoded;
      req.userId = decoded.userId;
      return next();
    } catch (error) {
      console.error(error);
  
      if (error.name === "TokenExpiredError") {
        return res.status(419).json({message: "Token is expried",});
      }
  
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({message: "Token is not valid",});
      }
      
      return res.status(500).json({message: "Interner server error",});
    }
  };

module.exports = auth;