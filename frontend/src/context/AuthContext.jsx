import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'; 
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

//Provides Data Context for app to function and related functions.
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Store navigate in a ref, initialize it later in an effect
    const navigateRef = useRef(null); 
    const actualNavigate = useNavigate();

    // Assign the result of useNavigate to the ref once
    useEffect(() => { 
        if (navigateRef.current === null) {
            navigateRef.current = actualNavigate;
            console.log('AuthContext: useNavigate initialized in ref.');
        }
    }, [actualNavigate]); 

    // Debugging: Log initial/current auth state from AuthProvider
    useEffect(() => {
        console.log('AuthContext: Current auth state in provider:', auth);
    }, [auth]);

    // Function to Load auth data from localStorage on app start
    const loadAuthFromLocalStorage = useCallback(() => {
        console.log('AuthContext: Attempting to load from localStorage');
        try {
            const storedAuth = localStorage.getItem('auth');
            if (storedAuth) {
                const parsedAuth = JSON.parse(storedAuth);
                // Ensure parsedAuth.name exists if you rely on it for display
                if (parsedAuth.token && parsedAuth.userId && parsedAuth.name && parsedAuth.role) { // Added parsedAuth.name for completeness
                    setAuth(parsedAuth);
                    console.log('AuthContext: Successfully loaded auth from localStorage:', parsedAuth);
                } else {
                    console.warn('AuthContext: Invalid/incomplete auth data in localStorage. Clearing.');
                    localStorage.removeItem('auth');
                    setAuth(null);
                }
            } else {
                console.log('AuthContext: No auth data found in localStorage');
            }
        } catch (error) {
            console.error("AuthContext: Failed to parse auth from localStorage:", error);
            localStorage.removeItem('auth');
            setAuth(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAuthFromLocalStorage();
    }, [loadAuthFromLocalStorage]);

    const login = useCallback(async (email, password) => {
        setLoading(true); // Corrected typo: setLoading
        try {
            console.log(`AuthContext: Attempting login for username: ${email}`);
            const response = await API.post('/employees/login', { email, password });
            const { token, role, userId, name } = response.data;

            if (!token || !userId || !name || !role) {
                console.error('AuthContext: Backend /employees/login did not return complete user data (id, name, role).', user);
                throw new Error('Incomplete user data from server.'); // Corrected typo: fr server -> from server
            }

            const newAuth = { token, userId, name, role };
            console.log('AuthContext: Login Successful, setting new auth state:', newAuth);

            localStorage.setItem('auth', JSON.stringify(newAuth));
            setAuth(newAuth);
            
            // Use the navigate from the ref
            if (navigateRef.current) {
                navigateRef.current('/');
            } else {
                console.warn('AuthContext: navigate function not yet available during login redirect.');
            }
            return { success: true };
        } catch (error) {
            console.error(`AuthContext: Login failed:`, error.response?.data?.message || error.message);
            setAuth(null);
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        } finally {
            setLoading(false);
        }
    }, []); 

    const logout = useCallback(() => {
        console.log('AuthContext: Performing logout...');
        localStorage.removeItem('auth');
        setAuth(null);
        
        
        if (navigateRef.current) {
            navigateRef.current('/login');
        } else {
            console.warn('AuthContext: navigate function not yet available during logout redirect.');
        }
        console.log('AuthContext: Logout complete, redirected to /login.');
    }, []); 

    const value = { auth, loading, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};