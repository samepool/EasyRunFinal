const express = require('express');
const cors = require('cors');

console.log('[SERVER.JS] *** VERIFYING SUPABASE_URL after dotenv.config():', process.env.SUPABASE_URL ? 'VALUE IS PRESENT' : 'VALUE IS UNDEFINED');

const db = require('./models');
const sequelize = db.sequelize;

//Route Work
const employeeRoutes = require('./routes/employee');
const tripRoutes = require('./routes/trip');
const tripRequestRoutes = require('./routes/tripRequest');
const scheduleRoutes = require('./routes/schedule');
 //for test account creation

const app = express()

app.use(cors({
    origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : 'http://localhost:5173'
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

