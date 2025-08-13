const express = require('express');
const cors = require('cors');
const app = express();
const { sequelize } = require('./models');
const routes = require('./routes');
const authRoutes = require('./routes/auth');

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:4200',  // Angular default dev server
    'http://localhost:4201',  // Your additional frontend
    'http://127.0.0.1:4200',
    'http://127.0.0.1:4201'
  ],
  credentials: true,  // Allow cookies/auth headers
  optionsSuccessStatus: 200,  // Some legacy browsers choke on 204
  allowedHeaders: [
    'Origin',
    'X-Requested-With', 
    'Content-Type',
    'Accept',
    'Authorization'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Project Management API with Authentication');
});

app.use('/api/auth', authRoutes);
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
const syncOptions = process.env.NODE_ENV === 'production' ? {} : { alter: true };
sequelize.sync(syncOptions).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
