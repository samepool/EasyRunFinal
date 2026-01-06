import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

function EmployeeForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth, loading: authLoading, logout } = useAuth();

    //initializes the form data with default values
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        status: 'available',
        role: 'transportation'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //fetches employee data if id is present and handles authorization
    useEffect(() => {
        if (authLoading) return;
        if (!auth || !auth.token) {
            navigate('/login');
            return;
        }

        //If authorization is valid
        if (id) {
            if (auth.role !== 'manager' && auth.userId !== parseInt(id)) {
                alert('Access Denied: Management Only.')
                navigate('/employees');
                return;
            }
            const fetchEmployee = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await API.get(`/employees/${id}`);
                    setFormData({
                        name: response.data.name ||'',
                        email: response.data.email || '',
                        phone: response.data.phone || '',
                        status: response.data.status || 'available',
                        role: response.data.role || 'transportation',
                        password: '',
                    });
                    console.log(`EmployeeForm: Fetched employee ${id} for editing.`);                  
                } catch (err) {
                    setError(err.response?.data?.error ||  err.message || 'Error loading employee data');
                    console.error("EmployeeForm: Error fetching employee for edit:", err);
                    if (err.response?.status === 401) { logout(); }
                } finally {
                    setLoading(false);
                }
            };
            fetchEmployee();
        } else {
            if (auth.role !== 'manager') {
                alert('Access Denied: Managers Only');
                navigate('/employees');
                return;
            }
            setLoading(false);
        }
    }, [id, auth, authLoading, navigate, logout]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    //handles form submission for creating and updating employees
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const dataToSend = { ...formData };
        if (id) {
            if (dataToSend.password === '') {
                delete dataToSend.password;
            }
        } else {
            if (!dataToSend.password) {
                setError('Password is required for employee creation');
                setLoading(false);
                return;
            }
        }

        try {
            let response;
            if (id) {
                response = await API.put(`/employees/${id}`, dataToSend);
                console.log(`EmployeeForm: Emplyee ${id} updated.`, response.data);
            } else {
                response = await API.post('/employees', dataToSend);
                console.log('EmployeeForm: New Employee Created', response.data);
            }

            alert(`Employee ${id ? 'updated' : 'created'} successfully!`);
            navigate('/employees');
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || err.message || `Submission failed.` );
            console.error('EmployeeForm: Submission error:', err.response?.data || err.message);
            if (err.response?.status === 401) { logout(); }
            if (err.response?.status === 403) {
                alert('Access Denied');
                navigate('/employees');
            } 
        } finally {
            setLoading(false);
        }
    };

    //Loading message
    if (authLoading || loading) {
        return <div>Loading form...</div>;
    }

    //Error message
    if (error) {
        return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>
    }

    //Unauthorized user warning
    if (!auth || (id && auth.role !== 'manager' && auth.userId !== parseInt(id)) || (!id && auth.role !== 'manager')) {
        return <div style ={{ color: 'red', padding: '20px' }}>You are not authorized for this form</div>
    }


    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h1>{id ? 'Edit Employee' : 'Add New Employee'}</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label htmlFor="name" style={{ display: 'block', marginBottom: '5px'}}>Full Name:</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
                </div>
                <div>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px'}}>Email:</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
                </div>
                {!id && (
                    <div>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '5px'}}>Password:</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} style={inputStyle} />
                    </div>
                )}
                {id && (
                    <div>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '5px'}}>New Password (leave blank to keep current):</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} style={inputStyle} />
                    </div>
                )}
                <div>
                    <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px'}}>Phone Number:</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required style={inputStyle} />
                </div>
                <div>
                    <label htmlFor="status" style={{ display: 'block', marginBottom: '5px' }}>Status:</label>
                    <select id="status" name="status" value={formData.status} onChange={handleChange} required style={inputStyle}>
                        <option value="available">Available</option>
                        <option value="on_duty">On Duty</option>
                        <option value="off_duty">Off Duty</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="role" style={{ display: 'block', marginBottom: '5px' }}>Role:</label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                        disabled={!auth || auth.role !== 'manager'}
                    >
                        <option value="manager">Manager</option>
                        <option value="counselor">Counselor</option>
                        <option value="transportation">Transportation</option>
                        <option value="security">Security</option>
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button type="submit" disabled={loading} style={buttonStyle}>
                        {loading ? 'Processing...' : (id ? 'Update Employee' : 'Create Employee')}
                    </button>
                    <button type="button" onClick={() => navigate('/employees')} disabled={loading} style={{ ...buttonStyle, background: '#6c757d' }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EmployeeForm;
const inputStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box'
};

const buttonStyle = {
    padding: '10px 15px',
    borderRadius: '4px',
    border: 'none',
    background: '#007bff',
    color: 'white',
    cursor: 'pointer',
    flexGrow: 1
};
