import { userRouter } from "./modules/user/user.route.js"



export const bootstrap = (app, express) => {
    app.use("/api/auth",userRouter)
}