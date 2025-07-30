const Order = require('../models/order');
const Gig = require('../models/gig');
const cloudinary = require('../config/cloudinary');

exports.placeOrder = async (req, res) => {
  const { gigId, requirements, deliveryTime } = req.body;

  const gig = await Gig.findById(gigId);
  if (!gig) return res.status(404).json({ error: 'Gig not found' });

  const order = await Order.create({
    buyer: req.user.id,
    seller: gig.seller,
    gig: gigId,
    requirements: requirements || '',
    deliveryTime: deliveryTime || gig.deliveryTime || 7,
    price: gig.price,
    status: 'pending',
  });

  res.status(201).json(order);
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({
    $or: [{ buyer: req.user.id }, { seller: req.user.id }]
  }).populate('gig seller buyer', 'title name avatar');

  res.json(orders);
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;

  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const isSeller = req.user.id === order.seller.toString();
  const isBuyer = req.user.id === order.buyer.toString();

  // Only seller can move to in-progress
  if (status === 'in-progress' && !isSeller)
    return res.status(403).json({ error: 'Only seller can update to this status' });

  // Only buyer can mark as completed
  if (status === 'completed' && !isBuyer)
    return res.status(403).json({ error: 'Only buyer can complete order' });

  // Only seller can cancel
  if (status === 'cancelled' && !isSeller)
    return res.status(403).json({ error: 'Only seller can cancel order' });

  order.status = status;
  if (note) order.note = note;
  await order.save();
  res.json(order);
};

exports.uploadDelivery = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  if (order.seller.toString() !== req.user.id)
    return res.status(403).json({ error: 'Only seller can upload delivery' });

  const file = req.file;
  cloudinary.uploader.upload_stream({ resource_type: 'raw' },
    async (err, result) => {
      if (err) return res.status(500).json({ error: 'Upload failed' });

      order.deliveryFile = result.secure_url;
      order.status = 'completed';
      if (message) order.note = message;
      await order.save();
      res.json(order);
    }
  ).end(file.buffer);
};
