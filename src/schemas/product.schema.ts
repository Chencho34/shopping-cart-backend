import Joi from 'joi'

const categories = ['electronics', 'gaming', 'audio', 'video', 'smartphones', 'smart home']

export const createProductSchema = Joi.object({
  name: Joi.string().min(6).required().messages({
    'string.empty': '{{#label}} is not allowed to be empty'
  }),
  description: Joi.string().required().messages({
    'string.empty': '{{#label}} is not allowed to be empty'
  }),
  category: Joi.string().valid(...categories).required().messages({
    'string.empty': '{{#label}} is not allowed to be empty'
  }),
  price: Joi.number().integer().positive().required().messages({
    'number.base': 'Please provide a valid number.',
    'number.integer': 'The value must be an integer.',
    'any.required': 'This field is required.'
  }),
  discount: Joi.number().min(0).max(100).optional().messages({
    'number.integer': 'The value must be an integer.'
  }),
  stock: Joi.number().integer().positive().required().messages({
    'number.base': 'Please provide a valid number.',
    'number.integer': 'The value must be an integer.',
    'any.required': 'This field is required.'
  }),
  imageUrl: Joi.string().uri().pattern(/\.(jpg|jpeg|png|webp)$/).required().messages({
    'string.empty': '{{#label}} is not allowed to be empty',
    'string.uri': '{{#label}} provide a valid URL format.',
    'string.pattern.base': 'Image must be a valid URL with .jpg, .jpeg, .png, or .webp extension'
  })
})

export const updateProductSchema = Joi.object({
  id: Joi.number().integer().required().messages({
    'any.required': '{{#label}} this field is required.',
    'number.integer': '{{#label}} the value must be an integer.'
  }),
  name: Joi.string().min(6).optional().messages({
    'string.empty': '{{#label}} is not allowed to be empty'
  }),
  description: Joi.string().optional().messages({
    'string.empty': '{{#label}} is not allowed to be empty'
  }),
  category: Joi.string().valid(...categories).optional().messages({
    'string.empty': '{{#label}} is not allowed to be empty'
  }),
  price: Joi.number().integer().positive().optional().messages({
    'number.base': 'Please provide a valid number.',
    'number.integer': 'The value must be an integer.',
    'any.required': 'This field is required.'
  }),
  discount: Joi.number().min(0).max(100).optional().messages({
    'number.base': 'The value must be a number.',
    'number.min': 'Discount cannot be negative.',
    'number.max': 'Discount cannot be greater than 100.'  
  }),
  stock: Joi.number().integer().positive().optional().messages({
    'number.base': 'Please provide a valid number.',
    'number.integer': 'The value must be an integer.',
    'any.required': 'This field is required.'
  }),
  imageUrl: Joi.string().uri().pattern(/\.(jpg|jpeg|png|webp)$/).optional().messages({
    'string.empty': '{{#label}} is not allowed to be empty',
    'string.uri': '{{#label}} provide a valid URL format.',
    'string.pattern.base': 'Image must be a valid URL with .jpg, .jpeg, .png, or .webp extension'
  })
})
