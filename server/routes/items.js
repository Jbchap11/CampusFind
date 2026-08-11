const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/auth');

// @route   GET /api/items
// @desc    Get all items with optional search & filter query params
router.get('/', async (req, res) => {
  try {
    const { search, status, category } = req.query;
    const filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
        { category: searchRegex }
      ];
    }

    const items = await Item.find(filter)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    console.error('Fetch Items Error:', err);
    res.status(500).json({ message: 'Server error fetching items.' });
  }
});

// @route   GET /api/items/my-posts
// @desc    Get items posted by current logged in user
router.get('/my-posts', auth, async (req, res) => {
  try {
    const items = await Item.find({ postedBy: req.user.id })
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    console.error('Fetch My Posts Error:', err);
    res.status(500).json({ message: 'Server error fetching your posts.' });
  }
});

// @route   POST /api/items
// @desc    Create a new lost/found item post
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, status, location, date, contact } = req.body;

    if (!title || !description || !location || !contact) {
      return res.status(400).json({ message: 'Please provide all required fields: title, description, location, contact.' });
    }

    const newItem = new Item({
      title: title.trim(),
      description: description.trim(),
      category: category || 'Other',
      status: status || 'Lost',
      location: location.trim(),
      date: date ? new Date(date) : new Date(),
      contact: contact.trim(),
      postedBy: req.user.id
    });

    const savedItem = await newItem.save();
    const populatedItem = await Item.findById(savedItem._id).populate('postedBy', 'name email');

    res.status(201).json(populatedItem);
  } catch (err) {
    console.error('Create Item Error:', err);
    res.status(500).json({ message: 'Server error creating item post.' });
  }
});

// @route   PATCH /api/items/:id
// @desc    Update item details
router.patch('/:id', auth, async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item post not found.' });
    }

    // Ensure user owns the item
    if (item.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to update this item.' });
    }

    const { title, description, category, status, location, date, contact } = req.body;

    if (title) item.title = title.trim();
    if (description) item.description = description.trim();
    if (category) item.category = category;
    if (status) item.status = status;
    if (location) item.location = location.trim();
    if (date) item.date = new Date(date);
    if (contact) item.contact = contact.trim();

    await item.save();
    const updatedItem = await Item.findById(item._id).populate('postedBy', 'name email');

    res.json(updatedItem);
  } catch (err) {
    console.error('Update Item Error:', err);
    res.status(500).json({ message: 'Server error updating item post.' });
  }
});

// @route   PATCH /api/items/:id/returned
// @desc    Mark item as returned
router.patch('/:id/returned', auth, async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item post not found.' });
    }

    if (item.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to modify this item status.' });
    }

    item.status = 'Returned';
    await item.save();

    const updatedItem = await Item.findById(item._id).populate('postedBy', 'name email');
    res.json(updatedItem);
  } catch (err) {
    console.error('Mark Returned Error:', err);
    res.status(500).json({ message: 'Server error marking item as returned.' });
  }
});

// @route   DELETE /api/items/:id
// @desc    Delete an item post
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item post not found.' });
    }

    if (item.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to delete this item.' });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item post successfully deleted.' });
  } catch (err) {
    console.error('Delete Item Error:', err);
    res.status(500).json({ message: 'Server error deleting item post.' });
  }
});

module.exports = router;
