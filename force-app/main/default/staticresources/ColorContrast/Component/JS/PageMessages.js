function updateMessage(mailSent){
	var msgId = pageMessages_reportSection;	
	var messageId = document.getElementById(msgId);	
	if(mailSent == true || mailSent == 'true'){
		messageId.innerHTML = 'Thanks! Your error has been reported. The support team will look into the problem.';
	}else{
		messageId.innerHTML = 'There is some problem in sending the report to support team.';
	}
}
var isError = pageMessages_isError;
var j$ = jQuery.noConflict();
if(isError == false || isError == 'false'){
	j$("#errorDiv").fadeTo(45000, 1).slideUp("slow", function(){
		j$("#errorDiv").alert('close');
	}); 
}