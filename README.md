# Skilllink Backend

A Node.js backend API for a freelancing platform connecting clients and freelancers.

## Features

- User authentication and authorization
- Gig management (create, read, update, delete)
- Order management and tracking
- File upload support
- Real-time communication with Socket.IO
- Comprehensive API documentation with Swagger

## API Documentation

This project includes comprehensive API documentation using Swagger/OpenAPI 3.0.

### Accessing the Documentation

Once the server is running, you can access the API documentation at:

- **Swagger UI**: `http://localhost:3000/api-docs`
- **OpenAPI JSON**: `http://localhost:3000/api-docs.json`

### API Endpoints

The API is organized into the following sections:

#### Authentication (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login user

#### Gigs (`/api/gigs`)
- `GET /` - Get all gigs (with filtering and pagination)
- `GET /:id` - Get gig by ID
- `POST /` - Create a new gig (Freelancer only)
- `PUT /:id` - Update gig (Owner only)
- `DELETE /:id` - Delete gig (Owner only)

#### Orders (`/api/orders`)
- `POST /` - Place a new order (Client only)
- `GET /` - Get user's orders (Authenticated users)
- `PATCH /:id/status` - Update order status (Order participants only)
- `POST /:id/deliver` - Upload delivery files (Freelancer only)

### Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (create a `.env` file)
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Development

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Cloudinary for cloud storage
- Socket.IO for real-time features
- Swagger/OpenAPI for API documentation 