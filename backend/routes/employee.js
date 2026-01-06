const express = require('express');
const { Employee } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY


// GET all Employees - Managers only
router.get('/', authenticateToken, authorizeRoles('manager'), async (req, res) => {
    console.log('User making request:', req.user);
    console.log('🛡️ Authenticated user:', req.user);
    try {
        const employees = await Employee.findAll();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Get employee by ID

router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        if (req.user.role !== 'manager' && req.user.id !== employee.id) {
            return res.status(403).json({ error: 'Access Denied' });
        }

        res.json(employee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new Employee
router.post('/', async (req, res) => {
    try {
        const { name, email, password, status, role, phone } = req.body;

        // Check if Email already exists
        const existingEmployee = await Employee.findOne({ where: { email } });
        if (existingEmployee) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const employee = await Employee.create({ name, email, password, status, role, phone });

        //return the Employee without the password
        const { password: _, ...employeeData} = employee.get({ plain: true });
        res.status(201).json(employeeData); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Update employee
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        
        if (req.user.role !== 'manager' && req.user.id !== employee.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const { name, email, password, status, role, phone } = req.body;

        //Update Fields only if provided
        if (name) employee.name = name;
        if (email) employee.email = email;
        if (password) employee.password = password;
        if (status) employee.status = status;
        if (role) employee.role = role;
        if (phone) employee.phone = phone;

        await employee.save();
        
        const { password: _, ...updatedEmployee } = employee.get({ plain: true });
        res.json(updatedEmployee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Delete employee
router.delete('/:id', authenticateToken, authorizeRoles('manager'), async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        await employee.destroy();
        res.json({ message: 'Employee deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Employee Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const employee = await Employee.findOne({ where: { email } });
        if (!employee) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Validate password using bcrypt
        const isPasswordValid = await employee.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {id: employee.id, role: employee.role },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.json({ token, role: employee.role, userId: employee.id, name: employee.name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
