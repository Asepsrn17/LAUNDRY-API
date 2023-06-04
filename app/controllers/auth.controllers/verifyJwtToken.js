const jwt = require("jsonwebtoken");
const config = require("../../config/configRoles");
const db = require("../../models");
const User = db.User;

module.exports = {
  verifyToken(req, res, next) {
    let token = req.headers["authorization"];
    if (!token) {
      return res.status(403).send({
        errors: "No token provided",
      });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          errors: "Unauthorized!",
        });
      }
      req.userId = decoded.id;
      next();
    });
  },

  isAdmin(req, res, next) {
    User.findByPk(req.userId).then((user) => {
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          console.log(roles[i].name);
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }
        res.status(403).send({
          auth: false,
          message: "Error",
          message: "Require Admin Role",
        });
        return;
      });
    });
  },
};
