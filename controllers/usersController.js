const fs = require("fs");
const bcrypt = require("bcrypt");
const { check, validationResult, body } = require("express-validator");
let path = require("path");
const db = require("../database/models");
const { query } = require("express");

const usersController = {
  register: function (req, res) {
    res.render("register");
  },
  create: function (req, res) {
    let errors = validationResult(req);

    if (errors.isEmpty()) {
      db.Usuario.findOne({
        where: {
          email: req.body.email,
        },
      }).then(function (usuario) {
        if (usuario) {
          //res.send(usuario)
          res.render("register", { errors: [{ msg: "Usuario existente" }] });
        } else {
          console.log(req.body);
          db.Usuario.create({
            nombre: req.body.nombre,
            localidad: req.body.localidad,
            provincia: req.body.provincia,
            direccion: req.body.direccion,
            cp: req.body.cp,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            avatar: req.files[0].filename,
            rol: 0,
          })
            .then(() => {
              res.redirect("/users/success");
            })
            .catch((err) => {
              console.log(err);
              return res.send(err);
            });
        }
      });
    } else {
      res.render("register", { errors: errors.errors });
    }
  },
  success: function (req, res) {
    res.render("registerSuccess");
  },
  login: function (req, res) {
    res.render("login");
  },
  processLogin: function (req, res) {
    let errors = validationResult(req);

    // console.log(req.body)
    if (errors.isEmpty()) {

     db.Usuario.findOne({
        where: { email: req.body.email },
      })

        .then(function (usuario) {
          if (!usuario) {
            return res.render("login", {
              errors: [{ msg: "No tenemos registrado tu email" }],
            });
          }

          if (!bcrypt.compareSync(req.body.password, usuario.password)) {
            return res.render("login", {
              errors: [{ msg: "Clave incorrecta" }],
            });
          }

          req.session.usuarioLogueado = usuario;
        
          req.session.usuarioLoginRol = usuario.rol;
         
          console.log("session" + req.session.usuarioLoginRol);

          if (req.session.usuarioLoginRol == 1) {
            res.redirect("/admin/profileAdmin");
          } else {
            req.session.usuarioLoginRol == 0;
            res.redirect("/users/account");
          }
        })
        .catch(function (error) {
          res.render("login", { error });
        });
      if (req.body.recordame != undefined) {
        res.cookie("recordame", req.body.email, { maxAge: 60000 });
      }
    } else {
      res.render("login", { errors: errors.errors });
    }
  },
  logout(req, res) {
    req.session.destroy();
    res.render("login");
  },
  account: function (req, res) {
    db.Usuario.findOne({
      where: {
        email: req.session.usuarioLogueado.email,
      },
    }).then(function (data) {
      res.render("account", {
         data: data
        });
    });
  },
update: function(req, res){
db.Usuario.findOne({
  where: {
    idusuario: req.session.usuarioLogueado.idusuario
  }
})
.then(function(usuario){
  console.log(req.session.usuarioLogueado)
  res.render("updateInfoUser", {
    data: req.session.usuarioLogueado
  })
})
  

},
  chargeUpdate: function(req, res){
    db.Usuario.update({
      nombre: req.body.nombre,
      localidad: req.body.localidad,
      provincia: req.body.provincia,
      direccion: req.body.direccion,
      cp: req.body.cp,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      avatar: req.files[0].filename,
      rol: 0
    }, { where: {
      idusuario: req.session.usuarioLogueado.idusuario
  }
})
  .then(function(data){
db.Usuario.findOne({
  where:{
    idusuario: req.session.usuarioLogueado.idusuario
  }
}).then(function(data){

  res.redirect("/users/account")
})

    
  })
  },
  cart: function(req, res){

    db.Libro.findAll({
        limit: 1
    })
    .then(function(libro) {
        return res.render("cart", {
          libro: libro,
          data: req.session.usuarioLogueado
      });
      })
}

};

module.exports = usersController;
