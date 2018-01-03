
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({ // create use scheme
  
    fullname: {type: String, unique: true, default: ''},
    email: {type: String, unique: true},
    password: {type: String, default: ''},
    image: {type: String, default: 'user.png'},
	username: {type:String,default: ''},
    datejoined:{type:Date},
	passwordResetToken: { type: String,default: ''},
	passwordResetExpires: {type: Date, default: Date.now()},sentRequest: [{
		username: {type:String , default: ''}
	}],
	request: [{
		userId: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
		username: {type:String, default: ''},
        image: {type: String, default: ''}
			  }],
	friendList: [{
		friendId: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
		friendName: {type:String, default: ''},
        image: {type: String, default: ''}
	
	}],
	totalRequest: {type:Number,default:0},
	gender: {type:String, default: ''},
	city: {type: String, default: ''},
	aboutme: {type:String, default: ''},
    education: {type:String, default: ''},
    status: {type:String, default: 'Active'},
	phone: {type:String, default: ''},
    school: {type:String, default: ''},
    postprivacy: {type:String, default: ''},
    photoprivacy: {type:String, default: ''},
    friendprivacy: {type:String, default: ''},
     aboutprivacy: {type:String, default: ''},
    mantra: {type:String, default: ''},
    address: {type:String, default: ''},
    birthday:{type:String},
    job: {type:String, default: ''},
	url: {type:String, default: ''},
	hobbies:[{
    name: {type:String, default: ''},
        
        
	}],
	post: [
		{	userid: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
			username: {type:String, default: ''},
		 	
			date: {type:Date},
		 	post: {type:String,default: ''},
		 likes:[{
			 userid:{type:String,default:''}
		 }],
			comments:[
				{
					userId: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
					name: {type:String, default: ''},
					comment: {type:String, default: ''},
					date: {type:Date},
					 image: {type: String, default: ''}
				
					
				}
			]
			
		}
	]
	

   
});

userSchema.methods.encryptPassword = function(password){
   return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null); 
}//encrypt the passworf using hashsync and adding salt to it
//};
//
userSchema.methods.validUserPassword = function(password){
    return bcrypt.compareSync(password, this.password); //this is when i login to check password mtches or not
//};
}
module.exports = mongoose.model('User', userSchema);