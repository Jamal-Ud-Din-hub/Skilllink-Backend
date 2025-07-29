const Gig = require('../models/gig');
const cloudinary = require('../config/cloudinary');

exports.createGig = async (req, res) => {
  try {
    const files = req.files;
    const imageUrls = [];

    for (let file of files) {
      const result = await cloudinary.uploader.upload_stream({ resource_type: "image" },
        (error, result) => {
          if (result) imageUrls.push(result.secure_url);
        }
      );
      result.end(file.buffer);
    }

    const gig = await Gig.create({
      ...req.body,
      seller: req.user.id,
      images: imageUrls,
    });

    res.status(201).json(gig);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getGigs = async (req, res) => {
  const { category, search, tag, sort } = req.query;
  let filter = {};
  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (search) filter.title = new RegExp(search, 'i');

  let gigs = await Gig.find(filter).populate('seller', 'name avatar');

  if (sort === 'price_asc') gigs.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') gigs.sort((a, b) => b.price - a.price);

  res.json(gigs);
};

exports.getGigById = async (req, res) => {
  const gig = await Gig.findById(req.params.id).populate('seller', 'name avatar');
  if (!gig) return res.status(404).json({ error: 'Gig not found' });
  res.json(gig);
};

exports.updateGig = async (req, res) => {
  const gig = await Gig.findById(req.params.id);
  if (!gig) return res.status(404).json({ error: 'Not found' });
  if (gig.seller.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

  Object.assign(gig, req.body);
  await gig.save();
  res.json(gig);
};

exports.deleteGig = async (req, res) => {
  const gig = await Gig.findById(req.params.id);
  if (!gig) return res.status(404).json({ error: 'Not found' });
  if (gig.seller.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

  await gig.remove();
  res.json({ message: 'Gig deleted' });
};
