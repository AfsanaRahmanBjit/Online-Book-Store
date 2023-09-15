const { body, query, param } = require("express-validator");

const userValidator = {
  update: [
    body("name")
        .optional()
        .isString()
        .withMessage("Name must be a string")
        .isLength({ max: 30 })
        .withMessage("Name cannot exceed 30 characters"),
    body("email")
        .optional()
        .isString()
        .withMessage("Email must be a string")
        .isEmail()
        .withMessage("Please provide a valid Email ID"),
    
    body("phone")
        .optional()
        .isString()
        .withMessage("Phone number must be a string.")
        .matches(/^01\d{9}$/)
        .withMessage("Please provide a valid phone number."),
    body("balance")
        .optional()
        .isNumeric()
        .withMessage("Balance must be a numeric value"),
    body("address")
        .optional()
        .isObject()
        .withMessage("Address must be an object with 'house', 'road', 'area' and 'city' fields."),
    body("address.house")
        .optional()
        .isString()
        .withMessage("Address house must be a string"),
  
    body("address.road")
        .optional()
        .isString()
        .withMessage("Address road must be a string"),
  
    body("address.area")
        .optional()
        .isString()
        .withMessage("Address area must be a string"),
  
    body("address.city")
        .optional()
        .isString()
        .withMessage("Address city must be a string"),
  
    body("role")
        .optional()
        .isNumeric()
        .withMessage("Role must be a numeric value"),
  
    body("verified")
        .optional()
        .isBoolean()
        .withMessage("Verified must be a boolean value")
  ],
};

module.exports = { userValidator };