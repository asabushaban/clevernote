"use strict";
module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define(
    "Note",
    {
      title: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      notebook_id: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {}
  );
  Note.associate = function (models) {
    // associations can be defined here
  };
  return Note;
};
