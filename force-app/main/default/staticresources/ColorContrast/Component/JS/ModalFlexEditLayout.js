var j$ = jQuery.noConflict();
//console.log("tmpl: "+modalFlexEditLayout_tmplName);
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

function closeIframe(hasErrors,closeOnSave){	
	if(!hasErrors && closeOnSave){
		j$('customLookupModalDiv').dialog("close");
		window.parent.location = window.parent.location.href+'&success=saved';
		//window.parent.location = window.parent.location.href;     /*code changed to show success message*/
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
	window.open(url,'_self');
}

function saveSelectionJS(){	
	if(pageLayoutId){
		saveSelection(pageLayoutId, recordTypeId, recordTypeName);
	}
}
 
function redirect(url){
	//console.log(url);
	window.open(url,'_self'); 
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

j$(document).ready(function(){    
	var allTabsLength = j$('#topTabsID').find('li').length;        
	setPageTitle(modalFlexEditLayout_setPageTitle);
	var layout = modalFlexEditLayout_layoutType;
	try {
		parent.showModalTitle(modalFlexEditLayout_pageHeader);
	}catch(err) {
		//console.log('Error in showModalTitle', err);
	}
	lastClickedTabId = '';
	if(layout == 'Edit'){
		var textElement = j$("<span class=\'requiredFieldMessage'\ style=\'position:absolute'\></span>");
		textElement.text(modalFlexEditLayout_FieldsMarkedRequired);
		j$("#topTabsID").append(textElement);                              
	}

	var aHref = j$( "span[customId^='005'] a" );	
	for(var i=0;i<aHref.length;i++){
		//console.log('test===',aHref [i].href);
		var n = aHref[i].href.lastIndexOf('/');
		//console.log('n',n);
		var idn = aHref[i].href.substring(n+1);
		//console.log('idn',idn);
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
});  