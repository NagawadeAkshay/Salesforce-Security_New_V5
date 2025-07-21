var j$ = jQuery.noConflict();                
function closeModal(){
	parent.closeAttachmentModal();
}
function showLoadNotification(){            
   /* j$.blockUI({
		message: 'Uploading attachment...' ,
		onUnblock : function(){
			//console.log('This');
		}
	}); */ 
}
function closeWindow(){
	saveCloseAttachment();
	if (j$('.divError').length > 0){
		// Error exists
		//console.log('There is an error on the page!');
	}
	else{
		//console.log('No errors!');
		//    parent.closeDialogModal();
	}
	// parent.closeDialogModal();
}



function getFileName(fileName, textid){
	document.getElementById(textid).textContent = '';
	document.getElementById(textid).textContent = 'File is ready for upload. Please click on save button';
}


function selectAllCheckboxes(obj,receivedInputID){
	var inputCheckBox = document.getElementsByTagName("input");
	for(var i=0; i<inputCheckBox.length; i++){
		if(inputCheckBox[i].id.indexOf(receivedInputID)!=-1){
			inputCheckBox[i].checked = obj.checked;
		}
	}
}

function onclickscrolltop(){
	//console.log('=====inonclickscrolltop ======');
	 j$('html,body').animate({
       scrollTop: $("#attachDoc").offset().top},
       'fast');
}