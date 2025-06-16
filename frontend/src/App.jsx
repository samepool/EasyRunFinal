import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import CreateEmployee from './pages/CreateEmployee';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import TripList from './components/TripList';
import TripForm from './components/TripForm';
import TripRequestList from './components/TripRequestList';
import TripRequestForm from './components/TripRequestForm';
import CreateSchedule from './components/CreateSchedule';
import Schedule from './components/ScheduleList';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
function App() {
    return (
        <Router>
            <AuthProvider>
            <Routes>
                <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/employees" element={<PrivateRoute><EmployeeList /></PrivateRoute>} />
                <Route path="/employees/create" element={<PrivateRoute><CreateEmployee allowedRoles={['manager']} /></PrivateRoute>} />
                <Route path="/employees/edit/:id" element={<PrivateRoute><EmployeeForm allowedRoles={['manager']} /></PrivateRoute>} />
                <Route path="/trips" element={<PrivateRoute><TripList /></PrivateRoute>} />
                <Route path="/trips/new" element={<PrivateRoute><TripForm allowedRoles={['manager']}/></PrivateRoute>} />
                <Route path="/trip-requests" element={<PrivateRoute><TripRequestList allowedRoles={['manager', 'counselor']} /></PrivateRoute>} />
                <Route path="/trip-requests/create" element={<PrivateRoute><TripRequestForm allowedRoles={['manager', 'counselor']} /></PrivateRoute>} />
                <Route path="/schedules/create" element={<PrivateRoute><CreateSchedule allowedRoles={['manager']} /></PrivateRoute>} />
                <Route path="/schedules" element={<PrivateRoute><Schedule /></PrivateRoute>} />
                </Route>
            </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;