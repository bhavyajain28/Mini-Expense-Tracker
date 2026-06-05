const express = require('express');
const cors = require('cors');
const config = require('./src/config');
const apiRoutes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler');
const notFound = require('./src/middleware/notFound');

const app = express();

app.use(cors({ origin: config.allowedOrigin }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
