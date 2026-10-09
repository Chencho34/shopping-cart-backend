import 'dotenv/config'

const getEnvOrThrow = (key: string): string => {
  const value = process.env[key]

  if(!value) throw new Error(`${key} is not defined`)

  return value
}

export const env = {
  NODE_ENV: getEnvOrThrow('NODE_ENV'),
  PORT: parseInt(getEnvOrThrow('PORT'), 10),
  FRONTEND_ORIGIN: getEnvOrThrow('FRONTEND_ORIGIN'),
  DB_HOST: getEnvOrThrow('DB_HOST'),
  DB_PORT: parseInt(getEnvOrThrow('DB_PORT'), 10),
  DB_NAME: getEnvOrThrow('DB_NAME'),
  DB_USER: getEnvOrThrow('DB_USER'),
  DB_PASSWORD: getEnvOrThrow('DB_PASSWORD'),
  JWT_SECRET: getEnvOrThrow('JWT_SECRET'),
  JWT_REFRESH_SECRET: getEnvOrThrow('JWT_REFRESH_SECRET')
} as const
