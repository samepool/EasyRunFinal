import React, { useState } from 'react';

//creates the trips that employees will follow (meaning that they were approved but that functionality comes later)
export default function TripForm() {
    const [destination, setDestination] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [status, setStatus] = useState('pending');
    const [employeeId, setemployeeId] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newTrip = {
            destination,
            startTime,
            endTime,
            status,
            employeeId
        }; //handles submission of the form data and what constitutes a trip request

        try {
            const res = await fetch('http://localhost:3001/api/trips', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTrip)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Trip creation failed');
            }

            alert('Trip created');
        } catch (err) {
            console.error('Error creating trip:', err);
            alert(err.message);
        }
    };

    return (
        <div style={{ padding: '2rem'}}>
            <h2 className="text-xl font-bold mb-4">Create Trip</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Destination:</label><br />
                    <input value={destination} onChange={(e) => setDestination(e.target.value)} required />
                </div>
                <div>
                    <label>Start Time:</label><br />
                    <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required/>
                </div>
                <div>
                    <label>End Time:</label>
                    <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
                <div>
                    <label>Status:</label><br />
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <div>
                    <label>Employee ID:</label><br />
                    <input type="number" value={employeeId} onChange={(e) => setemployeeId(e.target.value)} required />
                </div>
                <button type="submit" style={{ marginTop: '1rem'}}>Submit Trip</button>
            </form>
        </div>
    );
}