import { Router } from "express";
import { getUser, signin, signup, updateUser, profile, updatePassword } from "./user.controller.js";
import { auth } from "../../middleware/auth.js";
import { validationController } from "../../middleware/validation.js";
import { signInValidationSchema, signUpValidationSchema, updatePasswordValidationSchema, updateUserValidationSchema } from "./user.validation.js";

export const userRouter = Router()

userRouter.post('/signup', validationController(signUpValidationSchema), signup)
userRouter.post('/signin', validationController(signInValidationSchema), signin)
userRouter.patch('/updateUser', auth(["User", "Company_HR"]), validationController(updateUserValidationSchema), updateUser)
userRouter.get('/getUser/:id', auth(["Company_HR"]), getUser)
userRouter.get('/profile', auth(["User", "Company_HR"]), profile)
userRouter.patch('/updatePassword', auth(["User", "Company_HR"]), validationController(updatePasswordValidationSchema), updatePassword)