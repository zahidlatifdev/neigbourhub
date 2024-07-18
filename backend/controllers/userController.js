const User = require('../models/users')
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

module.exports = { getUserProfile, updateUserProfile }