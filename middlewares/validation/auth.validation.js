const Joi = require('joi');

// Validation schemas for authentication
const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(6)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password cannot exceed 128 characters',
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one number',
      'any.required': 'Password is required'
    }),
  role: Joi.string()
    .valid('buyer', 'seller', 'admin')
    .default('buyer')
    .messages({
      'any.only': 'Role must be either buyer, seller, or admin'
    }),
  description: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Description cannot exceed 500 characters'
    }),
  skills: Joi.array()
    .items(Joi.string().min(1).max(50))
    .max(10)
    .optional()
    .messages({
      'array.max': 'Cannot have more than 10 skills',
      'string.min': 'Skill name must be at least 1 character',
      'string.max': 'Skill name cannot exceed 50 characters'
    })
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    })
});

// Validation middleware functions
const validateRegister = (req, res, next) => {
  const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  // Replace req.body with validated data
  req.body = value;
  next();
};

const validateLogin = (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  // Replace req.body with validated data
  req.body = value;
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  registerSchema,
  loginSchema
}; 