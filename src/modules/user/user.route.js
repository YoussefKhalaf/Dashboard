import { Router } from "express";
import { getUser, signin, signup, updateUser, profile, updatePassword, resetPassword, forgotPassword } from "./user.controller.js";
import { auth } from "../../middleware/auth.js";
import { validationController } from "../../middleware/validation.js";
import { forgotPasswordValidationSchema, resetPasswordValidationSchema, signInValidationSchema, signUpValidationSchema, updatePasswordValidationSchema, updateUserValidationSchema } from "./user.validation.js";

export const userRouter = Router()

userRouter.post('/signup', validationController(signUpValidationSchema), signup)
userRouter.post('/signin', validationController(signInValidationSchema), signin)

userRouter.patch('/updateUser', auth(["Company_HR"]), validationController(updateUserValidationSchema), updateUser)

userRouter.get('/getUser/:id', auth(["Company_HR"]), getUser)

userRouter.get('/profile', auth(["Company_HR"]), profile)

userRouter.patch('/updatePassword', auth(["Company_HR"]), validationController(updatePasswordValidationSchema), updatePassword)

userRouter.post('/forgotPassword', validationController(forgotPasswordValidationSchema), forgotPassword)

userRouter.patch("/resetPassword/:token",
    validationController(resetPasswordValidationSchema), resetPassword)
