const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

// user
const User = require("../models/User");
const { db } = require("../models/User");

// login
router.get("/login", (req, res) => res.render("login"));

// register
router.get("/register", (req, res) => res.render("register"));

// register
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Fill in all required fields" });
    res.status(400).send("Fill in the empty fields");
  }
  // check password matches
  if (password !== password2) {
    errors.push({ msg: "Passwords don't match" });
    res.status(400).send("Passwords do not match");
  }

  if (errors.length === 0) {
    // no errors detected
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "email taken" });
        res.status(400);
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        //create user
        const newUser = new User({
          name,
          email,
          password,
        });
        // hash
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                res.redirect("/users/login");
                res.status(200);
              })
              .catch((err) => res.status(500).send("server not responding"));
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
    isLoggedIn: true,
  })(req, res, next);
  res.status(400);
});

router.post("/confirmation", (req, res) => {
  res.redirect("/dashboard");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/users/login");
  res.status(200);
});

router.post("/addBudgetData", (req, res) => {
  const {
    email,
    startBudget,
    expenseAmount,
    incomeAmount,
    expenseNames,
    incomeNames,
  } = req.body;

  User.findOne({ email: email }, function (err, user) {
    user.startBudget = startBudget;
    user.expenseAmount = expenseAmount;
    user.incomeAmount = incomeAmount;
    user.expenseNames = expenseNames;
    user.incomeNames = incomeNames;

    user.save(function (err) {
      console.log(user);
    });
  });
  res.redirect("/confirmation");
});

module.exports = router;
