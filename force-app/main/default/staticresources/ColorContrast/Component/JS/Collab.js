//var __sfdcSessionId = collab_GETSESSIONID;
var elementId = '';
var existingId = '';
var existingCommentId = '';
var currentElementId = '';
var nextPageToken = null;
var nextLikeToken = 0;
var prevLikeToken = 0;
var following;
var currentCommentPlaceholder;
var news = 'news';
var searching = false;
var sortOrder = 'Recent Activity';
var comID;
var newVersionId;
var uploadId;
var returnElement;
var count = 0;

var j$ = jQuery.noConflict();
var $ = jQuery.noConflict();
//New Scripts
(function($){
	$(document).ready(function(){
		// Redcues browser compatability issues
		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function(val) {                	
				return j$.inArray(val, this);
			};
		}
		if(!collab_Collapse) {			
			$('#collabContainer').collapse('show'); 
			$('.loadingCollabFeed').removeClass('inactive');
			$('.collabPanel').css('padding-bottom','0px');
		}
		if (collab_AllowCustomers) {
			j$('.collabWrapper').addClass('orange');
		}
		comID = collab_Community;				
		if (comID == '') {
			comID = null;  			
		}
		if (comID != null) {
			news = 'following';
		}
		$('.displayAll').click(function(){
			if (news != 'news') {
				news = 'news';
				refreshFeeds();
			}
			return false;
		});
		$('.displayFollow').click(function(){
			if (news != 'following') {
				news = 'following';
				refreshFeeds();
			}
			return false;
		});
		$('.displayFollowExternal').click(function(){
			if (news != 'external') {
				news = 'external';
				if ($('.postToAnchor > span:first-child').text() != 'A Group') {
					groupClickHandler();
				}
				refreshFeeds();
			}
			return false;
		});
		$('.displayToMe').click(function(){
			if (news != 'toMe') {
				news = 'toMe';
				refreshFeeds();
			}
			return false;
		}); 
		Visualforce.remoting.Manager.invokeAction(                
			_RemotingCollabActions.getGroupsList,
			function(result, event){
				if(event.status){
					var html;					
					result.forEach( function(option) {
						html = '<option value="' + option[0] + '">' + option[1] + '</option>';
						//console.log(html);
						$('.groupSelectMain').append(html);
					});
				} else {
					alert(event.message);
				}
			}, 
			{escape:false,buffer:false}
		);
		Visualforce.remoting.Manager.invokeAction(                
			_RemotingCollabActions.getOrganizationGroupsList,
			function(result, event){
				if(event.status){
					var html;
					//console.log(result);
					result.forEach( function(option) {
						html = '<option value="' + option[0] + '">' + option[1] + '</option>';
						//console.log(html);
						$('.groupSelect').append(html);
					});
				} else {
					alert(event.message);
				}
			}, 
			{escape:false,buffer:false}
		);
		$( '.loadingCollabFeed').addClass('active');
		$( '.collabModal' ).dialog({show: true, hide: true, modal: true, autoOpen: false, resizable: false});
		$( '#CollabUploadNewVersion').dialog({width: 500 });
		$( '#CollabPreviewModal').dialog({width: 641 });
		$( '#CollabUploadFiles, #CollabUploadCommentFile').dialog({width: 1038 });
		$( '#CollabShareModal').dialog({width: 506 });
		$( '#CollabFileSharingModal').dialog({width: 650 });
		j$( '#NewUserLinkModal, #NewGroupLinkModal').dialog({width: 600});
		$( '#CollabCommentUploadModal').dialog({height: 100, width: 300});
		$( '#DisplayCollabLikes').dialog({width: 400 });

		// Click Post, File, or Link at the top of the page
		$('.collabWrapper ul li a').click(function(){
			$('.collabWrapper ul li a').removeClass('active');
			$('.collabWrapper > div').removeClass('active');
			var thisClass = $(this).attr('class');			
			$("." + thisClass).addClass('active');
			$('.collabWrapper ul li a').parent().removeClass('carrot');
			$('.collabWrapper ul li a.active').parent().addClass('carrot');
			
			var postText = $('.collabWrapper > div > div > #TextPublisherEditableArea').val();
			var linkText = $('.collabWrapper > div > div > #LinkPublisherEditableArea').val();
			var fileText = $('.collabWrapper #ContentPublisherEditableArea').val();
			
			if(thisClass != 'file') {
				if($('#CollabClose').hasClass('active')) {
					closeFileClickHandler();
					$('#CollabClose').removeClass('active');
				}
			}
			// Set other text boxes equal to one another when changing feed item choices
			if (postText.length != 0 && postText != $('.collabWrapper > div.post #textPostLabel').text() && thisClass != 'post') {
				if (thisClass == 'file') {
					$('.collabWrapper > div.file .collabUploadOptions + div textarea').parent().removeClass('default');
					$('.collabWrapper > div.file #ContentPublisherEditableArea').val(postText);
				}
				else if (thisClass == 'link') {
					$('.collabWrapper > div.link > div:first-child + div textarea').parent().removeClass('default');
					$('.collabWrapper > div.link > div > #LinkPublisherEditableArea').val(postText);
				}
				$('.collabWrapper > div.post > div > #TextPublisherEditableArea').val('')
			}
			else if (linkText.length != 0 && linkText != $('.collabWrapper > div.link #linkPostLabel').text() && thisClass != 'link') {
				if (thisClass == 'file') {
					$('.collabWrapper > div.file #ContentPublisherEditableArea').val(linkText);
					$('.collabWrapper > div.file .collabUploadOptions + div textarea').parent().removeClass('default');
				}
				else if (thisClass == 'post') {
					$('.collabWrapper > div.post > div:first-child textarea').parent().removeClass('default');
					$('.collabWrapper > div.post > div > #TextPublisherEditableArea').val(linkText);
				}
				$('.collabWrapper > div.link > div > #LinkPublisherEditableArea').val('');
			}
			else if (fileText.length != 0 && fileText != $('.collabWrapper > div.file #contentPostLabel').text() && thisClass != 'file') {
				if (thisClass == 'link') {
					$('.collabWrapper > div.link > div:first-child + div textarea').parent().removeClass('default');
					$('.collabWrapper > div.link > div > #LinkPublisherEditableArea').val(fileText);
				}
				else if (thisClass == 'post') {
					$('.collabWrapper > div.post > div:first-child textarea').parent().removeClass('default');
					$('.collabWrapper > div.post > div > #TextPublisherEditableArea').val(fileText);
				}
				$('.collabWrapper > div.file #ContentPublisherEditableArea').val('');
			}
			else {
				if (thisClass == 'post' && (postText.length == 0 || postText == $('.collabWrapper > div.post #textPostLabel').text())) {
					$('.collabWrapper > div.post > div > #TextPublisherEditableArea').val($('.collabWrapper > div.post #textPostLabel').text());
					$('.collabWrapper > div.post > div:first-child textarea').parent().addClass('default');
				}
				else if (thisClass == 'link' && (linkText.length == 0 || linkText == $('.collabWrapper > div.link #linkPostLabel').text())) {
					$('.collabWrapper > div.link > div > #LinkPublisherEditableArea').val($('.collabWrapper > div.link #linkPostLabel').text());
					$('.collabWrapper > div.link > div:first-child + div textarea').parent().addClass('default');
				}
				else if (thisClass == 'file' && (fileText.length == 0 || fileText == $('.collabWrapper > div.file #contentPostLabel').text())) {
					$('.collabWrapper > div.file #ContentPublisherEditableArea').val($('.collabWrapper > div.file #contentPostLabel').text());
					$('.collabWrapper > div.file .collabUploadOptions + div textarea').parent().addClass('default');
				}
			}
			return false;
		});
		
		$('.collabWrapper > div.post > div:first-child textarea').focus(function(){
			if($('.collabWrapper > div.post > div:first-child textarea').parent().hasClass('default')){
				$('.collabWrapper > div.post > div:first-child textarea').parent().removeClass('default');
				if($('.collabWrapper > div.post > div:first-child textarea').val() === $('.collabWrapper > div.post #textPostLabel').text()){
					$('.collabWrapper > div.post > div:first-child textarea').val('');
				}
			}        
		});
		$('.collabWrapper > div.post > div:first-child textarea').blur(function(){
			$('.collabWrapper > div.post > div:first-child textarea').parent().removeClass('default');
			if($('.collabWrapper > div.post > div:first-child textarea').val() === '') {
				$('.collabWrapper > div.post > div:first-child textarea').val($('.collabWrapper > div.post #textPostLabel').text());
				$('.collabWrapper > div.post > div:first-child textarea').parent().addClass('default');
			}
		});
		
		// Link Section Textarea
		$('.collabWrapper > div.link > div:first-child + div textarea').focus(function(){
			if($('.collabWrapper > div.link > div:first-child + div textarea').parent().hasClass('default')){
				$('.collabWrapper > div.link > div:first-child + div textarea').parent().removeClass('default');
				if($('.collabWrapper > div.link > div:first-child + div textarea').val() === $('.collabWrapper > div.link #linkPostLabel').text()){
					$('.collabWrapper > div.link > div:first-child + div textarea').val('');
				}
			}       
		});
		$('.collabWrapper > div.link > div:first-child + div textarea').blur(function(){
			$('.collabWrapper > div.link > div:first-child + div textarea').parent().removeClass('default');
			if($('.collabWrapper > div.link > div:first-child + div textarea').val() === ''){
				$('.collabWrapper > div.link > div:first-child + div textarea').val($('.collabWrapper > div.link #linkPostLabel').text());
				$('.collabWrapper > div.link > div:first-child + div textarea').parent().addClass('default');
			}
		});
		
		// File Section Textarea
		$('.collabWrapper > div.file .collabUploadOptions + div textarea').focus(function(){
			if($('.collabWrapper > div.file .collabUploadOptions + div textarea').parent().hasClass('default')){
				$('.collabWrapper > div.file .collabUploadOptions + div textarea').parent().removeClass('default');
				if($('.collabWrapper > div.file .collabUploadOptions + div textarea').val() === $('.collabWrapper > div.file #contentPostLabel').text()){
					$('.collabWrapper > div.file .collabUploadOptions + div textarea').val('');
				}
			}           
		});
		$('.collabWrapper > div.file .collabUploadOptions + div textarea').blur(function(){
			$('.collabWrapper > div.file .collabUploadOptions + div textarea').parent().removeClass('default');
			if($('.collabWrapper > div.file .collabUploadOptions + div textarea').val() === ''){
				$('.collabWrapper > div.file .collabUploadOptions + div textarea').val($('.collabWrapper div.file #contentPostLabel').text());
				$('.collabWrapper > div.file .collabUploadOptions + div textarea').parent().addClass('default');
			}
		});
		
		$( '.whoSee' ).click(function() {
			$( '.whoSeeCarrot' ).toggleClass('active');
			$( '.whoSeeHiddenDiv').toggleClass('active');
			return false;
		});
		$( '#CollabShareModal > .feedItem a' ).click(function(e) {
			e.preventDefault();
		});
		
		$('.collabSortDiv > div:first-child + div + div').addClass('current');
		
		//Dynamically resize text area
		$('.collabPanel textarea').on('keyup',function() {
			if($(this).attr('class') != 'searchCollabFeeds') {
				$(this).css('height','0px');
				$(this).css('height',Math.max(50,this.scrollHeight)+'px');
			}
		});
		  
		// This is the hide/show active selected 'collabItemChoices' and makes the post section default state as active
		$('.collabWrapper .post').addClass('active');
		$('.collabWrapper ul li a.active').parent().addClass('carrot');

		// Post Section TextArea - set initial value
		$('.collabWrapper > div.post > div:first-child textarea').val($('.collabWrapper > div.post #textPostLabel').text());
		$('.collabWrapper > div.post > div:first-child textarea').parent().addClass('default');

		// File area toggle stuff!
		$('#CollabClose, #CollabClose ~ div').hide();
		
		$('#CollapseFeedAnchor').on('click', function() {
			if($(this).hasClass('glyphicon-chevron-up')) {
				$('.collabPanel').css('padding-bottom','50px');
				$('.loadingCollabFeed').addClass('inactive');
				$(this).removeClass('glyphicon-chevron-up');
				$(this).addClass('glyphicon-chevron-down');
				$('#collabContainer').collapse('hide');
				$('.loadingCollabFeed').addClass('inactive');
			} else {
				$('.collabPanel').css('padding-bottom','0px');
				$(this).removeClass('glyphicon-chevron-down');
				$(this).addClass('glyphicon-chevron-up');
				$('#collabContainer').collapse('show');
				$('.loadingCollabFeed').removeClass('inactive');
			}
			return false; 
		});
		// Sort dropdown and bookmark dropdown
		$('body').click(function(e) {
			if($(e.target).closest('.whoSeeHiddenDiv').length < 1 && !($(e.target).hasClass('whoSee'))){
				$('.whoSeeHiddenDiv, .whoSeeCarrot').removeClass('active');
			}
			if($(e.target).closest('.moreActions').length < 1 && !($(e.target).hasClass('moreActionsAnchor')) && !($(e.target).hasClass('moreCommentActions'))) {
				$('.moreActions').removeClass('active');
			}
			if($(e.target).closest('.postToAnchor').length < 1) {
				$( '.collabWrapper .postTo' ).removeClass('active');
			}
			if($(e.target).closest('.shareWithAnchor').length < 1) {
				$( '#CollabShareModal .postTo' ).removeClass('active');
			}
			
			// Click outside of sort dropdown box or sort div
			if($(e.target).closest('.collabSortDiv').length < 1 && $(e.target).closest('#collabSearchOrder').length < 1) {
				$('.collabSortDiv').removeClass('active');
			}
			
			// Click delete/bookmark dropdown arrow or inside dropdown box
			//Deprecated, will need to be readded if additional options are given in this menu
			/*
			if($(e.target).closest('.collabFeedItemMenu > a').length >= 1) {
				if($(e.target).closest('.collabFeedItemMenu').find('div').hasClass('active')){
					$('.collabFeedItemMenu').find('div').removeClass('active');
				} else {
					$('.collabFeedItemMenu').find('div').removeClass('active');
					$(e.target).closest('.collabFeedItemMenu').find('div').addClass('active');
				}
				return false;
			}
			else if($(e.target).closest('.collabFeedWrapper > .feedItem .collabFeedItemMenu > div').length < 1) {
				$('.collabFeedWrapper > .feedItem .collabFeedItemMenu > div').removeClass('active');
			*/
				
			if($(e.target).closest('.collabCommentUploadDiv').length < 1 && $(e.target).closest('.collabAttachFileToComment').length < 1) {
				$('.collabCommentUploadDiv').removeClass('active');
			}
		});
		$( '#collabSearchOrder' ).click(function() {
			$('.collabSortDiv').toggleClass('active');
			$('.collabSortDiv').find('div > a.first-child').focus();
			return false;
		});
		
		$( '.collabWrapper .postToAnchor' ).click(function() {
			if (news.lastIndexOf('external') > -1) {
				alert('You can only post to external groups, not the external community as a whole.')
			} else {
				$(this).parent().next().toggleClass('active');
				$(this).parent().next().find('div > a.first-child').focus();
			}
			return false;
		});
		$( '#CollabShareModal .shareWithAnchor' ).click(function() {
			$(this).parent().next().toggleClass('active');
			$(this).parent().next().find('div > a.first-child').focus();
			return false;
		});
		$( '#CollabShareModal .postTo > div:first-child > a').click(function() {
			$(this).parent().parent().prev().find('a > span:first-child').text('My Followers');
			$( '.groupSelect' ).val('none');
			$( '.groupSelect' ).removeClass('active');
			$(this).parent().parent().next().next().focus();
			j$(this).parent().parent().removeClass('active');
			return false;
		});
		$( '#CollabShareModal .postTo > div:first-child + div > a' ).click(function() {
			if ($(this).parent().parent().prev().find('a > span:first-child').text() != 'A Group') {
				$(this).parent().parent().prev().find('a > span:first-child').text('A Group');
				$( '.groupSelect' ).addClass('active');
			}
			$(this).parent().parent().parent().next().focus();
			j$(this).parent().parent().removeClass('active');
			return false;
		});
		$( '.collabWrapper .postTo > div:first-child > a' ).click(function() {
			$(this).parent().parent().prev().find('a > span:first-child').text('My Followers');
			$( '.whoSeeCarrot').offset({left: 119});
			$( '.groupSelectMain' ).val('none');
			$( '.groupSelectMain' ).removeClass('active');
			$( '.whoSeeFind' ).text('Your followers see this post directly in their feed');
			$( '.whoSeePost').text('Anyone can see this post in the All Company feed, on your profile, and in search results.');
			$(this).parent().parent().parent().next().focus();
			j$(this).parent().parent().removeClass('active');
			return false;
		});
		$( '.collabWrapper .postTo > div:first-child + div > a' ).click(function() {
			if ($(this).parent().parent().prev().find('a > span:first-child').text() != 'A Group') {
				groupClickHandler();
			}
			$(this).parent().parent().removeClass('active');
			$(this).parent().parent().next().focus();
			return false;
		});
		
		// Click Post Date within collab sort div
		$('.collabSortDiv > div:first-child + div > a').click(function () {
			$('.collabSortDiv').removeClass('active');
			if (sortOrder != 'Post Date') {
				$('#collabSortOrder').text('Post Date');
				$(this).parent().addClass('current');
				$(this).parent().next().removeClass('current');
				$( '.loadingCollabFeed').addClass('active');
				$( '.collabFeedWrapper').removeClass('active');
				sortOrder = 'Post Date';
				refreshFeeds();
			}
			$('#collabSearchOrder').focus();
			return false;
		});
		
		// Click Recent Activity with collab sort div
		$( '.collabSortDiv > div + div + div > a' ).click(function () {
			$('.collabSortDiv').removeClass('active');
			if (sortOrder != 'Recent Acivity') {
				$( '#collabSortOrder' ).text('Recent Activity');
				$(this).parent().prev().removeClass('current');
				$(this).parent().addClass('current');
				$( '.loadingCollabFeed').addClass('active');
				$( '.collabFeedWrapper').removeClass('active');
				sortOrder = 'Recent Activity';
				refreshFeeds();
			}
			$('#collabSearchOrder').focus();
			return false;
		});
		
		$('.collabSortDropdown').addClass('active');
		// Close button when in upload file section
		$('#collabUploadFileAction').click(function(){
			$('#collabUploadFileAction, #collabLinkFileAction, #CollabClose, #CollabClose + div').toggle();
			$('#CollabClose').addClass('active');
			return false;
		});
		$('#CollabClose').click(function(){
			closeFileClickHandler();
			$('#collabLinkFileAction').focus();
			return false;
		});
		$('#ExistingFileDiv > div + div > a').click(function() {
			returnElement = $(this);
			$('#CollabUploadFiles').dialog('open');
			return false;
		});
		$('#ExistingCommentFileDiv > div + div > a').click(function() {
			$('#ExistingCommentFileDiv').removeClass('active');
			//console.log('cancelled');
			j$(this).parent().parent().prev().prev().focus();
			return false;
		});
		$( '.collabModal .actionClose' ).click(function() {
			$('.collabModal').dialog('close');
			returnElement.focus();
			return false;
		});
		
		$('body').on('click', '.actionList .actionAttach', function() {
			$( '.collabModal' ).dialog('close');
			$('.collabCommentUploadDiv').removeClass('active');
			
			if($('#CollabUploadFiles').hasClass('element')) {
				$('#CollabUploadFiles').removeClass('element')
				$('#CollabClose').addClass('active');
				$( '#ExistingFileDiv > div:first-child').css('background-position', '0px ' + $(this).data('location') + 'px');
				$( '#ExistingFileDiv > div + div > div' ).text($(this).data('name'));
				existingId = $(this).data('docid');
				$('#collabUploadFileAction, #collabLinkFileAction, #CollabClose, #CollabClose + div + div').toggle();
				$('#CollabClose').focus();
			} else {
				var text = '#ExistingCommentFileDiv' + currentElementId;
				$(text).prev().prev().removeClass('active');
				$( text + ' > div:first-child').css('background-position', '0px ' + $(this).data('location') + 'px');
				$( text + ' > div + div > div' ).text($(this).data('name'));
				existingCommentId = $(this).data('docid');
				$( text ).addClass('active');
				$( text ).next().next().next().next().text($(this).data('docid'));
				$( text ).find('div > a').focus();
				//$( text ).attr('data-doc_id',$(this).data('docid'));
			}
			return false;
		});
		
		$('#collabLinkFileAction').click(function(){
			$('#CollabUploadFiles').addClass('element');
			returnElement = $(this);
			$('#CollabUploadFiles').dialog('open');
			return false;
		});
		$('#CollabUploadFiles .actionClose').click(function() {
			$('#CollabUploadFiles').removeClass('element');
			$('#CollabUploadFiles').removeClass('comment');
			return false;
		});            
		$("#fileSearchText").focus(function(){
			$(this).val('');
			$(this).addClass('textFieldActive');
		});
		$("#fileSearchText").blur(function(){
			if($(this).val() == ""){
				$(this).val('Quick Search Text');
				$(this).removeClass('textFieldActive');
			}
		});
		
		$(".collabPanel .searchCollabFeeds").focus(function(){
			if($(this).val() == 'Quick Search Text') {
				$(this).val('');
				$(this).addClass('textFieldActive');
			}
		});
		$(".collabPanel .searchCollabFeeds").blur(function(){
			if($(this).val() == ""){
				$(this).val('Quick Search Text');
				$(this).removeClass('textFieldActive');
			}
		});
		$(".collabPanel .searchCollabFeeds").on('keydown', function(e) {
			if($(this).val().length > 1 && e.which == 13) {
				search();
			}
		});
		Visualforce.remoting.Manager.invokeAction(
		   _RemotingCollabActions.following,
			   function(result, event){
					   if(event.status){
							following = result;
							displayNextPage();
						}
				   },
			   {escape:false,buffer:false}
		);
		$('.collabTableBackground').show();
		$('.collabModal').addClass('active');
		$('a.first-child').on('keydown', function(e) {
			//console.log('first: ' + e.which);
			if(e.which == 9 && e.shiftKey) {
				$(this).closest('.child-container').removeClass('active');
			}
		});
		$('a.last-child').on('keydown', function(e) {
			//console.log(e.which);
			if(e.which == 9 && !e.shiftKey) {
				$(this).closest('.child-container').removeClass('active');
			}
		});
		
		
		var windowHeight = j$(window).innerHeight();
		var collabContain = j$('.collabContainer').height();						
		if (windowHeight <= collabContain) {
			  j$('.footer').css({
				  position: 'static'			           
			  });
		  } else {
			  j$('.footer').css({
				  position: 'fixed'
			  });
		  } 
		  
		  
	});	
})(jQuery);

var groupClickHandler = function() {
	j$('.collabWrapper .postTo > div:first-child + div > a').parent().parent().prev().find('a > span:first-child').text('A Group');
	j$('.groupSelectMain' ).addClass('active');
	//$('.groupSelectMain').focus();
	var tmp = j$('#CollabPostBottomBar > span:first-child + a').offset().left - j$('#CollabPostBottomBar').offset().left;
	//console.log('Offset: ' + tmp);
	j$('.whoSeeCarrot').offset({left: tmp});
	j$('.whoSeeFind' ).text('Your followers and members of this group see this post directly in their feed.  For private groups, only members of the group can see this post.');
	j$('.whoSeePost').text('Anyone can see this post on the All Company feed, your profile, the group, and in search results. For private groups, only members of the group can see this post.');
};

var closeFileClickHandler = function() {
	j$('#CollabClose').removeClass('active');
	j$('#collabUploadFileAction, #collabLinkFileAction, #CollabClose').toggle();
	j$('#CollabClose ~ div').hide();
	resetFileField(j$('#CollabFile'));
	existingId = '';
	j$( '#ExistingFileDiv > div + div > div' ).text('');
};

var bindFeedEvents = function(){
		j$( '.collabFeedWrapper').addClass('active');
		
		j$('.collabAttachFileToComment').addClass('active');
		j$('.existingCommentFileDiv').removeClass('active');
		//j$('.collabFeedWrapper .collabComment .newCollabCommentPlaceholder').addClass('active');
		
/*          j$('.collabFileSize > span').each(function() {
			if(!(j$(this).text().match(/B$/))) {
				j$(this).text(getSize(j$(this).text()));
			}
		});
		j$('.commentActionList').each(function() {
			if(j$(this).children().first().data('liked') == true) {
				j$(this).children().first().next().addClass('active');
			} else {
				j$(this).children().first().addClass('active');
			}
			if(j$(this).children().first().next().next().data('likes') == true) {
				j$(this).children().first().next().next().addClass('active');
			}
		});
		j$('.feedElementLike').each(function() {
			if(j$(this).data('liked') == true) {
				j$(this).next().addClass('active');
			} else {
				j$(this).addClass('active');
			}
		});
		j$('.bookmarkIcon').each(function() {
			if(j$(this).data('bookmarked') == true) {
				j$(this).addClass('active');
				j$(this).next().find('.removeBookmark').addClass('active');
			} else {
				j$(this).next().find('.addBookmark').addClass('active');
			}
		});
		j$('.collabLike').each(function() {
			if(j$(this).data('liked') == true) {
				j$(this).addClass('active');
			}
		});*/
		
		
		/* Search changed to upper right, this is pointless
		if( j$('.collabSearch > div > textarea' ).val() == '' ) {
			j$('.collabSortDropdown').addClass('active');
		}
		else {
			j$( '.collabSearch' ).addClass('active');
		}*/
		
		
		j$('.collabFeedItemMenu > a').off('click');
		j$('.collabFeedItemMenu > a').on('click', function(){
			j$(this).next().toggleClass('active');
			j$(this).next().find('a').focus();
			return false;
		});
		j$('.collabFeedItemMenu > div > span > a').off('click');
		j$('.collabFeedItemMenu > div > span > a').on('blur', function(){
			j$(this).parent().parent().removeClass('active');
		});
		// Begin entering a topic
		j$('.collabWrapper textarea').off('keypress');
		j$('.collabWrapper textarea').on('keypress',function() {
			if(event.which == 35)
			{
				alert('Topic Dialog');
			}
		});
		
		j$('.collabLike').off('click');
		j$('.collabLike').on('click',function() {
			j$('#DisplayCollabLikes').dialog('open');
			returnElement = j$(this);
			var id = j$(this).data('id');
			showElementLikePage(id, 0);
			return false;
		});
		
		j$('.collabTotalLikes + a').off('click');
		j$('.collabTotalLikes + a').on('click',function() {
			j$('#DisplayCollabLikes').dialog('open');
			returnElement = j$(this);
			var id = j$(this).data('id');
			getCommentLikePage(id, 0);
			return false;
		});
		
		j$('.collabCommentUploadDiv > a + a' ).off('click');
		j$('.collabCommentUploadDiv > a + a' ).on('click', function() {
			j$(this).parent().next().next().addClass('active');
			j$(this).parent().prev().removeClass('active');
			j$(this).parent().removeClass('active');
			j$(this).parent().next().next().find('input').focus();
			return false;
		});
		
		j$('.newCommentFileDiv > form > a' ).off('click');
		j$('.newCommentFileDiv > form > a' ).on('click',function() {
			resetFileField(j$(this).prev());
			j$(this).parent().parent().parent().find('.collabAttachFileToComment').addClass('active');
			j$(this).parent().parent().removeClass('active');
			j$(this).parent().parent().prev().prev().prev().focus();
			return false;
		});
		
		j$('.collabCommentUploadDiv > a:first-child').off('click');
		j$('.collabCommentUploadDiv > a:first-child').on('click', function() {
			j$('#CollabUploadFiles').addClass('comment');
			j$('#CollabUploadFiles').dialog('open');
			returnElement = j$(this);
			return false;
		});

		j$('.collabUploadAnchor').off('click');
		j$('.collabUploadAnchor').on('click', function() {
			j$('#CollabUploadNewVersion').dialog('open');
			uploadId = j$(this).data('id');
			returnElement = j$(this);
			return false;
		});

		/*
		// Enter keypress in search box
		//  Will call Action Function
		j$('.collabSearch > div > textarea').off('keypress');
		j$('.collabSearch > div > textarea').on('keypress', function() {
			if(event.which == 13 && !event.shiftKey)
			{
				j$( '.loadingCollabFeed').addClass('active');
				j$( '.collabFeedWrapper').removeClass('active');
				var searchValue =  j$('.collabSearch > div > textarea').val().trim();
			}
		});*/
	
		// Comment Button below feed item body
		j$('.collabFeedWrapper > div > div + div > div + div > ul li:first-child > a').off('click')
		j$('.collabFeedWrapper > div > div + div > div + div > ul li:first-child > a').on('click',function() {
			j$(this).parent().parent().parent().parent().nextAll('.collabComment').next().addClass('active');
			j$(this).parent().parent().parent().parent().nextAll('.collabComment').next().find('textArea').focus();
			j$(this).parent().parent().parent().parent().next().find('.newCollabCommentPlaceholder').removeClass('active');
			j$(this).parent().parent().parent().parent().next().next().find('.newCollabCommentPlaceholder').removeClass('active');
			return false;
		});
		
		// Click X in collab feed search box
		j$(' .collabSearch > div > textarea + a').off('click');
		j$(' .collabSearch > div > textarea + a').on('click',function() {
			j$('.collabSortDropdown').addClass('active');
			j$('.collabSearch').removeClass('active');
			return false;
		});
		
		// Click magnifying glass in sort by div
//          j$('.collabSortDropdown > a:first-child').off('click');
//          j$('.collabSortDropdown > a:first-child').on('click',function() {
//              j$('.collabSortDropdown').removeClass('active');
//              j$('.collabSearch').addClass('active');
//          });
		
		j$('.collabAttachFileToComment').off('click');
		j$('.collabAttachFileToComment').on('click', function() {
			if (j$(this).next().hasClass('active')) {
				j$('.collabCommentUploadDiv').removeClass('active');
			} else {
				j$('.collabCommentUploadDiv').removeClass('active');
				j$(this).next().addClass('active');
				j$(this).next().find('a:first-child').focus();
			}
			return false;
		});
		
		//click more actions
		j$('.fileBlock .moreCommentActions, .fileBlock .moreActionsAnchor').off('click');
		j$('.fileBlock .moreCommentActions, .fileBlock .moreActionsAnchor').on('click', function() {
			j$('.moreActions').removeClass('active');
			j$(this).next().addClass('active');
			j$(this).next().find('div:first-child > a').focus();
			return false;
		});
		j$('.moreActionsInnerAnchor').off('click');
		j$('.moreActionsInnerAnchor').on('click', function() {
			//console.log('remove double parent');
			j$(this).parent().parent().removeClass('active');
			j$(this).parent().parent().prev().focus();
			return false;
		});
		j$('.moreActions > div > a').off('keydown');
		j$('.moreActionsInnerAnchor').on('keydown', function(e) {
			if(e.which == 9 && e.shiftKey) {
				j$(this).parent().parent().removeClass('active');
				j$(this).parent().parent().prev().focus();
			}
		});
		j$('.moreActions > div:last-child > a').on('keydown', function(e) {
			if(e.which == 9 && !e.shiftKey) {
				j$(this).parent().parent().removeClass('active');
			}
		});
		/*
		j$('.moreActionsInnerAnchor').each(function(anchor) {
			var lastChild = j$(anchor);

			while(lastChild.next('div').length > 0) {
				lastChild = lastChild.next('div');
			}
			//console.log(lastChild);
			
			lastChild.on('keydown', function(e) {
				//console.log('new: ' + e.which);
				if(e.which == 9 && !e.shiftKey) {
					j$(this).parent().parent().removeClass('active');
				}
			});
		});
		/*j$('.moreActionsAnchor').each(function() {
			j$(this).parent().next().css('top', j$(this).position().top - j$(this).parent().parent().parent().parent().position().top - 15);
			j$(this).parent().next().css('left', j$(this).position().left - j$(this).parent().parent().parent().parent().position().left + 32);
		});*/
		/*j$('.moreCommentActions').each(function() {
			j$(this).parent().next().css('top', j$(this).position().top - j$(this).parent().position().top - 15);
			j$(this).parent().next().css('left', j$(this).position().left - j$(this).parent().position().left + 32);
		});*/
//          j$(' .feedItem > div:first-child + div > div:first-child + div > ul > li:first-child > a').off('click');
//          j$(' .feedItem > div:first-child + div > div:first-child + div > ul > li:first-child > a').on('click', function() {
//              j$('.collabFeedWrapper .collabComment > span > div.createCollabComment > div').addClass('active');
//          });

		// Share button click on feed items
		j$('.collabShare').off('click');
		j$('.collabShare').on('click',function() {
			var feedBody = j$(this).closest('.feedItem > div:first-child + div > div:first-child + div').html();
			var feedPoster = j$(this).closest('.feedItem').find('.collabFeedItemHeader > a').html();

			j$('#CollabShareModal > span:first-child + div > div.feedItem > div:first-child + div > div:first-child + div').html(feedBody);
			j$('#CollabShareModal .feedItem .collabFeedItemHeader > a + a + a').html(feedPoster);
			j$('#CollabShareModal ul, #CollabShareModal .feedItem .collabComment, #CollabShareModal .feedItem .createCollabComment, #CollabShareModal .feedItem .collabFeedItemMenu, #CollabShareModal .feedItem .collabTopics, #CollabShareModal .feedItem .moreActions, #CollabShareModal .feedItem .bookmarkIcon').remove();
			j$('#CollabShareModal a').click(function(e){e.preventDefault()});
			j$('#CollabShareModal .fileBlock a').removeAttr('href');
			j$('#CollabShareModal').dialog('open');
			returnElement = j$(this);
			return false;
		});
	
		j$( '.collabModal > a' ).on('click',function() {
			returnElement.focus();
			j$( '.collabModal' ).dialog('close'); 
			return false;   
		});
		
		
//          j$('.collabFeedWrapper .collabComment .createCollabComment > div:first-child > textarea').off('click');
//          j$('.collabFeedWrapper .collabComment .createCollabComment > div:first-child > textarea').on('click',function() {
//              j$('.collabFeedWrapper .collabComment .createCollabComment > div').toggleClass('active');
//          });
		
		// Click inside new comment placeholder
		j$('.collabFeedWrapper .collabComment .newCollabCommentPlaceholder > textarea').off('focus');
		j$('.collabFeedWrapper .collabComment .newCollabCommentPlaceholder > textarea').on('focus',function() {
			j$(this).parent().removeClass('active');
			j$(this).parent().parent().parent().next().addClass('active');
			j$(this).parent().parent().parent().next().find('textarea').focus();
		});
		
		j$('.existingCommentFileDiv > div > a').off('click');
		j$('.existingCommentFileDiv > div > a').on('click',function() {
			currentElementId = '';
			j$(this).parent().parent().removeClass('active');
			j$(this).parent().parent().prev().prev().addClass('active');
			j$(this).parent().parent().prev().prev().focus();
			return false;
		});
		j$('.arrowKey').off('keydown');
		j$('.arrowKey').on('keydown', function(e) {
			//console.log('hit');
			if(e.which == 38) {
				//console.log('up');
				j$(this).prev('.arrowKey').find('.focusItem').focus();
				e.preventDefault();
			}
			if(e.which == 40) {
				//console.log('down');
				j$(this).next('.arrowKey').find('.focusItem').focus();
				e.preventDefault();
			}
		});
		j$('.collabCommentUploadDiv > a').off('keydown');
		j$('.collabCommentUploadDiv > a:first-child').on('keydown', function(e) {
			//console.log(e.which);
			if(e.which == 9 && e.shiftKey) {
				j$(this).parent().removeClass('active');
				j$(this).parent().prev().focus();
			}
			if(e.which == 40) {
				j$(this).next().focus();
				e.preventDefault();
			}
		});
		j$('.collabCommentUploadDiv > a.lastChild').on('keydown', function(e) {
			if(e.which == 9 && !e.shiftKey) {
				j$(this).parent().removeClass('active');
			}
			if(e.which == 38) {
				j$(this).prev().focus();
				e.preventDefault();
			}
		});
	};
	var refreshFeeds = function() {
		j$('.loadingCollabFeed').addClass('active');
		j$('.collabFeedWrapper .feedItem').remove();
		nextPageToken = null;
		displayNextPage();
	}
	var checkFeedFollowings = function() {
		j$( '.moreActions' ).each(function( ) {
			var id = j$(this).data('id');
			if (id in following) {
				j$(this).find('.follow').addClass('following');
				j$(this).find('.follow > a').text('Following');
			}
		});
	}   
	
	var canUpload = function(id) {
		Visualforce.remoting.Manager.invokeAction(                
				 _RemotingCollabActions.canUpload,
				 id,
				 collab_UserId,
				 function(result, event) {
					if(event.status) {
						return result;
					}
				 },
			 {escape:false,buffer:false}
		);
	}
	
	var displayNextPage = function() {
		//console.log('In displayNextPage');
		//console.log('@@@ count'+count)
		j$(window).off('scroll');
		//This is used so that if the html is removed, like in the case of the group view page, an error is not thrown
		if (j$('.searchCollabFeeds').length > 0) {
			Visualforce.remoting.Manager.invokeAction(                
				_RemotingCollabActions.getNewsFeedNextPage,
				comID,
				collab_controllerReferenceId,
				nextPageToken, 
				collab_NumberOfPosts, 
				sortOrder, 
				j$('.searchCollabFeeds').val(), 
				searching, 
				news,
				function(result, event){
					if(event.status){
						var first = true;
						result.forEach(function(feedElement) {
							if (first == true) {
								nextPageToken = feedElement.token;
								first = false;
							} else {
								var feedItem = getFeedElementHtml(feedElement,count);
								j$('.loadingCollabFeed').before(feedItem);
							}
							count++;
						});
						bindFeedEvents();
						checkFeedFollowings();
						j$('.loadingCollabFeed').removeClass('active');
						if(collab_InfiniteScroll) {
							if (nextPageToken != null && nextPageToken != '') {
								j$(window).on('scroll', function() {
									if(j$(window).scrollTop() + j$(window).height() >= j$(document).height()/1.1 ) {
										j$(window).off('scroll');
										j$( '.loadingCollabFeed').addClass('active');
										displayNextPage();
									}
								});
							}
						}
					} else {
						alert(event.message);
					}
				}, 
				{escape:false,buffer:false}
			);
		}
	}
	
	function resetFileField(e) {
		e.wrap('<form>').parent('form').trigger('reset');
		e.unwrap();
	}
	
	var setWindowScroll = function () {
		if(collab_InfiniteScroll) {
			if (nextPageToken != null && nextPageToken != '') {
				j$(window).on('scroll', function() {
					if(j$(window).scrollTop() + j$(window).height() >= j$(document).height()/1.1 ) {
						j$(window).off('scroll');
						j$( '.loadingCollabFeed').addClass('active');
						displayNextPage();
					}
				});
			}
		}
	}

	var getSegmentHtml = function(segment) {
		var segmentHtml = '';
		if (segment.type == 'EntityLink') {
			if (segment.reference.id.substring(0,3) == '005') {
				segmentHtml += '<a href="/apex/profileRedirect?id=' + segment.reference.id + '" title="View the profile page of ';
			} else if (segment.reference.id.substring(0,3) == '0F9') {
				segmentHtml += '<a href="/apex/groupView?id=' + segment.reference.id + '" title="View the group page of ';
			} else {
				segmentHtml += '<a target="_blank" href="/' + segment.reference.id + '" title="View the page of ';
			}
			segmentHtml += segment.text;
			segmentHtml += '">';
			segmentHtml += segment.text + '</a>';
		} else if (segment.type == 'FieldChange') {
			segment.segments.forEach( function(newSegment) {
				segmentHtml += getSegmentHtml(newSegment);
			}); 
		} else if (segment.type == 'Link' || segment.type == 'ResourceLink') {
			segmentHtml += '<a href="';
			segmentHtml += segment.url;
			segmentHtml += '" title="View the page of ';
			segmentHtml += segment.text;
			segmentHtml += '">' + segment.text + '</a>';
		} else if (segment.type == 'MoreChanges') {
			segment.moreChanges.forEach( function(newSegment) {
				segmentHtml += getSegmentHtml(newSegment);
			});
		} else if (segment.type == 'FieldChangeValue') {
			segmentHtml = segment.text;
		} else {
			segmentHtml = segment.text;
		} 
		return segmentHtml;
	}
	var getCommentHtml = function(commentInfo) {
	//console.log(commentInfo);
		var commentHtml = '<div class="singleComment comment';
		commentHtml += commentInfo.comment.id;
		var str = j$('[id$=userNameApex]');
		if(commentInfo.userName==str.val() ) {
			commentHtml +=' firstColor ';
		}
		else{
			commentHtml +=' secondColor ';
		}
		commentHtml += '"><div>';


		/*commentHtml += '<a href="/apex/profileRedirect?id=';
		commentHtml += commentInfo.comment.user.id;
		commentHtml += '" title="View the profile of ';
		commentHtml += commentInfo.comment.user.firstName + ' ' + commentInfo.comment.user.lastName;
		commentHtml += '"><img alt="Profile of ';
		commentHtml += commentInfo.comment.user.firstName + ' ' + commentInfo.comment.user.lastName;
		commentHtml += '" src="';
		commentHtml += commentInfo.comment.user.photo.smallPhotoUrl;
		commentHtml += '" /></a>';*/
		commentHtml += '<img alt="comment photo" src="';
		commentHtml += commentInfo.comment.user.photo.smallPhotoUrl;
		commentHtml += '" class="img-circle ';
		if(commentInfo.userName==str.val() ) {
			commentHtml +='commentImgLeft';
		}
		else{
			commentHtml +='commentImgRight';
		}
		commentHtml += '"/>';

		commentHtml += '</div><div class="initialComment"><div><a href="/apex/profileRedirect?id=';
		commentHtml += commentInfo.comment.user.id;
		commentHtml += '" title="View the profile of ';
		commentHtml += commentInfo.comment.user.firstName + ' ' + commentInfo.comment.user.lastName;
		commentHtml += '"><b>';
		commentHtml += commentInfo.userName;
		commentHtml += '</b></a></div><div>';
		commentHtml += commentInfo.formattedText;
		commentHtml += '</div>';
		if (commentInfo.comment.capabilities.content != null) {
			commentHtml += '<div>';
			if (commentInfo.contentDownloadUrl != null && commentInfo.contentDownloadUrl != '' && commentInfo.comment.capabilities.content.fileExtension != null) {
				commentHtml += '<div class="fileBlock">';
				if(commentInfo.hasImagePreview) {
					commentHtml += '<span><a href="#CollabPreviewModal" onclick="displayPreview(\'';
					commentHtml += commentInfo.comment.capabilities.content.renditionUrl720By480;
					commentHtml += '\', \'';
					commentHtml += commentInfo.contentTitle;
					commentHtml += '\', this);" title="View the preview of this file"><img alt="';
					commentHtml += commentInfo.contentTitle;
					commentHtml += '" src="';
					commentHtml += commentInfo.imageUrl;
					commentHtml += '" class="img-circle"/></a></span>';
				} else {
					commentHtml += '<div class="collabDefaultPreview" style="background-position: 0px ';
					if(commentInfo.comment.capabilities.content.fileExtension != null) {
						commentHtml += getFilePosition(commentInfo.comment.capabilities.content.fileExtension.toLowerCase());
					} else {
						commentHtml += '0';
					}
					commentHtml += 'px;"></div>';
				}
				commentHtml += '<div><a href="#"><b>';
				commentHtml += commentInfo.contentTitle;
				commentHtml += '</b></a>';
				commentHtml += '<a class="collabFileSize" href="/sfc/servlet.shepherd/version/download/';
				commentHtml += commentInfo.comment.capabilities.content.versionId;
				commentHtml += '?asPdf=false&operationContext=CHATTER';
				commentHtml += '" title="Download this file">Download ';
				commentHtml += commentInfo.comment.capabilities.content.fileExtension;
				commentHtml += '<span> ';
				commentHtml += getSize(commentInfo.comment.capabilities.content.fileSize);
				commentHtml += '</span></a><span>&nbsp;&middot;&nbsp;</span><div class="moreActionsContainer"><a href="#" class="moreCommentActions" title="View additional options for this file">More Actions</a>';
				commentHtml += '<div class="moreActions" data-id="';
				commentHtml += commentInfo.comment.capabilities.content.id;
				commentHtml += '">';
				commentHtml += '<div class="active arrowKey"><a href="#" class="focusItem moreActionsInnerAnchor" title="Close the more actions window">More Actions</a></div>';
				commentHtml += '<div class="active follow arrowKey"><a href="#" class="focusItem" onclick="followFile(\'';
				commentHtml += commentInfo.comment.capabilities.content.id;
				commentHtml += '\', this)" title="Follow this file">Follow</a></div>';
				if (commentInfo.hasImagePreview) {
					commentHtml += '<div class ="active arrowKey"><a href="#" class="focusItem" onclick="displayMenuPreview(\'';
					commentHtml += commentInfo.comment.capabilities.content.renditionUrl720By480;
					commentHtml += '\', \'';
					commentHtml += commentInfo.contentTitle;
					commentHtml += '\', this);" title="View a preview of this file">Preview</a></div>';
				}
				var userId = collab_userId;
				/*
				if ({!settings.canModifyAllData}) {
					commentHtml += '<div class ="active"><a href="#" title="Upload a new version of this file">Upload New Version</a></div>';
				} else if (canUpload(commentInfo.comment.capabilities.content.id)) {
					commentHtml += '<div class ="active"><a href="#" title="Upload a new version of this file">Upload New Version</a></div>';
				} else if (commentInfo.comment.actor != null) {
					if (userId.startsWith(commentInfo.comment.actor.id)) {
						commentHtml += '<div class ="active"><a href="#" title="Upload a new version of this file">Upload New Version</a></div>';
					}
				}*/
				if (commentInfo.comment.canShare) {
					commentHtml += '<div class="active arrowKey"><a class="focusItem" href="#" title="View sharing settings for this file">File Sharing Settings</a></div>';
				}
					
				commentHtml += '</div></div></div></div></div>';
			} else {
				commentHtml += '<div class="fileBlock"><div class="removedFile"></div><div>FILE REMOVED</div></div></div>';
			}
		}
		commentHtml += '<ul class="commentActionList"><li';
		if (commentInfo.comment.myLike != null) {
			commentHtml += '><a href="#" onclick="likeComment(null, \'';
			commentHtml += commentInfo.comment.id;
			commentHtml += '\', this)" title="Like this post" >Like</a></li><li class="active">';
			commentHtml += '<a href="#" onclick="unLikeComment(null, \'';
			commentHtml += commentInfo.comment.myLike.id;
			commentHtml += '\', this)" title="Stop liking this post" >Unlike</a>';
		} else {
			commentHtml += ' class="active"><a href="#" onclick="likeComment(null, \'';
			commentHtml += commentInfo.comment.id;
			commentHtml += '\', this)" title="Like this post" >Like</a></li><li>';
			commentHtml += '<a href="#" onclick="unLikeComment(null, \'';
			commentHtml += '\', this)" title="Stop liking this post" >Unlike</a>';
		}
		commentHtml += '</li><li';
		if (commentInfo.comment.likesMessage != null) {
			commentHtml += ' class="active"><span><span>&nbsp;&nbsp;&middot;&nbsp;&nbsp;</span><span class="collabTotalLikes"></span><a href="#" data-id="';
			commentHtml += commentInfo.comment.id;
			commentHtml += '" title="View all the people who like this comment">';
			commentHtml += commentInfo.totalLikes;
			if(commentInfo.totalLikes <= 1) {
				commentHtml += ' person';
			} else {
				commentHtml += ' people';
			}
			commentHtml += '</a></span>';
		} else {
			commentHtml += '><span><span>&nbsp;&nbsp;&middot;&nbsp;&nbsp;</span><span class="collabTotalLikes"></span><a href="#" data-id="';
			commentHtml += commentInfo.comment.id;
			commentHtml += '" title="View the people who like this comment">';
			commentHtml += '1 person</a></span>';
		}
		commentHtml += '</li><li class="active"><span>&nbsp;&nbsp;&middot;&nbsp;&nbsp;</span></li><li class="active">';
		commentHtml += commentInfo.comment.relativeCreatedDate;
		commentHtml += '</li></ul></div>';
		if (!commentInfo.comment.isDeleteRestricted) {
			commentHtml += '<span><a id="DeleteCollabComment" href="#" onclick="deleteComment(\'';
			commentHtml += commentInfo.comment.id;
			commentHtml += '\', this);" title="Delete this comment">Delete</a></span>';
		}
		commentHtml += '</div>';
		return commentHtml;
	}
	
	var getLikeHtml = function(like) {
		html = '<li><div><a class="likeImage" href="/apex/profileRedirect?id=';
		html += like.user.id;
		html += '" title="View the profile of ';
		html += like.user.name;
		html += '"><img src="';
		html += like.user.photo.smallPhotoUrl;
		html += '" class="img-circle"/></a><a href"/apex/profileRedirect?id=';
		html += like.user.id;
		html += '">';
		html += like.user.name;
		html += '</a></div>';
		if (like.user.id != collab_userId) {
			if (like.user.mySubscription != null) {
				html += '<div><a class="following" href="#" onclick="collabUnfollow(\'';
				html += like.user.mySubscription.id;
				html += '\', this);" data-id="';
				html += like.user.id;
				html += '" title="Stop following this file">Following</a><span></span></div>';
			} else {
				html += '<div><a href="#" class="follow" onClick="collabFollow(\'';
				html += like.user.id;
				html += '\', this);" data-id="';
				html += like.user.id;
				html += '" title="Follow this file">Follow</a></div>';
			}
		}
		html += '</li>';
		return html;
	}
	var showElementLikePage = function(id, token) {
		j$('.collabLikesList').empty();
		Visualforce.remoting.Manager.invokeAction(                
				 _RemotingCollabActions.getElementLikes,
				 comID,
				 id,
				 token,
				 function(result, event) {
					if(event.status) {
						var html;
						result.items.forEach(function(like) {
							html = getLikeHtml(like);
							j$('.collabLikesList').append(html);
						});
						if (result.previousPageToken != null) {
							html = '<li class="prevLikePage"><a href="#" title="View the next page" onClick="showElementLikePage(\'';
							html += id;
							html += '\', ';
							html += result.previousPageToken;
							html += ');">Prev</a></li>';
							j$('.collabLikesList').append(html);
						} else {
							j$('.collabLikesList').append('<li class="prevLikePage"><span> <i class="fa fa-backward" aria-hidden="true"></i> Prev </span></li>');
						}
						if (result.nextPageToken != null) {
							html = '<li class="nextLikePage"><a href="#" title="View the previous page" onClick="showElementLikePage(\'';
							html += id;
							html += '\', ';
							html += result.nextPageToken;
							html += ');">Prev >> </a></li>';
							j$('.collabLikesList').append(html);
						} else {
							j$('.collabLikesList').append('<li class="nextLikePage"><span> Next <i class="fa fa-forward" aria-hidden="true"></i> </span></li>');
						}
					}
				 },
			 {escape:false,buffer:false}
		);
		return false;
	}
	var getCommentLikePage = function(id, token) {
		j$('.collabLikesList').empty();
		Visualforce.remoting.Manager.invokeAction(                
				 _RemotingCollabActions.getCommentLikes,
				 comID,
				 id,
				 token,
				 function(result, event) {
					if(event.status) {
						var html;
						result.items.forEach(function(like) {
							html = getLikeHtml(like);
							j$('.collabLikesList').append(html);
						});
						if (result.previousPageToken != null) {
							html = '<li class="prevLikePage"><a href="#" title="View the next page" onClick="showElementLikePage(\'';
							html += id;
							html += '\', ';
							html += result.previousPageToken;
							html += ');">Prev</a></li>';
							j$('.collabLikesList').append(html);
						} else {
							j$('.collabLikesList').append('<li class="prevLikePage"><span>Prev</span></li>');
						}
						if (result.nextPageToken != null) {
							html = '<li class="nextLikePage"><a href="#" title="View the previous page" onClick="showElementLikePage(\'';
							html += id;
							html += '\', ';
							html += result.nextPageToken;
							html += ');">Prev</a></li>';
							j$('.collabLikesList').append(html);
						} else {
							j$('.collabLikesList').append('<li class="nextLikePage"><span>Next</span></li>');
						}
					}
				 },
			 {escape:false,buffer:false}
		);
		return false;
	}
	var collabFollow = function(id, anchorObj) {
		Visualforce.remoting.Manager.invokeAction(
			_RemotingCollabActions.follow,
				comID,
				id,
				function(result, event){
						if(event.status){
							 j$(anchorObj).addClass('following');
							 j$(anchorObj).html('Following<span></span>');
							 j$(anchorObj).attr('onClick','collabUnfollow(\'' + result + '\', this);');
						 }
					},
				{escape:false,buffer:false}
		);
		return false;
	}
	var collabUnfollow = function(id, anchorObj) {
		Visualforce.remoting.Manager.invokeAction(
			_RemotingCollabActions.unFollow,
				comID,
				id,
				function(result, event){
						if(event.status){
							 j$(anchorObj).removeClass('following');
							 j$(anchorObj).text('Follow');
							 j$(anchorObj).attr('title', 'Follow this file');
							 j$(anchorObj).attr('onClick','collabFollow(\'' + j$(anchorObj).data('id') + '\', this);');
						 }
					},
				{escape:false,buffer:false}
		);
		return false;
	}
	var followFile = function(id, anchorObj) {
		if (id in following) {
			Visualforce.remoting.Manager.invokeAction(
				_RemotingCollabActions.unFollow,
					comID,
					following[id],
					function(result, event){
							if(event.status){
								 delete following[id];
								 j$(anchorObj).parent().removeClass('following');
								 j$(anchorObj).attr('title', 'Follow this file');
								 j$(anchorObj).text('Follow');
							 }
						},
					{escape:false,buffer:false}
			);
		} else {
			Visualforce.remoting.Manager.invokeAction(
				_RemotingCollabActions.follow,
					comID,
					id,
					function(result, event){
							if(event.status){
								 following[id] = result;
								 j$(anchorObj).parent().addClass('following');
								 j$(anchorObj).attr('title', 'Stop following this file');
								 j$(anchorObj).text('Following');
							 }
						},
					{escape:false,buffer:false}
			);
		}
		return false;
	};
	var setFeedElementId = function(id) {
		elementId = id;
	}
	
	var shareModalListChange = function(value) {
		if(value == 'group') {
			j$( '.groupSelect' ).addClass('active');
		} else {
			j$( '.groupSelect' ).removeClass('active');
		}
	}
	var displayComments = function(id,count) {
		//console.log('In displayComments',count);
		//console.log('In displayComments',id);
		Visualforce.remoting.Manager.invokeAction(                
				 _RemotingCollabActions.getAllComments,
				 comID,
				 id,
				 function(result, event){
					 if(event.status){						
						result.pop();
						result.pop();
						result.pop();
						result.reverse();
						result.forEach(function(comment) {
							//j$('.feedItem' +count + ' div.collabComment > span').prepend(getCommentHtml(comment));
						    j$('.feed' + count + ' div.collabComment > span').prepend(getCommentHtml(comment));
							//console.log('id=======',id);
							//j$('.feedItem div.collabComment > span' ).prepend(getCommentHtml(comment)); 
						});
						//j$('.feedItem' + id + ' .showMore').removeClass('active');
						j$('.feed' + count + ' .showMore').removeClass('active');
					 }    
				 }, 
			 {escape:false,buffer:false}
		);
		return false;
	}
	
	var getFilePosition = function(extension) {
	var position;
	if ( typeof extension == 'undefined') {
		position = '0';
		} else {
		switch (extension) {
			case 'al':
				position = '-42';
				break;
			case 'pdf':
				position = '-672';
				break;
			case 'word':
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
	var getSize = function(size) {
		if (size < 1000) {
			return '(' + size + ' B)';
		} else if (size < 1000000) {
			return '(' + Math.round(size/1000) + ' KB)';
		} else if (size < 1000000000) {
			return '(' + Math.round(size/1000000) + ' MB)';
		} else {
			return '(' + Math.round(size/1000000000) + ' GB)';
		}
	};

	var displayPreview = function(url, fileName, object) {
		j$( '#CollabPreviewModal > div > img' ).attr('src', url);
		j$( '#CollabPreviewModal > span > p' ).text(fileName);
		j$( '#CollabPreviewModal' ).dialog('open'); 
		returnElement = j$(object).parent().prev();
		return false;
	};  
	var displayMenuPreview = function(url, fileName, object) {
		j$( '#CollabPreviewModal > div > img' ).attr('src', url);
		j$( '#CollabPreviewModal > span > p' ).text(fileName);
		j$( '#CollabPreviewModal' ).dialog('open'); 
		returnElement = j$(object);
		return false;
	};   

	var sharePost = function(feedElementInfo) {
		var feedElementInfo = this.attr('id');
		//console.log(feedElementInfo);
	};
	
	var closeShareModal = function() {
		j$('#CollabShareModal').dialog('close');
		returnElement.focus();
		return false;
		//j$('#CollabShareModal > span:first-child + div > div.feedItem > div:first-child + div > div:first-child + div > div').remove();
	};
	  
	var setElementId = function (id) {
		currentElementId = id;
	}   
	var shareFeed = function( btnObject ) {
		var shareId = 'me';
		var commentText = j$('#ShareEditablearea').val();
		if (j$( '.shareWithAnchor' ).text() == 'A Group') {
			if (j$('.groupSelect').val() == 'none') {
				j$('.groupSelect').focus();
				shareId = 'none';
			} else {
				shareId = j$( '.groupSelect').val();
			}
		} 
		if (shareId != 'none') {
			if (collab_controllerReferenceId == collab_userId) {
				j$( '.loadingNewPost').addClass('active');
			}
			j$('#CollabShareModal').dialog('close');
			Visualforce.remoting.Manager.invokeAction(                
				_RemotingCollabActions.shareFeedElement, 
				elementId,
				shareId,
				commentText,
				function(result, event){
					if(event.status){
						j$('.collabFeedWrapper > div:first-child').after(getFeedElementHtml(result));
						j$( '.loadingNewPost').removeClass('active');
						returnElement.focus();
						bindFeedEvents();
					}
				}, 
				{escape:false,buffer:false}
		   );
		}
		return false;
	}
	var postFeed = function( btnObject ) {
		var subjectId = collab_controllerReferenceId;
		if (j$( '.postToAnchor > span' ).text() == 'A Group') {
			subjectId = j$( '.groupSelectMain').val();
		}
		if (j$('#TextPublisherEditableArea').parent().hasClass('default')) {
			j$( '.loadingNewPost').removeClass('active');
			j$('#TextPublisherEditableArea').focus();
		} else {
			var feedText = j$('#TextPublisherEditableArea').val();
			Visualforce.remoting.Manager.invokeAction(                
					 _RemotingCollabActions.postTextFeedElement,
					 comID,
					 subjectId,
					 feedText ,
					 function(result, event){
						 if(event.status){
							j$('.collabFeedWrapper > div:first-child').after(getFeedElementHtml(result));
							j$( '.loadingNewPost').removeClass('active');
							bindFeedEvents();
						 } else {
							alert('event.message');
							alert(event.message);
							j$( '.loadingNewPost').removeClass('active');
						 }
					 }, 
				 {escape:false,buffer:false}
			);
			j$( '#TextPublisherEditableArea' ).val( '' ).blur();
		}
	};

	var likeFeedElement = function( communityId, feedItemId, anchorObject, likes){
		Visualforce.remoting.Manager.invokeAction(
			_RemotingCollabActions.likeFeedElement,
			comID,
			feedItemId,
			function(result, event){
				if(event.status){
					var collabLike = j$(anchorObject).parent().parent().parent().parent().next().find('.collabLike');
					if (collabLike.hasClass('active')) {
						if (likes > 1) {
							collabLike.find('span').text('You, ' + collabLike.text());
						} else {
							collabLike.find('span').text('You and ' + collabLike.text());
						}
					} else {
						collabLike.addClass('active')
					}
					j$(anchorObject).parent().removeClass('active');
					j$(anchorObject).parent().next().find('a').attr('onclick','unLikeElement(null, \'' + result.id + '\', this, ' + (likes + 1) + ')');
					j$(anchorObject).parent().next().find('a').attr('title','Stop liking this post');
					j$(anchorObject).parent().next().addClass('active');
					j$(anchorObject).parent().next().find('a').focus();
				}
				return false;
			},
			{escape:false,buffer:false}
		);
		return false;
	};

	var likeComment = function( communityId, commentId, anchorObject ){
		Visualforce.remoting.Manager.invokeAction(
				_RemotingCollabActions.likeComment,
				comID,
				commentId,
				function(result, event){
					if(event.status){
						j$(anchorObject).parent().removeClass('active');
						j$(anchorObject).parent().next().addClass('active');
						j$(anchorObject).parent().next().find('a').attr('onclick','unLikeComment(null, \'' + result.id + '\', this)');
						j$(anchorObject).parent().next().find('a').attr('title','Stop liking this comment');
						var totalLikes = j$(anchorObject).parent().next().next();
						if (totalLikes.hasClass('active')) {
							numberOfPeople = parseInt(totalLikes.find('a').text().substring(0, totalLikes.find('a').text().indexOf(' '))) + 1;
							totalLikes.find('a').text(numberOfPeople + ' people');
						} else {
							totalLikes.addClass('active');
						}
						j$(anchorObject).parent().next().find('a').focus();
					}
					return false;
				},
			{escape:false,buffer:false}
		);
		return false;
	};
	
	var unLikeComment = function( communityId, likeId, anchorObject ){
		Visualforce.remoting.Manager.invokeAction(
				_RemotingCollabActions.unLikeElement,
				comID,
				likeId,
				function(result, event){
					if(event.status){
						j$(anchorObject).parent().removeClass('active');
						j$(anchorObject).parent().prev().addClass('active');
						j$(anchorObject).parent().prev().find('a').focus();
						var totalLikes = j$(anchorObject).parent().next();
						if (totalLikes.find('a').text().substring(0, totalLikes.find('a').text().indexOf(' ')) > 1) {
							if (totalLikes.find('a').text().substring(0, totalLikes.find('a').text().indexOf(' ')) > 2) {
								numberOfPeople = parseInt(totalLikes.find('a').text().substring(0, totalLikes.find('a').text().indexOf(' '))) - 1;
								totalLikes.find('a').text(numberOfPeople + ' people');
							} else {
								totalLikes.find('a').text('1 person');
							}
						} else {
							totalLikes.removeClass('active');
						}
						j$(anchorObject).parent().prev().find('a').focus();
					}
					return false;
				},
			{escape:false,buffer:false}
		);
		return false;
	};
	
	var unLikeElement = function( communityId, likeId, anchorObject, likes ){
		Visualforce.remoting.Manager.invokeAction(
				_RemotingCollabActions.unLikeElement,
				comID,
				likeId,
				function(result, event){
					if(event.status){
							var collabLike = j$(anchorObject).parent().parent().parent().parent().next().find('.collabLike');
						if (likes == 1) {
							collabLike.removeClass('active');
						} else if (likes == 2) {
							collabLike.find('span').text(collabLike.text().replace('You and ',''));
						} else {
							collabLike.find('span').text(collabLike.text().replace('You, ',''));
						}
						j$(anchorObject).parent().removeClass('active');
						j$(anchorObject).parent().prev().addClass('active');
						j$(anchorObject).parent().prev().find('a').focus();
						return false;
					}
				},
			{escape:false,buffer:false}
		);
		return false;
	};

	var postFeedComment = function( communityId, feedItemId, btnObject ){
		var commentText = j$( btnObject ).siblings( 'textarea' ).val();
		if (commentText == '' && j$(btnObject).prev().prev().prev().prev().hasClass('active')) {
			j$( btnObject ).siblings( 'textarea' ).focus();
		} else {
			j$(btnObject).parent().parent().removeClass('active');
			j$( btnObject ).siblings( 'textarea' ).val('');
			//console.log('loadingComment' + feedItemId);
			j$('.loadingComment' + feedItemId).addClass('active');
			if (j$(btnObject).prev().prev().prev().prev().hasClass('active')) {
				if( j$.trim( commentText ).length > 0 ) {
						Visualforce.remoting.Manager.invokeAction(
							_RemotingCollabActions.postFeedComment,
								comID,
								feedItemId,
								commentText,
								function(result, event){
										if(event.status){
											 j$(btnObject).parent().parent().prev().find('.collabComments').find('.newCollabCommentPlaceholder').before(getCommentHtml(result));
											 j$(btnObject).parent().parent().prev().find('.collabComments').find('.newCollabCommentPlaceholder').addClass('active');
											bindFeedEvents();
										}
										j$('.loadingComment' + feedItemId).removeClass('active');
									},
								{escape:false,buffer:false}
						);
				}
			} else {
				j$(btnObject).prev().prev().prev().prev().addClass('active');
				j$(btnObject).parent().parent().removeClass('active');
				if(j$(btnObject).prev().prev().hasClass('active')) {
					j$(btnObject).prev().prev().removeClass('active');
					//var docId = j$(btnObject).prev().prev().data('doc_id');
					var docId = j$(btnObject).next().next().text();
					
					j$('[id$=hiddenFileName]').val(feedItemId);
					j$('[id$=hiddenFileText]').val(commentText);
					//console.log('id: ' + existingCommentId);
					j$('[id$=hiddenFileId]').val(existingCommentId);
					postCommentWithExistingFile();
					currentCommentPlaceholder = j$(btnObject).parent().parent().prev().find('.collabComments').find('.newCollabCommentPlaceholder')
				} else {
					j$(btnObject).prev().removeClass('active');
					var input = j$(btnObject).prev().find('.collabCommentFile')[0];
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
						j$('[id$=hiddenFileString]').val((new sforce.Base64Binary(e.target.result)).toString());
						j$('[id$=hiddenFileName]').val(this.file.name);
						j$('[id$=hiddenFileType]').val(this.file.type);
						j$('[id$=hiddenFileText]').val(commentText);
						j$('[id$=hiddenFileId]').val(feedItemId);
						postCommentWithNewFile();
						currentCommentPlaceholder = j$(btnObject).parent().parent().prev().find('.collabComments').find('.newCollabCommentPlaceholder');
						}

						reader.readAsBinaryString(f);
					}
				}
			}
		}
		return false;
	};
	var post = function(btnObject) {
		if (j$( '.postToAnchor > span' ).text() == 'A Group' && j$('.groupSelectMain').val() == 'none') {
			j$('.groupSelectMain').focus();
			alert('If group is selected you must specify a specific group to make a post.');
		} else {
			if (j$('.collabWrapper > div.post').hasClass('active')) {
				if (j$('#TextPublisherEditableArea').val().length > 1000) {
					alert('You have exceeded the maximum character count of 1000 characters per post');
					j$('#TextPublisherEditableArea').focus();
				} else {
					j$( '.loadingNewPost').addClass('active');
					postFeed(btnObject);
				}
			} else if (j$('.collabWrapper > div.link').hasClass('active')) {
				if (j$('#LinkPublisherEditableArea').val().length > 1000) {
					alert('You have exceeded the maximum character count of 1000 characters per post');
					j$('#LinkPublisherEditableArea').focus();
				} else {
					j$( '.loadingNewPost').addClass('active');
					postLink(btnObject);
				}
			} else if (j$('.collabWrapper > div.file').hasClass('active')) {
				if (j$('#TextPublisherEditableArea').val().length > 1000) {
					alert('You have exceeded the maximum character count of 1000 characters per post');
					j$('#TextPublisherEditableArea').focus();
				} else {
					j$( '.loadingNewPost').addClass('active');
					uploadFile();
				}
			}
		}
		return false;
	}
	var postLink = function( btnObject ){
		var linkPost = j$( '#linkPost' );
		var text;
		if (j$('#LinkPublisherEditableArea').parent().hasClass('default')) {
			text = '';
		} else {
			text = j$( '#LinkPublisherEditableArea' ).val().trim();
		}    
		var linkName = linkPost.find( '#urlName' ).val().trim();
		var linkUrl = linkPost.find( '#url' ).val().trim();
		
		var subjectId = collab_controllerReferenceId;
		if (j$( '.postToAnchor > span' ).text() == 'A Group') {
			subjectId = j$( '.groupSelectMain').val();
		}

		if( verifyURL(linkUrl) == false ) {
			alert( 'This link is invalid' );
			j$( '.loadingNewPost').removeClass('active');
		} else {
			Visualforce.remoting.Manager.invokeAction(                
					_RemotingCollabActions.postLinkFeedElement,
					 comID,
					 subjectId,
					 text,
					 linkName,
					 linkUrl,
					 function(result, event){
						 if(event.status){
							j$('.collabFeedWrapper > div:first-child').after(getFeedElementHtml(result));
							j$( '.loadingNewPost').removeClass('active');
							bindFeedEvents();
						 } else {
							alert(event.message);
							j$( '.loadingNewPost').removeClass('active');
						 }
					 },
				   {escape:false,buffer:false}
			);
			linkPost.find( '#LinkPublisherEditableArea' ).val('');
			linkPost.find( '#urlName' ).val('');
			linkPost.find( '#url' ).val('http://');
			j$('.collabWrapper ul li a.link').removeClass('active');
			j$('.collabWrapper > div.link').removeClass('active');
			j$('.post').addClass('active');
			j$('.collabWrapper ul li a.link').parent().removeClass('carrot');
			j$('.collabWrapper ul li a.active').parent().addClass('carrot');
		}
	};
	
	var deleteFeedElement = function(feedElementId, object) {
		var element;
		//console.log('in==deleteFeedElement=====');
		//console.log('in==object====='+object);
		if (j$(object).closest('.feedItem').next('.feedItem').length > 0) {
			element = j$(object).closest('.feedItem').next('.feedItem').find('.collabFeedItemHeader > a:first-child');
		} else if (j$(object).closest('.feedItem').prev('.feedItem').length > 0) {
			element = j$(object).closest('.feedItem').prev('.feedItem').find('.collabFeedItemHeader > a:first-child');
		} else {
			element = j$('#PostToFeedButton');
		}
		//tabables.eq(index + 1).focus();
		Visualforce.remoting.Manager.invokeAction(
			_RemotingCollabActions.deleteFeedElement,
				comID,
				feedElementId,
				function(result, event){
						if(event.status){
							element.focus();
							j$('.feedItem' + feedElementId).remove();
						   // return false;
							//console.log('result=====',result);
							var deleteMessage = collab_DeleteFeedElement;
							var titleMessage = collab_AlertHeaderLabel;
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
						 window.location.reload();
						 return false;
						 } else {
							alert(event.message);
							j$(object).focus();
							return false;
						 }
					},
				{escape:false,buffer:false}
				
		);
		return false;
	}
	
	var deleteComment = function(commentId, object) {
		var comment = j$(object).closest('.singleComment');
		var focusElement;
		if(comment.next().hasClass('singleComment')) {
			focusElement = comment.next().find('div:first-child > a.userPhoto');
		} else if(comment.prev().hasClass('singleComment')) {
			focusElement = comment.prev().find('div:first-child > a.userPhoto');
		} else {            	
			//focusElement = comment.nextAll('.newCollabCommentPlaceholder').find('textarea').focus();
		}
		Visualforce.remoting.Manager.invokeAction(
			_RemotingCollabActions.deleteComment,
				comID,
				commentId,
				function(result, event){
						if(event.status){
							j$('.comment' + commentId).remove();
							//focusElement.focus();
						 }
					},
				{escape:false,buffer:false}
		);
		return false;
	}

	var removeBookmark = function(feedElementId, anchorObject) {
		Visualforce.remoting.Manager.invokeAction(
			_RemotingCollabActions.removeBookmark,
				comID,
				feedElementId,
				function(result, event){
						if(event.status){
							 j$(anchorObject).parent().parent().prev().removeClass('active');
							 j$(anchorObject).next().addClass('active');
							 j$(anchorObject).removeClass('active');
						 }
					},
				{escape:false,buffer:false}
		);
		return false;
	}
	
	var search = function() {
		searching = true;
		j$( '.loadingCollabFeed').addClass('active');
		j$( '.collabFeedWrapper').removeClass('active');
		j$('#collabContainer').collapse('show');
		refreshFeeds();
		return false;
	};
	
	var cancelSearch = function() {
		j$('.searchCollabFeeds').val('');
		if(searching == true) {
			j$( '.loadingCollabFeed').addClass('active');
			j$( '.collabFeedWrapper').removeClass('active');
			searching = false;
			refreshFeeds();
		}
		return false;
	};
	
	var addBookmark = function(feedElementId, anchorObject) {
		Visualforce.remoting.Manager.invokeAction(
			_RemotingCollabActions.addBookmark,
				comID,
				feedElementId,
				function(result, event){
						if(event.status){
							 j$(anchorObject).parent().parent().prev().addClass('active');
							 j$(anchorObject).prev().addClass('active');
							 j$(anchorObject).removeClass('active');
						 }
					},
				{escape:false,buffer:false}
		);
		return false;
	}
	var verifyURL = function( url ) {
		var retURL = url.trim().toUpperCase();
		return (retURL.length > 0 &&
				retURL !== 'HTTP:' &&
				retURL !== 'HTTPS:' &&
				retURL !== 'HTTP:/' &&
				retURL !== 'HTTPS:/' &&
				retURL !== 'HTTP://' &&
				retURL !== 'HTTPS://' );
	};
	
	var resetPostFile = function() {
		closeFileClickHandler();
		Visualforce.remoting.Manager.invokeAction(
			_RemotingCollabActions.getElementInfo,
				comID,
				j$('#FieldElementIdContainer').text(),
				function(result, event){
						if(event.status){
							//console.log('success');
							//console.log(result);
							j$('.collabFeedWrapper > div:first-child').after(getFeedElementHtml(result));
							j$( '.loadingNewPost').removeClass('active');
							bindFeedEvents();
						 } else {
							alert(event.message);
						 }
					},
				{escape:false,buffer:false}
		);
	}
	
	var resetCommentFile = function() {
		Visualforce.remoting.Manager.invokeAction(
			_RemotingCollabActions.getCommentInfo,
				comID,
				j$('#FieldElementIdContainer').text(),
				function(result, event){
						if(event.status){
							currentCommentPlaceholder.before(getCommentHtml(result));
							currentCommentPlaceholder.addClass('active');
							currentCommentPlaceholder.next().removeClass('active');
							bindFeedEvents();
							resetFileField(currentCommentPlaceholder.parent().parent().next().find('.collabCommentFile'));
						 }
					},
				{escape:false,buffer:false}
		);
	}
	
	function uploadFile()
	{    
		var text;
		if (j$('#ContentPublisherEditableArea').parent().hasClass('default')) {
			text = '';
		} else {
			text =j$('#ContentPublisherEditableArea').val();
		}   
		
		var subjectId = collab_controllerReferenceId;
		if (j$( '.postToAnchor > span' ).text() == 'A Group') {
			subjectId = j$( '.groupSelectMain').val();
		}
		   
		if(existingId == '') {
			var input = document.getElementById('CollabFile');
		
			var filesToUpload = input.files;
			var passThrough = false;
			for(var i = 0, f; f = filesToUpload[i]; i++)
			{
				passThrough = true;
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
					j$('[id$=hiddenFileString]').val((new sforce.Base64Binary(e.target.result)).toString());
					j$('[id$=hiddenFileName]').val(this.file.name);
					j$('[id$=hiddenFileType]').val(this.file.type);
					j$('[id$=hiddenFileText]').val(text);
					postNewFile();
				};
				reader.readAsBinaryString(f);
			}
			if(!passThrough) {
				j$( '.loadingNewPost').removeClass('active');
				j$('#collabLinkFileAction').focus();
			} else {
				j$('#ContentPublisherEditableArea').val('');
				j$('.file').removeClass('active');
				j$('.post').addClass('active');
				j$('.collabWrapper ul li a.file').parent().removeClass('carrot');
				j$('.collabWrapper ul li a.active').parent().addClass('carrot');
			}
		} else {
			j$('[id$=hiddenFileText]').val(text);
			j$('[id$=hiddenFileId]').val(existingId);
			postExistingFile();
		}
	};
	var populateCollabSharingModal = function(did) {
		documentId = did;
		populateSharingModal();
		return false;
	}
	
	/*-- : added function to close create comment*/
	var deleteCreateComment = function(commentId,object) {
		//console.log('commentId'+commentId);
		//console.log('In deleteion');
		//console.log('object '+object);
		j$('.createComment'+ commentId).removeClass('active');
	}
	