'use strict';
const path = require('path')
const fs = require('fs');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

console.log('SUPABASE_URL from .env (in models/index.js):', process.env.SUPABASE_URL);

const sequelize = new Sequelize(process.env.SUPABASE_URL, {
  dialect: 'postgres',
  logging: false, 
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
    keepAlive: true,
  },
});

// Auto-load all models in the models folder
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
    console.log(`Loaded model: ${model.name}`);
  });

//Employee relations
if (db.Employee && db.Schedule) {
    db.Schedule.belongsTo(db.Employee, { foreignKey: 'employeeId', onDelete: 'SET NULL', onUpdate: 'CASCADE'});
}
if (db.Employee && db.Trip) {
    db.Trip.belongsTo(db.Employee, { foreignKey: 'employeeId' , onDelete: 'SET NULL', onUpdate: 'CASCADE' });
}
if (db.Employee && db.TripRequest) {
    db.TripRequest.belongsTo(db.Employee, { foreignKey: 'employeeId', onDelete: 'SET NULL', onUpdate: 'CASCADE'});
}


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
