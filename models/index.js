const Event = require('./Event');
const EventImage = require('./EventImage');

// Associations
Event.hasMany(EventImage, { foreignKey: 'eventId', as: 'images' });
EventImage.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

module.exports = {
    Event,
    EventImage
};
