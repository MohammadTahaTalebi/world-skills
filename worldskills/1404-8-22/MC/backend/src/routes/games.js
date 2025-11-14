const express = require('express');
const { prisma } = require('../lib/prisma');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  const username = req.user.username;

  if (!title || !description || title.length < 6 || description.length < 6) {
    return res.status(400).json({ message: 'title and description must be at least 6 chars' });
  }

  try {
    const developer = await prisma.platformUser.findUnique({ where: { username } });
    if (!developer) {
      return res.status(403).json({ message: "You're not allowed to access this endpoint" });
    }
    if (developer.role !== 'developer') {
      return res.status(403).json({ message: 'Only developers can access' });
    }

    const existing = await prisma.game.findUnique({ where: { title } });
    if (existing) {
      return res.status(409).json({ message: 'Game already registered' });
    }

    const slug = title.toLowerCase().replaceAll(' ', '');
    const game = await prisma.game.create({
      data: {
        title,
        description,
        author: developer.username,
        slug,
      },
    });

    return res.status(201).json(game);
  } catch (err) {
    console.error('create game error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  const size = Number(req.query.size) || 2;
  const page = Number(req.query.page) || 0;
  const sortDir = req.query.sortDir === 'asc' ? 'asc' : 'desc';

  try {
    const games = await prisma.game.findMany({
      skip: page * size,
      take: size,
      orderBy: { title: sortDir },
    });
    return res.json(games);
  } catch (err) {
    console.error('get all games error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const game = await prisma.game.findUnique({ where: { slug } });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    return res.json(game);
  } catch (err) {
    console.error('get game by slug error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:slug', async (req, res) => {
  const { slug } = req.params;
  const { title, description } = req.body;

  try {
    const data = {};
    if (title) data.title = title;
    if (description) data.description = description;

    const game = await prisma.game.update({
      where: { slug },
      data,
    });
    return res.json(game);
  } catch (err) {
    console.error('edit game error', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Game not found' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:slug', authMiddleware, async (req, res) => {
  const { slug } = req.params;
  const username = req.user.username;
  try {
    const admin = await prisma.adminUser.findUnique({ where: { username } });
    if (!admin) {
      return res.status(403).json({ message: "You're not allowed to access this endpoint" });
    }

    const existingGame = await prisma.game.findUnique({ where: { slug } });
    if (!existingGame) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const deletedGame = await prisma.game.delete({ where: { slug } });
    return res.json({ data: deletedGame, message: 'Game deleted successfully' });
  } catch (err) {
    console.error('delete game error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:slug/scores', async (req, res) => {
  const { slug } = req.params;
  try {
    const existingGame = await prisma.game.findUnique({ where: { slug } });
    if (!existingGame) {
      return res.status(404).json({ message: 'Game not found' });
    }
    const scores = await prisma.gameScore.findMany({
      where: { gameSlug: slug },
    });
    return res.json(scores);
  } catch (err) {
    console.error('get game scores error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/:slug/scores', authMiddleware, async (req, res) => {
  const { slug } = req.params;
  const username = req.user.username;
  const { score } = req.body;

  if (score == null) {
    return res.status(400).json({ message: 'score is required' });
  }

  try {
    const existingUser = await prisma.platformUser.findUnique({ where: { username } });
    if (!existingUser) {
      return res.status(403).json({ message: "You're not allowed to access this endpoint" });
    }

    const existingGame = await prisma.game.findUnique({ where: { slug } });
    if (!existingGame) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const created = await prisma.gameScore.create({
      data: {
        gameSlug: slug,
        platformUserUsername: username,
        score: String(score),
      },
    });

    return res.status(201).json(created);
  } catch (err) {
    console.error('create score error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
