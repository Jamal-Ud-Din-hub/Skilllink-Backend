const router = require('express').Router();
const controller = require('../controllers/gig.controller');
const auth = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const { validateCreateGig, validateUpdateGig, validateGigQuery } = require('../middlewares/validation');

/**
 * @swagger
 * /api/gigs:
 *   get:
 *     summary: Get all gigs
 *     tags: [Gigs]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter gigs by category
 *         example: "web-development"
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *         example: 50
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *         example: 500
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of gigs per page
 *     responses:
 *       200:
 *         description: List of gigs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Gig'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 */
// Query gigs with validation
router.get('/', validateGigQuery, controller.getGigs);

/**
 * @swagger
 * /api/gigs/{id}:
 *   get:
 *     summary: Get gig by ID
 *     tags: [Gigs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Gig ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Gig retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Gig'
 *       404:
 *         description: Gig not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Get gig by ID (no validation needed for params here)
router.get('/:id', controller.getGigById);

/**
 * @swagger
 * /api/gigs:
 *   post:
 *     summary: Create a new gig (Freelancer only)
 *     tags: [Gigs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 description: Gig title
 *                 example: "Professional Web Development"
 *               description:
 *                 type: string
 *                 description: Detailed gig description
 *                 example: "I will create a modern, responsive website for your business"
 *               price:
 *                 type: number
 *                 description: Gig price
 *                 example: 299.99
 *               category:
 *                 type: string
 *                 description: Gig category
 *                 example: "web-development"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Gig images (max 3 files)
 *     responses:
 *       201:
 *         description: Gig created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Gig created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Gig'
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Only freelancers can create gigs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Seller only: create gig with validation
router.post('/', auth(['seller']), upload.array('images', 3), validateCreateGig, controller.createGig);

/**
 * @swagger
 * /api/gigs/{id}:
 *   put:
 *     summary: Update gig (Owner only)
 *     tags: [Gigs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Gig ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Gig title
 *                 example: "Updated Web Development Service"
 *               description:
 *                 type: string
 *                 description: Updated gig description
 *               price:
 *                 type: number
 *                 description: Updated gig price
 *                 example: 399.99
 *               category:
 *                 type: string
 *                 description: Updated gig category
 *     responses:
 *       200:
 *         description: Gig updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Gig updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Gig'
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Only gig owner can update
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Gig not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Seller only: update gig with validation
router.put('/:id', auth(['seller']), validateUpdateGig, controller.updateGig);

/**
 * @swagger
 * /api/gigs/{id}:
 *   delete:
 *     summary: Delete gig (Owner only)
 *     tags: [Gigs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Gig ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Gig deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Gig deleted successfully"
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Only gig owner can delete
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Gig not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Seller only: delete gig
router.delete('/:id', auth(['seller']), controller.deleteGig);

module.exports = router;
