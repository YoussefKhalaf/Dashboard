import { catchError } from "../../utils/catchError.js";
import { Customer } from "./customer.model.js";



export const addCustomer = catchError(async (req, res, next) => {
    const customer = await Customer.create(req.body)
    res.status(201).json({
        message: "Customer has been created successfully.",
        data:{
            customer
        }
    })
})

// export const updateCustomer = catchError(async(req,res,next)=>{
//     const 
// })