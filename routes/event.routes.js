const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");
const authorizeRoles = require("../middelware/authRole.middleware");


router.post('/',authorizeRoles("admin"), eventController.createEvent)
    .get('/', eventController.getAllEvents)
    .get('/:id', eventController.getEventById)
    .put('/:id',authorizeRoles("admin"), eventController.updateEvent)
    .delete('/:id',authorizeRoles("admin"), eventController.deleteEvent);


module.exports = router;
