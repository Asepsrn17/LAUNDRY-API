require("dotenv").config();

module.exports = {
  secret: process.env.SECRET,
  ROLES: process.env.ROLES.split(","),
};
