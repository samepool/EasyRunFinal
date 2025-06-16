const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file in the current directory (__dirname)
dotenv.config({ path: path.join(__dirname, '.env') });

// Log the DATABASE_URL immediately after attempting to load .env
console.log('DATABASE_URL from .env (in syncDatabase.js):', process.env.DATABASE_URL);

const db = require('./models');

db.sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synchronized successfully!');
    process.exit();
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
    console.error('Full error:', err);
    process.exit(1);
  });

console.log('After the sync attempt...');