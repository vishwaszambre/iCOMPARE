const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt-nodejs');

let emailLengthChecker = (email) => {
    if (!email) {
        return false;
    } else {
        if (email.length < 5 || email.length > 30) {
            return false;
        } else {
            return true;
        }
    }
}

let validEmailChecker = (email) => {
    if (!email) {
        return false;
    } else {
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
}

let firstnameLengthChecker = (firstname) => {
    if (!firstname) {
        return false;
    } else {
        if (firstname.length < 2 || firstname.length > 15) {
            return false;
        } else {
            return true;
        }
    }
};

let validFirstname = () => {
    if (!firstname) {
        return false;
    } else {
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(firstname);
    }
}

const firstnameValidators = [
    {
        validator: firstnameLengthChecker,
        message: 'Firstname should be more than 3 but no less than 15'
    },
    {
        validator: validFirstname,
        message: 'Please enter valid name'
    }
]

const emailValidators = [
    {
        validator: emailLengthChecker,
        message: 'E-mail must be at least 5 character but not more than 30'
    },
    {
        validator: validEmailChecker,
        message: 'Please enter a valid email address'
    }]

const Schema = mongoose.Schema;
const userSchema = new Schema({
    firstname: { type: String, required: true, validate: firstnameValidators },
    lastname: { type: String, required: true },
    mobile: { type: Number, required: true },
    email: { type: String, required: true, lowercase: true, unique: true, validate: emailValidators },
    password: { type: String, required: true },
});



// Schema Middleware to Encrypt Password
userSchema.pre('save', function (next) {
    // Ensure password is new or modified before applying encryption
    if (!this.isModified('password'))
        return next();

    // Apply encryption
    bcrypt.hash(this.password, null, null, (err, hash) => {
        if (err) return next(err); // Ensure no errors
        this.password = hash; // Apply encryption to password
        next(); // Exit middleware
    });
});

// Methods to compare password to encrypted password upon login
userSchema.methods.comparePassword = (password) => {
    return bcrypt.compareSync(password, this.password); // Return comparison of login password to password in database (true or false)
}

module.exports = mongoose.model('User', userSchema);
