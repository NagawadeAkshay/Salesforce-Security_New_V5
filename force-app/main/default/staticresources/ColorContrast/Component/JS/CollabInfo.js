var followingList = new Array();
var followerList = new Array();
var profileFileList = new Array();
var profileGroupList = new Array();
var nextProfileToken = 0;
var prevProfileToken = null;
var profileSpliceLocation = 0;
var community;
var j$ = jQuery.noConflict();

j$(document).ready(function(){
	community = collabInfo_communityId;
	if (community == '') {
		community = null;
	}
	j$( '.collabModal' ).dialog({show: true, hide: true, modal: true, autoOpen: false, resizable: false});
	j$( '#VerifyModal').dialog({width: 300 });
	j$( '#ShowUserFiles').dialog({width: 1038 });
	j$( '#UserSettingsModal').dialog({width: 520 });
	j$( '#ShowAllProfileModal').dialog({width: 400 });
	
	j$('body').click(function(e) {
		if(!(j$(e.target).hasClass('viewPreferences'))) {
			j$('.viewOptions').removeClass('active');   
		}
	});
	Visualforce.remoting.Manager.invokeAction(
		   _RemotingCollabInfoActions.getMyFiles,
				collabInfo_thisUserId,
				function(result,event){
					if(event.status) {
						if (result != null) {
							profileFileList = result;
							var html;
							if (profileFileList.length > 0 ) {
								html = '<div>Files Owned<a href="#" onClick="showAllFiles();">Show All(';
								html += profileFileList.length;
								html += ')</a></div>';
								j$('.filesOwned').append(html);
							}
							profileFileList.slice(0,7).forEach( function(file) {
								html = getProfileFileHtml(file);
								j$('.filesOwned > div:first-child').after(html);
							});
						} else {
							j$('.filesOwned > div:first-child').after('<div>No Files</div>');
						}
						getExtensionPictures();
					}
			},
			{escape:false,buffer:false}
	);
	Visualforce.remoting.Manager.invokeAction(
		   _RemotingCollabInfoActions.getMyGroups,
				collabInfo_thisUserId,
				function(result,event){
					if(event.status) {
						if (result != null) {
							profileGroupList = result;
							var html;
							if (profileGroupList.length > 0 ) {
								html = '<div>Groups<a href="#" onClick="showAllGroups();">Show All(';
								html += profileGroupList.length;
								html += ')</a></div>';
								j$('.profileGroups').append(html);
							}
							result.slice(0,7).forEach( function(group) {
								html = getProfileGroupHtml(group);
								j$('.profileGroups > div:first-child').after(html);
							});
						} else {
							//console.log('null');
							j$('.profileGroups > div:first-child').after('<div>No Groups</div>');
						}
					} else {
						alert(event.message)
					}
				},
				{escape:false,buffer:false}
	);
	Visualforce.remoting.Manager.invokeAction(
		   _RemotingCollabInfoActions.getFollowers,
				comID,
				collabInfo_thisUserId,
				0,
				function(result,event){
					if(event.status) {
						if (result != null) {
							followerList = result.followers;
							var html;
							if (result.total > 0 ) {
								html = '<div>Followers<a href="#" onClick="showAllFollowers();">Show All(';
								html += result.total;
								html += ')</a></div>';
								j$('.followers').append(html);
							}
							if (followerList != null && typeof followerList != 'undefined' && followerList.length > 0) {
								followerList.forEach( function(follower) {
									html = '<div><a href="/apex/profileRedirect?id=';
									html += follower.subscriber.id;
									html += '"><img src="';
									html += follower.subscriber.photo.smallPhotoUrl;
									html += '" alt="Picture of ';
									html += follower.subscriber.name;
									html += '"/></a></div>';
									j$('.followers > div:first-child').after(html);
								});
							} else {
								j$('.followers > div:first-child').after('<div>No followers</div>');
							}
						} else {
							j$('.followers > div:first-child').after('<div>No followers</div>');
						}
					}
		},
		{escape:false,buffer:false}
	);
	Visualforce.remoting.Manager.invokeAction(
		   _RemotingCollabInfoActions.getUserFollowings,
				comID,
				collabInfo_thisUserId,
				0,
				'none',
				function(result,event){
					if(event.status) {
						if (result != null) {
							followingList = result.following;
							var html;
							if (result.total > 0 ) {
								html = '<div>Following<a href="#" onClick="showAllFollowings();">Show All(';
								html += result.total;
								html += ')</a></div>';
								j$('.following').append(html);
							}
							if (followingList != null && typeof followingList != 'undefined' && followingList.length > 0) {
								followingList.forEach( function(following) {
									if (following.subject.type == 'User') {
										html = '<div class="profile"><a href="/apex/profileRedirect?id=';
										html += following.subject.id;
										html += '"><img src="';
										html += following.subject.photo.smallPhotoUrl;
										html += '"/>';
										html += '</a></div>';
										j$('.following > div:first-child').after(html);
									} else if (following.subject.type == 'Group') {
										html = '<div class="group"><a href="/apex/'+collabInfo_profileNamespace+'groupView?id="';
										html += following.subject.id;
										html += '"><img src="';
										html += following.subject.photo.smallPhotoUrl;
										html += '"/>';
										html += '</a></div>';
										j$('.following > div:first-child').after(html);
									} else if (following.subject.type == 'Record') {
										html = '<div><a>';
										html += '</a></div>';
										j$('.following').append(html);
									} else if (following.subject.type == 'File') {
										html = '<div class="file"><a href="';
										html += following.subject.downloadUrl;
										html += '" data-extension="';
										html += following.subject.fileExtension;
										html += '">';
										html += following.subject.name;
										html += '</a></div>';
										j$('.following').append(html);
									}
								});
								getFollowingExtensionPictures();
							} else {
								j$('.following > div:first-child').after('<div>No followings</div>');
							}
						} else {
							j$('.following > div:first-child').after('<div>No followings</div>');
						}
					}
		},
		{escape:false,buffer:false}
	);
});
var showAllFollowers = function() {
j$('#ShowAllProfileModal .filterTypeWrapper').removeClass('active');
nextProfileToken = 0;
j$('.profileModalHeader').text('Followers');
showNextProfileFollowerPage();
j$('#ShowAllProfileModal').dialog('open');
return false;
}
var showAllFollowings = function() {
j$('#ShowAllProfileModal .filterTypeWrapper').addClass('active');
j$('.profileModalHeader').text('Following');
nextProfileToken = 0;
showNextProfileFollowingPage();
j$('#ShowAllProfileModal').dialog('open');
return false;
}
var showAllGroups = function() {
j$('#ShowAllProfileModal .filterTypeWrapper').removeClass('active');
j$('.profileModalHeader').text('Groups');
profileSpliceLocation = 0; 
showNextProfileGroupPage();
j$('#ShowAllProfileModal').dialog('open');
return false;
}
var showAllFiles = function() {
j$('#ShowAllProfileModal .filterTypeWrapper').removeClass('active');
j$('#ShowUserFiles').dialog('open');
return false;
}
var showNextProfileFollowingPage = function() {
Visualforce.remoting.Manager.invokeAction(
		   _RemotingCollabInfoActions.getUserFollowings,
				community,
				collabInfo_thisUserId,
				nextProfileToken,
				j$('#ShowAllProfileModal .filterType').val(),
				function(result,event){
					if(event.status) {
							j$('.collabProfileModalList').empty();
							result.following.forEach( function(following) {
								html = getProfileModalHtml(following.subject);
								if (following.subject.type == 'User' || following.subject.type == 'Group') {
									j$('.collabProfileModalList').prepend(html);
								} else {
									j$('.collabProfileModalList').append(html);
								}
							});
							getFollowingModalExtensionPictures();
							if (result.previousPageUrl != null) {
								j$('.collabProfileModalList').append('<li class="prevProfileModalPage"><a onClick="showPrevProfileFollowingPage();">Prev</a></li>');
								if (prevProfileToken != null) {
									prevProfileToken++;
								} else {
									prevProfileToken = 0;
								}
							} else {
								j$('.collabProfileModalList').append('<li class="prevProfileModalPage"><span>Prev</span></li>');
								prevProfileToken = null;
							}
							if (result.nextPageUrl != null) {
								j$('.collabProfileModalList').append('<li class="nextProfileModalPage"><a onClick="showNextProfileFollowingPage();">Next</a></li>');
								if (nextProfileToken != null) {
									nextProfileToken++;
								} else {
									nextProfileToken = 0;
								}
							} else {
								j$('.collabProfileModalList').append('<li class="nextProfileModalPage"><span>Next</span></li>');
								nextProfileToken = null;
							}
							bindProfileEvents();
						}
				   },
			   {escape:false,buffer:false}
		);
	return false;
}

var showPrevProfileFollowingPage = function() {
Visualforce.remoting.Manager.invokeAction(
		   _RemotingCollabInfoActions.getUserFollowings,
				community,
				collabInfo_thisUserId,
				prevProfileToken,
				j$('#ShowAllProfileModal .filterType').val(),
				function(result,event){
					if(event.status) {
							j$('.collabProfileModalList').empty();
							result.following.forEach( function(following) {
									html = getProfileModalHtml(following.subject);
									if (following.subject.type == 'User' || following.subject.type == 'Group') {
										j$('.collabProfileModalList').prepend(html);
									} else {
										j$('.collabProfileModalList').append(html);
									}
							});
							getFollowingModalExtensionPictures();
							if (result.previousPageUrl != null) {
								j$('.collabProfileModalList').append('<li class="prevProfileModalPage"><a onClick="showPrevProfileFollowingPage();">Prev</a></li>');
								if (prevProfileToken != null) {
									prevProfileToken--;
								} else {
									prevProfileToken = 0;
								}
							} else {
								j$('.collabProfileModalList').append('<li class="prevProfileModalPage"><span>Prev</span></li>');
								prevProfileToken = null;
							}
							if (result.nextPageUrl != null) {
								j$('.collabProfileModalList').append('<li class="nextProfileModalPage""><a onClick="showNextProfileFollowingPage();">Next</a></li>');
								if (nextProfileToken != null) {
									nextProfileToken--;
								} else {
									nextProfileToken = 0;
								}
							} else {
								j$('.collabProfileModalList').append('<li class="nextProfileModalPage""><span>Next</span></li>');
								nextProfileToken = null;
							}
							bindProfileEvents();
						}
				   },
			   {escape:false,buffer:false}
		);
return false;
}
var showNextProfileFollowerPage = function() {
Visualforce.remoting.Manager.invokeAction(
		   _RemotingCollabInfoActions.getFollowers,
				community,
				collabInfo_thisUserId,
				nextProfileToken,
				function(result,event){
					if(event.status) {
							j$('.collabProfileModalList').empty();
							result.followers.forEach( function(member) {
								var html = getProfileModalHtml(member.subscriber);
								j$('.collabProfileModalList').append(html);
							});
							if (result.previousPageUrl != null) {
								j$('.collabProfileModalList').append('<li class="prevProfileModalPage"><a onClick="showPrevProfileFollowerPage();">Prev</a></li>');
								if (prevProfileToken != null) {
									prevProfileToken++;
								} else {
									prevProfileToken = 0;
								}
							} else {
								j$('.collabProfileModalList').append('<li class="prevProfileModalPage"><span>Prev</span></li>');
								prevProfileToken = null;
							}
							if (result.nextPageUrl != null) {
								j$('.collabProfileModalList').append('<li class="nextProfileModalPage""><a onClick="showNextProfileFollowerPage();>Next</a></li>');
								if (nextProfileToken != null) {
									nextProfileToken++;
								} else {
									nextProfileToken = 0;
								}
							} else {
								j$('.collabProfileModalList').append('<li class="nextProfileModalPage""><span>Next</span></li>');
								nextProfileToken = null;
							}
							bindProfileEvents();
						}
				   },
			   {escape:false,buffer:false}
		);
return false;
}

var showPrevProfileFollowerPage = function() {
Visualforce.remoting.Manager.invokeAction(
		   _RemotingCollabInfoActions.getFollowers,
				community,
				collabInfo_thisUserId,
				prevProfileToken,
				function(result,event){
					if(event.status) {
							j$('.collabProfileModalList').empty();
							result.followers.forEach( function(member) {
								var html = getProfileModalHtml(member.subscriber);
								j$('.collabProfileModalList').append(html);
							});
							if (result.previousPageUrl != null) {
								j$('.collabProfileModalList').append('<li class="prevProfileModalPage" onClick="showPrevProfileFollowerPage();"><a>Prev</a></li>');
								if (prevProfileToken != null) {
									prevProfileToken--;
								} else {
									prevProfileToken = 0;
								}
							} else {
								j$('.collabProfileModalList').append('<li class="prevProfileModalPage"><span>Prev</span></li>');
								prevProfileToken = null;
							}
							if (result.nextPageUrl != null) {
								j$('.collabProfileModalList').append('<li class="nextProfileModalPage" onClick="showNextProfileFollowerPage();"><a>Next</a></li>');
								if (nextProfileToken != null) {
									nextProfileToken--;
								} else {
									nextProfileToken = 0;
								}
							} else {
								j$('.collabProfileModalList').append('<li class="nextProfileModalPage"><span>Next</span></li>');
								nextProfileToken = null;
							}
							bindProfileEvents();
						}
				   },
			   {escape:false,buffer:false}
		);
return false;
}

var showNextProfileGroupPage = function() {
	j$('.collabProfileModalList').empty();
	if (profileSpliceLocation + 7 < profileGroupList.length) {
		profileGroupList.slice(profileSpliceLocation, profileSpliceLocation + 7).forEach( function(group) {
			var html = getProfileModalGroupHtml(group);
			j$('.collabProfileModalList').append(html);
		});
		if (profileSpliceLocation != 0) {
			j$('.collabProfileModalList').append('<li class="prevProfileModalPage"><a href="#" onClick="showPrevProfileGroupPage();">Prev</a></li>');
		} else {
			j$('.collabProfileModalList').append('<li class="prevProfileModalPage"><span>Prev</span></li>');
		}
		j$('.collabProfileModalList').append('<li class="nextProfileModalPage"><a href="#" onClick="showNextProfileGroupPage();">Next</a></li>');
	} else {
		profileGroupList.slice(profileSpliceLocation, profileGroupList.length).forEach( function(group) {
			var html = getProfileModalGroupHtml(group);
			j$('.collabProfileModalList').append(html);
		});
		if (profileSpliceLocation != 0) {
			j$('.collabProfileModalList').append('<li class="prevProfileModalPage"><a href="#" onClick="showPrevProfileGroupPage();">Prev</a></li>');
		} else {
			j$('.collabProfileModalList').append('<li class="prevProfileModalPage"><span>Prev</span></li>');
		}
		j$('.collabProfileModalList').append('<li class="nextProfileModalPage"><span>Next</span></li>');
	}
	profileSpliceLocation += 7;
	bindProfileEvents();
return false;
}
var showPrevProfileGroupPage = function() {
	j$('.collabProfileModalList').empty();
	alert(profileSpliceLocation);
	if (profileSpliceLocation - 14 > 0) {
		profileGroupList.slice(profileSpliceLocation - 14, profileSpliceLocation).forEach( function(group) {
			var html = getProfileModalGroupHtml(group);
			j$('.collabProfileModalList').append(html);
		});
		j$('.collabProfileModalList').append('<li class="prevProfileModalPage"><a href="#" onClick="showPrevProfileGroupPage();">Prev</a></li>');
		j$('.collabProfileModalList').append('<li class="nextProfileModalPage"><a href="#" onClick="showNextProfileGroupPage();">Next</a></li>');
	} else {
		profileGroupList.slice(0, 7).forEach( function(group) {
			var html = getProfileModalGroupHtml(group);
			j$('.collabProfileModalList').append(html);
		});
		j$('.collabProfileModalList').append('<li class="prevProfileModalPage"><span>Prev</span></li>');
		j$('.collabProfileModalList').append('<li class="nextProfileModalPage"><a href="#" onClick="showNextProfileGroupPage();">Next</a></li>');
	}
	profileSpliceLocation -= 7;
	bindProfileEvents();
return false;
}

var bindProfileEvents = function() {

}

var profileFollow = function(id, anchorObj) {
	Visualforce.remoting.Manager.invokeAction(
		_RemotingCollabInfoActions.follow,
			id,
			function(result, event){
					if(event.status){
						 j$(anchorObj).addClass('following');
						 j$(anchorObj).html('Following<span></span>');
						 j$(anchorObj).attr('onClick','profileUnfollow(\'' + result.id + '\', this);');
					 }
				},
			{escape:false,buffer:false}
	);
return false;
}
var profileUnfollow = function(id, anchorObj) {
Visualforce.remoting.Manager.invokeAction(
		_RemotingCollabInfoActions.unFollow,
			id,
			function(result, event){
					if(event.status){
						 j$(anchorObj).removeClass('following');
						 j$(anchorObj).html('Follow');
						 j$(anchorObj).attr('onClick','profileFollow(\'' + j$(anchorObj).data('id') + '\', this);');
					 }
				},
			{escape:false,buffer:false}
	);
return false;
}
var getProfileModalHtml = function(user) {
  var html;
  if (user.type == 'User') {    
	  html = '<li><div><a class="profileImage" a href="/apex/profileRedirect?id=';
	  html += user.id;
	  html += '"><img src="';
	  html += user.photo.smallPhotoUrl;
	  html += '"/></a><a href"/apex/profileRedirect?id=';
	  html += user.id;
	  html += '">';
	  html += user.name;
	  html += '</a></div>';
	  if (user.id != collabInfo_userId) {
		  if (user.mySubscription != null) {
			  html += '<div><a class="following" href="#" onClick="profileUnfollow(\'';
			  html += user.mySubscription.id;
			  html += '\', this);" data-id="';
			  html += user.id;
			  html += '">Following<span></span></a></div>';
		  } else {
			  html += '<div><a href="#" onClick="profileFollow(\'';
			  html += user.id;
			  html += '\', this);" data-id="';
			  html += user.id;
			  html += '">Follow</a></div>';
		  }
	  }
	  html += '</li>';
  } else if (user.type == 'Group') {
	  html = '<li><a>';
	  html += '</a></li>';
  } else if (user.type == 'Record') {
	  html = '<li><a>';
	  html += '</a></li>';
  } else if (user.type == 'File') {
	  html = '<li class="file"><div><a href="';
	  html += user.downloadUrl;
	  html += '" data-extension="';
	  html += user.fileExtension;
	  html += '">';
	  html += user.name;
	  html += '</a></div><div>';
	  if (user.mySubscription != null) {
		  html += '<a class="following" href="#" onClick="profileUnfollow(\'';
		  html += user.mySubscription.id;
		  html += '\', this);" data-id="';
		  html += user.id;
		  html += '">Following<span></span></a></div>';
	  } else {
		  html += '<a href="#" onClick="profileFollow(\'';
		  html += user.id;
		  html += '\', this);" data-id="';
		  html += user.id;
		  html += '">Follow</a></div>';
	  }
	  html += '</li>';
  }  
return html;
}
var getProfileModalGroupHtml = function(group) {
html = '<li><div class="profileGroup"><a class="profileImage" href="/apex/'+collabInfo_profileNamespace+'groupView?id=';
html += group.Id;
html += '"><img src="';
html += group.SmallPhotoUrl;
html += '"/></a><div><a href"/apex/'+collabInfo_profileNamespace+'groupView?id=';
html += group.Id;
html += '">';
html += group.Name;
html += '</a><span>Member Count: ';
html += group.MemberCount;
html += '</span></div></div></li>';
return html;
}
var getProfileFileHtml = function(file) {
var html = '<div><div><span class="fileDiv">';
html += file.FileExtension;
html += '</span><a href="/sfc/servlet.shepherd/version/download/';
html += file.Id;
html += '?asPdf=false&operationContext=CHATTER">';
html += file.Title;
html += '</a></div></div>';
return html;
}
var getExtensionPictures = function() {
j$('.profileOverview .filesOwned .fileDiv').each(function() {
	var text = j$(this).text();
	var position = getProfileExtensionPosition(text);
	j$(this).css('background-position', '0px ' + position + 'px');
	j$(this).text('');
});
};
var getFollowingExtensionPictures = function() {
j$('.profileOverview .following > div.file > a').each(function() {
	var text = j$(this).data('extension');
	var position = getProfileExtensionPosition(text);
	j$(this).css('background-position', '0px ' + position + 'px');
});
};
var getFollowingModalExtensionPictures = function() {
j$('#ShowAllProfileModal > ul.collabProfileModalList > li.file > div:first-child > a').each(function() {
	var text = j$(this).data('extension');
	var position = getProfileExtensionPosition(text);
	j$(this).css('background-position', '0px ' + position + 'px');
});
};
var getProfileExtensionPosition = function(text) {
if (text != null) {
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
return '0';
}
var getProfileGroupHtml = function(group) {
var html = '<div class="groupInfo"><a href="/apex/'+collabInfo_profileNamespace+'groupView?id=';
html += 'group.Id';
html += '"><img src="';
html += group.SmallPhotoUrl;
html += '" alt="Group Picture"/></a><div><a href="/apex/'+collabInfo_profileNamespace+'groupView?id=';
html += group.Id;
html += '">';
html += group.Name;
html += '</a><span>Members: ';
html += group.MemberCount;
html += '</span></div></div>';
return html;
}
var reload = function() {
location.reload();   
}