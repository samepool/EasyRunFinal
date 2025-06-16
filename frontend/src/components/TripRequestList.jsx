import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function TripRequestList() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        API.get('/trip-requests')
            .then(res => {
                console.log('Trip Request Data:', res.data);
                setRequests(res.data);
            })
            .catch(err => console.error('Error fetching trip requests:', err));
    }, []);//calls Trip Request Data from the database via api.


    return (
        <div style={{ padding: '2rem'}}>
            <h2 className="text-xl font-bold mb-4">Trip Requests</h2>
            {requests.length === 0 ? (
                <p>No Trip requests found.</p>
            ) : (
                <ul>
                    {requests.map(req => (
                        <li key={req.id}>
                            <strong>{req.destination}</strong> | {req.status} <br />
                            Requested; {new Date(req.requestTime).toLocaleString()}
                            <hr />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}