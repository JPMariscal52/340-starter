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

// Route  to process registration
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

console.log("buildAccountManagement:", accountController.buildAccountManagement);
console.log("checkLogin:", typeof utilities.checkLogin);
console.log("handleErrors:", typeof utilities.handleErrors);
//-----------------------------------------------W5
// NEW: Default account management view route
// This should be accessible only if logged in, so add checkLogin middleware
router.get(
  "/",
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildAccountManagement)
)
//------------------------------------------------W5

router.get("/logout", utilities.handleErrors(accountController.logout));


router.get(
  "/update", 
  utilities.checkLogin,         
  utilities.handleErrors(accountController.buildUpdateAccount)
)


module.exports = router
