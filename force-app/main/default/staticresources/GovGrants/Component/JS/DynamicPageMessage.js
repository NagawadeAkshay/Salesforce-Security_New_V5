closePageMessage(dynamicPageMessage_setTimeOut,dynamicPageMessage_name);
function closePageMessage(timeout,id){
	var j$ = jQuery.noConflict();  
	var divId = '#'+ id;	
	if(timeout != ''){
		setTimeout(function() {
			j$(divId).hide();
			if(j$(divId).is(':hidden') == true){
				j$('#mydiv').hide();
			}
		}, timeout);                       
	}
}