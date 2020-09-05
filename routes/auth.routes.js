const passport = require("passport");
const authcontroller=require('../controller/auth.contoller')
const router = require("express").Router();

router.get("/login",authcontroller.getlogin);

router.post("/login", passport.authenticate(["local"],{failureRedirect:'/auth/login'}),authcontroller.login);

router.get("/register",authcontroller.getregister);

router.post("/register",authcontroller.register);

router.get("/refreshToken", authcontroller.refreshToken) 

router.delete("/logout",authcontroller.logout);     

router.get("/google", passport.authenticate("google", { scope: ["profile","email"], }));

router.get("/google/redirect", passport.authenticate("google"),authcontroller.login);

module.exports = router;

