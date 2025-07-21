var toggleFlag = phaseTemplate_hideSidebar;
var j$ = jQuery.noConflict();   	 
/* UI-Shrawan-10092015  Moved sidebar expand/collapse logic to PageTemplate */

//Date Picker
var handleDatePicker = function(){   
	var input = j$("[class$='datepicker']");
	input.datepicker().on('changeDate', function(ev){
		input.datepicker('hide');
	});  
	j$('.dateFormat').hide();
}  
function setCollapseIcon(elementId){	
	//console.log('======CollapseIcon Entered Phase Template=========',elementId);
	j$('#'+elementId).find("span.togglePageBlock ").toggleClass('fa-caret-down fa-caret-up');
	//console.log('========ValueInCollapse===',j$('#'+elementId).find("span.togglePageBlock "));
}   
 var handleDateTimePicker = function(){			
	 var input = j$("#datetimepickerid").datetimepicker();
}       
j$("#menu-toggle").click(function(e) {
		e.preventDefault();
		j$(".wrapper").toggleClass("toggled");                  
		j$('.panel-sidebar .sidebar-label').toggleClass("hidden"); 
		j$('.panel-sidebar .panel-body').toggleClass("hidden");          
		j$('.panel-collapse .panel-body').toggleClass("hidden");
});
j$("#menu-toggle-2").click(function(e) {
		e.preventDefault();
		j$(".wrapper").toggleClass("toggled-2");
		j$("#toggle-div").toggleClass("expand-icon-div");
		j$(".sidebar-wrapper").toggleClass("sidebar-toggled-2"); // Add for Header & footer collapse image
		j$("#govGrantsFooterImagePlaceHoldersId").toggleClass("hidden");               
        j$("#govGrantsFooterImagePlaceHolderHalfId").toggleClass("hidden"); 
        j$("#govGrantsHeaderImagePlaceHolderId").toggleClass("hidden");               
        j$("#govGrantsHeaderImagePlaceHolderHalfId").toggleClass("hidden");
		j$('#menu ul').hide(); 
		j$('.panel-sidebar .sidebar-label').toggleClass("hidden"); 
		j$('.panel-sidebar .panel-body').toggleClass("hidden");                              
		j$('.panel-collapse .panel-body').toggleClass("hidden");
});

function initMenu() {
		j$('#menu ul').hide();
		j$('#menu ul').children('.current').parent().show();
		//j$('#menu ul:first').show();
		j$('#menu li a').click(
				function() {
						var checkElement = j$(this).next();
						if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
								return false;
						}
						if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
								j$('#menu ul:visible').slideUp('normal');
								checkElement.slideDown('normal');
								return false;
						}
				}
		);
}
function sideBarHeightUI() {
	var headerDivHeight = j$(window).height();
	var screenHeight = window.innerHeight;
	var navBarHeight = j$('.navbar.navbar-default.navbar-fixed-top').height();	
	var sidebarHeight = screenHeight-navBarHeight;
	j$('#sidebar-wrapper').css('height',sidebarHeight+'px');	
	j$('#PageTemplateApp').css('padding-top',navBarHeight+'px');
}

function sideBarMenuCollapse() {
	if(j$(window).width() < 739) {
		//console.log('window size : ',j$(window).width());
		j$(".wrapper").toggleClass("toggled-2");
		j$(".sidebar-wrapper").toggleClass("sidebar-toggled-2");
		j$('#menu ul').show(); 
		j$('.panel-sidebar .sidebar-label').toggleClass("hidden"); 
		j$('.panel-sidebar .panel-body').toggleClass("hidden"); 
		j$('.panel-collapse .panel-body').toggleClass("hidden");
	}
}

j$(document).ready(function(){  
document.title = pageTitle ;       
      
	adjustToggleBarHeightUI();
	sideBarMenuCollapse();
	sideBarHeightUI();
	initMenu();
	j$(window).on('resize', function() {
		adjustToggleBarHeightUI();
		sideBarHeightUI();
	});
	
	//j$('#myTabbedContent').on('hidden.bs.collapse', toggleChevron);
	//j$('#myTabbedContent').on('shown.bs.collapse', toggleChevron);
			   
}); 
/*function toggleChevron(e) {
	j$(e.target)
	.prev('.panel-heading')
	.find("span.togglePageBlock ")
	.toggleClass('fa fa-caret-down fa fa-caret-up');
}*/
//User Story 114986: Internal - Remove page loading resources for page loading time improvement - from loading icon
/*
document.onreadystatechange = function () {
	if (document.readyState === 'complete') {
		hideLoadingPopUp();
	}
}*/

