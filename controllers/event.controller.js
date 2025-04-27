
const { Event, EventImage } = require('../models');
const fs = require('fs');
const path = require('path');

// Create a new event with images
exports.createEvent = async (req, res, next) => {
    try {
        const { name, date, description, venue, nominationLink } = req.body;

        if (!name || !date || !description || !venue) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Step 1: Create event
        const event = await Event.create({
            name,
            date,
            description,
            venue,
            nominationLink
        });

        // Step 2: Save uploaded images (if any)
        if (req.files && req.files.length > 0) {
            const images = req.files.map(file => {
                const imageBuffer = fs.readFileSync(file.path);

                // Clean up file immediately after reading
                fs.unlink(file.path, (err) => {
                    if (err) console.error(`Failed to delete ${file.path}`, err);
                });

                return {
                    eventId: event.id,
                    image: imageBuffer
                };
            });

            // Bulk create all images at once
            await EventImage.bulkCreate(images);
        }

        res.status(201).json({ message: 'Event created successfully with images', event });

    } catch (error) {
        next(error); // pass to centralized error handler
    }
};

// Get all events with images
exports.getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: EventImage,
                    as: 'images',
                    attributes: ['id', 'image'] // select specific fields
                }
            ]
        });

        const eventsWithImages = events.map(event => {
            const eventJson = event.toJSON();
            if (eventJson.images) {
                eventJson.images = eventJson.images.map(img => ({
                    id: img.id,
                    image: `data:image/jpeg;base64,${img.image.toString('base64')}`  // <--- Add this prefix
                }));
            }
            return eventJson;
        });
        console.log(eventsWithImages)
        res.status(200).json(eventsWithImages);

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