const { validateCreateGig, validateUpdateGig, validateGigQuery, schemas } = require('../../middlewares/validation');
const { createMockRequest, createMockResponse, createMockNext, createTestGigData } = require('../utils/testHelpers');

describe('Gig Validation Middleware', () => {
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockRes = createMockResponse();
    mockNext = createMockNext();
  });

  describe('validateCreateGig', () => {
    it('should pass validation for valid gig data', () => {
      const validData = createTestGigData();
      const mockReq = createMockRequest(validData);

      validateCreateGig(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(true);
      expect(mockRes.getStatus()).toBeUndefined();
    });

    it('should fail validation for missing title', () => {
      const invalidData = {
        description: 'Test description',
        price: 100,
        category: 'web-development'
      };
      const mockReq = createMockRequest(invalidData);

      validateCreateGig(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Title is required');
    });

    it('should fail validation for short title', () => {
      const invalidData = createTestGigData({ title: 'Test' });
      const mockReq = createMockRequest(invalidData);

      validateCreateGig(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Title must be at least 5 characters long');
    });

    it('should fail validation for missing description', () => {
      const invalidData = {
        title: 'Test Gig',
        price: 100,
        category: 'web-development'
      };
      const mockReq = createMockRequest(invalidData);

      validateCreateGig(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Description is required');
    });

    it('should fail validation for short description', () => {
      const invalidData = createTestGigData({ description: 'Short' });
      const mockReq = createMockRequest(invalidData);

      validateCreateGig(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Description must be at least 20 characters long');
    });

    it('should fail validation for invalid price', () => {
      const invalidData = createTestGigData({ price: 0 });
      const mockReq = createMockRequest(invalidData);

      validateCreateGig(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Price must be at least $1');
    });

    it('should fail validation for invalid category', () => {
      const invalidData = createTestGigData({ category: 'invalid-category' });
      const mockReq = createMockRequest(invalidData);

      validateCreateGig(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Category must be one of the allowed values');
    });

    it('should pass validation with optional fields', () => {
      const validData = createTestGigData({
        deliveryTime: 7,
        revisions: 3
      });
      const mockReq = createMockRequest(validData);

      validateCreateGig(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(true);
    });
  });

  describe('validateUpdateGig', () => {
    it('should pass validation for valid update data', () => {
      const validData = {
        title: 'Updated Gig Title',
        price: 150
      };
      const mockReq = createMockRequest(validData);

      validateUpdateGig(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(true);
    });

    it('should fail validation for invalid price in update', () => {
      const invalidData = {
        price: -10
      };
      const mockReq = createMockRequest(invalidData);

      validateUpdateGig(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Price must be at least $1');
    });

    it('should pass validation for partial update', () => {
      const validData = {
        title: 'New Title'
      };
      const mockReq = createMockRequest(validData);

      validateUpdateGig(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(true);
    });
  });

  describe('validateGigQuery', () => {
    it('should pass validation for valid query parameters', () => {
      const validQuery = {
        category: 'web-development',
        minPrice: 50,
        maxPrice: 500,
        page: 1,
        limit: 10
      };
      const mockReq = createMockRequest({}, {}, validQuery);

      validateGigQuery(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(true);
    });

    it('should fail validation for invalid category in query', () => {
      const invalidQuery = {
        category: 'invalid-category'
      };
      const mockReq = createMockRequest({}, {}, invalidQuery);

      validateGigQuery(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Category must be one of the allowed values');
    });

    it('should fail validation for negative price in query', () => {
      const invalidQuery = {
        minPrice: -10
      };
      const mockReq = createMockRequest({}, {}, invalidQuery);

      validateGigQuery(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Minimum price cannot be negative');
    });

    it('should use default values for missing query parameters', () => {
      const mockReq = createMockRequest({}, {}, {});

      validateGigQuery(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(true);
      expect(mockReq.query.page).toBe(1);
      expect(mockReq.query.limit).toBe(10);
    });
  });

  describe('Validation Schemas', () => {
    it('should have create gig schema with correct structure', () => {
      expect(schemas.gig.create).toBeDefined();
      expect(schemas.gig.create.describe().keys).toHaveProperty('title');
      expect(schemas.gig.create.describe().keys).toHaveProperty('description');
      expect(schemas.gig.create.describe().keys).toHaveProperty('price');
      expect(schemas.gig.create.describe().keys).toHaveProperty('category');
    });

    it('should have update gig schema with correct structure', () => {
      expect(schemas.gig.update).toBeDefined();
      expect(schemas.gig.update.describe().keys).toHaveProperty('title');
      expect(schemas.gig.update.describe().keys).toHaveProperty('price');
    });

    it('should have gig query schema with correct structure', () => {
      expect(schemas.gig.query).toBeDefined();
      expect(schemas.gig.query.describe().keys).toHaveProperty('category');
      expect(schemas.gig.query.describe().keys).toHaveProperty('page');
      expect(schemas.gig.query.describe().keys).toHaveProperty('limit');
    });
  });
}); 