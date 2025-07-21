var j$ = jQuery.noConflict();
var taskId; 
   j$(document).ready(function() {
	 Visualforce.remoting.Manager.invokeAction(
		_RemotingTaskDetailMessageActions.getData,
		taskDetailMessage_recordId,taskDetailMessage_taskId,true,
		function(result, event){
			if(event.status){				
				if (result != null && result != '') {
					var displayData ='<div style="padding-bottom:5px"><b> Task Details </b></div>';
					j$('#TaskDetailMessage').removeClass('hidden'); 
					var i;
					taskId = result[0]; 
					console.debug('Task id--',taskId);
					for(i = 1 ;i < result.length;i++){
						displayData +=  result[i] + '<br/>';
					}
				   j$('#TaskDetailMessage').append( displayData);
				}
			}
		},
		{escape:false,buffer:false} 
	);
}); 
function completeTask(){ 	
	Visualforce.remoting.Manager.invokeAction(
		_RemotingTaskDetailMessageActions.completeTask,
		taskId,
		function(result, event){
			if(event.status){				
				if (result != null && result != '') {
					var displayData = result;
					j$('#TaskCompletionMessage').removeClass('hidden');
					j$('#TaskDetailMessage').addClass('hidden');  
					j$('#TaskCompletionMessage').append(displayData);
				}
			}
		},
		{escape:false,buffer:false} 
	);
  } 