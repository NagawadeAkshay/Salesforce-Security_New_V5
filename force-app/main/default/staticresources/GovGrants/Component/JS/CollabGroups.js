 var j$ = jQuery.noConflict();
 var nextGroupPageToken = 0;
 var groupSearching = false;
 var groupCommunity;
 var inCommunity;
 var sliceLocation = 0;
 var declinedRequests = '';
 var pendingRequests = '';
 var myGroups = '';
 //var externalUsers = '';
 j$(document).ready(function() {
	if (collabGroups_ContactId) {
		inCommunity = true;
	} else {
		inCommunity = false;
	}
	if (collabGroups_community) {
		groupCommunity = collabGroups_community;
	} else {
		groupCommunity = null;
	}
	if(collabGroups_pendingRequests) {
		pendingRequests = collabGroups_pendingRequests;
	}
	if(collabGroups_declinedRequests) {
		declinedRequests = collabGroups_declinedRequests;
	}
	if(collabGroups_myGroups) {
		myGroups = collabGroups_myGroups;
	}
	/*
	if('{!externalUsers}') {
		externalUsers = '{!externalUsers}';
	}*/
	j$( '.loadingCollabGroups').addClass('active');
	generateIDType();
	displayGroupPage();
	j$(".collabGroups .searchCollabGroups").focus(function(){
		if(j$(this).val() == 'Quick Search Text') {
			j$(this).val('');
			j$(this).addClass('textFieldActive');
		}
	});
	j$(".collabGroups .searchCollabGroups").blur(function(){
		if(j$(this).val() == ""){
			j$(this).val('Quick Search Text');
			j$(this).removeClass('textFieldActive');
		}
	});
	j$(".collabGroups #GroupsSearchButton").click(function(){
		if (j$('.collabGroups .searchCollabGroups').val() != '') {
			groupSearching = true;
			refreshGroups();
		}
		return false;
	});
	j$('.collabGroups .searchCollabGroups').on('keypress', function() {
		if(event.which == 13 && !event.shiftKey)
		{
			if (j$('.collabGroups .searchCollabGroups').val() != '') {
				groupSearching = true;
				refreshGroups();
			}
		}
		j$("form").submit(function() { return false; });
	});
	j$(".collabGroups #GroupsSearchCancelButton").click(function(){
		j$('.searchCollabGroups').val('');
		if (groupSearching == true) {
			groupSearching = false;
			j$('.collabGroups .searchCollabGroups').val('Quick Search Text');
			j$('.collabGroups .searchCollabGroups').removeClass('textFieldActive');
			refreshGroups();
		}
		return false;
	});
	j$( '.groupVisible > input[name=visible]').on('change', function() {
		if(j$(this).val() == 'private') {
			j$(this).parent().next().find('input').removeAttr('disabled');
		} else {
			j$(this).parent().next().next().find('input').attr('disabled','disabled');
			j$(this).parent().next().next().find('input').removeAttr('checked');
		}
		return false;
	});
	j$(".collabGroups .newCollabGroup").click(function() {
		j$('#NewGroupName').val('');
		j$('#NewGroupDescription').val('');
		j$( '#CollabNewGroupModal').dialog('open');
		return false;
	});
	j$( '.collabModal' ).dialog({show: true, hide: true, modal: true, autoOpen: false, resizable: false});
	j$( '#CollabNewGroupModal').dialog({width: 750 });
	j$( '.collabModal > a' ).off('click');
	j$( '.collabModal > a' ).on('click',function() {
		j$( '.collabModal' ).dialog('close');  
		return false;  
	});
	j$( '.saveGroup').click( function() {
		Visualforce.remoting.Manager.invokeAction(                
			_RemotingCollabGroupsActions.createGroup,
			collabGroups_isExternal,
			groupCommunity,
			j$( '.groupAllow > input:checked').length > 0,
			j$( '.groupNameInput > input').val(),
			j$( '.groupDescriptionInput > textarea').val(),
			j$( '.groupArchiveInput > input[name=archive]:checked').val() == 'noArchive',
			j$( '.groupVisible > input[name=visible]:checked').val(),
				function(result, event){
					if(event.status){
						j$('#CollabNewGroupModal').dialog('close');
						j$('.collabGroupsWrapper').prepend(getNewGroupHtml(result));
					} else {
						alert(event.message);
					}
				},
			{escape:false,buffer:false}
		);
		return false;
	});
	j$('.groupsTableBackground').show();
	j$('.collabModal').addClass('active');
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
 
 var displayGroupPage = function() {
	var groupText = ' ';
	if (j$('.searchCollabGroups').val() != '' && j$('.searchCollabGroups').val()) {
		groupText = j$('.searchCollabGroups').val();
	}
	j$( '.loadingCollabGroups').addClass('active');
	Visualforce.remoting.Manager.invokeAction(                
		_RemotingCollabGroupsActions.getGroups,
		inCommunity, 
		collabGroups_AccountId, 
		groupText,
		groupSearching,
		//externalUsers,
		function(result, event){
			if(event.status){
				groups = result;
				var displayGroup;
				result.slice(sliceLocation, sliceLocation + 25).forEach(function(group) {
					displayGroup = getGroupHtml(group);
					j$('.collabGroupsWrapper').append(displayGroup);
				});
				j$('.loadingCollabGroups').removeClass('active');
				if (groups.length > sliceLocation + 25) {
					setGroupWindowScroll();
				}
				sliceLocation += 25;
			} 
		}, 
		{escape:false,buffer:false}
	);

 }
 var getGroupHtml = function(group) {
	var html;
	html = '<div class="col-md-4 contentWrapper">';
	html += '<img class="groupImage img-circle" alt="Photo of ';
	html += DOMPurify.sanitize(group.Name);
	html += '" src="';
	html += group.FullPhotoUrl;
	html += '"/>';
	html += '<div class="groupsInfo">';
	html += '<p class="headerCls ng-binding groupHeader">';
	html += '<a href="/apex/{!collabNamespace}groupView?id=';
	html += group.Id;
	html += '" class="imageAnchor" title="View the page of ';
	html += DOMPurify.sanitize(group.Name);
	html += '">';
	html += DOMPurify.sanitize(group.Name);
	html += '</a></p><p class="groupOwnerMem">';
	if (group.Owner != null) {
		html += '<span>Owner: <a href="/apex/profileRedirect?id='; // <a href="/apex/{!collabNamespace}profileRedirect?id=';
		html += group.OwnerId;
		html += '" title="View profile page of ';
		html += DOMPurify.sanitize(group.Owner.Name);
		html += '">';
		html += DOMPurify.sanitize(group.Owner.Name);
		html += '</a></span>';
	}
	html += '<span>Members: ';
	html += group.MemberCount;
	html += '</span></p>';
	html += '</div>';
	if (myGroups.lastIndexOf(group.Id) > -1) {
		html += '<a href="#" class="collabGroupsButton member" title="Leave this group" onclick="leaveGroup(\'';
		html += group.Id;
		html += '\', this);"';
		if (group.CollaborationType == 'Public') {
			html += 'data-access="public"';
		} else {
			html += 'data-access="private"';
		}   
		html += '/></a>';
	} else if (pendingRequests.lastIndexOf(group.Id) > -1) {
		html += '<a href="#" class="collabGroupsButton requested" title="You have requested to join this group" onclick="';
		html += '" data-access="private"/></a>';
	} else if (group.CollaborationType == 'Public' || {!profile.capabilities.isModerator}) {
		html += '<a href="#" class="collabGroupsButton" title="Join this group" onclick="joinGroup(\'';
		html += group.Id;
		html += '\', this);" data-access="public"/></a>';
	} else if (declinedRequests.lastIndexOf(group.Id) > -1) {
		html += '<a href="#" class="collabGroupsButton declined" title="Your request to join this group has been declined" onclick="';
		html += '" data-access="private"/></a>';
	} else {
		html += '<a href=#" class="collabGroupsButton" title="Request to join this group" onclick="requestMembership(\'';
		html += group.Id;
		html += '\', this);" data-access="private"/></a>';
	}
	if ({!userPref.IsInternal__c} && group.NetworkId) {
		//var source = "";
		html += '<img class="externalFlag" src="';
		//html += source;
		html += '/s.gif';
		html += '" alt="This is an external group" title="This group allows community users"/>';
	}
	if (group.CollaborationType == 'Private') {
		html += '<img class="collabLock" src="/s.gif" alt="Private Group Indicator" title="This is a private group"/>';
	}
	html += '</a>';
	html += '</div>';
	return html;
 }
 var getNewGroupHtml = function(group) {
	var html;
	html = '<div class="col-md-12 contentWrapper">';
	html += '<img class="groupImage img-circle" alt="Photo of ';
	html += DOMPurify.sanitize(Name);
	html += '" src="';
	html += group.FullPhotoUrl;
	html += '"/>';
	html += '<p class="headerCls ng-binding groupHeader">';
	html += DOMPurify.sanitize(group.Name);
	html += '</p>';
	html += '<a href="#" class="collabGroupsButton member" title="Leave this group" onclick="leaveGroup(\'';
	html += group.Id;
	html += '\', this);"';
	if (group.CollaborationType == 'Public') {
		html += 'data-access="public"';
	} else {
		html += 'data-access="private"';
	}
	html += '/></a>';
	html += '<a href="/apex/groupView?id=';
	html += group.Id;
	html += '" class="imageAnchor" title="View the page of ';
	html += DOMPurify.sanitize(group.Name);
	html += '">';
	//console.log(group.CanHaveGuests);
	if (group.CanHaveGuests && collabGroups_IsInternal) {
		//var source = "";
		html += '<img class="externalFlag" alt="Orange Triangle" title="This group allows community users" src="';
		//html += source;
		html += '/s.gif';
		html += '"/>';
	}
	html += '</a><div class="groupsInfo">';
	html += '<div><span>Owner:&nbsp;&nbsp;</span><a href="/apex/profileRedirect?id=';
	html += group.OwnerId;
	html += '" title="View your profile page">';
	html += collabGroups_Name;
	html += '</a></div>';
	html += '<div>Members: ';
	html += group.MemberCount;
	html += '</div>';
	html += '</div></div>';
	return html;
 }
 var refreshGroups = function() {
	j$( '.loadingCollabGroups').addClass('active');
	sliceLocation = 0;
	j$('.collabGroupsWrapper').empty();
	displayGroupPage();
 }
 var setGroupWindowScroll = function () {
	if (nextGroupPageToken != 9999) {
		j$(window).on('scroll', function() {
			if(j$(window).scrollTop() + j$(window).height() >= j$(document).height()/1.1 ) {
				j$(window).off('scroll');
				j$( '.loadingCollabGroups').addClass('active');
				displayGroupPage();
			}
		});
	}
}
 
var joinGroup = function(id, anchorObj) {
	 Visualforce.remoting.Manager.invokeAction(                
		_RemotingCollabGroupsActions.joinGroup,
		collabGroups_UserId,
		id,
			function(result, event){
				if(event.status){
					j$(anchorObj).addClass('member');
					j$(anchorObj).attr('onclick','leaveGroup(\'' + id + '\', this)');
					j$(anchorObj).attr('title', 'Leave this group');
				} else {
					alert(event.message);
				}     
			}, 
		{escape:false,buffer:false}
	);
	return false;
};
var leaveGroup = function(id, anchorObj) {
	Visualforce.remoting.Manager.invokeAction(                
		_RemotingCollabGroupsActions.deleteGroupMember,
			groupCommunity,
			id,
			id,
			function(result, event){
				if(event.status){
					j$(anchorObj).removeClass('member');
					if (j$(anchorObj).data('access') == 'public') {
						j$(anchorObj).attr('onclick', 'joinGroup(\'' + id + '\', this)');
						j$(anchorObj).attr('title', 'Join this group');
					} else {
						j$(anchorObj).attr('onclick', 'requestMembership(\'' + id + '\', this)');
						j$(anchorObj).attr('title', 'Ask to join this group');
					}
				} else {
					alert(event.message);
				} 
			 }, 
		 {escape:false,buffer:false}
	);
	return false;
};
var requestMembership = function(id, anchorObj) {
	Visualforce.remoting.Manager.invokeAction(
		_RemotingCollabGroupsActions.requestGroupMembership,
		groupCommunity,
		id,
		function(result, event){
			if(event.status) {
				j$(anchorObj).addClass('requested');
				j$(anchorObj).attr('title', 'You have requested to join this group');
			} else {
				alert(event.message);
			} 
		},
		{escape:false,buffer:false}
	);
	return false;
};