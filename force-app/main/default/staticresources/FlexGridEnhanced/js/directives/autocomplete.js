flexGrid.directive("autoComplete", function($compile, $filter,$parse,griddataprovider) {
    var fetchDataForDropDown = function(scope,refField, referenceTo, filterClause, element){
        var obj = scope.row;
       
        if(obj.Type != undefined && obj.Type == 'Freetext'){
            if(refField == referenceTo){
                let refob = referenceTo.replace('__c','__r.')
                let refer = refob+'Name';           //used in case of advance filter
                scope.column = refer;
            }
        }
        let refFieldName = scope.column;
        if(scope.column.indexOf('.') != -1){
           let r = scope.column.split('.')[0];
            refFieldName = r.replace('__r','__c');
        }
        if(refFieldName == refField){
                refField = 'Name';
        }

        valueGetter = $parse(scope.column);
        scope.viewValue = valueGetter(obj);
        var lookupval = scope.viewValue != undefined ? scope.viewValue : 'Search...';

        /*let fetchLookupDataParamMapJson = griddataprovider.fetchLookupDataParams(refField,referenceTo,null,filterClause,null)  
        //gridfactory.fetchLookupData(FetchLookupDataParamMapJson,$scope)
        console.log('Reference Field Info : ',scope.refObj);
        console.log('Lookup Value :',lookupval);
        var data = {
            results: []
        }
        Visualforce.remoting.Manager.invokeAction(
            _RemotingFlexGridEnhancedActions.FetchLookupData,
        fetchLookupDataParamMapJson,
        function(lookupResult, event) {
            if (event.status) {
                //scope.$apply(function () {                                                                                                       
               
                data.results = lookupResult.SobjList;
                data.results.unshift({id:"", text: '--None--'})
                for (var i = 0; i < data.results.length; i++) {
                    if(data.results[i].text == undefined){
                        data.results[i].text = '';
                    }
                }
            } else {}
        }, {
            buffer: false,
            escape: false
        });*/
        element.select2({
            placeholder: lookupval,
            //data: data,
            query: function(query){
                scope.queryData({
                    fieldName: refField,
                    sobjName: referenceTo,
                    query: query,
                    filterClause: filterClause
                });
            }
        });
        element.on('change', function (evt) {
            if(evt.added != undefined){
				//if clause used in case of advance filter
                if(scope.row.Type != undefined && scope.row.Type == 'Freetext'){
                    scope.row['Value'] = evt.added.id;
                    scope.row['searchText'] = evt.added.text;
                }else{
                    scope.row[scope.orgFieldName] = evt.added.id; 
                    let valueSetter = $parse(scope.column);
                    valueSetter.assign(scope.row,evt.added.text);
                    scope.changeHandler({record : scope.row,
                        fieldName : scope.orgFieldName,
                        fiedValue : scope.row[scope.orgFieldName]
                    }); 
                }
            }
       });
    }


    var fetchDataForAutoSuggest = function(scope, refField, referenceTo, filterClause,element) {
        var obj = scope.row;
        //used in case of advance filter
        if(obj.Type != undefined && obj.Type == 'Freetext'){
            if(refField == referenceTo){
                let refob = referenceTo.replace('__c','__r.')
                let refer = refob+'Name';
                scope.column = refer;
            }
        }
        let refFieldName = scope.column;
        if(scope.column.indexOf('.') != -1){
           let r = scope.column.split('.')[0];
            refFieldName = r.replace('__r','__c');
        }
        if(refFieldName == refField){
			refField = 'Name';
        }
		
		// Display filed in edit mode
		let strDisplayField = (scope.detailInfo[scope.column] && scope.detailInfo[scope.column].DisplayField) 
                                                ? scope.detailInfo[scope.column].DisplayField 
                                                : undefined;
												
		let refFieldGetter = scope.column;
		if(strDisplayField) {
			let refFieldDisplay = '';
			refFieldDisplay = scope.column.replace('__c', '__r.');
			refFieldDisplay = refFieldDisplay + strDisplayField;
			refFieldGetter = refFieldDisplay;
		}
        valueGetter = $parse(refFieldGetter);      
        scope.viewValue = valueGetter(obj);
        var lookupval = scope.viewValue != undefined ? scope.viewValue : 'Search...';
        // var keyValueMap = scope.tableMetadata.KeyValueMap;
        let parentRecordId = escape(parentId);
        if (filterClause != null){
            if(parentRecordId != null){
                 filterClause = filterClause.replaceAll('{!parentId}', parentRecordId);    
            }
            filterClause = filterClause.replaceAll('{!rowId}', scope.row.Id);     
        }
        //console.log('---lookupval----2-',lookupval);
        element.select2({
            minimumInputLength: 1,
            placeholder: lookupval,
            allowClear: true,
            formatInputTooShort: function() {
                return "Please enter 1 or more character";
            },
            query: function(query) {
                scope.queryData({
                    fieldName: refField,
                    sobjName: referenceTo,
                    query: query,
                    filterClause: filterClause                });
            }
        });
        
        element.on('change', function (evt) {
			//if clause used in case of advance filter
            if(evt.added != undefined){
                if(scope.row.Type != undefined && scope.row.Type == 'Freetext'){
                    scope.row['Value'] = evt.added.id;
                    scope.row['searchText'] = evt.added.text;
                }
                else{
                    scope.row[scope.orgFieldName] = evt.added.id;
					
					// Display filed in edit mode
					let strDisplayField = (scope.detailInfo[scope.column] && scope.detailInfo[scope.column].DisplayField) 
                                                ? scope.detailInfo[scope.column].DisplayField 
                                                : undefined;
												
					let refFieldSetter = scope.column;
					if(strDisplayField) {
						let refFieldDisplay = '';
						refFieldDisplay = scope.column.replace('__c', '__r.');
						refFieldDisplay = refFieldDisplay + strDisplayField;
						refFieldSetter = refFieldDisplay;
					}
					
                    let valueSetter = $parse(refFieldSetter);
                    valueSetter.assign(scope.row,evt.added.text);
					
                    scope.changeHandler({record:scope.row,
                       fieldName:scope.orgFieldName,
                       fieldValue:scope.row[scope.orgFieldName]
                    });     
                }
            }
            if(evt.removed != undefined){
                if(scope.row[scope.orgFieldName] == evt.removed.id){
                    scope.row[scope.orgFieldName] = null;
	
					let strDisplayField = (scope.detailInfo[scope.column] && scope.detailInfo[scope.column].DisplayField) 
                                                ? scope.detailInfo[scope.column].DisplayField 
                                                : undefined;
												
					let refFieldSetter = scope.column;
					if(strDisplayField) {
						let refFieldDisplay = '';
						refFieldDisplay = scope.column.replace('_c', '_r.');
						refFieldDisplay = refFieldDisplay + strDisplayField;
						refFieldSetter = refFieldDisplay;
					}
										
                    scope.changeHandler({record:scope.row,
                       fieldName:scope.orgFieldName,
                       fieldValue:scope.row[scope.orgFieldName]
                    });     
                }
            }
        });
    }
    var dependentFieldHandler = function(scope, element, whereClause, newValue, oldValue) {
        var disabled = false;
        var controllingFieldsArray = scope.dependentColumnsMap[scope.refObj.ReferenceTo];
        var filterClause = scope.detailInfo[scope.refObj.ReferenceTo].WhereClause != undefined ? scope.detailInfo[scope.refObj.Reference].WhereClause : null;
        
        if (controllingFieldsArray != undefined && filterClause != null) {
            for (var i = 0; i < controllingFieldsArray.length; i++) {
                var cField = controllingFieldsArray[i];
                console.log('scope.row[cField]---',scope.row[cField]); 
                if (scope.row[cField] == undefined) {
                    disabled = true;
                }
                if (newValue != undefined) {
                    if (newValue[cField] != scope.row[cField]) {
                        element.select2("val", "");
                    }
                }
                filterClause = filterClause.replaceAll('{' + cField + '}', scope.row[cField]);
            }
        }
        
        
        if (disabled == false) {
            element.prop("disabled", false);
            if (scope.detailInfo[scope.refObj.Name].RenderType == 'Autosuggest') {
                fetchDataForAutoSuggest(scope, element, filterClause);
            } else {
                fetchDataForDropDown(scope, element, filterClause);
            }
        } else {
            element.prop("disabled", true);
        }
    }
    return {
        restrict: 'A',
        scope: {
            queryData: '&',
            refObj: '=',
            row: '=',
            column: '=',
            orgFieldName : '=',
            detailInfo: '=',
            fieldValue : '=',
            fieldsColumnMap: '=',
            tableMetaData: '=',
            changeHandler: '&'
        },
        link: function(scope, element, attr) {
            //----Function for replace all-----                                                        
            String.prototype.replaceAll = function(search, replacement) {
                var target = this;
                return target.replace(new RegExp(search, 'g'), replacement); //False +ve for non literal regex used for sanitization, as we are not using for sanitization purpose
            };

            var refField = scope.refObj.ReferenceFieldInfo.FieldPath;
            if(refField == 'RecordTypeId'){
                refField = 'RecordType';
            }
            let orgRefField = angular.copy(refField);
            //console.log('---dependentColumnsMap---',scope.dependentColumnsMap);
            //console.log('---refField---',refField);
            //console.log('---tableMetadata---',scope.tableMetaData);
            let referenceTo = scope.tableMetaData.FlexTableConfigMap.FieldMetaData[orgRefField].ReferenceTo;
            if (scope.detailInfo != undefined && scope.detailInfo[refField] != undefined) {
                if(scope.detailInfo[refField].DisplayField != undefined){
                    refField = scope.tableMetaData.DataTableDetailConfigMap[refField].DisplayField;
                    referenceTo = scope.tableMetaData.FlexTableConfigMap.FieldMetaData[orgRefField].ReferenceTo;
                   // scope.isDisplayField = true;
                }
                scope.dependentColumnsMap = {};
                let whereClause = scope.detailInfo[orgRefField].WhereClause != undefined ? scope.detailInfo[orgRefField].WhereClause : null;
                //--code for controlling field
                if(whereClause != null){
                    for (var i = 0;i < scope.tableMetaData.FlexTableConfigMap.ColumnNamesList.length;i++) {                        
                        let field = scope.tableMetaData.FlexTableConfigMap.ColumnNamesList[i];
                        if (whereClause.indexOf("{" + field + "}") != -1) {                            
                            if (scope.dependentColumnsMap[orgRefField] == undefined) {
                                scope.dependentColumnsMap[orgRefField] = [];
                            }
                            scope.dependentColumnsMap[orgRefField].push(field);
                        }
                    }
                }
                //console.log('dependentColumnsMap : ',scope.dependentColumnsMap);             
                if(scope.dependentColumnsMap[orgRefField] != undefined) {
                    scope.$watch('row', function(newValue, oldValue) {
                        if (newValue){
                            dependentFieldHandler(scope, element, newValue, oldValue);
                        }
                    }, true);                                                   
                }else{ 
                    if(scope.tableMetaData.DataTableDetailConfigMap[orgRefField].RenderType == 'Autosuggest') {
                        fetchDataForAutoSuggest(scope,refField,referenceTo, whereClause,element);
                    } else {
                        fetchDataForDropDown(scope,refField,referenceTo,whereClause,element);
                    }
                }
            }
        }
    }
});