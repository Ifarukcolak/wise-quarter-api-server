const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Geçerli bir mail adresini girin.',
    ],
    required: [true, 'email adresi  zorunludur !'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'şifre zorunludur!'],
  },
  name: {
    type: String,
    required: [true, 'isim girilmesi zorunludur!'],
  },
  surName: {
    type: String,
  },
  age: {
    type: String,
    default: 0,
  },
});

module.exports = mongoose.model('User', UserSchema);
