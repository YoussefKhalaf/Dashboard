import joi from 'joi'

const dataMethods = ["body", "params", "query", "headers", "file", "files"]

export const generalField = {
    headers: joi.object({
        'cache-control': joi.string(),
        'postman-token': joi.string(),
        host: joi.string(),
        'user-agent': joi.string(),
        accept: joi.string(),
        'accept-encoding': joi.string(),
        connection: joi.string(),
        authorization: joi.string()
            .regex(/^Bearer\s+[\w-]+\.[\w-]+\.[\w-]+$/)
            .required()
    }).unknown(true)
}


export const validationController = (schema) => {
    return (req, res, next) => {
        const validationErrors = []
        dataMethods.forEach((key) => {
            if (schema[key]) {
                const validationRes = schema[key].validate((req[key]), { abortEarly: false })
                if (validationRes.error) {
                    validationErrors.push(...validationRes.error.details)
                }
            }
        })
        if (validationErrors.length) {
            return res.status(400).json({
                message: "error",
                data: {
                    validationErrors
                }
            })
        }
        return next()
    }
}