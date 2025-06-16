import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

jest.mock('../../services/api', () => ({
    login: jest.fn(),
    logout: jest.fn(),
}));

// Import the component and context
import TripRequestForm from '../TripRequestForm';
import { AuthContext } from '../../context/AuthContext';

// Mock react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

describe('TripRequestForm', () => {
    let mockFetch;
    let mockAlert;
    let mockConsoleError;
    let mockAuthValue; // This will hold the mocked AuthContext value

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        // Mock global fetch
        mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ message: 'Request submitted successfully!' }),
        });

        // Mock window.alert
        mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

        // Mock console.error
        mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

        // Default authenticated user for AuthContext
        mockAuthValue = {
            auth: { userId: 'test-user-123', token: 'fake-jwt-token' },
            login: jest.fn(),
            logout: jest.fn(),
        };
    });

    afterEach(() => {
        // Restore original functions after each test
        mockFetch.mockRestore();
        mockAlert.mockRestore();
        mockConsoleError.mockRestore();
    });

    // Helper to render component with mocked AuthContext
    const renderTripRequestFormWithContext = (authOverrides = {}) => {
        return render(
            <AuthContext.Provider value={{ ...mockAuthValue, ...authOverrides }}>
                <TripRequestForm />
            </AuthContext.Provider>
        );
    };

    test('renders all required form fields and a submit button', () => {
        renderTripRequestFormWithContext();

        expect(screen.getByLabelText(/Destination:/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Request Time:/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    });

    test('allows users to type into input fields', () => {
        renderTripRequestFormWithContext();

        const destinationInput = screen.getByLabelText(/Destination:/i);
        const requestTimeInput = screen.getByLabelText(/Request Time:/i);

        fireEvent.change(destinationInput, { target: { value: 'New York' } });
        fireEvent.change(requestTimeInput, { target: { value: '2025-07-20T10:00' } });

        expect(destinationInput).toHaveValue('New York');
        expect(requestTimeInput).toHaveValue('2025-07-20T10:00');
    });

    test('shows an alert and error to console if employeeId is missing', async () => {
        // Render with auth.userId being null
        renderTripRequestFormWithContext({ auth: { userId: null, token: 'fake-token' } });

        // Fill form fields (though they won't be used)
        fireEvent.change(screen.getByLabelText(/Destination:/i), { target: { value: 'Anywhere' } });
        fireEvent.change(screen.getByLabelText(/Request Time:/i), { target: { value: '2025-07-25T12:00' } });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
        });

        // Expect an alert message
        expect(mockAlert).toHaveBeenCalledTimes(1);
        expect(mockAlert).toHaveBeenCalledWith("Error: User ID not found. Please Log in again");

        // Expect a console error
        expect(mockConsoleError).toHaveBeenCalledTimes(1);
        expect(mockConsoleError).toHaveBeenCalledWith("Employee ID is missing in AuthContext.");

        // Ensure no fetch call was made
        expect(mockFetch).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });


    test('submits the form successfully with valid data', async () => {
        renderTripRequestFormWithContext();

        const destination = 'San Francisco';
        const requestTime = '2025-08-15T14:30';
        const employeeId = mockAuthValue.auth.userId; // Get the mocked user ID

        fireEvent.change(screen.getByLabelText(/Destination:/i), { target: { value: destination } });
        fireEvent.change(screen.getByLabelText(/Request Time:/i), { target: { value: requestTime } });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
        });

        await waitFor(() => {
            // Expect fetch to have been called with correct payload and headers
            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/trip-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${mockAuthValue.auth.token}`,
                },
                body: JSON.stringify({ destination, requestTime, employeeId }),
            });

            // Expect an alert for success
            expect(mockAlert).toHaveBeenCalledTimes(1);
            expect(mockAlert).toHaveBeenCalledWith('Trip request submitted!');

            // Expect form fields to be cleared
            expect(screen.getByLabelText(/Destination:/i)).toHaveValue('');
            expect(screen.getByLabelText(/Request Time:/i)).toHaveValue('');

            // Expect navigation to home
            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    test('displays an alert message when API call fails', async () => {
        // Mock fetch to reject or return a non-ok response
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ error: 'Server error occurred.' }),
        });

        renderTripRequestFormWithContext();

        // Fill form fields to allow submission
        fireEvent.change(screen.getByLabelText(/Destination:/i), { target: { value: 'Failed City' } });
        fireEvent.change(screen.getByLabelText(/Request Time:/i), { target: { value: '2025-11-01T09:00' } });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
        });

        await waitFor(() => {
            // Expect fetch to have been called
            expect(mockFetch).toHaveBeenCalledTimes(1);
            // Expect an alert with the error message
            expect(mockAlert).toHaveBeenCalledTimes(1);
            expect(mockAlert).toHaveBeenCalledWith('Server error occurred.');
            // Expect console.error to have been called
            expect(mockConsoleError).toHaveBeenCalledTimes(1);
        });

        // Ensure navigation did NOT occur on failure
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});