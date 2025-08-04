// models/user.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    user_id: {
      type: sequelize.Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    password_hash: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    phone_number: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('passenger', 'admin'),
      allowNull: false,
      defaultValue: 'passenger'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'users',
    schema: 'traintrack360',
    timestamps: false
  });

  return User;
};
