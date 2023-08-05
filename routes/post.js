const express = require('express');
const postController = require('../controllers/post');
const authMiddleware = require('../middleware/auth-middleware');

const router = express.Router();

router.post('/post', authMiddleware, postController.createPost);
router.get('/post', postController.getPosts);
router.get('/post/:postId', postController.getPostById);
router.patch('/post/:postId', authMiddleware, postController.updatePost);

module.exports = router;
