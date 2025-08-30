import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import sequelize from './config/db'
import userRoutes from './routes/user.routes'
import productRoutes from './routes/products.routes'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

const PORT = process.env.PORT || 3000

app.get('/api', (_, res) => {
  res.send('Hello world!')
})


app.use('/api', userRoutes)
app.use('/api', productRoutes)

// sequelize.authenticate()
//   .then(() => {
//     console.log('Database connected')
//     sequelize.sync() // Set to true to drop and recreate tables
//     sequelize.drop() // Uncomment to drop the database tables
//     app.listen(PORT, () => {
//       console.log(`Server is running on http://localhost:${PORT}/api`)
//     })
//   })
//   .catch((err) => {
//     console.error('Database connection failed:', err)
//   })

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
    // Reintentar después de 5 segundos
    setTimeout(() => {
      console.log('Retrying database connection...')
      process.exit(1)
    }, 5000)
  })
