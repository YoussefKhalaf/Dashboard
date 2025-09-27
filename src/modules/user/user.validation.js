import Joi from "joi";
import { User } from "./user.model.js";

// تم تعديل كل Schemas لتكون متوافقة مع الـ validationController
// مع رسائل خطأ أكثر وضوحًا

export const signInValidationSchema = {
    body: Joi.object({
        email: Joi.string().email().required().messages({
            "string.empty": "Email is required.",
            "string.email": "Invalid email format. Please enter a valid email address."
        }),
        password: Joi.string().min(6).required().messages({
            "string.empty": "Password is required.",
            "string.min": "Password must be at least 6 characters long."
        })
    })
};

export const signUpValidationSchema = {
    body: Joi.object({
        userName: Joi.string().min(3).max(30).required().messages({
            "string.min": "Username must be at least 3 characters long.",
            "string.max": "Username cannot exceed 30 characters.",
            "string.empty": "Username is required."
        }),
        email: Joi.string().email().required().messages({
            "string.empty": "Email is required.",
            "string.email": "Invalid email format. Please enter a valid email address."
        }),
        recoveryEmail: Joi.string().email().optional().messages({
            "string.email": "Invalid recovery email format."
        }),
        password: Joi.string()
            .min(8)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            .required()
            .messages({
                'string.empty': 'Password is required.',
                'string.min': 'Password must be at least 8 characters long.',
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
            }),
        DoB: Joi.date().iso().less("now").required().messages({
            "string.empty": "Date of birth is required.",
            "date.less": "Date of birth cannot be in the future.",
            "date.base": "Invalid date format. Please use ISO format (e.g., YYYY-MM-DD)."
        }),
        phone: Joi.string().pattern(/^01[0125][0-9]{8}$/).required().messages({
            "string.empty": "Phone number is required.",
            "string.pattern.base": "Invalid phone number. Please enter a valid Egyptian number."
        })
    }).unknown(true)
};

export const updateUserValidationSchema = {
    body: Joi.object({
        userName: Joi.string().min(3).max(30).optional().messages({
            "string.min": "Username must be at least 3 characters long.",
            "string.max": "Username cannot exceed 30 characters."
        }),
        email: Joi.string().email().optional().messages({
            "string.email": "Invalid email format."
        }),
        recoveryEmail: Joi.string().email().optional().messages({
            "string.email": "Invalid recovery email format."
        }),
        DoB: Joi.date().iso().less("now").optional().messages({
            "date.less": "Date of birth cannot be in the future.",
            "date.base": "Invalid date format."
        }),
        phone: Joi.string().pattern(/^01[0125][0-9]{8}$/).optional().messages({
            "string.pattern.base": "Invalid phone number."
        })
    })
};

export const updatePasswordValidationSchema = {
    body: Joi.object({
        oldPassword: Joi.string().min(6).required().messages({
            "string.empty": "Old password is required.",
            "string.min": "Old password must be at least 6 characters long."
        }),
        newPassword: Joi.string()
            .min(8)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            .required()
            .messages({
                'string.empty': 'New password is required.',
                'string.min': 'New password must be at least 8 characters long.',
                'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
            }),
        confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
            "any.only": "The new password and confirm password do not match."
        })
    })
};

export const forgotPasswordValidationSchema = {
    body: Joi.object({
        email: Joi.string().email().required().messages({
            "string.empty": "Email is required.",
            "string.email": "Invalid email format. Please enter a valid email address."
        })
    })
};

export const resetPasswordValidationSchema = {
    // هذا الجزء للتحقق من الـ parameters في الرابط
    params: Joi.object({
        token: Joi.string().required().messages({
            "string.empty": "Token must be provided in the URL."
        })
    }).required(),

    // هذا الجزء للتحقق من جسم الطلب
    body: Joi.object({
        newPassword: Joi.string()
            .min(8)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            .required()
            .messages({
                'string.empty': 'New password is required.',
                'string.min': 'New password must be at least 8 characters long.',
                'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
            }),
        confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
            "any.only": "The new password and confirm password do not match."
        })
    }).required()
};