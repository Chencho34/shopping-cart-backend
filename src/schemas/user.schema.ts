import Joi from 'joi'

export const updateUserSelfSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  email: Joi.string().email().trim().lowercase(),
  password: Joi.string().min(8).max(128)
  // Nada de 'role' aquí. Nunca.
})
  .min(1) // que no llegue un body vacío {}
  .options({ stripUnknown: true }) // ignora silenciosamente cualquier campo extra (incluido 'role')
