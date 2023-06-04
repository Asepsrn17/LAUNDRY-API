const controllers = require("../controllers");

module.exports = function (app) {
  app.post(
    "/api/join",
    [controllers.verifyJwtToken.verifyToken],
    controllers.userJoin.add
  );
  app.get(
    "/api/join/:id",
    [controllers.verifyJwtToken.verifyToken],
    controllers.userJoin.getJoinById
  );
  app.put(
    "/api/join/:id",
    [controllers.verifyJwtToken.verifyToken],
    controllers.userJoin.updateJoin
  );
  app.delete(
    "/api/join/:id",
    [controllers.verifyJwtToken.verifyToken],
    controllers.userJoin.deleteJoin
  );

  app.post(
    "/api/transaction",
    [controllers.verifyJwtToken.verifyToken],
    controllers.transaction.createTransaction
  );

  app.get(
    "/api/transaction/:id",
    [controllers.verifyJwtToken.verifyToken],
    controllers.transaction.getTransactionById
  );

  app.put(
    "/api/transaction/:id",
    [controllers.verifyJwtToken.verifyToken],
    controllers.transaction.updateTransaction
  );

  app.delete(
    "/api/transaction/:id",
    [controllers.verifyJwtToken.verifyToken],
    controllers.transaction.deleteTransaction
  );
};
