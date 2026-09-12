const express = require('express');
const Item = require('../models/Item');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all items (any logged-in user) — supports optional search via ?search=
router.get('/', verifyToken, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const items = await Item.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add new item (admin only)
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { title, category, author, totalCopies } = req.body;
    const item = new Item({
      title,
      category,
      author,
      totalCopies: totalCopies || 1,
      availableCopies: totalCopies || 1
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Edit item (admin only)
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete item (admin only)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
