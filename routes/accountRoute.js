// routes/accountRoute.js
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to show login page
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to show login
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to process registration
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router
