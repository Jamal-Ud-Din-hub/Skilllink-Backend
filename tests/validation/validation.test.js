// Import all validation tests
require('./auth.validation.test');
require('./gig.validation.test');
require('./order.validation.test');

describe('Validation Test Suite', () => {
  it('should have all validation modules properly configured', () => {
    const validation = require('../../middlewares/validation');
    
    // Check auth validation
    expect(validation.validateRegister).toBeDefined();
    expect(validation.validateLogin).toBeDefined();
    
    // Check gig validation
    expect(validation.validateCreateGig).toBeDefined();
    expect(validation.validateUpdateGig).toBeDefined();
    expect(validation.validateGigQuery).toBeDefined();
    
    // Check order validation
    expect(validation.validateCreateOrder).toBeDefined();
    expect(validation.validateUpdateOrderStatus).toBeDefined();
    expect(validation.validateOrderQuery).toBeDefined();
    expect(validation.validateDelivery).toBeDefined();
    
    // Check schemas
    expect(validation.schemas).toBeDefined();
    expect(validation.schemas.auth).toBeDefined();
    expect(validation.schemas.gig).toBeDefined();
    expect(validation.schemas.order).toBeDefined();
  });
}); 