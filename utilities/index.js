const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */

Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = '<div id="navigation">'
  list += "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  list += "</div>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build vehicle detail view
* ************************************ */
Util.buildVehicleDetail = async function(vehicle) {
  let detail = `<h1 class="title">${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>`

  detail += `<div class="vehicle-detail">`

  detail += `<div class="vehicle-img">
    <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
  </div>`

  detail += `<div class="vehicle-info">
    <h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>
    <p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>
    <p><strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)}</p>
    <p><strong>Color:</strong> ${vehicle.inv_color}</p>
    <p><strong>Description:</strong> ${vehicle.inv_description}</p>
  </div>`

  detail += `</div>`
  return detail
}

/* ****************************************
 * Middleware For Handling Errors
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

//-------------------------------------------------w4

// Build classification dropdown list
Util.buildClassificationList = async function (selectedId) {
  let data = await invModel.getClassifications()
  let select = '<select name="classification_id" id="classificationList" required>' //id="classificationList"
  select += '<option value="">Choose a classification</option>'
  data.rows.forEach(row => {
    select += `<option value="${row.classification_id}" ${selectedId == row.classification_id ? "selected" : ""}>${row.classification_name}</option>`
  })
  select += "</select>"
  return select
}

/* ****************************************
 * Middleware to check if user is logged in
 * **************************************** */

Util.checkLogin = function (req, res, next) {
  if (req.cookies && req.cookies.jwt) {
    jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
      if (err) {
        req.flash("notice", "Please log in")
        res.clearCookie("jwt")
        return res.redirect("/account/login")
      }
      res.locals.accountData = accountData
      next()
    })
  } else {
    req.flash("notice", "Please log in")
    res.redirect("/account/login")
  }
}
//-------------------------------------------------w4

//-------------------------------------------------w5

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 //-------------------------------------------------w5

/* ****************************************
* Middleware to check Employee or Admin access
* Only allow access if account_type is 'Employee' or 'Admin'
**************************************** */
Util.checkEmployeeOrAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    if (!token) {
      req.flash("notice", "You must be logged in as Employee or Admin to access that page.")
      let nav = await Util.getNav()
      return res.status(401).render("account/login", { title: "Login", nav, errors: null, account_email: "" })
    }

    const accountData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    if (accountData.account_type === "Employee" || accountData.account_type === "Admin") {
      res.locals.accountData = accountData 
      res.locals.loggedin = 1
      return next()
    } else {
      req.flash("notice", "Access denied: You do not have permission to access this page.")
      let nav = await Util.getNav()
      return res.status(403).render("account/login", { title: "Login", nav, errors: null, account_email: accountData.account_email })
    }
  } catch (error) {
    console.error("JWT validation error:", error)
    req.flash("notice", "Session expired or invalid. Please log in.")
    let nav = await Util.getNav()
    return res.status(401).render("account/login", { title: "Login", nav, errors: null, account_email: "" })
  }
}



module.exports = Util
