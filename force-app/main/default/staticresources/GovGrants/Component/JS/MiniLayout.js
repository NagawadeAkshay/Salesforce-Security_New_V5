
var tooltipDetail;
//ToolTip Structuring......
function structureMiniLayout(result,origin,tooltipContent){
	tooltipDetail = getMiniLayoutContent(result,origin,tooltipContent);
	return tooltipDetail;
}

function getMiniLayoutContent(result,origin,tooltipContent){
	var tooltip = tooltipContent;	
	var tab = result.Tab;
	var record = result.Record;                           
	if(tab != null) {
	j$.each(result.Tab, function(i, tabVal) { 

		
	    j$.each(tabVal.pageBlocks, function(j, pageBlockVal) {   
	    		if(pageBlockVal.hidePageBlock !='true'){
	    				if(tabVal.pageBlocks.length > 0){
	    					var pbTitle = pageBlockVal.title !=undefined?pageBlockVal.title:'';
							tooltip +='<p title="'+pbTitle+ '" class="tooltipObjname">'+pbTitle+'</p>';
						}
						var count = 1;
						if(record ['Name'] != undefined && count == 1){
							tooltip +='<p class="tooltip-title">'+record ['Name']+'</p>';
							count++;
						}
						
						j$.each(pageBlockVal.fields, function(k, field) {   
							if(field.hideField != 'true')   {                     
								tooltip +='<form role="form">';
								tooltip += '<div class="form-group">';                                  
									tooltip += ' <div class="tooltipLabel">';
									tooltip += field.fieldLabel;
									tooltip += '</div>';
							  
									var fieldVal =  j$('<span/>').html(record [field.fieldAPIName]).text();  
									fieldVal = getconverttoText(fieldVal); //Added new function to handle xss B27u21g62
									
									if(field.dataType == 'CURRENCY'){
										fieldVal = fieldVal;
									}
									//console.log('[-----',fieldVal );                                   
									tooltip += ' <div class="tooltipValue">';
									//tooltip += decodeURI(fieldVal);     
									// Added by chinmay when click on email then it should be open in outlook   
									if(field.dataType == 'EMAIL') {
								        tooltip += '<a href="mailto:'+decodeURI(fieldVal)+'">'+decodeURI(fieldVal)+'</a>';
								       }
								       else{
											/*Bug 179600 START: Handled % sign from fields to solved Error of Uncaught URIError */
											if(fieldVal.includes("%")){
												tooltip += decodeURI(fieldVal.replaceAll("%", " "));
											}else{
								        tooltip += decodeURI(fieldVal);
								       }
											/*Bug 179600 END: Handled % sign from fields to solved Error of Uncaught URIError*/
										}
									tooltip += '</div>';                                                                                     
								
							}   
							tooltip += '</div>';
																				 
					  }) 
					} 
	  })
	})
	tooltip +='</form>';
	}else{
		tooltip +='<p class="tooltip-title">'+record ['Name']+'</p>';
		
		tooltip +='<form role="form">';
		tooltip += '<div class="form-group">';                                 
		tooltip += ' <div class="tooltipLabel>';
		tooltip += 'Name';
		tooltip += '</div>';				
		tooltip += ' <div class="tooltipValue">';
		tooltip += record ['Name'];     
		tooltip += '</div>';   
		tooltip += '</div>';
		tooltip +='</form>';
	}		
	return tooltip;
}
function getconverttoText(valueForConversion){
		if(valueForConversion?.includes("<meta")){
			if(valueForConversion.includes("no-referrer")){
				valueForConversion = valueForConversion.replaceAll("no-referrer", "origin");
				valueForConversion = valueForConversion.replaceAll("<", "&lt;");
				valueForConversion = valueForConversion.replaceAll(">", "&gt;");
			}			
		}
		valueForConversion = DOMPurify.sanitize(valueForConversion);
		return valueForConversion;
}