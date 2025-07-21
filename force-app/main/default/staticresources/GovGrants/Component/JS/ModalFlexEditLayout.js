var j$ = jQuery.noConflict();
//enable native page url
if(j$.cookie('setup') == 'present' && modalFlexEditLayout_enableNativeLayout) {
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

////console.log("tmpl: "+modalFlexEditLayout_tmplName);
var lastClickedTabId;
var pageLayoutId,recordTypeId,recordTypeName;
function saveSelectedRecordId(pageLayout,recordType,rtName){
	var nextBtnID= document.getElementById('nextId');
	j$(nextBtnID).removeClass("customDisableBtn");
	j$(nextBtnID).addClass("btn");
	nextBtnID.disabled = false;
	pageLayoutId = pageLayout;
	recordTypeId = recordType;
	recordTypeName = rtName;
}

function setCollapseIcon(elementId){	
	//console.log('======CollapseIcon Entered=========',elementId);
	j$('#'+elementId).find("span.togglePageBlock").toggleClass('fa-caret-down fa-caret-up');
	//console.log('========ValueInCollapse===',j$('#'+elementId).find("span.togglePageBlock "));
}

function closeIframe(hasErrors,closeOnSave,refreshBehaviour){
	var tableName =modalFlexEditLayout_tableName;
	var tableType = modalFlexEditLayout_tableType;
	//var flextableName = modalFlexEditLayout_flextableName;
	//console.log('hasErrors',hasErrors);
	//console.log('tableName',tableName);
	//console.log('closeOnSave',closeOnSave);
	if(!hasErrors){
		//here refreshbehaviour is passed as string so we added null and 'null' check
		if(refreshBehaviour != null &&  tableName != null && refreshBehaviour != '' && tableName != '' && refreshBehaviour != 'null' &&  tableName != 'null') {
			
				if(tableType == 'flexGrid'){
					//console.log('parent is111--->',parent.angular.element(parent.document.getElementById('inlineEditGrid'+ tableName)));
			        //This method is added from flexgrid component. It is used to refresh grid.
			        parent.refreshFlexGrid(tableName);//angular.element(parent.document.getElementById('inlineEditGrid'+ flextableName)).scope().$$childTail.initInlineEditableGrid();	
				}
				if(tableType == 'Flex Grid Enhanced'){
					 angular.element(window.parent.document.getElementById(tableName+'modalDivCloseIcon')).trigger('click'); 
				}
				else{
					//This method is added from flextable component. It is used to refresh flextable.
					parent.refreshFlexTable(tableName,refreshBehaviour);	
				}			

		
			//when close on save is true at page layout level.
		} else if(closeOnSave){
			
			j$('customLookupModalDiv').dialog("close");
			//console.log('close modal called..#/!--' + window.parent.location.href);

			//replace last unwanted characters coming in grid
			if(window.parent.location.href.indexOf('?') != -1){
				window.parent.location = (window.parent.location.href.replace('#/!','')) +'&success=saved';

		 	 }else{
		  		 window.parent.location = (window.parent.location.href.replace('#/!','')) +'?success=saved';
		 
		  	}
			window.parent.closeIframe(hasErrors,closeOnSave);
		//window.parent.location = (window.parent.location.href.replace('#/!','')) +'&success=saved';
		//parent.location.reload();
		//window.parent.location = window.parent.location.href;     /*code changed to show success message*/
		}
		else{
			angular.element(parent.document.getElementById('dynamicModalCloseButton')).trigger('click');

		}
	} 
 }        

//Make the final tab in Left-Right orientation have full width of the page if it is the only tab on the row
j$('.tab-pane').each(function(e) {
	if (j$(this).find('.LEFT_RIGHT').length %2 != 0){
		j$(this).find('.LEFT_RIGHT:last-child').css('width', 'auto');
		j$(this).find('.LEFT_RIGHT:last-child').css('display', 'block');
	}
});

function cancelOperation(){
	var url = modalFlexEditLayout_retURL;
	if(cancelPromptEnable){
                     bootbox.dialog({
                      message:  cancelConfirmationMessage ,
                      title:"Confirm",
                      onEscape: function() {},
                      backdrop: false,
                      closeButton: true,
                      animate: true,
                      buttons: {
                        No: {
                           label: "No",
                           className: "customBtn btn-ext btnCompact",
                          callback: function() {
                          }
                        },
                        "Yes": {
                          label: "Yes" ,
                          className: "customBtn btn-ext btnCompact",
                          callback: function(result) {
                             if(result){
	closeIframe(false,false,"Close modal and refresh grid");
                            }
                          }
                        },
                      }
                    });
                }
                else{
                 closeIframe(false,false,"Close modal and refresh grid");
                }
	//window.open(url,'_self');
}

function saveSelectionJS(){	
	if(pageLayoutId){
		saveSelection(pageLayoutId, recordTypeId, recordTypeName);
	}
}
 
function redirect(url){
	////console.log(url);
	window.open(url,'_self'); 
}

function pageDetailRedirect(Id){	
	var idVal = Id;
	if(idVal != undefined){
		if (idVal.substr(0, 3) == '005'){ 
		    window.open('/apex/ProfileRedirect?id=' + idVal,'_blank');

		} 
		else if(idVal.substr(0, 3) == '00G'){
		    window.open('/apex/ProfileRedirect?id=' + idVal,'_blank');

		}
		else{
		    window.open('/'+idVal,'_blank');

		}
	}
}

 function setPageTitle(myPageTitle) {
	pageTitleName = myPageTitle;
}

function setCookie(tabId,tabName){
	if(lastClickedTabId != ''){
		j$('#'+lastClickedTabId).parent().removeClass('active');               
	}	             
	var rcrdId = modalFlexEditLayout_id;
	j$.cookie(modalFlexEditLayout_objectName, tabId+':'+rcrdId,{path: '/'});
	j$.cookie(modalFlexEditLayout_objectName+'-Name', tabName+':'+rcrdId,{path: '/'});
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
	var allTabsLength = j$('#topTabsID').find('li').length;        
	
	if(modalFlexEditLayout_windowTabTitle == null ||modalFlexEditLayout_windowTabTitle == undefined || modalFlexEditLayout_windowTabTitle == ''){
	setPageTitle(modalFlexEditLayout_setPageTitle);
	}else{
		setPageTitle(modalFlexEditLayout_windowTabTitle);
	}
	//setPageTitle(modalFlexEditLayout_setPageTitle);
	var layout = modalFlexEditLayout_layoutType;
	try {
		parent.showModalTitle(trustHTML(modalFlexEditLayout_pageHeader));
	}catch(err) {
		////console.log('Error in showModalTitle', err);
	}
	lastClickedTabId = '';
	if(layout == 'Edit'){
		/*var textElement = j$("<span class=\'requiredFieldMessage'\ style=\'position:absolute'\></span>");
		textElement.text(modalFlexEditLayout_FieldsMarkedRequired);
		j$("#topTabsID").append(textElement); */
		//var textElement = j$("<span class=\'pull-right'\ >are required </span><span class=\'pull-right color-red'\ style=\'margin: 0 5px;'\> * </span><span class=\'pull-right'\>Fields marked as  </span>"); /* UI-Shrawan-10092015 Removed inline style */
		//j$("#topTabsID").append(textElement);
	}

	var aHref = j$( "span[customId^='005'] a" );	
	for(var i=0;i<aHref.length;i++){
		////console.log('test===',aHref [i].href);
		var n = aHref[i].href.lastIndexOf('/');
		////console.log('n',n);
		var idn = aHref[i].href.substring(n+1);
		////console.log('idn',idn);
		aHref[i].href = '/apex/' + modalFlexEditLayout_namespace +'ProfileRedirect?id='+idn;            
	}	
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
	var recId = modalFlexEditLayout_id.substring(0,3);
	j$.cookie('apex__objectID', recId , {path: '/'});	
	var tabId;
	var tabName;
	if(modalFlexEditLayout_objectName != ''){
		tabId = j$.cookie(modalFlexEditLayout_objectName);
		tabName = j$.cookie(modalFlexEditLayout_objectName+'-Name');
	}	
	noMatch = true;
	if(tabId){ 
		var res = tabId.split(":");		
		var rcrdId = modalFlexEditLayout_id;		
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
		var rcrdId = modalFlexEditLayout_id;
		j$.cookie(modalFlexEditLayout_objectName, firsTabId+':'+rcrdId ,{path: '/'});		
	}  

	var errorMessage = document.getElementsByClassName("errorMessage");
	if (localStorage.getItem("name") != null) {
		var html = '<div id="SubmitErrMessage" class="alert alert-danger alert-dismissible"><span  class="close" data-dismiss="alert" aria-label="close">&times;</span>';
		var errorMessages = localStorage.getItem("name").split(';')
		errorMessages.forEach(element => {
			html += '<li><span style="dynamic-msg-box-margin">'+element+'</span></li>';
		});
		html +='</div>';
		errorMessage[0].textContent = html;
		localStorage.removeItem('name');
	}	          
});  
var viewAttachmentField = function(classfications, pageBlockDetailId) {
	j$('#editFieldAttModalField').modal();
	j$('#iframeeditFieldAttContentIdField').attr('src','/apex/FieldAttachmentAdd?parentId='+ modalFlexEditLayout_id +'&classification='+ classfications+'&pageBlockDetailId=' + pageBlockDetailId);//Here pass pageblockdetail id because attchement is available at pageblock detail and to get its id through parameter in fieldattchmentaddpage
}
function clearErrorMsg(){
	j$("#SubmitErrMessage").remove();
}