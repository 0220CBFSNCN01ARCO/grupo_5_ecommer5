module.exports = function(sequelize, DataTypes) {
    let alias = "Libro_Autor";

    let cols = {
        id: {
            type: DataTypes.INTEGER,//(11)
            primaryKey: true,
            autoIncrement: true
        },
        idLibro: {
            type: DataTypes.INTEGER//(11)
        },
        idAutor: {
            type: DataType.INTEGER//(11)
        }
     }

    let config = {
        tableName: "libros_autores",
        timestamps: false
    }

    let Libro_Autor = sequelize.define(alias, cols, config);
    return Libro_Autor

}
