var j$ = jQuery.noConflict();
var communitySearching = false;
var sliceLocation = 0;
var communityUserList;
var userFollowings = ' ';
j$(document).ready(function() {
	j$( '.loadingCollabCommunityUsers').addClass('active');
	j$(".collabCommunityUsers .searchCollabCommunityUsers").focus(function() {
		if(j$(this).val() == 'Quick Search Text') {
			j$(this).val('');
			j$(this).addClass('textFieldActive');
		}
	});
	j$(".collabCommunityUsers .searchCollabCommunityUsers").blur(function() {
		if(j$(this).val() == ""){
			j$(this).val('Quick Search Text');
			j$(this).removeClass('textFieldActive');
		}
	});
	j$(".collabCommunityUsers #CommunityUsersSearchButton").click(function() {
		if (j$('.collabCommunityUsers .searchCollabCommunityUsers').val() != '') {
			communitySearching = true;
			refreshCommunityUsers();
		}
		return false;
	});
	j$('.collabCommunityUsers .searchCollabCommunityUsers').on('keypress', function() {
		if(event.which == 13 && !event.shiftKey) {
			if (j$('.collabCommunityUsers .searchCollabCommunityUsers').val() != '') {
				communitySearching = true;
				refreshCommunityUsers();
			}
		}
		j$("form").submit(function() { return false; });
	});
	j$(".collabCommunityUsers #CommunityUsersSearchCancelButton").click(function(){
		j$('.searchCollabCommunityUsers').val('');
		if (communitySearching == true) {
			communitySearching = false;
			j$('.collabCommunityUsers .searchCollabCommunityUsers').val('Quick Search Text');
			j$('.collabCommunityUsers .searchCollabCommunityUsers').removeClass('textFieldActive');
			refreshCommunityUsers();
		}
		return false;
	});
	Visualforce.remoting.Manager.invokeAction(                
		_RemotingCollabCommunityUsersActions.following,
		function(result, event){
			if(event.status){
				if (result != '') {
					userFollowings = result;
					displayCommunityUserPage();
				}
			} else {
				alert('An error occured while getting the users that you are following, following status may not display correctly on this page');
			}
		}, 
		{escape:false,buffer:false}
	);
});
var displayCommunityUserPage = function() {
	var userText = ' ';
	if (j$('.searchCollabCommunityUsers').val() != '' && j$('.searchCollabCommunityUsers').val()) {
		userText = j$('.searchCollabCommunityUsers').val();
	}
	Visualforce.remoting.Manager.invokeAction(                
		_RemotingCollabCommunityUsersActions.getCommunityUsers,
		communitySearching,
		userText,
		function(result, event){
			if(event.status){
				communityUserList = result;
				if (result.length > 25) {
					result.slice(0,25).forEach(function(user) {
						var displayCommunityUser = getCommunityUserHtml(user);
						j$('.collabCommunityUsersWrapper').append(displayCommunityUser);
					});
					sliceLocation = 25;
					setCommunityUserWindowScroll();
				} else {
					result.forEach(function(user) {
					var displayCommunityUser = getCommunityUserHtml(user);
					j$('.collabCommunityUsersWrapper').append(displayCommunityUser);
					});
				}
				j$('.loadingCollabCommunityUsers').removeClass('active');
			} 
		}, 
		{escape:false,buffer:false}
	);
}

var displayNextCommunityUserPage = function() {
	j$(window).off('scroll');
	if (communityUserList.length > sliceLocation + 25) {
		communityUserList.slice(sliceLocation, sliceLocation + 25).forEach(function(user) {
			var displayCommunityUser = getCommunityUserHtml(user);
			j$('.collabCommunityUsersWrapper').append(displayCommunityUser);
		});
		setCommunityUserWindowScroll();
	} else {
		communityUserList.slice(sliceLocation,communityUserList.length).forEach(function(user) {
		var displayCommunityUser = getCommunityUserHtml(user);
		j$('.collabCommunityUsersWrapper').append(displayCommunityUser);
		});
	}
	sliceLocation += 25;
}

var getCommunityUserHtml = function(user) {
	//console.log(user);
	var html = '<div class="col-md-4 contentWrapper">';
	html += '<a class="relativePanel" href="/apex/ProfileRedirect?id=';
	html += user.Id;
	html += '" title="View the profile of ';
	html += DOMPurify.sanitize(user.FirstName) + ' ' + DOMPurify.sanitize(user.LastName);
	html += '"><img class="externalFlag" title="This is a community user" src="';
	//html += source;
	html += '/s.gif';
	html += '" alt="This is a community user"/>';
	html += '<img class="communityUsersImage img-circle" alt="Profile picture of ';
	html += DOMPurify.sanitize(user.FirstName) + ' ' + DOMPurify.sanitize(user.LastName);
	html += '" src="';
	html += user.FullPhotoUrl;
	html += '"/></a>';
	html += '<div class="communityUsersInfo">';
	html += '<p class="headerCls ng-binding communityUsersHeader">';
	if (user.FirstName != null) {
		html += DOMPurify.sanitize(user.FirstName);
		if (user.LastName != null) {
			html += ' ' + DOMPurify.sanitize(user.LastName);
		}
	}
	else if (user.LastName != null) {
		html += DOMPurify.sanitize(user.LastName);
	}
	html += '</p>';
	if (user.Title != null) {
		html += '<p>';
		html += DOMPurify.sanitize(user.Title);
		html += '</p>';
	}
	if (user.CompanyName != null) {
		html += '<p>';
		html += DOMPurify.sanitize(user.CompanyName);
		html += '</p>';
	}
	html += '<p><a href="mailto:';
	html += user.Email;
	html += '" title="Send an email to ';
	html += DOMPurify.sanitize(user.firstName) + ' ' + DOMPurify.sanitize(user.lastName);
	html += '">';
	html += user.Email;
	html += '</a></p>';
	html += '</div>';
	if (userFollowings[user.Id] != null) {
		html += '<a href="#" class="collabCommunityUsersButton following" title="UnFollow this person" data-user_id="';
		html += user.Id;
		html += '" onclick="unFollowCommunityUser(\'';
		html += userFollowings[user.Id];
		html += '\', this);"/>';
	} else {
		html += '<a href="#" class="collabCommunityUsersButton" title="Follow this person" data-user_id="';
		html += user.Id;
		html += '" onclick="followCommunityUser(\'';
		html += user.Id;
		html += '\', this);"/>';
	}
	html += '</div>';
	return html;
}

var unFollowCommunityUser = function(subId, anchorObj) {
	Visualforce.remoting.Manager.invokeAction(
		_RemotingCollabCommunityUsersActions.unFollow,
		'community',
		subId,
		function(result, event){
			if(event.status){
				//console.log(result);
				j$(anchorObj).removeClass('following');
				j$(anchorObj).attr('onclick','followCommunityUser(\'' + j$(anchorObj).data('user_id') + '\', this);');
				j$(anchorObj).attr('title', 'Follow this user');
			} else {
				alert(event.message);
			} 
		},
		{escape:false,buffer:false}
	);
	return false;
}

var followCommunityUser = function(userId, anchorObj) {
	Visualforce.remoting.Manager.invokeAction(
		_RemotingCollabCommunityUsersActions.follow,
		'community',
		userId,
		function(result, event){
			if(event.status){
				//console.log(result);
				j$(anchorObj).addClass('following');
				j$(anchorObj).attr('onclick','unFollowCommunityUser(\'' + result + '\', this);');
				j$(anchorObj).attr('title', 'Stop following this user');
			} else {
				alert(event.message);
			} 
		},
		{escape:false,buffer:false}
	);
	return false;
}
var refreshCommunityUsers = function() {
	j$( '.loadingCollabCommunityUsers').addClass('active');
	sliceLocation = 0;
	j$('.collabCommunityUsersWrapper').empty();
	displayCommunityUserPage();
}
var setCommunityUserWindowScroll = function() {
	if(communityUserList != null) {
		if(communityUserList.length > spliceLocation) {
			j$(window).on('scroll', function() {
				if(j$(window).scrollTop() + j$(window).height() >= j$(document).height()/1.1 ) {
					j$(window).off('scroll');
					j$( '.loadingCollabCommunityUsers').addClass('active');
					displayNextCommunityUserPage();
				}
			});
		}
	}
} 