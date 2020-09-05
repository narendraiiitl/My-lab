const passport = require("passport");
require('dotenv').config();
const googlestrategy = require("passport-google-oauth20");
const localstrategy = require("passport-local");
const Student = require("../models/student");
const bcrypt = require("bcrypt");
// const { clientID, clientSecret } = require("../config/keys");
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  Student.findById(id)
    .then((student) => {
      done(null, student);
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
    });
});
passport.use(
  new googlestrategy(
    {
      //option for google strategy
      callbackURL: "/auth/google/redirect",
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
    },
    (accessToken, refreshToken, profile, done) => {
      Student.findOne({ googleid: profile.id }).then((currentStudent) => {
        if (currentStudent) {
          done(null, currentStudent);
        } else {
          console.log(profile.emails[0].value);
          console.log(profile);
          new Student({
            username: profile.displayName,
            googleid: profile.id,
            password: process.env.refreshTokenSecret,
            email:profile.emails[0].value,
            isVerified:profile.emails[0].verified,
          })
            .save()
            .then((newStudent) => {
              console.log("new user created" + newStudent);
              done(null, newStudent);
            });
        }
      });
    }
  )
);

passport.use(
  new localstrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (username, password, done) {
      Student.findOne({ email: username }, async function (err, student) {
        if (err) {
          return done(err);
        }
        if (!student) {
          return done(null, false);
        }
        try {
          if (await bcrypt.compare(password, student.password)) {
            return done(null, student);
          } else {
            return done(null, false);
          }
        } catch (e) {
          console.log(e);
        }
      });
    }
  )
);
