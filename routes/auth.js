const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'zeroshield_ai_super_secret_key_2026';

const users = [];

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        let user;
        try {
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ error: "User already exists" });
            }
            user = new User({ name, email, password, role: 'admin' });
            await user.save();
        } catch (dbErr) {
            // Degraded array mode fallback
            if (users.find(u => u.email === email)) {
                return res.status(400).json({ error: "User already exists" });
            }
            user = { _id: String(Date.now()), name, email, password, role: 'admin' };
            users.push(user);
        }
        
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: { name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        let user;
        let isMatch = false;
        
        try {
            user = await User.findOne({ email });
            if (user) {
                isMatch = await user.comparePassword(password);
            }
        } catch (dbErr) {
            // Degraded array mode fallback
            user = users.find(u => u.email === email);
            if (user) {
                isMatch = (user.password === password);
            }
        }

        if (!user || !isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token, user: { name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
