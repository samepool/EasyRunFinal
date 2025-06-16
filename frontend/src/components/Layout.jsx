import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Outlet } from 'react-router-dom';


//Layout of the App page.
export default function Layout({ children }) {
    const { auth, logout } = useAuth();

    return (
      <div style={styles.container}>
        <header style={styles.header}>
            <div style={styles.logo}>
                <Link to="/" style={styles.logoLink}>Easy Run</Link>
            </div>
            <nav style={styles.nav}>
                <ul style={styles.navList}>
                    <li style={styles.navItem}><Link to ="/" style={styles.navLink}>Home</Link></li>

                    {auth && auth.role === 'manager' && (
                        <>
                            <li style={styles.navItem}><Link to="/employees/create" style={styles.navLink}>New Employee</Link></li>
                            <li style={styles.navItem}><Link to="/trips/new" style={styles.navLink}>New Trip</Link></li>
                            <li style={styles.navItem}><Link to="/schedules/create" style={styles.navLink}>New Schedule</Link></li>
                        </>
                    )}
                    {auth && ['manager','counselor'].includes(auth.role) && (
                        <>
                            <li style={styles.navItem}><Link to="/trip-requests/create" style={styles.navLink}>New Trip Request</Link></li>
                            <li style={styles.navItem}><Link to="/trip-requests" style={styles.navLink}>Trips Pending</Link></li>
                        </>
                    )}
                    {auth && (
                        <>
                            <li style={styles.navItem}><Link to="/employees" style={styles.navLink}>Employees</Link></li>
                            <li style={styles.navItem}><Link to="/trips" style={styles.navLink}>Trips</Link></li>
                            <li style={styles.navItem}><Link to="/schedules" style={styles.navLink}>Schedules</Link></li>
                        </>
                    )}
                   
                </ul>
            </nav>
            <div style={styles.userInfo}>
                {auth?.name ? (
                    <>
                        <span style={styles.welcomeText}>Welcome, {auth.name} ({auth.role})</span>
                        <button onClick={logout} style={styles.logoutButton}>Logout</button>
                    </>
                ) : (
                    <Link to="/login" style={styles.loginLink}>Login</Link>
                )}
            </div>
        </header>

        <main style={styles.mainContent}>
            <Outlet />
        </main>

        <footer style={styles.footer}>
            <p>&copy; {new Date().getFullYear()} Poole Programming</p>
        </footer>
      </div>
    );
}

const styles= {
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    header: {
        background:'#333',
        color: '#fff',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    },
    logo: {
        flex: 1,
    },
    logoLink: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    nav: {
        flex: 2,
        display: 'flex',
        justifyContent: 'center',
    },
    navList: {
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
    },
    navItem: {
        margin: '0 1rem',
    },
    navLink: {
        color: '#fff',
        textDecoration: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        transition: 'background-color 0.3s ease',
    },
    userInfo: {
        flex: 1,
        textAlign: 'right',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    welcomeText: {
        marginRight: '1rem',
        fontSize: '0.9rem',
    },
    logoutButton: {
        background: '#dc3545',
        color: '#fff',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'background-color 0.3s ease',
    },
    loginLink: {
        color: '#fff',
        textDecoration: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        backgroundColor: '#007bff',
    },
    mainContent: {
        flex: 1,
        padding: '2rem',
    },
    footer: {
        background: '#333',
        color: '#fff',
        textAlign: 'center',
        padding: '1rem 0',
        marginTop: 'auto',
    },
};