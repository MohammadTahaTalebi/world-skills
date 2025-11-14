const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { prisma } = require('../lib/prisma');

const router = express.Router();

async function signToken(username) {
  const payload = { username };
  const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  return { access_token: token };
}

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password || username.length < 6 || password.length < 6) {
    return res.status(400).json({ message: 'username and password must be at least 6 chars' });
  }

  try {
    const existing = await prisma.platformUser.findUnique({ where: { username } });
    if (existing) {
      return res.status(409).json({ message: 'Username already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.platformUser.create({
      data: { username, password: hashedPassword },
    });

    const token = await signToken(user.username);
    return res.status(201).json(token);
  } catch (err) {
    console.error('signup error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});



router.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.platformUser.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const currentDate = new Date();
    await prisma.platformUser.update({
      where: { username },
      data: { lastLoginTimestamp: currentDate },
    });

    const token = await signToken(user.username);
    return res.json(token);
  } catch (err) {
    console.error('signin error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});



router.post('/signin-admin', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await prisma.adminUser.findUnique({ where: { username } });
    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const currentDate = new Date();
    await prisma.adminUser.update({
      where: { username },
      data: { lastLoginTimestamp: currentDate },
    });

    const token = await signToken(admin.username);
    return res.json(token);
  } catch (err) {
    console.error('signin-admin error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
