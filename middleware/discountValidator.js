const { body } = require("express-validator");

const discountValidator = {
  add: [
    body("bookID")
      .exists()
      .withMessage("Please provide a book ID")
      .bail()
      .notEmpty()
      .withMessage("Book ID cannot be empty")
      .bail()
      .isMongoId()
      .withMessage("Book ID must be a valid MongoDB ObjectId"),

    body("discountPercentage")
      .exists()
      .withMessage("Please provide a discount percentage")
      .bail()
      .notEmpty()
      .withMessage("Discount percentage cannot be empty")
      .bail()
      .isNumeric()
      .withMessage("Discount percentage must be a numeric value")
      .bail()
      .isFloat({ min: 1, max: 100 })
      .withMessage("Discount percentage must be between 0 and 100"),

    body("startDate")
      .exists()
      .withMessage("Please provide a start date")
      .bail()
      .notEmpty()
      .withMessage("Start Date  cannot be empty")
      .bail()
      .isDate()
      .withMessage("Start date must be a valid date"),

    body("endDate")
      .exists()
      .withMessage("Please provide an end date")
      .bail()
      .notEmpty()
      .withMessage("End Date cannot be empty")
      .bail()
      .isDate()
      .withMessage("End date must be a valid date"),
  ],
  update: [
    body("discountPercentage")
      .exists()
      .withMessage("Please provide a discount percentage")
      .bail()
      .notEmpty()
      .withMessage("Discount percentage cannot be empty")
      .bail()
      .isNumeric()
      .withMessage("Discount percentage must be a numeric value")
      .bail()
      .isFloat({ min: 1, max: 100 })
      .withMessage("Discount percentage must be between 1 and 100"),

    body("startDate")
      .exists()
      .withMessage("Please provide a start date")
      .bail()
      .notEmpty()
      .withMessage("Start Date  cannot be empty")
      .bail()
      .custom(value => {
        const date = new Date(value);
        return !isNaN(date.getTime()); 
      })
      .withMessage("Start date must be a valid date"),

    body("endDate")
      .exists()
      .withMessage("Please provide an end date")
      .bail()
      .notEmpty()
      .withMessage("End Date  cannot be empty")
      .bail()
      .custom(value => {
        const date = new Date(value);
        return !isNaN(date.getTime()); 
      })
      .withMessage("End date must be a valid date"),
    
  ],

  partialUpdate: [
    body("discountPercentage")
      .optional()
      .isNumeric()
      .withMessage("Discount percentage must be a numeric value")
      .bail()
      .isFloat({ min: 1, max: 100 })
      .withMessage("Discount percentage must be between 1 and 100"),

    body("startDate")
      .optional()
      .custom(value => {
        const date = new Date(value);
        return !isNaN(date.getTime()); 
      })
      .withMessage("Start date must be a valid date"),
      

    body("endDate")
      .optional()
      .custom(value => {
        const date = new Date(value);
        return !isNaN(date.getTime()); 
      })
      .withMessage("End date must be a valid date"),
    ]
};

module.exports = { discountValidator };
