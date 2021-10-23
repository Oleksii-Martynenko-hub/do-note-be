const { Schema, model, SchemaTypes } = require('mongoose');

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  avatar: {
    type: String,
    default: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  confirmLink: {
    type: String
  },
  data: {
    type: SchemaTypes.Mixed
  }  
});

UserSchema.statics.reverseNameUser = (username) => {
  return username.split('').reverse().join('');
}

module.exports = model('User', UserSchema);
