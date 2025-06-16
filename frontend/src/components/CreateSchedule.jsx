import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';


//Schedule creation function
export default function CreateSchedule() {
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        shiftStart: '',
        shiftEnd: '',
        employeeId: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { auth } = useAuth();

    //fetches list of employees
    useEffect(() => {
        const fetchEmployees = async () => {
        try {
            const res = await API.get('/employees');
            setEmployees(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Error fetching employees:', err);
            setEmployees([]);
        }
        };

        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    //Handles the submission of the schedule creation form.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await API.post('/schedules', formData);
            alert('Schedule created!');
            navigate('');
        } catch (err) {
            setError(err.response?.data?.error || 'failed to create schedule');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Create Schedule</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Employee:</label><br />
                    <select name="employeeId" value={formData.employeeId} onChange={handleChange} required>
                        <option value="">Select Employee</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>
                                {emp.name} ({emp.role})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Shift Start:</label><br />
                    <input type="datetime-local" name="shiftStart" value={formData.shiftStart} onChange={handleChange} required />
                </div>
                <div>
                    <label>Shift End:</label><br />
                    <input type="datetime-local" name="shiftEnd" value={formData.shiftEnd} onChange={handleChange} required />
                </div>
                <button type="submit" style={{ marginTop: '1rem' }}>Create Schedule</button>
            </form>
        </div>
    );
}