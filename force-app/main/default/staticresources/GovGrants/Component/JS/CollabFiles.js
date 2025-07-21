var filesFollowing;
var documentId;
var visibility;
var owner;
var groups;
var autoCompleteItems = [];
var canUpdate;
var dTable;
var rowDate;
var rowName;
var rowDesc;
var rowOwner;
var rowVisibility;
var rowId;
var rowExtension;
var allowExternal;
var accountId;
var networkId;
var returnToElement;

var j$ = jQuery.noConflict();
j$(document).ready(function() {
	// Reduces browser compatability issues
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(val) {
			return j$.inArray(val, this);
		};
	}
	if (collabFiles_accountId) {
		accountId = collabFiles_accountId;
	} else {
		accountId = 'None';
	}
	
	// Dynamically resize text areas
	j$('#NewGroupLinkModal textarea, #NewUserLinkModal textarea').on('keyup',function() {
		j$(this).css('height','0px');
		j$(this).css('height',Math.max(50,this.scrollHeight)+'px');
	});
	Visualforce.remoting.Manager.invokeAction(
			//Re-add merge field
		    _RemotingCollabFilesActions.following,
			   function(result, event){
					   if(event.status){
						filesFollowing = result;
							checkFollowings();
						}
				   },
			   {escape:false,buffer:false}
	);
	j$('body').click(function(e) {
		if(j$(e.target).closest('.sharingSettings').length < 1 && !(j$(e.target).hasClass('shareAnchor'))) {
			j$('.sharingSettings').removeClass('active');
		}
		if(j$(e.target).closest('.collabFilesDropdownDiv').length < 1) {
			if(j$(e.target).hasClass('actionDropdown')) {
				if(j$(e.target).next().hasClass('active') || j$(e.target).parent().next().hasClass('active') ) {
					j$('.collabFilesDropdownDiv > div.tmpDiv').remove();
					j$('.collabFilesDropdownDiv').removeClass('active');
				} else {
					canUpdate = false;
					var elementDiv;
					var dropdown;
					if(j$(e.target).prop('tagName') == 'DIV') {
						elementDiv = j$(e.target);
						dropdown = j$(e.target).next();
					} else {
						elementDiv = j$(e.target).parent();
						dropdown = j$(e.target).parent().next();
					}
					documentId = elementDiv.data('version_id');
					networkId = elementDiv.data('network_id');
					if (networkId) {
						allowExternal = true;
					} else {
						networkId = null;
						allowExternal = false;
					}
					j$('.collabFilesDropdownDiv').removeClass('active');
					dropdown.addClass('active');
					dropdown.find('div:first-child > a').focus();
					var html;                 					
					if(elementDiv.data('owner_id') == collabFiles_UserId || collabFiles_canModifyAllData) {
						canUpdate = true;
						html = '<div class="tmpDiv"><a href="#" title="Upload a new version of this file" class="collabActionUpload" data-owner_id="';
						html += elementDiv.data('owner_id');
						html += '" data-version_id="';
						html += elementDiv.data('version_id');
						html += '">Upload New Version</a></div>';

						html += '<div class="tmpDiv"><a href="#" title="Edit the description of this file" class="collabActionEditDesc" onClick="openDesc(this);">Edit Description</a></div>';
						html += '<div class="tmpDiv"><a href="#" title="Delete this file" class="collabActionDelete" data-version_id="';
						html += elementDiv.data('version_id');
						html += '">Delete</a></div>';
						dropdown.find('.firstDropdownDiv').after(html);
					} /*else {
						Visualforce.remoting.Manager.invokeAction(
							'{!$RemoteAction.CollabFilesCtrl.canUploadNewVersion}',
							documentId,
							'{!$User.Id}',
							function(result, event){
								if(event.status){
									if(result) {
										canUpdate = true;f
										html = '<div class="tmpDiv"><a href="#" title="Upload a new version of this file" class="collabActionUpload" data-owner_id="';
										html += elementDiv.data('ownerId');
										html += '" data-version_id="';
										html += elementDiv.data('version_id');
										html += '">Upload New Version</a></div>';
										html += '<div class="tmpDiv"><a href="#" title="Edit this description of this file" class="collabActionEditDesc" onClick="openDesc(this);">Edit Description</a></div>';
										dropdown.find('.firstDropdownDiv').after(html);
									}
								}
							},
							{escape:false,buffer:false}
						);
					}*/
				}
				return false;
			} else {
				j$('.collabFilesDropdownDiv > div.tmpDiv, .collabFilesDropdownDiv > div.tmpDiv').remove();
				j$('.collabFilesDropdownDiv').removeClass('active');
			}
			if (j$(e.target).closest('.select2-container').length < 1) {
				j$('#UserSearchInput'+collabFiles_identifier).val('');
				j$('#GroupSearchInput'+collabFiles_identifier).val('');
				j$('.userSearchResults').empty();
				j$('.groupSearchResults').empty();
				j$('.hiddenDiv').removeClass('active');
			}
		}
	});
	if(!collabFiles_attach) {
		
		/*if (!{!settings.userSettings.canModifyAllData}) {
			j$('.collabActionUpload').each(function() {
				if ('{!$User.Id}' != j$(this).data('owner_id')) {
					if (!(canUpdate.indexOf(j$(this).data('version_id')) > -1)) {
						j$(this).parent().css('display','none');
					}
					j$(this).parent().next().css('display','none');
				}
			});
		}*/
		j$( '.collabModal' ).dialog({show: true, hide: true, modal: true, autoOpen: false, resizable: false});
		j$( '#CollabPreviewModal').dialog({width: 641 });
		j$( '#UploadNewVersion').dialog({width: 500 });
		j$( '#CollabLoadingModal').dialog({width: 300, height: 150});
		j$( '#CollabDeleteModal').dialog({width: 400, height: 150});
		j$( '#CollabFileSharingModal').dialog({width: 650});
		j$( '#CollabFileUploadModal').dialog({width: 500});
		j$( '#NewUserLinkModal, #NewGroupLinkModal').dialog({width: 600});
		j$( '#CollabFilesPreviewModal').dialog({width: 641 });
		j$( '#EditFileDescriptionModal').dialog({width: 300});
		
		
		j$('body').on('click', '.collabFilesDropdownDiv .collabActionUpload', function() {
			returnToElement = j$(this);
			documentId = j$(this).data('version_id');
			j$('#UploadNewVersion #FileDecription'+collabFiles_identifier).text(j$(this).parent().parent().parent().parent().parent().next().next().text());
			j$( '#UploadNewVersion').dialog('open');
			return false;
		});
		
		j$( 'body').on('click', '.collabFilesDropdownDiv .collabActionDelete', function() {
			returnToElement = j$(this);
			documentId = j$(this).data('version_id');
			j$(this).closest('tr').addClass('setToDelete');
			j$( '#CollabDeleteModal').dialog('open');
			return false;
		});
		
		j$( '#CollabDeleteModal > div > div > input.cancelDelete' ).click(function() {
			j$('tr').removeClass('setToDelete');
			j$( '#CollabDeleteModal').dialog('close');
			returnToElement.focus();
			return false;
		});
		j$('body').on('click', '.collabFilesDropdownDiv .collabActionShare', function() {
			returnToElement = j$(this);
			j$('#CollabLoadingModal').dialog('open');
			owner = j$(this).data('owner_id');
			visibility = j$(this).data('visibility');
			populateSharingModal();
			return false;
		});
		
		j$('#UploadNewDesc'+collabFiles_identifier).click( function() {
			editDesc();
			return false;
		});
		j$( '#UploadNewVersion > a').click(function() {
			j$( '#UploadNewVersion').dialog('close');
			returnToElement.focus();
			j$( '#UploadNewVersion').find('.collabFilesWrapper #FileDescription'+collabFiles_identifier).val('');
			return false;
		});
		j$( '#UpdateContentVersion').click(function(btnObject) {
			var input = j$('#NewContentVersion'+collabFiles_identifier)[0];
			j$( '#UploadNewVersion').dialog('close');
			j$( '#CollabLoadinModal').dialog('open');
			var filesToUpload = input.files;
		
			for(var i = 0, f; f = filesToUpload[i]; i++)
			{
				var reader = new FileReader();     
		
				// Keep a reference to the File in the FileReader so it can be accessed in callbacks
				reader.file = f; 
		
				reader.onerror = function(e) 
				{
					switch(e.target.error.code) 
					{
						case e.target.error.NOT_FOUND_ERR:
							alert('File Not Found!');
							break;
						case e.target.error.NOT_READABLE_ERR:
							alert('File is not readable');
							break;
						case e.target.error.ABORT_ERR:
							break; // noop
						default:
							alert('An error occurred reading this file.');
					};
				};     
		
				reader.onabort = function(e) 
				{
					alert('File read cancelled');
				};
		
				reader.onload = function(e) 
				{
					var FileDescription = j$('.collabFilesWrapper #FileDescription'+collabFiles_identifier).text();
					
					j$('[id$=filesHiddenFile]').val((new sforce.Base64Binary(e.target.result)).toString());
					j$('[id$=filesHiddenName]').val(this.file.name);
					j$('[id$=filesHiddenId]').val(documentId);
					j$('[id$=filesHiddenText]').val(FileDescription);
					j$( '#CollabFileUploadModal').dialog('close');
					j$( '#CollabLoadingModal').dialog('open');
					uploadNewVersion();
				};
				reader.readAsBinaryString(f);
			}
			return false;
		});
		
		j$( '.collabFilesWrapper #UploadCollabFile'+collabFiles_identifier ).click(function() {
			returnToElement = j$(this);
			j$( '#CollabFileUploadModal' ).dialog('open');
			return false;
		});
		j$( '#CollabFileUploadModal .openUploadModal' ).click(function() {
			j$( '#CollabFileUploadModal #UploadCollabFileHidden'+collabFiles_identifier).click();
			return false;
		});
	}
	jQuery.fn.dataTableExt.oApi.fnPagingInfo = function ( oSettings )
	{
		return {
			"iStart":         oSettings._iDisplayStart,
			"iEnd":           oSettings.fnDisplayEnd(),
			"iLength":        oSettings._iDisplayLength,
			"iTotal":         oSettings.fnRecordsTotal(),
			"iFilteredTotal": oSettings.fnRecordsDisplay(),
			"iPage":          oSettings._iDisplayLength === -1 ?
				0 : Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
			"iTotalPages":    oSettings._iDisplayLength === -1 ?
				0 : Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
		};
	};

	

	dTable = j$('#CollabFilesContainer'+collabFiles_identifier+'.collabFilesWrapper table.list').DataTable({
		"sDom": '<"top"f>rt<"bottom"ipl>',
		"oLanguage": {
			  "sInfo": "Total records: _TOTAL_"
		},
		"bAutoWidth": false,
		"aoColumns": [
			{ "sWidth": "100px", "bSortable": false },
			{ "sWidth": "auto" },
			{ "sWidth": "auto", "bSortable": false },
			{ "sWidth": "150px" },
			{ "sWidth": "180px", "sType": "date-salesforce"}
		],
		"order": [[ 5, "desc" ]],
		"fnDrawCallback": function () {
			var pageCurrent = this.fnPagingInfo().iPage + 1;               
			var length = this.fnGetData().length;               
			var pageTotal;
			var record = this.fnSettings().fnRecordsDisplay();
			//console.log('length=====>>',length);
			if(length == 0  || record == 0){				
				 pageTotal = this.fnPagingInfo().iTotalPages+1;
			}else{                	
				pageTotal = this.fnPagingInfo().iTotalPages;
				//console.log('length==inelse===>>',length);
				//console.log('pageTotal==inelse===>>',pageTotal);
			}
			
			//var pageTotal = this.fnPagingInfo().iTotalPages;               
			j$('#CollabFilesContainer'+collabFiles_identifier+' .pageOfPages').remove();
			j$('#CollabFilesContainer'+collabFiles_identifier+' .dataTables_paginate.paging_two_button').append('<div class="pageOfPages">Page '+pageCurrent+' of '+pageTotal+'</div>');
		},
		"bDestroy": true
	});
	
	j$(".actionClose").click(function() {
		dTable.fnPageChange(0);
		return false;
	});
	j$(dTable.fnGetNodes()).each(function(){
		var span = j$(this).find('.collabFileName > span:first-child');
		var text = span.text();
		var position = getPosition(text);
		if (position != '9999') {
			j$(this).find( '.actionAttach').data('location', position);
			span.css('background-position', '0px ' + position + 'px');
		}
		
		//Remove time
		span = j$(this).find('.modifiedDate > span:first-child');
		if (span.text().indexOf(':') >= 0) {
			span.text(span.text().substring(0, span.text().indexOf(':') - 2));
		}
	});
	j$( '#CollabDeleteModal > div > div > input.deleteFile' ).click(function() {
		j$( '#CollabDeleteModal').dialog('close');
		j$( '#CollabLoadingModal').dialog('open');
		Visualforce.remoting.Manager.invokeAction(
		//Re-add merge field
	   _RemotingCollabFilesActions.deleteFile,
			documentId,
		   function(result, event){
				   if(event.status){
						j$( '#CollabLoadingModal').dialog('close');
						var row = j$('tr.setToDelete').get(0);
						dTable.fnDeleteRow(dTable.fnGetPosition(row));
					} else {
						alert('Failed to delete row');   
					}
			   },
		   {escape:false,buffer:false}
		);
		return false;
	});
	j$.extend( jQuery.fn.dataTableExt.oSort, {
		"date-salesforce-pre": function ( a ) {
			a = a.substring(a.indexOf('>'), a.lastIndexOf('<'));
			// If there's no slash, then it's not an actual date, so return zero for sorting
			if(a.indexOf('/') === -1) {
				return '0';
			} else {
			  // Set optional items to zero
			  var hour = 0,
				  min = 0,
				  ap = 0;
			  // Execute match. Requires month, day, year. Can be mm/dd or m/d. Can be yy or yyyy
			  // Time is optional. am/pm is optional
			  // TODO - remove extra time column from array
			  var b = a.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})( (\d{1,2}):(\d{1,2}))? ?(am|pm|AM|PM|Am|Pm)?/),
				  month = b[1],
				  day = b[2],
				  year = b[3];
			  // If time exists then output hours and minutes
			  if (b[4] != undefined) {
				hour = b[5];
				min = b[6];
			  }
			  // if using am/pm then change the hour to 24 hour format for sorting
			  if (b[7] != undefined) {
				ap = b[7];
				if(hour == '12') hour = '0';
				if(ap == 'pm') hour = parseInt(hour, 10)+12;
			  }
		 
			  // for 2 digit years, changes to 20__ if less than 70
			  if(year.length == 2){
				if(parseInt(year, 10) < 70) year = '20'+year;
				else year = '19'+year;
			  }
			  // Converts single digits
			  if(month.length == 1) month = '0'+month;
			  if(day.length == 1) day = '0'+day;
			  if(hour.length == 1) hour = '0'+hour;
			  if(min.length == 1) min = '0'+min;
			  var tt = year+month+day+hour+min;
			  
			  return tt;
			}      
		  },
		  "date-salesforce-asc": function ( a, b ) {
			return a - b;
		  },
		  "date-salesforce-desc": function ( a, b ) {
			return b - a;
		  }
		});
	dTable.on( 'draw', function () {
			checkFollowings();
	} );
	j$(".collabFilesWrapper #FilesSearchText"+collabFiles_identifier).focus(function(){
		if(j$(this).val() == 'Quick Search Text') {
			j$(this).val('');
		}
		j$(this).addClass('textFieldActive');
	});
	j$(".collabFilesWrapper #FilesSearchText"+collabFiles_identifier).blur(function(){
		if(j$(this).val() == ""){
			j$(this).val('Quick Search Text');
			j$(this).removeClass('textFieldActive');
		}
	});
	j$(".collabFilesWrapper #FilesSearchText"+collabFiles_identifier).keyup(function(e){
		if(e.keyCode == 13) {
			dTable.fnFilter(this.value);
		}
	});
	j$(".collabFilesWrapper #FilesSearchButton"+collabFiles_identifier).click(function(){
		if((j$(this).prev().hasClass('textFieldActive'))) {
			dTable.fnFilter(j$(this).prev().val());
		}
		return false;
	});
	j$(".collabFilesWrapper #FilesSearchCancelButton"+collabFiles_identifier).click(function(){
		j$(this).prev().prev().val('Quick Search Text');
		dTable.fnFilter('');
		j$(this).prev().prev().removeClass('textFieldActive');
		return false;
	});
	
	j$('.collabModal > a:first-child').on('click', function() {
		j$(this).parent().dialog('close');    
		returnToElement.focus();
		return false;
	});
	
	j$('#NewGroupLinkModal > a:first-child, #NewUserLinkModal > a:first-child').click( function() {
		j$('#CollabFileSharingModal').dialog('open');
		j$('#NewGroups > li.newGroup').remove();
		j$('#NewUsers > li.newUser').remove();
		j$('#UserSearchInput'+collabFiles_identifier).val('');
		j$('#GroupSearchInput'+collabFiles_identifier).val('');
		j$('.userSearchResults').empty();
		j$('.groupSearchResults').empty();
		j$('.hiddenDiv').removeClass('active');
		return false;
	});
	
	j$('#GroupSearchAnchor, #UserSearchAnchor').click( function() {
		j$(this).next().toggleClass('active');
		return false;
	});
	
	j$('#GroupSearchInput'+collabFiles_identifier).keyup( function(e) {
		if(j$(this).val().length > 1) {
			getGroups();
		} else {
			j$('.groupSearchResults').empty();
		}
	});
	j$('#UserSearchInput'+collabFiles_identifier).keyup( function(e) {
		if(j$(this).val().length > 1) {
			getUsers();
		} else {
			j$('.userSearchResults').empty();
		}
	});
	
	j$('#NewGroupLinkModal .optionalMessage, #NewUserLinkModal .optionalMessage').focus( function(e) {
		if (!(j$(this).hasClass('active'))) {
			j$(this).val('');
			j$(this).addClass('active');
		}
	});
	j$('#NewGroupLinkModal .optionalMessage, #NewUserLinkModal .optionalMessage').blur( function(e) {
		if (j$(this).val() == '') {
			j$(this).val('Add an optional message...');
			j$(this).removeClass('active');
		}
	});
	//console.log('Before share with');
	j$('#NewGroupLinkModal .shareWithGroups, #NewUserLinkModal .shareWithUsers').click(function() {
		j$('.collabModal').dialog('close');
		j$('#CollabLoadingModal').dialog('open');
		j$('#UserSearchInput'+collabFiles_identifier).val('');
		j$('#GroupSearchInput'+collabFiles_identifier).val('');
		j$('.userSearchResults').empty();
		j$('.groupSearchResults').empty();
		j$('.hiddenDiv').removeClass('active');
		
		var ids = [];
		var shareTypes = [];
		var shareType;
		var message;
		if (j$(this).hasClass('shareWithGroups')) {
			if (j$('#NewGroupLinkModal .optionalMessage').hasClass('active')) {
				message = j$('#NewGroupLinkModal .optionalMessage').val();
			} else {
				message = '';   
			}
			j$('#NewGroups .newGroup').each(function(group) {
				ids.push(j$(this).data('id'));
				shareType = j$("input[type='radio'][name='sharingType" + j$(this).data('id') + "']:checked");
				if (shareType.length > 0) {
					shareTypes.push(shareType.val());    
				} else {
					shareTypes.push('V');   
				}
			});
		} else {
			if (j$('#NewUserLinkModal .optionalMessage').hasClass('active')) {
				message = j$('#NewUserLinkModal .optionalMessage').val();
			} else {
				message = '';   
			}     
			j$('#NewUsers .newUser').each(function(group) {
				ids.push(j$(this).data('id'));
				shareType = j$("input[type='radio'][name='sharingType" + j$(this).data('id') + "']:checked");
				if (shareType.length > 0) {
					shareTypes.push(shareType.val());    
				} else {
					shareTypes.push('V');   
				}
			});                               
		}
		Visualforce.remoting.Manager.invokeAction(
			_RemotingCollabFilesActions.addEntityLinks,
			documentId,
			ids.toString(),
			shareTypes.toString(),
			message,
			function(result, event){
				if(event.status){
					if (result == 'success') {
						j$('#NewGroups > li.newGroup').remove();
						j$('#NewUsers > li.newUser').remove();
						j$('#NewGroupModal .optionalMessage, #NewUserModal .optionalMessage').val('Add an optional message...');
						j$('#NewGroupModal .optionalMessage, #NewUserModal .optionalMessage').removeClass('active');
						populateSharingModal()
					} else {
						j$('#CollabLoadingModal').dialog('close');
					}
					returnToElement.focus();
				} else {
					alert(event.message);
				}
			},
			{escape:false,buffer:false}
		);
		while(autoCompleteItems.length > 0) {
			autoCompleteItems.pop();
		}
		return false;
	});
	j$('.collabModal').addClass('active');
	j$('.closeOnTab > :first-child').on('keydown', function(e) {
		if(e.which == 9 && e.shiftKey) {
			j$(e.target).find('.tmpDiv').remove();
			j$(e.target).closest('.closeOnTab').removeClass('active');
		}
	});
	j$('.closeOnTab > .lastChild').on('keydown', function(e) {
		if(e.which == 9 && !e.shiftKey) {
			j$(e.target).find('.tmpDiv').remove();
			j$(e.target).closest('.closeOnTab').removeClass('active');
		}
	});
	j$('#NewGroupLinkModal > a:first-child, #NewUserLinkModal > a:first-child, #NewGroupLinkModal .optionalMessage, #NewUserLinkModal .optionalMessage').on('focus', function() {
		j$('#UserSearchInput'+collabFiles_identifier).val('');
		j$('#GroupSearchInput'+collabFiles_identifier).val('');
		j$('.userSearchResults').empty();
		j$('.groupSearchResults').empty();
		j$('.hiddenDiv').removeClass('active');
	});
	
		/* 
		var windowHeight = j$(window).innerHeight();
		var collabContain = j$('.collabContainer').height();                
		//console.log('$(collabContainer).height()=====',j$('.collabContainer').height()); 
		//console.log('windowHeight=====',windowHeight); 
		if (windowHeight <= collabContain) {
			  j$('.footer').css({
				  position: 'static'                       
			  });
		  } else {
			  j$('.footer').css({
				  position: 'fixed'
			  });
		  } 
		*/
		
});

var openDesc = function(text) {
	returnToElement = j$(text);
	j$('#NewDescTextarea'+collabFiles_identifier).val(j$(text).parent().parent().parent().parent().parent().next().next().find('div').text());
	j$('#EditFileDescriptionModal').dialog('open');
	return false;
}
var editDesc = function() {
	j$('.collabModal').dialog('close');
	j$('#CollabLoadingModal').dialog('open');   
	Visualforce.remoting.Manager.invokeAction(
		_RemotingCollabFilesActions.editDesc,
		documentId,
		j$('#NewDescTextarea'+collabFiles_identifier).val(),
		function(result,event) {
			if (event.status) {
				var className = '.fileDescription' + documentId;
				j$(className).text(result);
				j$('#CollabLoadingModal').dialog('close');
				returnToElement.focus();
			}
		}, {escape:false,buffer:false}
	);
	return false;
}

var getGroups = function() {
	j$('.groupSearchResults').empty();
	j$('.groupSearchResults').append('<li class="select2-result"><span>Loading Results</span></li>');
	Visualforce.remoting.Manager.invokeAction(
		_RemotingCollabFilesActions.getGroups,
		accountId,
		j$('#GroupSearchInput'+collabFiles_identifier).val(),
		allowExternal,
		networkId,
		//'{!$User.Id}',
		function(result,event) {
			if (event.status) {
				if (result.length > 0) {
					var html = '';
					var lower = j$('#GroupSearchInput'+collabFiles_identifier).val().toLowerCase();
					var upper = j$('#GroupSearchInput'+collabFiles_identifier).val().toUpperCase();
					result.forEach( function(group) {
						if (autoCompleteItems.indexOf(group.Id) == -1) {
							html += '<li class="select2-result select2-result-selectable"><div class="select2-result-label"><a href="#GroupSearchInput" title="Share this file with ';
							html += group.Name;
							html += '" data-id="';
							html += group.Id;
							html += '" onclick="addGroup(\'';
							html += group.Name;
							html += '\',\'';
							html += group.Id;
							html += '\', \'';
							html += group.SmallPhotoUrl;
							html += '\', \'';
							html += group.MemberCount;
							html += '\');">';
							html += group.Name.replace(lower, '<span class="select2-match">' + lower + '</span>').replace(upper, '<span class="select2-match">' + upper + '</span>');
							html += '</a></div></li>'
						}
					});
					j$('.groupSearchResults').empty();
					j$('.groupSearchResults').append(html);
				} else {
					j$('.groupSearchResults').empty();
					j$('.groupSearchResults').append('<li class="select2-result"><span>No Results</span></li>');
				}
			}
		}, {escape: false,buffer:false}
	);
	return false;
}
var getUsers = function() {
	j$('.userSearchResults').empty();
	j$('.userSearchResults').append('<li class="select2-result"><span>Loading Results</span></li>');
	Visualforce.remoting.Manager.invokeAction(
		_RemotingCollabFilesActions.getUsers,
		accountId,
		allowExternal,
		j$('#UserSearchInput'+collabFiles_identifier).val(),
		collabFiles_UserId,
		function(result,event) {
			if (event.status) {
				if (result.length > 0) {
					var html = '';
					var lower = j$('#UserSearchInput'+collabFiles_identifier).val().toLowerCase();
					var upper = j$('#UserSearchInput'+collabFiles_identifier).val().toUpperCase();
					result.forEach( function(user) {
						if (autoCompleteItems.indexOf(user.Id) == -1) {
							html += '<li class="select2-result select2-result-selectable"><div class="select2-result-label"><a href="#UserSearchInput" title="Share this file with ';
							html += user.Name;
							html += '" data-id="';
							html += user.Id;
							html += '" onclick="addUser(\'';
							html += user.Name;
							html += '\',\'';
							html += user.Id;
							html += '\', \'';
							html += user.SmallPhotoUrl;
							html += '\');">';
							html += user.Name.replace(lower, '<span class="select2-match">' + lower + '</span>').replace(upper, '<span class="select2-match">' + upper + '</span>');
							html += '</a></div></li>'
						}
					});
					j$('.userSearchResults').empty();
					j$('.userSearchResults').append(html);
				} else {
					j$('.userSearchResults').empty();
					j$('.userSearchResults').append('<li class="select2-result"><span>No Results</span></li>');
				}
			}
		}, {escape: false,buffer:false}
	);
	return false;
}

var displayGroups = function() {
	//if (canUpdate) {
		//j$('#NewGroupLinkModal .newGroupsHeader > .viewer > span').text('Viewer');
		//j$('#NewGroupLinkModal .newGroupsHeader > .collaborator > span').text('Collaborator');
	//} else {
		j$('#NewGroupLinkModal .newGroupsHeader > .viewer > span').text('');
		j$('#NewGroupLinkModal .newGroupsHeader > .collaborator > span').text('');
	//}
	j$('#CollabFileSharingModal').dialog('close');   
	j$('#NewGroupLinkModal').dialog('open');   
	return false;
}
var displayUsers = function() {
	//if (canUpdate) {
	//    j$('#NewUserLinkModal .newUsersHeader > .viewer > span').text('Viewer');
	//    j$('#NewUserLinkModal .newUsersHeader > .collaborator > span').text('Collaborator');
	//} else {
		j$('#NewUserLinkModal .newUsersHeader > .viewer > span').text('');
		j$('#NewUserLinkModal .newUsersHeader > .collaborator > span').text('');
	//}
	j$('#CollabFileSharingModal').dialog('close');   
	j$('#NewUserLinkModal').dialog('open');   
	return false;
}

var addGroup = function(Name, id, photoUrl, memberCount) {
	j$('#GroupSearchInput'+collabFiles_identifier).val('');
	j$('.groupSearchResults').empty();
	j$('.hiddenDiv').removeClass('active');
	var html = '<li class="newGroup" data-id="';
	html += id;
	html += '"><div';
	/*if (canUpdate) {
		html += ' class="fullDiv"';
	}*/
	html += '><div class="actorDiv"><img src="';
	html += photoUrl;
	html += '"/ alt="Photo of ';
	html += Name;
	html += '"><div><span>';
	html += Name;
	html += '</span><span>';
	html += memberCount;
	if (memberCount > 1) {
		html += ' Members</span>';    
	} else {
		html += ' Member</span>';
	}
	html += '</div></div><div class="closeModal"><a href="#" title="Stop sharing this file with "';
	html += Name;
	html += '" onclick="removeEntity(\'';
	html += id;
	html += '\', this);"/></div></div>';
	/*if (canUpdate) {
		html += '<div><input type="radio" name="sharingType';
		html += id;
		html += '" class="sharingRadio" checked="checked" value="V"/></div><div><input type="radio" name="sharingType';
		html += id;
		html += '" class="sharingRadio" value="C"/></div></li>';
	} else {*/
		html += '</li>';   
	//}
	j$("#NewGroupLinkModal .newGroupsFooter").before(html);
	autoCompleteItems.push(id);
	return false;
}
var addUser = function(Name, id, photoUrl) {
	j$('#UserSearchInput'+collabFiles_identifier).val('');
	j$('.userSearchResults').empty();
	j$('.hiddenDiv').removeClass('active');
	var html = '<li class="newUser" data-id="';
	html += id;
	html += '"><div';
	/*if (canUpdate) {
		html += ' class="fullDiv"';
	}*/
	html += '><div class="actorDiv"><img src="';
	html += photoUrl;
	html += '" alt="Photo of ';
	html += Name;
	html += '"/><div><span>';
	html += Name;
	html += '</span>';
	html += '</div></div><div class="closeModal"><a href="#" title="Stop sharing this file" onclick="removeEntity(\'';
	html += id;
	html += '\', this);"/></div></div>';
	/*if (canUpdate) {
		html += '<div><input type="radio" name="sharingType';
		html += id;
		html += '" class="sharingRadio" checked="checked" value="V"/></div><div><input type="radio" name="sharingType';
		html += id;
		html += '" class="sharingRadio" value="C"/></div></li>';
	} else {*/
		html += '</li>';   
	//}
	j$("#NewUserLinkModal .newUsersFooter").before(html);
	autoCompleteItems.push(id);
	return false;
}

var removeEntity = function(id, anchorObj) {
	j$(anchorObj).parent().parent().parent().remove();
	for(var i = autoCompleteItems.length - 1; i >= 0; i--) {
		if(autoCompleteItems[i] === id) {
		   autoCompleteItems.splice(i, 1);
		}
	}
	return false;
}
var makePrivate = function(id, anchorObj) {
	Visualforce.remoting.Manager.invokeAction(
		_RemotingCollabFilesActions.makePrivate,
		id,
		function(result, event){
			if(event.status){
				populateSharingModal();
				j$(anchorObj).parent().next().find('.organization').find('.shareRemove').click();
			}
		},
		{escape:false,buffer:false}
	);
	return false;
}
var makeViewer = function(UserId, DocumentId, LinkedEntityId, anchorObj) {
	j$(anchorObj).parent().parent().removeClass('active');
	if(j$(anchorObj).parent().parent().prev().text() != 'viewer') {
		Visualforce.remoting.Manager.invokeAction(
			_RemotingCollabFilesActions.makeViewer,
				UserId, 
				LinkedEntityId, 
				DocumentId,
				function(result, event){
						if(event.status){
							var reference = j$(anchorObj).parent();
							var parentReference = j$(anchorObj).parent().parent();
							j$(anchorObj).parent().parent().prev().find('a:first-child').html('viewer<span></span>');
							j$(anchorObj).parent().parent().prev().find('a:first-child').attr('title', 'Keep this entity as a viewer');
							j$(anchorObj).parent().parent().remove('div.shareViewer');
							parentReference.prepend(reference);
						}
					},
				{escape:false,buffer:false}
		);
	}
	return false;
}
var removeAccess = function(UserId, DocumentId, LinkedEntityId, anchorObj) {
	if(j$(anchorObj).parent().parent().prev().text() == 'No Access') {
		j$(anchorObj).parent().parent().removeClass('active');
	} else {
		Visualforce.remoting.Manager.invokeAction(
			_RemotingCollabFilesActions.removeAccess,
				UserId, 
				LinkedEntityId, 
				DocumentId,
				function(result, event){
						if(event.status){
							if(LinkedEntityId == collabFiles_settingsorgId) {
								var reference = j$(anchorObj).parent();
								var parentReference = j$(anchorObj).parent().parent();
								j$(anchorObj).parent().parent().prev().find('a:first-child').html('No Access<span></span>');
								j$(anchorObj).parent().parent().prev().find('a:first-child').attr('title', 'Keep everyone in the organization without access');
								j$(anchorObj).parent().next().removeClass('active');
								j$(anchorObj).parent().parent().remove('div.shareCollab');
								parentReference.prepend(reference);
							} else {
								j$(anchorObj).parent().parent().empty();
							}
						}
					},
				{escape:false,buffer:false}
		);
	}
	return false;
}
var makeCollab = function(UserId, DocumentId, LinkedEntityId, anchorObj) {
	j$(anchorObj).parent().parent().removeClass('active');
	if(j$(anchorObj).parent().parent().prev().text() != 'collaborator') {
		Visualforce.remoting.Manager.invokeAction(
			_RemotingCollabFilesActions.makeCollab,
				UserId, 
				LinkedEntityId, 
				DocumentId,
				function(result, event){
						if(event.status){
							var reference = j$(anchorObj).parent();
							var parentReference = j$(anchorObj).parent().parent();
							j$(anchorObj).parent().parent().prev().find('a:first-child').html('collaborator<span></span>');
							j$(anchorObj).parent().parent().prev().find('a:first-child').attr('title', 'Keep this entity as a collaborator');
							j$(anchorObj).parent().next().removeClass('active');
							j$(anchorObj).parent().parent().remove('div.shareCollab');
							parentReference.prepend(reference);
						}
					},
				{escape:false,buffer:false}
		);
	}
	return false;
}
var bindFileEvents = function() {
	j$( '#CollabFileSharingModal .fileSharingList > li > div:first-child + div + div > a').click(function() {
		j$(this).parent().next().addClass('active');
		return false;
	});
}

var populateSharingModal = function() {
	j$('.fileSharingList').empty();
	Visualforce.remoting.Manager.invokeAction(
		_RemotingCollabFilesActions.EntityLinks,
		documentId,
		function(result, event){
			if(event.status){
				//allowExternal = false;
				var entryList;
				var html;
				var top = 98;
				var counter = 1;
				if (visibility == 'R') {
					j$('.sharingDiv').removeClass('active');
				} else {
					j$('.sharingDiv').addClass('active');
					if (collabFiles_UserId == owner) {
						j$('.makeFilePrivate').addClass('active');
						j$('.makeFilePrivate').attr('onClick','makePrivate(\'' + documentId + '\', this)');
					} else {
						j$('.makeFilePrivate').removeClass('active');
					}
				}
				if (result.length > 0) {
					var label;
					var objectId;
					var photoUrl;
					var shareType;
					result.forEach( function(entry) {
						entryList = entry.split(';');
						//console.log(entryList);
						shareType = entryList[0];
						objectId = entryList[1];
						photoUrl = entryList[2];
						label = entryList[3];
						if (counter == 1) {
							if (photoUrl == 'Organization') {
								html = '<li class="organization"><div class="orgPhoto"></div>';
								html += '<div>Any user in your company</div>';
								if (visibility == 'R' || !canUpdate) {
									html += '<div><span>';
								} else {
									html += '<div><a title="Change sharing settings for the organization from ';
								}
								if (shareType == 'V') {
									if (visibility == 'R' || !canUpdate) {
										html += 'viewer<span></span>';
										html += '</span></div>';
									} else {
										html += 'viewers" class="shareAnchor">';
										html += 'viewer<span></span>';
										html += '</a></div>';
										html += '<div class="sharingSettings" style="top: 98px">';
										html += '<div class="shareViewer"><a href="#" title="Keep everyone in the organization as a viewer" onclick="makeViewer(\''+collabFiles_UserId+'\', \'';
										html += documentId;
										html += '\', \'';
										html += objectId;
										html += '\', this);">viewer<span></span></a></div>';
										/*html += '<div class="shareCollab"><a href="#" title="Make everyone in the organization a collaborator" onclick="makeCollab(\'{!$User.Id}\', \'';
										html += documentId;
										html += '\', \'';
										html += entryList[1];
										html += '\', this);">collaborator<span></span></a></div>';*/
										html += '<div class="shareRemove"><a href="#" title="Remove access to this file from the organization" onclick="removeAccess(\''+collabFiles_UserId+'\', \'';
										html += documentId;
										html += '\', \'';
										html += objectId;
										html += '\', this);">No Access<span></span></a></div></div></div>';
									}
								} else if (shareType == 'C') {
									if (visibility == 'R' || !canUpdate) {
										html += 'collaborator<span></span>';
										html += '</span></div>';
									} else {
										html += 'collaborators" class="shareAnchor">';
										html += 'collaborator<span></span>';
										html += '</a></div>';
										html += '<div class="sharingSettings" style="top: 98px">';
										/*html += '<div class="shareCollab"><a href="#" title="Keep everyone in the organization as a collaborator" onclick="makeCollab(\'{!$User.Id}\', \'';
										html += documentId;
										html += '\', \'';
										html += entryList[1];
										html += '\', this);">collaborator<span></span></a></div>';*/
										html += '<div class="shareViewer"><a href="#" title="Make everyone in the organization a viewer" onclick="makeViewer(\''+collabFiles_UserId+'\', \'';
										html += documentId;
										html += '\', \'';
										html += objectId;
										html += '\', this);">viewer<span></span></a></div>';
										html += '<div class="shareRemove"><a href="#" title="Remove access to this file from the organization" onclick="removeAccess(\''+collabFiles_UserId+'\', \'';
										html += documentId;
										html += '\', \'';
										html += objectId;
										html += '\', this);">No Access<span></span></a></div></div></div>';
									}
								}
								html += '</li>';
							} else {
								html = '<li class="organization"><div class="orgPhoto"></div>';
								html += '<div>Any user in your company</div>';
								if (visibility == 'R') {
									html += '<div><span>No Access<span></span></span></div>';
								} else {
									html += '<div><a href="#" title="Add access to the organziation" class="shareAnchor">No Access<span></span></a></div>';
								}
								html += '<div class="sharingSettings" style="top: 98px">';
								html += '<div class="shareRemove"><a href="#" title="Keep the organization with no access" onclick="removeAccess(\''+collabFiles_UserId+'\', \'';
								html += documentId;
								html += '\', \'';
								html += objectId;
								html += '\', this);">No Access<span></span></a></div>';
								html += '<div class="shareViewer"><a href="#" title="Make everyone in the organization a viewer" onclick="makeViewer(\''+collabFiles_UserId+'\', \'';
								html += documentId;
								html += '\', \'';
								html += objectId;
								html += '\', this);">viewer</a></div>';
								/*if (canUpdate) {
									html += '<div class="shareCollab"><a href="#" title="Make everyone in the organization a collaborator" onclick="makeCollab(\'{!$User.Id}\', \'';
									html += documentId;
									html += '\', \'';
									html += entryList[1];
									html += '\', this);">collaborator</a></div>';
								}*/
								html += '</div></li>';
								top += 37;
								counter = 2;
								j$('.fileSharingList').append(html);
							}
						}
						if (counter != 1) {
							html = '<li class="';
							html += objectId;
							//if (label == 'User') {
								//entityType = 'user';
							html += '">';;
							if (photoUrl != 'Record') {
								html += '<div><a href="/';
								html += objectId;
								html += '" title="View the page for ';
								html += label;
								html += '"><img src="';
								html += photoUrl;
								html += '" alt="Photo of ';
								html += label;
								html += '"/></a></div>';
								html += '<div><a href="/';
								html += objectId;
								html += '">';
								html += label;
								html += '</a></div>';
							} else {
								html += '<div><a href="/';
								html += objectId;
								html += '" class="record" title="View the page for ';
								html += label;
								html += '"></a></div>';
								html += '<div><a href="/';
								html += objectId;
								html += '">';
								html += label;
								html += '</a></div>';
							}
							/*else if (label == 'CollaborationGroup') {
								entityType = 'group';
								html += '"><div><a href="/apex/groupView?id=';
								html += objectId;
								html += '" title="View the group page for ';
								html += entryList[3];
								html += '"><img src="';
								html += photoUrl;
								html += '" alt="Photo of ';
								html += entryList[3];
								html += '"/></a></div>';
								html += '<div><a href="/apex/groupView?id=';
								html += objectId;
								html += '">';
								html += label;
								html += '</a></div>';
							} else {
								entityType = 'Network';
								allowExternal = true;
								html += '"><div class="orgPhoto"></div>';
								html += '<div><span>';
								html += label;
								html += '</span></div>';
								//console.log('Network: ' + entryList);
							}*/
							html += '<div>'
							if (canUpdate || objectId == owner) {
								if (objectId == owner) {
									html += '<span>owner</span></div>';
								}else if (shareType == 'V' || shareType == 'null') {
									html += '<span class="sharingStatus">viewer</span>';
									/*
									html += '<a href="#" title="Change the sharing settings for ';
									html += label;
									html += '" class="shareAnchor">viewer<span></span></a>';
									*/
									//May need to include this if this entity was made a viewer by a viewer
									html += '<a href="#" title="Remove access to this file from ';
									html += label;
									html += '" onclick="removeAccess(\''+collabFiles_UserId+'\', \'';
									html += documentId;
									html += '\', \'';
									html += objectId;
									html += '\', this);"></a>';
									/*
									html += '</div>';
									html += '<div class="sharingSettings" style="top: ';
									html += top;
									html += 'px"><div class="shareViewer"><a href="#" title="Make ';
									html += label;
									html += ' a viewer of this file" onclick="makeViewer(\'{!$User.Id}\', \'';
									html += documentId;
									html += '\', \'';
									html += objectId;
									html += '\', this);">viewer<span>';
									html += '</span></a></div>';/*<div class="shareCollab"><a href="#" title="Make ';
									html += label;
									html += ' a collaborator to this file" onclick="makeCollab(\'{!$User.Id}\', \'';
									html += documentId;
									html += '\', \'';
									html += entryList[1];
									html += '\', this);">collaborator</a></div>*/ 
									html += '</div>';
								} else if (shareType == 'C') {
									html += '<a href="#" title="Change ';
									html += label;
									html += ' from a collaborator" class="shareAnchor">collaborator<span></span></a>';
									//if ('{!$User.Id}' == owner || {!settings.userSettings.canModifyAllData} || entryList[1] == '{!$User.Id}') {
										html += '<a href="#" title="Remove access to this file from ';
										html += label;
										html += '" onclick="removeAccess(\''+collabFiles_UserId+'\', \'';
										html += documentId;
										html += '\', \'';
										html += objectId;
										html += '\', this);"></a>';
									//}
									html += '</div>';
									html += '<div class="sharingSettings" style="top: ';
									html += top;
									html += 'px">';/*<div class="shareCollab"><a href="#" title="Make this ';
									html += entityType;
									html += ' a collaborator to this file" onclick="makeCollab(\'{!$User.Id}\', \'';
									html += documentId;
									html += '\', \'';
									html += entryList[1];
									html += '\', this);">collaborator<span>';
									html += '</span></a></div>*/ 
									html += '<div class="shareViewer"><a href="#" title="Make ';
									html += label;
									html += ' a viewer of this file" onclick="makeViewer(\''+collabFiles_UserId+'\', \'';
									html += documentId;
									html += '\', \'';
									html += objectId;
									html += '\', this);">viewer</a></div></div>';
								} else {
									// this is I, I don't know what to do for that
									//console.log('This unaccounted for');
									//console.log(entryList);
									html += '<a class="shareAnchor">' + label + '</a></div>';
								}
							} else {
								html += '<span>';
								if (shareType== 'V') {
									html += 'viewer</span></div>';
								} else if (shareType == 'C') {
									html += 'collaborator</span></div>';
								} else {
									html += shareType + '</span></div>';
								}
							}
						}
						html += '</li>';
						top += 37;
						counter = 2;
						j$('.fileSharingList').append(html);
					});
				}
				bindFileEvents();
				j$('#CollabLoadingModal').dialog('close');
				j$('#CollabFileSharingModal').dialog('open');
			}
		},
		{escape:false,buffer:false}
	);    
}

var getPosition = function(text) {
	var position;
	if ( typeof text == 'undefined') {
		position = '9999';
		}else {
		switch (text.toLowerCase()) {
			case 'al':
				position = '-42';
				break;
			case 'pdf':
				position = '-672';
				break;
			case 'word':
			case 'doc':
			case 'docx':
			case 'word_x':
				position = '-1132';
				break;
			case 'zip':
				position = '-1217';
				break;
			case 'gif':
			case 'jpg':
			case 'png':
				position = '-503';
				break;
			case 'text':
			case 'txt':
				position = '-925';
				break;
			case 'xls':
			case 'xlsx':
				position = '-210';
				break;
			case 'csv':
				position = '-125';
				break;
			case 'eps':
				position = '-168';
				break;
			case 'fla':
				position = '-294';
				break;
			case 'html':
				position = '-462';
				break;
			case 'ppt':
			case 'ppt_x':
				position = '-712';
				break;
			case 'psd':
				position = '-756';
				break;
			case 'rtf':
				position = '-787';
				break;
			case 'xml':
				position = '-1176';
				break;
			case 'vis':
				position = '-1047';
				break;
			default:
				position = '-968';
		}
	}
	return position;
}
var checkFollowings = function() {
	if(filesFollowing != null) {
		j$( '.actionFollow' ).each(function( ) {
			var id = j$(this).data('id');
			if (id in filesFollowing) {
				j$(this).addClass('following');
			}
		});
	}
}   
var follow = function(id) {
	if (id in filesFollowing) {
		Visualforce.remoting.Manager.invokeAction(
			_RemotingCollabFilesActions.unFollow,
				filesFollowing[id],
				function(result, event){
						if(event.status){
							 delete filesFollowing[id];
							 j$('#Follow' + id).removeClass('following');
						 }
					},
				{escape:false,buffer:false}
		);
	} else {
		Visualforce.remoting.Manager.invokeAction(
			//Re-add merge field
			_RemotingCollabFilesActions.follow,
				id,
				function(result, event){
						if(event.status){
							 filesFollowing[id] = result;
							 j$('#Follow' + id).addClass('following');
						 }
					},
				{escape:false,buffer:false}
		);
	}
	return false;
};
function resetFileField(e) {
	e.wrap('<form>').parent('form').trigger('reset');
	e.unwrap();
}

function Success() {
	location.reload();
	/*var actionList = '<div class="actionList"><span><a class="actionFollow" data-id="';
	actionList += rowId;
	actionList += '" href="#" id="Follow';
	actionList += rowId;
	actionList += '" onclick="follow(\'';
	actionList += rowId;
	actionList += '\')" title="Follow this file">Follow</a><div class="actionDropdown" data-owner_id="';
	actionList += '{!$User.Id}';
	actionList += '" data-version_id="';
	actionList += rowId;
	actionList += '"><a class="actionDropdown" data-version_id="';
	actionList += rowId;
	actionList += '" href="#" title="View additional options">Dropdown</a></div><div class="collabFilesDropdownDiv"><div class="firstDropdownDiv"><a class="collabActionDownload" href="/sfc/servlet.shepherd/version/download/';
	actionList += rowId;
	actionList += '?asPdf=false&amp;operationContext=CHATTER" title="Download this file">Download jpg</a></div><div><a class="collabActionShare" data-owner_id="{!$User.Id}" data-version_id="';
	actionList += rowId;
	actionList += '" data-visibility="';
	actionList += rowVisibility;
	actionList += '" href="#" title="View sharing settings for this file">Sharing Settings</a></div></div></span></div>';*/
	/*actionList = '<div></div>';

	var newRowName = '<div class="collabFileName"><span style="background-position: 0px ';
	newRowName += getPosition(rowExtension);
	newRowName += 'px;">';
	newRowName += rowExtension;
	newRowName += '</span><div>';
	newRowName += rowName;
	newRowName += '</div></div>';

	var newRowOwner = '<a href="#" title ="View the profile of ';
	newRowOwner += rowOwner;
	newRowOwner += '">';
	newRowOwner += rowOwner;
	newRowOwner += '</a>';

	dTable.fnAddData( [
		actionList,
		newRowName,
		'<div>' + rowDesc + '</div>',
		newRowOwner,
		'<span>' + rowDate + '</span>'
	]);
	j$( '.collabModal').dialog('close');*/
}

var upload = function(btnObject) {
	var input = j$(btnObject)[0];

	var filesToUpload = input.files;
	for(var i = 0, f; f = filesToUpload[i]; i++)
	{
		var reader = new FileReader();     

		// Keep a reference to the File in the FileReader so it can be accessed in callbacks
		reader.file = f; 

		reader.onerror = function(e) 
		{
			switch(e.target.error.code) 
			{
				case e.target.error.NOT_FOUND_ERR:
					alert('File Not Found!');
					break;
				case e.target.error.NOT_READABLE_ERR:
					alert('File is not readable');
					break;
				case e.target.error.ABORT_ERR:
					break; // noop
				default:
					alert('An error occurred reading this file.');
			};
		};     

		reader.onabort = function(e) 
		{
			alert('File read cancelled');
		};

		reader.onload = function(e) 
		{   
			j$('[id$=filesHiddenFile]').val((new sforce.Base64Binary(e.target.result)).toString());
			j$('[id$=filesHiddenName]').val(this.file.name);
			j$('[id$=filesHiddenType]').val(this.file.type);
			j$('[id$=filesHiddenText]').val(j$('#NewFileDescription'+collabFiles_identifier).val());
			j$( '#CollabFileUploadModal').dialog('close');
			j$( '#CollabLoadingModal').dialog('open');
			//console.log('loading');
			if (j$('.newFileVisibility').val() == 'Internal') {
				//console.log('internal');
				uploadNewInternalFile();
			} else if (j$('.newFileVisibility').val() == 'External') {
				//console.log('external');
				uploadNewExternalFile();
			} else {
				//console.log('private');
				uploadNewFile();
			}
		};
		reader.readAsBinaryString(f);
	}
}
var displayFilesPreview = function(id, fileName, anchorObj) {
	returnToElement = j$(anchorObj);
	j$( '#CollabFilesPreviewModal > div > img' ).attr('src', '/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=' + id + '&operationContext=CHATTER');
	j$( '#CollabFilesPreviewModal > span > p' ).text(fileName);
	j$( '#CollabFilesPreviewModal' ).dialog('open');   
	return false; 
};   
