const { validateRegister, validateLogin, schemas } = require('../../middlewares/validation');
const { createMockRequest, createMockResponse, createMockNext, createTestUserData } = require('../utils/testHelpers');

describe('Auth Validation Middleware', () => {
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockRes = createMockResponse();
    mockNext = createMockNext();
  });

  describe('validateRegister', () => {
    it('should pass validation for valid registration data', () => {
      const validData = createTestUserData();
      const mockReq = createMockRequest(validData);

      validateRegister(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(true);
      expect(mockRes.getStatus()).toBeUndefined();
    });

    it('should fail validation for missing name', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123'
      };
      const mockReq = createMockRequest(invalidData);

      validateRegister(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Name is required');
    });

    it('should fail validation for short name', () => {
      const invalidData = createTestUserData({ name: 'J' });
      const mockReq = createMockRequest(invalidData);

      validateRegister(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Name must be at least 2 characters long');
    });

    it('should fail validation for invalid email', () => {
      const invalidData = createTestUserData({ email: 'invalid-email' });
      const mockReq = createMockRequest(invalidData);

      validateRegister(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Please provide a valid email address');
    });

    it('should fail validation for weak password', () => {
      const invalidData = createTestUserData({ password: 'password123' });
      const mockReq = createMockRequest(invalidData);

      validateRegister(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Password must contain at least one lowercase letter, one uppercase letter, and one number');
    });

    it('should fail validation for invalid role', () => {
      const invalidData = createTestUserData({ role: 'invalid_role' });
      const mockReq = createMockRequest(invalidData);

      validateRegister(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Role must be either buyer, seller, or admin');
    });

    it('should fail validation for too many skills', () => {
      const invalidData = createTestUserData({
        skills: ['Skill1', 'Skill2', 'Skill3', 'Skill4', 'Skill5', 'Skill6', 'Skill7', 'Skill8', 'Skill9', 'Skill10', 'Skill11']
      });
      const mockReq = createMockRequest(invalidData);

      validateRegister(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Cannot have more than 10 skills');
    });

    it('should pass validation with default role', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123'
      };
      const mockReq = createMockRequest(validData);

      validateRegister(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(true);
      expect(mockReq.body.role).toBe('buyer');
    });
  });

  describe('validateLogin', () => {
    it('should pass validation for valid login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123'
      };
      const mockReq = createMockRequest(validData);

      validateLogin(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(true);
      expect(mockRes.getStatus()).toBeUndefined();
    });

    it('should fail validation for missing email', () => {
      const invalidData = {
        password: 'Password123'
      };
      const mockReq = createMockRequest(invalidData);

      validateLogin(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Email is required');
    });

    it('should fail validation for missing password', () => {
      const invalidData = {
        email: 'test@example.com'
      };
      const mockReq = createMockRequest(invalidData);

      validateLogin(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Password is required');
    });

    it('should fail validation for invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'Password123'
      };
      const mockReq = createMockRequest(invalidData);

      validateLogin(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Please provide a valid email address');
    });

    it('should fail validation for empty fields', () => {
      const invalidData = {
        email: '',
        password: ''
      };
      const mockReq = createMockRequest(invalidData);

      validateLogin(mockReq, mockRes, mockNext);

      expect(mockNext.wasCalled()).toBe(false);
      expect(mockRes.getStatus()).toBe(400);
      expect(mockRes.getData().errors).toContain('Email is required');
      expect(mockRes.getData().errors).toContain('Password is required');
    });
  });

  describe('Validation Schemas', () => {
    it('should have register schema with correct structure', () => {
      expect(schemas.auth.register).toBeDefined();
      expect(schemas.auth.register.describe().keys).toHaveProperty('name');
      expect(schemas.auth.register.describe().keys).toHaveProperty('email');
      expect(schemas.auth.register.describe().keys).toHaveProperty('password');
    });

    it('should have login schema with correct structure', () => {
      expect(schemas.auth.login).toBeDefined();
      expect(schemas.auth.login.describe().keys).toHaveProperty('email');
      expect(schemas.auth.login.describe().keys).toHaveProperty('password');
    });
  });
}); 