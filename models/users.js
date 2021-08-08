const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }  
});

userSchema.statics.reverseNameUser = (username) => {
  return username.split('').reverse().join('');
}

module.exports = mongoose.model('User', userSchema);
