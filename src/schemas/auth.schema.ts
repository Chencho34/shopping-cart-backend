import Joi from 'joi'

export const signupSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': '{{#label}} is not allowed to be empty',
    'string.email': '{{#label}} must be a valid email'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': '{{#label}} is not allowed to be empty',
    'string.min': '{{#label}} must be at least {{#limit}} characters'
  }),
  username: Joi.string().min(3).max(20).required().messages({
    'string.empty': '{{#label}} is not allowed to be empty',
    'string.min': '{{#label}} must be at least {{#limit}} characters'
  })
})

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': '{{#label}} is not allowed to be empty',
    'string.email': '{{#label}} must be a valid email'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': '{{#label}} is not allowed to be empty',
    'string.min': '{{#label}} must be at least {{#limit}} characters'
  })
})
