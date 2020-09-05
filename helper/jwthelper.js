const client = require("../helper/init_redis");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
require("dotenv").config();
module.exports = {
  signAccessToken: (userid) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.accessTokenSecret;
      const option = {
        expiresIn: "1h",
        issuer: "nsn",
        audience: userid,
      };
      jwt.sign(payload, secret, option, (err, token) => {
        if (err) {
          console.log(err.message);

          return reject(createError.InternalServerError());
        }
        resolve(token);
      });
    });
  },
  verifyAccessToken: (req, res, next) => {
    console.log( req.headers["authorization"]);
    if (!req.headers["authorization"]) return next(createError.Unauthorized());
    const authHeader = req.headers["authorization"].split(" ");
    const token = authHeader[1];
    jwt.verify(token, process.env.accessTokenSecret, (err, payload) => {
      if (err) {
        if (err.name === "JsonWebTokenError")
          return next(createError.Unauthorized());
        else {
          return next(createError.Unauthorized(err.message));
        }
      }
      req.payload = payload;
      next();
    });
  },
  signRefreshToken: (userid) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.refreshTokenSecret;
      const option = {
        expiresIn: "1y",
        issuer: "nsn",
        audience: userid,
      };
      jwt.sign(payload, secret, option, async (err, token) => {
        if (err) {
          console.log(err.message);

          return reject(createError.InternalServerError());
        }
        client.set(userid, token,'EX',365*24*60*60, (err) => {
          if (err) {
            console.log(err.message);
            reject(createError.InternalServerError());
            return;
          }
          resolve(token);
        });
      });
    });
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.refreshTokenSecret,
        async (err, payload) => {
          if (err) return reject(createError.Unauthorized());
          const userid = payload.aud;
          client.GET(userid,(err,result)=>{
              if(err)
              {
                  console.log(err.message)
                  reject(createError.InternalServerError())
                  return
              }
              else{
                  if(refreshToken===result)
                  {
                      resolve(userid)
                  }
                  else{
                      reject(createError.Unauthorized())
                  }
              }
          })
        }
      );
    });
  },
};
