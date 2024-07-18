const express = require('express')
const { loginUser, registerUser } = require('../controllers/authController')
const { getUserProfile, updateUserProfile } = require('../controllers/userController.js')
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router()

router.post('/login', loginUser)
router.post('/register', registerUser)

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)

router.get('/checkToken', protect, (req, res) => {
    res.json({ user: req.user, isAdmin: req.user.isAdmin });
});

module.exports = router