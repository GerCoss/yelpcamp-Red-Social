var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX Muestra todos los campamentos
router.get("/", (req, res) => {
  //obtener todos los campamentos de DB
  Campground.find({}, function (err, allCampgrounds) {
    if(err){
      console.log(err);
    }else {
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  });
});

//CREATE - agrega nuevo campamento a la DB
router.post("/", middleware.isLoggedIn, (req, res) => {
  var name=req.body.name;
  var price=req.body.price;
  var image=req.body.image;
  var description=req.body.description;
  var author ={
    id: req.user._id,
    username: req.user.username
  }
  var newCampgraoud = {name: name, price: price, image:image, description:description, author:author};
  Campground.create(newCampgraoud, function (err, newlyCreated) {
    if(err){
      console.log(err);
    }else {
      console.log("nuevo campamento creado");
      res.redirect("/campgrounds");
    }
  });
});

//NEW muestra el formulario para crear un nuevo campamento
router.get("/new",middleware.isLoggedIn, function (req, res ) {
  res.render("campgrounds/new");
});

//SHOW muestra mas informacion sobre un campamento
router.get("/:idmagic", (req, res) =>{
  //encontrar campamento con el id
  Campground.findById(req.params.idmagic).populate("comments").exec(function (err, foundCampground) {
    if(err || !foundCampground){
      req.flash("error", "No se encontro ningun campamento");
      res.redirect('back');
    }else {
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
} );

//EDIT campgrounds route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
  //is user logged in?
    Campground.findById(req.params.id, function (err, foundCampground) {
          res.render("campgrounds/edit",{campground: foundCampground});
   });
});


//UPDATE campground route
router.put("/:id",middleware.checkCampgroundOwnership, function (req, res) {
  //find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
    if(err){
      res.redirect("/campgrounds");
    }else{
      //redirect somewhere(show page)
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if(err){
      res.redirect("/campgrounds");
    }else{
      res.redirect("/campgrounds");
    }
  });
});


module.exports = router;