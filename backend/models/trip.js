module.exports = (sequelize, DataTypes) => {
    const Trip = sequelize.define('Trip', {
        destination: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.DATE,
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'completed'),
            defaultValue: 'pending',
        },
    });

    Trip.associate = (models) => {
        Trip.belongsTo(models.Employee, {
            foreignKey: 'employeeId',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        });
    };

    return Trip;
};