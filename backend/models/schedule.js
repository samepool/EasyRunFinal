module.exports = (sequelize, DataTypes) => {
    const Schedule = sequelize.define('Schedule', {
        shiftStart: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        shiftEnd: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isAfterShiftStart(value) {
                    if (this.shiftStart && value <= this.shiftStart) {
                        throw new Error('shiftEnd must be after shiftStart');
                    }
                }
            }
        }
    });
    
    Schedule.associate = (models) => {
        Schedule.belongsTo(models.Employee, {
            foreignKey: 'employeeId',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        });
    };

    return Schedule;
}