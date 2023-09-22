const sequelize = require('./config.db');
const User = require('../models/user')(sequelize);
const Task = require('../models/task')(sequelize);

User.hasMany(Task, { as: 'tasks', foreignKey: 'userId' });
Task.belongsTo(User, { foreignKey: 'userId' });

const dbConnection = async () => {    
    try {
      await sequelize.authenticate();
      console.log('Base de datos Online.');
      await sequelize.sync();
      console.log('Tabla creada');
    } catch (error) {
      console.error('Error al crear la tabla User:', error);
    }
}

module.exports = {
  dbConnection,
  sequelize,
  User,
  Task,
};