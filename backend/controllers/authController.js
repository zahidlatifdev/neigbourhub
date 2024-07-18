const User = require('../models/users')
const generateToken = require('../utils/generateToken')

const registerUser = async (req, res) => {
    const { name, username, email, password } = req.body
    const userExist = await User.findOne({ email })
    if (userExist) {
        res.status(400)
        throw new Error('User already exists')
    }

    const user = await User.create({ name, username, email, password })
    if (user) {
        res.status(201).json({
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            isActivated: user.isActivated,
            bio: user.bio,
            token: generateToken(user._id, user)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
}

const loginUser = async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })

    if (user && (await user.matchPassword(password))) {
        res.json({
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            isActivated: user.isActivated,
            bio: user.bio,
            token: generateToken(user._id, user)
        })
    } else {
        res.status(401)
        throw new Error('Invalid username or password')
    }
}

module.exports = { registerUser, loginUser }