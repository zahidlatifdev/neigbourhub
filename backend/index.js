require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { connectDB } = require('./config/db')
const { notFound, errorHandler } = require('./middlewares/errorMiddleware')

const userRouter = require('./routes/userRoutes')
const postRouter = require('./routes/postRoute');
const eventRouter = require('./routes/eventRoutes')


const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/user', userRouter)
app.use('/api/post', postRouter)
app.use('/api/event', eventRouter)

app.use(notFound)
app.use(errorHandler)

connectDB(process.env.MONGODB_URI)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
