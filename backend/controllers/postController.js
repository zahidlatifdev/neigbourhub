const Post = require('../models/posts')
const User = require('../models/users')

const getPosts = async (req, res) => {
    const posts = await Post.find({})
        .populate('author', 'username')
        .populate({
            path: 'comments',
            populate: { path: 'author', select: 'username' }
        });
    res.json(posts)
}

const getPostById = async (req, res) => {
    const post = await Post.findById(req.params.id)
        .populate('author', 'username')
        .populate({
            path: 'comments',
            populate: { path: 'author', select: 'username' }
        });

    if (post) {
        res.json(post)
    } else {
        res.status(404).json({ message: 'Post not found' })
    }
}

const addPost = async (req, res) => {
    const { title, content } = req.body
    const post = new Post({
        title,
        content,
        author: req.user._id
    })
    const createdPost = await post.save()
    res.status(201).json(createdPost)
}

const removePost = async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        res.status(404)
        throw new Error('Post not found')
    }
    const user = await User.findById(req.user._id)
    if (post.author.toString() !== req.user._id.toString() && !user.isAdmin) {
        res.status(401)
        throw new Error('You are not authorized to delete this post')
    }

    await post.deleteOne()
    res.json({ message: 'Post removed' })
}

const updatePost = async (req, res) => {
    const { title, content } = req.body
    const post = await Post.findById(req.params.id)

    if (post) {
        if (post.author.toString() === req.user._id.toString()) {
            post.title = title
            post.content = content

            const updatedPost = await post.save()
            res.json(updatedPost)
        } else {
            res.status(401)
            throw new Error('You are not authorized to update this post')
        }
    } else {
        res.status(404)
        throw new Error('Post not found')
    }
}

module.exports = { getPosts, getPostById, addPost, removePost, updatePost }