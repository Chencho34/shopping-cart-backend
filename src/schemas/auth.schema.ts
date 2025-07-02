import Joi from 'joi'

export const userSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'ingresa email'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'campo requerido',
    'string.min': 'contraseña almenos 6 caracteres'
  }),
  username: Joi.string().min(3).max(30).required()
})
