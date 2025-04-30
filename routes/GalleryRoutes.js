const express = require('express');
const router = express.Router();
const multer = require('multer');
const galleryController = require('../controllers/galleryController');
const authorizeRoles = require("../middelware/authRole.middleware");

// Setup Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
router.get('/', galleryController.getAllImages);
router.post('/upload', authorizeRoles("admin"), upload.single('image'), galleryController.uploadImage);
router.delete('/:id', authorizeRoles("admin"), galleryController.deleteImage);

module.exports = router;
