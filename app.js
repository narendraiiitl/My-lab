require("dotenv").config();
require("./passport/init_passport");
require("./helper/init_redis");
const express = require("express");
const crypto = require('crypto');
const morgan = require("morgan");
const createError = require("http-errors");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const authRoutes = require("./routes/auth.routes");
const apiRoutes = require("./routes/api.routes");
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const  multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const grid = require('gridfs-stream');
const { Grid } = require('gridfs-stream');
const app = express();
const student = require('./models/student');
const port = process.env.Port;
const mongouri = process.env.mongouri2;
const conn = mongoose.createConnection(mongouri,
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true  
    }
)

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

app.get("/", async (req, res, next) => {
  try {
    res.render("home");
  } catch (error) {
    next(error);
  }
});




////////////////////////////////////////////STORAGE ENGINE////////////////////////////////////////
let gfs;

conn.once('open',()=>{
    gfs = grid(conn.db,mongoose.mongo)
    gfs.collection('media')
})


//create storage engine
const storage = new GridFsStorage({
  url: mongouri,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }[]
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'media'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });
////////////////////////////////////////////STORAGE ENGINE////////////////////////////////////////

app.post('/updateprofile',upload.single('file'),async(req,res,next)=>{
  const currentuserid =req.user._id
  const updateduser=await student.findOneAndUpdate(
    { _id: currentuserid },
    {username:req.body.username,
      branch:req.body.username,
      joinyear:req.body.year,
      profilepic:req.file.id
     },
    {
      new: true,
    }
  );
  console.log(updateduser);
})

app.get('/image/:fileid',async(req,res,next)=>{
    
  gfs.files.findOne({id:req.params.fileid},(err,file)=>{
      if(!file || file.length === 0)
      {
          res.status(404).json({
              err:"file does't exist"
          })
      }
      else if(file.contentType === 'image/jpg' || file.contentType === 'image/png')
      {
          const readstream = gfs.createReadStream(file.filename);
          readstream.pipe(res)
      }
      else{
          res.status(404).json({
              err:"not an image"
          })
      }
  })
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

app.get("/subjects", (req, res) => {
  res.render("subject");
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

app.listen(port, (err) => {
  if (err) {
    console.log("server error");
  } else console.log(`server running on port ${port}`);
});
