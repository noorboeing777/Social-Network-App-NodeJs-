const User = require('../models/user_model');
const Message = require('../models/message_model');
var mkdirp = require('mkdirp')
var fs = require('fs-extra')
var _ = require('lodash');

const async = require('async')
module.exports = (app) => {
	app.get('/users', function (req, res) {
		User.find({}, (err, user) => {
			res.render('all_users', {
				user: user
			})
		})


	})
	app.get('/user/:user', function (req, res) {
		User.findOne({
			'username': req.params.user
		}, (err, user) => {
			var galleryDir = 'public/product_images/' + user._id + '/gallery'
			fs.readdir(galleryDir, function (err, files) {
				g = files
				console.log(g)
				res.render('f_profile', {
					user: user,
					me: req.user,
					receiver: req.params.user,
					g: g
				})
			})


		})
	})
	app.post('/user/:user', (req, res) => {
		console.log(req.body.receiver)
		console.log(req.body.sender)
		async.parallel([
			function (callback) {
				if (req.body.receiver) {
					User.update({
						'username': req.body.receiver,
						'request.userId': {
							$ne: req.user._id
						},
						'friendList.friendId': {
							$ne: req.user._id
						}
					}, {
						$push: {
							request: {
								userId: req.user._id,
								image: req.user.image,
								username: req.user.username
							}
						},
						$inc: {
							totalRequest: 1
						}

					}, (err, count) => {
						callback(err, count);
					})
				}
			},
			function (callback) {
				if (req.body.receiver) {
					User.update({
						'username': req.user.username,
						'sentRequest.username': {
							$ne: req.body.receiver
						}
					}, {
						$push: {
							sentRequest: {
								username: req.body.receiver
							}
						}
					}, (err, count) => {
						callback(err, count)
					})
				}
			}


		], (err, results) => {
			res.redirect('/user/' + req.params.user)

		})
	})
	app.get('/requests', (req, res) => {
		User.findOne({
			'_id': req.user._id
		}, (err, data) => {
			res.render('requests', {
				data: data
			})

		})

	})
	app.post('/requests', (req, res) => {
		console.log(req.body.senderId)
		async.parallel([
			function (callback) {
				if (req.body.sender) {
					User.update({
						'_id': req.user._id,
						'friendList.friendId': {
							$ne: req.body.senderId
						}


					}, {
						$push: {
							friendList: {
								friendId: req.body.senderId,
								friendName: req.body.sender,
								image: req.body.image

							}
						},
						$pull: {
							request: {
								userId: req.body.senderId,
								username: req.body.sender
							}
						},
						$inc: {
							totalRequest: -1
						}
					}, (err, count) => {
						callback(err, count)
					})
				}
			},
			function (callback) {
				if (req.body.senderId) {
					User.update({
						'_id': req.body.senderId,
						'friendList.friendId': {
							$ne: req.user._id
						}


					}, {
						$push: {
							friendList: {
								friendId: req.user._id,
								friendName: req.user.username,
								image: req.user.image

							}
						},
						$pull: {
							sentRequest: {

								username: req.user.username
							}
						},

					}, (err, count) => {
						callback(err, count)
					})
				}
			},

			function (callback) {
				if (req.body.user_Id) {
					User.update({
						'_id': req.user._id,
						'request.userId': {
							$eq: req.body.user_Id
						}
					}, {
						$pull: {
							request: {
								userId: req.body.user_Id,
							}
						},
						$inc: {
							totalRequest: -1
						}


					}, (err, count) => {
						callback(err, count)
					})
				}
			},
			function (callback) {
				if (req.body.user_Id) {
					User.update({
						'_id': req.body.user_Id,
						'sentRequest.username': {
							$eq: req.user.username
						}
					}, {
						$pull: {
							sentRequest: {
								username: req.user.username
							}
						},


					}, (err, count) => {
						callback(err, count)
					})
				}
			}


		], (err, results) => {
			res.redirect('/requests')
		})

	})

	app.get('/profile', (req, res) => {
		Message.find({}, (err, msg) => {
			User.find({}, (err, alluser) => {


				User.findOne({
					'_id': req.user._id
				}, (err, data) => {
					var total = []
					var total2 = []
					var t = []
					var t2 = []
					var c = 0
					for (var i = 0; i < alluser.length; i++) {
						total.push(alluser[i])
						total2.push(alluser[i])

					}
					for (var j = 0; j < data.friendList.length; j++) {
						t.push(data.friendList[j])
						t2.push(data.friendList[j])
					}
					var friendarray = _.difference(t2, total2)
					var myarray = _.difference(total, t)


					console.log(friendarray)


					var galleryDir = 'public/product_images/' + data._id + '/gallery'
					fs.readdir(galleryDir, function (err, files) {
						g = files
						res.render('realprofile', {
							data: data,
							msg: msg,
							g: g,
							alluser: alluser,
							myarray: myarray,
							friendarray: friendarray
						})
					})
				})
			})
		})
	})
	app.get('/editProfile', (req, res) => {
		User.findOne({
			'_id': req.user._id
		}, (err, user) => {
			res.render('profileEdit', {
				user: user
			})
		})
	})

	app.get('/all_user', (req, res) => {
		User.find({}, (err, alluser) => {
			res.render('all_user', {
				alluser: alluser
			})
		})
	})

}