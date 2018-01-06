var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var async = require('async')
var crypto = require('crypto')
var User = require('../models/user_model')
var secret = require('../secret/secret')
var mkdirp = require('mkdirp')
var fs = require('fs-extra')
var resizeImg = require('resize-img')

module.exports = (app, passport) => {
	app.get('/', function (req, res, next) {

		if (req.session.cookie.originalMaxAge != null) {
			res.redirect('/profile')
		} else {
			res.redirect('/login')
		}
	})
	app.get('/logout', function (req, res) {
		req.logout();
		req.session.destroy((err) => {
			res.redirect('/login');
		})
	})


	app.get('/signup', (req, res) => {
		const errors = req.flash('error')
		res.render('user/signup', {
			title: 'social',
			messages: errors,
			hasErrors: errors.length > 0
		});

	})
	app.get('/login', (req, res) => {
		const errors = req.flash('error')
		res.render('user/login', {
			title: 'Social',
			messages: errors,
			hasErrors: errors.length > 0
		});

	})

	app.post('/signup', signupvalidator, passport.authenticate('local.signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true
	}))


	app.post('/login', loginvalidator, passport.authenticate('local.login', {

		failureRedirect: '/login',
		failureFlash: true
	}), (req, res) => {
		if (req.body.rememberme) {
			req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000
		} else {
			req.session.cookie.maxAge = null
		}
		res.redirect('/profile')
	})

	app.get('/profile', isLoggedIn, function (req, res) {
		res.render('realprofile', {
			user: req.user
		});
	})

	app.get('/forgot', (req, res) => {
		var errors = req.flash('error')
		var info = req.flash('info')
		res.render('user/forgot', {
			title: 'social',
			messages: errors,
			hasErrors: errors.length > 0,
			info: info,
			noErrors: info.length > 0
		});
	})
	app.post('/forgot', (req, res, next) => {
		async.waterfall([
			function (callback) {
				crypto.randomBytes(20, (err, buf) => {
					var rand = buf.toString('hex')
					callback(err, rand)
				})
			},
			function (rand, callback) {
				User.findOne({
					'email': req.body.email
				}, (err, user) => {
					if (!user) {
						req.flash('error', 'No Account with that email is found')
						return res.redirect('/forgot')
					}
					user.passwordResetToken = rand;
					user.passwordResetExpires = Date.now() + 60 * 60 * 1000 // one hour
					user.save((err) => {
						callback(err, rand, user)
					});


				})

			},
			function (rand, user, callback) {

				var smtpTransport = nodemailer.createTransport({
					service: 'Gmail',
					auth: {
						user: 'noorjani42@gmail.com',
						pass: 'nooryu12'
					}
				})
				var mailOptions = {
					to: user.email,
					from: 'Rating ' + '<' + 'noorjani42@gmail.com' + '>', // only display rating,
					subject: 'Rating app password reset',
					text: 'Paaword reset for: ' + user.email + '\n\n' + 'click the link below to complete process: \n\n' +
						'http://localhost:3000/reset/' + rand + '\n\n'
				}
				smtpTransport.sendMail(mailOptions, (err, response) => {
					req.flash('info', 'A password reset token has been sent to  ' + user.email)
					return callback(err, user)
				})
			}


		], (err) => {
			if (err) {
				return next(err)
			}
			res.redirect('/forgot')
		})
	})
	app.get('/reset/:token', (req, res) => {
		User.findOne({
			passwordResetToken: req.params.token,
			passwordResetExpires: {
				$gt: Date.now()
			}
		}, (err, user) => {
			if (!user) {
				req.flash('error', 'Password reset token has expired send request again')
				return res.redirect('/forgot')
			}
			var errors = req.flash('error');
			var success = req.flash('success')
			res.render('user/reset', {
				messages: errors,
				hasErrors: errors.length > 0,
				success: success,
				noErrors: success.length > 0
			})
		})

	})
	app.post('/reset/:token', (req, res) => {
		async.waterfall([
			function (callback) {
				User.findOne({
					passwordResetToken: req.params.token,
					passwordResetExpires: {
						$gt: Date.now()
					}
				}, (err, user) => {
					if (!user) {
						req.flash('error', 'Password reset token has expired send request again')
						return res.redirect('/forgot')
					}


					req.checkBody('password', 'Password Must  not be less then 5').isLength({
						min: 5
					});
					req.checkBody('password', 'password is Required').notEmpty();
					var errors = req.validationErrors();
					if (req.body.password == req.body.cpassword) {
						if (errors) {
							var messages = []
							errors.forEach((error) => {
								messages.push(error.msg)
							})
							var errors = req.flash('error');
							res.redirect('/reset/' + req.params.token);

						} else {
							user.password = user.encryptPassword(req.body.password)
							user.passwordResetToken = undefined;
							user.passwordResetExpires = undefined;
							user.save((err) => {
								req.flash('success', 'your password has been successfully updated')
								callback(err, user);

							})
						}
					} else {
						req.flash('error', 'password and confirm password do not match')
						res.redirect('/reset/' + req.params.token)
					}

				})


			},
			function (user, callback) {
				var smtpTransport = nodemailer.createTransport({
					service: 'Gmail',
					auth: {
						user: 'noorjani42@gmail.com',
						pass: 'nooryu12'
					}
				})
				var mailOptions = {
					to: user.email,
					from: 'Rating ' + '<' + 'noorjani42@gmail.com' + '>', // only display rating,
					subject: 'Password has been updated',
					text: 'this is aconfirmation email that you password for ' + user.email + ' is updated '
				}
				smtpTransport.sendMail(mailOptions, (err, response) => {

					callback(err, user)
					var errors = req.flash('error');
					var success = req.flash('success')


					res.render('user/reset', {
						messages: errors,
						hasErrors: errors.length > 0,
						success: success,
						noErrors: success.length > 0
					})
				})

			}

		])
	})


}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		next()
	} else {
		res.redirect('/login')
	}
}

function signupvalidator(req, res, next) {
	req.checkBody('fullname', 'Username is Required').notEmpty();

	req.checkBody('email', 'Email is Required').notEmpty();
	req.checkBody('email', 'Email is Invalid').isEmail();
	req.checkBody('password', 'Password Must  not be less then 5').isLength({
		min: 5
	});
	req.checkBody('phone', 'Phone Must  not be less then 7').isLength({
		min: 7
	});
	req.checkBody('password', 'password is Required').notEmpty();
	var errors = req.validationErrors() //store result of validation return promise

	//error array
	if (errors) {
		const messages = [];
		errors.forEach((errors) => {
			messages.push(errors.msg) // pushes arrrors
		})
		req.flash('error', messages); //flash
		res.redirect('/signup') // redirect 
	} else {
		return next();
	}

}


function loginvalidator(req, res, next) {

	req.checkBody('email', 'Email is Invalid').isEmail();
	req.checkBody('password', 'password is Required').notEmpty();
	var errors = req.validationErrors() //store result of validation return promise

	//error array
	if (errors) {
		const messages = [];
		errors.forEach((errors) => {
			messages.push(errors.msg) // pushes arrrors
		})
		req.flash('error', messages); //flash
		res.redirect('/login') // redirect 
	} else {
		return next();
	}
}