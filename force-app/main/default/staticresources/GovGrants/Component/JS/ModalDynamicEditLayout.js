var words = modalDynamicEditLayout_textAreaWordMaxLimit;
var Charct = modalDynamicEditLayout_textAreaCharacterMaxLimit;
var warWords = modalDynamicEditLayout_textAreaWordWarningLimit;
var warCharct = modalDynamicEditLayout_textAreaCharacterWarningLimit;
var richTextFunctionInvoked = false; 
var check = 'true';  
check = Boolean(check);			 
var j$ = jQuery.noConflict();

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

function createRecordMap(fieldAPIName,fieldType,value){	
	var m = {};//new Map();
	if(fieldType.toLowerCase() == 'string' || fieldType.toLowerCase() == 'picklist'){
		m[fieldAPIName]=value;
	}		
}

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
	/*code for hiding user lookup picklist start*/            
	j$("[value='005']").parent().hide();
	/*code for hiding user lookup picklist end*/	
	j$("span[dynamicRenderingMap] select").on("change", function() {		 
		  handleDynamicFieldRender(j$(this).closest("span").attr("dynamicRenderingMap"),j$(this).closest("span").attr("id"),j$(this).find(":selected").val());
	});
	if(richTextFunctionInvoked == false && modalDynamicEditLayout_richTextAreaPluginFlag == true){
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
if(j$.cookie('setup') == 'present' && modalDynamicEditLayout_EnableAdminSetup) {
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
	var urlArr = baseURL.split("&");
	var txtId = '';
	if(urlArr.length > 2) {
		urlArr = urlArr[1].split('=');
		txtId = urlArr[1];
	}	
	var lblId =document.getElementById(decodeURIComponent(txtId));	
	var filterCriteriaDOM = j$(lblId).closest('span[sourceHandler]').children().get(0);	
	var filterCriteria;
	filterCriteria = j$(filterCriteriaDOM).attr('value');	
	var recordIdentifier = modalDynamicEditLayout_recordId;	
	if(recordIdentifier){
		//YET TO IMPLEMENT CAPTURE MERGE FIELD USING REGEX FOR CREATE CONTEXT
	}
	var formId =j$('form').attr('id');
	baseURL = "/apex/CustomLookup?fieldId=" + txtId + "&lookupType="+lookupType+"&formId="+formId+"&filterCriteria="+filterCriteria;
	baseURL = baseURL + "&mergeParameters="+modalDynamicEditLayout_flexTableParameters;
	baseURL = encodeURI(baseURL);
	var height = '550';
	var width = '750';
	openPopup(baseURL, "lookup", 350, 550, "width="+originalwidth+",height=550,toolbar=no,status=no,directories=no,menubar=no,resizable=yes,scrollbars=yes", false);
} 

function setLookupValue(fieldId,valueID,valueName){
	var formId =j$('form').attr('id');
	/* Open Modal Code 
	lookupPick2(formId,fieldId+'_lkid',fieldId,valueID,valueName, false);
	j$('#customLookupModalDiv').modal('hide');
	j$('#iframeCustomLookupModalId').attr('src','');
	 Open Modal Code */
	lookupPick2(formId,fieldId+'_lkid',fieldId,valueID,valueName, false);
}
function getParameterByName(name,url) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), //False +ve for non literal regex used for sanitization, as we are not using for sanitization purpose
	results = regex.exec(url);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}