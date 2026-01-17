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

export {userRegisterValidator, userLoginValidator}