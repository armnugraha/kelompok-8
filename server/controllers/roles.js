const Role = require('../models').roles;

module.exports = {
  // create(req, res) {
  //   return Todo
  //     .create({
  //       title: req.body.title,
  //     })
  //     .then(todo => res.status(201).send(todo))
  //     .catch(error => res.status(400).send(error));
  // },
  list(req, res) {
    return Role
      .findAll()
      .then(todos => res.status(200).send(todos))
      .catch(error => res.status(400).send(error));
  },
  retrieve(req, res) {
    return Role
      .findByPk(req.params.roleId
        // , {
        //   include: [{
        //     model: Role,
        //     as: 'todoItems',
        //   }],
        // }
      )
      .then(role => {
        if (!role) {
          return res.status(404).send({
            message: 'Role Not Found',
          });
        }
        return res.status(200).send(role);
      })
      .catch(error => res.status(400).send(error));
  },
};