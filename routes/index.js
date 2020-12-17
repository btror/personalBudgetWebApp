const express = require("express");
const router = express.Router();
const { ensureAuthenticated} = require("../config/auth");

// home Page
router.get("/", (req, res) => res.render("home"));

// about page
router.get("/about", (req, res) => res.render("about"));

// login Page
router.get("/login", (req, res) => res.render("/users/login"));

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) =>
  res.render("dashboard", {
      name: req.user.name,
      date: req.user.date,
      email: req.user.email,
      startBudget: req.user.startBudget,
      expenseAmount: req.user.expenseAmount,
      incomeAmount: req.user.incomeAmount,
      totalIncome: req.user.totalIncome,
      totalSpent: req.user.totalSpent,
      expenseNames: req.user.expenseNames,
      incomeNames: req.user.incomeNames
  })
);

module.exports = router;
