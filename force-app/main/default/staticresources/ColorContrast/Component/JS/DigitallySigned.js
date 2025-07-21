var j$ = jQuery.noConflict(); 
var parentId = digitallySigned_parentObjectId;
var documentId;
var apiKey = 'TIo1JdhZDAui1lp7XLFJ7gpShJYQDSMR';
var apisign = '7087E5C5AF8DDF9F51DD73573F18B683';

function closeAttachmentModal(){
	//console.log('called modal paretnt close');                     
	j$('#editModalDivTestDigSign').modal().hide();
	j$('#sendModalDiv').modal().hide();         
	j$('#viewDocument').modal().hide();    
	j$('#iframeAddContentIdDigSign').attr('src','');            
	j$('#iframeEditContentIdDigSign').attr('src','');
	j$('#iframeSendDigSign').attr('src','');
	j$('#iframeViewDocument').attr('src','');        
} 

function delAttachment1DigSign(attIdDigSign){
	var deleteMessage = digitallySigned_DeleteConfirmLabel;
	if(confirm(deleteMessage)){
		showLoadingPopUp();
		deleteAttachmentDigSign(attIdDigSign,parentId);    
	}
}

function delCookieDigSign(pBlockId){
	
	j$.removeCookie(digitallySigned_parentObjectId+"Attachment");
	
   j$('#myModalAttDigSign').modal();
	j$('#iframeAddContentIdDigSign'+ pBlockId).attr('src','/apex/'+digitallySigned_namespace+'AttachmentAdd?parentId='+digitallySigned_parentObjectId+'&pBlockId='+digitallySigned_pageblockId+'&classification='+digitallySigned_attachmentClassification+'&document=true');		
} 
function delCookie2(pBlockId){
	j$.removeCookie(digitallySigned_parentObjectId+"Attachment");         
	  j$('#myModalAttDigSign').modal();         
	j$('#iframeAddContentIdDigSign'+ pBlockId).attr('src','/apex/'+digitallySigned_namespace+'AttachmentAddExisting?parentId='+digitallySigned_parentObjectId+'&pBlockId='+digitallySigned_pageblockId+'&classification='+digitallySigned_attachmentClassification);	
} 

function refreshPage(){            
	window.parent.location = window.parent.location.href;
}

function showEditPopupDigSign( attchementId, attchmentClassification) {	
	//showLoadingPopUp();
	j$('#editModalDivTestDigSign'+digitallySigned_pbId).modal();        
	j$('#iframeEditContentIdDigSign'+digitallySigned_pbId).attr('src','/apex/'+digitallySigned_namespace+'AttachmentEdit?parentId='+ parentId +'&attachmentId='+ attchementId +'&classification='+ attchmentClassification);
}    

function showSendForSign(attIdDigSign){				
	documentId = attIdDigSign;
	j$('#sendModalDiv'+digitallySigned_pbId).modal();
	j$('#iframeSendDigSign'+digitallySigned_pbId).attr('src','/apex/'+digitallySigned_namespace+'SendForSignature?documentId=' +documentId);
	
}

function viewDocumentInfo(digiSignId){	
	j$('#viewDocument'+digitallySigned_pbId).modal(); 
	j$('#iframeViewDocument'+digitallySigned_pbId).attr('src','/apex/'+digitallySigned_namespace+'DocumentView?digitalSignId=' +digiSignId);  	
}

function cancelSign(attid){	
	Visualforce.remoting.Manager.invokeAction(
		  _RemotingDigitallySignedActions.cancelSignature,apiKey,apisign,attid,                                  
				  function(result,event){                          
					  if(event.status){									
						  //console.log('success',event); 
																							 
					  }else{									
						  //console.log('result------->>>>',result);
					  }                                                      
			  },                         
		  {escape:true}
		  );
}


function closeDialogModal(){
	//console.log('inside closeDialogModal@@@@@@@@@@@@@@@@');
	j$('#myModalAttDigSign').modal('hide') ;
 }
