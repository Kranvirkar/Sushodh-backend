
const Event = require('../models/Event');


// Create a new event
exports.createEvent = async (req, res, next) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json({ message: 'Event created successfully', event });
    } catch (error) {
        next(error);
    }
};

// Get all events
exports.getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json(events);
    } catch (error) {
        next(error);
    }
};

// Get single event by ID
exports.getEventById = async (req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        next(error);
    }
};

// Update event
exports.updateEvent = async (req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        await event.update(req.body);
        res.status(200).json({ message: 'Event updated successfully', event });
    } catch (error) {
        next(error);
    }
};

// Delete event
exports.deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        await event.destroy();
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        next(error);
    }
};