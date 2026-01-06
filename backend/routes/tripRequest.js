const express = require('express');
const { TripRequest, Employee } = require('../models');

const router = express.Router();

// Get all Trip requests
router.get('/', async (req, res) => {
    try {
        const requests = await TripRequest.findAll({
            include: {
                model: Employee,
                attributes: ['id', 'name', 'email', 'role']
            }
        });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Single trip request by Id
router.get('/:id', async (req, res) => {
    try {
        const request = await TripRequest.findByPk(req.params.id, {
            include: {
                model: Employee,
                attributes: ['id', 'name', 'email', 'role']
            }
        });

        if (!request) {
            return res.status(404).json({ error: 'Trip request not found'});
        }

        res.json(request);
    } catch (err) {
        res.status(500).json({ error:err.message });
    }
});

//Create a trip request
router.post('/', async (req, res) => {
    const { destination, requestTime, employeeId } = req.body;

    try {
        //Check if employee exists
        const employee = await Employee.findByPk(employeeId);
        if (!employee) {
            return res.status(400).json({ error: 'Invalid employeeId -employee not found' });
        }

        const request = await TripRequest.create({
            destination,
            requestTime,
            employeeId
        });

        res.status(201).json(request);
    } catch (err) {
        console.error('Error creating trip request:', err);
        res.status(500).json({ error: err.message });
    }
});

//Update a trip request
router.put('/:id', async (req, res) => {
    const { destination, requestTime, status, employeeId } = req.body;

    try {
        const request = await TripRequest.findByPk(req.params.id);
        if (!request) {
            return res.status(404).json({ error: 'Trip request not found'});
        }

        if (employeeId) {
            const employee = await Employee.findByPk(employeeId);
            if (!employee) {
                return res.status(400).json({ error: 'Invalid employeeId - employee not found'});
            }
        }

        request.destination = destination || request.destination;
        request.requestTime = requestTime || request.requestTime;
        request.status = status || request.status;

        if (employeeId) {
            request.employeeId = employeeId;
        }

        await request.save();

        res.json(request);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Delete a trip request
router.delete('/:id', async (req, res) => {
    try {
        const request = await TripRequest.findByPk(req.params.id);
        if (!request) {
            return res.status(404).json({ error: 'Trip request not found' });
        }

        await request.destroy();
        res.json({ message: 'Trip request deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

