import { model, Schema } from "mongoose";


const schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["Online", "Offline"]
    }
}, {
    timestamps: true,
    versionKey: false
})

export const Customer = model("Customer", schema)