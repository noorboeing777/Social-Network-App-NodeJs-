
	var socket = io()
	
	socket.on('connect',function(){
		
		var room = 'Global Room';
			var name = $('#name-user').val();
		var img = $('#name-image').val()
		socket.emit('global room',{
			room,
			name,
			img
		})
	})

	socket.on('loggeduser', function(users){
		console.log(users)
	})
	
