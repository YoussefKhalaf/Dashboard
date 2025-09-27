

export const catchError = (fn)=>{
    return (req,res,next)=>{
        Promise.resolve(fn(req,res,next)).catch((error)=>{
            console.log(`Error is ${req.method} ${req.originalUrl}: `,error)
            next(error)
        })
    }
}