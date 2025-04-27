const express = require('express');
const router = express.Router();
const multer = require('multer');
const sliderImageController = require('../controllers/sliderImageController');
const authorizeRoles = require("../middelware/authRole.middleware");

// Setup Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
router.get('/', sliderImageController.getAllImages);
router.post('/upload', authorizeRoles("admin"), upload.single('image'), sliderImageController.uploadImage);
router.delete('/:id', authorizeRoles("admin"), sliderImageController.deleteImage);

module.exports = router;
