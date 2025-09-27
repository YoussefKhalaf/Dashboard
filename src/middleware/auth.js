import { User } from "../modules/user/user.model.js";
import { createError } from "../utils/errorHandler.js";
import JWT from 'jsonwebtoken'



export const auth = (roles = []) => {
    return async (req, res, next) => {
        const { authorization } = req.headers
        if (!authorization) {
            return next(createError.unauthorized('Token has not been provided.'))
        }
        if (!authorization.startsWith(process.env.BEARER_KEY)) {
            return next(createError.unauthorized('Invalid bearer key.'))
        }
        const token = authorization.split(" ")[1]
        if (!token) {
            return next(createError.unauthorized('Invalid token.'))
        }
        const decoded = JWT.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return next(createError.unauthorized('Invalid token.'))
        }
        const user = await User.findById(decoded.id)
        if (!user) {
            return next(createError.unauthorized("User not found."));
        }
        if (!roles.includes(user.role)) {
            return next(createError.forbidden('You can not access this endpoint.'))
        }
        req.user = user
        next()
    }
}