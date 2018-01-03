const  _ = require('lodash')

module.exports = function(io,Global){
	const client = new Global()
	
	io.on('connection',(socket)=>{
		console.log('new user commected')
		socket.on('global room',(global)=> {
			socket.join(global.room)
			client.EnterRoom(socket.id,global.name,global.room,global.img,global.userId)
			
			const nameProp = client.GetRoomList(global.room)
			const unique = _.uniqBy(nameProp,'name')
			io.to(global.room).emit('loggeduser',unique)
			
		})
	})
	

	

}