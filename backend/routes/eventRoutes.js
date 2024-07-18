const express = require('express')
const { getEvents, getEventById, addEvent, removeEvent, updateEvent, getAttendee, addAttendee, removeAttendee } = require('../controllers/eventController')
const { protect } = require('../middlewares/authMiddleware')

const router = express.Router()

router.route('/')
    .get(getEvents)
    .post(protect, addEvent)

router.route('/:id')
    .get(getEventById)
    .delete(protect, removeEvent)
    .put(protect, updateEvent)

router.route('/:id/attend')
    .get(getAttendee)
    .post(protect, addAttendee)
    .delete(protect, removeAttendee)

module.exports = router