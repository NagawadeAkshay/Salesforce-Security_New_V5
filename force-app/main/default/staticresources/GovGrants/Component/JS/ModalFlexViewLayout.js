var j$ = jQuery.noConflict();
var lastClickedTabId;
var pageLayoutId,recordTypeId,recordTypeName;
if(j$.cookie('setup') == 'present') {
	j$(".pageLayoutSetupIcon").show();
}
else{
	j$(".pageLayoutSetupIcon").hide();
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
function setCollapseIcon(elementId){	
	//console.log('======CollapseIcon Entered=========',elementId);
	j$('#'+elementId).find("span.togglePageBlock ").toggleClass('fa-caret-down fa-caret-up');
	//console.log('========ValueInCollapse===',j$('#'+elementId).find("span.togglePageBlock "));
}
function saveSelectedRecordId(pageLayout,recordType,rtName){
	//saveRecordTypeId(name);
	var nextBtnID= document.getElementById('nextId');
	j$(nextBtnID).removeClass("customDisableBtn");
	j$(nextBtnID).addClass("customBtn");
	nextBtnID.disabled = false;
	pageLayoutId = pageLayout;
	recordTypeId = recordType;
	recordTypeName = rtName;
}
//Make the final tab in Left-Right orientation have full width of the page if it is the only tab on the row
j$('.tab-pane').each(function(e) {
	if (j$(this).find('.LEFT_RIGHT').length %2 != 0){
		j$(this).find('.LEFT_RIGHT:last-child').css('width', 'auto');
		j$(this).find('.LEFT_RIGHT:last-child').css('display', 'block');
	}
});

function cancelOperation(){
	var url = modalFlexViewLayout_retURL;
	window.open(url,'_self');
}

function saveSelectionJS(){	
	if(pageLayoutId){
		saveSelection(pageLayoutId, recordTypeId, recordTypeName);
	}
}

function redirect(url){	
	window.open(url,'_self');
}

 function setPageTitle(myPageTitle) {
	pageTitleName = myPageTitle;
}

function setCookie(tabId,tabName){
	if(lastClickedTabId != ''){
		j$('#'+lastClickedTabId).parent().removeClass('active');               
	}	
	var rcrdId = modalFlexViewLayout_id;
	j$.cookie(modalFlexViewLayout_objectName, tabId+':'+rcrdId,{path: '/'});
	j$.cookie(modalFlexViewLayout_objectName+'-Name', tabName+':'+rcrdId,{path: '/'});
	var topBarOrDropDownFlag = j$('#'+tabId).parent().parent().attr('id');	
	if(topBarOrDropDownFlag == 'tabDropDownMenuBar'){
		j$('#tabDropDownMenuBar').append(j$('#topTabsID').children().last().prev());
		//j$('#topTabsID').append(j$('#'+tabId).parent());
		j$('#topTabsID').children().last().before(j$('#'+tabId).parent());
	}
	lastClickedTabId = tabId;
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

j$(document).ready(function(){  	
	try {
		parent.showModalTitle(trustHTML(modalFlexViewLayout_pageHeader));
	}catch(err) {
		//console.log('Error in showModalTitle', err);
	}

	var allTabsLength = j$('#topTabsID').find('li').length;   
	
	if(modalFlexViewLayout_windowTabTitle == null ||modalFlexViewLayout_windowTabTitle == undefined || modalFlexViewLayout_windowTabTitle == ''){
	setPageTitle(modalFlexViewLayout_setPageTitle);
	}else{
		setPageTitle(modalFlexViewLayout_windowTabTitle);
	}
	
	//setPageTitle(modalFlexViewLayout_setPageTitle);
	var layout = modalFlexViewLayout_layoutType;
	lastClickedTabId = '';
	if(layout == 'Edit'){
		/*var textElement = j$("<span class=\'requiredFieldMessage'\ style=\'position:absolute'\></span>");
		textElement.text(modalFlexViewLayout_FieldsMarkedRequired);
		j$("#topTabsID").append(textElement);*/
		var textElement = j$("<span class=\'pull-right'\ >are required </span><span class=\'pull-right color-red'\ style=\'margin: 0 5px;'\> * </span><span class=\'pull-right'\>Fields marked as  </span>"); /* UI-Shrawan-10092015 Removed inline style */
		j$("#topTabsID").append(textElement)
	}

	var aHref = j$( "span[customId^='005'] a" );	
	for(var i=0;i<aHref.length;i++){		
		var n = aHref[i].href.lastIndexOf('/');		
		var idn = aHref[i].href.substring(n+1);		
		aHref[i].href = '/apex/' + modalFlexViewLayout_namespace +'ProfileRedirect?id='+idn;            
	}	
	var newTabHTML = '';
	var tabsMaxWidth = j$('#topTabsID').width() - 50;                
	var tempTabsLength = 0; 
	var plusTab1 = '<li class="listyle"><a class="dropdown-toggle" href="#" tabindex="0" id="tabDropDownMenu" data-toggle="dropdown" title="More Tabs"><span class="fa fa-plus"></span><span class="hidden508">More Tabs</span></a><ul id="tabDropDownMenuBar" class="dropdown-menu dropdown-menu-right" aria-labelledby="tabDropDownMenu" style="width: auto;">';
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
	var recId = modalFlexViewLayout_id.substring(0,3);
	j$.cookie('apex__objectID', recId , {path: '/'});	
	var tabId;
	var tabName;
	if(modalFlexViewLayout_objectName != ''){
		tabId = j$.cookie(modalFlexViewLayout_objectName);
		tabName = j$.cookie(modalFlexViewLayout_objectName+'-Name');
	}	
	noMatch = true;
	if(tabId){ 
		var res = tabId.split(":");		
		var rcrdId = modalFlexViewLayout_id;		
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
		j$('#topTabsID a:first').tab('show');
		var firsTabId = j$('#topTabsID a:first').attr('id');                
		var rcrdId = modalFlexViewLayout_id;
		j$.cookie(modalFlexViewLayout_objectName, firsTabId+':'+rcrdId ,{path: '/'});		
	}    
});
var viewAttachmentField = function(classfications, pageBlockDetailId) {
	//console.log('classfications',classfications);
	var recordId = escape(modalFlexViewLayout_id); 
	j$('#viewFieldAttModalField').modal();
	j$('#iframeviewFieldAttContentIdField').attr('src','/apex/FieldAttachmentAdd?parentId='+ modalFlexViewLayout_id +'&classification='+ classfications+'&pageBlockDetailId=' + pageBlockDetailId);//Here pass pageblockdetail id because attchement is available at pageblock detail and to get its id through parameter in fieldattchmentaddpage
}

  function showTooltip(thisVal,parentId){  	  
	   if(parentId != null || parentId != undefined || parentId != ''){
	   j$('#'+thisVal.id).tooltipster({                    
			theme: 'tooltipster-shadow',
			content :'Loading...',
			updateAnimation:false,
			contentAsHTML:true, 
			interactive:true, 
			minWidth:100, 
			//position:'right',   
			//autoClose:false,                        
			functionBefore: function(origin, fetchLayout) {
				fetchLayout();
				Visualforce.remoting.Manager.invokeAction(
					_RemotingModalFlexViewLayoutActions.fetchMiniLayout,parentId,
					function(result, event){
						if (event.status) {						
							if(!jQuery.isEmptyObject(result)){
								tooltipContent =  '<div class="tooltipWrapper" >'; 
								tooltipContent = structureMiniLayout(result,origin,tooltipContent);
								tooltipContent +='</div>';
								//console.log(tooltipContent );
								origin.tooltipster('content', tooltipContent );
							}else{
								j$('#'+thisVal.id).tooltipster('hide');
							}							
						}
				});
			}                   
		}); 
		j$('#'+thisVal.id).tooltipster('show');
		//j$('body').css('overflow-y', 'hidden');  
	   }
  }     
function hideTooltip(thisVal,parentId){  
	j$('#'+thisVal.id).tooltipster('hide');
}
function showHelpTooltip(thisVal,thm,id){             
   //console.log('thisVal',thisVal);                     
   j$('[id="'+id+'tooltip"]').tooltipster({
		theme: thm,                     
		multiple: true,
		animation :'fade',          
		contentAsHTML: true,    
		content : thisVal
	});    
	j$('[id="'+id+'tooltip"]').tooltipster('show');                                                                 
}
function hideHelpTooltip(thisVal,thm,id){             	   
		j$('[id="'+id+'tooltip"]').tooltipster('hide');                                                                 
}
	   
/*function getMiniLayoutContent(result,origin){
	var tooltip = tooltipContent;	
	var tab = result.Tab;
	var record = result.Record;                           
	if(tab != null) {
	j$.each(result.Tab, function(i, tabVal) { 
	  j$.each(tabVal.pageBlocks, function(j, pageBlockVal) {  
		  tooltip +='<p class="tooltip-title">'+record ['Name']+'</p>';   
		  tooltip +='<div class="panel-body">';
		  tooltip +='<form class="form-horizontal" role="form">'
		  j$.each(pageBlockVal.fields, function(k, field) {   
				if(field.hideField != 'true')   {                     
					tooltip += '<div class="form-group border-ext ">';
					tooltip += ' <div class="row">';
					   // tooltip += ' <div class="col-md-4 col-xs-12 col-sm-12">';
						tooltip += ' <div class="col-md-4 col-xs-4 col-sm-4">';
						tooltip += field.fieldLabel;
						tooltip += '</div>';				  
						var fieldVal =  j$('<span/>').html(record [field.fieldAPIName]).text();  
						if(field.dataType == 'CURRENCY'){
							fieldVal = '$' + fieldVal;
						}						
						tooltip += ' <div class="col-md-8 col-xs-8 col-sm-8" style="word-wrap:break-word; font-weight: bold;">';
						tooltip += decodeURI(fieldVal);     
						tooltip += '</div>';                                                                                     
					tooltip += '</div>';
					tooltip += '</div>';
					tooltip +='<br/>';					
				}                                                        
		  })
	  })
	})
	tooltip +='</form>';
	tooltip +='</div>';             
	}else{
		tooltip +='<p class="tooltip-title">'+record ['Name']+'</p>';
		tooltip +='<div id="TooltipBody" class="panel-body">';
		tooltip +='<form class="form-horizontal" role="form">';
		tooltip += '<div class="form-group border-ext ">';
		tooltip += ' <div class="row">';                                   
		tooltip += ' <div class="col-md-4 col-xs-4 col-sm-4">';
		tooltip += 'Name';
		tooltip += '</div>';				
		tooltip += ' <div class="col-md-8 col-xs-8 col-sm-8" style="word-wrap:break-word; font-weight: bold;">';
		tooltip += record ['Name'];     
		tooltip += '</div>';   
		tooltip += '</div>';
		tooltip += '</div>';
		tooltip +='</form>';
		tooltip += '</div>';
	}
	return tooltip;
}*/

function buttonOnClickAction(buttonId, url, className, showModal, height, width, title, warningMsg, 
					newWindow,refreshBehaviour){	
	var isDelete = false,confirmStatus = '';
	var isSubmitWarning = false;
	var deleteMessage = modalFlexViewLayout_DeleteConfirmLabel;
	if(warningMsg != ''){
	   confirmStatus = confirm(warningMsg); 
	   isSubmitWarning = true;
	}
	var lstOfErrors = j$(".dynamic-msg-box-margin");
	if(lstOfErrors != undefined && lstOfErrors.length >0){
		var errorMsg = '';
		for(var i = 0; i<lstOfErrors.length; i++){
			if(errorMsg == ''){
				errorMsg = lstOfErrors[i].innerText;
			}else{
				errorMsg += ';'+lstOfErrors[i].innerText;
			}
			if(errorMsg != ''){
				localStorage.name= errorMsg;
			}
		}
		
	}
	
	else if(title.toLowerCase() == 'delete'){		
	   bootbox.dialog({             
		  message: deleteMessage,            
		  title:"Confirm",  
		  onEscape: function() {},
		  backdrop: false,
		  closeButton: true,
		  animate: true,
		  buttons: {
			No: {   
			   label: "No",
			   className: "customBtn btn-ext",
			  callback: function() {}
			},
			"Yes": {
			  label: "Yes" ,
			  className: "customBtn btn-ext",
			  callback: function(result) {
				 if(result){
					  confirmStatus = true;
					  isDelete = true;                          
				} 
			  }
			},
		  }
		});  
	}	
	if(height == '' || height == null){
		height = '200';
	}
	if(width == '' || width == null){
		width = '400';  
	}
	if(!isSubmitWarning || (isDelete == true && confirmStatus == true) || (isSubmitWarning == true && confirmStatus == true)){		
		if(showModal == 'true' || showModal == true){ 
				alert('new modal window is not supported as you are already inside a modal window');              
			}else if (newWindow == true || newWindow == 'true') {
				var left  = (j$(window).width()/2)-(width/2);
				var top   = (j$(window).height()/2)-(height/2);
				var spec = "width=" + width + ", height=" + height + ", menubar=no, resizable=yes, " +
						"scrollbars=yes, status=no, toolbar=no, location=no, top=" + top + ", left=" + left; 
				window.open(url, "popup", spec);
			}else if (title.toLowerCase() == 'back') {				
				window.open(modalFlexViewLayout_retURL, '_blank');                           
			}else{
				if(title.toLowerCase() == 'edit'){
					if(url.indexOf('saveURL') == -1 && url.indexOf('DynamicEditLayout') != -1){
						if(url.indexOf('?') == -1){
							url = url + '?saveURL='+encodeURIComponent('/apex/DynamicViewLayout?id='+modalFlexViewLayout_rcrdId+'&template='+modalFlexViewLayout_tmplName);
						}else{
							url = url + '&saveURL='+encodeURIComponent('/apex/DynamicViewLayout?id='+modalFlexViewLayout_rcrdId+'&template='+modalFlexViewLayout_tmplName);
						}
					}
				}				
				executeClassOrURL(buttonId, url, className,refreshBehaviour);
		  }
	 }
}

function pageDetailRedirect(Id){	
	var idVal = Id;
	if(idVal != undefined){
		if (idVal.substr(0, 3) == '005'){ 
		    //Prajakta: To open URL in new tab.
		    window.open('/apex/ProfileRedirect?id=' + idVal,'_blank');
		} 
		else if(idVal.substr(0, 3) == '00G'){
		    //Prajakta: To open URL in new tab.
		    window.open('/apex/ProfileRedirect?id=' + idVal,'_blank');
		}
		else{
			//Prajakta: To open URL in new tab.
			window.open('/'+idVal, '_blank');
		}
	}
}

function executeClassOrURL(actionId, url,className, refreshBehaviour){	
	if(url != ''){
	   showLoadingPopUp();
	   redirectTo(url);
	}
	else if(className != ''){
		showLoadingPopUp();		
		executeClass(className, actionId); 
		if(refreshBehaviour != undefined){
			loadRefreshBehaviour(refreshBehaviour);
		}	
	} 
} 

function loadRefreshBehaviour(refreshBehaviour){
	if(refreshBehaviour.toLowerCase() == 'refresh parent page'){
		window.top.location.reload();	
	}else if(refreshBehaviour.toLowerCase() == 'refresh the entire page'){
		window.location.reload();	
	}
	
}

function redirectTo(sUrl) { 
	window.location = sUrl; 
} 
function newWindow(sUrl) {	
	window.open(sUrl);
}
/*Header Action Button Panel*/
var headerButtonsPanel = angular.module('headerButtonsPanel', []);
var recId = modalFlexViewLayout_recordId;
var layoutId = modalFlexViewLayout_layoutId;
headerButtonsPanel.controller('FlexLayoutActionsGenerator', function ($q,$scope,$timeout,$sce) {    
	$scope.trustSrcHTML = function(src) {
		return $sce.trustAsHtml(src);
	} 
	$scope.loadActions = function(){
		$scope.paramMap = {};
		Visualforce.remoting.Manager.invokeAction(
			_RemotingModalFlexViewLayoutActions.decideActions,
			recId, layoutId,$scope.paramMap,                  
			function(retVal, event){                         
				if (event.status) {
					$scope.$apply(function () { 
						if(retVal.Success == true){
							$scope.actions = retVal.Actions;
							//to enable header action button we use Custom setting named EnableModalHeaderActionButtons boolean value
							$scope.EnableModalHeaderActionButtons = retVal.EnableModalHeaderActionButtons;
							
						}else{
							$scope.errormessage = $scope.trustSrcHTML(retVal.Error);
							alert('Error while rendering actions: ' + retVal.Error);
						} 
					});                                                                                                            
				}                         
			}, 
			{ buffer: false, escape: false}
		);        
	} 
	$scope.loadActions();           
	$scope.buttonOnClickAction = function(act) {		
		buttonOnClickAction(act.action.Id, act.url, act.className, act.openModal, act.modalHeight, act.modalWidth,act.action.Name, act.submitWarningMsg, act.openNewWindow, act.refreshBehaviour);
	}
});
 angular.bootstrap(document.getElementById("headerButtonsPanel"),['headerButtonsPanel']);
/*Footer Action Button panel*/
var footerButtonsPanel = angular.module('footerButtonsPanel', []);
footerButtonsPanel.controller('FlexLayoutActionsGenerator', function ($q,$scope,$timeout,$sce) {    
	$scope.trustSrcHTML = function(src) {
		return $sce.trustAsHtml(src);
	} 
	$scope.loadActions = function(){
		$scope.paramMap = {};
		Visualforce.remoting.Manager.invokeAction(
			_RemotingModalFlexViewLayoutActions.decideActions,
			recId, layoutId,$scope.paramMap,                  
			function(retVal, event){                         
				if (event.status) {
					$scope.$apply(function () {                                						
						if(retVal.Success == true){
							$scope.actions = retVal.Actions;
						}else{
							$scope.errormessage = $scope.trustSrcHTML(retVal.Error);
							alert('Error while rendering actions: ' + retVal.Error);
						} 
					});                                                                                                            
				}                         
			}, 
			{ buffer: false, escape: false}
		);        
	} 
	$scope.loadActions();           
	$scope.buttonOnClickAction = function(act) {		
		buttonOnClickAction(act.action.Id, act.url, act.className, act.openModal, act.modalHeight, act.modalWidth,act.action.Name, act.submitWarningMsg, act.openNewWindow,act.refreshBehaviour);
	}
});
angular.bootstrap(document.getElementById("footerButtonsPanel"),['footerButtonsPanel']); 
