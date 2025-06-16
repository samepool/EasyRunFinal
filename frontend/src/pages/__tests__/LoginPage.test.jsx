import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

import { AuthContext } from '../../context/AuthContext';
import LoginPage from '../Login';

jest.mock('../../services/api');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    BrowserRouter: ({ children }) => <div>{children}</div>,
}));

let mockAuth = null;

const setMockAuth = (newAuth) => {
    act(() => {
        mockAuth = newAuth;
    });
};

//Mock react-router-dom's useNavigate hook
const mockLogin = jest.fn(async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 50));

    if (email === 'user@example.com' && password === 'password') {
        setMockAuth({ token: 'fake-token-123', user: { id: 1, role: 'security' } });
        return { success: true, token: 'fake-token-123' };
    } else {
        setMockAuth(null);
        throw new Error('Invalid credentials provided.');
    }
});

const mockLogout = jest.fn(() => {
    setMockAuth(null);
});

const renderLoginPageWithContext = (authContextValueOverrides) => {
    return render(
        <div>
            <AuthContext.Provider value={{
                auth: mockAuth,
                loading: false,
                login: mockLogin,
                logout: mockLogout,
                ...authContextValueOverrides
            }}>
                <LoginPage />
            </AuthContext.Provider>
        </div>
    );
};

describe('LoginPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockAuth = null;
    });

    //Renders input fields and buttons to ensure all is present
    test('renders email, password inputs, and login button', () => {
        renderLoginPageWithContext();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    });

    //Tests Fields can be filled
    test('updates input fields on change', () => {
        renderLoginPageWithContext();
        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Password/i);

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('password123');
    });

    //Display Error message on failed login attempt
    test('displays error message on failed login attempt', async () => {
        mockLogin.mockImplementationOnce(async (email, password) => {
            await new Promise(resolve => setTimeout(resolve, 50));
            throw new Error('Invalid credentials provided.');
        });
        
        renderLoginPageWithContext();

        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalid@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrong' } });
        
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Login/i }));
        });

        await waitFor(() => {
            expect(screen.getByText(/Invalid credentials provided./i)).toBeInTheDocument();
        });

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    //Redirect to Homepage
    test('redirects to home if user is already authenticated', async () => {
        mockAuth = { token: 'already-logged-in', user: { id: 1, role: 'manager' } };
        
        renderLoginPageWithContext();

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });
});