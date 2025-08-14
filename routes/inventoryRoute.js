// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
//---------------------------------------w4
const invValidate = require("../utilities/inventory-validation")

// Inventory management
router.get("/", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildManagementView))

// Add classification
router.get("/add-classification", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildAddClassification))
router.post(
  "/add-classification", 
  utilities.checkEmployeeOrAdmin,
  invValidate.classificationRules(), 
  invValidate.checkClassificationData, 
  utilities.handleErrors(invController.addClassification)
)

// Add inventory
router.get("/add-inventory", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildAddInventory))
router.post(
  "/add-inventory", 
  utilities.checkEmployeeOrAdmin,
  invValidate.inventoryRules(), 
  invValidate.checkInventoryData, 
  utilities.handleErrors(invController.addInventory)
) 

// Update inventory w6
router.post(
  "/update",
  utilities.checkEmployeeOrAdmin,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData, 
  utilities.handleErrors(invController.updateInventory)
)

//New route to get inventory as JSON //------W5
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//---------------------------------------w4

// Route to build inventory by classification view 
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build inventory detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildDetailView))

// Route to trigger intentional server error
router.get("/cause-error", utilities.handleErrors(invController.causeError))

// ---------------------------------------W6
// Route to build edit inventory view
router.get("/edit/:invId", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildEditInventoryView))

// Ruta para mostrar la vista de confirmación de borrado
router.get(
  "/delete/:invId",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildDeleteInventoryView)
)

// Ruta para procesar el borrado del vehículo 
router.post(
  "/delete",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteInventory)
)

module.exports = router



