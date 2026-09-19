import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import sequelize from './config/db'
import userRoutes from './routes/user.routes'
import productRoutes from './routes/products.routes'
import authRoutes from './routes/auth.routes'
import cartRoutes from './routes/cart.routes'
import { errorHandler } from './middlewares/errorHandler'

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

const PORT = process.env.PORT || 3000

app.get('/api', (_, res) => {
  res.send('Hello world!')
})

app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', productRoutes)
app.use('/api', cartRoutes)

app.use(errorHandler)


sequelize.authenticate()
  .then(() => {
    console.log('Database connected')
    return sequelize.sync({ force: false })
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}/api`)
    })
  })
  .catch((err) => {
    console.error('Database connection failed:', err)
    setTimeout(() => {
      console.log('Retrying database connection...')
      process.exit(1)
    }, 5000)
  })
