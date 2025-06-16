const sequelize = require('./config/db');
const { Employee, Trip, Schedule, TripRequest } = require('./models');
const seedData = require('./routes/seed'); // assuming this sets up test accounts

const runReset = async () => {
    try {
        console.log('🔁 Dropping database...');
        await sequelize.drop();

        console.log('🔄 Syncing models...');
        await sequelize.sync({ force: true });

        console.log('🌱 Seeding data...');
    

        console.log('✅ Database reset and seeded.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed to reset DB:', err);
        process.exit(1);
    }
};

runReset(); //Reset Entire Database
