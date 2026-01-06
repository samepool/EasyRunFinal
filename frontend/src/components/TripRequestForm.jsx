import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

//The form generates the Trip Requests for the database which are viewed in TripRequestList.jsx
export default function TripRequestForm() {
    const [destination, setDestination] = useState('');
    const [requestTime, setRequestTime] = useState('');
    const { auth } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const employeeId = auth?.userId;
        if (!employeeId) {
            alert("Error: User ID not found. Please Log in again");
            console.error("Employee ID is missing in AuthContext.");
            return;
        }

        const newRequest = { destination, requestTime, employeeId };
        
        try {
            //3. USE API SERVICE: No hardcoded URL, no manual headers
            const res = await API.post('/trip-requests', newRequest);
            alert('Trip request submitted!');
            setDestination('');
            setRequestTime('');
            navigate('/');
        } catch (err) {
            console.error("Error submitting request:", err);
            //4.AXIOS ERROR HANDLING
            alert(err.response?.data?.error || 'Request failed');
        }
    //     try {
    //         const res = await fetch('http://localhost:3001/api/trip-requests', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json',
    //                         Authorization: `Bearer ${auth?.token}`,
    //              },
    //             body: JSON.stringify(newRequest),
    //         });

    //         const data = await res.json();

    //         if (!res.ok) throw new Error(data.error || 'Request failed');

    //         alert('Trip request submitted!');
    //         setDestination('');
    //         setRequestTime('');
    //         navigate('/');
    //     } catch (err) {
    //         console.error("Error submitting request:", err);
    //         alert(err.message);
    //     }
    };//ensures that appropriate people are able to submit a trip-request.

    return (
        <div style={{ padding: '2rem' }}>
            <h2 className="text-xl font-bold mb-4">Request a Trip</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="destination">Destination:</label><br />
                    <input id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} required />   
                </div>
                <div>
                <label htmlFor="requestTime">Request Time:</label><br />
                <input id="requestTime" type="datetime-local" value={requestTime} onChange={(e) => setRequestTime(e.target.value)} required />
                </div>
                <button type="submit" style={{ marginTop: '1rem' }}>Submit Request</button>
            </form>
        </div>
    );
 }
