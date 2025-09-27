
export const globalError= (err,req,res,next)=>{
    res.status(err.statusCode || 500).json({
        message: err.message || "internal server error",
        data:{
            status: err.statusCode || 500,
            stack: err.stack,
            timestamp: new Date().toISOString()
        }
    })
}