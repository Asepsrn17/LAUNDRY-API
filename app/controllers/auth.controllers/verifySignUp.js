const db = require("../../models");
const User = db.User;
const config = require("../../config/configRoles");
const ROLES = config.ROLES;

module.exports = {
  checkDuplicateEmail(req, res, next) {
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (user) {
        res.status(400).send({
          auth: false,
          email: req.body.email,
          message: "Error",
          errors: "Email is already taken!",
        });
        return;
      }
      next();
    });
  },

  checkRolesExisted(req, res, next) {
    if (req.body.roles) {
      for (let i = 0; i < req.body.roles.length; i++) {
        if (!ROLES.includes(req.body.roles[i])) {
          res.status(400).send({
            message: "Error",
            errors: "Failed! Role dot not exist = " + req.body.roles[i],
          });
          return;
        }
      }
    }
    next();
  },
};
