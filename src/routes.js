const express = require('express');
const router = express.Router();
const { User, Project, Story, Task, LoggingHour } = require('./models');
const { authenticateToken, optionalAuth } = require('./middleware/auth');

// Apply authentication to all protected routes
// You can make routes public by using optionalAuth or removing middleware entirely

// Users CRUD (Protected - users can only see their own data)
router.get('/users', authenticateToken, async (req, res) => {
  // For now, return all users - in production, you might want to restrict this
  res.json(await User.findAll({ attributes: ['id', 'name', 'email', 'createdAt'] }));
});
router.post('/users', async (req, res) => {
  // User creation is handled by /api/auth/register
  res.status(400).json({ 
    error: 'Use /api/auth/register for user creation',
    message: 'This endpoint is deprecated, use authentication endpoints' 
  });
});
router.get('/users/:id', authenticateToken, async (req, res) => {
  const user = await User.findByPk(req.params.id, { attributes: ['id', 'name', 'email', 'createdAt'] });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});
router.put('/users/:id', authenticateToken, async (req, res) => {
  // Users can only update their own profile
  if (req.user.id !== parseInt(req.params.id)) {
    return res.status(403).json({ error: 'You can only update your own profile' });
  }
  
  const { password, ...updateData } = req.body; // Don't allow password updates here
  await User.update(updateData, { where: { id: req.params.id } });
  const user = await User.findByPk(req.params.id, { attributes: ['id', 'name', 'email', 'createdAt'] });
  res.json(user);
});
router.delete('/users/:id', authenticateToken, async (req, res) => {
  // Users can only delete their own account
  if (req.user.id !== parseInt(req.params.id)) {
    return res.status(403).json({ error: 'You can only delete your own account' });
  }
  await User.destroy({ where: { id: req.params.id } });
  res.sendStatus(204);
});

// Projects CRUD (Protected)
router.get('/projects', authenticateToken, async (req, res) => {
  res.json(await Project.findAll({ include: Story }));
});
router.post('/projects', authenticateToken, async (req, res) => {
  const project = await Project.create(req.body);
  res.json(project);
});
router.get('/projects/:id', authenticateToken, async (req, res) => {
  const project = await Project.findByPk(req.params.id, { include: Story });
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});
router.put('/projects/:id', authenticateToken, async (req, res) => {
  await Project.update(req.body, { where: { id: req.params.id } });
  res.json(await Project.findByPk(req.params.id));
});
router.delete('/projects/:id', authenticateToken, async (req, res) => {
  await Project.destroy({ where: { id: req.params.id } });
  res.sendStatus(204);
});

// Stories CRUD (Protected)
router.get('/stories', authenticateToken, async (req, res) => {
  res.json(await Story.findAll({ include: [Project, Task] }));
});
router.post('/stories', authenticateToken, async (req, res) => {
  const story = await Story.create(req.body);
  res.json(story);
});
router.get('/stories/:id', authenticateToken, async (req, res) => {
  const story = await Story.findByPk(req.params.id, { include: [Project, Task] });
  if (!story) return res.status(404).json({ error: 'Story not found' });
  res.json(story);
});
router.put('/stories/:id', authenticateToken, async (req, res) => {
  await Story.update(req.body, { where: { id: req.params.id } });
  res.json(await Story.findByPk(req.params.id));
});
router.delete('/stories/:id', authenticateToken, async (req, res) => {
  await Story.destroy({ where: { id: req.params.id } });
  res.sendStatus(204);
});

// Tasks CRUD (Protected)
router.get('/tasks', authenticateToken, async (req, res) => {
  res.json(await Task.findAll({ include: [Story, User, LoggingHour] }));
});
router.post('/tasks', authenticateToken, async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
});
router.get('/tasks/:id', authenticateToken, async (req, res) => {
  const task = await Task.findByPk(req.params.id, { include: [Story, User, LoggingHour] });
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});
router.put('/tasks/:id', authenticateToken, async (req, res) => {
  await Task.update(req.body, { where: { id: req.params.id } });
  res.json(await Task.findByPk(req.params.id));
});
router.delete('/tasks/:id', authenticateToken, async (req, res) => {
  await Task.destroy({ where: { id: req.params.id } });
  res.sendStatus(204);
});

// LoggingHours CRUD (Protected - users can only access their own logs)
router.get('/logginghours', authenticateToken, async (req, res) => {
  // Filter to only show current user's logs
  res.json(await LoggingHour.findAll({ 
    where: { userId: req.user.id },
    include: [Task, User] 
  }));
});
router.post('/logginghours', authenticateToken, async (req, res) => {
  // Automatically set the userId to the authenticated user
  const logData = { ...req.body, userId: req.user.id };
  const log = await LoggingHour.create(logData);
  res.json(log);
});
router.get('/logginghours/:id', authenticateToken, async (req, res) => {
  const log = await LoggingHour.findOne({
    where: { id: req.params.id, userId: req.user.id },
    include: [Task, User]
  });
  if (!log) return res.status(404).json({ error: 'Logging hour not found' });
  res.json(log);
});
router.put('/logginghours/:id', authenticateToken, async (req, res) => {
  const { userId, ...updateData } = req.body; // Don't allow changing userId
  await LoggingHour.update(updateData, { 
    where: { id: req.params.id, userId: req.user.id } 
  });
  const log = await LoggingHour.findByPk(req.params.id);
  if (!log) return res.status(404).json({ error: 'Logging hour not found' });
  res.json(log);
});
router.delete('/logginghours/:id', authenticateToken, async (req, res) => {
  const result = await LoggingHour.destroy({ 
    where: { id: req.params.id, userId: req.user.id } 
  });
  if (!result) return res.status(404).json({ error: 'Logging hour not found' });
  res.sendStatus(204);
});

module.exports = router;
