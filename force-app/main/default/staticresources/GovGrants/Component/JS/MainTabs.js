var isSite = mainTabs_isSite; 
var enableAdminSetup = mainTabs_enableAdminSetup;
//var j$ = jQuery.noConflict();
var activeTabName;
j$(document).ready(function(){
	init();
	//toggleSidebar();
	//setSideBarCtrl();
	getUserDeptLogo();
	getAppLogoForMobile();
});
j$(window).on('resize', function() {               
	getAppLogoForMobile();
}); 
function getAppLogoForMobile() {
	j$('#deptLogoSec #deptLogoSecIcon').addClass('hidden');
	j$('#deptLogoSec .icon-mobile-dept').addClass('hidden');
	j$('#mobileTabContainer').addClass('hidden');
	if(j$(window).width() < 739) {
		j$('#mobileTabContainer').removeClass('hidden');
    	j$('#deptLogoSec #deptLogoSecIcon').removeClass('hidden');
			j$('#deptLogoSec .caret').removeClass('hidden');

		
		j$('#deptLogoSec .icon-mobile-dept').removeClass('hidden');
	}
}
function setActiveTab(activeTab) {
  activeTabName = activeTab;
}
function toggleLRChevron(){
	j$('#sidebarChevron').toggleClass('fa-chevron-right');
	j$('#sidebarChevron').toggleClass('fa-chevron-left');
	(j$("#sidebarChevronToggle").text() === "Sidebar click to expand") ? j$("#sidebarChevronToggle").text("Sidebar click to collapse") : j$("#sidebarChevronToggle").text("Sidebar click to expand");
};

function showWarningMsg(thisVal,thm,id){
	
	j$('#'+id+'').tooltipster({ 
        theme: thm,                     
        multiple: true,
        position : 'right',
        animation :'fade',          
        contentAsHTML: true,    
        content : '<span>'+ thisVal + '</span>'
    });    
	
   j$('#'+id+'').tooltipster('show');    
};

//One init Point for all JS Functions.
var init = function(){
   logProtection();
   getLogo();
   //console.log('SITE: '+isSite);
   //alert('SITE: '+isSite);
   if (isSite == 'false') {
	   getProfilePicture();
	   makeActiveAppDefault();
	   getAppDropDownNames();
	   getProfileName();
	   getProfileDropDownNames();
	   getPhaseNames();
	   
   }
}
var phaseConfigPageUrl = mainTabs_phaseConfigPageUrl;
function openPhaseMetadata(){
	window.open(phaseConfigPageUrl, '_blank');
}

/********************
	 Build Logo
*********************/
 //Get the Id of the Logo from Document Obj. The Name of the Logo is govGrantsLogo
 var getLogo = function(){
	var logo = new Object();
	logo = mainTabs_logo;
	if(logo != '' ){
		logo =  JSON.parse(logo);
		constructImageURL (logo);
	}
 }

//Used to construct Image URL from Salesforce Org ID and Instance Name.
var constructImageURL = function(result){
	//Format for External Available Images stored in Documents
	//https://{SALESFORCE-INSTANCE}.salesforce.com/servlet/servlet.ImageServer?oid={ORG-ID}&id={DOC-ID}
	var OrgId = mainTabs_OrganizationId;
  //  var imageURL = result.salesforceBaseURL + '/servlet/servlet.ImageServer?oid=' + OrgId + '&id=' + result.docID;
	var imageURL = result.salesforceBaseURL + '/servlet/servlet.FileDownload?oid=00DG0000000kGTCMA2&file=015G0000007KNweIAG';	
	if(imageURL){
		//Set URL
		j$('#govGrantsImagePlaceHolderId').attr('src',imageURL);
		//Disable Click
		disableImageClick();
	}
}

var disableImageClick = function(){
	j$('#govGrantsImagePlaceHolderId').on('click',function(e){
		e.preventDefault();
		e.stopPropagation();
	});
}

/***************************
	 Build Profile Picture
****************************/

var getProfilePicture = function(){
	var profilePicture = new Object();
	profilePicture  = mainTabs_profilePhoto;
	profilePicture  =  JSON.parse(profilePicture);	
	if(profilePicture.HideAvatar == false){
		if(profilePicture.ChatterEnabled == true){
			if(profilePicture.URL != null){
				j$('#AvatarImageId').attr('src',profilePicture.URL);
				j$('#AvatarImageId').attr('alt', 'User Avatar');
			}
		}else{
			j$('#AvatarImageId').attr('src','http://placehold.it/50/55C1E7/fff');
			j$('#AvatarImageId').attr('alt', 'User Avatar');
		}
	}else{
			j$('#AvatarImageId').removeAttr('alt');
	} 
}

/*****************************
	  Build Profile Name
******************************/

//Gets Profile Name based on User Login
var getProfileName = function(){
	var fullName = mainTabs_FirstName + ' ' + mainTabs_LastName + ' ';
	var tmpName = 'Anonymous User'
	if(!fullName){
		j$('#profileNameId').append(tmpName);   
	}
	j$('#profileNameId').append(fullName);
}

/*****************************
	  Build Profile DropDown
******************************/

//Get Values of Profile DropDown from Custom Settings
var getProfileDropDownNames = function(){
	  var profileNames =  new Object();
	  profileNames = mainTabs_profileDropDownNames;
	  profileNames =  JSON.parse(profileNames);	  
	  constructAppDropDown(profileNames);
}

/******************************
	  Build App DropDown
******************************/

//Get Values of App DropDown from Custom Settings
var getAppDropDownNames = function(){
	var appNames =  new Object();
	appNames = mainTabs_appDropDownNames;
	appNames =  JSON.parse(appNames);	
	constructAppDropDown(appNames);
}

/******************************
		Construct Tabs
******************************/

//Get all the Tab Names from the Phase Obj using Remoting.
var getPhaseNames = function(){
	var phaseNames =  new Object();
	phaseNames = mainTabs_allPhaseNames;	
	if(phaseNames != '' ){
		phaseNames =  JSON.parse(phaseNames);
		buildCustomTabs(phaseNames);
	}
}

//Build BootStrap Style HTML Tabs using Remoting Results.
var buildCustomTabs = function(result){
	//Deliberately Exposed. For Development Purpose Only -- Jag.
	exposeResults = result;
	var isCogActive = false;
	//Custom Sort Results
	var sortedResult = result; //customSort(result);
	//makeActiveAppDefault();
	//Get the Active App Name
	var activeApp = getActiveAppNameFromCookie();	
	//debugger;
	if(sortedResult){
		j$.each(sortedResult, function(key, value){
			if(value.isActive == true){
				if(value.customAppName.toLowerCase() == activeApp.replace(/\s/g, "").toLowerCase()){
					var tabHTML = constructTabHTML(value.name, value.tabIconCSS, value.phaseName,value.orderNo, value.groupName, value.url, value.selectedByDefault,value.sourceRecordId);
					 j$('#myTabNew').append(tabHTML);                           
				}
			}
		});
	}

	//Bind the Click Event After DOM Level Elements are Created.
	bindTabs();
	//Then Load Active Tab based on Cookie History
	loadActiveTab();
	//Render Grouped Tabs
	groupTabs();
	if(enableAdminSetup == 'true' && j$.cookie('setup') == 'present' ) {
		appendSetupIcons();
		var phName = "Planning";
		var myPhase = j$('li[phaseName=Planning]');
		j$(".clickable").click(function(){
			window.open("/"+j$(this).attr("phaserecordid"));    
		});
	}
}

//Build Actual 'Li A' Elements for Tabs 
var constructTabHTML = function(tabName, tabIconCSS, phaseName,orderNo, groupName, url, selectedByDefault, sourceRecordId){
   // var isSelected = false;
	if(selectedByDefault == true){
		//Make the Default Tabs Active Only if TabCookies are not Available.
		if(isTabCookieAvailable() == false){
			var tempHTML = "<li class='active'>";
		   // isSelected = true;
		}else{
			var tempHTML = "<li class=''>";
			//ifSelected = false;
		}

	}else{
		var tempHTML = "<li class=''>";
		//ifSelected = false;
	   
	}	
	//Show Icon if tabIcon field has a value
	if(tabIconCSS != null){
		tempHTML +=/*"<span>"+*/"<a onClick='showLoadingPopUp();' id='" + phaseName +"' href='" + url + "' data-group='"+ groupName + "' title='"+ tabName + "' aria-label='"+ tabName + "'>" + tabIconCSS + "</a>"+"</li>";// "<a href=/" + sourceRecordId  + ">" + "<span class = \"fa fa-cog cursorpointer\"/><span class="hidden508">Settings</span>" + "</a>"+"</span>";		
	}
	else{
		tempHTML +=/*"<span>"+*/"<a onClick='showLoadingPopUp();' id='" + phaseName +"' srcRecordId='"+sourceRecordId+"' href='" + url + "' data-group='"+ groupName + "' title='"+ tabName + "'>" + tabName + "</a>";//+ "<a href=/" + sourceRecordId  + ">" + "<span class = \"fa fa-cog cursorpointer\"/><span class="hidden508">Settings</span>" + "</a>" + "</span>" ;<li class= \"fa fa-cog cursorpointer\" style=\"margin-left: -10px; border-left: 0px none; font-size:0.9em\"></li>"
	}
	//console.log('enableAdminSetup',enableAdminSetup);
	//console.log('tempHTML',tempHTML);
	if(enableAdminSetup == 'true' && j$.cookie('setup') == 'present' ){ //&& j$.cookie('setup') == 'present'
	   // if(tempHTML.indexOf("active")!=-1){
			//console.log('tempHTML',tempHTML);
			/*tempHTML +="<li class=\"tabColor\" style=\"margin-left: -10px; \"><a href=/"+ sourceRecordId +" style=\"border-left: 0px none; margin-right: -10px; font-size:0.9em\" target=\"\_blank\"><span style=\"margin-left:-10px\" class=\"fa fa-cog cursorpointer\" title=\"Phase Config Layout View\"></span></a></li>";*/
		//}
		/*else{
			tempHTML +="<li class=\"tabColor\" style=\"margin-left: -10px; \"><a href=/"+ sourceRecordId +" style=\"border-left: 0px none; margin-right: -10px; font-size:0.9em\"><span style=\"margin-left:-10px\" class=\"fa fa-cog cursorpointer\"></span></a></li>";
		}*/
	   /* var spanElement = document.createElement("span");
		spanElement.setAttribute("class","fa fa-cog cursorpointer customLabelSetup");
		spanElement.setAttribute("title","Update Label");
		document.getElementById("setupIconSpan").appendChild(spanElement);*/
	}
	//tempHTML += "</li>";
	return tempHTML;	
}

var constructCogHTML = function(sourceRecordId,isCogActive){
// var isSelected = false;                      
		if(isCogActive == true){		  
			tempHTML ="<li id='" + phaseName + "_cog" + "class=\"tabcolor active\"" + /*style=\"margin-left: -10px; \" */ + "><a href=/"+ sourceRecordId +"" + /*style=\"border-left: 0px none; margin-right: -10px; font-size:0.9em\" */ + " target=\"\_blank\"><span" + /* style=\"margin-left:-10px\" */ + " class=\"fa fa-cog\" ></span><span class='hidden508'>Settings</span></a></li>";
		}
		else{
			tempHTML ="<li id='"+ phaseName + "_cog" + "class=\"tabColor\"" + /* style=\"margin-left: -10px; \" */ + "><a href=/"+ sourceRecordId +"" + /* style=\"border-left: 0px none; margin-right: -10px; font-size:0.9em\" */ + " target=\"\_blank\"><span" + /*style=\"margin-left:-10px\" */ + " class=\"fa fa-cog\" ></span><span class='hidden508'>Settings</span></a></li>";
		}	
	//tempHTML += "</li>";
	return tempHTML;	
}

/*******************************
	Handle Cookies get/set
*******************************/

//Set Cookie based on Click Handler

var setTabCookies = function(value,url){
	j$.cookie('apex__'+getActiveAppNameFromCookie().replace(/\s/g, ""),url+':'+value, {path: '/'});
	//console.log('Setting cookies from View Page');
}

//Function to check whether Tab Cookie is Available or Not
var isTabCookieAvailable = function(){
	var tabURL = j$.cookie('apex__'+getActiveAppNameFromCookie().replace(/\s/g, ""));
	if(tabURL){
		return true;
	}
	return false;
}

var getActiveAppNameFromCookie = function(){
	var currentAppName = j$.cookie('apex__current_AppName');
	if(!currentAppName){
		return 'Default App';
	}
	return currentAppName;
}

/*******************************
		Make Tab Active
*******************************/

//Load Active Tab based on Cookie Value
var loadActiveTab = function(){
	var cookieName = j$.cookie('apex__'+getActiveAppNameFromCookie().replace(/\s/g, "")); 
	if(cookieName){
		var tabName = j$.cookie('apex__govgrants_tabname');
		if((mainTabs_currentPhaseName != '') && (mainTabs_currentPhaseName != null)){
			tabName = mainTabs_currentPhaseName;
		}
		if(tabName){
			currentTab = tabName;
		}else{
			currentTab = cookieName.split(':')[1];
		}
		if(!activeTabName){
			makeTabActive(currentTab,false);
		}else{
			makeTabActive(activeTabName,false);
		}
	}  
}

//Function to make the current Tab Active.
var makeTabActive = function(currentTab,setFromCookie){
	j$('#myTabNew li a').each(function(){
		//Get the Current Node
		var currentNode = j$(this);		
		if(currentNode){
			//Remove all Active Classes.
			j$(this).parent().removeClass('active');
			//If the Current Node is Already Selected, do the Following		  
			if(currentTab.toLowerCase() == currentNode[0].id.toLowerCase() && setFromCookie == false){
				j$(this).parent().addClass('active');
				//Make the text White
				j$(this).addClass('selectedItem');
				//j$(this).css('color', '#32475c');
				//j$(this).css('background-color', '#e2f5fc');
				setTabCookies(currentNode[0].title,'/apex'+currentNode[0].href.split('apex')[1]);                       
			}else if(currentTab.toLowerCase() == currentNode[0].title.toLowerCase() && setFromCookie == true){
				j$(this).parent().addClass('active');
				j$(this).removeClass('selectedItem');
				//Make the text White
				//j$(this).css('color', '#32475c');
				//j$(this).css('background-color', '#e2f5fc');
			}		   
		}
	});
}

/*******************************
		Attach Handlers
*******************************/

//Binding Click handler to capture selected Tab and store it in Cookies.
var bindTabs = function(){
	j$('#myTabNew li a').bind('click', function(e){
		var currentNode = j$(this);
		if(currentNode){
			var currentTab = currentNode[0].title;
			var currentTabURL = '/apex'+currentNode[0].href.split('apex')[1];
			//j$.cookie('apex__TabName', currentNode[0].id, {path: '/'});			
		}
		if(currentTab){
			setTabCookies(currentTab,currentTabURL);
		}
	});
}

var bindAppDropDowns = function(){
	j$('#appDropDownMenuId li a').bind('click',function(e){
		var currentNode = j$(this);
	   // debugger;
		e.preventDefault();
		var href = j$(this).attr("href");			
		if(currentNode){
			////console.log('====---'+currentNode[0].id);
			var currentDropDownValue = currentNode[0].id;
		}
		if(currentDropDownValue){
			  saveCurentAppName(currentDropDownValue.replace(/\s/g, ""),href);
		 }	   
	});
}

var saveCurentAppName = function(currentDropDownValue,href){
	Visualforce.remoting.Manager.invokeAction(                
		_RemotingMainTabsActions.saveCurrentAppName,currentDropDownValue ,
		function(result, event){
			if(event.status){
				j$.cookie('apex__current_AppName',result, {path: '/'});
				//console.log('result--->>>',result);
				tabURL=j$.cookie('apex__'+currentDropDownValue.replace(/\s/g, ""));
				/* if(tabURL){
				window.location = tabURL.split(':')[0];
				}else{*/
				window.location = href;
				//}
			}    
		}, 
		{escape:false,buffer:false}
	);
}

/************************************************
		Get/Set Values in User Preferenece Obj
*************************************************/

var makeActiveAppDefault = function(){
	var activeApp = new Object();
	activeApp = mainTabs_activeAppDefault;
	activeApp =  JSON.parse(activeApp);	
	highlightActiveApp(activeApp);
}

var highlightActiveApp = function(result){
	j$('.selection').text(result.Label);
	j$('.selection').val(result.Label);
	j$.cookie('apex__current_AppName', result.Name, {path: '/'})
};
 
/**********************************
		Tab Grouping and Color
***********************************/

//Add Padding to First Element of the Group
var groupTabs = function(){
	//Cache Selector
	var tabList = j$('#myTabNew li a');
	tabList.each(function(index, element){
		var currentNode = j$(this);
		var nextNode = j$(tabList[index + 1]);
		if(currentNode){		
			for(var i =0; i< exposeResults.length; i++){
				//Apply Color and add Padding
				if(currentNode[0].textContent == exposeResults[i].name){
					//Add Padding
					if(nextNode.data('group')){
						if(currentNode.data('group') != nextNode.data('group')){
							currentNode.parent().css('margin-right', '10px');
						}
					}
				}
			}
		}
	});	
}

/*******************************
		Util Functions
*******************************/

var constructAppDropDown = function(result){
	//Deliberately Exposed. For Development Purpose Only -- Jag.
	if(result.dropDownType == 'App'){
		exposeAppDropDownResults = result;    
	}
	if(result.dropDownType == 'Profile'){
		exposeProfileDropDownResults = result;    
	}   
	//Custom Sort
	var sortedDropDownResults = customSort(result);
	if(sortedDropDownResults){
		j$.each(sortedDropDownResults, function(key, value){
			console.log('ConstructAPp:==',value);
			var appDropDownHTML = constructDropDownHTML(value.label, value.url, value.isActive, value.name,value.logoId,value.defaultThemeId);
			if(value.dropDownType == 'App'){
				j$('#appDropDownMenuId').append(appDropDownHTML);
				j$('#appDropDown').show();
			}			
			if(value.dropDownType == 'Profile'){
				j$('#profileDropDownMenuId').append(appDropDownHTML);
				j$('#profileDropDown').show();  
			}
		});
	}
	//Bind the events only once.
	runOnce();
}

//Bind the events only once.
var runOnce = function(){
	//Bind Events for these Dropdowns
	bindAppDropDowns();
	this.alreadyRan = true;
}

var constructDropDownHTML = function(label, url, isActive,name,logoId,defaultThemeId){	
	var icon = '';
	// Opera 8.0+
	var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
		// Firefox 1.0+
	var isFirefox = typeof InstallTrigger !== 'undefined';
		// At least Safari 3+: "[object HTMLElementConstructor]"
	var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
		// Internet Explorer 6-11
	var isIE = /*@cc_on!@*/false || !!document.documentMode;
		// Edge 20+
	var isEdge = !isIE && !!window.StyleMedia;
		// Chrome 1+
	var isChrome = !!window.chrome && !!window.chrome.webstore;
		// Blink engine detection
	var isBlink = (isChrome || isOpera) && !!window.CSS;
	
	// get icon for row
	if(label === 'Logout')
		icon = 'fa fa-unlock-alt unlockIcon';
	if(label === 'My Profile')
		icon = 'fa fa-user userIcon';            
	if(label === 'New Tab')
		icon = 'fa fa-table tblIcon';
	if(isChrome || isFirefox) {
		if(label != undefined && label.includes('Settings'))
			icon = 'fa fa-cog';
	}
   /* if(isIE ) {
		if(label != undefined && label.includes('Settings'))
			icon = 'fa fa-cog';
	}*/
	//console.log('DROPDOWNTEST -> b');               
					   
	//Example Format : <li><a href="#">State as Grantor</a></li>
	if(isActive == true && name !=null){
		//console.log('DROPDOWNTEST -> grantee');
		var tmpHTML = "<li>";
			if(icon != '') {
				tmpHTML += "<span class='" +  icon + "'></span>";
			} else {
				tmpHTML += "<img class='grantee-logo' id='granteeIconSm' src="+maintabs_header_GrantorLogo+logoId+" alt=''/>";
			}
			tmpHTML += "<a id='" +  name + "' href='" + url + "' aria-label='" + label + "' title='" + label + "'>" + label + "</a>";
			tmpHTML += "</li>";
		return tmpHTML;
	}
	
	//console.log('DROPDOWNTEST -> c');
}

//Function to sort Tabs based on OrderNo [ASC]
var customSort = function(result){
	result.sort(function(a,b){
		if(a.hasOwnProperty('orderNo')){
			return a.orderNo > b.orderNo
		}

		if(a.hasOwnProperty('sequence')){
			return a.sequence > b.sequence
		}
	});
	return result;
}

var appendSetupIcons = function() {
	var liElement = document.createElement("li");
	liElement.setAttribute("class","fa fa-cog cursorpointer clickable");
	liElement.setAttribute("style","margin-left: -10px; border-left: 0px none;");
	j$(".conf").after(liElement);
	var confTabList = j$('.conf');
	confTabList.each(function(index, element){
		var currentNode = j$(this);
		var nextNode = j$(confTabList[index + 1]);

		if(currentNode){
			for(var i =0; i< exposeResults.length; i++){
					currentNode.next().attr("phaseConfigName",currentNode.find("a").attr("id"));
				   	currentNode.next().attr("phaseRecordId",currentNode.find("a").attr("srcRecordId"));
			}
		}
	});
	var tabList = j$('#myTabNew li a');
	tabList.each(function(index, element){
		var currentNode = j$(this);
		var nextNode = j$(tabList[index + 1]);

		if(currentNode){
			if(index == tabList.length - 1) {
				currentNode.parent().css('margin-right', '10px');
			}
			for(var i =0; i< exposeResults.length; i++){

				//Apply Color and add Padding
				if(currentNode[0].textContent == exposeResults[i].name){

					//Add Padding
					if(nextNode.data('group')){
						if(currentNode.data('group') == nextNode.data('group')){
							currentNode.parent().css('margin-right', '10px');
						}
					}
				}
			}
		}
	});

}

var logProtection = function(){
	if(typeof console === 'undefined'){
		//Expose Globally
		console = {};
		console.log = function(){
			return;
		}
	}
}

function getUserDeptLogo() {
	Visualforce.remoting.Manager.invokeAction(
		_RemotingMainTabsActions.getLoggedInUserDeptLogoURL, 
		function(result, event){                         
			if (event.status) {
				if(document.getElementById("isWarningMsg") != undefined && document.getElementById("isWarningMsg") != '' &&result.WarningMsg != undefined && result.WarningMsg != '')
				{
					var warInnerHTML = '<a  id="warningTooltip" onclick="showWarningMsg(\'' + result.WarningMsg + '\',\'tooltipster-noir\',\'warningTooltip\')" ><Span class="fa fa-bell"  id="" ></Span></a>';
					//console.log('warInnerHTML-1-DeptLogo-', warInnerHTML);
					document.getElementById("isWarningMsg").textContent = warInnerHTML;
				}
				 
				if(result != undefined && result.DeptLogo != undefined && result.DeptLogo != '') {
					j$("#userDeptLogoImg").attr("src",result.DeptLogo);
					j$( "#userDeptLogoImg" ).addClass( "userdeptLogoli" );
					j$( "#userDeptLogoImg" ).removeClass( "userdeptLogoli" );
					j$("#userDeptLogoImg").css("display", 'block');
				} else {
					j$("#userDeptLogoImg").attr("src", '');
					j$("#userDeptLogoLi").attr("display", 'none');
					j$("#userDeptLogoImg").css("display", 'none');
				}
				
				if(result.showLoginCount =='true') {
					j$('#loginAttemps').append(result.totalLogins + '/' + result.AllowedTotalLogins);
				}
			} else {
				console.log('Error while getting dept logo and login attempt details');
			}  
		}, 
		{escape: false}
	);
}


var mainTabsApp = angular.module('mainTabsId', ['ui.bootstrap']);
mainTabsApp.controller('mainTabNgCtrl', function ($q,$scope) {
	$scope.isCollapsed = false;
	if(mainTabs_isHeaderCollapsed == 'true'){
		$scope.isCollapsed = true;
	}	
	
	$scope.updateUserPreference= function(){
		$scope.isCollapsed = !$scope.isCollapsed;  
		var deferred = $q.defer(); 
		Visualforce.remoting.Manager.invokeAction(
			_RemotingMainTabsActions.updateUserPreference, 
			$scope.isCollapsed,
			function(result, event){                         
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(result);   
					});                                                                                                            
				}  
			}, 
			{escape: false}
		); 
		return deferred.promise;     
	}; 
});
angular.bootstrap(document.getElementById("mainTabsId"),['mainTabsId']);