// backend/routes/tasks.js

const router = require('express').Router();
const pool = require('../db'); // We will create this db.js file next

// Route to GET all tasks
router.route('/').get(async (req, res) => {
  try {
    const allTasks = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(allTasks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Route to POST a new task
router.route('/add').post(async (req, res) => {
  try {
    const { title, client, partner, status, dueDate, commission } = req.body;
    const newTask = await pool.query(
      'INSERT INTO tasks (title, client, partner, status, due_date, commission) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, client, partner, status, dueDate, commission]
    );
    res.json({ message: 'Task added!', task: newTask.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;