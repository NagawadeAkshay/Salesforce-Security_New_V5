var j$ = jQuery.noConflict();
var nextGroupToken = 0;
var prevGroupToken = null;
var spliceLocation = 0;
var filesList = new Array();
var requestList = new Array();
var userList = new Array();
var communityId;
var externalUsers = groupView_ExternalUsers;
var emailSettings = '';
var newOwnerId = 'none';
var accountId = 'none';
var memberCount;
 j$(document).ready(function() {
	if (groupView_canViewGroup) {
		j$('#GroupContainer').show();
	} else {
		j$('#GroupContainer').remove();
	}
	if(groupView_community != null) {
		communityId = groupView_communityId;
	} else {
		communityId =  null;
	}
	if (groupView_groupSettings) {
		emailSettings = '.'+groupView_groupSettings;
	}
	if (groupView_accountId) {
		accountId = groupView_accountId;
	}
	Visualforce.remoting.Manager.invokeAction(
		   _RemotingGroupViewActions.getGroupMembers,
				communityId,
				groupView_GroupId,
				0,
				function(result,event){
					if(event.status) {
						if (result != null) {
							var html;
							if (result.members.length > 0 ) {
								result.members.forEach( function(member) {
									html = getGroupMemberHtml(member.user);
									j$('.groupRightSidebar > div:first-child').prepend(html);
								});
								html = '<div class="groupSubheader"><span>Group Members</span><a href="#!" class="showAllMembers" ';
								html += 'onClick="showAllGroupMembers();">Show All(';
								memberCount = result.totalMemberCount;
								html += memberCount;
								html += ')</a></div>';
							} else {
								html = '<div class="groupSubheader><span>Group Members</span></div>';
							}
							j$('.groupRightSidebar > div:first-child').prepend(html);
						}
					}
			},
			{escape:false,buffer:false}
	);
	j$('#EditGroupInformation textarea').on('keyup',function() {
		j$(this).css('height','0px');
		j$(this).css('height',Math.max(50,this.scrollHeight)+'px');
	});             
	if (groupView_groupSettings) {
		var text = '.emailOption' + emailSettings + ' > i';
		j$(text).addClass('active');
	}

	j$( '.collabModal' ).dialog({show: true, hide: true, modal: true, autoOpen: false, resizable: false});
	j$( '#VerifyModal').dialog({width: 300 });
	j$( '#VerifyDelete').dialog({width: 300 });
	j$( '#ShowGroupFiles').dialog({width: 1038 });
	j$( '#EditGroupInformation, #ShowAllGroupModal').dialog({width: 500});
	j$( '#GroupSettingsModal').dialog({width: 750 });
	j$('body').click(function(e){
		if(j$(e.target).hasClass('emailSettings')) {
			j$('.emailSettingsHiddenDiv').toggleClass('active');
		} else {
			j$('.emailSettingsHiddenDiv').removeClass('active');
		}
		if(j$(e.target).closest('.hiddenDiv').length < 1 && !(j$(e.target).hasClass('select2-choice'))) {
			j$('.hiddenDiv').removeClass('active');
		}
	});
	j$( '.closeGroupList' ).on('click',function() {
		spliceLocation = 0;    
	});
	j$('.emailOption').click(function(){
		var emailOption = j$(this);
		Visualforce.remoting.Manager.invokeAction(                
			_RemotingGroupViewActions.updateEmailFrequency,
			communityId,
			groupView_GroupId,
			j$(this).text(),
					function(result, event){
						if(event.status){
							j$('.emailOption > i').removeClass('active');
							emailOption.find('i').addClass('active');
						} else {
							alert(event.message);
						}
					},
				{escape:false,buffer:false}
			);
	});
	j$('.pendingRequests').click(function() {
		j$( '#ShowAllGroupModal').dialog('open');
		displayNextPendingRequestPage();
	});
	j$('.addMembers').click(function() {
		j$( '#ShowAllGroupModal').dialog('open');
		displayNextUserPage();
	});
	j$('.removeMembers').click(function() {
		j$( '#ShowAllGroupModal').dialog('open');
		displayNextGroupMemberPage(0, true);
	});
	j$('.changeRoles').click(function() {
		j$( '#ShowAllGroupModal').dialog('open');
		displayNextRolePage(0);
	});
	j$('.groupSettings').click(function() {
		newOwnerId = 'none';
		j$('#OwnerSearchAnchor').text(groupView_groupOwner);
		j$( '#GroupSettingsModal').dialog('open');
	});
	j$('.closeMembersList').click(function() {
		nextGroupToken = 0;
		prevGroupToken = null;
		spliceLocation = 0;
	});
	j$('.groupLeftSidebar .editInfo').click(function() {
		j$('#EditGroupInformation').dialog('open');
	});
	j$( '.groupVisible > input[name=visible]').click(function() {
		if(j$(this).val() == 'private') {
			j$(this).parent().next().find('input').removeAttr('disabled');
		} else {
			j$(this).parent().next().next().find('input').attr('disabled','disabled');
		}
	});
	j$( '.saveInfo').click( function() {
		Visualforce.remoting.Manager.invokeAction(                
			_RemotingGroupViewActions.updateGroupInfo,
			communityId,
			groupView_GroupId,
			j$( '.newGroupInformationTitle').val(),
			j$( '.newGroupInformationText').val(),
					function(result, event){
						if(event.status){
							j$('#EditGroupInformation').dialog('close');
						} else {
							alert(event.message);
						}
					},
				{escape:false,buffer:false}
			);
	});
	j$( '.deleteGroup').click( function() {
		j$('#GroupSettingsModal').dialog('close');
		j$('#VerifyDelete').dialog('open');
	});
	j$('#CancelDeleteGroup').click( function() {
		j$('#VerifyDelete').dialog('close');
		j$('#GroupSettingsModal').dialog('open');
	});
	j$('#VerifyDeleteGroup').click( function() {
		j$('#VerifyDelete').dialog('close');
		j$('#GroupLoadingModal').dialog('open');
		Visualforce.remoting.Manager.invokeAction(                
			_RemotingGroupViewActions.deleteGroup,
			groupView_GroupId,
			function(result, event){
				if(event.status){
					location.href = '/apex/collab?collabTab=groups';
				} else {
					alert(event.message);
				}
			},
			{escape:false,buffer:false}
		);
	});
	j$( '.saveGroup').click( function() {
		j$('#GroupSettingsModal').dialog('close');
		j$('#GroupLoadingModal').dialog('open');
		var visibility;
		if(j$( '.groupVisible > input[name=visible]:checked').length > 0) {
			visibility = j$( '.groupVisible > input[name=visible]:checked').val();
		} else {
			visibility = 'private';
		}
		Visualforce.remoting.Manager.invokeAction(                
			_RemotingGroupViewActions.updateGroup,
			communityId,
			groupView_GroupId,
			j$( '.groupNameInput > input').val(),
			j$( '.groupAllow > input:checked').length > 0,
			j$( '.groupDescriptionInput > textarea').val(),
			j$( '.groupArchiveInput > input[name=archive]:checked').val() == 'noArchive',
			visibility,
			newOwnerId,
			function(result, event){
				if(event.status){
					location.reload();
				} else {
					alert(event.message);
				}
			},
			{escape:false,buffer:false}
			);
	});
	Visualforce.remoting.Manager.invokeAction(
		   _RemotingGroupViewActions.getPendingRequests,
				communityId,
				groupView_GroupId,
				function(result,event){
					if(event.status) {
						requestList = result;
					}
			},
			{escape:false,buffer:false}
		);
	Visualforce.remoting.Manager.invokeAction(
		   _RemotingGroupViewActions.getGroupFiles,
				groupView_GroupId,
				function(result,event){
					if(event.status) {
						var html;
						var output = result.slice(0,10);
						output.forEach( function(file) {
							html = '<div class="file"><a href="/sfc/servlet.shepherd/version/download/';
							html += file.Id;
							html += '?asPdf=false&operationContext=CHATTER" data-extension="';
							html += file.FileExtension;
							html += '" title="Download this file">';
							html += file.Title;
							html += '</a></div>';
							j$('.groupRightSidebar > div + div').append(html);
						});
						if (result.length > 0) {
							html = '<div class="groupSubheader groupFilesSubheader"><span>Group Files</span><a class="showAllFiles"';
							html += 'href="#!" onClick="showAllGroupFiles();" title="View all group files">Show All(';
							html += result.length;
							html += ')</a></div>';
						} else {
							html = '<div class="groupSubheader groupFilesSubheader"><span>Group Files</span></div>';
						}
						j$('.groupRightSidebar > div + div').prepend(html);
						getGroupExtensionPictures();
					}
				},
				{escape:false,buffer:false}
			);
	Visualforce.remoting.Manager.invokeAction(
		   _RemotingGroupViewActions.getUsers,
				groupView_isInternal,
				groupView_GroupId,
				accountId,
				communityId,
				function(result,event){
					if(event.status) {
						userList = result;
					}
		},
		{escape:false,buffer:false}
	);
 
	j$('.editPhoto').on('focus', function() {
		j$(this).parent().removeClass('collabHidden');  
	});
	j$('.editPhoto').on('blur', function() {
		j$(this).parent().addClass('collabHidden');  
	});
	j$('.deletePhoto').on('click',function() {
		j$('#VerifyModal').dialog('open');   
	});
	j$('.groupLeftSidebar > .groupPhoto > img').on('mouseover', function() {
		j$('.editPhoto').parent().removeClass('collabHidden');
	});
	j$('.groupLeftSidebar > .groupPhoto > img').on('mouseout', function() {
		j$('.editPhoto').parent().addClass('collabHidden');
	});
	j$('.groupLeftSidebar .photoOptions').on('mouseover', function() {
		j$('.editPhoto').parent().removeClass('collabHidden');
	});
	j$('.groupLeftSidebar .photoOptions').on('mouseout', function() {
		j$('.editPhoto').parent().addClass('collabHidden');
	});
	j$('#VerifyModal .delete').on('click', function() {
		deletePhoto();
	});
	j$('#VerifyModal .closeModal').on('click', function() {
		j$('#VerifyModal').dialog('close');
	});
	j$('.groupLeftSidebar .uploadPhoto').on('click', function() {
		j$('#UploadPhotoHidden').click();
	});
	j$('#OwnerSearchAnchor').click( function() {
		j$(this).next().toggleClass('active');
	});
	
	j$('#OwnerSearchInput').keyup( function(e) {
		if(j$(this).val().length > 1) {
			getOwners();
		} else {
			j$('.ownerSearchResults').empty();
		}
	});
	j$('.groupContainer').show();
	j$('.collabModal').addClass('active');
});
	var getOwners = function() {
		j$('.ownerSearchResults').empty();
		j$('.ownerSearchResults').append('<li class="select2-result"><span>Loading Results</span></li>');
		Visualforce.remoting.Manager.invokeAction(
			_RemotingGroupViewActions.getOwners,
			j$('#OwnerSearchInput').val(),
			groupView_GroupId,
			groupView_isInternal1,
			function(result,event) {
				if (event.status) {
					if (result.length > 0) {
						var html = '';
						var lower = j$('#OwnerSearchInput').val().toLowerCase();
						var upper = j$('#OwnerSearchInput').val().toUpperCase();
						result.forEach( function(user) {
							html += '<li class="select2-result select2-result-selectable"><div class="select2-result-label"><a href="#OwnerSearchInput" title="Make ';
							html += user.Name;
							html += 'the owner of this group" data-id="';
							html += user.Id;
							html += '" onclick="makeOwner(\'';
							html += user.Name;
							html += '\',\'';
							html += user.Id;
							html += '\');">';
							html += user.Name.replace(lower, '<span class="select2-match">' + lower + '</span>').replace(upper, '<span class="select2-match">' + upper + '</span>');
							html += '</a></div></li>'
						});
						j$('.ownerSearchResults').empty();
						j$('.ownerSearchResults').append(html);
					} else {
						j$('.ownerSearchResults').empty();
						j$('.ownerSearchResults').append('<li class="select2-result"><span>No Results</span></li>');
					}
				}
			}, {escape: false,buffer:false}
		);
	}
	var makeOwner = function(Name, id) {
		j$('#OwnerSearchAnchor').next().removeClass('active');
		j$('#OwnerSearchAnchor').next().find('input').val('');
		j$('#OwnerSearchAnchor').next().find('ul').empty();
		j$('#OwnerSearchAnchor').text(Name);
		newOwnerId = id;
	}
	var deletePhoto = function(groupId) {
		j$('#VerifyModal').dialog('close');
		j$('#GroupLoadingModal').dialog('open');
		 Visualforce.remoting.Manager.invokeAction(
			_RemotingGroupViewActions.deleteGroupPhoto,
			communityId,
			groupView_GroupId,
			function(result,event) {
				if (event.status) {
					location.reload();
				}
			}, {escape: false,buffer:false}
		);
	}
	var displayNextRolePage = function(token) {
			Visualforce.remoting.Manager.invokeAction(
			   _RemotingGroupViewActions.getGroupMembers,
					communityId,
					groupView_GroupId,
					token,
					function(result, event){
							if(event.status){
								j$('.groupModalList').empty();
								result.members.forEach( function(member) {
									var html = getRoleHtml(member);
									j$('.groupModalList').append(html);
								});
								nextGroupToken++;
								if(result.nextPageUrl != null) {
									j$('.groupModalList').append('<li class="nextGroupPage"><a href="#!" title="View next page">Next</a></li>');
								} else {
									j$('.groupModalList').append('<li class="nextGroupPage"><span>Next</span></li>');
								}
								if (result.previousPageUrl != null) {
									j$('.groupModalList').append('<li class="prevGroupPage"><a href="#!" title="View previous page">Prev</a></li>');
									if (prevGroupToken != null) {
										prevGroupToken++;
									} else {
										prevGroupToken = 0;
									}
								} else {
									j$('.groupModalList').append('<li class="prevGroupPage"><span>Prev</span></li>');
									prevGroupToken = null;
								}
							}
					   },
				   {escape:false,buffer:false}
			);
	}
	var displayPrevRolePage = function(token) {
			Visualforce.remoting.Manager.invokeAction(
			   _RemotingGroupViewActions.getGroupMembers,
					communityId,
					groupView_GroupId,
					token,
					function(result, event){
							if(event.status){
								j$('.groupModalList').empty();
								result.members.forEach( function(member) {
									var html = getRoleHtml(member);
									j$('.groupModalList').append(html);
								});
								if(result.nextPageUrl != null) {
									j$('.groupModalList').append('<li class="nextGroupPage"><a href="#!" title="View next page">Next</a></li>');
									if (nextGroupToken != null) {
										nextGroupToken--;
									} else {
										nextGroupToken = 0;
									}
								} else {
									j$('.groupModalList').append('<li class="nextGroupPage"><span>Next</span></li>');
									nextGroupToken = null;
								}
								if (result.previousPageUrl != null) {
									j$('.groupModalList').append('<li class="prevGroupPage"><a href="#!" title="View previous page">Prev</a></li>');
									prevGroupToken--;
								} else {
									j$('.groupModalList').append('<li class="prevGroupPage"><span>Prev</span></li>');
									prevGroupToken = null;
								}
							}
					   },
				   {escape:false,buffer:false}
			);
	}
	var displayNextGroupMemberPage = function(token, canRemove) {
			Visualforce.remoting.Manager.invokeAction(
			   _RemotingGroupViewActions.getGroupMembers,
					communityId,
					groupView_GroupId,
					token,
					function(result, event){
							if(event.status){
								j$('.groupModalList').empty();
								result.members.forEach( function(member) {
									var html = getMemberHtml(member, canRemove);
									j$('.groupModalList').append(html);
								});
								if(result.nextPageUrl != null) {
									var nextPageElement = '<li class="nextGroupPage"><a href="#!" title="View next page" onclick="displayNextGroupMemberPage(';
									nextPageElement += token + 1;
									nextPageElement += ', ' + canRemove;
									nextPageElement += ');">Next</a></li>';
									j$('.groupModalList').append(nextPageElement);
								} else {
									j$('.groupModalList').append('<li class="nextGroupPage"><span>Next</span></li>');   
								}
								if (result.previousPageUrl != null) {
									var prevPageElement = '<li class="prevGroupPage"><a href="#!" title="View previous page" onclick="displayPrevGroupMemberPage(';
									prevPageElement += token - 1;
									prevPageElement += ', ' + canRemove;
									prevPageElement += ');">Previous</a></li>';
									j$('.groupModalList').append(prevPageElement);
								} else {
									j$('.groupModalList').append('<li class="prevGroupPage"><span>Prev</span></li>');
								}
							}
					   },
				   {escape:false,buffer:false}
			);
	}
	var displayPrevGroupMemberPage = function(token, canRemove) {
			Visualforce.remoting.Manager.invokeAction(
			   _RemotingGroupViewActions.getGroupMembers,
					communityId,
					groupView_GroupId,
					token,
					function(result, event){
							if(event.status){
								j$('.groupModalList').empty();
								result.members.forEach( function(member) {
									var html = getMemberHtml(member, canRemove);
									j$('.groupModalList').append(html);
								});
								if(result.nextPageUrl != null) {
									var nextPageElement = '<li class="nextGroupPage"><a href="#!" title="View next page" onclick="displayNextGroupMemberPage(';
									nextPageElement += token + 1;
									nextPageElement += ', ' + canRemove;
									nextPageElement += ');">Next</a></li>';
									j$('.groupModalList').append(nextPageElement);
								} else {
									j$('.groupModalList').append('<li class="nextGroupPage"><span>Next</span></li>');
								}
								if (result.previousPageUrl != null) {
									var prevPageElement = '<li class="prevGroupPage"><a href="#!" title="View previous page" onclick="displayPrevGroupMemberPage(';
									prevPageElement += token - 1;
									prevPageElement += ', ' + canRemove;
									prevPageElement += ');">Previous</a></li>';
									j$('.groupModalList').append(prevPageElement);
								} else {
									j$('.groupModalList').append('<li class="prevGroupPage"><span>Prev</span></li>');
								}
							}
					   },
				   {escape:false,buffer:false}
			);
	}
	var displayNextUserPage = function() {
		j$('.groupModalList').empty();
		if (spliceLocation + 7 < userList.length) {
			userList.slice(spliceLocation, spliceLocation + 7).forEach( function(user) {
				var html = getUserHtml(user);
				j$('.groupModalList').append(html);
			});
			if (spliceLocation == 0) {
				j$('.groupModalList').append('<li class="prevGroupPage"><span>Prev</span></li>');
			} else {
				j$('.groupModalList').append('<li class="prevGroupPage"><a href="#!" title="View previous page" onClick="displayPrevUserPage()">Prev</a></li>');
			}
			j$('.groupModalList').append('<li class="nextGroupPage"><a href="#!" title="View next page" onClick="displayNextUserPage()">Next</a></li>');
		} else {
			userList.slice(spliceLocation, userList.length).forEach( function(user) {
				var html = getUserHtml(user);
				j$('.groupModalList').append(html);
			});
			if (userList.length < 8) {
				j$('.groupModalList').append('<li class="prevGroupPage"><span>Prev</span></li>');
			} else {
				j$('.groupModalList').append('<li class="prevGroupPage"><a href="#!" title="View previous page" onClick="displayPrevUserPage()">Prev</a></li>');
			}
			j$('.groupModalList').append('<li class="nextGroupPage"><span>Next</span></li>');
		}
		spliceLocation += 7;
	}
	var displayPrevUserPage = function() {
		j$('.groupModalList').empty();
		if (spliceLocation - 14 <= 0) {
			userList.slice(0, 7).forEach( function(user) {
				var html = getUserHtml(user);
				j$('.groupModalList').append(html);
			});
			j$('.groupModalList').append('<li class="prevGroupPage"><span>Prev</span></li>');
			j$('.groupModalList').append('<li class="nextGroupPage"><a href="#!" title="View previous page" onClick="displayNextUserPage()">Next</a></li>');
		} else {
			userList.slice(spliceLocation - 14, spliceLocation - 7).forEach( function(user) {
				var html = getUserHtml(user);
				j$('.groupModalList').append(html);
			});
			j$('.groupModalList').append('<li class="prevGroupPage"><a href="#!" title="View previous page" onClick="displayPrevUserPage()">Prev</a></li>');
			j$('.groupModalList').append('<li class="nextGroupPage"><a href="#!" title="View next page" onClick="displayNextUserPage()">Next</a></li>');
		}
		spliceLocation -= 7;
	}
	var displayNextPendingRequestPage = function() {
		j$('.groupModalList').empty();
		if (spliceLocation + 7 > requestList.length) {
			requestList.slice(spliceLocation, spliceLocation + 7).forEach( function(request) {
				var html = getRequestHtml(request);
				j$('.groupModalList').append(html);
			});
			if (spliceLocation == 0) {
				j$('.groupModalList').append('<li class="prevGroupPage"><span>Prev</span></li>');
			} else {
				j$('.groupModalList').append('<li class="prevGroupPage"><a href="#!" title="View previous page" onClick="displayPrevPendingRequestPage()">Prev</a></li>');
			}
			j$('.groupModalList').append('<li class="nextGroupPage"><span>Next</span></li>');
		} else {
			requestList.slice(spliceLocation, requestList.length).forEach( function(request) {
				var html = getRequestHtml(request);
				j$('.groupModalList').append(html);
			});
			if (userList.length < 8) {
				j$('.groupModalList').append('<li class="prevGroupPage"><span>Prev</span></li>');
			} else {
				j$('.groupModalList').append('<li class="prevGroupPage"><a href="#!" title="View previous page" onClick="displayPrevPendingRequestPage()">Prev</a></li>');
			}
			j$('.groupModalList').append('<li class="nextGroupPage"><a href="#!" title="View next page" onClick="displayNextPendingRequestPage()">Next</a></li>');
		}
		spliceLocation += 7;
	}
	var displayPrevPendingRequestPage = function() {
		j$('.groupModalList').empty();
		if (spliceLocation - 14 <= 0) {
			requestList.slice(0,7).forEach( function(request) {
				var html = getRequestHtml(request);
				j$('.groupModalList').append(html);		                
			});
			j$('.groupModalList').append('<li class="prevGroupPage"><span>Prev</span></li>');
			j$('.groupModalList').append('<li class="nextGroupPage"><a href="#!" title="View previous page" onClick="displayNextPendingRequestPage()">Next</a></li>');
		} else {
			requestList.slice(spliceLocation - 14, spliceLocation - 7).forEach( function(request) {
				var html = getRequestHtml(request);
				j$('.groupModalList').append(html);
			});
			j$('.groupModalList').append('<li class="prevGroupPage"><a href="#!" title="View previous page" onClick="displayPrevPendingRequestPage()">Prev</a></li>');
			j$('.groupModalList').append('<li class="nextGroupPage"><a href="#!" title="View next page" onClick="displayNextPendingRequestPage()">Next</a></li>');
		}
		spliceLocation -= 7;
	}
	var showAllGroupMembers = function() {
		j$( '#ShowAllGroupModal').dialog('open');
		displayNextGroupMemberPage(0, false);
	};
	var showAllGroupFiles = function() {
		j$( '#ShowGroupFiles').dialog('open');
	};
	var getRequestHtml = function(request) {
		html = '<li class="entry request"><div><a href="/apex/'+groupView_profileNamespace+'profileRedirect?id=';
		html += request.user.id;
		html += '" title="View the profile of ';
		html += request.user.name;
		html += '">';
		if (externalUsers.lastIndexOf(request.user.id) >= 0) {
			html += '<img src="/s.gif" alt="photo" class="externalUserFlag"/>';
		}
		html += '<img src="';
		html += request.user.photo.smallPhotoUrl;
		html += '" alt="Profile picture for ';
		html += request.user.photo.smallPhotoUrl;
		html+= '"/></a><a href"/apex/'+groupView_profileNamespace+'profileRedirect?id=';
		html += request.user.id;
		html += '" title="View the profile of ';
		html += request.user.name;
		html += '">';
		html += request.user.name;
		html += '</a></div><div><a title="Add this person to the group" onClick="addMember(\'';
		html += request.user.id;
		html += '\', this)">Accept</a><a class="removeRequest" title="Decline Request" onClick="removeRequest(\'';
		html += request.id;
		html += '\', this)"></a></div></li>';
		return html;
	}
	var getRoleHtml = function(member) {
		var url = groupView_Feedback;
		html = '<li class="entry changeRole"><div><a href="/apex/'+groupView_profileNamespace+'profileRedirect?id=';
		html += member.user.id;
		html += '" title="View the profile of ';
		html += member.user.name;
		html += '">';
		if (externalUsers.lastIndexOf(member.user.id) >= 0) {
			html += '<img src="/s.gif" alt="photo" class="externalUserFlag"/>';
		}
		html += '<img src="';
		html += member.user.photo.smallPhotoUrl;
		html += '" alt="Profile picture for ';
		html += member.user.name;
		html += '"/></a><a href"/apex/'+groupView_profileNamespace+'profileRedirect?id=';
		html += member.user.id;
		html += '" title="View the profile of ';
		html += member.user.name;
		html += '">';
		html += member.user.name;
		html += '</a></div>';
		if (member.role == 'GroupOwner') {
			html += '<div><span>Owner</span></div></li>';
		} else if (member.role == 'GroupManager') {
			html += '<div class="managerHolder"><span>Manager:&nbsp;</span><input id="IsManager';
			html += member.id;
			html += '" class="isManager checked active" type="checkbox" checked="checked" onClick="changeManager(\'';
			html += member.id;
			html += '\', this);"/><label for="IsManager';
			html += member.id;
			html += '">Is this user a manager?</label><img class="loading" src="';
			html += url;
			html += '"/></div></li>';
		} else {
			html += '<div class="managerHolder"><span>Manager:&nbsp;</span><input id="IsManager';
			html += member.id;
			html += '" class="isManager active" type="checkbox" onClick="changeManager(\'';
			html += member.id;
			html += '\', this);"/><label for="IsManager';
			html += member.id;
			html += '">Is this user a manager?</label><img class="loading" src="';
			html += url;
			html += '"/></div></li>';
		}
		return html;
	}
	var addMember = function(id, anchorObj) {
		var communityId = '';
		if (groupView_community != null) {
			if (groupView_communityId != null) {
				communityId = groupView_communityId;
			}
		}
		Visualforce.remoting.Manager.invokeAction(
			   _RemotingGroupViewActions.addMember,
					id,
					groupView_GroupId,
					communityId,
					function(result, event){
							if(event.status){
								j$(anchorObj).text('Added Successfully');
								j$(anchorObj).removeAttr('onClick');
								j$(anchorObj).attr('title', 'This user has been added');
								j$(anchorObj).attr('style', 'background-position: 0px -24px');
								j$(anchorObj).next('a').remove();
								memberCount++;
								j$('.showAllMembers').text('Show All(' + memberCount + ')');
							} else {
								alert(event.message);
							}
					}, {escape:false,buffer:false}
			);
	}
	var removeRequest = function(id, anchorObj) {
		var communityId = '';
		if (groupView_community != null) {
			if (groupView_communityId != null) {
				communityId = groupView_communityId;
			}
		}
		Visualforce.remoting.Manager.invokeAction(
		   _RemotingGroupViewActions.removeRequest,
			id,
			communityId,
			function(result, event){
					if(event.status){
						j$(anchorObj).parent().parent().remove();
						if(j$('.groupModalList').is(':empty')) {
							j$('#ShowAllGroupModal').dialog('close');
						}
					} else {
						alert(event.message);
					}
			}, {escape:false,buffer:false}
		);
	}
	var deleteMember = function(id, anchorObj) {
		var communityId = '';
		if (groupView_community != null) {
			if (groupView_communityId != null) {
				communityId = groupView_communityId;
			}
		}
		Visualforce.remoting.Manager.invokeAction(
			   _RemotingGroupViewActions.deleteMember,
					id,
					communityId,
					groupView_GroupId,
					function(result, event){
							if(event.status){
								j$(anchorObj).closest('li').remove();
								j$('#Member' + result).remove();
								memberCount--;
								j$('.showAllMembers').text('Show All(' + memberCount + ')');

							}
					}, {escape:false,buffer:false}
			);
	}
	var changeManager = function(id, checkbox) {
		j$(checkbox).removeClass('active');
		j$(checkbox).next().next().addClass('active');
		var role;
		if(checkbox.checked) {
			role = 'manager';
		} else {
			role = 'member';
		}
		var communityId = '';
		if (groupView_community != null) {
			if (groupView_communityId != null) {
				communityId = groupView_communityId;
			}
		}
		Visualforce.remoting.Manager.invokeAction(
			   _RemotingGroupViewActions.changeRole,
					id,
					role,
					communityId,
					function(result, event){
							if(event.status){
								j$(checkbox).addClass('active');
								j$(checkbox).next().next().removeClass('active');
							}
					}, {escape:false,buffer:false}
			);
	}
	var getMemberHtml = function(member, canRemove) {
		if (canRemove) {
			html = '<li class="removable entry">';
		} else {
			html = '<li class="entry">';
		}
		html += '<div><a href="/apex/'+groupView_profileNamespace+'profileRedirect?id=';
		html += member.user.id;
		html += '" title="Go to the profile of ';
		html += member.user.name;
		html += '">';
		if (externalUsers.lastIndexOf(member.user.id) >= 0) {
			html += '<img src="/s.gif" alt="photo" class="externalUserFlag"/>';
		}
		html += '<img src="';
		html += member.user.photo.smallPhotoUrl;
		html += '" alt="Profile picture for ';
		html += member.user.name;
		html += '"/>';
		if (member.role != 'GroupOwner') {
			html += '<img class="collabLock" src="/s.gif" alt="Group owner indicator" title="This is the owner of the group"/>';
		}
		html += '</a><a href="/apex/'+groupView_profileNamespace+'profileRedirect?id=';
		html += member.user.id;
		html += '" title="Go to the profile of ';
		html += member.user.name;
		html += '">';
		html += member.user.name;
		html += '</a></div>';
		
		if (canRemove) {
			if (member.role != 'GroupOwner') {
				if (member.role != 'GroupManager' ||  groupView_ownerId == userId) {
					html += '<div><a href="#!" onclick="deleteMember(\'';
					html += member.id;
					html += '\', this);" title="Delete this member">Remove Member</a></div>';
				}
			}
		}
		html += '</li>';
		return html;
	}
	var getGroupMemberHtml = function(user) {
		html = '<div id="Member';
		html += user.id;
		html += '" class="memberPicture"><a href="/apex/'+groupView_profileNamespace+'profileRedirect?id=';
		html += user.id;
		html += '" title="Go to the profile of ';
		html += user.name;
		html += '">';
		//console.log(externalUsers);
		//console.log(user.id);
		if (externalUsers.lastIndexOf(user.id) >= 0) {
			html += '<img src="/s.gif" alt="photo" class="externalUserFlag"/>';
		}
		html+= '<img src="';
		html += user.photo.smallPhotoUrl;
		html += '" alt="Profile picture for ';
		html += user.name;
		html += '"/>';		
		if (groupView_ownerId1 == user.id) {
			html += '<img class="collabLock" src="/s.gif" alt="Group owner indicator" title="This is the group\'s owner"/>';
		}
		html += '</a></div>';
		return html;
	}
	var getUserHtml = function(user) {
		//console.log(user);
		html = '<li class="entry addable"><div><a href="/apex/'+groupView_profileNamespace+'profileRedirect?id=';
		html += user.Id;
		html += '" title="Go to the profile of ';
		html += user.Name;
		html += '">';
		if (externalUsers.lastIndexOf(user.Id) >= 0) {
			html += '<img src="/s.gif" alt="photo" class="externalUserFlag"/>';
		}
		html += '<img src="';
		html += user.SmallPhotoUrl;
		html += '" alt="Profile picture for ';
		html += user.Name;
		html += '"/></a><a href="/apex/'+groupView_profileNamespace+'profileRedirect?id=';
		html += user.Id;
		html += '" title="Go to the profile of ';
		html += user.Name;
		html += '">';
		html += user.Name;
		html += '</a></div><div><a href="#!" onClick="addMember(\'';
		html += user.Id;
		html += '\', this);" title="Add ';
		html += user.Name;
		html += ' to this group">Add Member</a></div></li>';
		return html;
	}
var getGroupExtensionPictures = function() {
	j$('.groupRightSidebar div.file > a').each(function() {
		var text = j$(this).data('extension');
		var position = getGroupExtensionPosition(text);
		j$(this).css('background-position', '0px ' + position + 'px');
	});
};
var getGroupModalExtensionPictures = function() {
	j$('#ShowAllProfileModal > ul.collabProfileModalList > li.file > a').each(function() {
		var text = j$(this).data('extension');
		var position = getGroupExtensionPosition(text);
		j$(this).css('background-position', '0px ' + position + 'px');
	});
};
var getGroupExtensionPosition = function(text) {
	switch (text.toLowerCase()) {
		case 'al':
			return '-26';
			break;
		case 'pdf':
			return '-416';
			break;
		case 'word':
		case 'word_x':
		case 'doc':
		case 'docx':
			return '-676';
			break;
		case 'mp3':
			return '-364';
			break;
		case 'zip':
			return '-728';
			break;
		case 'gif':
		case 'jpg':
		case 'png':
			return '-313';
			break;
		case 'text':
		case 'txt':
			return '-547';
			break;
		case 'xls':
			return '-131';
			break;
		case 'csv':
			return '-79';
			break;
		case 'eps':
			return '-105';
			break;
		case 'fla':
			return '-183';
			break;
		case 'html':
			return '-287';
			break;
		case 'ppt':
		case 'ppt_x':
			return '-443';
			break;
		case 'psd':
			return '-468';
			break;
		case 'rtf':
			return '-495';
			break;
		case 'xml':
			return '-703';
			break;
		case 'vis':
			return '-624';
			break;
		default:
			return '-572';
	}
}
var reload = function() {
	location.reload();   
}
var uploadPhoto = function(btnObject) {
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
			j$('[id$=ProfileHiddenFile]').val((new sforce.Base64Binary(e.target.result)).toString());
			j$('[id$=ProfileHiddenType]').val(this.file.type);
			j$('[id$=ProfileHiddenName]').val(this.file.name);
			j$( '#GroupLoadingModal').dialog('open');
			uploadNewPhoto();
		};
		reader.readAsBinaryString(f);
	}
}