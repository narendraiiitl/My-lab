const subject = require("../models/subject");
const student = require("../models/student");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");

module.exports = {
  postsubjects: async (req, res, next) => {
    try {
      const exist = await subject.findOne({
        name: req.body.name,
        joinYear: req.body.joinYear,
        branch: req.body.branch,
        teacher: req.body.teacher,
      });
      if (exist)
        throw createError.Conflict(`${req.body.name} is already present`);
      else {
        const Subject = new subject({
          name: req.body.name,
          joinYear: req.body.joinYear,
          branch: req.body.branch,
          teacher: req.body.teacher,
        });
        await Subject.save().then(async (newsubject) => {
          console.log("new subject created" + newsubject);
        });
        res.send("Subject posted successfully");
      }
    } catch (error) {
      next(error);
    }
  },
  getsubjects: async (req, res, next) => {
    try {
      subject
        .find()
        .then(function (data) {
          res.json(data);
        })
        .catch(function (err) {
          res.send(err);
        });
    } catch (error) {
      next(error);
    }
  },
  getusername: async (req, res, next) => {
    try {
      const user = req.headers.user_id.split('"')[1];
      const Stu = await student.findOne({ _id: user });
      res.send(Stu);
    } catch (error) {
      next(error);
    }
  },
  getcurrentuser: async (req, res, next) => {
    try {
      res.cookie("user_id", req.user._id, {
        maxAge: 3600 * 24 * 365,
        httpOnly: false,
      });
      res.send(req.user);
    } catch (error) {
      next(error);
    }
  },
  getcurrentsubject: async (req, res, next) => {
    try {
      const Subject = await subject.findOne({ _id: req.headers.subject_id });
      res.send(Subject);
    } catch (error) {
      next(error);
    }
  },
  postmark: async (req, res, next) => {
    try {
      const userid = req.body.id.split('"')[1];
      const currentsubject = req.body.subject;
      const attendence = {
        date: new Date(),
        presence: "Present",
        subjectid: currentsubject._id,
        subjectname: currentsubject.name,
      };
      const attend = await student.findOneAndUpdate(
        { _id: userid },
        { $push: { attendence } },
        {
          new: true,
        }
      );
      console.log(attend);
    } catch (error) {
      next(error);
    }
  },
  gettoken: async (req, res, next) => {
    try {
        const token =req.params.token;
        jwt.verify(token, process.env.accessTokenSecret,async (err, payload) => {
            if (err) {
              if (err.name === "JsonWebTokenError")
                return next(createError.Unauthorized());
              else {
                return next(createError.Unauthorized(err.message));
              }
            }
            let Student = await student.findOneAndUpdate({_id:payload.aud},{isVerified:true}, {
                new: true
              });
              console.log(Student);
          });
    } catch (error) {
      next(error);
    }
  },
};