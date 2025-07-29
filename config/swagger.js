const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Skilllink Backend API',
      version: '1.0.0',
      description: 'API documentation for Skilllink Backend - A platform for freelancers and clients',
      contact: {
        name: 'API Support',
        email: 'support@skilllink.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server'
      },
      {
        url: 'https://api.skilllink.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            role: {
              type: 'string',
              enum: ['client', 'freelancer'],
              description: 'User role'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation date'
            }
          }
        },
        Gig: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Gig ID'
            },
            title: {
              type: 'string',
              description: 'Gig title'
            },
            description: {
              type: 'string',
              description: 'Gig description'
            },
            price: {
              type: 'number',
              description: 'Gig price'
            },
            category: {
              type: 'string',
              description: 'Gig category'
            },
            freelancer: {
              type: 'string',
              description: 'Freelancer ID'
            },
            images: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Gig images URLs'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Gig creation date'
            }
          }
        },
        Order: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Order ID'
            },
            gig: {
              type: 'string',
              description: 'Gig ID'
            },
            client: {
              type: 'string',
              description: 'Client ID'
            },
            freelancer: {
              type: 'string',
              description: 'Freelancer ID'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in-progress', 'completed', 'cancelled'],
              description: 'Order status'
            },
            totalAmount: {
              type: 'number',
              description: 'Total order amount'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Order creation date'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            },
            status: {
              type: 'number',
              description: 'HTTP status code'
            }
          }
        }
      }
    }
  },
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './models/*.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = specs; 