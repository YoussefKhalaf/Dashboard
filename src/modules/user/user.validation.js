import Joi from "joi"

export const signInValidationSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required.",
        "string.email": "Invalid email format."
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required.",
        "string.min": "Password must be at least 6 characters long."
    })
})

export const signUpValidationSchema = Joi.object({
    userName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    recoveryEmail: Joi.string().email().optional(),
    password: Joi.string().min(6).required(),
    DoB: Joi.date().iso().less("now").required(),
    phone: Joi.string().pattern(/^01[0125][0-9]{8}$/).required()
})

export const updateUserValidationSchema = Joi.object({
    userName: Joi.string().min(3).max(30).optional(),
    email: Joi.string().email().optional(),
    recoveryEmail: Joi.string().email().optional(),
    DoB: Joi.date().iso().less("now").optional(),
    phone: Joi.string().pattern(/^01[0125][0-9]{8}$/).optional()
})

export const updatePasswordValidationSchema = Joi.object({
    oldPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required()
        .messages({ "any.only": "Passwords do not match" })
})

// export const resetPasswordValidationSchema = Joi.object({
//     email: Joi.string().email().required(),
//     newPassword: Joi.string().min(6).required(),
//     confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required()
//         .messages({ "any.only": "Passwords do not match" })
// })
