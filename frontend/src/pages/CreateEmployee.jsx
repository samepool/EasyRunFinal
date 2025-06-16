import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//component creates new employee accounts managing input, form submission and display feedback
export default function CreateEmployee() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'transportation',//Default role as will be most common employee creation type.
        phone: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };//Handles changes in field inputs for the form

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('http://localhost:3001/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Employee creation failed');

            alert('Employee created!');
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };//Sends POST Request for employee creation

    return (
    <div style={{ padding: '2rem' }}>
        <h2 className="text-xl font-bold mb-4">Create Employee</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label><br />
                <input name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
                <label>Email:</label><br />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
                <label>Password:</label><br />
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div>
                <label>Role:</label><br />
                <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="manager">Manager</option>
                    <option value="transportation">Transportation</option>
                    <option value="security">Security</option>
                    <option value="counselor">Counselor</option>
                </select>
            </div>
            <div>
                <label>Phone:</label><br />
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <button type="submit" style={{ marginTop: '1rem' }}>Create</button>
        </form>
    </div>
    );
}