const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

// user model
const User = require("../models/User");
const { db } = require("../models/User");

// login page
router.get("/login", (req, res) => res.render("login"));

// register page
router.get("/register", (req, res) => res.render("register"));

// register handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  // check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Fill in all required fields" });
  }
  // check password matches
  if (password !== password2) {
    errors.push({ msg: "Passwords don't match" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // validation pass
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "email taken" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        //create a new user if one doesn't exist
        const newUser = new User({
          name,
          email,
          password,
        });
        // hash the password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // hash password
            newUser.password = hash;
            // save the user
            newUser
              .save()
              .then((user) => {
                req.flash("success_msg", "Your account has been registered");
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Logged out");
  res.redirect("/users/login");
});

router.post("/addBudgetData", (req, res) => {
  const { email, startBudget, expenseAmount, incomeAmount } = req.body;

  console.log("email: " + email);
  console.log("startBudget: " + startBudget);
  console.log("expenseAmount: " + expenseAmount);
  console.log("incomeAmount: " + incomeAmount);

  User.findOne({ email: email }, function(err, user) {
    user.startBudget = startBudget;
    //user.expenseAmount = expenseAmount;
    //user.incomeAmount = incomeAmount;
    user.save(function(err) {
      console.log(user)
    })
  } );

  // User.findOne({email: email}).then((user) => {
  //   console.log(user._id)
  //   user.updateOne({email}, {startBudget: startBudget})
  //   console.log(user)
  // })

  res.redirect("/dashboard");
});

module.exports = router;
