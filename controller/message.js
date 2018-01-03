const User = require('../models/user_model');
const async = require('async')
const Message = require('../models/message_model');
module.exports = (app)=>{
	
	app.get('/message/:id',(req,res)=>{
		
		async.parallel([
			function(callback){
			User.findById({'_id':req.params.id},(err,data)=>{
				callback(err,data);
			})
				
			},
			function(callback){
				Message.find({'$or':[{'userFrom':req.user._id,'userTo':req.params.id},
									{'userFrom':req.params.id,'userTo':req.user._id}
									]},(err,data2)=>{
					callback(err,data2)
				})
				
			},
		
					function(callback){
					const nameRegex = new RegExp("^"+req.user.fullname.toLowerCase(),"i")
					Message.aggregate(
						{$match:{$or:[{"userFromName":nameRegex},{'userToName':nameRegex}]}},
						{$sort:{'createdAt':-1}},{
							$group:{"_id":{
								"last_message_between":{
									$cond:[
										{
											$gt:[
												{$substr:["$userFromName",0,1]},
												{$substr:["$userToName",0,1]}
											]
										},
											{$concat:["$userFromName"," and " ,"$userToName"]},
											{$concat:["$userToName"," and " ,"$userFromName"]}	
										
										
									]
								}
							}, "body": {$first:"$$ROOT"}
								   }
						}, function(err,newResult){
							
							callback(err,newResult)
						}
					
					
					)
				}
			
		],function(err, results){
			var data1 = results[0];
			var data2 = results[1]
			var data3 = results[2]
		
			res.render('message',{user:req.user,data1:data1,data2:data2,data3:data3})	
		})
		
		
		
		
			
		})
	
	
	
	app.post('/message/:id',(req,res)=>{
	
		User.findOne({'_id':req.params.id},(err,data1)=>{
			console.log('MYDATA',data1)
				var mymsg = new Message();
			mymsg.userFrom = req.user._id,
				mymsg.userTo = req.params.id,
				mymsg.userFromName = req.user.fullname,
				mymsg.userToName = data1.fullname,
				mymsg.body = req.body.message,
				mymsg.image = req.body.Rimage
				mymsg.createdAt= new Date(),
				
				mymsg.save((err)=>{
				res.redirect('/message/'+req.params.id)
			})
			
				
		})
	})
}