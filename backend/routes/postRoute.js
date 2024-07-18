const express = require('express')
const { getPosts, getPostById, addPost, removePost, updatePost } = require('../controllers/postController')
const { getComments, addComment, removeComment } = require('../controllers/commentController')
const { protect } = require('../middlewares/authMiddleware')

const router = express.Router()

router.route('/')
    .get(getPosts)
    .post(protect, addPost)

router.route('/:id')
    .get(getPostById)
    .delete(protect, removePost)
    .put(protect, updatePost)

router.route('/:id/comments')
    .get(getComments)
    .post(protect, addComment)

router.route('/:id/comments/:commentId')
    .delete(protect, removeComment)

module.exports = router