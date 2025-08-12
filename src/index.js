const express = require('express');
const app = express();
const { sequelize } = require('./models');
const routes = require('./routes');
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Project Management API');
});

app.use('/api', routes);

const PORT = process.env.PORT || 3000;
const syncOptions = process.env.NODE_ENV === 'production' ? {} : { alter: true };
sequelize.sync(syncOptions).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
