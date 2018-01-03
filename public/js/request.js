$(document).ready(function(){
	$('#request').on('click',function(){
		
	var receiver = $('#receiver').val()
		var sender = $('#sender').val()
		
				$.ajax({
			url:'/user/'+receiver,
			type:'POST',
			data: {
				receiver:receiver,
				sender:sender
				
			},
			success: function(){
					$('#reload').load(location.href + ' #reload')
			}
			
			
			
		})
		$('#reload').load(location.href + ' #reload')

	})
	
	
	
		
})
				  