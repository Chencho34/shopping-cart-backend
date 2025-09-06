import { Response } from 'express'

const successResponse = (res: Response, data: any, message: string, statusCode: number) => {
  const response = {
    success: true,
    message,
    statusCode,
    data
  }

  if (data === null) {
    delete response.data
  }

  return res.status(statusCode).json(response)
}

export {
  successResponse
}
