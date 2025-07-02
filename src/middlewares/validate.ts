import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

const validationOptions: Joi.BaseValidationOptions = {
  abortEarly: false,
  allowUnknown: false,
  stripUnknown: false
}

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, validationOptions)
    
    if (error) {
      const errorMessages = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message
      }))

      res.status(400).json({
        message: 'Invalid request data',
        error: errorMessages
      })
      return
    }
    next()
  }
}
