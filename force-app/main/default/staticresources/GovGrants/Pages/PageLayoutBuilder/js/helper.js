pageLayoutBuilderApp.factory('pageLayoutBuilderHelper', function () {
	var pageLayoutBuilderHelper = {
		
		getReferenceFields : function(field,index,level,addDrillDownFields) {	
	        console.log('-----index---',index);
	        var describeResult = field.describeInfo;
	        console.log('-----describeResult---',describeResult);  
	        var params = {};
	        params.referenceTo =  describeResult.referenceTo; 
	        params.relationshipName =  describeResult.relationshipName; 
	        params.level =  level; 
	        Visualforce.remoting.Manager.invokeAction(
	            _RemotingPageLayoutBuilderActions.GetFields,  
	            angular.toJson(params),     
	            function(retVal, event){                         
	                if (event.status) {
	                	addDrillDownFields(index+1,retVal);                                                                                                           
	                }                         
	            }, 
	            { buffer: false, escape: false}
	        );    
		},
		getAvailableFieldsIndexMap : function(availableFields){
			var availableFieldsIndexMap = {};
			
			for(var i = 0; i < availableFields.length ; i++){
				availableFieldsIndexMap[availableFields[i].fieldAPIName] = i;
			}
			console.log('-----availableFieldsIndexMap---',availableFieldsIndexMap);
			return 	availableFieldsIndexMap;
		}
	};
	return pageLayoutBuilderHelper;
})