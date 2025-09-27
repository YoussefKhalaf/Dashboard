import { model, Schema } from "mongoose";

const schema = new Schema({
    userName: {
        type: String,
        trim: true,
        minLength: 4
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    recoveryEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    DoB: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['User', 'Company_HR'],
        default: 'User'
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, {
    timestamps: true,
    versionKey: false
})

export const User = model('User', schema)