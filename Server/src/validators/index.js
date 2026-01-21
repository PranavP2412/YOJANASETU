import { body } from "express-validator";

const userRegisterValidator = ()=>{
    return[
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please enter a valid email ID."),
        body("username")
        .trim()
        .notEmpty()
        .withMessage("please fill the username"),
        body("password")
        .trim()
        .notEmpty()
        .withMessage("please fill your password")
        .isLength({min:8})
        .withMessage("password must be of minimum 8 characters"),        
        body("FullName")
        .trim()
        .notEmpty()
        .withMessage("Full Name is required."),
    ]
}

const userLoginValidator = ()=>{
    return[
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please enter a valid email ID."),
        body("password")
        .trim()
        .notEmpty()
        .withMessage("please fill your password")
        .isLength({min:8})
        .withMessage("password must be of minimum 8 characters"),

    ]
}

const userResetPasswordValidator = () => {
    return [
        body("newPassword")
            .trim()
            .notEmpty()
            .withMessage("New password is required.")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long."),
    ];
};


const userInfoValidator = () => {
    return [
        body("category")
            .trim()
            .notEmpty()
            .withMessage("Category is required.")
            .isIn(["General", "SC", "ST", "OBC", "Minority"])
            .withMessage("Invalid category. Choose from General, SC, ST, OBC, or Minority."),

        body("gender")
            .trim()
            .notEmpty()
            .withMessage("Gender is required.")
            .isIn(["Male", "Female", "Other"])
            .withMessage("Gender must be 'Male', 'Female', or 'Other'."),

        body("state")
            .trim()
            .notEmpty()
            .withMessage("State is required.")
            .isLength({ min: 2, max: 50 })
            .withMessage("State name must be between 2 and 50 characters."),

        body("sector")
            .trim()
            .notEmpty()
            .withMessage("Sector is required.")
            .isIn(["Manufacturing", "Service", "Trading", "Agriculture"])
            .withMessage("Invalid sector. Choose Manufacturing, Service, Trading, or Agriculture."),

        body("stage")
            .trim()
            .notEmpty()
            .withMessage("Business stage is required.")
            .isIn(["Idea/Prototype", "Startup", "Existing Business"])
            .withMessage("Invalid stage. Choose Idea/Prototype, Startup, or Existing Business."),

        body("turnover")
            .optional()
            .isNumeric()
            .withMessage("Turnover must be a number.")
            .isFloat({ min: 0 })
            .withMessage("Turnover cannot be negative."),

        body("needs")
            .isArray({ min: 1 })
            .withMessage("Please select at least one need (Loan, Subsidy, etc)."),

        body("needs.*")
            .isIn(["Loan", "Subsidy", "Training", "Exhibition", "Certification", "Infrastructure", "Technology"])
            .withMessage("Invalid need selected.")
    ];
};






export {userRegisterValidator, userLoginValidator, userResetPasswordValidator, userInfoValidator}