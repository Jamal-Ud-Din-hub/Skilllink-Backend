// Export all validation middleware
const authValidation = require('./auth.validation');
const gigValidation = require('./gig.validation');
const orderValidation = require('./order.validation');

module.exports = {
  // Auth validation
  validateRegister: authValidation.validateRegister,
  validateLogin: authValidation.validateLogin,
  
  // Gig validation
  validateCreateGig: gigValidation.validateCreateGig,
  validateUpdateGig: gigValidation.validateUpdateGig,
  validateGigQuery: gigValidation.validateGigQuery,
  
  // Order validation
  validateCreateOrder: orderValidation.validateCreateOrder,
  validateUpdateOrderStatus: orderValidation.validateUpdateOrderStatus,
  validateOrderQuery: orderValidation.validateOrderQuery,
  validateDelivery: orderValidation.validateDelivery,
  
  // Schemas for testing
  schemas: {
    auth: {
      register: authValidation.registerSchema,
      login: authValidation.loginSchema
    },
    gig: {
      create: gigValidation.createGigSchema,
      update: gigValidation.updateGigSchema,
      query: gigValidation.gigQuerySchema
    },
    order: {
      create: orderValidation.createOrderSchema,
      updateStatus: orderValidation.updateOrderStatusSchema,
      query: orderValidation.orderQuerySchema,
      delivery: orderValidation.deliverySchema
    }
  }
}; 