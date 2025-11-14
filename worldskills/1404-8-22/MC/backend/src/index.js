const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const gameRoutes = require('./routes/games');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const apiV1 = express.Router();

apiV1.get('/', (req, res) => {
  res.json({ message: 'MC Backend Express API is running' });
});

apiV1.use('/auth', authRoutes);
apiV1.use('/users', userRoutes);
apiV1.use('/games', gameRoutes);

app.use('/api/v1', apiV1);

app.use((err, req, res, next) => {
  console.error('Unhandled error', err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
