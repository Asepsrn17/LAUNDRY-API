const mst_join = require("../../models").mst_join;
const User = require("../../models").User;

module.exports = {
  add(req, res) {
    const { id, tanggal_masuk, tanggal_selesai, penerima } = req.body;
    mst_join
      .findOne({ where: { id: id } })
      .then((existingData) => {
        if (existingData) {
          return res.status(400).send({
            status_response: "Bad request",
            errors: "ID is already used",
          });
        } else {
          return mst_join
            .create({
              id: id,
              userId: req.userId,
              tanggal_masuk: tanggal_masuk,
              tanggal_selesai: tanggal_selesai,
              penerima: penerima,
            })
            .then((data) => {
              const userJoin = {
                status_response: "Created",
                userJoin: data,
                errors: null,
              };

              return res.status(201).send(userJoin);
            });
        }
      })
      .catch((err) => {
        res.status(400).send({
          status_response: "Bad request",
          errors: err,
        });
      });
  },

  getJoinById(req, res) {
    return mst_join
      .findAll({
        where: { userId: req.params.id },
        include: [
          { model: User, as: "joinUser", attributes: ["name", "email"] },
        ],
      })
      .then((data) => {
        if (data.length === 0) {
          return res.status(404).send({
            status_response: "Not Found",
            errors: "User join not found",
          });
        }

        const userJoin = {
          status_response: "Ok",
          userJoin: [],
        };

        for (let i = 0; i < data.length; i++) {
          const joinData = data[i];

          if (req.userId !== joinData.userId) {
            return res.status(403).send({
              status_response: "Forbidden!",
              errors: "Kamu tidak dapat melihat info user lain",
            });
          }

          userJoin.userJoin.push(joinData);
        }

        return res.status(200).send(userJoin);
      })
      .catch((err) => {
        res.status(400).send({
          status_response: "Bad request!",
          errors: err,
        });
      });
  },

  updateJoin(req, res) {
    const { tanggal_masuk, tanggal_selesai, penerima } = req.body;

    return mst_join
      .findOne({
        where: { id: req.params.id },
      })
      .then((data) => {
        if (!data) {
          return res.status(404).send({
            status_response: "Not found!",
            errors: "User join not found!",
          });
        }

        if (req.userId != data.userId) {
          return res.status(403).send({
            status_response: "Forbidden!",
            errors: "Kamu tidak dapat mengedit join pengguna lain",
          });
        }

        return data
          .update({
            tanggal_masuk,
            tanggal_selesai,
            penerima,
          })
          .then((data) => {
            const userJoin = {
              status_response: "OK",
              message: "Updated succesfully",
              userJoin: data,
            };

            return res.status(200).send(userJoin);
          })
          .catch((err) => {
            res.status(400).send({
              status_response: "Bad request",
              errors: err,
            });
          });
      })
      .catch((err) => {
        res.status(400).send({
          status_response: "Bad request",
          errors: err,
        });
      });
  },

  deleteJoin(req, res) {
    const joinId = req.params.id;

    return mst_join
      .findOne({
        where: { id: joinId },
      })
      .then((joinData) => {
        if (!joinData) {
          return res.status(404).send({
            status_response: "Not Found",
            errors: "User join not found",
          });
        }

        if (req.userId !== joinData.userId) {
          return res.status(403).send({
            status_response: "Forbidden",
            errors: "Kamu tidak dapat menghapus join pengguna lain",
          });
        }

        return joinData
          .destroy()
          .then(() => {
            return res.status(200).send({
              status_response: "Deleted",
              message: `user join with id ${joinData.id} deleted successfully`,
            });
          })
          .catch((err) => {
            res.status(400).send({
              status_response: "Bad request",
              errors: err,
            });
          });
      })
      .catch((err) => {
        res.status(400).send({
          status_response: "Bad request",
          errors: err,
        });
      });
  },
};
