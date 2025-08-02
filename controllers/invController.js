const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/*Build vehicle detail view*/
invCont.buildDetailView = async function (req, res, next) {
  const inv_id = req.params.invId
  const vehicleData = await invModel.getInventoryById(inv_id)
  const vehicleHTML = await utilities.buildVehicleDetail(vehicleData)
  let nav = await utilities.getNav()
  const title = `${vehicleData.inv_make} ${vehicleData.inv_model}`
  res.render("./inventory/detail", {
    title,
    nav,
    vehicle: vehicleHTML
  })
}

/*Intentional error*/
invCont.causeError = (req, res, next) => {
  throw new Error("This is a test 500 error!")
}

module.exports = invCont
