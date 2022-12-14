const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const Token = require('../models/token');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: 'Your email is required',
        trim: true
    },


    password: {
        type: String,
        required: 'Your password is required',
        max: 100
    },

    firstName: {
        type: String,
        required: 'First Name is required',
        max: 100
    },

    lastName: {
        type: String,
        required: 'Last Name is required',
        max: 100
    },

    bio: {
        type: String,
        required: false,
        max: 255
    },
    skill1: {
        type: String,
        required: false,
        max: 100
    },
    skill2: {
        type: String,
        required: false,
        max: 100
    },
    socialmedialink1: {
        type: String,
        required: false,
        max: 100
    },
    socialmedialink2: {
        type: String,
        required: false,
        max: 100
    },
    socialmedialink3: {
        type: String,
        required: false,
        max: 100
    },
    state: {
        type: String,
        required: false,
        max: 100
    },
    country: {
        type: String,
        required: false,
        max: 100
    },

    profileImage: {
        type: String,
        required: false,
        max: 255
    },

    picture2: {
        type: String,
        required: false,
        max: 255
    },

    isVerified: {
        type: Boolean,
        default: false,

    },

    resetPasswordToken: {
        type: String,
        required: false
    },

    resetPasswordExpires: {
        type: Date,
        required: false
    }
}, {timestamps: true});


UserSchema.pre('save',  function(next) {
    const user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    let payload = {
        id: this._id,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        state: this.state,
        country: this.country,
        bio: this.bio,
        skill1: this.skill1,
        skill2: this.skill2,
        socialmedialink1: this.socialmedialink1,
        socialmedialink2: this.socialmedialink2,
        socialmedialink3: this.socialmedialink3,
        picture2: this.picture2,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
    });
};

UserSchema.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

UserSchema.methods.generateVerificationToken = function() {
    let payload = {
        userId: this._id,
        token: crypto.randomBytes(20).toString('hex')
    };

    return new Token(payload);
};

module.exports = mongoose.model('Users', UserSchema);