const Student = require("../models/student");
const {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require("../helper/jwthelper");
const createError = require("http-errors");
const { authSchema } = require("../helper/validatebyjoi");
const client = require("../helper/init_redis");
const sendMail = require('../nodemailer/init_nodemailer');
const sendmail = require("../nodemailer/init_nodemailer");

module.exports = {
  getregister: async (req, res, next) => {
    try {
      res.render("signup");
    } catch (error) {
      next(error);
    }
  },
  register: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body);
      const exist = await Student.findOne({ email: result.email });
      if (exist)
        throw createError.Conflict(`${result.email} is already present`);
      const student = new Student({
        email: result.email,
        password: result.password,
      });
      await student.save().then(async (newstudent) => {
        console.log("new user created" + newstudent);
        const accessToken = await signAccessToken(newstudent.id);
        const refreshToken = await signRefreshToken(newstudent.id);
        res.cookie("access_token",accessToken,{
            maxAge: 3600 * 24 * 365,
            httpOnly:false,
            // secure:true
        });
        res.cookie("refresh_token",refreshToken,{
            maxAge: 3600 * 24 * 365,
            httpOnly:false,
            // secure:true
        });
        const url=`<a href="http://localhost:3000/api/tokens/${accessToken}">http://localhost:3000/api/tokens/${accessToken}</a>`
        sendMail(result.email,url);
        req.login(newstudent, function (err) {
          if (err) {
            return next(err);
          }
          return res.redirect("/secret");
        });
      });
    } catch (error) {
      next(error);
    }
  },
  getlogin: async (req, res, next) => {
    try {
      res.render("login");
    } catch (error) {
      next(error);
    }
  },
  login: async (req, res ,next ) => {
      try {
        console.log(req.user);  
        const accessToken = await signAccessToken(req.user.id);
        const refreshToken = await signRefreshToken(req.user.id);
        res.cookie("access_token",accessToken,{
            maxAge: 3600 * 24 * 365,
            httpOnly:false,
            // secure:true
        });
        res.cookie("refresh_token",refreshToken,{
            maxAge: 3600 * 24 * 365,
            httpOnly:true,
            // secure:true
        });
        res.redirect("/secret");
      } catch (error) {
          next(error)
      }
  },
  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) console.log("err");
      const userid = await verifyRefreshToken(refreshToken);
      const accessToken = await signAccessToken(userid);
      const refToken = await signRefreshToken(userid);
      res.cookie("access_token",accessToken,{
        maxAge: 3600 * 24 * 365,
        httpOnly:false,
        // secure:true
    });
    res.cookie("refresh_token",refToken,{
        maxAge: 3600 * 24 * 365,
        httpOnly:true,
        // secure:true
    });
    } catch (e) {
      next(e);
    }
  },
  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) console.log("bad request");
      const userid = await verifyRefreshToken(refreshToken);
      client.DEL(userid, (err, val) => {
        if (err) {
          console.log(err.message);
          throw createError.InternalServerError();
        }
        console.log(val);
        res.sendStatus(204);
        req.logout();
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.redirect("/");
      });
    } catch (e) {
      next(e);
    }
  },
  // googleRedirect: async (req, res, next) => {
  //   try {
  //     res.redirect("/secret");
  //   } catch (error) {
  //     next(error);
  //   }
  // },
};
