const express = require('express');
const router = express.Router();
const { User, Project, Story, Task, LoggingHour } = require('./models');

// Users CRUD
router.get('/users', async (req, res) => {
  res.json(await User.findAll());
});
router.post('/users', async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});
router.get('/users/:id', async (req, res) => {
  res.json(await User.findByPk(req.params.id));
});
router.put('/users/:id', async (req, res) => {
  await User.update(req.body, { where: { id: req.params.id } });
  res.json(await User.findByPk(req.params.id));
});
router.delete('/users/:id', async (req, res) => {
  await User.destroy({ where: { id: req.params.id } });
  res.sendStatus(204);
});

// Projects CRUD
router.get('/projects', async (req, res) => {
  res.json(await Project.findAll({ include: Story }));
});
router.post('/projects', async (req, res) => {
  const project = await Project.create(req.body);
  res.json(project);
});
router.get('/projects/:id', async (req, res) => {
  res.json(await Project.findByPk(req.params.id, { include: Story }));
});
router.put('/projects/:id', async (req, res) => {
  await Project.update(req.body, { where: { id: req.params.id } });
  res.json(await Project.findByPk(req.params.id));
});
router.delete('/projects/:id', async (req, res) => {
  await Project.destroy({ where: { id: req.params.id } });
  res.sendStatus(204);
});

// Stories CRUD
router.get('/stories', async (req, res) => {
  res.json(await Story.findAll({ include: [Project, Task] }));
});
router.post('/stories', async (req, res) => {
  const story = await Story.create(req.body);
  res.json(story);
});
router.get('/stories/:id', async (req, res) => {
  res.json(await Story.findByPk(req.params.id, { include: [Project, Task] }));
});
router.put('/stories/:id', async (req, res) => {
  await Story.update(req.body, { where: { id: req.params.id } });
  res.json(await Story.findByPk(req.params.id));
});
router.delete('/stories/:id', async (req, res) => {
  await Story.destroy({ where: { id: req.params.id } });
  res.sendStatus(204);
});

// Tasks CRUD
router.get('/tasks', async (req, res) => {
  res.json(await Task.findAll({ include: [Story, User, LoggingHour] }));
});
router.post('/tasks', async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
});
router.get('/tasks/:id', async (req, res) => {
  res.json(await Task.findByPk(req.params.id, { include: [Story, User, LoggingHour] }));
});
router.put('/tasks/:id', async (req, res) => {
  await Task.update(req.body, { where: { id: req.params.id } });
  res.json(await Task.findByPk(req.params.id));
});
router.delete('/tasks/:id', async (req, res) => {
  await Task.destroy({ where: { id: req.params.id } });
  res.sendStatus(204);
});

// LoggingHours CRUD
router.get('/logginghours', async (req, res) => {
  res.json(await LoggingHour.findAll({ include: [Task, User] }));
});
router.post('/logginghours', async (req, res) => {
  const log = await LoggingHour.create(req.body);
  res.json(log);
});
router.get('/logginghours/:id', async (req, res) => {
  res.json(await LoggingHour.findByPk(req.params.id, { include: [Task, User] }));
});
router.put('/logginghours/:id', async (req, res) => {
  await LoggingHour.update(req.body, { where: { id: req.params.id } });
  res.json(await LoggingHour.findByPk(req.params.id));
});
router.delete('/logginghours/:id', async (req, res) => {
  await LoggingHour.destroy({ where: { id: req.params.id } });
  res.sendStatus(204);
});

module.exports = router;
