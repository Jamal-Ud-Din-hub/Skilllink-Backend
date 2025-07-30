const Joi = require('joi');

// Validation schemas for gigs
const createGigSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 5 characters long',
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Title is required'
    }),
  description: Joi.string()
    .min(20)
    .max(2000)
    .required()
    .messages({
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 20 characters long',
      'string.max': 'Description cannot exceed 2000 characters',
      'any.required': 'Description is required'
    }),
  price: Joi.number()
    .min(1)
    .max(10000)
    .required()
    .messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price must be at least $1',
      'number.max': 'Price cannot exceed $10,000',
      'any.required': 'Price is required'
    }),
  category: Joi.string()
    .valid('web-development', 'mobile-development', 'design', 'writing', 'marketing', 'video-animation', 'music-audio', 'business', 'data', 'photography')
    .required()
    .messages({
      'any.only': 'Category must be one of the allowed values',
      'any.required': 'Category is required'
    }),
  deliveryTime: Joi.number()
    .min(1)
    .max(365)
    .optional()
    .messages({
      'number.base': 'Delivery time must be a number',
      'number.min': 'Delivery time must be at least 1 day',
      'number.max': 'Delivery time cannot exceed 365 days'
    }),
  revisions: Joi.number()
    .min(0)
    .max(10)
    .optional()
    .messages({
      'number.base': 'Revisions must be a number',
      'number.min': 'Revisions cannot be negative',
      'number.max': 'Revisions cannot exceed 10'
    })
});

const updateGigSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Title must be at least 5 characters long',
      'string.max': 'Title cannot exceed 100 characters'
    }),
  description: Joi.string()
    .min(20)
    .max(2000)
    .optional()
    .messages({
      'string.min': 'Description must be at least 20 characters long',
      'string.max': 'Description cannot exceed 2000 characters'
    }),
  price: Joi.number()
    .min(1)
    .max(10000)
    .optional()
    .messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price must be at least $1',
      'number.max': 'Price cannot exceed $10,000'
    }),
  category: Joi.string()
    .valid('web-development', 'mobile-development', 'design', 'writing', 'marketing', 'video-animation', 'music-audio', 'business', 'data', 'photography')
    .optional()
    .messages({
      'any.only': 'Category must be one of the allowed values'
    }),
  deliveryTime: Joi.number()
    .min(1)
    .max(365)
    .optional()
    .messages({
      'number.base': 'Delivery time must be a number',
      'number.min': 'Delivery time must be at least 1 day',
      'number.max': 'Delivery time cannot exceed 365 days'
    }),
  revisions: Joi.number()
    .min(0)
    .max(10)
    .optional()
    .messages({
      'number.base': 'Revisions must be a number',
      'number.min': 'Revisions cannot be negative',
      'number.max': 'Revisions cannot exceed 10'
    })
});

const gigQuerySchema = Joi.object({
  category: Joi.string()
    .valid('web-development', 'mobile-development', 'design', 'writing', 'marketing', 'video-animation', 'music-audio', 'business', 'data', 'photography')
    .optional()
    .messages({
      'any.only': 'Category must be one of the allowed values'
    }),
  minPrice: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Minimum price must be a number',
      'number.min': 'Minimum price cannot be negative'
    }),
  maxPrice: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Maximum price must be a number',
      'number.min': 'Maximum price cannot be negative'
    }),
  page: Joi.number()
    .min(1)
    .default(1)
    .optional()
    .messages({
      'number.base': 'Page must be a number',
      'number.min': 'Page must be at least 1'
    }),
  limit: Joi.number()
    .min(1)
    .max(100)
    .default(10)
    .optional()
    .messages({
      'number.base': 'Limit must be a number',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    })
});

// Validation middleware functions
const validateCreateGig = (req, res, next) => {
  const { error, value } = createGigSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  req.body = value;
  next();
};

const validateUpdateGig = (req, res, next) => {
  const { error, value } = updateGigSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  req.body = value;
  next();
};

const validateGigQuery = (req, res, next) => {
  const { error, value } = gigQuerySchema.validate(req.query, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  req.query = value;
  next();
};

module.exports = {
  validateCreateGig,
  validateUpdateGig,
  validateGigQuery,
  createGigSchema,
  updateGigSchema,
  gigQuerySchema
}; 