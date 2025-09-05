import { config } from 'dotenv'
import { dbConnection } from './config/dbConnection.js'
import app from './src/app.js'
config()
dbConnection()
const port = process.env.PORT


process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at: ', promise, 'reason: ', reason)
    process.exit(1)
})

process.on('uncaughtException', (error) => {
    console.log('Uncaught Exception at: ', error)
    process.exit(1)
})

const server = app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
    console.log(`Health check: 
        http://localhost:${port}/health`)
})

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server')
    server.close(() => {
        console.log('HTTP server closed')
    })
})

export default server
