// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build inventory detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildDetailView))

// Route to trigger intentional server error
router.get("/cause-error", utilities.handleErrors(invController.causeError))

module.exports = router
