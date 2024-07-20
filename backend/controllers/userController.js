const User = require('../models/users')
const Event = require('../models/events')
const Post = require('../models/posts')
const generateToken = require('../utils/generateToken')

const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password')
    res.status(200).json(user)
}

const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password')
    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.bio = req.body.bio || user.bio
        if (req.body.password) {
            user.password = req.body.password
        }
        const updatedUser = await user.save()
        res.json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            username: updatedUser.username,
            isActicated: updatedUser.isActivated,
            bio: updatedUser.bio,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id, updatedUser)
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
}

const getEventbyUser = async (req, res) => {
    const events = await Event.find({ author: req.user._id }).populate('author', 'username')
    res.json(events)
}

const getPostbyUser = async (req, res) => {
    const posts = await Post.find({ author: req.user._id }).populate('author', 'username')
    res.json(posts)
}

module.exports = { getUserProfile, updateUserProfile, getEventbyUser, getPostbyUser }