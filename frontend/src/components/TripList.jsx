import React, { useEffect, useState } from 'react';

//A List showing available trips.
export default function TripList() {
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/trips')
            .then(res => res.json())
            .then(data => setTrips(data))
            .catch(err => console.error('Error fetching trips:', err));
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <h2 className="text-xl font-bold mb-4">Trips</h2>
            {trips.length === 0 ? (
                <p>No trips found.</p>
            ) : (
                <ul>
                    {trips.map(trip => (
                        <li key={trip.id}>
                            <strong>{trip.destination}</strong> | {trip.status} <br />
                            {new Date(trip.startTime).toLocaleString()}{trip.endTime ? new Date(trip.endTime).toLocaleString() : 'TBD'}
                            <hr />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
