require("dotenv").config();
require("./passport/init_passport");
require("./helper/init_redis");
const express = require("express");

const morgan = require("morgan");
const createError = require("http-errors");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const authRoutes = require("./routes/auth.routes");
const apiRoutes = require("./routes/api.routes");
const {imgRouter,upload} = require("./gridfs_storage/init_gridfs");
const cors = require('cors');
const app = express();
const student = require('./models/student');
const port = process.env.Port;


app.use(morgan("dev"));
app.use(cors())
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.cookieSessionKey],
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/image", imgRouter);

app.get("/", async (req, res, next) => {
  try {
    res.render("home");
  } catch (error) {
    next(error);
  }
});

app.get('/subject',async(req,res)=>{
  res.render('subject')
})

app.post('/updateprofile',upload.single('file'),async(req,res,next)=>{
  const currentuserid =req.user._id
  const updateduser=await student.findOneAndUpdate(
    { _id: currentuserid },
    {username:req.body.username,
      branch:req.body.branch,
      joinyear:req.body.year,
      profilepic:req.file.filename
     },
    {
      new: true,
    }
  );
  console.log(updateduser);
  res.redirect('/secret')
  
})









app.get("/secret", validUser, (req, res) => {
  // if(req.user.isVerified)
  // {
  //   console.log("this is the user" + req.user);
  //   res.render("dashboard");
  // }
  // else{
  //   res.send("please verify your email and then login to continue, kindly check your mail");
  // } 
  res.render("dashboard");
});


function validUser(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
}

app.use(async (req, res, next) => {
  next(createError.NotFound("this route does not exist"));
});

app.use((err, req, res) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.listen(process.env.PORT||port, (err) => {
  if (err) {
    console.log("server error");
  } else console.log(`server running on port ${port}`);
});
