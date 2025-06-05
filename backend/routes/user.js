const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const authMiddleware = require('../middleware/AuthMiddleware');

// Get current user profile (includes username and name)
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('email username firstName lastName preferences');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});


// Update Email
router.post('/update-email', authMiddleware, async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: 'Email is required' });

    try {
        await User.findByIdAndUpdate(req.user.id, { email });
        res.json({ message: 'Email updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update email' });
    }
});

// Update Password
router.post('/change-password', authMiddleware, async (req, res) => {
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
        return res.status(400).json({ error: 'Both password fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update password' });
    }
});

// Update profile fields
router.post('/update-profile', authMiddleware, async (req, res) => {
    const { username, firstName, lastName, preferences } = req.body;

    const updateFields = {
        ...(username && { username }),
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
    };

    if (preferences) {
        updateFields.preferences = {};
        if (preferences.currencySymbol) updateFields.preferences['currencySymbol'] = preferences.currencySymbol;
    }

    try {
        await User.findByIdAndUpdate(req.user.id, updateFields, { new: true });
        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});



module.exports = router;
