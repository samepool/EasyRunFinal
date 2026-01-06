import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


//Login Function handling email and password input
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, auth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth && auth.token) {
            navigate('/');
        }
    }, [auth, navigate]);

    //Handles login submission and prevents default form submission and clears any previous error messages.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
          const result = await login (email, password);

          if (result && !result.success) {
            setError(result.message);
          }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred during login.');
        }
    };

    return (
        <div style={{ padding: '2rem'}}>
            <h2 className="text-xl font-bold mb-4">Login</h2>
            {error && <p style={{ color: 'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:<br />
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    </label>
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <label>Password:<br />
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    </label>
                </div>
                <button type="submit" style={{ marginTop: '1rem' }}>
                    Login
                </button>
            </form>
        </div>
    );
}
