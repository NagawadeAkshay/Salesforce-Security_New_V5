
var pageTitleName;
var lookupIconTitle;
var tabName = j$.cookie('apex__govgrants_tabname');
var getActiveAppNameFromCookie = function(){
	var currentAppName = j$.cookie('apex__current_AppName');
	if(!currentAppName){
		return 'Default App';
	}
	return currentAppName;
}
var cookieName = j$.cookie('apex__'+getActiveAppNameFromCookie().replace(/\s/g, "")); 
if(cookieName){
	pageTitleName = cookieName.split(':')[1];
}else{
	var appName = j$.cookie('apex__current_AppName');
	if(appName == 'Admin'){
		pageTitleName = 'Setup';    
	}else{
		pageTitleName = 'Home'; 
	}
}

var j$ = jQuery.noConflict();
j$(document).ready(function() {
	document.title = pageTitleName;
	//toggleSidebarCtrl();   // UI-Shrawan-10022015
});
function setPageTitle(myPageTitle) {
	pageTitleName = myPageTitle;
}
var toggleFlag = modalTemplate_hideSidebar;

j$(document).ready(function(){
	activateFirstTab();
	buildTitileforLookupInputIcon();
	buildLookupIcon();
	buildRequiredInput();
	handleDateTimePicker ();
	handleDatePicker(); 
	assignSideBarIcon();
	adjustToggleBarHeightUI();
	j$(window).on('resize', function() {
		adjustToggleBarHeightUI();
	});
});
function assignSideBarIcon(){
	if(tabName == 'Collab'){
		j$('#SidebarCtrlId > a').hide();
		j$('#sideBarDivId').hide();
		j$('#body').removeClass();
		j$('#body').addClass('col-md-12');
	}
	else{
		j$('#SidebarCtrlId').css('width', 'auto');
		j$('#body').removeClass();
		j$('#body').addClass('col-md-10');   
		j$('#SidebarCtrlId > a').show();
		j$('#sideBarDivId').show();   
		if(toggleFlag == false){
			j$('#SidebarCtrlId i').addClass('fa-chevron-circle-right');
		}
		else{
			j$('#SidebarCtrlId i').addClass('fa-chevron-circle-left');
		}
		//toggleSidebar();
	}
}
function adjustToggleBarHeight(){}   /* UI-Shrawan-10092015  Modified for new UI */
function adjustToggleBarHeightUI(){ /* UI-Shrawan-10092015  Added for new UI */
	var windowHeight = j$(window).height();
	var headerDivHeight = j$('.headerDiv').height();
	var footerDivHeight = j$('.footerDiv').height();
	var remainingWindowHeight = windowHeight - headerDivHeight - footerDivHeight;
	var bodyDivHeight = 0;
	var bodyHeight = 0;
	var finalHeight = 0;
	if( j$('div#body').length ){
		bodyHeight = j$('div#body').height();
		finalHeight = Math.max( remainingWindowHeight, (headerDivHeight + bodyHeight), j$('#sidebarCell').height());
	}
	/*
	else if( j$('div#bodyDivId').length ){
	bodyDivHeight = j$('div#bodyDivId').height();
	finalHeight = Math.max( remainingWindowHeight, (headerDivHeight + bodyDivHeight), j$('#sidebarCell').height());
	}
	*/
	else{
		finalHeight = Math.max( remainingWindowHeight, j$('#sidebarCell').height());   
	}
	if(j$('div#bodyDivId').length){
		j$('div.panelDiv').css('height', '0px');    
	}
	else{
		j$('div.panelDiv').css('height', (headerDivHeight + finalHeight));    
	}
	//j$('div.panelDiv').css('height', (headerDivHeight + finalHeight));    
	j$('#sideBarDivId').css('min-height', finalHeight);
}
	/* ---This is the old function. Prem - updating on 4th April 2016
	function toggleSidebar(){
		if(toggleFlag == false){
			j$(window).on('resize', function() {
				j$('#SidebarCtrlId > a').css('width', (j$('#sidebarCell').width() - 3));
			});
			expandSideBar(expandedSidebarIconsCallback);                
		}
		else{
			j$(window).on('resize', function() {
				j$('#SidebarCtrlId > a').css('width', '55px');       
			});
			collapseSideBar(adjustSidebarWidth, collapsedSidebarIconsCallback);     
		}
		//pageTemplateAppHeightInPixel = document.getElementById('PageTemplateApp').clientHeight;
	} 
	*/
var activateFirstTab = function(){
//  j$('#topTabsID a:first').tab('show');
}  
var buildTitileforLookupInputIcon = function(){
	j$('.searchLookupInputIcon').each(function(){
		var currentNode = j$(this);
		currentNode[0].title = currentNode[0].className.replace('508Input searchLookupInputIcon','')
		currentNode[0].className = '508Input searchLookupInputIcon';
	});
}  
var buildLookupIcon = function(){
	j$('.lookupIcon').each(function(){
		var currentNode = j$(this);
        if(lookupIconTitle != undefined){
           currentNode.parent().append('<span class="fa fa-search" title="'+ lookupIconTitle+ '">'+'</span>');
         }else{
		currentNode.parent().append('<span class="fa fa-search"></span>');
      }
	});
}

var buildRequiredInput = function(){
	/*j$('.requiredInput').each(function(){
	j$(this).append('<i class="fa fa-minus fa-rotate-90 fa-lg"></i>');
	});*/
}
var buildCalendarPopUp = function(){
	j$('.dateFormat').each(function(){
		j$(this).before('<span class="fa fa-calendar"></span>');
	});
}

var activateDateTimePicker = function(){
	j$('.dateInput input').each(function(){
		j$(this).datetimepicker();
	});
} 

var addCloseHook = function(){
	j$('.dateInput input').change(function(){
		j$(this).data('DateTimePicker').hide();
	});
}
//Date Picker
/*     var handleDatePicker = function(){
	//console.log('')
	var input = j$("[class*='datepicker']");
	//console.log('input]]]]',input);
	input.datepicker().on('changeDate', function(ev){
		//console.log('j$(this)]]]]',j$(this));    
		j$(this).datepicker("hide");
	});  
	j$('.dateFormat').hide();
}  */

//Date Picker
var handleDatePicker = function(){
    let dateFormat;
          // Remoting through getting date format..
          Visualforce.remoting.Manager.invokeAction(
              _RemotingModalTemplateActions.getlocaleDateFormat
              ,function(result, event){
                  if (event.status) {
                      if(result){
                          dateFormat = formatDateTime(result,false);
                      }else{
                          dateFormat = 'd/m/Y';
                      }
	var input = j$("[class$='datepicker']").datetimepicker({
	format:dateFormat,
	timepicker:false,
	closeOnDateSelect:true});
	j$('.dateFormat').hide();
}  
              }
          );
}

var handleDateTimePicker = function(){
	let datetimeFormat;
	// Remoting through getting date format..
        Visualforce.remoting.Manager.invokeAction(
            _RemotingModalTemplateActions.getlocaleDateTimeFormat
            ,function(result, event){
                if (event.status) {
                    if(result){
                        datetimeFormat = formatDateTime(result,true);
                    }else{
                        datetimeFormat = 'd/m/Y h:i A';
                    }
	j$("[class*='datetimepicker']").datetimepicker({
		format:datetimeFormat              
	}); 
                }
            }
        );
}

// Function to format Date Time as per jquery...
function formatDateTime(dateTimeFormatVal,isdateTime){
	let finalFormat ='';

	let formatdateTimeMap = {'dd' : 'd', 'MM' : 'm', 'yyyy' : 'Y', 'M' : 'm', 'd' : 'd'};

	if(dateTimeFormatVal){
		let formatSplitList = dateTimeFormatVal.split(' ');
		if(formatSplitList.length > 0 ){
			let formlatVal = formatSplitList[0];
			let formAMPMVal = formatSplitList.length > 2?formatSplitList[2]:'';
			if(formlatVal !=''){
				if(formlatVal.indexOf('/') != -1 ){
					let formslashlist = formlatVal.split('/');
					if(formslashlist.length > 0){
						if(isdateTime){
							if( formAMPMVal !='' && formAMPMVal.indexOf('a') != -1){
								finalFormat = formatdateTimeMap[formslashlist[0]]+'/'+formatdateTimeMap[formslashlist[1]]+'/'+formatdateTimeMap[formslashlist[2]]+' h:i A';
							}else{
								finalFormat = formatdateTimeMap[formslashlist[0]]+'/'+formatdateTimeMap[formslashlist[1]]+'/'+formatdateTimeMap[formslashlist[2]]+' H:i';
							}								
						}else{
							finalFormat = formatdateTimeMap[formslashlist[0]]+'/'+formatdateTimeMap[formslashlist[1]]+'/'+formatdateTimeMap[formslashlist[2]];
						}
					}
				}else if(formlatVal.indexOf('.') != -1){
					let formslashlist = formlatVal.split('.');
					if(formslashlist.length > 0){
						if(isdateTime){
							if(formAMPMVal !='' && formAMPMVal.indexOf('a') != -1){
								finalFormat = formatdateTimeMap[formslashlist[0]]+'.'+formatdateTimeMap[formslashlist[1]]+'.'+formatdateTimeMap[formslashlist[2]]+' h:i A';
							}else{
								finalFormat = formatdateTimeMap[formslashlist[0]]+'.'+formatdateTimeMap[formslashlist[1]]+'.'+formatdateTimeMap[formslashlist[2]]+' H:i';
							}		
						}else{
							finalFormat = formatdateTimeMap[formslashlist[0]]+'.'+formatdateTimeMap[formslashlist[1]]+'.'+formatdateTimeMap[formslashlist[2]];	
						}
					}
				}else if(formlatVal.indexOf('-') != -1){
					let formslashlist = formlatVal.split('-');
					if(formslashlist.length > 0){
						if(isdateTime){
							if(formAMPMVal !='' && formAMPMVal.indexOf('a') != -1){
								finalFormat = formatdateTimeMap[formslashlist[0]]+'-'+formatdateTimeMap[formslashlist[1]]+'-'+formatdateTimeMap[formslashlist[2]]+' h:i A';
							}else{
								finalFormat = formatdateTimeMap[formslashlist[0]]+'-'+formatdateTimeMap[formslashlist[1]]+'-'+formatdateTimeMap[formslashlist[2]]+' H:i';
							}		
						}else{
							finalFormat = formatdateTimeMap[formslashlist[0]]+'-'+formatdateTimeMap[formslashlist[1]]+'-'+formatdateTimeMap[formslashlist[2]];
						}
					}	
				}				
			}
		}
	}
	return 	finalFormat;
}

function collapsedSidebarIcons(callback){       /* UI-Shrawan-10092015  Added for new UI */
	j$('.sidebarDivCls').css('visibility', 'hidden');
	j$('.SidebarAccordian').css('visibility', 'hidden');
	j$('.itemMainDivCls').css('visibility', 'hidden');
	var sideSearchAng = angular.element(document.getElementById("searchHdr"));
	if(sideSearchAng != null && typeof(sideSearchAng.scope()) != 'undefined') {
		sideSearchAng.scope().SidebarCollapsed = true;
		sideSearchAng.scope().updateSidebarCollapsed(toggleFlag);
	}
	var recentlyViewAng = angular.element(document.getElementById("recentlyViewedHeaderId"));
	if(recentlyViewAng != null && typeof(recentlyViewAng.scope()) != 'undefined'){
		recentlyViewAng.scope().recentlyViewedCollapsed = true;
		recentlyViewAng.scope().updateRecentlyViewedCollapsed(toggleFlag);
	}
	var usefulLinkAng = angular.element(document.getElementById("extLinkHeaderId"));
	if(usefulLinkAng != null && typeof(usefulLinkAng.scope()) != 'undefined'){
		usefulLinkAng.scope().externalLinksCollapsed = true;
		usefulLinkAng.scope().updateExternalLinkCollapsed(toggleFlag);
	}
	var sideMenuAngTask = angular.element(document.getElementById("headerIdTask"));
	if(sideMenuAngTask != null && typeof(sideMenuAngTask.scope()) != 'undefined'){
		sideMenuAngTask.scope().accordionCollapsed = true;
		sideMenuAngTask.scope().updateUserPreference(toggleFlag);
	}
	var sideMenuAngAct = angular.element(document.getElementById("headerIdActivity"));
	if(sideMenuAngAct != null && typeof(sideMenuAngAct.scope()) != 'undefined'){
		sideMenuAngAct.scope().accordionCollapsed = true;
		sideMenuAngAct.scope().updateUserPreference(toggleFlag);
	}
	var techSupAngt = angular.element(document.getElementById("headerId"));
	if(techSupAngt != null && typeof(techSupAngt.scope()) != 'undefined'){
		techSupAngt.scope().techSupportLinksCollapsed = true;
		techSupAngt.scope().updateTechnicalSupportLinkCollapsed(toggleFlag);
	}
	callback();
}
function collapsedSidebarIconsCallback(){
	j$('#searchHdr p').css({opacity: 1.0, visibility: "visible"}).animate({opacity: 0.1}, 350, function(){
		j$('#searchHdr').addClass('collapsedHeight');
		j$('#searchHdr p').css("visibility", "hidden");
		j$('#searchHdr p').css("opacity", "1.0");
		j$('#searchHdr p i').css({opacity: "1.0", visibility: "visible"});
		j$('.searchHeaderCls.SideBarMenuAppCollapsed').css('border-bottom', '0px');
	});
	j$('#searchHdr p i').animate({ fontSize : '20px' }, 400);
	j$('#searchHdr p i').css('cursor', 'pointer');
	j$('#recentlyViewedHeaderId p').css({opacity: 1.0, visibility: "visible"}).animate({opacity: 0.1}, 350, function(){
		j$('#recentlyViewedHeaderId').addClass('collapsedHeight');
		j$('#recentlyViewedHeaderId p').css("visibility", "hidden");
		j$('#recentlyViewedHeaderId p').css("opacity", "1.0");
		j$('#recentlyViewedHeaderId p i').css({opacity: "1.0", visibility: "visible"});
	});
	j$('#recentlyViewedHeaderId p i').animate({ fontSize : '20px' }, 400);
	j$('#recentlyViewedHeaderId p i').css('cursor', 'pointer');
	j$('#ExternalLinkApp p').css({opacity: 1.0, visibility: "visible"}).animate({opacity: 0.1}, 350, function(){
		j$('#ExternalLinkApp').addClass('collapsedHeight');
		j$('#ExternalLinkApp p.headerCls').css("visibility", "hidden");
		j$('#ExternalLinkApp p.headerCls').css("opacity", "1.0");
		j$('#ExternalLinkApp p.headerCls i').css({opacity: "1.0", visibility: "visible"});
	});
	j$('#ExternalLinkApp p.headerCls i').animate({ fontSize : '20px' }, 400);
	j$('#ExternalLinkApp p.headerCls i').css('cursor', 'pointer');
	j$('#SideBarMenuAppTask p').css({opacity: 1.0, visibility: "visible"}).animate({opacity: 0.1}, 350, function(){
		j$('#SideBarMenuAppTask').addClass('collapsedHeight');
		j$('#SideBarMenuAppTask p').css("visibility", "hidden");
		j$('#SideBarMenuAppTask p').css("opacity", "1.0");
		j$('#SideBarMenuAppTask p i').css({opacity: "1.0", visibility: "visible"});
	});
	j$('#SideBarMenuAppTask p i').animate({ fontSize : '20px' }, 400);
	j$('#SideBarMenuAppTask p i').css('cursor', 'pointer');
	j$('#SideBarMenuAppActivity p').css({opacity: 1.0, visibility: "visible"}).animate({opacity: 0.1}, 350, function(){
		j$('#SideBarMenuAppActivity').addClass('collapsedHeight');
		j$('#SideBarMenuAppActivity p').css("visibility", "hidden");
		j$('#SideBarMenuAppActivity p').css("opacity", "1.0");
		j$('#SideBarMenuAppActivity p i').css({opacity: "1.0", visibility: "visible"});
	});
	j$('#SideBarMenuAppActivity p i').animate({ fontSize : '20px' }, 400);
	j$('#SideBarMenuAppActivity p i').css('cursor', 'pointer');
	//  UI-Shrawan-11022015 Added for technical support
	j$('#TSLinkApp p').css({opacity: 1.0, visibility: "visible"}).animate({opacity: 0.1}, 350, function(){
		j$('#TSLinkApp').addClass('collapsedHeight');
		j$('#TSLinkApp p').css("visibility", "hidden");
		j$('#TSLinkApp p').css("opacity", "1.0");
		j$('#TSLinkApp p i').css({opacity: "1.0", visibility: "visible"});
	});
	j$('#TSLinkApp p i').animate({ fontSize : '20px' }, 400);
	j$('#TSLinkApp p i').css('cursor', 'pointer');
}
function expandedSidebarIcons(callback){    /* UI-Shrawan-10092015  Added for new UI */
	j$('#searchHdr p').css({opacity: 0.1, visibility: "visible"}).animate({opacity: 1.0}, 700);
	j$('#searchHdr p i').animate({ fontSize : '14px' }, 300);
	j$('#searchHdr p i').css('cursor', 'default');
	j$('.searchHeaderCls.SideBarMenuAppCollapsed').css('border-bottom', '1px solid #cfd6e6');

	j$('#recentlyViewedHeaderId p').css({opacity: 0.1, visibility: "visible"}).animate({opacity: 1.0}, 700);
	j$('#recentlyViewedHeaderId p i').animate({ fontSize : '14px' }, 300);
	j$('#recentlyViewedHeaderId p i').css('cursor', 'default');

	j$('#ExternalLinkApp p.headerCls').css({opacity: 0.1, visibility: "visible"}).animate({opacity: 1.0}, 700);
	j$('#ExternalLinkApp p.headerCls i').animate({ fontSize : '14px' }, 300);
	j$('#ExternalLinkApp p.headerCls i').css('cursor', 'default');

	j$('#SideBarMenuAppTask p').css({opacity: 0.1, visibility: "visible"}).animate({opacity: 1.0}, 700);
	j$('#SideBarMenuAppTask p i').animate({ fontSize : '14px' }, 300);
	j$('#SideBarMenuAppTask p i').css('cursor', 'default');

	j$('#SideBarMenuAppActivity p').css({opacity: 0.1, visibility: "visible"}).animate({opacity: 1.0}, 700);
	j$('#SideBarMenuAppActivity p i').animate({ fontSize : '14px' }, 300);
	j$('#SideBarMenuAppActivity p i').css('cursor', 'default');

	//  UI-Shrawan-11022015 Added for technical support
	j$('#TSLinkApp p').css({opacity: 0.1, visibility: "visible"}).animate({opacity: 1.0}, 700);
	j$('#TSLinkApp p i').animate({ fontSize : '14px' }, 300);
	j$('#TSLinkApp p i').css('cursor', 'default');

	callback();
}
function expandedSidebarIconsCallback(){
	j$('#searchHdr').removeClass('collapsedHeight');
	j$('#recentlyViewedHeaderId').removeClass('collapsedHeight');
	j$('#ExternalLinkApp').removeClass('collapsedHeight');
	j$('#SideBarMenuAppTask').removeClass('collapsedHeight');
	j$('#SideBarMenuAppActivity').removeClass('collapsedHeight');
	j$('#TSLinkApp').removeClass('collapsedHeight');
	j$('.sidebarDivCls').css({opacity: 0.1, visibility: "visible"}).animate({opacity: 1.0}, 700);
	j$('.SidebarAccordian').css({opacity: 0.1, visibility: "visible"}).animate({opacity: 1.0}, 700);
	j$('.itemMainDivCls').css({opacity: 0.1, visibility: "visible"}).animate({opacity: 1.0}, 700);
}
function collapseSideBar(callback1, callback2){   /* UI-Shrawan-10092015  Modified for new UI */
	toggleFlag = false;
	collapsedSidebarIcons(callback2);
	callback1();
}
function adjustSidebarWidth(){
	j$('#body').animate({width: '96%'}, 500);
	j$('#sideBarDivId').animate({width: '3%'}, 500, function(){
		j$('#SidebarCtrlId > a').animate({width: '2.8%'}, 500);
		j$('#SidebarCtrlId > a > i').toggleClass('down');
	});
	Visualforce.remoting.Manager.invokeAction(
		_RemotingModalTemplateActions.hideUserSideBarPreference
		,function(result, event){}
	);    
	//j$('#sideBarDivId').hide(600);
}
function expandSideBar(callback){            /* UI-Shrawan-10092015  Modified for new UI */
	if(toggleFlag == false){
		toggleFlag = true;
		j$('#sideBarDivId').animate({width: '13.65%'}, 400, function(){
			j$('#SidebarCtrlId > a').animate({width: (j$('#sidebarCell').width() - 3)}, 400);
			j$('#SidebarCtrlId > a > i').toggleClass('down');
		});    
		j$('#body').animate({width: '86.32%'}, 400);
		expandedSidebarIcons(callback);
		Visualforce.remoting.Manager.invokeAction(
			_RemotingModalTemplateActions.showUserSideBarPreference
			,function(result, event){}
		);
	}
}

j$(document).ready(function(){    
	ShowReadMore();
});

function ShowReadMore(){
	var maxChars = modalTemplate_expandTextCharSize;
	var ellipsis = "";	
	j$(".article").each(function() {
		var text = j$(this).find(".text-full").text();
		var html = j$(this).find(".text-full").html(); 
		if(text.length > maxChars) {         // htmlSubstring  
			//var shortHtml = html.substring(0, maxChars - 3) + "<span class='ellipsis'>" + ellipsis + "</span>";
			var shortHtml = htmlSubstring(html, maxChars - 3) + "<span class='ellipsis'>" + ellipsis + "</span>";	
			j$(this).find(".text-short").html(shortHtml);
			j$(this).find(".text-full").hide();
			j$(this).find(".text-short").show();
			j$(this).find(".read-more").show();
			j$(this).find(".read-less").hide();
		} else {
			j$(this).find(".text-full").show();
		}
	});
	j$(".read-more").click(function(){ 
		//console.log('========read-more=======');       
		//var readMoreText = "more";               
		//var readLessText = "less";        
		var $shortElem = j$(this).parent().find(".text-short");
		var $fullElem = j$(this).parent().find(".text-full");   	
		if($shortElem.is(":visible")) { 
			//console.log('========shortElem.is=======');           
			$shortElem.hide();
			$fullElem.show();
			j$(this).parent().find(".read-more").hide();
			j$(this).parent().find(".read-less").show();
			//j$(this).text(readLessText);
		}    
	});
	j$(".read-less").click(function(){        
		var $shortElem = j$(this).parent().find(".text-short");
		var $fullElem = j$(this).parent().find(".text-full");        
		if($shortElem.is(":visible")) {           
		} else {
			$shortElem.show();
			$fullElem.hide();
			j$(this).parent().find(".read-more").show();
			j$(this).parent().find(".read-less").hide();
		}       
	});
}

function htmlSubstring(s, n) {
	var m, r = /<([^>\s]*)[^>]*>/g,
	stack = [],
	lasti = 0,
	result = '';
	//for each tag, while we don't have enough characters
	while ((m = r.exec(s)) && n) {
		//get the text substring between the last tag and this one
		var temp = s.substring(lasti, m.index).substr(0, n);
		//append to the result and count the number of characters added
		result += temp;
		n -= temp.length;
		lasti = r.lastIndex;

		if (n) {
			result += m[0];
			if (m[1].indexOf('/') === 0) {
				//if this is a closing tag, than pop the stack (does not account for bad html)
				stack.pop();
			} else if (m[1].lastIndexOf('/') !== m[1].length - 1) {
				//if this is not a self closing tag than push it in the stack
				stack.push(m[1]);
			}
		}
	}

	//add the remainder of the string, if needed (there are no more tags in here)
	result += s.substr(lasti, n);

	//fix the unclosed tags
	while (stack.length) {
		var popStr = stack.pop();
		//console.log('popStr=======', popStr);
		if(popStr != 'br'){
			result += '</' + popStr + '>';
		}
	}
	return result;
}
function closeModalFromModalTemplate(){
	 j$('#customLookupModalDiv').modal('hide'); 
	 j$(lastFocus).focus();
}
function closeModal() {	
	if(event.keyCode==27)
    {	
		window.parent.closeModalFromModalTemplate();		
    }	
}
//User Story 114986: Internal - Remove page loading resources for page loading time improvement - from loading icon
// Hide Loading Icon.......
/*document.onreadystatechange = function () {
	if (document.readyState === 'complete') {
		hideLoadingPopUp();
	}
}*/
