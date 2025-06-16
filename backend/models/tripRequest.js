module.exports = (sequelize, DataTypes) => {
    const TripRequest = sequelize.define('TripRequest', {
        destination: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        requestTime: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isAfter48Hours(value) {
                    const now = new Date();
                    const minDate = new Date(now.getTime() + 48 * 60 * 60 * 1000);
                    if (value < minDate) {
                        throw new Error('Trip must be requested at least 48 hours in advance.');
                    }
                }
            }
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'declined'),
            defaultValue: 'pending',
        }, 
    }, {
        timestamps: true, 
    });

    TripRequest.associate = (models) => {
        TripRequest.belongsTo(models.Employee, {
            foreignKey: 'employeeId',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        });
    };

    return TripRequest;
    
};