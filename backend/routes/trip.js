const express = require('express');
const { Trip, Employee } = require('../models');
const sendSMS = require('../utils/sendSMS');
const router = express.Router();

// Get all trips
router.get('/', async (req, res) => {
    try {
        const trips = await Trip.findAll({
            include: {
                model: Employee,
                attributes: ['id', 'name', 'email', 'role', 'phone']
            }
        });
        res.json(trips);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a trip
router.post('/', async (req, res) => {
    const { destination, startTime, endTime, status, employeeId } = req.body;

    try {
        // Check if employee exists before creating the trip
        if (employeeId) {
            const employee = await Employee.findByPk(employeeId);
            if (!employee) {
                return res.status(400).json({ error: 'Invalid employeeId - employee does not exist' });
            }
        }

        // Create Trip
        const trip = await Trip.create({ destination, startTime, endTime, status, employeeId });
        res.status(201).json(trip);
    } catch (err) {
        console.error('Error creating trip:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get Trip by ID
router.get('/:id', async (req, res) => {
    try {
        const trip = await Trip.findByPk(req.params.id, {
            include: {
                model: Employee,
                attributes: ['id', 'name', 'email', 'role', 'phone']
            }
        });

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        res.json(trip);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a trip
router.put('/:id', async (req, res) => {
    const { destination, startTime, endTime, status, employeeId } = req.body;

    try {
        const trip = await Trip.findByPk(req.params.id);
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        let employee;

        if (employeeId) {
            employee = await Employee.findByPk(employeeId);
            if (!employee) {
                return res.status(400).json({ error: 'Invalid staffId - employee does not exist.'});
            }
        }

        //Update Fields
        trip.destination = destination || trip.destination;
        trip.startTime = startTime || trip.startTime;
        trip.endTime = endTime || trip.endTime;
        trip.status = status || trip.status;
        trip.employeeId = employeeId || trip.employeeId;

        await trip.save();

        //Send SMS if employee has phone and trip has changed
        if (employee?.phone) {
            const msg = `Trip update:
Destination: ${trip.destination}
Start: ${new Date(trip.startTime).toLocaleString()}
End: ${new Date(trip.endTime).toLocaleString()}
Status: ${trip.status}`;

            await sendSMS(employee.phone, msg);
        }

        res.json(trip);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a trip
router.delete('/:id', async (req, res) => {
    try {
        const trip = await Trip.findByPk(req.params.id);
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        await trip.destroy();
        res.json({ message: 'Trip deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;