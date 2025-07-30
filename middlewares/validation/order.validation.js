const Joi = require('joi');

// Validation schemas for orders
const createOrderSchema = Joi.object({
  gigId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Gig ID is required',
      'any.required': 'Gig ID is required'
    }),
  requirements: Joi.string()
    .min(10)
    .max(2000)
    .optional()
    .messages({
      'string.min': 'Requirements must be at least 10 characters long',
      'string.max': 'Requirements cannot exceed 2000 characters'
    }),
  deliveryTime: Joi.number()
    .min(1)
    .max(365)
    .optional()
    .messages({
      'number.base': 'Delivery time must be a number',
      'number.min': 'Delivery time must be at least 1 day',
      'number.max': 'Delivery time cannot exceed 365 days'
    })
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'in-progress', 'completed', 'cancelled')
    .required()
    .messages({
      'any.only': 'Status must be pending, in-progress, completed, or cancelled',
      'any.required': 'Status is required'
    }),
  note: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Note cannot exceed 500 characters'
    })
});

const orderQuerySchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'in-progress', 'completed', 'cancelled')
    .optional()
    .messages({
      'any.only': 'Status must be pending, in-progress, completed, or cancelled'
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

const deliverySchema = Joi.object({
  message: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Message cannot exceed 500 characters'
    })
});

// Validation middleware functions
const validateCreateOrder = (req, res, next) => {
  const { error, value } = createOrderSchema.validate(req.body, { abortEarly: false });
  
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

const validateUpdateOrderStatus = (req, res, next) => {
  const { error, value } = updateOrderStatusSchema.validate(req.body, { abortEarly: false });
  
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

const validateOrderQuery = (req, res, next) => {
  const { error, value } = orderQuerySchema.validate(req.query, { abortEarly: false });
  
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

const validateDelivery = (req, res, next) => {
  const { error, value } = deliverySchema.validate(req.body, { abortEarly: false });
  
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

module.exports = {
  validateCreateOrder,
  validateUpdateOrderStatus,
  validateOrderQuery,
  validateDelivery,
  createOrderSchema,
  updateOrderStatusSchema,
  orderQuerySchema,
  deliverySchema
}; 