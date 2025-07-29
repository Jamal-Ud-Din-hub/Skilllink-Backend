const router = require('express').Router();
const controller = require('../controllers/order.controller');
const auth = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.post('/', auth(['buyer']), controller.placeOrder);
router.get('/', auth(), controller.getMyOrders);
router.patch('/:id/status', auth(), controller.updateStatus);
router.post('/:id/deliver', auth(['seller']), upload.single('file'), controller.uploadDelivery);

module.exports = router;
