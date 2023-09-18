const { body } = require("express-validator");

const discountValidator = {
  add: [
    body("bookID")
      .exists()
      .withMessage("Please provide a book ID")
      .isMongoId()
      .withMessage("Book ID must be a valid MongoDB ObjectId"),

    body("discountPercentage")
      .exists()
      .withMessage("Please provide a discount percentage")
      .isNumeric()
      .withMessage("Discount percentage must be a numeric value")
      .isFloat({ min: 0, max: 100 })
      .withMessage("Discount percentage must be between 0 and 100"),

    body("startDate")
      .exists()
      .withMessage("Please provide a start date")
      .isDate()
      .withMessage("Start date must be a valid date"),

    body("endDate")
      .exists()
      .withMessage("Please provide an end date")
      .isDate()
      .withMessage("End date must be a valid date"),
  ],
  update: [
    body("discountPercentage")
      .exists()
      .withMessage("Please provide a discount percentage")
      .isNumeric()
      .withMessage("Discount percentage must be a numeric value")
      .isFloat({ min: 0, max: 100 })
      .withMessage("Discount percentage must be between 0 and 100"),

    body("startDate")
      .exists()
      .withMessage("Please provide a start date")
      .isDate()
      .withMessage("Start date must be a valid date"),

    body("endDate")
      .exists()
      .withMessage("Please provide an end date")
      .isDate()
      .withMessage("End date must be a valid date"),
  ],
};

module.exports = { discountValidator };
