import { auth } from "./middleware/auth.js"
import { validationController } from "./middleware/validation.js"
import { resetPassword } from "./modules/user/user.controller.js"
import { userRouter } from "./modules/user/user.route.js"
import { resetPasswordValidationSchema } from "./modules/user/user.validation.js"



export const bootstrap = (app, express) => {
    app.use("/api/auth", userRouter)
    app.patch("/resetPassword/:token",
        validationController(resetPasswordValidationSchema), resetPassword)
}