const User = require('../models/user_model');
    
    module.exports = (app)=>{
        app.get('/admin',(req,res)=>{
            User.find({},(err,users)=>{
                 res.render('admin',{users,users})
            })
           
        })
        
        
         app.post('/admin',(req,res)=>{
             
            User.findOne({'username':req.body.name},(err,user)=>{
                
               user.status = req.body.status
                
                 user.save((err)=>{
                 res.redirect('/admin')
                
            })
              
           
                     
               
                
            })
           
        })
    }
