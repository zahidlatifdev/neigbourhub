const Comment = require('../models/comments')
const Post = require('../models/posts')
const User = require('../models/users')

const getComments = async (req, res) => {
    const comments = await Comment.find({ post: req.params.id }).populate('author', 'username');
    res.json(comments)
}

const addComment = async (req, res) => {
    const { content } = req.body;
    const postId = req.params.id;

    if (!content) {
        return res.status(400).json({ message: 'Content is required' })
    }

    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({ message: 'Post not found' })
    }

    const comment = new Comment({
        content,
        author: req.user._id,
        post: postId
    })

    const createdComment = await comment.save();
    await Post.findByIdAndUpdate(postId, { $push: { comments: createdComment._id } })

    res.status(201).json(createdComment)
}

const removeComment = async (req, res) => {
    const comment = await Comment.findById(req.params.commentId)
    const user = await User.findById(req.user._id)

    if (!comment) {
        return res.status(404).json({ message: 'Comment not found' })
    }

    if (comment.author.toString() !== req.user._id.toString() && !user.isAdmin) {
        return res.status(401).json({ message: 'You are not authorized to delete this comment' })
    }

    await Comment.findByIdAndDelete(req.params.commentId)
    await Post.findByIdAndUpdate(req.params.id, { $pull: { comments: req.params.commentId } })

    res.json({ message: 'Comment removed' })
}

module.exports = { getComments, addComment, removeComment }