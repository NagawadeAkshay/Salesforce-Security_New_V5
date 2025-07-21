//Remove cookie related to Sidebar accordion menu last clicked
var j$ = jQuery.noConflict();
j$(document).ready(function() {        
	//UI=-Shrawan-11052015  Moved from PageTemplate for better performance
	j$('#SidebarCtrlId').css('width', j$('#CollabMenu').width());
	j$('#SidebarCtrlId > a').hide();
	j$('#sidebarChevron').removeClass("fa-chevron-left");
	j$('#sidebarChevron').removeClass("fa-chevron-right");
	j$('#sideBarDivId').hide();
	//End
	j$('html').attr('lang', 'en');
	j$('.profilePicture').attr('alt', '');
	j$.cookie('apex__'+collab_UserId+collab_previousTabName,null);
	if(collab_collabTab == 'feed') {
		j$('.collabMenuOption.feed').addClass('active');
	} else if(collab_collabTab == 'groups') {
		j$('.collabMenuOption.groups').addClass('active');
	} else if(collab_collabTab == 'colleagues') {
		j$('.collabMenuOption.colleagues').addClass('active');
	} else if(collab_collabTab == 'communityUsers') {
		j$('.collabMenuOption.communityUsers').addClass('active');
	} else if(collab_collabTab == 'files') {
		j$('.collabMenuOption.files').addClass('active');
	} else if(collab_collabTab == 'files') {
		j$('.collabMenuOption.files').addClass('active');
	}
	j$('.ui-dialog-titlebar-close').remove();
	j$('.collabSidebarToggleContainer.sidebarToggleContainer').click(function() {
		if ( j$('#CollabMenu > div:first-child').hasClass('active')) {
			j$('#CollabMenu > div, #CollabMenu > ul').removeClass('active');
			j$(this).css('top','0px');
			j$(this).removeClass('open');
		} else {
			j$('#CollabMenu > div, #CollabMenu > ul').addClass('active');
			j$(this).css('top', '-57px');
			j$(this).addClass('open');
		}
		return false;
	});
	j$('#CollabMenu .collabMenuOption .collabSubMenuOption > a').click(function() {		
		if(!j$(this).parent().hasClass('active')) {			
			j$('#CollabMenu .collabMenuOption .collabSubMenuOption').removeClass('active');
			j$(this).parent().addClass('active');
		}
		return false;
	});
	adjustContentHeight();
	j$(window).on('resize', function() {
		adjustContentHeight();
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
j$('#appDropDown, #profileDropDown').click(function() {             
	j$(".btn-group").toggleClass("open");	
});
j$('#CollabMenu li a').click(function() {
	j$('#CollabMenu li').removeClass('active');
	j$(this).parent().addClass('active');
}); 
j$("#menu-toggle").click(function(e) {
	e.preventDefault();
	j$(".wrapper").toggleClass("toggled");                  
	j$('.panel-sidebar .sidebar-label').toggleClass("hidden"); 
	j$('.panel-sidebar .panel-body').toggleClass("hidden");  
	
});
j$("#menu-toggle-2").click(function(e) {
	e.preventDefault();
	j$(".wrapper").toggleClass("toggled-2");
	j$("#toggle-div").toggleClass("expand-icon-div");
	j$(".sidebar-wrapper").toggleClass("sidebar-toggled-2");
	j$("#govGrantsFooterImagePlaceHoldersId").toggleClass("hidden");               
    j$("#govGrantsFooterImagePlaceHolderHalfId").toggleClass("hidden"); 
    j$("#govGrantsHeaderImagePlaceHolderId").toggleClass("hidden");               
    j$("#govGrantsHeaderImagePlaceHolderHalfId").toggleClass("hidden");
	j$('#menu ul').hide(); 
	j$('.panel-sidebar .sidebar-label').toggleClass("hidden"); 
	j$('.panel-sidebar .panel-body').toggleClass("hidden"); 
	// j$('#CollabMenu').toggleClass("hidden");  
	// j$('.collabContainer').toggleClass("removePaddingCollab");                            
});
function adjustContentHeight(){
	var windowHeight = j$(window).height();
	var headerDivHeight = j$('.headerDiv').height();
	var footerDivHeight = j$('.footerDiv').height();
	var remainingWindowHeight = windowHeight - headerDivHeight - footerDivHeight;          
}