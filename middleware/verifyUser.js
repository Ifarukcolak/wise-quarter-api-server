const jwt = require('jsonwebtoken');

module.exports.verifyUser = (req, res, next) => {
  const isAuthActive = process.env.AUTHENTICATION_IS_ACTIVE;
  if (isAuthActive === 'false') return next();
  const authRequest =
    req.headers['authorization'] ||
    req.body.Authorization ||
    req.body.authorization ||
    req.query.Authorization ||
    req.query.authorization;

  let token = '';
  if (authRequest) token = authRequest.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.API_SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(401).json({
          status: false,
          message: 'Authentication is failed, token expired.',
        });
      } else {
        req.decoded = decoded;
        req.access_token = token;
        next();
      }
    });
  } else {
    res.status(401).json({
      status: false,
      message: 'No token provided',
    });
  }
};
