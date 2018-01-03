'use strict';

const passport = require('passport');
const User = require('../models/user_model');
const LocalStrategy = require('passport-local').Strategy;
var mkdirp = require('mkdirp')
var fs = require('fs-extra')
var resizeImg = require('resize-img')

passport.serializeUser((user, done) => {
    done(null, user.id);		//serialize the user
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => { //deserialize but first check if that id exist
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({ // create stategy of how to use signin feature
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => { //callback
    
    User.findOne({'email': email}, (err, user) => { // used email as a varification, check if username with email exist or not
       if(err){
           return done(err); //error 
       }
        
        if(user){ //if exist flash it user already exist
            return done(null, false, req.flash('error', 'User with email already exist'));
        }
        
        const newUser = new User(); //else create new one
 //req.body
        newUser.fullname = req.body.fullname;
		newUser.username = req.body.username
		newUser.phone = req.body.phone;
		newUser.birthday = req.body.birthday
		newUser.city = req.body.city;
        newUser.datejoined = Date.now()
		newUser.job = req.body.job
		newUser.url = req.body.url
        newUser.email = req.body.email;
		newUser.gender = req.body.gender
        newUser.password = newUser.encryptPassword(req.body.password); // call ecrrpy password function fro user.js schema function to 
       
        newUser.save((err) => {
            done(null, newUser);//then save it
        });
    });
}));

//login passport


passport.use('local.login', new LocalStrategy({ // create stategy of how to use signin feature
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => { //callback
    
    User.findOne({'email': email}, (err, user) => { // used email as a varification, check if username with email exist or not
       if(err){
           return done(err); //error 
       }
        
        const messages = [];
		if(!user ){
			messages.push('email Does not Exist')
			return done(null,false,req.flash('error',messages))
		}
		if( !user.validUserPassword(password)){
			messages.push('Password is Wrong!')
			return done(null,false,req.flash('error',messages))
		}
        if(user.status == 'Banned'){
            messages.push('You habe been banned!, please contact Admin!')
			return done(null,false,req.flash('error',messages))
        }
         if(user.status == 'Pending'){
            messages.push('You account is Pending!, please contact Admin!')
			return done(null,false,req.flash('error',messages))
        }
        
		return done(null,user);
 
    });
}));
