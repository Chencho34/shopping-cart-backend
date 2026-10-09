import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import userRoutes from './routes/user.routes'
import productRoutes from './routes/products.routes'
import authRoutes from './routes/auth.routes'
import cartRoutes from './routes/cart.routes'
import { errorHandler } from './middlewares/errorHandler'
import { notFound } from './middlewares/notFound'
import cookieParser from 'cookie-parser'

const app = express()
app.use(cookieParser())
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/health', (_, res) => res.status(200).json({ status: 'ok' }))
app.get('/api', (_, res) => res.send('Hello world!'))

app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', productRoutes)
app.use('/api', cartRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
