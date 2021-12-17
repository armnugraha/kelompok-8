const Mount = require('../models').mounts,
      User = require('../models').users,
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

var sendNotification = function(data) {
    var headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic Y2E5ZjliNDctZmYzOC00NDVmLWIzODItYmZmNGMxYjAwMzZh"
    };

    var options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers
    };
  
    var https = require('https');
    var req = https.request(options, function(res) {  
        res.on('data', function(data) {
        });
    });
  
    req.on('error', function(e) {});
  
    req.write(JSON.stringify(data));
    req.end();
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
    const count_mount = Mount.count({})
    const totalPage = Math.ceil(count_mount/pageLimit)

    let page = +req.query.page;
    let pageSize = count_mount;
    const mounts = Mount.findAll(paginate(
        {
            include:[{model: User},{model: Announce,
                where: {
                    [Op.and]: [
                        {start_date: {
                          // use between ?
                            [Op.lte]: moment().toDate()
                        }},
                        {end_date: {
                          // use between ?
                            [Op.gte]: moment().toDate()
                        }}
                    ]
                },
                order: [
                    ['end_date', 'DESC']
                ],
                limit: 1
            }],
            where: {}, // conditions
            order: [
                ['id', 'ASC']
            ],
        },
        { page, pageSize },
    ))

    return mounts
      .then(data => res.status(200).json({
         'status': 'ok',
         'pageSize': totalPage,
         'data': data,
      }))
      .catch(error => res.status(400).send(error));

    // if (mounts.length !== 0) {
    //   res.status(200).json({
    //      'status': 'ok',
    //      'pageSize': totalPage,
    //      'data': mounts,
    //   })
    // } else {
    //     res.json(view('mounts empty'))
    // }
  },
  retrieve(req, res) {
    const mounts = Mount.findOne({
        where: { id: req.params.id },
        include:[{model: Announce,
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
        }],
        limit: 1
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
  settingMount(req, res) {
    const users = User.findByPk(req.params.user_id)

    const mounts = Mount.findOne({
        where: { user_id: users.id },
        limit: 1
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
  mountShow(req, res) {
    try {
        const mounts = Mount.findByPk(req.params.id)

        var data_pick = []
        var data_time = []
        var data_distance = []

        for(var i=0; i < mounts.place.length; i++){
            if (i == 0) {
                data_pick.push(mounts.place[i].properties.title)
                data_time.push(-1)
                data_distance.push(-1)
            }

            if(i < mounts.place.length-1){
                var j = i+1;

                var lat1 = mounts.place[i].geometry.coordinates[1]
                var lat2 = mounts.place[j].geometry.coordinates[1]
                var lon1 = mounts.place[i].geometry.coordinates[0]
                var lon2 = mounts.place[j].geometry.coordinates[0]
                
                var R = 6371;
                var dLat = (lat2-lat1) * (Math.PI/180);
                var dLon = (lon2-lon1) * (Math.PI/180); 
                var a = 
                  Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos((lat1)*(Math.PI/180)) * Math.cos((lat2)*(Math.PI/180)) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2)
                ; 
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                var d = R * c; // Distance in km

                var set_minute = Math.round(d*1000)
                if(set_minute >= 30){
                    data_time.push((set_minute/30).toFixed(0))
                }else{
                    data_time.push(1)
                }

                data_distance.push(set_minute)

                data_pick.push(mounts.place[i].properties.title+" - "+mounts.place[j].properties.title)
            }
        }

        return mounts
        .then(data => {
          if (!data) {
            return res.status(404).send({
              message: 'Mount Not Found',
            });
          }
          return res.status(200)
          .json({
             'status': 'ok','data_place': mounts,'data_pick':data_pick,'data_time':data_time,'data_distance':data_distance
          })
        })
        .catch(error => res.status(400).send(error));
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