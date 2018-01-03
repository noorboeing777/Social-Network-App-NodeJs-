$(document).ready(function(){
$('#accept').on('click',function(){
		alert('Added')
	
		var sender = $('#sender').val()
		var senderId = $('#senderId').val()
		var image= $('#image').val()
		
				$.ajax({
			url:'/requests',
			type:'POST',
			data: {
				
				sender:sender,
				senderId:senderId,
				image:image
				
			},
			success: function(){
					$('#reload').load(location.href + ' #reload')
			}
			
			
				
		})
		$('#reload').load(location.href + ' #reload')

	})
	
	$('#reject').on('click',function(){
		alert('Rejected')
	
		
		var user_Id = $('#user_Id').val()
		
				$.ajax({
			url:'/requests',
			type:'POST',
			data: {
				
			
				user_Id:user_Id
				
			},
			success: function(){
					
			}
			
				
			
		})
		$('#reload').load(location.href + ' #reload')

	})
})