const jwt = require('jsonwebtoken');
const token_timeout = parseInt(process.env.TOKEN_TIMEOUT);

module.exports.getToken = (user) => {
  return new Promise((resolve, reject) => {
    if (user._id) {
      //informations that will move
      const payload = {
        userId: user._id,
        login_date: Date.now,
      };

      //sign token with app secret key
      const token = jwt.sign(payload, process.env.API_SECRET_KEY, {
        expiresIn: token_timeout, //seconds
      });

      //return response
      return resolve({
        access_token: token,
        expiresIn: '120 (minutes)',
      });
    } else {
      reject({ message: 'User bilgisi boş olamaz.' });
    }
  });
};


