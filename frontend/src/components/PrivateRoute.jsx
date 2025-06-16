import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

//Establishes private routes for the app allowing approved profiles to access data.
export default function PrivateRoute(props) {
    const { children, allowedRoles } = props;    
    const { auth, loading } = useAuth();

    console.log(`PrivateRoute for path: ${window.location.pathname}`);
    console.log(' PrivateRoute - Auth object:', auth);
    console.log(' PrivateRoute - Is Loading:', loading);
    console.log(' PrivateRoute - Allowed Roles (props):', allowedRoles);

    if (loading) {
        console.log(' PrivateRoute - Auth state loading...');
        return <div>Loading authentication...</div>;
    }

    if (!auth || !auth.token) {
        console.log(' PrivateRoute - No token found. Redirecting to /login');
        return <Navigate to="/login" replace />;
    }

    // if a allowed Role is provided, check user's role
    if (allowedRoles && allowedRoles.length > 0) {
        console.log(' PrivateRoute - Checking roles. User role:', auth.role, 'Expected:', allowedRoles);
        if (!auth.role || !allowedRoles.includes(auth.role)) {
            console.warn(`Access Denied: User role '${auth.role}' not in allowed roles: ${allowedRoles.join(', ')}`);
            return <Navigate to="/unauthorized" replace />;
        }
        console.log(' PrivateRoute - Role check passed. User role is in allowed roles.');
    } else {
        console.log(' PrivateRoute - No specific allowedRoles provided. Any authenticated user can access.');
    }

    console.log(' PrivateRoute - Access Granted to Component.');
    
    return children;
}