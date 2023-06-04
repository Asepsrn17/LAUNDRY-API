const tx_transaction = require("../../models").tx_transaction;
const mst_join = require("../../models").mst_join;

const createTransaction = async (req, res) => {
  try {
    const { pelayanan, jumlah, harga, joinId } = req.body;
    const mstJoin = await mst_join.findByPk(joinId);

    if (!mstJoin) {
      return res.status(404).send({
        response_status: "Not found!",
        errors: `id join ${joinId} not found`,
      });
    }

    if (req.userId !== mstJoin.userId) {
      return res.status(403).send({
        status_response: "Forbidden!",
        errors:
          "Gunakan joinId kamu sendiri!.. Kamu tidak dapat melakukan transaksi untuk pengguna lain",
      });
    }

    const total = harga * jumlah;
    const transaction = await tx_transaction.create({
      userId: req.userId,
      joinId,
      pelayanan,
      jumlah,
      harga,
      total,
    });
    return res.status(201).send(transaction);
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status_response: "Internal Server Error!",
      errors: "Failed to create transaction",
    });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const transaction = await tx_transaction.findOne({
      where: { id: req.params.id },
    });
    if (!transaction) {
      return res.status(404).send({
        status_response: "Not found!",
        errors: `transaction with id ${req.params.id} not found!`,
      });
    }
    if (req.userId !== transaction.userId) {
      return res.status(403).send({
        status_response: "Forbidden!",
        errors: "Kamu tidak dapat melihat transaction user lain",
      });
    }
    return res.status(200).send(transaction);
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status_response: "Internal Server Error!",
      errors: "Failed to get transaction",
    });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await tx_transaction.findAll();
    if (transactions.length === 0) {
      return res.status(404).send({
        status_response: "Not found!",
        errors: "transaction not found!",
      });
    }
    return res.status(200).send(transactions);
  } catch (err) {
    return res.status(500).send({
      status_response: "Internal Server Error!",
      errors: "Failed to get transactions",
    });
  }
};

const getTransactionByAdmin = async (req, res) => {
  try {
    const transaction = await tx_transaction.findOne({
      where: { id: req.params.id },
    });
    if (!transaction) {
      return res.status(404).send({
        status_response: "Not found!",
        errors: `transaction with id ${req.params.id} not found!`,
      });
    }
    return res.status(200).send(transaction);
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status_response: "Internal Server Error!",
      errors: "Failed to get transaction",
    });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { joinId, pelayanan, jumlah, harga } = req.body;

    return tx_transaction
      .findOne({
        where: { id: req.params.id },
      })
      .then((transaction) => {
        if (!transaction) {
          return res.status(404).send({
            status_response: "Not found!",
            errors: "id transaction not found!",
          });
        }
        if (req.userId !== transaction.userId) {
          return res.status(403).send({
            status_response: "Forbidden!",
            errors: "Kamu tidak dapat mengedit transaksi pengguna lain",
          });
        }

        if (joinId !== transaction.joinId) {
          return res.status(403).send({
            status_response: "Forbidden",
            errors: "gunakan joinId kamu sendiri!",
          });
        }

        const total = harga * jumlah;

        return transaction
          .update({
            joinId,
            pelayanan,
            jumlah,
            harga,
            total,
          })
          .then((transaction) => {
            const userTransaction = {
              status_response: "OK",
              message: "Updated successfully",
              userTransaction: transaction,
            };

            return res.status(200).send(userTransaction);
          })
          .catch((err) => {
            res.status(400).send({
              status_response: "Failed to update transaction",
              errors: err,
            });
          });
      });
  } catch (err) {
    res.status(400).send({
      status_response: "Bad request",
      errors: err,
    });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await tx_transaction.findOne({
      where: { id: req.params.id },
    });

    if (!transaction) {
      return res.status(404).send({
        status_response: "Not found!",
        message: "transaction not found!",
      });
    }

    if (req.userId !== transaction.userId) {
      return res.status(403).send({
        status_response: "Forbidden",
        errors: "Kamu tidak dapat menghapus transaksi pengguna lain",
      });
    }
    await transaction.destroy();
    return res.status(200).send({
      status_response: "Deleted",
      message: `transaction deleted with id ${transaction.id} deleted successfully`,
    });
  } catch (err) {
    res.status(400).send({
      status_response: "Bad request",
      errors: err,
    });
  }
};

const deleteTransactionByAdmin = async (req, res) => {
  try {
    const transaction = await tx_transaction.findOne({
      where: { id: req.params.id },
    });

    if (!transaction) {
      return res.status(404).send({
        status_response: "Not found!",
        message: "transaction not found!",
      });
    }
    await transaction.destroy();
    return res.status(200).send({
      status_response: "Deleted",
      message: `transaction deleted with id ${transaction.id} deleted successfully`,
    });
  } catch (err) {
    res.status(400).send({
      status_response: "Bad request",
      errors: err,
    });
  }
};

module.exports = {
  createTransaction,
  getTransactionById,
  getTransactionByAdmin,
  getAllTransactions,
  updateTransaction,
  deleteTransaction,
  deleteTransactionByAdmin,
};
