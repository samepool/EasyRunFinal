const { Sequelize } = require('sequelize');

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
const sequelize = new Sequelize(process.env.SUPABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

module.exports = sequelize;