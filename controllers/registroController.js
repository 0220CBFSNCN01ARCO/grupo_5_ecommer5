const fs = require('fs');
const bcrypt = require("bcrypt");
let { check, validationResult, body } = require('express-validator');

const registroController = {
  register : function(req, res){
    res.render("users");
  },
    create: function (req, res) {
      let errors = validationResult(req);

      if (errors.isEmpty()) {

let usuario = {
nombre: req.body.nombre,
email: req.body.email,
password: req.body.password
}
let archivoUsuarios = fs.readFileSync("users.json", {encoding: "utf-8"});
let usuarios;
if(archivoUsuarios == ""){
   usuarios = [];
}else{
   usuarios = JSON.parse(archivoUsuarios);
}
usuarios.push(usuario);

let usuarioJSON = JSON.stringify(usuarios);
fs.appendFileSync("users.json", usuariosJSON);

        res.redirect('users', {title: "Gracias por registrarte en Mercado Libro"});
      } else {
        return res.render('users'), ({errors: errors.errors})
      }

    }
};

module.exports = registroController;