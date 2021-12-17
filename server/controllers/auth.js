const User = require('../models').users,
      jwt = require('../../jwt'),
      bcrypt = require("bcrypt-nodejs");

module.exports = {
  login(req, res) {
    let user = User.findAll({
      where: {
        username: req.body.username
      }
    })
    res.status(200).send(bcrypt.compare(req.body.password, "$2b$10$GpHJAf6ogZdDu2KI.cHrxeWSNjcyNa0acCc1VM7K78IjcBTKYYxQ."))
    // if (user.length === 0) {
    //   res.send(view('username atau password salah'))
    // } else {
    //   user = user[0]
    //   const match = bcrypt.compare(req.body.password, user.password);

    //   if(match) {
    //     var token = jwt.sign({ id: user.id, email: user.email, role_id: user.role_id, username: user.username, name: user.name })
    //     return token
    //     .then(data => 
    //        res.status(200)
    //       .json({
    //          'status': 'ok','data': token
    //       })
    //     )
    //     .catch(error => res.status(400).send(error));
    //   }else{
    //     // res.send(view('password salah'))
    //   }
    // }
  },
};