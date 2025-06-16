import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

//Function to Fetch Employees
    const fetchEmployees = () => {
        setLoading(true);
        setError(null);
        API.get('/employees')
            .then(res => {
                console.log('Employee Data:', res.data);
                setEmployees(res.data);
            })
            .catch(err => {
                console.error('Failed to fetch employees:', err);
                setError(err.response?.data?.error || err.message || 'Failed to load employees.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

// Delete Function
    const handleDelete = (employeeId) => {
        if (window.confirm('Are you sure you want to PERMANENTLY delete this employee?')) {
            API.delete(`/employees/${employeeId}`)
                .then(() => {
                    alert('Employee deleted successfully');
                    setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== employeeId));
                })
                .catch(err => {
                    console.error('Failed to delete employee:', err);
                    alert(err.response?.data?.error || err.message || 'Failed to delete.');
                });
        }
    };

// Edit Function ()
const handleEdit = (employeeId) => {
    navigate(`/employees/edit/${employeeId}`);
};
if (loading) {
    return <div>Loading Employees...</div>;
}

if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
}
return (
    <div>
        <h2>Employee List</h2>

        {employees.length === 0 ? (
            <p>No employees found.</p>
        ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ background: '#f2f2f2' }}>
                        <th style={tableHeaderStyle}>Name</th>
                        <th style={tableHeaderStyle}>Email</th>
                        <th style={tableHeaderStyle}>Role</th>
                        <th style={tableHeaderStyle}>Status</th>
                        <th style={tableHeaderStyle}>Phone</th>
                        <th style={tableHeaderStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => (
                        <tr key={emp.id}>
                            <td style={tableCellStyle}>{emp.name}</td>
                            <td style={tableCellStyle}>{emp.email}</td>
                            <td style={tableCellStyle}>{emp.role}</td>
                            <td style={tableCellStyle}>{emp.status}</td>
                            <td style={tableCellStyle}>{emp.phone}</td>
                            <td style={tableCellStyle}>
                                <button onClick={() => handleEdit(emp.id)} style={{ marginRight: '5px', padding: '5px 10px', cursor: 'pointer' }}>
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(emp.id)} style={{ padding: '5px 10px', cursor: 'pointer', background: '#dc3545', color:'white', border: 'none' }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
);
}

const tableHeaderStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left'
};
const tableCellStyle = {
    border: `1px solid #ddd`,
    padding: '8px'
};