const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const User = require('../models/user');
module.exports = (router) => {
    router.post('/register', (req, res) => {
        if (!req.body.firstname) {
            res.json({ success: false, message: 'You must provide a firstname' });
        } else {
            if (!req.body.lastname) {
                res.json({ success: false, message: 'You must provide a lastname' });
            } else {
                if (!req.body.mobile) {
                    res.json({ success: false, message: 'You must provide a mobile' });
                } else {
                    if (!req.body.email) {
                        res.json({ success: false, message: 'You must provide an email' });
                    } else {
                        if (!req.body.password) {
                            res.json({ success: false, message: 'You must provide a password' });
                        } else {
                            let user = new User({
                                firstname: req.body.firstname,
                                lastname: req.body.lastname,
                                mobile: req.body.mobile,
                                email: req.body.email.toLowerCase(),
                                password: req.body.password
                            });
                            user.save((err) => {
                                if (err) {
                                    if (err.code === 11000) {
                                        res.json({ success: false, message: 'Username or email already exists' });
                                    } else {
                                        if (err.errors) {
                                            if (err.errors.email) {
                                                res.json({ success: false, message: err.errors.email.message })
                                            } else {
                                                res.json({ success: false, message: 'Could not saved the user: ' + err });
                                            }
                                        }
                                    }
                                } else {
                                    res.json({ success: true, message: 'User saved!' });
                                }
                            })
                            //console.log(req.body);
                            //res.send('You are done for now!');
                        }
                    }
                }
            }
            // console.log(req.body);
            // res.send('hello world');
        }

    });
    return router;

}