const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,   
        required: true
    }
}, { timestamps: true });

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};
    


module.exports = mongoose.model("User", userSchema);
