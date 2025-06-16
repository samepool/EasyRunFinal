const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path')

const envFilePath = path.resolve(__dirname, './.env');
console.log(`[SERVER.JS] Attempting to load .env from: ${envFilePath}`);
const dotenvResult = dotenv.config({ path: path.resolve(__dirname, './.env') });


if (dotenvResult.error) {
    console.error('[SERVER.JS] *** DOTENV ERROR: Failed to load .env file! ***', dotenvResult.error);
    process.exit(1); // Exit if .env is critical and failed to load
} else if (dotenvResult.parsed) {
    console.log('[SERVER.JS] *** DOTENV SUCCESS: Loaded keys: ***', Object.keys(dotenvResult.parsed));
} else {
    console.log('[SERVER.JS] *** DOTENV INFO: No new variables parsed (might be empty or already loaded). ***');
}
console.log('[SERVER.JS] *** VERIFYING SUPABASE_URL immediately after dotenv.config():', process.env.SUPABASE_URL ? 'VALUE IS PRESENT' : 'VALUE IS UNDEFINED');
// --- END DOTENV DEBUG BLOCK ---

const sequelize = require('./config/db')

//Route Work
const employeeRoutes = require('./routes/employee');
const tripRoutes = require('./routes/trip');
const tripRequestRoutes = require('./routes/tripRequest');
const scheduleRoutes = require('./routes/schedule');
 //for test account creation

const app = express()

app.use(cors({
    origin: process.env.NODE_ENV === 'production'
    ? 'https://your-frontend-app.onrender.com'//replace when dealing with render
    : '*'
}));
app.use(express.json())

//--Api Main Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/trip-requests', tripRequestRoutes);
app.use('/api/schedules', scheduleRoutes);


// Dev-Tools and Seeding
if (process.env.NODE_ENV === 'development') {
    const devToolsRoutes = require('./dev-tools/dev-tools');
    const seedRoutes = require('./dev-tools/seed');
    app.use('/api/dev', devToolsRoutes);
    app.use('/api/seed', seedRoutes);
}

// Database sync Function
const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to PostgreSQL database');
        await sequelize.sync({ alter: true });
        console.log('Database Synced');
    } catch (error) {
        console.error('[SERVER.JS] Error syncing database', error);
        process.exit(1);
    }
};

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
    await syncDatabase();
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

