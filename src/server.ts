import app from './index'
import { env } from './config/env'
import sequelize from './config/db'

async function startServer () {
  try {
    await sequelize.authenticate()
    console.log('Database connected')

    await sequelize.sync({ force: false })

    app.listen(env.PORT, () => {
      console.log(
        `Server is running on http://localhost:${env.PORT}/api`
      )
    })
  } catch (err) {
    console.error('Database connection failed:', err)
    process.exit(1)
  }
}

startServer()
