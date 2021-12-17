const User = require('../models').users,
      Announce = require('../models').mount_announcements,
      pageLimit = 10;

var view = require('../../views')
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const operatorsAliases = {
  $like: Op.like,
  $ilike: Op.ilike,
  $or: Op.or,
  $not: Op.not
}

//PAGINATION Function
const paginate = (query, { page, pageSize }) => {
    const limit = pageLimit;
    const offset = 0 + (page - 1) * limit;
    return {
        ...query,
        offset,
        limit,
    };
};

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
    const count_user = await User.count({})
    const totalPage = Math.ceil(count_user/pageLimit)

    let page = +req.query.page;
    let pageSize = count_user;
    const users = await User.findAll(paginate(
        {
            where: {}, // conditions
            order: [
                ['id', 'DESC']
            ]
        },
        { page, pageSize },
    ),{
        include: [ Role ]
    })

    return users
      .then(data => res.status(200).json({
         'status': 'ok',
         'pageSize': totalPage,
         'data': data,
      }))
      .catch(error => res.status(400).send(error));
  },
  admin(req, res) {
    const users = await User.findAll({
        where: {
            role_id: 2
        },
        order: [
            ['id', 'DESC']
        ]
    })

    return users
      .then(data => res.status(200).json({
         'status': 'ok',
         'pageSize': totalPage,
         'data': data,
      }))
      .catch(error => res.status(400).send(error));
  },
  retrieve(req, res) {
    const user = await User.findByPk(req.params.id, {
        include: [ Role ]
    })
    return user
      .then(data => {
        if (!data) {
          return res.status(404).send({
            message: 'Mount Not Found',
          });
        }
        return res.status(200)
        // .send(data);
        .json({
           'status': 'ok',
           'data': data,
        })
      })
      .catch(error => res.status(400).send(error));
  },
  store(req, res) {
    try {
        const { username,name,email,password,phone,gender,birth,role_id } = req.body;
        const users = await Models.users.create({
            username,name,email,password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),phone,gender,birth,role_id
        });
        if (users) {
            return users
            .then(data => {
              return res.status(200)
              .json({
                 'status': 'ok','message': 'User berhasil ditambahkan','data':data
              })
            })
            .catch(error => res.status(400).send(error));
        }
    } catch (err) {
        // next(err);
    }
  },
  searchMount(req, res) {
    let keyword = "%"+req.params.text+"%"

    const mounts = Mount.findAll({
        where: {
            [Op.or]: [
                {name: {
                    [Op.iLike]: keyword
                }},
                {address: {
                    [Op.iLike]: keyword
                }}
            ]
        },
        include:[{model: User},{model: Announce,
            where: {
                [Op.and]: [
                    {start_date: {
                        [Op.lte]: moment().toDate()
                    }},
                    {end_date: {
                        [Op.gte]: moment().toDate()
                    }}
                ]
            },
            order: [
                ['end_date', 'DESC']
            ],
            limit: 1
        }]
    })

    return mounts
      .then(data => {
        if (!data) {
          return res.status(404).send({
            message: 'Mount Not Found',
          });
        }
        return res.status(200)
        // .send(data);
        .json({
           'status': 'ok',
           'data': data,
        })
      })
      .catch(error => res.status(400).send(error));
  },
};