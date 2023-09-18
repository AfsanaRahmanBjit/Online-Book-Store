const { body, query, param } = require("express-validator");

const userValidator = {
    update:[
        body("email")
            .exists()
            .withMessage("Please provide your Email ID.")
            .isString()
            .withMessage("Email must be a string")
            .isEmail()
            .withMessage("Please provide a valid Email ID"),
        body("password")
            .exists()
            .withMessage("Please provide your password")
            .isString()
            .withMessage("Password must be a string")
            .isStrongPassword({minLength:8,minLowercase:1,minUppercase:1,minNumbers:1,minSymbols:1})
            .withMessage("Your password must contain 1 lowercase, 1 uppercase, 1 number, 1 symbol and minimum length should be 8"),
        body("phone")
            .exists()
            .withMessage("Please provide phone number.")
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
            .withMessage("Address must be an object with 'house', 'road', 'area', 'city', and 'country' fields."),
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