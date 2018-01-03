$(document).ready(function(){
	
	$('#favourite').on('submit',function(e){

		
		var id = $('#id').val()
		var receiver = $('#receiver').val()
		console.log(id)
		
		var comment = $('#comment').val();

		$.ajax({
			url:'/posts',
			type:'POST',
			data: {
				id: id,
				comment: comment,
				receiver:receiver
			},
			success: function(){
				setTimeout(function () {
						window.location.reload();
					}, 200);
			}
			
			
		})
		}
	
		
		
	})
	
	$('#like').on('click',function(){
		
		var id2 = $('#id2').val()
		var rec2 = $('#rec2').val()
	
			$.ajax({
			url:'/p',
			type:'POST',
			data: {
				id2: id2,
				rec2:rec2
				
			},
			success: function(){
					setTimeout(function () {
						window.location.reload();
					}, 200);
			}
			
			
			
		})
	
	})
	
	
	
	
	
	
})