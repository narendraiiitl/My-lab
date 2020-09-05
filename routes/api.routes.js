const apicontroller=require('../controller/api.controller')
const router = require("express").Router();


router.post("/subjects",apicontroller.postsubjects)

router.get('/subjects',apicontroller.getsubjects)

router.get('/username',apicontroller.getusername)

router.get('/currentUser',apicontroller.getcurrentuser)

router.get('/currentsubject',apicontroller.getcurrentsubject)

router.post('/markattendence',apicontroller.postmark)

router.get('/tokens/:token',apicontroller.gettoken)

module.exports = router;

