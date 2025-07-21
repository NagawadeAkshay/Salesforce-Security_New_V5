var richTextFunctionInvoked = false; 
var check = 'true';  
check = Boolean(check);
var j$ = jQuery.noConflict();

function clearVal(e){
	var target =e.srcElement || e.target;
	var element = target.parentNode;
	var lookUpVal = element.getElementsByClassName('lookupInput');
	lookUpVal[0].childNodes[0].value = '';
    //var lookUpVal = element.getElementsByClassName('lookupInput');
    //lookUpVal[0].childNodes[0].value = '';
}
/*var addAttachmentField = function(classfications,pageBlockDetailId) {
	var recordId = dynamicEditLayout_CurrentPageParametersId;                     	
	j$('#addAttModalField').modal();
	//j$('#iframeAddAttContentIdField').attr('src','/apex/FieldAttachmentAdd?parentId=a1S370000001jpMEAQ&pBlockId=' + pbdid + '&classification=' + classfications);
	j$('#iframeAddAttContentIdField').attr('src','/apex/FieldAttachmentAdd?parentId='+ dynamicEditLayout_parametersId +'&classification=' + classfications +'&pageBlockDetailId=' + pageBlockDetailId);
}*/
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
	//it was breaking for map
	if(map != undefined && map != null && map != '') {
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

//To show minilayout in Edit & create Mode we need to replace the old id of span with new id
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

// Adding of function for timepicker
function displayTimePicker(timeFormatVal){
	j$('.timepicker').timepicker({ 
		timeFormat: timeFormatVal, 
	});
	j$('.timepicker').attr('placeholder',timeFormatVal);
}

j$("body").scroll(function(){
    if(j$(".ui-timepicker-container").length > 0){
    	j$(".ui-timepicker-container").hide();
    	j$('.timepicker').blur();
    }
  });

j$(document).ready(function(){  
	//console.log('Time Val---',UserContext.timeFormat);
	displayTimePicker(UserContext.timeFormat);



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
	var filtercriteria1 = filterCriteria.match(/\[(.*?)\]/g);
	//var filtercriteria11 =filtercriteria1.replace('__r','__c');
	//console.log('filterCriteria1111',filtercriteria1);
	if(filtercriteria1 != undefined){
		for (i = 0; i < filtercriteria1.length; i++) { 
			var searchFil = filtercriteria1[i].replace('__r.Name','__c');
			 searchFil = searchFil.replace('[','');
			 searchFil = searchFil.replace(']','');
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
 function hideFields(fieldInstance, fieldAPIName, hideJSON, isReadOnlyField, readonlyValue) {
            if(hideJSON != undefined && hideJSON != '' && hideJSON != null && hideJSON != 'null') {
                //console.log('----', fieldInstance);
                var jsonData = JSON.parse(hideJSON);
                for (var i = 0; i < jsonData.length; i++) {
                    var operator = jsonData[i].Operator;
                    var fieldToHide = jsonData[i].FieldToHide;
                    var hideVal = jsonData[i].FieldValue;
                    var action = jsonData[i].Action;
                    var fieldName = j$('#field'+fieldToHide).length;
                    var fieldValue;
                    if(isReadOnlyField == true){
                    	if(fieldAPIName == 'REFERENCE'){
							fieldValue = j$('span.readonlySpan').find('span').find('a')[0].innerText;
                    	}else{
                    		fieldValue = readonlyValue;		
                    	}
                    	 
                    }else{
	            	 if(fieldInstance.type == 'checkbox'){
	            	 	//Boolen field support for hide,blank and disabled action. fieldInstance.checked return true/false value.
	            	 	fieldValue = fieldInstance.checked.toString();
						}else if(fieldAPIName == 'DOUBLE' || fieldAPIName == 'PERCENT' || fieldAPIName == 'CURRENCY'){
							fieldValue = removeDecimalPart(fieldInstance.value);
							hideVal = removeDecimalPart(jsonData[i].FieldValue);
	            	 }else{
							fieldValue = fieldInstance.value===undefined ? '' : fieldInstance.value;
	            	 }
                    }
	            	 
                    if(action == 'blank'){
                    	blankField(fieldName, fieldValue, hideVal, fieldToHide, operator, action);
                    }else if(action == 'disabled'){
                    	disabledField(fieldName, fieldValue, hideVal, fieldToHide, operator, action);
                    }else{
                    	if(fieldInstance.nodeName=='A' && fieldAPIName == 'REFERENCE'){
                    	//do nothing -skip hideField function call
	                    }else{
	                    	hideField(fieldName, fieldValue, hideVal, fieldToHide, operator, action);
	                    }
                    	//hideField(fieldName, fieldValue, hideVal, fieldToHide, operator, action);

                	}
            	}
			}
		} 
	function removeDecimalPart(fieldVal){
		var decimalVal = fieldVal != undefined && fieldVal != '' ? fieldVal.split('.') : '';
		fieldVal = decimalVal != '' && (decimalVal[1] == "0" || decimalVal[1] == "00" || decimalVal[1] == "000") ? decimalVal[0] : fieldVal;
		return fieldVal.replace(/[,\s]+|[,\s]+/g, '');
	}
	/*
		Prajakta: This function supports ==,!=,IN and NOT IN operator. 
		On the fly we can make field blank. 
		json example:[{"FieldToHide":"ggf_dev6__SampleText1__c","FieldValue":"true","Operator":"==","Action":"blank"}]
	*/
    function blankField(fieldName, fieldValue, hideVal, fieldToHide, operator, action) {
    	if(operator == '==') {
            if(fieldName > 0 && fieldValue === hideVal ){
				if(j$('#field'+fieldToHide).find('.dependentFilter').find('input.508Input,select.508Input').attr('type') == "checkbox"){
    				j$('#field'+fieldToHide).find('.dependentFilter').find('input.508Input,select.508Input').attr('checked', false);
				}else{
                    j$('#field'+fieldToHide).find('.dependentFilter').find('input.508Input,select.508Input').val('');
				}
			}
						//j$('#'+fieldToHide).find('.lookupInput').find('input.508Input').val('');

     	}else if(operator == '!=') {
        	if(fieldName > 0 && fieldValue != hideVal ){
				if(j$('#field'+fieldToHide).find('.dependentFilter').find('input.508Input,select.508Input').attr('type') == "checkbox"){
					j$('#field'+fieldToHide).find('.dependentFilter').find('input.508Input,select.508Input').attr('checked', false);

				}else{
            		j$('#field'+fieldToHide).find('.dependentFilter').find('input.508Input,select.508Input').val('');
				}

        	}
     	}else if(operator == 'IN') {
        	var splitFields =  hideVal.split(',');
        	//console.log('spliFields--',splitFields);
            if(contains.call(splitFields, fieldValue) == true){
            	if(j$('#field'+fieldToHide).find('.dependentFilter').find('input.508Input,select.508Input').attr('type') == "checkbox"){
            	j$('#field'+fieldToHide).find('.dependentFilter').find('input.508Input,select.508Input').attr('checked', false);

				}else{
            	j$('#field'+fieldToHide).find('.dependentFilter').find('input.508Input,select.508Input').val('');
				}

            } 
        } else if(operator == 'NOT IN') {
        	var splitFields =  hideVal.split(',');
        	//console.log('spliFields--',splitFields);
            if(contains.call(splitFields, fieldValue) == false){
            	if(j$('#field'+fieldToHide).find('.dependentFilter').find('input.508Input,select.508Input').attr('type') == "checkbox"){
            	j$('#field'+fieldToHide).find('.dependentFilter').find('input.508Input,select.508Input').attr('checked', false);

				}else{
            	j$('#field'+fieldToHide).find('.dependentFilter').find('input.508Input,select.508Input').val('');
				}

            } 
        }
    }

    /*
		Prajakta: This function supports ==,!=,IN and NOT IN operator. 
		On the fly we can make field blank. 
		json example:[{"FieldToHide":"ggf_dev6__SampleText1__c","FieldValue":"true","Operator":"==","Action":"disabled"}]
	*/
    function disabledField(fieldName, fieldValue, hideVal, fieldToHide, operator, action) {
		fieldValue = fieldValue!= undefined && fieldValue != ''? fieldValue.toLowerCase(): fieldValue;
		hideVal = hideVal != undefined &&  hideVal != '' ? hideVal.toLowerCase() : hideVal;
    	if(operator == '==') {
                         if(fieldValue === hideVal ) {
     			//console.log('fieldValue',fieldValue);
     			//console.log('hideVal',hideVal);
                                     j$('#field'+fieldToHide).find('.dependentFilter').find('input.508Input,select.508Input').prop('disabled', true);
                                     j$('#'+fieldToHide).find('.lookupInput').find('input.508Input').prop('disabled', true);
                                     j$('#'+fieldToHide).find('.lookupInput').children("a.508Input").on("click", false);
                                 
                            }
                            else{
                                    j$('#field'+fieldToHide).find('.dependentFilter').find('input.508Input,select.508Input').prop('disabled', false);
                                    j$('#'+fieldToHide).find('.lookupInput').find('input.508Input').prop('disabled', false);
                                    j$('#'+fieldToHide).find('.lookupInput').children("a.508Input").off("click");
      		 }
 		}else if(operator == '!=') {
    		if(fieldValue != hideVal ) {
       			j$('#field'+fieldToHide).find('.dependentFilter').find('input.508Input,select.508Input').prop('disabled', true);
                j$('#'+fieldToHide).find('.lookupInput').find('input.508Input').prop('disabled', true);
                j$('#'+fieldToHide).find('.lookupInput').children("a.508Input").on("click", false);
            }
      		else{
       			j$('#field'+fieldToHide).find('.dependentFilter').find('input.508Input,select.508Input').prop('disabled', false);
                j$('#'+fieldToHide).find('.lookupInput').find('input.508Input').prop('disabled', false);
                j$('#'+fieldToHide).find('.lookupInput').children("a.508Input").off("click");
                                
                            }
   		}else if(operator == 'IN') {
        	var splitFields =  hideVal.split(',');
        	//console.log('spliFields--',splitFields);
            if(contains.call(splitFields, fieldValue) == true){
            	j$('#field'+fieldToHide).find('.dependentFilter').find('input.508Input,select.508Input').prop('disabled', true);
                j$('#'+fieldToHide).find('.lookupInput').find('input.508Input').prop('disabled', true);
                j$('#'+fieldToHide).find('.lookupInput').children("a.508Input").on("click", false);
                    }else{
            	j$('#field'+fieldToHide).find('.dependentFilter').find('input.508Input,select.508Input').prop('disabled', false);
                j$('#'+fieldToHide).find('.lookupInput').find('input.508Input').prop('disabled', false);
                j$('#'+fieldToHide).find('.lookupInput').children("a.508Input").off("click");
            }
        } else if(operator == 'NOT IN') {
        	var splitFields =  hideVal.split(',');
        	//console.log('spliFields--',splitFields);
            if(contains.call(splitFields, fieldValue) == false){
            	j$('#field'+fieldToHide).find('.dependentFilter').find('input.508Input,select.508Input').prop('disabled', true);
                j$('#'+fieldToHide).find('.lookupInput').find('input.508Input').prop('disabled', true);
                j$('#'+fieldToHide).find('.lookupInput').children("a.508Input").on("click", false);
            } else {
            	j$('#field'+fieldToHide).find('.dependentFilter').find('input.508Input,select.508Input').prop('disabled', false);
                j$('#'+fieldToHide).find('.lookupInput').find('input.508Input').prop('disabled', false);
                j$('#'+fieldToHide).find('.lookupInput').children("a.508Input").off("click");
            }
        }
                    	
    }
	                            
    /*
		Prajakta: This function supports ==,!=,IN and NOT IN operator. 
		On the fly we can make field blank. 
		json example:[{"FieldToHide":"ggf_dev6__SampleText1__c","FieldValue":"true","Operator":"==","Action":"hide"}]
	*/
    function hideField(fieldName, fieldValue, hideVal, fieldToHide, operator, action) {
    	if(operator == '==') {
	                       if(fieldValue === hideVal) {
	                            j$("#field" + fieldToHide).hide();
	                        } else {
	                            j$("#field" + fieldToHide).show();
	                        }
	                       	
	                    } else if(operator == '!=') {
	                        if(fieldValue != hideVal ) {
	                            //console.log('equals');
	                            j$("#field" + fieldToHide).hide();
	                            
	                        } else {
	                            j$("#field" + fieldToHide).show();
	                        }
	                    }
	                    //Prajakta:Added IN and NOT IN because it is breaking for multiple JSON. For example,
	                    //[{"FieldToHide":"ggf_dev6__SampleText1__c","FieldValue":"sample2","Operator":"==","Action":"hide"},{"FieldToHide":"ggf_dev6__SampleText1__c","FieldValue":"sample123","Operator":"==","Action":"hide"}] 
	                    //[{"FieldToHide":"ggf_dev6__SampleObject1__c","FieldValue":"Grant,Grants","Operator":"IN","Action":"hide"}]
	                    else if(operator == 'IN') {
	                    	var splitFields =  hideVal.split(',');
	                    	//console.log('spliFields--',splitFields);
	                        if(contains.call(splitFields, fieldValue) == true){
	                            j$("#field" + fieldToHide).hide();
	                        } else {
	                            j$("#field" + fieldToHide).show();
	                        }
	                    } else if(operator == 'NOT IN') {
	                    	var splitFields =  hideVal.split(',');
	                    	//console.log('spliFields--',splitFields);
	                        if(contains.call(splitFields, fieldValue) == false){
	                            j$("#field" + fieldToHide).hide();
	                        } else {
	                            j$("#field" + fieldToHide).show();
	                        }
	                    }
		}


	var contains = function(needle) {
	    var findNaN = needle !== needle;
	    var indexOf;

	    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
	        indexOf = Array.prototype.indexOf;
	    } else {
	        indexOf = function(needle) {
	            var i = -1, index = -1;

	            for(i = 0; i < this.length; i++) {
	                var item = this[i];

	                if((findNaN && item !== item) || item === needle) {
	                    index = i;
	                    break;
	                }
	            }

	            return index;
	        };
	    }

	    return indexOf.call(this, needle) > -1;
	};
		//fire on change event. It will update data as per hide field JSON
        j$( document ).ready(function() {
            j$(".508Input").trigger("change");
        });

/*function setLookupValue(fieldId,valueID,valueName){
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
}*/
function getParameterByName(name,url) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(url);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function showHelpTooltip(thisVal,thm,id){             
	//console.log('thisVal',thisVal);                     
	j$('[id="'+id+'tooltip"]').tooltipster({ 
		theme: thm,                     
		multiple: true,
		position : 'bottom',
		animation :'fade',          
		contentAsHTML: true,    
		content : thisVal
	});    
	j$('[id="'+id+'tooltip"]').tooltipster('show');                                                                 
}

window.addEventListener('popstate', function(event) {
    if (event.state) {
        alert('! Entered Browser back button');
    }
}, false);

/*function getMiniLayoutContent(result,origin){	
	var tooltip = tooltipContent;	
	var tab = result.Tab;
	var record = result.Record;   
	if(tab != null) {
		j$.each(result.Tab, function(i, tabVal) { 
		    j$.each(tabVal.pageBlocks, function(j, pageBlockVal) {  
				tooltip +='<p class="tooltip-title">'+record ['Name']+'</p>';   
				tooltip +='<div id="TooltipBody" class="panel-body">';
				tooltip +='<form class="form-horizontal" role="form">'
				j$.each(pageBlockVal.fields, function(k, field) {   
					if(field.hideField != 'true')   {                     
						tooltip += '<div class="form-group border-ext ">';
						tooltip += ' <div class="row">';                                   
							tooltip += ' <div class="col-md-4 col-xs-4 col-sm-4">';
							tooltip += field.fieldLabel;
							tooltip += '</div>';					  
							var fieldVal =  j$('<span/>').html(encodeURI(record [field.fieldAPIName])).text();  
							if(field.dataType == 'CURRENCY'){
								fieldVal = '$' + fieldVal;
							}
							console.log('[-----',fieldVal );                                   
							tooltip += ' <div class="col-md-8 col-xs-8 col-sm-8" style="word-wrap:break-word; font-weight: bold;">';
							if(field.dataType == 'EMAIL'){
						        	tooltip += '<a href="mailto:'+decodeURI(fieldVal)+'">'+decodeURI(fieldVal)+'</a>';
						       	}
						    	else{
						        	tooltip += decodeURI(fieldVal);
						    	}     
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
								tooltipContent =  '<div class="tooltipWrapper" >';
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