import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import sequelize from './config/db'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

const PORT = process.env.PORT || 3000

app.get('/api', (_, res) => {
  res.send('Hello world!')
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api`)
})

sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully')
  })
  .catch((err) => {
    console.error('Database connection failed:', err)
  })
