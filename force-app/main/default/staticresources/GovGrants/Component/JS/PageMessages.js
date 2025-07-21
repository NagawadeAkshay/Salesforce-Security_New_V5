function updateMessage(mailSent){
	var msgId = pageMessages_reportSection;	
	var messageId = document.getElementById(msgId);	
	if(mailSent == true || mailSent == 'true'){
		messageId.textContent = 'Thanks! Your error has been reported. The support team will look into the problem.';
	}else{
		messageId.textContent = 'There is some problem in sending the report to support team.';
	}
}
