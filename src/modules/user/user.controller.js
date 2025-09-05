import { catchError } from "../../utils/catchError.js";
import { createError } from "../../utils/errorHandler.js";
import { User } from "./user.model.js";
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'

export const signup = catchError(async (req, res, next) => {
    const { userName, email, recoveryEmail, password, DoB, phone } = req.body
    const isExist = await User.findOne({
        $or: [
            { email },
            { userName },
            { phone }
        ]
    })
    if (isExist) {
        return next(createError.conflict("User is already exist."))
    }
    const hashPassword = bcrypt.hashSync(password, +process.env.SALT_NUMBER)
    const data = {
        ...req.body,
        password: hashPassword
    }
    const user = await User.create(data)
    const resData = {
        userName: user.userName,
        email: user.email,
        recoveryEmail: user.recoveryEmail,
        phone: user.phone,
        DoB: user.DoB
    }
    return res.status(201).json({
        message: "User has been created successfully.",
        data: {
            user: resData
        }
    })
})

export const signin = catchError(async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({email})
    if (!user) {
        return next(createError.unauthorized("User not found."))
    }
    const isMatch = bcrypt.compareSync(password, user.password)
    if (!isMatch) {
        return next(createError.unauthorized('User not found.'))
    }
    const payload = {
        id: user._id
    }
    const token = JWT.sign(payload, process.env.JWT_SECRET)
    if (!token) {
        return next(createError.internal('Token has not been created.'))
    }
    res.status(200).json({
        message: "Logged in successfuly.",
        data: {
            token
        }
    })
})

export const updateUser = catchError(async (req, res, next) => {
    const { userName, email, recoveryEmail, password, DoB, phone } = req.body
    const isExist = await User.findOne({
        $or: [
            { email },
            { phone },
            { userName }
        ],
        _id: {
            $ne: req.user.id
        }
    })
    if (isExist) {
        return next(createError.conflict("User is already exist"))
    }
    const updatedUser = await User.findOneAndUpdate({ _id: req.user.id }, req.body, { new: true })
    return res.status(200).json({
        message: "User has been updated successfully.",
        data: {
            user: updatedUser
        }
    })
})

export const profile = catchError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) {
        return next(createError.notFound("User not found."))
    }
    res.status(200).json({
        message: "User has been retrieved successfully.",
        data: {
            user
        }
    })
})

export const getUser = catchError(async (req, res, next) => {
    const user = await User.findById({ _id: req.params.id }).select("-password")
    if (!user) {
        return next(createError.notFound("User not found."))
    }
    res.status(200).json({
        message: "User has been retrieved successfully.",
        data: {
            user
        }
    })
})

export const updatePassword = catchError(async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body
    const isMatch = bcrypt.compareSync(oldPassword, req.user.password)
    if (!isMatch) {
        return next(createError.forbidden("Old password is incorrect."))
    }
    if (newPassword !== confirmPassword) {
        return next(createError.forbidden("The new password and The confirm password are not have the same value."))
    }
    const hashPassword = bcrypt.hashSync(newPassword, +process.env.SALT_NUMBER)
    const updatedUser = await User.findOneAndUpdate({ _id: req.user.id }, { password: hashPassword })
    if (!updatedUser) {
        return next(createError.notFound("User not found."))
    }
    res.status(200).json({
        message: "Password has been updated successfully.",
        data: {
            user: updatedUser
        }
    })
})

