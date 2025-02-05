const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const SECRET_ACCESS_TOKEN = "tokensecret"

const userSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true
    },
    middleName: {
        type: String,
        required: true
    },
    lastName: {
      type: String,
      required: true
    },
    password: {
        type : String,
        required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true
    },
    profilePhoto: {
        type: String,
        required: true
    },
    Products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: []
    }]
  });

  userSchema.pre('save', async function(next) {
    try {
      if (!this.isModified('password')) return next();
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      
      next();
    } catch (error) {
      next(error); 
    }
  });

  userSchema.methods.generateAccessJWT = function () {
    let payload = {
      id: this._id,
    };
    return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
      expiresIn: '20m',
    });
  };
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User