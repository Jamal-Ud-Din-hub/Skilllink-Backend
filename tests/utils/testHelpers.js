const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Test database connection
const connectTestDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skilllink-test');
    console.log('Test database connected');
  } catch (error) {
    console.error('Test database connection failed:', error);
    process.exit(1);
  }
};

// Disconnect test database
const disconnectTestDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('Test database disconnected');
  } catch (error) {
    console.error('Test database disconnection failed:', error);
  }
};

// Clear all collections
const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

// Create mock request object
const createMockRequest = (body = {}, params = {}, query = {}, headers = {}) => ({
  body,
  params,
  query,
  headers,
  user: null
});

// Create mock response object
const createMockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    getStatus: () => res.status.mock.calls[0]?.[0],
    getData: () => res.json.mock.calls[0]?.[0]
  };
  return res;
};

// Create mock next function
const createMockNext = () => {
  const next = jest.fn();
  next.wasCalled = () => next.mock.calls.length > 0;
  next.getCallCount = () => next.mock.calls.length;
  return next;
};

// Generate JWT token for testing
const generateTestToken = (userId = '507f1f77bcf86cd799439011', role = 'buyer') => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'test-secret-key',
    { expiresIn: '1h' }
  );
};

// Create test user data
const createTestUserData = (overrides = {}) => ({
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password123',
  role: 'buyer',
  description: 'Test user description',
  skills: ['JavaScript', 'Node.js'],
  ...overrides
});

// Create test gig data
const createTestGigData = (overrides = {}) => ({
  title: 'Test Gig',
  description: 'Test gig description',
  price: 100,
  category: 'web-development',
  ...overrides
});

// Create test order data
const createTestOrderData = (overrides = {}) => ({
  gigId: '507f1f77bcf86cd799439011',
  requirements: 'Test requirements',
  ...overrides
});

module.exports = {
  connectTestDB,
  disconnectTestDB,
  clearTestDB,
  createMockRequest,
  createMockResponse,
  createMockNext,
  generateTestToken,
  createTestUserData,
  createTestGigData,
  createTestOrderData
}; 