const { body, validationResult } = require("express-validator")
const utilities = require("./")

const validate = {}

/* Rules for classification */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .isAlphanumeric()
      .withMessage("Classification name must be alphabetic characters only.")
  ]
}

/* Check classification data */
validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: errors.array()
    })
    return
  }
  next()
}

/* Rules for inventory */
validate.inventoryRules = () => {
  return [
    body("inv_make").trim().isLength({ min: 3 }).withMessage("Please provide a valid make."),
    body("inv_model").trim().isLength({ min: 3 }).withMessage("Please provide a valid model."),
    body("inv_year").isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage("Please provide a valid year."),
    body("inv_price").isFloat({ min: 0 }).withMessage("Please provide a valid price."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Please provide valid miles."),
    body("inv_color").trim().isLength({ min: 3 }).withMessage("Please provide a valid color."),
    body("classification_id").isInt().withMessage("Please choose a classification.")
  ]
}

/* Check inventory data */
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(req.body.classification_id)
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: errors.array()
    })
    return
  }
  next()
}

module.exports = validate
