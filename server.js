var express= require('express');
const path = require('path')
const keys = require("./config/keys");
const  _ = require('lodash')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser') // allow data to be send to the fron end in string form;
var ejs = require('ejs'); // fornt end choice
var validator = require('express-validator')
var engine = require('ejs-mate');
const http = require('http');
var session = require('express-session') //store user data into session
var fileUpload = require('express-fileupload')
const socketIO = require('socket.io');
var mongoose = require('mongoose')
var MongoStore = require('connect-mongo')(session)// to save session on refresh in database
const publicpath = path.join(__dirname,'./public');
var passport = require('passport');
var flash = require('connect-flash')
const {Global} = require('./helper/GlobalClass.js')
const helmet = require('helmet')
const compression = require('compression')



var app = express(); //creating instance of express
var port = process.env.PORT|| 3000

  const server = http.createServer(app);
		const io = socketIO(server);

app.use(express.static(publicpath))
const client = new Global()

	
	
		
		//socket.join(global.room)
			//client.EnterRoom(socket.id,global.name,global.room,global.img)
//			
//			const nameProp = client.GetRoomList(global.room)
//			const unique = _.uniqBy(nameProp,'name')
//			io.to(global.room).emit('loggeduser',unique)
//			
		
		








mongoose.Promise = global.Promise
 mongoose.connect(keys.mongoURI)


require('./config/passport')
require('./secret/secret')
 // help us to make use of static files
app.use(compression())
app.use(helmet())
app.engine('ejs',engine);
app.use(fileUpload())
app.set('view engine','ejs')
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true})) // we want to send data in json form
app.use(bodyParser.json()) // json data
//run our server using listen by adding port and callback
app.use(validator())
app.use(session({
	secret: 'mynewsecret', //set key for session id
	resave: false, // dont resave sessions.
	saveUninitialized: false,
	store: new MongoStore({mongooseConnection: mongoose.connection}) //save the session in datbase
	
}))

app.use(flash());
app.use(passport.initialize());
app.use(passport.session())


require('./controller/users')(app,passport);
require('./controller/me')(app);
require('./controller/message')(app);
require('./controller/friend')(app);
require('./controller/profileEdit')(app);
require('./controller/admin')(app);

io.on('connection',(socket)=>{
		console.log('new user commected')
		socket.on('global room',(global)=> {
			socket.join(global.room)
			client.EnterRoom(socket.id,global.name,global.room,global.img)
			
			
			const nameProp = client.GetRoomList(global.room)
			console.log(nameProp)
			const unique = _.uniqBy(nameProp,'name')
			io.to(global.room).emit('loggeduser',unique)
			
		})
	})

server.listen(port,function(){
	
	console.log('App runnign on port 3000');
	
	
})
