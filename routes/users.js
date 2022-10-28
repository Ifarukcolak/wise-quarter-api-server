var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//models
const mongoUser = require('../models/User');

//verify
const { verifyUser } = require('../middleware/verifyUser');

//token helper
const { getToken } = require('../helpers/tokenHelper');

const token_timeout = parseInt(process.env.TOKEN_TIMEOUT);

//get all user
router.get('/all',verifyUser, function (req, res, next) {
  mongoUser
    .find()
    .then((data) => {
      res.send({ status: true, data: data });
    })
    .catch((err) => {
      res.status(500).send({ message: err, status: false });
    });
});

//get user by id
router.get('/:id',verifyUser, function (req, res, next) {
  let userId = req.params.id;
  if (userId) {
    mongoUser
      .findOne({ _id: userId })
      .then((data) => {
        res.send({ status: true, data: data });
      })
      .catch((err) => {
        res.status(500).send({ message: err, status: false });
      });
  } else {
    res.status(500).send({ message: 'Id alanı boş olmamalı', status: false });
  }
});

router.post('/login', function (req, res, next) {
  let user = req.body;
  if (user.email && user.password) {
    let password = user.password;
    let email = user.email;
    mongoUser.findOne({ email: email }, (err, user) => {
      if (err) {
        res.status(500).send({ message: err, status: false });
      }
      //user not found
      if (!user) {
        res
          .status(500)
          .send({ message: 'Kullanıcı bulunamadı', status: false });
      } else {
        //compare password to hashed password in db
        bcrypt.compare(password, user.password).then(async (result) => {
          if (!result) {
            res
              .status(500)
              .send({ message: 'Hatalı şifre girdiniz.', status: false });
          } else {
            getToken(user)
              .then((data) => {
                res
                  .status(200)
                  .send({ message: 'Giriş yapıldı', status: true, data: data });
              })
              .catch((err) => {
                res.status(500).send({ message: err, status: false });
              });
          }
        });
      }
    });
  } else {
    res.send({
      status: false,
      message: 'Email ve şifre alanları boş olmamalı!',
    });
  }
});

//create new user
router.post('/', function (req, res, next) {
  let user = req.body;
  if (user?.email && user?.password) {
    bcrypt.hash(user.password, 10).then((hash) => {
      const userModel = new mongoUser({
        ...user,
        password: hash,
      });

      userModel
        .save()
        .then(async (user) => {
          res.send({ status: true, message: 'Kullanıcı eklendi', data: user });
        })
        .catch((err) => {
          res.status(500).send({
            message: `Kullanıcı eklenemedi. Hata detayı : ${err.message}`,
            status: false,
          });
        });
    });
  } else {
    res.status(500).send({ message: 'body boş olmamalı', status: false });
  }
});

//update user
router.put('/:id',verifyUser, function (req, res, next) {
  let userId = req.params.id;
  if (userId) {
    let user = req.body;
    if (user?.email) {
      let updatedObject = {
        _id: userId,
        email: user.email,
        name: user.name,
        age: user.age,
        surName: user.surName,
      };

      mongoUser
        .findByIdAndUpdate(userId, updatedObject, {
          new: true, //show updated data
        })
        .then(async (user) => {
          res.send({
            status: true,
            message: 'Kullanıcı güncellendi',
            data: user,
          });
        })
        .catch((err) => {
          res
            .status(500)
            .send({ message: 'Kullanıcı güncellenemedi', status: false });
        });
    } else {
      res.status(500).send({ message: 'body boş olmamalı', status: false });
    }
  } else {
    res.status(500).send({ message: 'Id alanı boş olmamalı' });
  }
});

//delete user
router.delete('/:id',verifyUser, function (req, res, next) {
  let userId = req.params.id;
  if (userId) {
    mongoUser
      .findByIdAndDelete(userId)
      .then(async (user) => {
        res.send({
          status: true,
          message: 'Kullanıcı silindi',
          data: user,
        });
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: 'Kullanıcı silinemedi.', status: false });
      });
  } else {
    res.status(500).send({ message: 'Id alanı boş olmamalı' });
  }
});

module.exports = router;
