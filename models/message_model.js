var mongoose = require('mongoose')

var messageSchema = mongoose.Schema({
	body: {type:String,required: true},
	userFrom:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
	userTo:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
	userFromName: {type:String,required:true},
	userToName: {type:String,required:true},
	createdAt:{type:Date, default:Date.now},
	isRead:{type:Boolean, default:false},
	image:{type:String,default:false}
})

module.exports = mongoose.model('Message',messageSchema)