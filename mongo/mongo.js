const mongoose = require('mongoose');

//load env variables
const dot_env = require('dotenv').config();

module.exports = () => {
  let mongoDBUrl = process.env.MONGO_DB_URL;

  mongoose.connect(mongoDBUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  //catch mongoose events
  mongoose.connection.on('open', () => {
    console.log('Db connection is successfull.');
  });

  mongoose.connection.on('error', (err) => {
    console.log(`Db connection is not successfull. Error message is ${err}`);
  });

  mongoose.Promise = global.Promise;
};
