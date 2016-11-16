const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('datejs');

const createUser = require('../models/user/create');
const config = require('../config/getConfig')();

const handler = (req) => {
  return new Promise((resolve, reject) => {
    hashPassword(req.body.password)
      .then((hashed) => {
        return createUser({
          email: req.body.email,
          hashedPassword: hashed,
        });
      })
      .then((user) => {
        return createSession(user);
      })
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        if (err === 'DUPLICATE_EMAIL') {
          reject({ status: 409, err: new Error('Email Already Exists')});
          return;
        }
        reject(err);
      });
  });
};

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }

        resolve(hash);
      });
    });
  });
}

function createSession(user) {
  return new Promise((resolve, reject) => {
    const response = {
      user: {
        email: user.email,
        id: user.id,
      },
      token: null,
    };

    const claims = {
      user_id: user.id,
      expiry: Date.today().add(21).days(),
    };

    response.token = jwt.sign(claims, config.Session.HMACSecret);
    resolve(response);
  });
}

module.exports = handler;