const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");
const authorizeRoles = require("../middelware/authRole.middleware");
const upload = require("../config/multer"); // <-- Correct

// Routes
router.post(
    '/',
    authorizeRoles("admin"),     // ✅ First check if user is admin
    upload.array('images', 5), // Accept up to 5 images (adjust as needed)
    eventController.createEvent   // ✅ Finally, call your controller
)
    .get('/', eventController.getAllEvents)
    .get('/:id', eventController.getEventById)
    .put('/:id', authorizeRoles("admin"), eventController.updateEvent)
    .delete('/:id', authorizeRoles("admin"), eventController.deleteEvent);

module.exports = router;
