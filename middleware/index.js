var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
   if(req.isAuthenticated()){
    Campground.findById(req.params.id, function (err, foundCampground) {
      if(err || !foundCampground){
        req.flash("error","Campamento no encontrado");
        res.redirect("back");
      } else{
        //does user own the capground?
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        }else{
          req.flash("error","No cuentas con los permisos");
          res.redirect("back");
        }
        }
   });
  }else{
    req.flash("error", "Necesitas inicar sesion");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
   if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if(err || !foundComment){
        req.flash('error', 'No se encontro el comentario');
        res.redirect("back");
      } else{
        //does user own the comment?
        if(foundComment.author.id.equals(req.user._id)){
          next();
        }else{
          req.flash("error","No cuentas con los permisos");
          res.redirect("back");
        }
        }
   });
  }else{
    req.flash("error", "Necesitas inicar sesion");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error" , "Necesitas iniciar sesion");
    res.redirect("/login");
};


module.exports = middlewareObj;