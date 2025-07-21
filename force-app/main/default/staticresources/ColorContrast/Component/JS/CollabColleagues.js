var j$ = jQuery.noConflict();
 var nextUserPageToken = 0;
 var userSearching = false;
 var sliceLocation = 0;
 var colleagues = [];
 var colleagueFollowings;
 var inCommunity;
 var colleagueCommunity;
 j$(document).ready(function() {
	if (collabColleagues_ContactId) {
		inCommunity = true;
	} else {
		inCommunity = false;
	}
	if (collabColleagues_community) {
		colleagueCommunity = collabColleagues_community;
	} else {
		colleagueCommunity = null;
	}

	Visualforce.remoting.Manager.invokeAction(      
	   _RemotingCollabColleaguesActions.following,
		function(result, event){
			if(event.status){
				colleagueFollowings = result;
				displayColleaguePage();
			}
		}, 
		{escape:false,buffer:false}
	);
	j$(".collabColleagues .searchCollabColleagues").focus(function(){
		if(j$(this).val() == 'Quick Search Text') {
			j$(this).val('');
			j$(this).addClass('textFieldActive');
		}
	});
	j$(".collabColleagues .searchCollabColleagues").blur(function(){
		if(j$(this).val() == ""){
			j$(this).val('Quick Search Text');
			j$(this).removeClass('textFieldActive');
		}
	});
	j$(".collabColleagues #ColleaguesSearchButton").click(function(){
		if (j$('.collabColleagues .searchCollabColleagues').val() != '') {
			userSearching = true;
			refreshColleagues();
		}
		return false;
	});
	j$('.collabColleagues .searchCollabColleagues').on('keypress', function() {
		if(event.which == 13 && !event.shiftKey)
		{
			if (j$('.collabColleagues .searchCollabColleagues').val() != '') {
				userSearching = true;
				refreshColleagues();
			}
		}
		j$("form").submit(function() { return false; });
	});
	j$(".collabColleagues #ColleaguesSearchCancelButton").click(function(){
		j$('.searchCollabColleagues').val('');
		if (userSearching == true) {
			userSearching = false;
			j$('.collabColleagues .searchCollabColleagues').val('Quick Search Text');
			j$('.collabColleagues .searchCollabColleagues').removeClass('textFieldActive');
			refreshColleagues();
		}
		return false;
	});
	/*
	var windowHeight = $(window).innerHeight();
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
 
var displayColleaguePage = function() {
	var userText = '';
	if (j$('.searchCollabColleagues').val() != '' && j$('.searchCollabColleagues').val()) {
		userText = j$('.searchCollabColleagues').val();
	}
	j$( '.loadingCollabColleagues').addClass('active');
	Visualforce.remoting.Manager.invokeAction(                
		_RemotingCollabColleaguesActions.getColleagues,
		inCommunity, 
		collabColleagues_AccountId, 
		userText,
		userSearching,
		function(result, event){
			if(event.status){
				colleagues = result;
				var displayColleague
				//console.log(result);
				result.slice(sliceLocation, sliceLocation + 25).forEach(function(user) {
					displayColleague = getUserHtml(user);
					j$('.collabColleaguesWrapper').append(displayColleague);
				});
				j$('.loadingCollabColleagues').removeClass('active');
				if (colleagues.length > sliceLocation + 25) {
					setUserWindowScroll();
				}
				sliceLocation += 25;
			} 
		}, 
		{escape:false,buffer:false}
	);
 }
 
 var getUserHtml = function(user) {
	var html = '<div class="col-md-4 contentWrapper">';
	html += '<a href="/apex/profileRedirect?id='; //'<a href="/apex/{!collabNamespace}profileRedirect?id=';
	html += user.Id;
	html += '" title="View the profile page of ';
	html += user.Name;
	html += '">';
	html += '<img class="colleaguesImage img-circle" alt="Profile picture of ';
	html += user.Name;
	html += '" src="';
	html += user.FullPhotoUrl;
	html += '"/>';
	html += '</a>';
	html += '<div class="colleaguesInfo">';
	html += '<p class="headerCls ng-binding colleaguesHeader">';
	html += user.Name;
	html += '</p>';
	if (user.Title != null) {
		html += '<p>';
		html += user.Title;
		html += '</p>';
	} 
	if (user.CompanyName != null) {
		html += '<p>';
		html += user.CompanyName;
		html += '</p>';
	} 
	html += '<p><a href="mailto:';
	html += user.Email;
	html += '" title="Send an email to ';
	html += user.Name;
	html += '">';
	html += user.Email;
	html += '</a></p>';
	html += '</div>';
	if (user.Id in colleagueFollowings) {
		html += '<a href="#" class="collabColleaguesButton following" title="UnFollow this person" data-user_id="';
		html += user.Id;
		html += '" onclick="unFollowUser(\'';
		html += colleagueFollowings[user.Id];
		html += '\', this);"/>';
	} 
	else {
		html += '<a href="#" class="collabColleaguesButton" title="Follow this person" data-user_id="';
		html += user.Id;
		html += '" onclick="followUser(\'';
		html += user.Id;
		html += '\', this);"/>';
	}
	html += '</div>';
	return html;
 }
 
 var unFollowUser = function(subId, anchorObj) {
	Visualforce.remoting.Manager.invokeAction(
		_RemotingCollabColleaguesActions.unFollow,
		colleagueCommunity,
		subId,
		function(result, event){
				if(event.status){
					j$(anchorObj).removeClass('following');
					j$(anchorObj).attr('onclick','followUser(\'' + j$(anchorObj).data('user_id') + '\', this);');
					j$(anchorObj).attr('title', 'Follow this user');
				} else {
					alert(event.message);
				} 
			},
		{escape:false,buffer:false}
	);
	return false;
 }
 
 var followUser = function(userId, anchorObj) {
	Visualforce.remoting.Manager.invokeAction(
		_RemotingCollabColleaguesActions.follow,
		colleagueCommunity,
		userId,
		function(result, event){
				if(event.status){
					j$(anchorObj).addClass('following');
					j$(anchorObj).attr('onclick','unFollowUser(\'' + result + '\', this);');
					j$(anchorObj).attr('title', 'Unfollow this user');
				} else {
					alert(event.message);
				} 
			},
		{escape:false,buffer:false}
	);
	return false;
 }
 var refreshColleagues = function() {
	j$( '.loadingCollabColleagues').addClass('active');
	nextUserPageToken = 0;
	sliceLocation = 0;
	j$('.collabColleaguesWrapper').empty();
	displayColleaguePage();
 }
 var setUserWindowScroll = function () {
	if (nextUserPageToken != null) {
		j$(window).on('scroll', function() {
			if(j$(window).scrollTop() + j$(window).height() >= j$(document).height()/1.1 ) {
				j$(window).off('scroll');
				j$( '.loadingCollabColleagues').addClass('active');
				displayColleaguePage();
			}
		});
	}
}