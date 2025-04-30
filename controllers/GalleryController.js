const db = require('../models');
const SliderImage = db.Gallery;

exports.uploadImage = async (req, res) => {
    try {
        //console.log(req.body);
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const { title } = req.body;

        const newImage = await SliderImage.create({
            image: req.file.buffer,
            title,
        });

        res.status(201).json({ message: 'Image uploaded successfully', data: newImage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

exports.getAllImages = async (req, res) => {
    try {
        const images = await SliderImage.findAll({
            order: [['createdAt']]
        });

        const formattedImages = images.map(img => ({
            id: img.id,
            title: img.title,
            description: img.description,
            image: img.image ? Buffer.from(img.image).toString('base64') : null
        }));

        res.json(formattedImages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

exports.deleteImage = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await SliderImage.destroy({ where: { id } });
        if (!deleted) return res.status(404).json({ message: 'Image not found' });

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
