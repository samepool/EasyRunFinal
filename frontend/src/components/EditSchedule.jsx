import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


//Edit Schedule Route TO BE IMPLEMENTED
export default function EditSchedule() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        shiftStart: '',
        shiftEnd: '',
        employeeId: '',
    });
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:3000/api/schedules/${id}`)
            .then(res => res.json())
            .then(data => {
                setFormData({
                    shiftStart: data.shiftStart,
                    shiftEnd: data.shiftEnd,
                    employeeId: data.employeeId
                });
            });
        
        fetch('http://localhost:3000/api/employees')
            .then(res => res.json())
            .then(setEmployees);
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        await fetch(`http://localhost:3000/api/schedules/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        alert('Schedule updated!');
        navigate('/schedules');
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Edit Schedule</h2>
            <form onSubmit={handleSubmit}>
                <select name="employeeId" value={formData.employeeId} onChange={handleChange}>
                    {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                </select>
                <input type="datetime-local" name="shiftStart" value={formData.shiftStart} onChange={handleChange} />
                <input type="datetime-local" name="shiftEnd" value={formData.shiftEnd} onChange={handleChange} />
                <button type="submit">Update</button>
            </form>
        </div>
    );
}