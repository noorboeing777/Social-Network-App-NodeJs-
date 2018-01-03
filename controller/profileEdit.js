	const User = require('../models/user_model');
module.exports = (app)=>{
    
    app.post('/editProfile',(req,res)=>{
        User.findOne({'_id':req.user._id},(err,user)=>{
            user.job = req.body.job
            user.fullname = req.body.fullname
            user.phone = req.body.phone
            user.gender = req.body.gender
            user.url = req.body.url
            user.birthday=req.body.birthday
            user.address=req.body.address
            user.school=req.body.school
            user.education = req.body.education
            user.city = req.body.city
            user.mantra = req.body.mantra
            user.aboutme = req.body.aboutme
            user.postprivacy = req.body.postP
            user.photoprivacy = req.body.imageP
            user.friendprivacy = req.body.friendP,
                user.aboutprivacy = req.body.aboutP
            user.save((err)=>{
                 res.redirect('/editProfile')
                
            })
           
        })
       
       
        
    })
}