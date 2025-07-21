var j$ = jQuery.noConflict();
var fileMap = {};
var countMap = { 0 : false, 1 : false, 2 : false, 3: false, 4: false };
var count = 0;
var start = 0;
var totalSize = 0;
var isEmailSent = false;
var maxStringSize = 6000000;    //Maximum String size is 6,000,000 characters
var maxFileSize = 4350000;      //After Base64 Encoding, this is the max file size
var chunkSize = 950000;         //Maximum Javascript Remoting message size is 1,000,000 characters
var attachment;
var attachmentName;
var fileSize;
var fieldLabelMap;
j$(document).ready(function () {
	if(emailTemplate_isAttachment)
		j$("[id$=attachmentId]").css('display', 'block');
	else
		j$("[id$=attachmentId]").css('display', 'none');
	if( emailTemplate_targetId != null || emailTemplate_targetId != ''){
		j$('[id$=target]').val(emailTemplate_targetId);
	}
	setEmailTemplate();
	//addChooseFileOption();
});

function uploadFile() {
	var file = document.getElementById('inputFileId').files[0];	
	if(file != undefined) {
		if(file.size <= maxFileSize) {
			attachmentName = file.name;
			var fileReader = new FileReader();
			fileReader.onloadend = function(e) {
				attachment = this.result.split(',')[1];//window.btoa(this.result);  //Base 64 encode the file before sending it				
				positionIndex=0;
				fileSize = attachment.length;
				doneUploading = false;
				if(fileSize < maxStringSize) {
					//j$("[id$=docToUpload]").text(attachment);
				} else {
					alert("Base 64 Encoded file is too large.  Maximum size is " + maxStringSize + " your file is " + fileSize + ".");
				}
			}
			fileReader.onerror = function(e) {
				alert("There was an error reading the file.  Please try again.");
			}
			fileReader.onabort = function(e) {
				alert("There was an error reading the file.  Please try again.");
			}
			fileReader.readAsDataURL(file);  //Read the body of the file
		} else {
			alert("File must be under 4.3 MB in size.  Your file is too large.  Please try again.");
		}
	} else {
		alert("You must choose a file before trying to upload it");
	}
}

function getFileContacts() {
	//console.log('===', attachment);
	showLoadingPopUp();	
	passToController( attachmentName, attachment);
}

function setEmailTemplate(){	
	showLoadingPopUp();	
	Visualforce.remoting.Manager.invokeAction(
		_RemotingEmailTemplateActions.fetchEmailTemplate,emailTemplate_labelShow, 
		emailTemplate_emailTemplateName, emailTemplate_targetId, emailTemplate_email,
		function(result, event) {
			if(event.type === 'exception') {
				//console.log("The following exception has occured: <<<" +  event);
			}
			else if (event.status) {
				if(result != null) {					
					

					//timeout is required as in some cases remote action reply is earlier than CKEDitor load time.	
					setTimeout(function() { fillBodyContent(result); }, 4000);				
					
				}
				else{
					hideLoadingPopUp();
					//console.log("No Record Available");
				}
			}
		}
	);
}        

function fillBodyContent(result) {
	j$('[id$=subject]').val(result['subject']);
	//Adding Email body when the iframe is ready
	//console.log('In the body--');					
	j$('[id$=emailBody] iframe').ready(function() {  
		//console.log('In the body- in ready function-');	 									 
		if(j$('[id$=emailBody] iframe').contents().find('body').contents().size() != 0) {//Add more Attachment option Issue fix	
			//console.log('In the body- in ready function--- inside if function');
			if(result != undefined && result['body'] != undefined){ 
				j$('[id$=emailBody] iframe').contents().find('body').append(j$.parseHTML(result['body'].replace(/\n\n/g, '\n'))[0].data);
				
				j$('[id$=lagelFieldMap]').val(result.labelFieldMap);
			}							
		}						
	});
	hideLoadingPopUp();
}       
function addChooseFileOption(){
	count++;
	var input = "<input type=\"file\" name=\"inputFile\" class=\"inputFile\" id=\"inputFileId_"+count+"\" >"; 
	j$('[id$=inputFilesPanel]').append(input);
	if(count >= 5){
		j$('#addMoreOptId').hide();
	}
}

// close modal and refresh flex table
function closeFlexTableModal(isError) {

	if(isError == false){
		// $('#emailSend').attr("disabled", "disabled");
		$('#emailSend').hide();
	}
	hideLoadingPopUp();
	//console.log("isError=="+isError);
	if(emailTemplate_closeOnSuccess && isError == false) {
		var parentTableId = emailTemplate_parentTableId;
		//parent.closeModalAndRefreshFlexTable(parentTableId, 'Email sent successfully.');
		bootbox.dialog({
			message: 'Email sent successfully.' ,
			title:"Confirm",
			backdrop: false,
			closeButton: true,
			animate: true,
			buttons: {
				
				"Yes": {
				label: "Ok" ,
				className: "customBtn btn-ext btnCompact",
				callback: function(result) {
					parent.closeModalAndRefreshFlexTable(parentTableId, 'Email sent successfully.');
				}
				},
				}
			});
	}
}

// close modal and refresh flex table
function hideSendAndWaitOnModal(isError) {

	if(isError == false){
		 $('#emailSend').attr("disabled", "disabled");
	}
	hideLoadingPopUp();
	//console.log("isError=="+isError);
	if(emailTemplate_closeOnSuccess && isError == false) {
		var parentTableId = emailTemplate_parentTableId;		
		parent.closeModalAndRefreshFlexTable(parentTableId, 'Email sent successfully.');
	}
}