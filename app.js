const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/gigs', require('./routes/gig.routes'));
app.use('/api/orders', require('./routes/order.routes'));

// Rate Limiting
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

module.exports = app;
