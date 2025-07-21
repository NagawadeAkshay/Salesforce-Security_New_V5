var sourceVal = 'Search...';
var targetVal = 'Search...';
var sourceUser,targetUser;
var allowClear = true;
var j$ = jQuery.noConflict();
if(taskReassignment_showFlexTable == true){
	allowClear = false;
	j$('#targetUserId').css('display','block');
	j$('.targetUser').css('display','inline-block');
	j$('#sourceUserId').css('display','block');
	j$('.sourceUser').css('display','none');
	j$('#step1').css('font-weight','0');
	j$('#step3').css('font-weight','900');
	targetVal = taskReassignment_targetUserName;
	sourceUser = taskReassignment_sourceUser;
}else{
	j$('#sourceUserId').css('display','block');
}

var srcUser = j$(".sourceUser").select2({
	 minimumInputLength: 1,
	 placeholder: sourceVal,                                       
	 allowClear : allowClear,
	 query: function (query) {                                                      
		  Visualforce.remoting.Manager.invokeAction(
			_RemotingTaskReassignmentActions.FetchUsers, 
			query.term,
			function(executeClassResult, event){                         
				if (event.status) {
					var data = {results: []}
					data.results = executeClassResult.UserList;                            
					query.callback( data);                                
				}
			}
		);                           
	 },
	 initSelection: function (element, callback) {
			callback({ id: 1, text: 'Text' });
	 }    
});
j$(srcUser).on("change", function (e) { 
	sourceUser = j$('.sourceUser').select2('data').id;
	j$('#targetUserId').css('display','block'); 
	j$('#step1').css('font-weight','0');
	j$('#step2').css('font-weight','900');
});

var targetUsr = j$(".targetUser").select2({
	 minimumInputLength: 1,
	 placeholder: targetVal,                                       
	 allowClear : allowClear,
	 query: function (query) {                                                      
		  Visualforce.remoting.Manager.invokeAction(
			_RemotingTaskReassignmentActions.FetchUsers, 
			query.term,
			function(executeClassResult, event){                         
				if (event.status) {
					var data = {results: []}
					data.results = executeClassResult.UserList;                            
					query.callback( data);                                                                                                                                                                           
				}
			}
		);                           
	 }    
});
j$(targetUsr).on("change", function (e) { 
	targetUser = j$('.targetUser').select2('data').id; 
	if(targetUser == sourceUser){
			bootbox.alert("Source User and Target User cannot be same.Please select different Source and Target Users", function() {
			});
	}else{
	var url ='/apex/TaskReassignment?sourceUser='+ sourceUser + '&targetUser=' +targetUser +'&phaseName='+taskReassignment_phaseName;
	window.open(url,'_self');
	}
});

function reset(){
		var url ='/apex/TaskReassignment';
		window.open(url,'_self');
} 