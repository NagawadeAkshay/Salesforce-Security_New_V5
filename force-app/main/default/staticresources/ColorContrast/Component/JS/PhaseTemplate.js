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
 var handleDateTimePicker = function(){			
	 var input = j$("#datetimepickerid").datetimepicker();
}       
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
		j$(".sidebar-wrapper").toggleClass("sidebar-toggled-2"); // Add for Header & footer collapse image
		j$("#govGrantsFooterImagePlaceHoldersId").toggleClass("hidden");               
        j$("#govGrantsFooterImagePlaceHolderHalfId").toggleClass("hidden"); 
        j$("#govGrantsHeaderImagePlaceHolderId").toggleClass("hidden");               
        j$("#govGrantsHeaderImagePlaceHolderHalfId").toggleClass("hidden");
		j$('#menu ul').hide(); 
		j$('.panel-sidebar .sidebar-label').toggleClass("hidden"); 
		j$('.panel-sidebar .panel-body').toggleClass("hidden");                              
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
	//console.log('=-===for sidebar height======');
	/*var headerDivHeight = j$(window).height();
	var screenHeight = window.innerHeight;
	//console.log('screenHeight :',screenHeight);
	var navBarHeight = j$('.navbar').height();
	var sidebarHeight = 100-((navBarHeight/screenHeight)*100);
	j$('#sidebar-wrapper').css('height',sidebarHeight-2+'%');*/	
		
	
	var headerDivHeight = j$(window).height();
	var screenHeight = window.innerHeight;
	var navBarHeight = j$('nav.navbar.navbar-default.navbar-fixed-top .container-fluid').height();	
	/*var sidebarHeight = 100-((navBarHeight/screenHeight)*100);	
	j$('#sidebar-wrapper').css('height',sidebarHeight-5 +'%'); */
	
	//console.log('headerDivHeight: ',headerDivHeight);
	//console.log('screenHeight: ',screenHeight);
	//console.log('navBarHeight: ',navBarHeight);
	
	var sidebarLogoHeight = j$('#sidebar-logo-wrapper').height();
	//console.log('sidebarLogoHeight :',sidebarLogoHeight);
	var sidebarHeight = screenHeight-navBarHeight-sidebarLogoHeight;	
	//console.log('sidebarHeight: ',sidebarHeight);
	j$('#sidebar-wrapper-logo').css('height',sidebarHeight+'px');
	
}

j$(document).ready(function(){        
	adjustToggleBarHeightUI();
	sideBarHeightUI();
	initMenu();
	j$(window).on('resize', function() {
		adjustToggleBarHeightUI();
		sideBarHeightUI();
	});
	
			   
}); 
