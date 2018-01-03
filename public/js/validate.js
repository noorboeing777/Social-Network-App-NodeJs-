$(document).ready(function(){
	
	$('#p').on('submit',function(){
	
			
 			var post = $.trim($('#post').val());
		var rec = $('#rec').val()
			
		
		var isValid = true;
		
		if(post == ''){
		   isValid = false;
		   $('#errorMsg1').html('<div class="alert alert-danger"> Address field is Empty</div>')
		   }
			
		if(isValid == true){
			var post = {
			name,
			post,
				rec
			
			}
			$.ajax({
				url:'/post',
				type: 'POST',
				data: post,
				success: function(data){
					
					$('#post').val('')
					
					
				}
			})
		}
		else{
			return false // to print
		}
})
	
	
	
	
	
	
})