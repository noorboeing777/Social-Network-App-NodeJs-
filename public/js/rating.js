$(document).ready(function(){
	var count = 0; 
	
	$('#1_star').click(function(){
		count = 1;
		console.log(count)
	})
		$('#2_star').click(function(){
		count = 2;
		console.log(count)})
			$('#3_star').click(function(){
		count = 3;
		console.log(count)
				
			})
				$('#4_star').click(function(){
		count = 4;
		console.log(count)
				})
					$('#5_star').click(function(){
		count = 5;
		console.log(count)
					})
									
						
	$('#1_star').mouseover(function(){
		$('#1_star').attr('src','/image/star_on.png')
		$('#2_star').attr('src','/image/star_off.png')
		$('#3_star').attr('src','/image/star_off.png')
		$('#4_star').attr('src','/image/star_off.png')
		$('#5_star').attr('src','/image/star_off.png')
		
		$('#showTitle').html('Bad')
		
	})
	

		$('#2_star').hover(function(){
			$('#1_star').attr('src','/image/star_on.png')
		$('#2_star').attr('src','/image/star_on.png')
		$('#3_star').attr('src','/image/star_off.png')
		$('#4_star').attr('src','/image/star_off.png')
		$('#5_star').attr('src','/image/star_off.png')
			$('#showTitle').html('Poor')
	})
	
	$('#3_star').hover(function(){
				$('#1_star').attr('src','/image/star_on.png')
		$('#2_star').attr('src','/image/star_on.png')
		$('#3_star').attr('src','/image/star_on.png')
		$('#4_star').attr('src','/image/star_off.png')
		$('#5_star').attr('src','/image/star_off.png')
		
		$('#showTitle').html('Fair')
	})
	
	$('#4_star').hover(function(){
		$('#1_star').attr('src','/image/star_on.png')
		$('#2_star').attr('src','/image/star_on.png')
		$('#3_star').attr('src','/image/star_on.png')
		$('#4_star').attr('src','/image/star_on.png')
		$('#5_star').attr('src','/image/star_off.png')
		$('#showTitle').html('Good')
	})
	
	$('#5_star').hover(function(){
		$('#1_star').attr('src','/image/star_on.png')
		$('#2_star').attr('src','/image/star_on.png')
		$('#3_star').attr('src','/image/star_on.png')
		$('#4_star').attr('src','/image/star_on.png')
		$('#5_star').attr('src','/image/star_on.png')
		$('#showTitle').html('Excellent')
	})
	
	$('#rate').on('click',function(){
		var review = $('#review').val();
		var sender = $('#sender').val();
		var id= $('#id').val();
		var newrole = $('#newrole').val()
		
		var valid = true;
		if(count === 0 ){
			valid = false
			$('#error').html('<div class="alert alert-danger"> Cannot submit empty rating </div>')
			
		}
		else{
			$('#error').html('')
		}
		if(valid === true){
			$.ajax({
				url: '/review/'+id,
				type: 'POST',
				data:{
					count:count,
					review:review,
					sender:sender,
					newrole:newrole
				},
				success: function(){
			$('#review').val('');
				 $('#sender').val('');
				$('#review').val('');
					$('#newrole').val('')
			}
				
		})
		}
		else{
			return false
		}
	})
})