import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all todos for logged-in users
router.get('/', (req, res) => {
  const getTodos = db.prepare('SELECT * FROM todos WHERE user_id = ?');
  const todos = getTodos.all(req.userId);
  res.json(todos);
});

// Create a new todo
router.post('/', (req, res) => {

  // user writes a todo
  const { task } = req.body;
  // SQL query to insert data into the 'user_id' and 'task' columns of the 'todos' table
  const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`);
  // data to be inserted into the 'todos' table (the userId and the task created)
  const result = insertTodo.run(req.userId, task);

  res.json({ id: result.lastInsertRowid, task, completed: 0 });


});

// Update a todo
router.put('/:id', (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;

  const updatedTodo = db.prepare('UPDATE todos SET completed = ? WHERE id = ?');
  updatedTodo.run(completed, id);

  res.json({ message: "Todo completed" });
});

// Delete a todo
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const deleteTodo = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`);
  deleteTodo.run(id, userId);

  res.send({ message: "Todo deleted" });
});

export default router;