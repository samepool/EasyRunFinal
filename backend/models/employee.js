
const bcrypt = require('bcryptjs');


module.exports = (sequelize, DataTypes) => {
    const Employee = sequelize.define('Employee', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                const hashedPassword = bcrypt.hashSync(value, 10);
                this.setDataValue('password', hashedPassword);
            }
        },
        status: {
            type: DataTypes.ENUM('available', 'unavailable'),
            defaultValue: 'available',
        },
        role: {
            type: DataTypes.ENUM('manager', 'transportation', 'security', 'counselor'),
            defaultValue: 'transportation',
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    });

    Employee.prototype.validatePassword = async function(password) {
        return await bcrypt.compare(password, this.password);
    };

    return Employee;
};