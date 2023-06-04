const verifySignUpController = require("../controllers").verifySignUp;
const verifySignController = require("../controllers").verifySign;

module.exports = function (app) {
  app.post(
    "/api/auth/signup",
    [
      verifySignUpController.checkDuplicateEmail,
      verifySignUpController.checkRolesExisted,
    ],
    verifySignController.signup
  );
  app.get("/api/auth/signin", verifySignController.signin);
};
