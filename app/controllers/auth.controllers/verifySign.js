const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../config/configRoles");
const db = require("../../models/index");
const User = db.User;
const Role = db.Role;
const Op = db.Sequelize.Op;

module.exports = {
  signup(req, res) {
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    }).then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        })
          .then((roles) => {
            user.setRoles(roles).then(() => {
              res.send({
                message: "User was registered successfully!",
              });
            });
          })
          .catch((err) => {
            res.status(500).send({ message: err.message });
          });
      }
    });
  },

  signin(req, res) {
    User.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            auth: false,
            email: req.body.email,
            errors: "User Not Found.",
          });
        }

        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );

        if (!passwordIsValid) {
          return res.status(401).send({
            auth: false,
            email: req.body.email,
            accessToken: null,
            errors: "Invalid Password!",
          });
        }

        var token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: 86400, //24h expired
        });

        var authorities = [];
        user.getRoles().then((roles) => {
          for (let i = 0; i < roles.length; i++) {
            console.log(typeof roles[i], roles[i]);
            authorities.push("ROLE_" + roles[i].name.toUpperCase());
          }

          res.status(200).send({
            id: user.id,
            name: user.name,
            email: user.email,
            roles: authorities,
            accessToken: token,
          });
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({
          auth: false,
          email: req.body.email,
          accessToken: null,
          message: "Error",
          errors: err,
        });
      });
  },
};
