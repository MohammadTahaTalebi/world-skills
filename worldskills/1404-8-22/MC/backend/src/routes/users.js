const express = require('express');
const { prisma } = require('../lib/prisma');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);




router.get('/', async (req, res) => {
  const username = req.user.username;
  try {
    const admin = await prisma.adminUser.findUnique({ where: { username } });
    if (!admin) {
      return res.status(403).json({ message: 'You are not allowed to access this endpoint.' });
    }
    const users = await prisma.platformUser.findMany();
    return res.json(users);
  } catch (err) {
    console.error('get /users error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});



router.get('/admins', async (req, res) => {
  const username = req.user.username;
  try {
    const admin = await prisma.adminUser.findUnique({ where: { username } });
    if (!admin) {
      return res.status(403).json({ message: 'You are not allowed to access this endpoint.' });
    }
    const admins = await prisma.adminUser.findMany();
    return res.json(admins);
  } catch (err) {
    console.error('get /users/admins error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
