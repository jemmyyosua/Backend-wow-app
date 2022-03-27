'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.profile, {
        as: "profile",
        foreignKey: {
          name: "idUser",
        },
      });

      //hasMany to product model
      user.hasMany(models.book, {
        as: "book",
        foreignKey: {
          name: "idAdmin",
        },
      });

      //hasMany association to transaction model
      user.hasMany(models.transaction, {
        as: "transaction",
        foreignKey: {
          name: "idUser",
        },
      })
    }
  }

  user.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    fullName: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};