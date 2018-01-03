var mkdirp = require('mkdirp')
var fs = require('fs-extra')
var resizeImg = require('resize-img')
var async = require('async')

const User = require('../models/user_model');
module.exports = (app) => {
	app.get('/me', function (req, res) {
		res.render('me', {
			user: req.user
		})
	})

	app.post('/me', (req, res) => {
		var imagef = typeof req.files.image !== "undefined" ? req.files.image.name : ""
		User.findOne({
			'_id': req.user._id
		}, (err, p) => {

			p.image = imagef


			p.save((err) => {

				mkdirp('public/product_images/' + p._id, function (err) {
					return console.log(err)
				})
				mkdirp('public/product_images/' + p._id + '/gallery', function (err) {
					return console.log(err)
				})

				mkdirp('public/product_images/' + p._id + '/gallery/thumbs', function (err) {
					return console.log(err)
				})

				if (imagef != "") {
					var ProductImage = req.files.image;
					var path = 'public/product_images/' + p._id + '/' + imagef

					ProductImage.mv(path, function (err) {
						return console.log(err)
					})
				}

				req.flash('success', 'added')

				res.redirect('/me')
			})


		})
	})
	app.get('/edit/:id', (req, res) => {
		User.findOne({
			'_id': req.user._id
		}, (err, p) => {


			var galleryDir = 'public/product_images/' + p._id + '/gallery'
			var galleryImages = null;

			fs.readdir(galleryDir, function (err, files) {


				galleryImages = files

				res.render('me2', {
					galleryImages: galleryImages,
					p: p
				})

			})

		})
	})

	app.post('/admin/products/product-gallery/:id', (req, res) => {
		var productImage = req.files.file
		var id = req.params.id
		var path = 'public/product_images/' + id + '/gallery/' + req.files.file.name
		var thumbsPath = 'public/product_images/' + id + '/gallery/thumbs/' + req.files.file.name

		productImage.mv(path, function (err) {
			console.log(err)

			resizeImg(fs.readFileSync(path), {
				width: 100,
				height: 100
			}).then(function (buf) {
				fs.writeFileSync(thumbsPath, buf)
			})
		})
		res.sendStatus(200)
	})
	app.get('/admin/products/delete-image/:image', function (req, res) {
		var originalImage = 'public/product_images/' + req.query.id + '/gallery/' + req.params.image
		var thumbImage = 'public/product_images/' + req.query.id + '/gallery/thumbs/' + req.params.image

		fs.remove(originalImage, function (err) {
			if (err) {
				console.log(err)
			} else {
				fs.remove(thumbImage, function (err) {
					if (err) {
						console.log(err)
					} else {
						res.redirect('/edit/' + req.query.id)
					}
				})
			}
		})
	})
	app.get('/post', (req, res) => {
		User.findOne({
			'_id': req.user._id
		}, (err, data2) => {

			res.render('post', {
				data2: data2
			})

		})
	})
	app.get('/posts', (req, res) => {
		User.findOne({
			'_id': req.user._id
		}, (err, data2) => {

			res.render('posts', {
				data2: data2
			})

		})
	})

	app.post('/post', (req, res) => {
		var rec = req.body.rec
		async.parallel([
			function (callback) {


				User.update({

					'_id': req.user._id,

				}, {
					$push: {
						post: {
							userid: req.user._id,
							username: req.user.fullname,
							post: req.body.post,
							date: Date.now()


						}

					}
				}, (err, count) => {
					req.flash('success', 'YOUR REVIEW HAS BEEN ADDED')
					res.redirect('/user/' + rec)
				})
			}
		])

	})
	app.post('/posts', (req, res) => {

		var receiver = req.body.receiver
		User.update({

			'post._id': req.body.id


		}, {
			"$push": {


				"post.$.comments": {
					date: Date.now(),
					comment: req.body.comment,
					image: req.user.image,
					userId: req.user._id,
					name: req.user.username
				},
			}

		}, (err, count) => {
			res.redirect('/user/' + receiver)
		})


	})
	app.post('/p', (req, res) => {


		var rec2 = req.body.rec2
		User.update({

			'post._id': req.body.id2


		}, {
			"$push": {
				"post.$.likes": {

					userid: req.user._id

				}
			}

		}, (err, count) => {
			res.redirect('/user/' + rec2)
		})


	})


}