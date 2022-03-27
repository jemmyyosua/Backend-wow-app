'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      book.belongsTo(models.user, {
        as: "user",
        foreignKey: {
          name: "idAdmin",
        },
      });

      book.hasMany(models.userBook, {
        as: "userBooks",
        foreignKey: {
          name: "idBook",
        },
      });
    }
    
  }
  book.init({
    title: DataTypes.STRING,
    publicationDate: DataTypes.DATE,
    pages: DataTypes.INTEGER,
    author: DataTypes.STRING,
    ISBN: DataTypes.INTEGER,
    about: DataTypes.STRING,
    bookFile: DataTypes.STRING,
    cover: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'book',
  });
  return book;
};