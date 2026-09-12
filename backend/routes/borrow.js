const express = require('express');
const BorrowRecord = require('../models/BorrowRecord');
const Item = require('../models/Item');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Borrow an item
router.post('/borrow/:itemId', verifyToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.availableCopies < 1) {
      return res.status(400).json({ message: 'No copies available' });
    }

    item.availableCopies -= 1;
    await item.save();

    const record = new BorrowRecord({
      user: req.user.id,
      item: item._id,
      status: 'borrowed'
    });
    await record.save();

    res.status(201).json({ message: 'Item borrowed successfully', record });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Return an item
router.post('/return/:recordId', verifyToken, async (req, res) => {
  try {
    const record = await BorrowRecord.findById(req.params.recordId);
    if (!record) return res.status(404).json({ message: 'Borrow record not found' });
    if (record.status === 'returned') {
      return res.status(400).json({ message: 'Item already returned' });
    }

    record.status = 'returned';
    record.returnDate = new Date();
    await record.save();

    const item = await Item.findById(record.item);
    if (item) {
      item.availableCopies += 1;
      await item.save();
    }

    res.json({ message: 'Item returned successfully', record });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get logged-in user's borrow history
router.get('/my-history', verifyToken, async (req, res) => {
  try {
    const records = await BorrowRecord.find({ user: req.user.id })
      .populate('item', 'title author category')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all borrow records (admin only, for dashboard stats)
router.get('/all', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const records = await BorrowRecord.find()
      .populate('item', 'title author')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
