var j$ = jQuery.noConflict(); 
var preventDefaultDialogBoxForGrid = false; //prevent Default Dialog Box for unsaved data entries
//Code to change the Tab of the page depending on 'tabName' paramter in  the URL
j$(document).ready(function() {
		if((flexEditLayout_CurrentPageTabName != null) && (flexEditLayout_CurrentPageTabName != '')){
	 	var tabId = j$('#myTabs a[name^=\''+flexEditLayout_CurrentPageTabName+'\']').attr('id');
	 	if(tabId != undefined){
	 		setCookie(tabId,flexEditLayout_CurrentPageTabName);	
		 	j$('#myTabs').find('li').removeClass('active');
		 	j$('#'+tabId).parent().addClass('active');
		 	j$('#myTabbedContent').children().first().removeClass('active in');
		 	tabId = tabId.replace('tab','');
		 	j$('#myTabbedContent div[id='+tabId+']').addClass('active in');	
	 	}
	}
	var errorMessage = document.getElementsByClassName("errorMessage");
	if (localStorage.getItem(flexEditLayout_rcrdId) != null || localStorage.getItem(flexEditLayout_CurrentPageformId) != null ) {
		var containerDiv = document.createElement('div');
		containerDiv.id = 'SubmitErrMessage';
		containerDiv.classList.add('alert', 'alert-danger', 'alert-dismissible');
		var closeSpan = document.createElement('span');
		closeSpan.classList.add('close');
		closeSpan.setAttribute('data-dismiss', 'alert');
		closeSpan.setAttribute('aria-label', 'close');
		closeSpan.appendChild(document.createTextNode('×'));
		containerDiv.appendChild(closeSpan);
	
		var errorMessages;
		var IdOfHandleErrorMessage;
		if(flexEditLayout_isFormsURL){
			IdOfHandleErrorMessage = flexEditLayout_CurrentPageformId;
			errorMessages = localStorage.getItem(IdOfHandleErrorMessage).split(';')
		}else{
			IdOfHandleErrorMessage = flexEditLayout_rcrdId;
			errorMessages = localStorage.getItem(IdOfHandleErrorMessage).split(';')
		}
		errorMessages.forEach(element => {
			var listItem = document.createElement('li');
			var span = document.createElement('span');
			span.style.margin = 'dynamic-msg-box-margin';
			span.appendChild(document.createTextNode(element));
			listItem.appendChild(span);
			containerDiv.appendChild(listItem);
		});
		while (errorMessage[0].firstChild) {
			errorMessage[0].removeChild(errorMessage[0].firstChild);
		}
		errorMessage[0].appendChild(containerDiv);
	
		localStorage.removeItem(IdOfHandleErrorMessage);
		
	}	
});

//User Story 121764: Flexwind - Users should be warned when they attempt to leave a page with unsaved data entries - Part 2

//The purpose of "use strict" is to indicate that the code should be executed in "strict mode".
"use strict";
(() => {
const defaultValue = "defaultValue";
const modified_inputs = new Set;
// store default values
addEventListener("beforeinput", (evt) => {
   const target = evt.target;
   if (!(defaultValue in target || defaultValue in target.dataset)) {
	   target.dataset[defaultValue] = ("" + (target.value || target.textContent)).trim();
   }
});
// detect input modifications
addEventListener("input", (evt) => {
   const target = evt.target;
   let original;
   if (defaultValue in target) {
	   original = target[defaultValue];
   } else {
	   original = target.dataset[defaultValue];
   }
   if (original !== ("" + (target.value || target.textContent)).trim()) {
	   if (!modified_inputs.has(target)) {
		   modified_inputs.add(target);
		   IsLoggedIn3 = true;
	   }
   } else if (modified_inputs.has(target)) {
	   modified_inputs.delete(target);
	   IsLoggedIn3 = false;
   }
});

addEventListener("beforeunload", (evt) => {
   
	   if (modified_inputs.size && !preventDefaultDialogBox && !preventDefaultDialogBoxForGrid) {
		   const unsaved_changes_warning = 'Changes you made may not be saved.';
		   evt.returnValue = unsaved_changes_warning;
		   return unsaved_changes_warning;
		 }

});

})();



 // Code for autoPrompt starts here 
	var isWarningPopupOpen = false;
	var timeOut =  autoPromptTiming; 
	var seconds =  timeOut*60;
	var miliseconds = seconds * 1000;
	var popupTime =  autoPromptTiming;
	var currentTime = new Date();
	var lastActivityTime = currentTime.getTime();

	j$(document).ready(function() 
	{
		if(autoPromptEnable == true && autoPromptSaveForm == true ) 
		{
	        setTimeout(checkConfirmationPopup, miliseconds);
			j$('input[type=text]').blur(function() { 
			    var setcurrentTime = new Date();
			    lastActivityTime = setcurrentTime.getTime();
		                   
		});
       } 

    });	


function showDialogBox() {
            
        bootbox.dialog({
             message: errorMessageAutoPrompt,                
             title: titleAutoPrompt, 
             onEscape: function() {
                isWarningPopupOpen = false; 
                var setcurrentTime = new Date();
                lastActivityTime = setcurrentTime.getTime();
             },
             backdrop: true,
             closeButton: true,
             animate: true,
             buttons: {
                Continue: function() {                    
                        isWarningPopupOpen = false;     
                        var setcurrentTime = new Date();
                        lastActivityTime = setcurrentTime.getTime();                        
                }
                
            }
        });
    }

    var checkConfirmationPopup = function() { 
            var checkcurrentTime = new Date();
            var checkcurrentMinutes = checkcurrentTime.getTime();
           // console.log(isWarningPopupOpen + 'checkcurrentMinutes'+checkcurrentMinutes);
           // console.log(popupTime + 'checkcurrentMinutes'+(checkcurrentMinutes - lastActivityTime));              
            if(((checkcurrentMinutes - lastActivityTime) > popupTime) && isWarningPopupOpen == false && autoPromptEnable == true && autoPromptSaveForm == true) { 
                isWarningPopupOpen = true;
                showDialogBox();
            }                    
            setTimeout(checkConfirmationPopup, miliseconds);
        } 
	// Code for autoPrompt ends here 

function redirectTo(sUrl) { 
	window.location = sUrl; 
} 
function newWindow(sUrl) {	
	window.open(sUrl);
}

// Changes for onComplete
function onSaveActionComplete(hasErrors){
	hideLoadingPopUp();
	scrollToTopPage();
	closeIframe(hasErrors);
}

function setCollapseIcon(elementId){	
	//console.log('======CollapseIcon Atul Entered=========',elementId);
	j$('#'+elementId).find("span.togglePageBlock ").toggleClass('fa-caret-down fa-caret-up');
	//console.log('========ValueInCollapse===',j$('#'+elementId).find("span.togglePageBlock "));
}
function showModalTitle(modalTitle) {
	if (modalTitle == null) {
		modalTitle = '';
	}
	modalTitle = modalTitle.replace('<br />', ' - ');
	modalTitle = modalTitle.replace('<br/>', ' - ');
	j$("#modalLabel").text(modalTitle);
}

/* to display tooltip on hover of header or footer buttons */
function showHelpTooltip(thisVal,thm,id){
	if(thisVal != undefined){
	   j$('[id="'+id+'tooltip"]').tooltipster({
			theme: thm,
			multiple: true,
			content : '<span>'+ thisVal + '</span>',
			contentAsHTML:true,
			animation :'fade',
			position:'bottom',
			autoClose:true
		});
		j$('[id="'+id+'tooltip"]').tooltipster('show');
	}
}

function hideHelpTooltip(thisVal,thm,id) {
	j$('[id="'+id+'tooltip"]').tooltipster('hide');
}

var addAttachmentField = function(classfications,pageBlockDetailId) {
	var recordId = dynamicEditLayout_CurrentPageParametersId;
	j$('#addAttModalField').modal();
	//j$('#iframeAddAttContentIdField').attr('src','/apex/FieldAttachmentAdd?parentId=a1S370000001jpMEAQ&pBlockId=' + pbdid + '&classification=' + classfications);
	j$('#iframeAddAttContentIdField').attr('src','/apex/FieldAttachmentAdd?parentId='+ dynamicEditLayout_parametersId +'&classification=' + classfications +'&pageBlockDetailId=' + pageBlockDetailId);
}

function executeClassOrURL(actionId, url,className){
	if(url != ''){
	   redirectTo(url);
	}
	else if(className != ''){		
		//Comment out on behalf of Eswari
		//alert('calling action class ' + className +  ' with actionId: ' + actionId);
		executeClass(className, actionId);
	} 
	/*//console.log('parent flex overlay close', parent);
	if(parent != undefined && parent != null){
		parent.closeFlexModal();
	} */ 
}
/*function resizeCustomLookupModal(size){
	j$('#customLookupModalBody').height(size);
}*/

function setLookupValue(fieldId,valueID,valueName){
	var formId =j$('form').attr('id');
	//Open Modal Code
	//console.log('formId----',formId);
	//console.log('fieldId----',fieldId);
	//console.log('valueID----',valueID);
	//console.log('valueName----',valueName);
	lookupPick2(formId,fieldId+'_lkid',fieldId,valueID,valueName, false);
	document.getElementById(fieldId).onselect();
	//console.log('lookupPick2----',lookupPick2);
	j$('#customLookupModalDiv').modal('hide');
	j$('#iframeCustomLookupModalId').attr('src','');
	j$(lastFocus).focus();
	// Open Modal Code
	// lookupPick2(formId,fieldId+'_lkid',fieldId,valueID,valueName, false);
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

function buttonOnClickAction(buttonId, url, className, showModal, height, width, title, warningMsg){	
	//fetchRecord(); 	
	var isDelete = false,confirmStatus = '';
	var isSubmitWarning = false;
	var deleteMessage = flexEditLayout_DeleteConfirmLabel;
	if(warningMsg != ''){
	   confirmStatus = confirm(warningMsg); 
	   isSubmitWarning = true;
	}	
	else if(title.toLowerCase() == 'delete'){
		confirmStatus = confirm(deleteMessage);
		isDelete = true;
	}	
	if(!isSubmitWarning || (isDelete == true && confirmStatus == true) || (isSubmitWarning == true && confirmStatus == true)){//(isDelete==false && confirmStatus == false) ||
		showModal = showModal.trim();		
		if(showModal == 'true' || showModal == true){ 
				if(height == '' || height == null){
					height = '400';
				}
				if(width == '' || width == null){
					width = '500';  
				}
				j$('#dynamicActionModalDiv').modal();
				j$('#iframeActionModalId').attr('src',url);
				j$('#iframeActionModalId').attr('height',height);
				j$('#iframeActionModalId').attr('width',width);
				var style = 'height:'+(parseInt(height)+30).toString()+'px !important; width:'+(parseInt(width)+30).toString()+'px !important;';
				j$('#modalDialog').attr('style',style);
				j$('#modalBody').attr('style',style);
				j$('#modalTitle').text(title);
				//console.log('showModal end');               
			}else{
				if(title.toLowerCase() == 'edit'){
					if(url.indexOf('saveURL') == -1 && url.indexOf('DynamicEditLayout') != -1){
						if(url.indexOf('?') == -1){
							url = url + '?saveURL='+encodeURIComponent('/apex/DynamicViewLayout?id='+flexEditLayout_rcrdId+'&template='+flexEditLayout_tmplName);
						}else{
							url = url + '&saveURL='+encodeURIComponent('/apex/DynamicViewLayout?id='+flexEditLayout_rcrdId+'&template='+flexEditLayout_tmplName);
						}
					}
				}				
				executeClassOrURL(buttonId, url, className);
			}
	 }
}

/* function saveRecordOnButtonClickJS(url, className, showModal, height, width, title, warningMsg){
var success;
   success = saveRecordOnButtonClick(url, className, showModal, height, width, title, warningMsg);
   success = true;
   //console.log('success---',success);
	if(success){
	buttonOnClickAction(url, className, showModal, height, width, title, warningMsg);
	}
}*/
function closeModal(){
	j$('#dynamicActionModalDiv').addClass('fade ');
	j$('#dynamicActionModalDiv').css('display', 'none');
	j$('#dynamicActionModalDiv').attr('aria-hidden', 'true');
}
//temp for form navigation toggle mode
function newnavigation(isError) {
	if(isError) {
		hideLoadingPopUp();		
		isError = false;		
	} else {		 
		 var Id = flexEditLayout_CurrentPageId;
		 var formId = flexEditLayout_CurrentPageformId;
		 var packageId = flexEditLayout_CurrentPagepackageId;
		 var parentId = flexEditLayout_CurrentPageparentId;
		 var parentLayoutId = flexEditLayout_CurrentPageparentLayoutId;
		 var templateName = flexEditLayout_CurrentPagetemplateName;              
		 var formtype = flexEditLayout_CurrentPageformTypes;
		 var pageUrl = 'DynamicFormView?formTypes='+ formtype +'&formId='+ formId +'&id='+ Id +'&packageId='+ packageId +'&parentId='+ parentId +'&parentLayoutId='+ parentLayoutId +'&templateName='+ templateName + '&isFormSaved=true';
		 window.open(pageUrl,'_self');
	}   
}

var lastClickedTabId; 
var pageLayoutId,recordTypeId,recordTypeName;
function saveSelectedRecordId(pageLayout,recordType,rtName){
	//saveRecordTypeId(name);
	var nextBtnID= document.getElementById('nextId');
	j$(nextBtnID).removeClass("customDisableBtn");
	j$(nextBtnID).addClass("btn");
	nextBtnID.disabled = false;
	pageLayoutId = pageLayout;
	recordTypeId = recordType;
	recordTypeName = rtName;
}

function cancelOperation(){
	var url = flexEditLayout_CurrentPageretURL;
	window.open(url,'_self');
}

function saveSelectionJS(){	
	if(pageLayoutId){
		saveSelection(pageLayoutId, recordTypeId, recordTypeName);
	}
}

function redirect(url){
	j$('#RedirectLoader').show();
	//console.log(url);
	if (url != '') {
		window.open(url,'_self');
	} else {
		j$('#RedirectLoader').hide();
	}
}
        
function setPageTitle(myPageTitle) {
	pageTitleName = myPageTitle;
}

function setCookie(tabId,tabName){
	if(lastClickedTabId != ''){ // Tanmay
		j$('#'+lastClickedTabId).parent().removeClass('active');               
	}	                 
	var rcrdId = flexEditLayout_CurrentPageId;
	j$.cookie(flexEditLayout_objectName, tabId+':'+rcrdId,{path: '/'});
	j$.cookie(flexEditLayout_objectName+'-Name', tabName+':'+rcrdId,{path: '/'});
	var topBarOrDropDownFlag = j$('#'+tabId).parent().parent().attr('id');	
	if(topBarOrDropDownFlag == 'tabDropDownMenuBar'){
		j$('#tabDropDownMenuBar').append(j$('#topTabsID').children().last().prev());
		//j$('#topTabsID').append(j$('#'+tabId).parent());
		j$('#topTabsID').children().last().before(j$('#'+tabId).parent());
	}
	lastClickedTabId = tabId;
}

function setPageHeaderTitle(){
	if(flexEditLayout_parentLytId != null || flexEditLayout_parentLytId != 'Undefined' || flexEditLayout_parentLytId != '') {
		var pageHeader1 = flexEditLayout_pageHeader.replace('<br />', '</span><br /><span class="overview-title" tabindex="0">');
		var pageTitleText = '<div class="overviewHeader"><span class="customLabelstyle" tabindex="0">'+pageHeader1+'</span></div>';		
		//console.log('page title else condition', pageTitleText);
		j$('#pageHeaderId').html(trustHTML(pageTitleText));  
	}else {    
		var pageTitleText = flexEditLayout_pageHeader;
		//console.log('page title else condition', pageTitleText);
		j$('#pageHeaderId').html(trustHTML(pageTitleText));  
	}
}
function trustHTML(src) {
	if(src?.includes("<meta")){
		if(src.includes("no-referrer")){
			src = src.replaceAll("no-referrer", "origin");
			src = src.replaceAll("<", "&lt;");
			src = src.replaceAll(">", "&gt;");
		}			
	}
	return  DOMPurify.sanitize(src);
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
	setPageHeaderTitle();
	sideBarMenuCollapse();
	
	if(flexEditLayout_CurrentPageformId != ''){
		document.title = flexEditLayout_setFormPageTitle;

	}else{
		document.title = flexEditLayout_setPageTitle;
	
	}
	//setPageTitle(flexEditLayout_setPageTitle);
	var layout = flexEditLayout_layoutType;
	lastClickedTabId = '';

	/*changed Anuja  : 06_05_2016 hardcoded the value*/

	if(layout == 'Edit'){
		//var textElement = j$("<span class=\'requiredFieldMessage'\ ></span>"); /* UI-Shrawan-10092015 Removed inline style */
		//textElement.text("{!$Label.FieldsMarkedRequired}");
		//var textElement = '<span class="pull-right  padding-left-4">'+flexEditLayout_FieldsMarkedRequired+'</span>';
		//var textElement = j$("<span class=\'pull-right padding-left-4'\ >are required </span><span class=\'pull-right color-red padding-left-4'\>*</span><span class=\'pull-right'\>Fields marked as </span>"); /* UI-Shrawan-10092015 Removed inline style */
		//j$("#requiredMessage").append(textElement);
		var textElement = j$("<span class=\'pull-right'\ >are required </span><span class=\'pull-right color-red'\ style=\'margin: 0 5px;'\> * </span><span class=\'pull-right'\>Fields marked as </span>"); /* UI-Shrawan-10092015 Removed inline style */
		j$("#requiredMessage").append(textElement)
	}

	var GGLinks = j$("span[customId] a");
    if(GGLinks){
        for(var i=0;i<GGLinks.length;i++){
            GGLinks[i].target = '_blank';
        }
    }

	var aHref = j$( "span[customId^='005'] a" );	
	for(var i=0;i<aHref.length;i++){	
		var n = aHref[i].href.lastIndexOf('/');	
		var idn = aHref[i].href.substring(n+1);		
		aHref[i].href = '/apex/ProfileRedirect?id='+idn;
		aHref[i].target = '_blank';
	}	
	//
	var newTabHTML = '';
	var tabsMaxWidth = j$('#topTabsID').width() - 50;                
	var allTabsLength = j$('#topTabsID').find('li').length;		
   
	var tempTabsLength = 0; 
	var plusTab1 = '<li class="listyle"><a class="dropdown-toggle" href="#" tabindex="0" id="tabDropDownMenu" data-toggle="dropdown" title="More Tabs"><span class="fa fa-plus"></span><span class="hidden">More Tabs</span></a><ul id="tabDropDownMenuBar" class="dropdown-menu dropdown-menu-right" aria-labelledby="tabDropDownMenu" style="width: auto;">';
	var plusTab2 = '</ul></li>';
	var withinMaxWidth = true;
	for(var i=0;i<allTabsLength;i++){
		if(j$(j$('#topTabsID').find('li')[i]).attr('style') == "" || j$(j$('#topTabsID').find('li')[i]).attr('style') == undefined){
			tempTabsLength += j$(j$('#topTabsID').find('li')[i]).width();
		}		
		if(tempTabsLength >= tabsMaxWidth){  
			if(withinMaxWidth) {             
				newTabHTML += plusTab1;   
				withinMaxWidth = false;
			}                                                                
			newTabHTML += j$(j$('#topTabsID').find('li')[i]).prop('outerHTML'); 			
			if(i == allTabsLength-1){
				newTabHTML += plusTab2;
				j$('#topTabsID').empty();
				j$('#topTabsID').append(newTabHTML);
			}                                   
		}else{
			newTabHTML += j$(j$('#topTabsID').find('li')[i]).prop('outerHTML');
		}
	}            
	//
	var recId = flexEditLayout_CurrentPageId.substring(0,3);
	
	var tabId;
	var tabName;
	if(flexEditLayout_objectName != ''){
		tabId = j$.cookie(flexEditLayout_objectName);
		tabName = j$.cookie(flexEditLayout_objectName+'-Name');
	}	
	noMatch = true;
	if(tabId){ 
		var res = tabId.split(":");		
		var rcrdId = flexEditLayout_CurrentPageId;		
		if(res[1] == rcrdId){ 
			var tabVal = j$('.nav-tabs a[id='+res[0]+']');			
			if(tabVal.length > 0){
				tabVal.tab('show');
				noMatch = false;
			}else{
				if(tabName){
					var res = tabName.split(":");					
					var name = '\'' + res[0] + '\'';
					var tabVal = j$('.nav-tabs a[name='+name+']');
					if(tabVal.length > 0){
						tabVal.tab('show');
						noMatch = false;
					}
				}
			}
			var topBarOrDropDownFlag = j$('#'+res[0]).parent().parent().attr('id');			
			if(topBarOrDropDownFlag == 'tabDropDownMenuBar'){
				j$('#tabDropDownMenuBar').append(j$('#topTabsID').children().last().prev());
				//j$('#topTabsID').append(j$('#'+tabId).parent());
				j$('#topTabsID').children().last().before(j$('#'+res[0]).parent());
			}
			
		}
	}
	if(noMatch == true){                
		var firsTabId; //= j$('#topTabsID').find('li:visible:first').children().tab('show');//
		if(flexEditLayout_activeTabSize) {
			if(j$('#topTabsID a:first').is(':visible') == true || flexEditLayout_activeTabSize == '1'){
				j$('#topTabsID a:first').tab('show');
				firstTabId = j$('#topTabsID a:first').attr('id');                
			}
			else{
				j$('#topTabsID').find('li:visible:first').children().tab('show');
				firsTabId = j$('#topTabsID').find('li:visible:first').children().attr('id');
			}
			var rcrdId = flexEditLayout_CurrentPageId;
			j$.cookie(flexEditLayout_objectName, firsTabId+':'+rcrdId ,{path: '/'});			
		}
		}
		adjustToggleBarHeightUI(); /* UI-Shrawan-10102015 */   
		sideBarHeightUI();
		j$(window).on('resize', function() {               
			sideBarHeightUI();
		});				 
});        
		
var isInternalDoc = 'false';
var docId = '';
var helpId = flexEditLayout_HelpConfig;
var namespace = flexEditLayout_namespace;
var j$= jQuery.noConflict();
if(j$.cookie('setup') == 'present' && flexEditLayout_enableNativeLayout) {
	j$(".pageLayoutSetupIcon").show();
	j$("#ViewNativePageLayoutId").show();
}
else{
	j$(".pageLayoutSetupIcon").hide();
	j$("#ViewNativePageLayoutId").hide();
}

//Added to hide the menu burger icon when no elements are displayed in the dropdown
var menuIconsArray = j$('.fa.fa-bars.menuIcon').closest('a').siblings('ul').children('li');
var menuIconsHidden = true;

for (var i = 0; i < menuIconsArray.length; i++) {
	if(!(j$(menuIconsArray[i]).css('display') === 'none')) {
		menuIconsHidden = false;
		break;
	}
}

if(menuIconsHidden && menuIconsArray.length > 0) {
	j$('.fa.fa-bars.menuIcon').hide();
}
 
function fetchHelpDataJS(){	
	Visualforce.remoting.Manager.invokeAction(
		_RemotingFlexEditLayoutActions.fetchHelpDataRemote,helpId,
		function(result, event){
			if (event.status) {
				isInternalDoc = result.isInternalDocument;
				docId = result.docId;
			}
		});
}
function getParameterByName(name,url) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), //False +ve for non literal regex used for sanitization, as we are not using for sanitization purpose
	results = regex.exec(url);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function openLookup(baseURL, width, modified, searchParam){
	var originalbaseURL = baseURL;
	var originalwidth = width + 30;
	var originalmodified = modified;
	var originalsearchParam = searchParam;
	var lookupType = getParameterByName('lktp',baseURL);//location.search.split('lktp=')[1];//j$.urlParam('lktp');
	/*if(lookupType != '001'){
	return openPopup(baseURL, "lookup", 350, 480, "width="+originalwidth+",height=480,toolbar=no,status=no,directories=no,menubar=no,resizable=yes,scrollable=yes,scrollbars=yes", true);
	} */
	//console.log('lookupType--',lookupType);
	var urlArr = baseURL.split("&");
	//console.log('urlArr------',urlArr);
	var txtId = '';
	if(urlArr.length > 2) {
		urlArr = urlArr[1].split('=');
		txtId = urlArr[1];
	}
	//console.log('TEXTiD',decodeURIComponent(txtId));
	var lblId =document.getElementById(decodeURIComponent(txtId));
	//console.log('input value------------>>>>>>',j$(lblId).val());
	var inputValue = j$(lblId).val();
	//console.log('filterCriteriaDOM--------->>>>>>>',j$(lblId).closest('span[sourceHandler]').children().get(0));
	var filterCriteriaDOM = j$(lblId).closest('span[sourceHandler]').children().get(0);
	//console.log('filterCriteriaDOM -------------->>>>>>',filterCriteriaDOM);
	var filterCriteria;
	filterCriteria = j$(filterCriteriaDOM).attr('value');
	var pageBlockDetailId = j$(filterCriteriaDOM).attr('pbdId');
	//console.log('filterCriteria ------------------>>>>',filterCriteria );
	var customLookupModalHeader = j$(filterCriteriaDOM).attr('modalHeaderText');
	//console.log('customLookupModalHeader------------------>>>>',customLookupModalHeader);
	//console.log('referenceName------------------>>>>',j$(filterCriteriaDOM).attr('referenceName'));
	j$("#customLookupModalTitle").text(customLookupModalHeader);
	//console.log('pageBlockDetailId ------------------>>>>',pageBlockDetailId);
	//console.log('lblId-',lblId);
	//console.log('filterCriteria',filterCriteria);
	var recordIdentifier = dynamicEditLayout_recordId;
	//console.log('RecirdId',recordIdentifier );
	//console.log('filterCriteria before replacing actual value-------------->>>',filterCriteria);
	/*var regex = /\{\!(\w*)\}/;
	var matches = regex.exec(filterCriteria);
	//console.log('matches------------->>>',matches);
	if(matches){
	var realTimeValue = apiNameToInputValueMap[matches[1]];
	if(realTimeValue != undefined){
	filterCriteria = filterCriteria.replace(regex,realTimeValue);
	//console.log('realTimeValue',realTimeValue);
	}else{
	var oldValue = record[matches[1].trim()];
	//console.log('oldval',oldValue);
	if(oldValue != undefined){
	filterCriteria = filterCriteria.replace(regex,oldValue );
	}else{
	filterCriteria = filterCriteria.replace(regex,'');
	}
	}
	//console.log('filterCriteria after replacing actual value-------------->>>',filterCriteria);
	//console.log('matches------------>>>>',matches[1]);
	//console.log('RealTimeVAlue--------------->>>>>',apiNameToInputValueMap[matches[1]]);
	}
	filterCriteria = filterCriteria.replace(/\'/g,'\\\'');*/
	//console.log('filterCriteria after escaping single quotes-------------->>>',filterCriteria);
	var formId =j$('form').attr('id');
	//console.log('filterCriteria',filterCriteria);
	var filtercriteria1;
	if(filterCriteria != undefined){
	    filtercriteria1 = filterCriteria.match(/\[(.*?)\]/g);
    }

	//var filtercriteria11 =filtercriteria1.replace('__r','__c');
	//console.log('filterCriteria1111',filtercriteria1);
	if(filtercriteria1 != undefined){
		for (i = 0; i < filtercriteria1.length; i++) {
			var searchFil = filtercriteria1[i].replace('__r.Name','__c');
			 searchFil = searchFil.replace('[',''); //False +ve for incomplete - sanitization - as we are not using this for sanitization
			 searchFil = searchFil.replace(']',''); //False +ve for incomplete - sanitization - as we are not using this for sanitization
			 var search1=j$('#field'+searchFil).length;
			 //console.log('length------',searchFil);
			 //console.log('searchFil',search1);
			 var search;
			 if(search1 >0){
			 	//console.log('bbbb');
				 search = j$('#field'+searchFil).find('.dependentFilter').find('input.508Input,select.508Input').val();

			 } else {
			 	//console.log('aaaaaaa');
			 	search = j$('#'+searchFil).find('.lookupInput').find('input.508Input').val();
			 }

			 if(search == undefined){
			 	search =  j$('#field'+searchFil).find('span.readonlySpan').find('span').find('a')[0].innerText
			 }

		    //console.log('search11',search);
			filterCriteria = filterCriteria.replace(filtercriteria1[i],search);
			//console.log('regex11',filterCriteria);
		}

	}


	baseURL = "/apex/CustomLookup?fieldId=" + txtId + "&lookupType="+lookupType+"&formId="+formId+"&filterCriteria="+filterCriteria;
	baseURL = baseURL + "&searchTerm="+inputValue+"&pageBlockDetailId="+pageBlockDetailId+"&mergeParameters="+ encodeURIComponent(dynamicEditLayout_flexTableParameters);
	baseURL = baseURL + "&listMergeParameters="+dynamicEditLayout_ListTableParams;
	baseURL = encodeURI(baseURL);
	var height = '550';
	var width = '750';
	//openPopup(baseURL, "lookup", 350, 550, "width="+originalwidth+",height=550,toolbar=no,status=no,directories=no,menubar=no,resizable=yes,scrollbars=yes", false);
	j$('#iframeCustomLookupModalId').attr('src',baseURL);
	//console.log('customLLookuptabId---->>>','#customLookupModalDiv'+dynamicEditLayout_tabMap);
	j$('#customLookupModalDiv').modal();
	lastFocus = document.activeElement;
}

function selectlistChange(value) {
	var check = confirm('Your data is not saved. Do you want to procced?');
	if(check == true) {
		showLoadingPopUp();
		navigationForms('',value);
	}
}

var apiNameToInputValueMap = {};
function getEditlookupMinilayout(thisValue){
	var thisValueId = thisValue.id;
	var result = thisValueId.split('customLookup');
	if(result[1] == ""){
		var keys = Object.keys(apiNameToInputValueMap);
		if(keys.indexOf(result[0])!=-1){
		   result[1] = apiNameToInputValueMap[keys[keys.indexOf(result[0])]];
		}

	}
	showTooltip(thisValue,result[1],'right');
}

function showConfirmFormChanges(value){
	preventDefaultDialogBox= true;// prevent Default Dialog Box for unsaved data entries
	var confirmMsg = formNavWarningMsg;
    j$(".pkg-form-formList option").each( function () {
    	if(j$(this).attr('selected')) {
			j$(this).addClass("pkgSelect");
		}
	});
	bootbox.dialog({		
              message: confirmMsg,
              title: 'Confirmation Message',
              onEscape: function() {},
              backdrop: true,
              closeButton: true,
              animate: true,
              buttons: {
                No: {   
                   label: "Cancel",
                  callback: function() {
					j$(".pkgSelect").prop('selected', true);
                  }
                },
                "Yes": {
                  label: "Ok" ,
                  callback: function(result) { 
                  	//showLoadingPopUp();
                    navigationForms('',value);
                  }
                },
              }
            });
}       

function navigationForms(value,selectedValue) {	 
	var url = flexEditLayout_CurrentPageURL;     
	if(selectedValue!='None'&& selectedValue!=''){  
		showLoadingPopUp();
		console.log('from navigationForms 770 line');
		console.log('from navigationForms 771 url'+url);
		console.log('from navigationForms 772 value'+value);
		console.log('from navigationForms 773 selectedValue'+selectedValue);
		Visualforce.remoting.Manager.invokeAction(
			  _RemotingFlexEditLayoutActions.navForms1,url,value,selectedValue,                                    
					  function(result,event){                          
						  if(event.status){
							  console.log('success',event);
							  var urlnew = decodeURIComponent(result);                                                                    
							  window.open(decodeURIComponent(result),'_self');   																						 
						  }else{							  
							  console.log('result------->>>>',result);
							   location.reload(); //Bug 201540: OSPI - Forms - If we logged out the user from one tab and duplicate tab if we are trying to make the changes, the user should be logged out
						  }                                                      
				  },                         
			  {escape:true}
			  );
	}
}
function closeIframe(hasErrors){
	if(!hasErrors) {
		j$(window.frameElement).parent().parent().prev().find('.flexDismiss').click();
	}
}
function openHelp(){
	if(isInternalDoc == 'true' ){
		window.open('/servlet/servlet.FileDownload?file='+docId,'_blank');
	}else{
		window.open('/apex/'+namespace+'Help?id='+helpId, '_blank','width=900, height=700');
	}
}    
 j$(document).ready(function(){
	fetchHelpDataJS();
	/*Code for making custom lookup modal draggable Start*/
	j$("#customLookupModalDiv").draggable({
		handle: ".modal-header",
		iframeFix: false,
		refreshPositions: true
	});
	/*Code for making custom lookup modal draggable End*/	
 });
 function takeSnapshot(){
	var confirmVal = confirm('You are taking snapshot saved as attachment, do you want to proceed'); 
	if(confirmVal == true){
		executeClass('GGDemo2.MenuSnapshotHelper', '');
	}	
}

function closeModal() {	
	if(event.keyCode==27)
   {
		j$(lastFocus).focus(); // set focus on close lookup modal
   }
}

function createRecordMap(fieldAPIName,fieldType,previousFieldId,thisInfo){
	var m = {};//new Map();
	if(fieldType.toLowerCase() == 'string' || fieldType.toLowerCase() == 'picklist' ){
		m[fieldAPIName]=thisInfo.value;
		apiNameToInputValueMap[fieldAPIName]=thisInfo.value;
	}else if(fieldType.toLowerCase() == 'reference'){
		//console.log('thisInfo.id: ',thisInfo.id);
		var lookupId =  thisInfo.id;
		//console.log('lookupId : ',lookupId );
		if(lookupId.lastIndexOf('_lkwgt') != -1){
			var integerVal = lookupId.lastIndexOf('_lkwgt');
			//console.log('integerVal : ',integerVal );
			var lkpVal = lookupId.substr(0,integerVal);
			//console.log('lookupId: ',lookupId);
			lookupId = lkpVal;
			//console.log('lookupId:lookupId  ',lookupId);
		}
		lookupId  = lookupId+ '_lkid';
		//console.log('thisInfo.id:After ',lookupId  );
		var val = document.getElementById(lookupId).value;
		m[fieldAPIName]=val ;
		apiNameToInputValueMap[fieldAPIName]=val ;
	}
	setupMinilayoutId(fieldAPIName,previousFieldId,apiNameToInputValueMap);
	//console.log('Map apiNameToInputValueMap',apiNameToInputValueMap);
}

var oldLookupId = '';
function setupMinilayoutId(fieldAPIName,previousFieldId,apiNameToInputValueMap){
	if(previousFieldId != null && previousFieldId != '' && oldLookupId == ''){
		previousFieldId = fieldAPIName+'customLookup'+previousFieldId;
		oldLookupId = previousFieldId;
	}
	var newId = fieldAPIName+'customLookup'+apiNameToInputValueMap[fieldAPIName];
	j$("#"+oldLookupId).attr('id',newId);
		// if(oldLookupId.indexOf(fieldAPIName) == -1){
		// 	console.log('Lookup changed');
		// 	oldLookupId = '';
		// }
	 //    var newId = fieldAPIName+'customLookup'+apiNameToInputValueMap[fieldAPIName];
	 //    if(oldLookupId == ''){
	 //    	//console.log('replace with  new id');
	 //    	j$("#"+fieldAPIName+'customLookup').attr('id',newId);
	 //    }else{
	 //        //console.log('replacing old id');
	 //    	j$("#"+oldLookupId).attr('id',newId);
	 //    }
	oldLookupId = newId;
}

function showTooltip(thisVal,parentId,positVal){
	if(parentId != null && parentId != 'null' &&parentId != undefined && parentId != ''){
		//console.log('parentId144====',parentId);
		j$('#'+thisVal.id).tooltipster({
			theme: 'tooltipster-shadow',
			content :'Loading...',
			updateAnimation:false,
			contentAsHTML:true,
			interactive:true,
			minWidth:100,
			//position:positVal,
			//   autoClose:false,

			functionBefore: function(origin, fetchLayout) {
				var parId = origin[0].childNodes[0].value;
				if(parId===undefined || parId == ""){
					parId = escape(parentId);
				}
				/*
				console.log('parentId1111====',origin[0].id.slice(origin[0].id.indexOf('customLookup') + 'customLookup'.length));
				if(origin[0].id.indexOf('customLookup') > -1 ){
					parId = origin[0].id.slice(origin[0].id.indexOf('customLookup') + 'customLookup'.length);
				}*/
				fetchLayout();
				Visualforce.remoting.Manager.invokeAction(
						_RemotingFlexEditLayoutActions.fetchMiniLayout,parId,
					function(result, event){
						if (event.status) {
							if(!jQuery.isEmptyObject(result)){
								tooltipContent =  '<div class="tooltipWrapper">'
								tooltipContent = structureMiniLayout(result,origin,tooltipContent);
								tooltipContent +='</div>';
								origin.tooltipster('content', tooltipContent );
							}else{
								alert('2');
								j$('#'+thisVal.id).tooltipster('hide');
							}
						}
					}
				);
			}
		});
		j$('#'+thisVal.id).tooltipster('show');
	}
}
function hideHelpTooltip(thisVal,thm,id){
	j$('[id="'+id+'tooltip"]').tooltipster('hide');
}