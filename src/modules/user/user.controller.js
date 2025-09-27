import { sendEmail } from "../../template/email/email.js";
import { emailHTML } from "../../template/email/emailHTML.js";
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
    const user = await User.findOne({ email })
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

export const forgotPassword = catchError(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({
        $or: [{ email }, { recoveryEmail: email }]
    });

    if (!user) {
        return next(createError.notFound('User not found.'));
    }

    // Generate a secure reset token
    const resetToken = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expires in 1 hour
    });

    // Save the token to the user's document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Construct the reset URL to be sent in the email
    const appUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const resetURL = `${appUrl}/resetPassword/${resetToken}`;

    // Now, call the new flexible sendEmail function
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token',
            html: emailHTML(resetURL, user.userName) // تمرير رابط إعادة التعيين واسم المستخدم
        });

        res.status(200).json({
            message: 'A password reset link has been sent to your email address.',
            data: {
                token: resetToken
            }
        });
    } catch (err) {
        // If the email sending fails, you should clear the token from the user's document
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return next(createError.internal('There was an error sending the email. Please try again later.'));
    }
});

export const resetPassword = catchError(async (req, res, next) => {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    // Verify the token
    let decodedToken;
    try {
        decodedToken = JWT.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        console.log("firstOne")
        return next(createError.forbidden('Invalid or expired password reset token.'));
    }

    // Find the user with the token and check if it has not expired
    const user = await User.findOne({
        _id: decodedToken.id,
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        return next(createError.forbidden('Invalid or expired password reset token.'));
    }

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
        return next(createError.forbidden('The new password and confirm password do not match.'));
    }

    // Hash the new password and save it
    user.password = bcrypt.hashSync(newPassword, +process.env.SALT_NUMBER);

    // Clear the reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
        message: 'Your password has been reset successfully.',
        data: {
            user: user.email,
        },
    });
});
