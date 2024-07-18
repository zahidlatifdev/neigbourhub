const jwt = require('jsonwebtoken');

const generateToken = (id, { name, username, email, isAdmin, isActivated, bio }) => {
    return jwt.sign({ id, name, email, username, bio, isAdmin, isActivated }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = generateToken;