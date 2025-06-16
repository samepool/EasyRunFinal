import React, { useEffect, useState } from 'react';
import API from '../services/api';

//Shows the Schedules of the Employees and takes the data from created employees (employees have to be premade)
export default function ScheduleList() {
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        API.get('/schedules')
            .then(res => {
                console.log('Schedule Data:', res.data);
                setSchedules(res.data);
            })
            .catch(err => console.error('Failed to fetch schedule', err));
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <h2>All Schedules</h2>
            <ul>
                {schedules.map(schedule => (
                    <li key={schedule.id}>
                        <strong>{schedule.Employee?.name}</strong> |{" "}
                        {new Date(schedule.shiftStart).toLocaleString()} -{" "}
                        {new Date(schedule.shiftEnd).toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}
