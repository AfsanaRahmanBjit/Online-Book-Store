const { body, query, param } = require("express-validator");

const userValidator = {
    update:[

        body("email")
            .exists()
            .withMessage("Please provide your Email ID.")
            .bail()
            .notEmpty()
            .withMessage("Email ID cannot be empty")
            .bail()
            .isString()
            .withMessage("Email must be a string")
            .bail()
            .isEmail()
            .withMessage("Please provide a valid Email ID"),

        body("password")
            .exists()
            .withMessage("Please provide your password")
            .bail()
            .notEmpty()
            .withMessage("Password cannot be empty")
            .bail()
            .isString()
            .withMessage("Password must be a string")
            .bail()
            .isStrongPassword({minLength:8,minLowercase:1,minUppercase:1,minNumbers:1,minSymbols:1})
            .withMessage("Your password must contain 1 lowercase, 1 uppercase, 1 number, 1 symbol and minimum length should be 8"),

        body("phone")
            .exists()
            .withMessage("Please provide phone number.")
            .bail()
            .notEmpty()
            .withMessage("Phone number cannot be empty")
            .bail()
            .isString()
            .withMessage("Phone number must be a string.")
            .bail()
            .matches(/^01\d{9}$/)
            .withMessage("Please provide a valid phone number."),

        body("balance")
            .optional()
            .isNumeric()
            .withMessage("Balance must be a numeric value"),
      
        body("role")
            .optional()
            .isNumeric()
            .withMessage("Role must be a numeric value"),
      
        body("verified")
            .optional()
            .isBoolean()
            .withMessage("Verified must be a boolean value")
    ],

    partialUpdate: [

        body("name")
            .optional()
            .isString()
            .withMessage("Name must be a string")
            .bail()
            .isLength({ max: 30 })
            .withMessage("Name cannot exceed 30 characters"),

        body("email")
            .optional()
            .isString()
            .withMessage("Email must be a string")
            .bail()
            .isEmail()
            .withMessage("Please provide a valid Email ID"),
        
        body("phone")
            .optional()
            .isString()
            .withMessage("Phone number must be a string.")
            .bail()
            .matches(/^01\d{9}$/)
            .withMessage("Please provide a valid phone number."),

        body("balance")
            .optional()
            .isNumeric()
            .withMessage("Balance must be a numeric value"),

        body("role")
            .optional()
            .isNumeric()
            .withMessage("Role must be a numeric value"),
      
        body("verified")
            .optional()
            .isBoolean()
            .withMessage("Verified must be a boolean value")
      ],


    balance:[
        body("balance")
            .exists()
            .withMessage("Please provide your balance.")
            .bail()
            .notEmpty()
            .withMessage("Balance cannot be empty")
            .bail()
            .isNumeric()
            .withMessage("Balance must be a numaric value")
            .bail()
            .isInt({ min: 0})
            .withMessage("Balance must be greater than or equal to 0"),
      ],
  
};

module.exports = { userValidator };