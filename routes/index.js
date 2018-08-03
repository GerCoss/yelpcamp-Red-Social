var express = require("express");
var router = express.Router();
const passport = require("passport");
const User =require("../models/user");

//routes
router.get("/", (req, res) =>{
  //res.send("send fafa nudes");
  res.render("landing");
});



// ========================
// AUTH ROUTES
// =======================

//show register form
router.get("/register", function(req, res) {
   res.render("register");
});
// handle sgn up logic
router.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.render('register');
        }else{
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Bienvenido a YelpCamp" + user.username);
                res.redirect("/campgrounds");
            });
        }
    }); 
});

//show login form
router.get("/login", function(req, res) {
    res.render("login");
});
//handle login  logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {
});

// logic route
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Cerraste sesion");
  res.redirect("/campgrounds");
});


module.exports = router;