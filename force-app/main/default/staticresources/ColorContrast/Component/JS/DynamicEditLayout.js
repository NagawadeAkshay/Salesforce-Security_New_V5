var words = dynamicEditLayout_textAreaWordMaxLimit;
var Charct = dynamicEditLayout_textAreaCharacterMaxLimit;
var warWords = dynamicEditLayout_textAreaWordWarningLimit;
var warCharct = dynamicEditLayout_textAreaCharacterWarningLimit;
var richTextFunctionInvoked = false; 
var check = 'true';  
check = Boolean(check);
var j$ = jQuery.noConflict();

var addAttachmentField = function(classfications) {
	var recordId = dynamicEditLayout_CurrentPageParametersId;                     	
	j$('#addAttModalField').modal();
	//j$('#iframeAddAttContentIdField').attr('src','/apex/FieldAttachmentAdd?parentId=a1S370000001jpMEAQ&pBlockId=' + pbdid + '&classification=' + classfications);
	j$('#iframeAddAttContentIdField').attr('src','/apex/FieldAttachmentAdd?parentId='+ dynamicEditLayout_parametersId +'&classification=' + classfications);
}
var handle508FieldLabels = function(){
	j$('input.508Input').each(function(){
		var currentId = j$(this).get(0).id;
		j$(this).closest('[class*=field-value]').children('.508Label').attr('for', currentId);
	});
	j$('textarea[class*=508Input]').each(function(){
		var currentId = j$(this).get(0).name;
		j$(this).attr('id',currentId);
		j$(this).closest('[class*=field-value]').children('.508Label').attr('for', currentId);
	});
	j$('select.508Input').each(function(){
		var currentId = j$(this).get(0).id;
		var modifiedId = currentId.split('_');
		if(!modifiedId){
			j$(this).closest('[class*=field-value]').children('.508Label').attr('for', modifiedId[0]);
		}else{
			j$(this).closest('[class*=field-value]').children('.508Label').attr('for', currentId);
		}
	});
	j$( "img[id*='left_arrow']" ).css('width','30px');
	j$( "img[id*='right_arrow']" ).css('width','30px');
	j$("select[id*='unselected']").each(function(){
		var currentId = j$(this).get(0).id;
		var label = j$(this).closest('[class*=field-value]').children('.508Label').text();
		j$(this).before('<label for="' + currentId + '" style="display:none;">' + label + '</label>');
	});
}

var l = 0;     
var u = 0;
var cntr = 0; 

function  handleDynamicFieldRender(map,currId,selValue) {
	var mp = jQuery.parseJSON(map);
	for (var key in mp) {
		if (mp.hasOwnProperty(currId)) {
			for(var k in mp[currId]) {
				var result = mp[currId][k];
				if(mp[currId].hasOwnProperty(selValue)) {
					var res = mp[currId][selValue];
					/*code for hiding user lookup picklist start*/            
					j$("[value='005']").parent().hide();
					/*code for hiding user lookup picklist end*/    
					fieldAction(res,true);
				} else {
					fieldAction(result,false);
				}
			}
		}
	}
}

function createRecordMap(fieldAPIName,fieldType,thisInfo){
	//console.log('fieldAPIName',fieldAPIName);
	//console.log('fieldType',fieldType);
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
	//console.log('Map apiNameToInputValueMap',apiNameToInputValueMap);     
}

var apiNameToInputValueMap = {};
function fieldAction(res,flag) {
	var act = j$("#"+res).attr("action");
	if(act == "Enable/Disable" && flag == true) {
		j$("#"+res+" input").attr("disabled",false);
	}
	else if(act == "Enable/Disable" && flag == false){
		j$("#"+res+" input").attr("disabled",true);
	}
	if(act == "Hide/Show" && flag == true) {
		j$("#"+res+" input").show();
	}
	else if(act == "Hide/Show" && flag == false) {
		j$("#"+res+" input").hide();
	}
}
function getSelectPickVal() {
	var selectedVal = j$("span[dynamicRenderingMap] select option:selected").val();
	return selectedVal;
}

j$(document).ready(function(){  
	record =dynamicEditLayout_recordJSON;
	//console.log('Record:  ',record);
	if(record != '' || record){
		record = JSON.parse(record);
	}
	//console.log('ready function called');
	/*code for hiding user lookup picklist start*/            
	j$("[value='005']").parent().hide();
	/*code for hiding user lookup picklist end*/
	j$('.assistiveText').hide();// to hide the search scope text
	j$("span[dynamicRenderingMap] select").on("change", function() {
		//console.log('called');
		handleDynamicFieldRender(j$(this).closest("span").attr("dynamicRenderingMap"),j$(this).closest("span").attr("id"),j$(this).find(":selected").val());
	});
	if(richTextFunctionInvoked == false && dynamicEditLayout_richTextAreaPluginFlag == true){
		richTextFunctionInvoked = true;
	}
	handle508FieldLabels();
	// set richtext box width by default to large
	// No Longer needed.
	//setCKEditorSizeBig();
	//adjustToggleBarHeightUI(); /* UI-Shrawan-10102015 */
});

var labelsWithHelp = document.getElementsByClassName("labelHelpTooltip");
for (i = 0; i < labelsWithHelp.length; i++) {
	j$(labelsWithHelp[i]).tooltip();
}
if(j$.cookie('setup') == 'present' && dynamicEditLayout_EnableAdminSetup) {
	j$(".pbSetup").show();
}
else {
	j$(".pbSetup").hide();
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
	baseURL = "/apex/CustomLookup?fieldId=" + txtId + "&lookupType="+lookupType+"&formId="+formId+"&filterCriteria="+filterCriteria;
	baseURL = baseURL + "&searchTerm="+inputValue+"&pageBlockDetailId="+pageBlockDetailId+"&mergeParameters="+dynamicEditLayout_flexTableParameters;
	baseURL = encodeURI(baseURL);
	var height = '550';
	var width = '750';
	//openPopup(baseURL, "lookup", 350, 550, "width="+originalwidth+",height=550,toolbar=no,status=no,directories=no,menubar=no,resizable=yes,scrollbars=yes", false);
	j$('#iframeCustomLookupModalId').attr('src',baseURL);  
	//console.log('customLLookuptabId---->>>','#customLookupModalDiv'+dynamicEditLayout_tabMap);          
	j$('#customLookupModalDiv').modal();
} 

function setLookupValue(fieldId,valueID,valueName){
	var formId =j$('form').attr('id');
	//Open Modal Code 
	//console.log('formId----',formId);
	//console.log('fieldId----',fieldId);
	//console.log('valueID----',valueID);
	//console.log('valueName----',valueName);
	lookupPick2(formId,fieldId+'_lkid',fieldId,valueID,valueName, false);
	//console.log('lookupPick2----',lookupPick2);
	j$('#customLookupModalDiv').modal('hide');
	j$('#iframeCustomLookupModalId').attr('src','');
	// Open Modal Code 
	// lookupPick2(formId,fieldId+'_lkid',fieldId,valueID,valueName, false);
}
function getParameterByName(name,url) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(url);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function showHelpTooltip(thisVal,thm,id){             
	//console.log('thisVal',thisVal);                     
	j$('#'+id+'tooltip').tooltipster({ 
		theme: thm,                     
		multiple: true,
		position : 'right',
		animation :'fade',          
		contentAsHTML: true,    
		content : thisVal
	});    
	j$('#'+id+'tooltip').tooltipster('show');                                                                 
}   