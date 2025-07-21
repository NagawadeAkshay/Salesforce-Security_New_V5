var j$ = jQuery.noConflict(); 
function closeNoteModal(){	
	//j$('#editModalDivForNotes').modal().hide();  
	j$('#newModalDivForNotes').modal('hide');          
	//j$('#iframeAddContentIdForNotes').attr('src','');            
	//j$('#iframeEditContentIdForNotes').attr('src','');
	refreshList();
} 
var delMsg;
delMsg = notes_delMsg;
function delNote(noteId){            		
	var deleteMessage = notes_DeleteConfirmLabel;
	bootbox.dialog({
	  message: deleteMessage,            
	  title:"Confirm",  
	  onEscape: function() {},
	  backdrop: false,
	  closeButton: true,
	  animate: true,
	  buttons: {
		No: {   
		   label: "No",
		   className: "customBtn btn-ext",
		  callback: function() {}
		},
		"Yes": {
		  label: "Yes" ,
		  className: "customBtn btn-ext",
		  callback: function(result) {
			 if(result){				 
				deleteNote(noteId);			 
			} 
		  }
		},
	  }
	});         
};

function deleteNotes(msg){ 		
	var deleteMessage;	
	deleteMessage = msg;	
	hideLoadingPopUp();                         
	var titleMessage = notes_AlertHeaderLabel;
	bootbox.dialog({
		size: 'small',
		message: deleteMessage,
		title: titleMessage,
		onEscape: function() {},
		backdrop: false,
		closeButton: true,
		animate: true,
		buttons: {
				ok: {
					label: "Ok",
					className: "customBtn btn-ext",
				}
			}
	});		
}
		