const express = require('express');
const { Schedule, Employee } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get all schedules
router.get('/', authenticateToken, authorizeRoles('manager'), async (req, res) => {
    try {
        const schedules = await Schedule.findAll({
            include: {
                model: Employee,
                attributes: ['id', 'name', 'email', 'role', 'phone']
            }
        });
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Create a schedule
router.post('/', authenticateToken, authorizeRoles('manager'), async (req, res) => {
    const { shiftStart, shiftEnd, employeeId } = req.body;

    try {
        //check that employee exists
        const employee = await Employee.findByPk(employeeId);
        if (!employee) {
            return res.status(400).json({ error: 'Invalid employeeId - employee does not exist' });
        }

        //Create the Schedule
        const schedule = await Schedule.create({ shiftStart, shiftEnd, employeeId });
        res.status(201).json(schedule);
    } catch (err) {
        console.error('Error creating schedule:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;