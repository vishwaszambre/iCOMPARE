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

let validPasswordChecker = (password) => {
    if (!password) {
        return false;
    } else {
        //console.log('test-1');
        const regExp = new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/);
        //console.log('test-2');
        return regExp.test(password);
        // console.log('test-3');
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

let lastnameLengthChecker = (lastname) => {
    if (!lastname) {
        return false;
    } else {
        if (lastname.length < 2 || lastname.length > 15) {
            return false;
        } else {
            return true;
        }
    }

}
let mobileLengthChecker = (mobile) => {
    if (!mobile) {
        return false;
    } else {
        if (mobile.toString().length != 10) {
            return false;
        } else {
            return true;
        }
    }
}

let validFirstname = (firstname) => {
    if (!firstname) {
        return false;
    } else {
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(firstname);
    }
}

let validLastname = (lastname) => {
    if (!lastname) {
        return false;
    } else {
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(lastname);
    }
}

const firstnameValidators = [
    {
        validator: firstnameLengthChecker,
        message: 'Firstname should be more than 3 but no less than 15'
    },
    {
        validator: validFirstname,
        message: 'Please enter valid firstname'
    }
]

const lastnameValidator = [
    {
        validator: lastnameLengthChecker,
        message: 'Lastname should be more than 3 but no less than 15'
    },
    {
        validator: validLastname,
        message: 'Please enter valid lastname'
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
    }
]

const mobileValidator = [
    {
        validator: mobileLengthChecker,
        message: 'Please enter a valid mobile number'
    }
]
const passwordValidator = [
    {
        validator: validPasswordChecker,
        message: 'Password must include one lowercase character, one uppercase character, a number, and a special character.'
    }
]

const Schema = mongoose.Schema;
const userSchema = new Schema({
    firstname: { type: String, required: true, validate: firstnameValidators },
    lastname: { type: String, required: true, validate: lastnameValidator },
    mobile: { type: Number, required: true, validate: mobileValidator },
    email: { type: String, required: true, lowercase: true, unique: true, validate: emailValidators },
    password: { type: String, required: true, validate: passwordValidator },
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
