var j$ = jQuery.noConflict(); 
var buttonActionId ='';
var refreshBehaviour = '';
var promptVal = '';
var skipWarningMessage = false;
var CheckIfCondition = '';

//Code to change the Tab of the page depending on 'tabName' paramter in  the URL
j$(document).ready(function() {
        /*to remove <br> tag from begining of text*/
		j$('.static-text').each(function() {
			var str = j$(this).html();
			var removedBr = str.replace(/^(<br\s*\/?>)+/,'');
			j$(this).html(removedBr);
		});

		if((flexViewLayout_CurrentPageTabName != null) && (flexViewLayout_CurrentPageTabName != '')){
	 	var tabId = j$('#myTabs a[name^=\''+flexViewLayout_CurrentPageTabName+'\']').attr('id');
	 	if(tabId != undefined){
	 		setCookie(tabId,flexViewLayout_CurrentPageTabName);	
		 	j$('#myTabs').find('li').removeClass('active');
		 	j$('#'+tabId).parent().addClass('active');
		 	j$('#myTabbedContent').children().first().removeClass('active in');
		 	tabId = tabId.replace('tab','');
		 	j$('#myTabbedContent div[id='+tabId+']').addClass('active in');
	 	}
	}	
});

function redirectTo(sUrl) { 
	window.location = sUrl ; 
} 

function newWindow(sUrl) {	
	window.open(sUrl);
}
function setCollapseIcon(elementId){	
	//console.log('======CollapseIcon Atul Entered=========',elementId);
	j$('#'+elementId).find("span.togglePageBlock ").toggleClass('fa-caret-down fa-caret-up');
	////console.log('========ValueInCollapse===',j$('#'+elementId).find("span.togglePageBlock "));
}
function refresh(){
	//console.log('here'+window.self.location);
	var isRefresh = false;
	if(refreshBehaviour == 'Refresh the entire page'){
		showLoadingPopUp(); 
		window.self.location.reload(true);
	}
  }

  function pdfOpenModal(namespace,instancercrdId,pageTemplateNM,flexTableParam,listParm,packageId,formTypeJSON,pdfRenderType){
	/*
		let exportPageURL = '/apex/' +  namespace + 'DynamicLayoutExport?id='+instancercrdId+'&viewTemplateName='+pageTemplateNM+'&flexTableParam='+encodeURIComponent(flexTableParam)+'&listParm='+listParm+'&packageId='+packageId+'&formTypes='+JSON.stringify(formTypeJSON)+'&mode=pdf';
	  	window.open(encodeURI(exportPageURL));
	*/  
	var exportPageURL = '';
	if(flexViewLayout_CurrentPageparentLayoutId != "") 
		exportPageURL = '/apex/' +  namespace + 'DynamicLayoutExport?id='+instancercrdId+'&viewTemplateName='+encodeURIComponent(pageTemplateNM)+'&flexTableParam='+encodeURIComponent(flexTableParam)+'&listParm='+encodeURIComponent(listParm)+'&packageId=&formTypes='+JSON.stringify(formTypeJSON)+'&mode=pdf';
	else
		exportPageURL = '/apex/' +  namespace + 'DynamicLayoutExport?id='+instancercrdId+'&viewTemplateName='+encodeURIComponent(pageTemplateNM)+'&flexTableParam='+encodeURIComponent(flexTableParam)+'&listParm='+encodeURIComponent(listParm)+'&packageId='+packageId+'&formTypes='+JSON.stringify(formTypeJSON)+'&mode=pdf';
	window.open(exportPageURL); 
  }

function executeClassOrURL(actionId, url,className,promptVal,recordTypeName){	
	if(url != ''){
		CheckIfCondition = 'executeURL';
		isURLActionAlreadyPerformed(url,null);
	  // redirectTo(url);
	}
	else if(className != ''){
		showLoadingPopUp();		
		executeClass(className,actionId,promptVal);        
	} 
	else if(recordTypeName == 'AnonymousExecute'){
		showLoadingPopUp();		
		executeClass(className,actionId,promptVal);        
	}
	
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

function showHelpTooltipFooter(thisVal,thm,id){	
	if(thisVal != undefined){
	   j$('#'+id+'tooltipFooter').tooltipster({                    
			theme: thm,
			multiple: true,
			content : '<span>'+ thisVal + '</span>',
			contentAsHTML:true, 
			animation :'fade',  
			position:'top',
			autoClose:true       
		}); 
		j$('#'+id+'tooltipFooter').tooltipster('show');
	}    
}

function showModalTitle(modalTitle) {
	if (modalTitle == null) {
		modalTitle = '';
	}
	modalTitle = modalTitle.replace('<br />', ' - ');
	modalTitle = modalTitle.replace('<br/>', ' - ');
	j$("#modalLabel").text(modalTitle);
}

function handleFlexGridUnsavedData(actionVal){
	var gridControllerElements = j$('div[ng-controller="inlineEditGridCtrl"]');
            var errormsgArry = new Array();
            for(var i=0; i < gridControllerElements.length; i++) {
                var scope = angular.element(gridControllerElements[i]).scope();
                if(scope.mode == 'edit'){
                     var gridConfirmMsg = flexViewLayout_GridConfirmMsg;
                     var temp = gridConfirmMsg.replace("(!FlexGridName)",scope.parentTableMetadata.FlexTableHeader);
                    errormsgArry.push(temp);    
                }
            }
            var enahncedGridLst = j$('.enahncedGrid');
			for(let i=0; i < enahncedGridLst.length; i++) {
			    let scope = angular.element(enahncedGridLst[i]).scope();
			    if(scope && scope.communicator && (scope.communicator.isMassSave || scope.communicator.isSave)){
			        let gridConfirmMsg = flexViewLayout_GridConfirmMsg;
					let gridTableName = scope.communicator.parentTableHeader;
			        let temp = gridConfirmMsg.replace("(!FlexGridName)", gridTableName);
			        errormsgArry.push(temp);    
			    }
			}
            showConfirmBox(errormsgArry, actionVal);
}

function showConfirmBox(errMsgArr, actionVal){
	
        if(errMsgArr.length == 0) {
          buttonOnClickAction(actionVal.action.Id, actionVal.url, actionVal.className, actionVal.openModal, actionVal.modalHeight, actionVal.modalWidth,actionVal.action.Name, actionVal.submitWarningMsg, actionVal.openNewWindow,actionVal.refreshBehaviour,actionVal.promptDialogHeader,actionVal.promptDialogInputText,actionVal.action.RecordType.DeveloperName,actionVal.recordId,actionVal.openInTab,"true");
        } else {
            bootbox.dialog({
              message: errMsgArr.join("<br>"),
              title: flexViewLayout_GridConfirmTitle,
              onEscape: function() {},
              backdrop: true,
              closeButton: true,
              animate: true,
              buttons: {
                No: {   
                   label: "Cancel",
                  callback: function() {
                      errMsgArr.length = 0;
                       //set to zero
                  }
                },
                "Yes": {
                  label: "Continue" ,
                  callback: function(result) {
                  buttonOnClickAction(actionVal.action.Id, actionVal.url, actionVal.className, actionVal.openModal, actionVal.modalHeight, actionVal.modalWidth,actionVal.action.Name, actionVal.submitWarningMsg, actionVal.openNewWindow,actionVal.refreshBehaviour,actionVal.promptDialogHeader,actionVal.promptDialogInputText,actionVal.action.RecordType.DeveloperName,actionVal.recordId,actionVal.openInTab,"true");
                  }
                },
              }
            });
        }
     }

function buttonOnClickAction(buttonId, url, className, showModal, height, width, title, warningMsg, 
					newWindow,actRefreshBehaviour,promptDialogHeader,promptDialogInputText,recordTypeName,recordId,openNewTab,hasErrors){
    			
	buttonActionId = buttonId;	
	//console.log('refreshBehaviour ==> '+actRefreshBehaviour);
	refreshBehaviour = actRefreshBehaviour;
	//console.log('refreshBehaviour ==> '+refreshBehaviour);
	var confirmStatus = false;

	
	var deleteMessage = flexViewLayout_DeleteConfirmLabel;
	if(!skipWarningMessage){
		if(warningMsg != ''){
		 	   	 bootbox.dialog({
            message: warningMsg,
            title: "Confirm",
            onEscape: function() {},
            backdrop: false,
            closeButton: true,
            animate: true,
            buttons: {
                No: {
                    label: "No",
                    className: "customBtn btn-ext",
                    callback: function() {
                    
                    	hideLoadingPopUp();                   	
                    }
                },
                "Yes": {
                    label: "Yes",
                    className: "customBtn btn-ext",
                    callback: function(result) {
                       //	executeClassOrURL(buttonId, url, className,promptVal,recordTypeName);
						  confirmStatus = true;
					   //User Story 114986: Internal - Remove page loading resources for page loading time improvement - from loading icon
						//  showLoadingPopUp();
			  		OnClickConfirmStatus(buttonId, url, className, showModal, height, width, title, warningMsg, 
					newWindow,actRefreshBehaviour,promptDialogHeader,promptDialogInputText,recordTypeName,recordId,confirmStatus,openNewTab);
	
                    }
                },
            }
        });

		   	
		   	
		}
		else{
			confirmStatus = true; 
			showLoadingPopUp();
			OnClickConfirmStatus(buttonId, url, className, showModal, height, width, title, warningMsg, 
					newWindow,actRefreshBehaviour,promptDialogHeader,promptDialogInputText,recordTypeName,recordId,confirmStatus,openNewTab,"true");
	
	}
	}

		
	}

	function OnClickConfirmStatus(buttonId, url, className, showModal, height, width, title, warningMsg, 
					newWindow,actRefreshBehaviour,promptDialogHeader,promptDialogInputText,recordTypeName,recordId,confirmStatus,openNewTab,hasErrorT){
		var isSubmitWarning = true;
		skipWarningMessage= false;
		var isDelete = false;
		var lstOfErrors = j$(".dynamic-msg-box-margin");
		if(hasErrorT === "true" && lstOfErrors != undefined && lstOfErrors.length >0){
			var errorMsg = '';
			for(var i = 0; i<lstOfErrors.length; i++){
				if(errorMsg == ''){
					errorMsg = lstOfErrors[i].innerText;
				}else{
					errorMsg += ';'+lstOfErrors[i].innerText;
				}
				if(errorMsg != ''){
					if(className == ''){
						if(flexViewLayout_isFormsURL){
							localStorage.setItem(flexViewLayout_CurrentPageformId,errorMsg);
						}else{
							localStorage.setItem(recordId,errorMsg);
						}
					}
				}
			}
			
		}

		// Add for to get input from user for Recall Functionality
	if(promptDialogHeader != '' && promptDialogInputText != ''  && confirmStatus == true ){
	   hideLoadingPopUp();		
	   var combintedTitle = promptDialogHeader ;
	   var msg = promptDialogInputText;	
       bootbox.prompt({
                                title: combintedTitle,
                                inputType: 'textarea',
                                size: "small",
                                callback: function (result) {
                                if(result){
                                  promptVal = result;	
                                  promptDialogHeader = '';
                                  promptDialogInputText ='';	
                                  skipWarningMessage = true;
                                  
                                  OnClickConfirmStatus(buttonId,url,className,showModal,height,width
                                 ,title,warningMsg,newWindow,actRefreshBehaviour,promptDialogHeader,promptDialogInputText,null,null,true,openNewTab);
                                  
                                  //console.log('Value is--->',result);								  
                                } 	
								if(result != null){
									if(result.length == 0){
										alert("Please Enter Comments");
										skipWarningMessage = true;
										OnClickConfirmStatus(buttonId,url,className,showModal,height,width
                                 		,title,warningMsg,newWindow,actRefreshBehaviour,promptDialogHeader,promptDialogInputText,null,null,true,openNewTab);
										
								 }
								}
                                 
                                }
                            }).find('.bootbox-body').prepend(msg);
       //alert('Entered Value--->'+promptVal);
       //if(confirmStatus == false){
		   
	  // }
	} else {	
	if(height == '' || height == null){
		height = '200';
	}
	if(!isSubmitWarning || (isDelete == true && confirmStatus == true) || (isSubmitWarning == true && confirmStatus == true)){		
		if(showModal == 'true' || showModal == true){ 				
				hideLoadingPopUp();	
				CheckIfCondition = 'showModal';
				j$('#iframeActionModalIdViewLayout').attr('src',url);				
				var widthStr = '50%'
				if(width == '' || width == null){
					width = 50;  
				}
				if(width < 100) {
					widthStr = width + '%'
				} else {
					widthStr = width + 'px'
				}
				
				//j$("#modalLabel").text('test');
				j$('#dynamicActionModalDivmodalDialog').css('width', widthStr);
				isURLActionAlreadyPerformed(url,null);			
			}else if (newWindow == true || newWindow == 'true') {
				CheckIfCondition = 'newWindow';
				hideLoadingPopUp();
				if(width == '' || width == null){
					width = '400';  
				}
				var left  = (j$(window).width()/2)-(width/2);
				var top   = (j$(window).height()/2)-(height/2);
				var spec = "width=" + width + ", height=" + height + ", menubar=no, resizable=yes, " +
						"scrollbars=yes, status=no, toolbar=no, location=no, top=" + top + ", left=" + left; 
				isURLActionAlreadyPerformed(url,spec);
				//window.open(url, "popup", spec);
			}else if(openNewTab == true || openNewTab == 'true'){
					CheckIfCondition = 'openNewTab';
			        hideLoadingPopUp();
                    //console.log("Window location==="+window.location.href);
					let currUrl = window.location.href;
					currUrl = encodeURIComponent(currUrl); 
                    url = url + '&retURL='+currUrl;
                            // Added Encoding for URL Reviewd By: Yogesh Gaikwad.
					isURLActionAlreadyPerformed(url,null);
                   // window.open(url,"_blank");
			}else{			
					executeClassOrURL(buttonId, url, className,promptVal,recordTypeName);
			  }
		  }
	 }
}

function isURLActionAlreadyPerformed(url,spec){	
	var url = url;
	var spec = spec;

	if(buttonActionId == undefined){
		buttonActionId = '';
	}
	
	Visualforce.remoting.Manager.invokeAction(
		_RemotingFlexViewLayoutActions.isUrlActionAlreadyPerformed,flexViewLayout_recordId,buttonActionId,                               
				function(result,event){                          
					if(event.status){
						
						if(result.Success == true){ 
							if(CheckIfCondition == 'executeURL'){
								redirectTo(url);
							}else if(CheckIfCondition == 'openNewTab'){ 
								window.open(url,"_blank");
							}else if(CheckIfCondition == 'newWindow'){ 
								window.open(url, "popup", spec);
								
							}else if(CheckIfCondition == 'showModal'){ 
								j$('#dynamicActionModalDiv').modal();
								lastFocus = document.activeElement;		
							} else{
								console.log('result------->>>>',result);
							}     
						}else{
							showErrorMessageRelatedAction();
						} 
																													 
					}                                                     
			},                         
		{escape:true}
		);
}

/*to open page in same window*/
function pageDetailRedirect(Id){	
     //location.href = '/'+Id;
     var idVal = Id;
   
	if(idVal != undefined){
		if (idVal.substr(0, 3) == '005'){ 
            location.href ='/apex/ProfileRedirect?id=' + idVal;
		} 
		else if(idVal.substr(0, 3) == '00G'){
            location.href ='/apex/ProfileRedirect?id=' + idVal;
		}
		else{
			
			location.href ='/'+idVal+'?isdtp=vw';
		}
	} 
}
function closeModal(){
	j$('#dynamicActionModalDiv').addClass('fade ');
	j$('#dynamicActionModalDiv').css('display', 'none');
	j$('#dynamicActionModalDiv').attr('aria-hidden', 'true');
}
var tooltipContent ;
var lastClickedTabId;
var pageLayoutId,recordTypeId,recordTypeName;
function openFormEditMode() {
	var Id = flexViewLayout_CurrentPageId;
	var formId = flexViewLayout_CurrentPageformId;
	var packageId = flexViewLayout_CurrentPagepackageId;
	var parentId = flexViewLayout_CurrentPageparentId;
	var parentLayoutId = flexViewLayout_CurrentPageparentLayoutId;
	var templateName = flexViewLayout_CurrentPagetemplateName;
	var formtypes = flexViewLayout_CurrentPageformTypes; 
	var formInstanceId = flexViewLayout_CurrentPageformInstanceId;          
	//console.log('formInstanceId',formInstanceId);
	var pageUrl = 'DynamicFormEdit?formTypes='+ formtypes +'&formId='+ formId +'&id='+ Id +'&packageId='+ packageId +'&parentId='+ parentId +'&parentLayoutId='+ parentLayoutId +'&templateName='+ templateName+'&formInstanceId='+formInstanceId;
	//if(Id != undefined && Id != '' && Id != null) {		
	//} else {
	//}   pageUrl = 'DynamicFormEdit?formId='+ formId +'&packageId='+ packageId +'&parentId='+ parentId +'&parentLayoutId='+ parentLayoutId +'&templateName='+ templateName;     								   
	window.open(pageUrl,'_self');
}
/* US - 199729 START - On click of Download PDF with forms button we will call  createSnapshotwithForms method from DynamicLayoutController class */
	function downloadAsPDFWithForms(recId1,templatename,keyvalueMap,listparams){
		console.log('recordIdIs::');	
		console.log('keyvalueMap::'+keyvalueMap);
		console.log('listparams::'+listparams);
		console.log('recId::'+recId1);
		console.log('templatename::'+templatename);
		var classname1 = 'abc';
		createSnapshotwithForms(recId1,templatename, keyvalueMap,listparams);

	}
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
//Make the final tab in Left-Right orientation have full width of the page if it is the only tab on the row
/*
j$('.tab-pane').each(function(e) {
	if (j$(this).find('.LEFT_RIGHT').length %2 != 0){
		j$(this).find('.LEFT_RIGHT:last-child').css('width', 'auto');
		j$(this).find('.LEFT_RIGHT:last-child').css('display', 'block');
	}
});*/

function cancelOperation(){
	var url = flexViewLayout_retURL;
	window.open(url,'_self');
}

function saveSelectionJS(){	
	if(pageLayoutId){
		saveSelection(pageLayoutId, recordTypeId, recordTypeName);
	}
}

function redirect(url){
	j$('#RedirectLoader').show();
	////console.log(url);
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
	var rcrdId = flexViewLayout_CurrentPageId;
	j$.cookie(flexViewLayout_objectName, tabId+':'+rcrdId,{path: '/'});
	j$.cookie(flexViewLayout_objectName+'-Name', tabName+':'+rcrdId,{path: '/'});
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
	j$('#viewAttModalField').hide();
	sideBarMenuCollapse();
	if(flexViewLayout_parentLytId != null || flexViewLayout_parentLytId != 'Undefined' || flexViewLayout_parentLytId != '') {
		var pageHeader1 = flexViewLayout_pageHeader.replace('<br />', '</span><br /><span class="overview-title" tabindex="0">');
		var pageTitleText = '<div class="overviewHeader"><span class="customLabelstyle" tabindex="0">'+pageHeader1+'</span></div>';		
		j$('#pageHeaderId').html(trustHTML(pageTitleText));  
	}else {    
		var pageTitleText = flexViewLayout_pageHeader;
		////console.log('page title else condition', pageTitleText);
		j$('#pageHeaderId').html(trustHTML(pageTitleText)); 
	}

	if(flexViewLayout_CurrentPageformId != '' || flexViewLayout_isPreview == 'true'){
		
		document.title = flexViewLayout_setFormPageTitle;

	}else{
		document.title = flexViewLayout_setPageTitle;
	
	}
	//setPageTitle(flexViewLayout_setPageTitle);
	var layout = flexViewLayout_layoutType;	
	lastClickedTabId = '';
	if(layout == 'Edit'){
		/*var textElement = j$("<span class=\'requiredFieldMessage'\ style=\'position:absolute'\></span>");
		textElement.text(flexViewLayout_FieldsMarkedRequired);
		j$("#topTabsID").append(textElement); */
		var textElement = j$("<span class=\'pull-right'\ >are required </span><span class=\'pull-right color-red'\ style=\'margin: 0 5px;'\> * </span><span class=\'pull-right'\>Fields marked as  </span>"); /* UI-Shrawan-10092015 Removed inline style */
		j$("#topTabsID").append(textElement);
	}

	var aHref = j$( "span[customId^='005'] a" );	
	for(var i=0;i<aHref.length;i++){	
	var n = aHref[i].href.lastIndexOf('/');	
	var idn = aHref[i].href.substring(n+1);	
	aHref[i].href = '/apex/' + namespace +'ProfileRedirect?id='+idn;            
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
	var recId = flexViewLayout_CurrentPageId.substring(0,3);
	j$.cookie('apex__objectID', recId , {path: '/'});	
	var tabId;
	var tabName;
	if(flexViewLayout_objectName != ''){
		tabId = j$.cookie(flexViewLayout_objectName);
		tabName = j$.cookie(flexViewLayout_objectName+'-Name');
	}	
	noMatch = true;
	if(tabId){ 
		var res = tabId.split(":");		
		var rcrdId = flexViewLayout_CurrentPageId;		
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
		if(flexViewLayout_activeTabSize) {
			if(j$('#topTabsID a:first').is(':visible') == true || flexViewLayout_activeTabSize == '1'){
				j$('#topTabsID a:first').tab('show');
				firstTabId = j$('#topTabsID a:first').attr('id');                
			}
			else{
				j$('#topTabsID').find('li:visible:first').children().tab('show');
				firsTabId = j$('#topTabsID').find('li:visible:first').children().attr('id');
			}
			var rcrdId = flexViewLayout_CurrentPageId;
			j$.cookie(flexViewLayout_objectName, firsTabId+':'+rcrdId ,{path: '/'});		
		}            
	} 	 
	sideBarHeightUI();
	j$(window).on('resize', function() {               
		sideBarHeightUI();
	});     
}); 

var viewAttachmentField = function(classfications, pageBlockDetailId) {
	//console.log('classfications',classfications);
	var recordId = escape(flexViewLayout_CurrentPageId); 
	j$('#viewFieldAttModalField').modal();
	j$('#iframeviewFieldAttContentIdField').attr('src','/apex/FieldAttachmentAdd?parentId='+ flexViewLayout_CurrentPageParametersId +'&classification='+ classfications+'&pageBlockDetailId=' + pageBlockDetailId);//Here pass pageblockdetail id because attchement is available at pageblock detail and to get its id through parameter in fieldattchmentaddpage
}

function sideBarHeightUI() {	
	var headerDivHeight = j$(window).height();
	var screenHeight = window.innerHeight;
	var navBarHeight = j$('.navbar.navbar-default.navbar-fixed-top').height();	
	var sidebarHeight = screenHeight-navBarHeight;	
	j$('#sidebar-wrapper').css('height',sidebarHeight+'px');	
	j$('#PageTemplateApp').css('padding-top',navBarHeight+'px');
}

function showTooltip(thisVal,parentId){  	  
	if(parentId != null || parentId != undefined || parentId != ''){
		j$('[id="'+thisVal.id+'"]').tooltipster({                    
			theme: 'tooltipster-shadow',
			content :'Loading...',
			updateAnimation:false,
			contentAsHTML:true, 
			interactive:true, 
			minWidth:100, 
			position:'right',   
			//   autoClose:false,                        
			functionBefore: function(origin, fetchLayout) {
				fetchLayout();
				Visualforce.remoting.Manager.invokeAction(
					_RemotingFlexViewLayoutActions.fetchMiniLayout,parentId,
					function(result, event){
						if (event.status) {							
							if(!jQuery.isEmptyObject(result)){
								tooltipContent =  '<div class="tooltipWrapper" >'; 
								tooltipContent = structureMiniLayout(result,origin,tooltipContent);
								tooltipContent +='</div>';								
								origin.tooltipster('content', tooltipContent );
							}else{
								j$('[id="'+thisVal.id+'"]').tooltipster('hide');
							}
						}
					}
				);
			}                   
		}); 
		j$('[id="'+thisVal.id+'"]').tooltipster('show');
		//j$('body').css('overflow-y', 'hidden');  
	}
}            
function hideTooltip(thisVal,parentId){
	j$('[id="'+thisVal.id+'"]').tooltipster('hide');
}
/*
function getMiniLayoutContent(result,origin){
	var tooltip = tooltipContent;	
	var tab = result.Tab;
	var record = result.Record;                           
	if(tab != null) {
	j$.each(result.Tab, function(i, tabVal) { 
		tooltip +='<p class="tooltip-title">'+record ['Name']+'</p>';
	    j$.each(tabVal.pageBlocks, function(j, pageBlockVal) {  
	    		if(pageBlockVal.hidePageBlock !='true'){
	    				if(tabVal.pageBlocks.length > 1){
	    					var pbTitle = pageBlockVal.title !=undefined?pageBlockVal.title:'';
							tooltip +='<p class="tooltip-title">'+pbTitle+'</p>';
						}	
			j$.each(pageBlockVal.fields, function(k, field) {   
				if(field.hideField != 'true')   {                     
								tooltip +='<div id="TooltipBody" class="panel-body">';
								tooltip +='<form class="form-horizontal" role="form">';
					tooltip += '<div class="form-group border-ext ">';
					tooltip += ' <div class="row">';                                   
						tooltip += ' <div class="col-md-4 col-xs-4 col-sm-4">';
						tooltip += field.fieldLabel;
						tooltip += '</div>';
				  
						var fieldVal =  j$('<span/>').html(record [field.fieldAPIName]).text();  
						if(field.dataType == 'CURRENCY'){
							fieldVal = '$' + fieldVal;
						}
						////console.log('[-----',fieldVal );                                   
						tooltip += ' <div class="col-md-8 col-xs-8 col-sm-8" style="word-wrap:break-word; font-weight: bold;">';
						//tooltip += decodeURI(fieldVal);     
						// Added by chinmay when click on email then it should be open in outlook   
						if(field.dataType == 'EMAIL') {
					        tooltip += '<a href="mailto:'+decodeURI(fieldVal)+'">'+decodeURI(fieldVal)+'</a>';
					       }
					       else{
					        tooltip += decodeURI(fieldVal);
					       }
						tooltip += '</div>';                                                                                     
					tooltip += '</div>';
								
							}   
					tooltip += '</div>';
					tooltip +='<br/>';
		  })
					} 
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
	
var isInternalDoc = 'false';
var docId = '';
var helpId = flexViewLayout_HelpConfig;
var namespace = flexViewLayout_namespace;
var tooltipContainer = {};
var j$= jQuery.noConflict();

	if(j$.cookie('setup') == 'present' && flexViewLayout_enableNativeLayout) {
		j$(".pageLayoutSetupIcon").show();
		j$("#ViewNativePageLayoutId").show();
	}
	else{
		j$(".pageLayoutSetupIcon").hide();
		j$("#ViewNativePageLayoutId").hide();
	}

function fetchHelpDataJS(){
	////console.log('helpId====',helpId);
	Visualforce.remoting.Manager.invokeAction(
		_RemotingFlexViewLayoutActions.fetchHelpDataRemote,helpId,
		function(result, event){
			if (event.status) {
				isInternalDoc = result.isInternalDocument;
				docId = result.docId;
			}
		});
}

function navigationForms(value,selectedValue){	
var url = flexViewLayout_CurrentPageURL;     
	if(selectedValue!='None' && selectedValue!=''){  
		showLoadingPopUp();
	Visualforce.remoting.Manager.invokeAction(
		  _RemotingFlexViewLayoutActions.navForms1,url,value,selectedValue,                                    
				  function(result,event){                          
					  if(event.status){						  
						 /* var resultURL = result;
						  var resultReplaced = resultURL.replace('&amp;', '&');
						  ////console.log('result------->>>>',unescape(resultReplaced) );  */
						  var urlnew = decodeURIComponent(result);                                                                    
						  window.open(decodeURIComponent(result),'_self');   																					 
					  }else{						  
						  ////console.log('result------->>>>',result);
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
 
 function openViewPage(){
	closeModal();
	window.location.href = flexViewLayout_CurrentPageURL;
}

function openHelp(){
	if(isInternalDoc == 'true' ){
		window.open('/servlet/servlet.FileDownload?file='+docId,'_blank');
	}else{
		window.open('/apex/'+namespace+'Help?id='+helpId, '_blank','width=900, height=700');
	}
}    

function Snapshot(){
	////console.log('Snapshot Clicked!');	
}        

 j$(document).ready(function(){
	fetchHelpDataJS();	
 });
var setupCookiePresent = (j$.cookie('setup') == 'present');
//j$(document).tooltip();

var labelsWithHelp = document.getElementsByClassName("labelHelpTooltip");
for (i = 0; i < labelsWithHelp.length; i++) {
	j$(labelsWithHelp[i]).tooltip();
}
j$('.fa.fa-info.helpIcon').click(function() {
	if(setupCookiePresent) {
		j$('.fieldApiNameDisplay').removeClass('active');
		j$(this).parent().nextAll('.fieldApiNameDisplay').addClass('active');
	}
});        

j$('body').click(function(e) {
	if(j$(e.target).closest('.fieldApiNameDisplay').length < 1 && !(j$(e.target).hasClass('helpIcon'))){
		j$('.fieldApiNameDisplay').removeClass('active');
	}
});

//Bug 97518: Internal - Form Snapshot - When we take a snapshot at form layout, page is getting refreshed automatically
function takeSnapshot(){
	var confirmVal = confirm('You are attempting to take a snapshot of the current record. The PDF will be attached in Snapshot History. Do you want to proceed?'); 
	if(confirmVal == true){
		showLoadingPopUp();
		executeClass('GNT.MenuSnapshotHelper', ' ');
		let isFormLayout = false;
		let query = window.location.search.substring(1);
		let params = query.split("&");
		for (let i=0;i<params.length;i++) {
			let pair = params[i].split("=");
			if (pair[0] == 'packageId' && pair[1] ) {
				isFormLayout = true;
			}
		}
		if(isFormLayout == false){
			setTimeout("location.reload(true);", 5000);
		}
	}
}

// Code Commented Its Not being Refrenced Any More...
// Comented by Atul.N
/*function takePostSnapshot(){	
	  Visualforce.remoting.Manager.invokeAction(
		  _RemotingFlexViewLayoutActions.postHistorySnapshot,buttonActionId,flexViewLayout_recordId,flexViewLayout_pageTemplateName,flexViewLayout_flexTableParameters,flexViewLayout_listParams,                                  
				  function(result,event){                          
					  if(event.status){                                 
						  ////console.log('success',event); 																							 
					  }else{                                    
						  ////console.log('result------->>>>',result);
					  }                                                      
			  },                         
		  {escape:true}
		  );
}*/
/*function toggleChevron(e) {
j$(e.target)
	.prev('.panel-heading')
	.find("span.togglePageBlock ")
	.toggleClass('fa fa-caret-down fa fa-caret-up');
}

j$('#myTabbedContent').on('hidden.bs.collapse', toggleChevron);
j$('#myTabbedContent').on('shown.bs.collapse', toggleChevron);*/

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
		j$('#menu ul').hide(); 
		j$('.panel-sidebar .sidebar-label').toggleClass("hidden"); 
		j$('.panel-sidebar .panel-body').toggleClass("hidden");                              
		j$('.panel-collapse .panel-body').toggleClass("hidden");
});
/**US - 199729 START - calling validateForms apex method which will validate bith standard and custom validations and if both are passed then 
 * it will create PDF for that FORM and Id of that PDF will be updated on form instance obj */ 
function handleFormValidations(actionVal){
	showLoadingPopUp();
	var recId = flexViewLayout_recordId;
	var formId = flexViewLayout_CurrentPageformId;
	var parentId = flexViewLayout_CurrentPageparentId;
	var formInstanceId = flexViewLayout_CurrentPageformInstanceId;
	var actionIdForValidateBtn =  actionVal.action.Id;
	validateForms(recId,formId,parentId,formInstanceId,actionIdForValidateBtn);
}
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
j$(document).ready(function() {
		initMenu();		
});
//

var headerButtonsPanel = angular.module('headerButtonsPanel', []);
var recId = flexViewLayout_recordId;
var layoutId = flexViewLayout_layoutId;
headerButtonsPanel.controller('FlexLayoutActionsGenerator', function ($q,$scope,$timeout,$sce) {    
	$scope.trustSrcHTML = function(src) {
		return $sce.trustAsHtml(src);
	} 
	$scope.loadActions = function(){
		$scope.paramMap = {};
		$scope.paramMap.parentLayoutId = flexViewLayout_parentLytId;
		$scope.paramMap.formId = flexViewLayout_CurrentPageformId;
		$scope.paramMap.formInstanceId = flexViewLayout_CurrentPageformInstanceId;
		$scope.paramMap.packageId = flexViewLayout_CurrentPagepackageId;
		$scope.paramMap.parentId = escape(flexViewLayout_CurrentPageparentId);
		$scope.paramMap.formTypes = flexViewLayout_CurrentPageformTypes;
		$scope.paramMap.tempalteName = flexViewLayout_CurrentPagetemplateName;
		$scope.paramMap.keyValMap = flexViewLayout_flexTableParameters;
		Visualforce.remoting.Manager.invokeAction(
			_RemotingFlexViewLayoutActions.decideActions,
			recId, layoutId, $scope.paramMap,
			function(retVal, event){                         
				if (event.status) {
					$scope.$apply(function () {                                						
						if(retVal.Success == true){
							$scope.actions = retVal.Actions;

							if($scope.actions.length == 0) {
								//Added to hide the menu burger icon when no elements are displayed in the dropdown
								var menuIconsArray = j$('.fa.fa-bars.menuIcon').closest('a').siblings('ul').children('li');
								var menuIconsHidden = true;
								for (var i = 0; i < menuIconsArray.length; i++) {
									if(!(j$(menuIconsArray[i]).css('display') === 'none')) {
										if(!j$(menuIconsArray[i]).hasClass('hasAngular')) {
											menuIconsHidden = false;
											break;
										}
									}
								}

								if(menuIconsHidden && menuIconsArray.length > 0) {
									j$('.fa.fa-bars.menuIcon').hide();
								}
							}
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
		console.log('at 971::'+JSON.stringify(act));console.log('at 972::'+act.action.RecordType.DeveloperName);
		/**US - 199729 - As we have introduced new record type for btn checking that here and executing required logic - this Validate record type button 
		 * will be only created on forms to generate the PDF of that Forms 
		 */
		if(act.action.RecordType.DeveloperName == 'Validate'){
			console.log('Its a validate record type btn');
			handleFormValidations(act);
			/**US - 199729 END */
		}else{
			handleFlexGridUnsavedData(act);
		}
		
	}
	$scope.showHelpTooltip = function(thisVal,thm,id){
		showHelpTooltip(thisVal,thm,id);
	};
	$scope.hideHelpTooltip = function(thisVal,thm,id){
		hideHelpTooltip(thisVal,thm,id);
	};
	
});
angular.bootstrap(document.getElementById("headerButtonsPanel"),['headerButtonsPanel']); 
//
var footerButtonsPanel = angular.module('footerButtonsPanel', []);
footerButtonsPanel.controller('FlexLayoutActionsGenerator', function ($q,$scope,$timeout,$sce) {    
	$scope.trustSrcHTML = function(src) {
		return $sce.trustAsHtml(src);
	} 
	$scope.loadActions = function(){
		$scope.paramMap = {};
		$scope.paramMap.parentLayoutId = flexViewLayout_parentLytId;
		$scope.paramMap.formId = flexViewLayout_CurrentPageformId;
		$scope.paramMap.formInstanceId = flexViewLayout_CurrentPageformInstanceId;
		$scope.paramMap.packageId = flexViewLayout_CurrentPagepackageId;
		$scope.paramMap.parentId = flexViewLayout_CurrentPageparentId;
		$scope.paramMap.formTypes = flexViewLayout_CurrentPageformTypes;
		$scope.paramMap.tempalteName = flexViewLayout_CurrentPagetemplateName;
		$scope.paramMap.keyValMap = flexViewLayout_flexTableParameters;
		Visualforce.remoting.Manager.invokeAction(
			_RemotingFlexViewLayoutActions.decideActions,
			recId, layoutId, $scope.paramMap,                
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
		console.log('at 1021');		
		if(act.action.RecordType.DeveloperName == 'Validate'){
			console.log('Its a validate record type btn');
			handleFormValidations(act);
			/**US - 199729 END */
		}else{
		handleFlexGridUnsavedData(act);
	}
	}
	$scope.showHelpTooltip = function(thisVal,thm,id){
		showHelpTooltipFooter(thisVal,thm,id);
	}
});
angular.bootstrap(document.getElementById("footerButtonsPanel"),['footerButtonsPanel']); 
