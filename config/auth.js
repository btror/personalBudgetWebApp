module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      console.log("authenticated: " + req.isAuthenticated())
      return next();
    } else {
      console.log("authenticated: " + req.isAuthenticated())
    }
    req.flash("error_msg", "Please log in to view that resource");
    res.redirect("/users/login");
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dashboard");
  },
};
