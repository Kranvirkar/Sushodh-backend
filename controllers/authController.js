const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');// assuming Role is imported for proper include
const dotenv = require('dotenv');

dotenv.config({ path: './Config.env' });
// Register User
exports.registerUser = async (req, res) => {
    const { email, password, passwordConfirm, role } = req.body;

    if (!email || !password || !passwordConfirm || !role) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        if (password !== passwordConfirm) {
            return res.status(400).json({ msg: 'Passwords do not match' });
        }

        //const salt = await bcrypt.genSalt(12);
        //const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            email,
            password,
            role
        });

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const token = jwt.sign({ userId: user.id , role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};
