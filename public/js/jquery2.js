$(document).ready(function(){
	$.fn.raty.defaults.path = '/image/'
	$('.star').raty({
		readOnly: true,

		score: function(data){
			return $(this).atrr('data-score')
		}
	})
	
	
})