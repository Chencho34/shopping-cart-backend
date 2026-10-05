import Joi from 'joi'

const emailField = Joi.string().trim().lowercase().email().max(254).required().messages({
  'any.required': '{#label} is required',
  'string.base': '{#label} must be a string',
  'string.empty': '{#label} is not allowed to be empty',
  'string.email': '{#label} must be a valid email',
  'string.max': '{#label} must be at most {#limit} characters'
})

const passwordField = Joi.string().min(8).max(72).pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/).required().messages({
  'any.required': '{#label} is required',
  'string.base': '{#label} must be a string',
  'string.empty': '{#label} is not allowed to be empty',
  'string.min': '{#label} must be at least {#limit} characters',
  'string.max': '{#label} must be at most {#limit} characters',
  'string.pattern.base': '{#label} must contain at least one letter and one number'
})

const usernameField = Joi.string().trim().min(3).max(20).pattern(/^[a-zA-Z0-9_]+$/).required().messages({
  'any.required': '{#label} is required',
  'string.base': '{#label} must be a string',
  'string.empty': '{#label} is not allowed to be empty',
  'string.min': '{#label} must be at least {#limit} characters',
  'string.max': '{#label} must be at most {#limit} characters',
  'string.pattern.base': '{#label} can only contain letters, numbers and underscores'
})

export const signupSchema = Joi.object({
  email: emailField,
  password: passwordField,
  username: usernameField
})

export const loginSchema = Joi.object({
  email: emailField,
  password: Joi.string().min(6).required().messages({
    'any.required': '{{#label}} is required',
    'string.base': '{{#label}} must be a string',
    'string.empty': '{{#label}} is not allowed to be empty'
  })
})
