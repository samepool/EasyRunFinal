const express = require('express');
const bcrypt = require('bcryptjs');
const { Employee } = require('../models');

const router = express.Router();

router.post('/test-manager', async (req, res) => {
    try {
        const existing = await Employee.findOne({ where: { email: 'manager@example.com' } });
        if (existing) return res.status(409).json({ message: 'Manager already exists' });


        const manager = await Employee.create({
            name: 'Test Manager',
            email: 'manager@example.com',
            password: 'testmanager123',
            role: 'manager',
            phone: '123-456-7890',
            status: 'available',
        });

        res.status(201).json({ message: 'Test manager created', id: manager.id});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating test manager' });
    }
});

module.exports = router;//Test Manager Data to get the ball rolling.