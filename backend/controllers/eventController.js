const Event = require('../models/events');
const User = require('../models/users');

const getEvents = async (req, res) => {
    const events = await Event.find({}).populate('author', 'username')
    res.json(events)
}

const getEventById = async (req, res) => {
    const event = await Event.findById(req.params.id).populate('author', 'username')
    if (event) {
        res.json(event)
    } else {
        res.status(404)
        throw new Error('Event not found')
    }
}

const addEvent = async (req, res) => {
    const { title, description, date, location } = req.body
    const event = new Event({
        title,
        description,
        date,
        location,
        author: req.user._id,
        attendees: [{
            userId: req.user._id,
            email: req.user.email,
            name: req.user.name
        }]
    })
    const createdEvent = await event.save()
    res.status(201).json(createdEvent)
}

const removeEvent = async (req, res) => {
    const event = await Event.findById(req.params.id)
    const user = await User.findById(req.user._id)
    if (event) {
        if (event.author.toString() !== req.user._id.toString() && !user.isAdmin) {
            res.status(401)
            throw new Error('You are not authorized to delete this event')
        } else {
            await event.deleteOne()
            res.json({ message: 'Event removed' })
        }
    } else {
        res.status(404)
        throw new Error('Event not found')
    }
}

const updateEvent = async (req, res) => {
    const { title, description, date, location } = req.body.event
    const event = await Event.findById(req.params.id)
    const user = await User.findById(req.user._id)

    if (event) {
        if (event.author.toString() !== req.user._id.toString() && !user.isAdmin) {
            res.status(401)
            throw new Error('You are not authorized to update this event')
        } else {
            event.title = title
            event.description = description
            event.date = date
            event.location = location

            const updatedEvent = await event.save()
            res.json(updatedEvent)
        }
    } else {
        res.status(404)
        throw new Error('Event not found')
    }
}

const getAttendee = async (req, res) => {
    const event = await Event.findById(req.params.id)
    if (event) {
        const attendees = await User.find({ _id: { $in: event.attendees } })
        res.json(attendees)
    } else {
        res.status(404)
        throw new Error('Event not found')
    }

}

const addAttendee = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const invitee = await User.findOne({ email: req.body.email });
        if (!invitee) {
            return res.status(404).json({ message: 'Invitee not found' });
        }

        const user = await User.findById(req.user._id);
        const isAlreadyAttendee = event.attendees.some(attendee => attendee.email === req.body.email);

        if (event.author.toString() !== req.user._id.toString() && !user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized to invite attendees' });
        }

        if (isAlreadyAttendee) {
            return res.status(400).json({ message: 'User is already an attendee' });
        }

        event.attendees.push({ userId: invitee._id, email: invitee.email, name: invitee.name });
        const updatedEvent = await event.save();

        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const removeAttendee = async (req, res) => {
    const event = await Event.findById(req.params.id)
    const user = await User.findById(req.user._id)
    const userToRemove = await User.findOne({ email: req.body.email })
    if (event) {
        if (event.author.toString() !== req.user._id.toString() && !user.isAdmin) {
            res.status(401)
            throw new Error('You are not authorized to remove attendees from this event')
        } else {
            event.attendees = event.attendees.filter(attendee => attendee.userId.toString() !== userToRemove._id.toString())
            const updatedEvent = await event.save()
            res.json(updatedEvent)
        }
    } else {
        res.status(404)
        throw new Error('Event not found')
    }
}


module.exports = { getEvents, getEventById, addEvent, removeEvent, updateEvent, getAttendee, addAttendee, removeAttendee }