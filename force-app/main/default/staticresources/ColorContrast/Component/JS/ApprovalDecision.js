var j$ = jQuery.noConflict();
var isSubmitDisabled;
if(commentsMap != null && commentsMap != ''){
	commentsMap = JSON.parse(commentsMap);
}
j$( document ).ready(function() {
	j$( "#sendForReviewUserDiv" ).hide();
	j$( "#submissionStatus" ).hide();
	j$('input[type=radio]').click(function(){
		enableSubmitButton();
		j$(".noComments").css('display','none');
		j$(".nothingIsChecked").css('display','none');
	});
	j$('.approvalComments').focus(function(){
		j$(".noComments").css('display','none');
		j$(".nothingIsChecked").css('display','none');
		enableSubmitButton();
	});
});

function submitForApproval(){
	var isDisapproveChecked = j$('input[value="Disapprove"]').is(':checked');
	var isApproveChecked = j$('input[value="Approve"]').is(':checked');
	var disapproveExists = j$('input[value="Disapprove"]').length;
	var approveExists = j$('input[value="Approve"]').length;
	var isReassignChecked = j$('input[value="Reassign"]').is(':checked');
	var ReassignExists = j$('input[value="Reassign"]').length;
	var issendToOwnerChecked = j$('input[value="Send to Owner"]').is(':checked');
	var sendToOwnerExists = j$('input[value="Send to Owner"]').length;

	if(!isApproveChecked && !isDisapproveChecked && !isReassignChecked && !issendToOwnerChecked){   
		j$(".nothingIsChecked").text('Please select appropriate action before submitting');
		j$(".nothingIsChecked").css('display','inline-block');
		disableSubmitButton();
	}else if(j$('.requiredMark').css('display') =='inline' && j$('.approvalComments').val().length == 0){    
		var comments = j$('.approvalComments').val();
		if(comments.length === 0){                          
			j$(".noComments").css('display','inline-block');
			disableSubmitButton();
			isSubmitDisabled = true;
		}
	}else if(isReassignChecked && j$('.select2-chosen').html() == 'Search...'){
		var val = j$('.select2-chosen').html();
		if(val == 'Search...'){
			j$(".noUserSelected").css('display','inline-block');			
			isSubmitDisabled = true;      
		}
	}else{
		enableSubmitButton();
		showLoadingPopUp();                        
		afterValidation();
		isSubmitDisabled = false;
	}
}         
function disableSubmitButton(){
	j$('.submitButton').attr('disabled','disabled');            
	j$(".submitButton").addClass("customDisableBtn");  
	j$(".submitButton").removeClass("customBtn");
}

function enableSubmitButton(){
	j$('.submitButton').removeAttr('disabled','disabled');          
	j$(".submitButton").removeClass("customDisableBtn");  
	j$(".submitButton").addClass("customBtn");
}

function createSnapshot(nextStepExists,isError){
	if(nextStepExists == false || nextStepExists == 'false'){    
		showLoadingPopUp();   
		Visualforce.remoting.Manager.invokeAction( 
			_RemotingApprovalDecision.generateSnapshot,parentId,tmplateName,flexTableParameters,listParameters,
			function(result,event){
				if(event.type == 'rpc'){ 
					hideLoadingPopup();
					window.location.href = windowLocationUrl;
				};
			}
		);
	}

	if(isError != true){
		window.location.href = windowLocationUrl;
	}
}       

function renderUserPanel(value){
	j$(".noUserSelected").css('display','none');
	var showComments = commentsMap[value];	
	if(showComments == true){
		j$('.requiredMark').css('display','inline');
		j$( "#txtArea" ).css('width','40%');
	}else{
		j$('.requiredMark').css('display','none');
		j$( "#txtArea" ).css('width','40%');
	}
	if(value == "Approve"){
		j$( "#sendForReviewUserDiv" ).hide();
		j$( "#txtArea" ).css('width','40%');
	}
	if( value == "Disapprove"){
		j$( "#sendForReviewUserDiv" ).hide();
		j$( "#txtArea" ).css('width','40%');
	}
	if( value == "Reassign"){
		j$( "#sendForReviewUserDiv" ).show();
		j$( "#txtArea" ).css('width','30%');
	}
	if( value == "Send to Owner"){
		j$( "#sendForReviewUserDiv" ).hide();
		j$( "#txtArea" ).css('width','40%');
	}
}