const bcrypt = require("bcryptjs");
const User = require("../../models").User;

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    if (users.length === 0) {
      return res.status(404).send({
        status_response: "Not found!",
        errors: "User not found!",
      });
    }
    return res.status(200).send(users);
  } catch (err) {
    return res.status(500).send({
      status_response: "Internal Server Error!",
      errors: "Failed to get users",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    return User.findOne({
      where: { id: req.params.id },
    }).then((user) => {
      if (!user) {
        return res.status(404).send({
          status_response: "Not Found!",
          errors: "id user not found!",
        });
      }
      const hashedPassword = bcrypt.hashSync(password, 8);
      return user
        .update({
          name,
          email,
          password: hashedPassword,
        })
        .then((user) => {
          const userUpdated = {
            status_response: "Success",
            message: "Updated successfully",
            userUpdated: user,
          };
          return res.status(200).send(userUpdated);
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

const deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.id },
    });

    if (!user) {
      return res.status(404).send({
        status_response: "Not found!",
        message: "User not found!",
      });
    }
    await user.destroy();
    return res.status(200).send({
      status_response: "Deleted",
      message: `User deleted with id ${user.id} deleted successfully`,
    });
  } catch (err) {
    res.status(400).send({
      status_response: "Bad request",
      errors: err,
    });
  }
};

module.exports = { updateUser, getAllUsers, deleteUser };
