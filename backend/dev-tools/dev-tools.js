const express = require('express');
const router = express.Router();
const { Employee } = require('../models');

router.delete('/purge/employees', async (req, res) => {
    try {
        await Employee.destroy({ where: {}, truncate: true, cascade: true });
        res.status(200).json({ message: 'All employees purged (dev only)' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to purge employees' });
    }
});

module.exports = router;
//Emergency Employee Purge dev-tool