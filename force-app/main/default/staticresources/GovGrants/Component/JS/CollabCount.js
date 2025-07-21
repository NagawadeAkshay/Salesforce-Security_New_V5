var communityChk;
j$(document).ready(function() {
	if (collabCount_ContactId) {
		communityChk = true;
	} else {
		communityChk = false;
	}
	Visualforce.remoting.Manager.invokeAction(      
		_RemotingCollabCountActions.getCollabCount,
		communityChk,
		collabCount_AccountId, 
		function(result, event){
			if(event.type === 'exception') {
				//console.log("The following exception has occured: <<<" +  event);
			}
			else if(event.status){
				if(result != null) {
					updateCountComponent(result);
				}
				else{
					//console.log('No result returned');
				}
			}
		}, 
		{escape:false,buffer:false}
	);
});
function updateCountComponent(result){
	j$('span.count.colleague').html(result['colleague']);
	j$('span.count.community').html(result['community']);
	j$('span.count.group').html(result['group']);
	j$('span.count.file').html(result['file']);
	j$('span.count.content').html(result['content']);
}