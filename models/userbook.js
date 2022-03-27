'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      userBook.belongsTo(models.book, {
        as: "book",
        foreignKey: {
          name: "idBook",
        },
      })

      userBook.belongsTo(models.user, {
        as: "user",
        foreignKey: {
          name: "idUser",
        },
      })
    }
  }
  userBook.init({
    idBook: DataTypes.INTEGER,
    idUser: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'userBook',
  });
  return userBook;
};