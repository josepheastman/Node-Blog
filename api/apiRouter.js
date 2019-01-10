const express = require('express');

const usersRouter = require('../users/usersRouter.js');
const postsRouter = require('../posts/postsRouter.js');

const router = express.Router();

router.use('/users', usersRouter);
router.use('/posts', postsRouter);

module.exports = router;