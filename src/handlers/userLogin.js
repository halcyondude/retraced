const bcrypt = require('bcryptjs');

const getUser = require('../models/user/get');
const createAdminsession = require('../models/adminsession/create');

const handler = (req) => {
  return new Promise((resolve, reject) => {
    let user;
    getUser({
      email: req.body.email,
    })
      .then((u) => {
        if (!u) {
          reject({ status: 401, err: new Error('Unauthorized') });
          return;
        }

        user = u;
        return validatePassword(u.password_crypt, req.body.password);
      })
      .then((valid) => {
        if (!valid) {
          reject({ status: 401, err: new Error('Unauthorized') });
          return;
        }
        return createAdminsession({
          user,
        });
      })
      .then((token) => {
        const response = {
          user: {
            email: user.email,
            id: user.id,
          },
          token,
        };
        resolve(response);
      })
      .catch(reject);
  });
};

function validatePassword(passwordCrypt, passwordPlain) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(passwordPlain, passwordCrypt, (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }

      if (res) {
        resolve(true);
        return;
      }

      resolve(false);
    });
  });
}

module.exports = handler;