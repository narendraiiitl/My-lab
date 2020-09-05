const mongoose = require('mongoose');
const  multer = require('multer');
const imgRouter = require("express").Router();
const path = require('path');
const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const grid = require('gridfs-stream');
const mongouri = process.env.mongouri2;
const conn = mongoose.createConnection(mongouri,
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true  
    }
)

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

imgRouter.get('/:filename',async(req,res,next)=>{  
    if(req.user != undefined)
    {
      gfs.files.findOne({filename:req.user.profilepic},(err,file)=>{
        if(!file || file.length === 0)
        {
            res.status(404).json({
                err:"file does't exist"
            })
        }
        else if(file.contentType === 'image/jpg' || file.contentType === 'image/png' || file.contentType === 'image/jpeg')
        {
            console.log("1")
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res)
        }
        else{
            res.status(404).json({
                err:"not an image"
            })
        }
    })
    }
    else{
      res.send("user not found")
    }
  })



  module.exports = {imgRouter,upload};