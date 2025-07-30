const { validateCreateOrder, validateUpdateOrderStatus, validateOrderQuery, validateDelivery, schemas } = require('../../middlewares/validation');
const { createMockRequest, createMockResponse, createMockNext, createTestOrderData } = require('../utils/testHelpers');

describe('Order Validation Middleware', () => {
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockRes = createMockResponse();
    mockNext = createMockNext();
  });

  describe('validateCreateOrder', () => {
    it('should pass validation for valid order data', () => {
      const validData = createTestOrderData();
      const mockReq = createMockRequest(validData);

      validateCreateOrder(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(true);
      expect(mockRes.getStatus()).toBeUndefined();
    });

    it('should fail validation for missing gigId', () => {
      const invalidData = {
        requirements: 'Test requirements'
      };
      const mockReq = createMockRequest(invalidData);

      validateCreateOrder(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Gig ID is required');
    });

    it('should fail validation for short requirements', () => {
      const invalidData = createTestOrderData({ requirements: 'Short' });
      const mockReq = createMockRequest(invalidData);

      validateCreateOrder(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Requirements must be at least 10 characters long');
    });

    it('should pass validation with optional fields', () => {
      const validData = createTestOrderData({
        deliveryTime: 7
      });
      const mockReq = createMockRequest(validData);

      validateCreateOrder(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(true);
    });

    it('should fail validation for invalid delivery time', () => {
      const invalidData = createTestOrderData({
        deliveryTime: 400
      });
      const mockReq = createMockRequest(invalidData);

      validateCreateOrder(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Delivery time cannot exceed 365 days');
    });
  });

  describe('validateUpdateOrderStatus', () => {
    it('should pass validation for valid status update', () => {
      const validData = {
        status: 'in-progress',
        note: 'Starting work on the project'
      };
      const mockReq = createMockRequest(validData);

      validateUpdateOrderStatus(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(true);
    });

    it('should fail validation for missing status', () => {
      const invalidData = {
        note: 'Test note'
      };
      const mockReq = createMockRequest(invalidData);

      validateUpdateOrderStatus(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Status is required');
    });

    it('should fail validation for invalid status', () => {
      const invalidData = {
        status: 'invalid-status'
      };
      const mockReq = createMockRequest(invalidData);

      validateUpdateOrderStatus(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Status must be pending, in-progress, completed, or cancelled');
    });

    it('should fail validation for long note', () => {
      const invalidData = {
        status: 'completed',
        note: 'a'.repeat(501)
      };
      const mockReq = createMockRequest(invalidData);

      validateUpdateOrderStatus(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Note cannot exceed 500 characters');
    });

    it('should pass validation for all valid statuses', () => {
      const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
      
      validStatuses.forEach(status => {
        const validData = { status };
        const mockReq = createMockRequest(validData);
        const mockRes = createMockResponse();
        const mockNext = createMockNext();

        validateUpdateOrderStatus(mockReq, mockRes, mockNext);

        expect(mockNext.wasCalled()).toBe(true);
      });
    });
  });

  describe('validateOrderQuery', () => {
    it('should pass validation for valid query parameters', () => {
      const validQuery = {
        status: 'pending',
        page: 1,
        limit: 10
      };
      const mockReq = createMockRequest({}, {}, validQuery);

      validateOrderQuery(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(true);
    });

    it('should fail validation for invalid status in query', () => {
      const invalidQuery = {
        status: 'invalid-status'
      };
      const mockReq = createMockRequest({}, {}, invalidQuery);

      validateOrderQuery(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Status must be pending, in-progress, completed, or cancelled');
    });

    it('should fail validation for invalid page number', () => {
      const invalidQuery = {
        page: 0
      };
      const mockReq = createMockRequest({}, {}, invalidQuery);

      validateOrderQuery(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Page must be at least 1');
    });

    it('should use default values for missing query parameters', () => {
      const mockReq = createMockRequest({}, {}, {});

      validateOrderQuery(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(true);
      expect(mockReq.query.page).toBe(1);
      expect(mockReq.query.limit).toBe(10);
    });
  });

  describe('validateDelivery', () => {
    it('should pass validation for valid delivery data', () => {
      const validData = {
        message: 'Project completed! Here are the final files.'
      };
      const mockReq = createMockRequest(validData);

      validateDelivery(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(true);
    });

    it('should pass validation for empty delivery data', () => {
      const validData = {};
      const mockReq = createMockRequest(validData);

      validateDelivery(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(true);
    });

    it('should fail validation for long message', () => {
      const invalidData = {
        message: 'a'.repeat(501)
      };
      const mockReq = createMockRequest(invalidData);

      validateDelivery(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Message cannot exceed 500 characters');
    });
  });

  describe('Validation Schemas', () => {
    it('should have create order schema with correct structure', () => {
      expect(schemas.order.create).toBeDefined();
      expect(schemas.order.create.describe().keys).toHaveProperty('gigId');
      expect(schemas.order.create.describe().keys).toHaveProperty('requirements');
    });

    it('should have update order status schema with correct structure', () => {
      expect(schemas.order.updateStatus).toBeDefined();
      expect(schemas.order.updateStatus.describe().keys).toHaveProperty('status');
      expect(schemas.order.updateStatus.describe().keys).toHaveProperty('note');
    });

    it('should have order query schema with correct structure', () => {
      expect(schemas.order.query).toBeDefined();
      expect(schemas.order.query.describe().keys).toHaveProperty('status');
      expect(schemas.order.query.describe().keys).toHaveProperty('page');
      expect(schemas.order.query.describe().keys).toHaveProperty('limit');
    });

    it('should have delivery schema with correct structure', () => {
      expect(schemas.order.delivery).toBeDefined();
      expect(schemas.order.delivery.describe().keys).toHaveProperty('message');
    });
  });
}); 