const express = require('express');
const router = express.Router();
const {
  getTasks,
  addTask,
  deleteTask,
  updateTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware'); // ✅ Correct import

// ✅ Protected routes (user must be logged in)
router.get('/', protect, getTasks);
router.post('/', protect, addTask);
router.delete('/:id', protect, deleteTask);
router.put('/:id', protect, updateTask);

module.exports = router;
