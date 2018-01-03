class Global {
	constructor(){
		this.globalroom = []
	}


EnterRoom(id,name,room,img,userId){
	var roomName = {id,name,room,img,userId}
	this.globalroom.push(roomName)
	return roomName;
}
	removeuser(id){
		var user = this.getUser(id);
		if(user){
			this.globalroom = this.globalroom.filter((user)=> user.id !== id);		
										   
		}
		return user;
								
	}
	getUser(id){
		var userlist = this.globalroom.filter((userid)=>{
			return userid.id === id;
		})[0]
		return userlist;
	}
	
	GetRoomList(room) {
		var roomName = this.globalroom.filter((user)=>{
			return user.room === room;
		})
			var names = roomName.map((user)=>{
				return {
					name:user.name,
					img:user.img,
					room:user.room,
                    userId:user.userId
				}
			})
			return names;
	
	} 
	
}
module.exports = {Global} // export class