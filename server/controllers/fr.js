// require("js/commons.js")
const Attendance = require('../models').attendances;
const User = require('../models').users;
const db = require('../models');
const Trained = require('../models').trainings;
const Siswa = require('../models').siswa;
const uploadFile = require("../../public/js/uploads");
const mkdirp = require('mkdirp')
var fs = require('fs');

const faceapi = require('face-api.js')
const { Canvas, Image, ImageData } = require('canvas');
const commons = require('../../public/js/commons.js')
const bbt = require('../../public/js/bbt.js')
const fetch = require('node-fetch');
const {Sequelize,QueryTypes} = require('sequelize');
var _ = require('lodash');
// import '@tensorflow/tfjs-node';
// // implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
// import * as canvas from 'canvas';
// import * as faceapi from '';

let interval = 2000
let isStop = false
let faceMatcher = null
let currImageIdx = 2, currClassIdx = 0
let to = null

const retrieve = (req, res) => {
    const user = User.findByPk(req.params.id
      // , { include: [ Role ] }
    )
    return user
    .then(data => {
      if (!data) {
        return res.status(404).send({
          message: 'User Not Found',
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
}

const runFaceRecognition = async (req, res) => {
  // const input = await faceapi.fetchImage("trainings/1/amy5.png")
  // await faceapi.loadFaceRecognitionModel('/')
  // const input = await requestExternalImage("https://storage.googleapis.com/envisions_desk_dev/uploads/users/735/profile/2021-12/596a33eeb5b4ccb97ec7edf45233a661.png")
  // // const input = await requestExternalImage("https://storage.googleapis.com/envisions_desk_dev/uploads/users/735/profile/2021-12/ef3cb10b7a530a478bc89f2d88f182a2.jpg")
  // // const input = await requestExternalImage("https://storage.googleapis.com/envisions_desk_dev/uploads/users/85/profile/2021-12/64bc6a620e61378e51f5c4a7c1a80967.png")
  // // const input = await requestExternalImage("https://storage.googleapis.com/envisions_desk_dev/uploads/users/85/profile/2021-12/1c5e56bc9620ddb57d68096f046d462e.png")
  // // const input = await requestExternalImage("https://storage.googleapis.com/envisions_desk_dev/uploads/users/85/profile/2021-12/c102095bda8d55ed9cb4ca1bc8d52e1f.png")
  // const ts = Date.now()
  // const descriptor = await faceapi.computeFaceDescriptor(input)
  // // displayTimeStats(Date.now() - ts)

  // const bestMatch = faceMatcher.findBestMatch(descriptor)
  // // $('#prediction').val(bestMatch.toString())
  // // console.log(descriptor,bestMatch)
  // console.log(bestMatch.toString())

  // // currImageIdx = currClassIdx === (classes.length - 1)
  // //   ? currImageIdx + 1
  // //   : currImageIdx
  // // currClassIdx = (currClassIdx + 1) % classes.length

  // // currImageIdx = (currImageIdx % 6) || 2
  // return bestMatch.toString();
}

const coco = async (req, res) => {
  // console.log('loading model file...')
  // faceapi.env.monkeyPatch({ Canvas, Image })
  // const img = await Canvas.loadImage('trainings/1/amy5.png');
  // fetch('https://google.com')
  //   .then(res => res.text())
  //   .then(text => console.log(text));
  // await faceapi.loadSsdMobilenetv1Model('/models')
  // await faceapi.loadFaceRecognitionModel('/')
  // console.log('computing initial descriptors...')

  // faceMatcher = await createBbtFaceMatcher(1)
  // runFaceRecognition()

  // const coas = await lib.getFaceImageUri("gamabar return",1);
  return res.status(200).send({
    // message: "Coba di print "+test()+coas,
    message: "Coba di print ",
  });
}

const attendance = async (req, res) => {
  try {
    const {id_siswa} = req.params;
    var date = new Date();
    var dateStr =
      ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
      ("00" + date.getDate()).slice(-2) + "-" +
      date.getFullYear() + " " +
      ("00" + date.getHours()).slice(-2) + ":" +
      ("00" + date.getMinutes()).slice(-2) + ":" +
      ("00" + date.getSeconds()).slice(-2);

    const attendance = await Attendance.create({
        id_siswa:id_siswa,created_at:dateStr
    });
    if (attendance) {
        return res.status(200).send({
          message: "Success absen ",
        });
    }
  } catch (err) {
      return res.status(500).send({
        message: "Something when wrong",
      });
  }
}    
const user = async (req, res) => {
  // const users = await Sequelize.query("SELECT * FROM `tb_siswa`", { type: Sequelize.QueryTypes.SELECT });
  // const data = await Siswa.findAll()
  const users = await db.sequelize.query('SELECT * FROM tb_siswa WHERE nis=(:id)', {
    // replacements: {id: req.user.id},
    replacements: {id: req.params.nis},
    type: db.sequelize.QueryTypes.SELECT
  });
  let mapel, kelas;
  if (users.length>0) {
    const d = new Date();
    mapel = await db.sequelize.query('SELECT schedules.*, tb_master_mapel.* FROM tb_roleguru JOIN schedules ON tb_roleguru.id_jadwal = schedules.id JOIN tb_master_mapel ON tb_roleguru.id_mapel = tb_master_mapel.id_mapel WHERE tb_roleguru.id_kelas=(:id) AND schedules.day=(:date)', {
      replacements: {id: users[0].id_kelas, date: d.getDay()},
      // replacements: {id: users[0].id_kelas, date: 3},
      type: db.sequelize.QueryTypes.SELECT
    });

    kelas = await db.sequelize.query('SELECT tb_master_kelas.* FROM tb_roleguru JOIN tb_master_kelas ON tb_roleguru.id_kelas = tb_master_kelas.id_kelas WHERE tb_roleguru.id_kelas=(:id)', {
      replacements: {id: users[0].id_kelas},
      type: db.sequelize.QueryTypes.SELECT
    });
  }
  // console.log(users[0])
  return res.status(200)
  .json({
     'status': 'ok',
     'data': users,
     'kelas': kelas,
     'mapel': mapel
  })
}

const trainClass = async (req, res) => {
  const uuid = await Trained.findAll({
    // attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('uuid'))]],
    attributes: ['uuid'],
    // group: ['uuid'],
    raw: true,
  })
  .then(function(resp) {
    return _.map(resp, function(res) { return res.uuid; })
  })

  const file = await Trained.findAll({
    attributes: ['path'],
    raw: true,
  })
  .then(function(resp) {
    return _.map(resp, function(res) { return res.path; })
  })

  return res.status(200)
  .json({
     'status': 'ok',
     'data': uuid,
     'file': file,
  })
}

const trained = async (req, res) => {
  try {
    // const { user_id } = req.body;
    const {uuid, level} = req.params;
    var dir = __basedir + "/public/trainings/"+uuid;
    if (!fs.existsSync(dir)){
      await mkdirp(dir)
    }
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    const users = await Trained.create({
        uuid:uuid,id_level:level,file:req.file.originalname,path:"/trainings/"+uuid+"/"+req.file.originalname
    });

    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: `,
    });
  }
}

module.exports = {retrieve, coco, user, attendance, trainClass, trained};
// export default {retrieve, coco, user, trainClass, trained};