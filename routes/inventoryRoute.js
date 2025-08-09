// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
//---------------------------------------w4
const invValidate = require("../utilities/inventory-validation")

// Inventory management
router.get("/", utilities.handleErrors(invController.buildManagementView))

// Add classification
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))
router.post(
  "/add-classification", 
  invValidate.classificationRules(), 
  invValidate.checkClassificationData, 
  utilities.handleErrors(invController.addClassification)
)

// Add inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))
router.post(
  "/add-inventory", 
  invValidate.inventoryRules(), 
  invValidate.checkInventoryData, 
  utilities.handleErrors(invController.addInventory)
)

//---------------------------------------w4

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build inventory detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildDetailView))

// Route to trigger intentional server error
router.get("/cause-error", utilities.handleErrors(invController.causeError))

module.exports = router
