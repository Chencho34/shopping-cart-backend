import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'
import { AppError } from '../utils'

const validationOptions: Joi.ValidationOptions = {
  abortEarly: false,
  allowUnknown: false,
  stripUnknown: true,
  errors: {
    wrap: {
      label: false
    }
  }
}

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body ?? {} , validationOptions)

    if (error) {
      const errorMessages = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message
      }))

      next(new AppError('Invalid request data', 400, 'VALIDATION_ERROR', errorMessages))
      
      return
    }

    req.body = value
    next()
  }
}
