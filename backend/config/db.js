const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async (URL) => {
    await mongoose.connect(URL)
        .then(() => console.log('Connected to MongoDB'))
}

module.exports = { connectDB };