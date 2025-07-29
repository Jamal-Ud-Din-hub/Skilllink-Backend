const router = require('express').Router();
const controller = require('../controllers/gig.controller');
const auth = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.get('/', controller.getGigs);
router.get('/:id', controller.getGigById);

// Seller only
router.post('/', auth(['seller']), upload.array('images', 3), controller.createGig);
router.put('/:id', auth(['seller']), controller.updateGig);
router.delete('/:id', auth(['seller']), controller.deleteGig);

module.exports = router;
