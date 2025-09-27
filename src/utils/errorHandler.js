

export class ErrorHandler extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = isOperational
        this.timestamp = new Date().toISOString()
    }
}

export const createError = {
    badRequest: (message = "Bad Request") => new ErrorHandler(message, 400),
    unauthorized: (message = 'Unauthorized') => new ErrorHandler(message, 401),
    forbidden: (message = 'Forbidden') => new ErrorHandler(message, 403),
    notFound: (message = 'Resource not found') => new ErrorHandler(message, 404),
    conflict: (message = 'Conflict') => new ErrorHandler(message, 409),
    validation: (message = 'Validation Error') => new ErrorHandler(message, 422),
    internal: (message = 'Internal Server Error') => new ErrorHandler(message, 500),
    serviceUnavailable: (message = 'Service Unavailable') => new ErrorHandler(message, 503)
}