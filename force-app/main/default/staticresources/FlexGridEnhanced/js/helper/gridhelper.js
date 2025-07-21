var gridHelper = angular.module('gridHelper', ['expressionEvaluator','dataBaseServices']);
var finalParentExpressionEval = undefined; //this variable is use to evaluate hide expression
gridHelper.service('GridHelperService', function (ExpressionEvaluatorService,DataBaseService,$parse) {
    
    /*
        Creates a Record Level Map of Actions to Show/Hide based on Hide Actions (Hide for profile,user & role)
        and Hide Decision Field.
    */
    
    this.generateHideActionMap = function(scope){
        let flexTableRowActions = scope.tableMetaData.FlexTableActionMap.Row;
        scope.tableCommunicator.hideActionMap = scope.tableCommunicator.hideActionMap != undefined ? scope.tableCommunicator.hideActionMap : {};
        angular.forEach(scope.tableCommunicator.recordsList, function (value, key) {
            angular.forEach(flexTableRowActions, function (actionValue, actionKey) {
                if(scope.tableCommunicator.ApprovalLockedRecordsMap != undefined && scope.tableCommunicator.ApprovalLockedRecordsMap[value.Id] == true && (actionValue.StandardAction != undefined || actionValue.ActionBehavior != undefined) && ((actionValue.StandardAction == 'Edit' || actionValue.ActionBehavior == 'EditRecord') || actionValue.StandardAction == 'Delete')){
                    scope.tableCommunicator.hideActionMap[value.Id] = scope.tableCommunicator.hideActionMap[value.Id] != undefined ? scope.tableCommunicator.hideActionMap[value.Id] : {};
                    scope.tableCommunicator.hideActionMap[value.Id][actionValue.Name] = true;
                }
            });
        });
       
        angular.forEach(flexTableRowActions, function (actionValue, actionKey) {
            if(actionValue.HideExpressionJSON != undefined){
                if(actionValue.EnableParentHideLogic != true){
                    let exp = ExpressionEvaluatorService.expressionEvaluator(scope, angular.fromJson(actionValue.HideExpressionJSON), false, false);
                    let results =  scope.tableCommunicator.recordsCollection.chain()
                                        .find(exp)
                                        .data();
                    if(results != undefined && results.length > 0){
                        for(let i = 0; i < results.length; i++){
                            scope.tableCommunicator.hideActionMap[results[i].Id] = scope.tableCommunicator.hideActionMap[results[i].Id] != undefined ? scope.tableCommunicator.hideActionMap[results[i].Id] : {};
                            scope.tableCommunicator.hideActionMap[results[i].Id][actionValue.Name] = true;
                        }
                    }
                    
                }
                if(actionValue.EnableParentHideLogic == true){   
                    let recordsList = scope.tableCommunicator.recordsList;
                    let hideExpressionResult = ExpressionEvaluatorService.expressionEvaluator(scope, angular.fromJson(actionValue.HideExpressionJSON), false, true);
                    let hideLogicResult;
                    /*if(hideExpressionResult["$and"] != undefined && hideExpressionResult["$and"].length > 0){
                        hideLogicResult = (hideExpressionResult["$and"].indexOf(false) == -1) ? true : false;
                    }
                    if(hideExpressionResult["$or"] != undefined && hideExpressionResult["$or"].length > 0){
                        hideLogicResult = (hideExpressionResult["$or"].indexOf(true) != -1) ? true : false;
                    }*/
                    finalParentExpressionEval = undefined; 
                    hideLogicResult = parentExpressionEval(hideExpressionResult);

                    if(hideLogicResult != undefined){
                        for(let i = 0; i < recordsList.length; i++){
                            scope.tableCommunicator.hideActionMap[recordsList[i].Id] = scope.tableCommunicator.hideActionMap[recordsList[i].Id] != undefined ? scope.tableCommunicator.hideActionMap[recordsList[i].Id] : {};
                            scope.tableCommunicator.hideActionMap[recordsList[i].Id][actionValue.Name] = hideLogicResult;
                        }
                    }
                }
                angular.forEach(scope.tableCommunicator.recordsList, function (row, rowIndex) {
                    if(row['isTotal'] != true && row['isSubTotal'] != true){
                        if(scope.tableCommunicator != undefined && scope.tableCommunicator.hideActionMap != undefined && scope.tableCommunicator.hideActionMap[row.Id] != undefined && scope.tableCommunicator.hideActionMap[row.Id][actionValue.Name] == true){
                            scope.tableCommunicator.hideActionColumn = scope.tableCommunicator.hideActionColumn != undefined ? scope.tableCommunicator.hideActionColumn && true : true;
                        }   else    {
                            scope.tableCommunicator.hideActionColumn = scope.tableCommunicator.hideActionColumn != undefined ? scope.tableCommunicator.hideActionColumn && false : false;
                        }
                    }
                });

            }else {
             scope.tableCommunicator.hideActionColumn = false;
        }         
        
        });        
    }

    this.generateHideTopActionMap = function(scope){
        let flexTableTopActions = scope.tableMetaData.FlexTableActionMap.Top;
        angular.forEach(flexTableTopActions, function (actionValue, actionKey) {
            if(actionValue.HideExpressionJSON != undefined){
                scope.tableCommunicator.hideActionMap['Top'] = scope.tableCommunicator.hideActionMap['Top'] != undefined ? scope.tableCommunicator.hideActionMap['Top'] : {};
                let hideExpressionResult = ExpressionEvaluatorService.expressionEvaluator(scope, angular.fromJson(actionValue.HideExpressionJSON), false, true);
                finalParentExpressionEval = undefined;
                let finalHideExpressionResult = parentExpressionEval(hideExpressionResult);
            /*    if(hideExpressionResult["$and"] != undefined && hideExpressionResult["$and"].length > 0){
                    scope.tableCommunicator.hideActionMap['Top'][actionValue.Name] = (hideExpressionResult["$and"].indexOf(false) == -1) ? true : false;
                }
                if(hideExpressionResult["$or"] != undefined && hideExpressionResult["$or"].length > 0){
                    scope.tableCommunicator.hideActionMap['Top'][actionValue.Name] = (hideExpressionResult["$or"].indexOf(true) != -1) ? true : false;
                }
                */
               scope.tableCommunicator.hideActionMap['Top'][actionValue.Name] = finalHideExpressionResult;
            }
            
        });
    }
    var parentExpressionEval = function(exp){
        let prevConditon;
        finalParentExpressionEval = undefined;
        if(exp.$or || exp.$and){
            let cond = (exp.$or ? exp.$or : exp.$and);
            let prevConditon = (exp.$or ? '||' : '&&');
            for(let i = 0; i < cond.length; i++){
                if(typeof cond[i] == 'object'){
                    cond[i] = parentExpressionEval(cond[i]);
                }
            }
            for(let i = 0; i < cond.length; i++){
                let condResult = typeof cond[i] == 'boolean' ? cond[i] : parentExpressionEval(cond[i]);

                if(prevConditon == '||'){
                    finalParentExpressionEval = finalParentExpressionEval != undefined ? finalParentExpressionEval : false;
                    finalParentExpressionEval = finalParentExpressionEval || condResult;
                }else{
                    finalParentExpressionEval = finalParentExpressionEval != undefined ? finalParentExpressionEval : true;
                    finalParentExpressionEval = finalParentExpressionEval && condResult;
                }
            }            
        }
        return finalParentExpressionEval;
    }

    this.evaluateFormulaJSON = function(scope){
        
        scope.parse = $parse;
        let recordsCount = angular.copy(scope.tableCommunicator.recordsList.length);
        if( scope.tableCommunicator.recordsList.length > 0 && scope.isSearchTable != true ){
            
            for(let index = 0; index < scope.tableCommunicator.recordsList.length; index++){
                let row = scope.tableCommunicator.recordsList[index];
                if(row.isSubTotal == true || row.isTotal == true){
                    scope.tableCommunicator.recordsList.splice(index, 1);	
                    index--;                    	
                }
            }
            let totalRow = {};
            let formulaJSON = angular.copy(scope.tableCommunicator.FormulaJSON);
            scope.tableCommunicator.rowIndexMap = {};
            scope.tableCommunicator.rowGroupMap = {};
            let autoRowIndex = 1;
            
            let recordsList = scope.tableCommunicator.recordsList;
            let rowGroupingFieldList = scope.tableCommunicator.rowGroupingFieldList;
            let rowGroupSubTotalFieldMap = scope.tableCommunicator.rowGroupSubTotalFieldMap;
            let groupTitleIndex = {};
            let groupTitleValue={};
            let groupSubTotalRow = {};

            let computedRowArray = [0];
            let computedRowMap = {};
            let isSubtotalEnabled = !(jQuery.isEmptyObject(rowGroupSubTotalFieldMap)); 
            
            let newGroupedRecordList = [];

            if(scope.tableCommunicator.enableGroupedSubTotalRow == true && scope.tableCommunicator.rowGroupingFieldList.length > 0){
                let numericFields = [];
                for (let i = 0; i < scope.tableCommunicator.columnsList.length; i++) {
                    let columnAPIName = scope.tableCommunicator.columnsList[i];
                    if(scope.fieldMetaData[columnAPIName].Type == 'INTEGER' ||
                        scope.fieldMetaData[columnAPIName].Type == 'CURRENCY' ||
                        scope.fieldMetaData[columnAPIName].Type == 'PERCENT' ||
                        scope.fieldMetaData[columnAPIName].Type == 'DOUBLE' ){
                            numericFields.push(columnAPIName);
                        }
                }
                let newRow = {}, groupFieldValue;  
                
                angular.forEach(scope.tableCommunicator.rowGroupingFieldList, function (fieldValue, fieldKey) {
                    for(let index = 0; index < recordsList.length; index++){
                        let row = recordsList[index];
                        {
                            if(row != undefined && (groupFieldValue != row[fieldValue])){
                                groupFieldValue = row[fieldValue];
                                if(!jQuery.isEmptyObject(newRow)){
                                    newGroupedRecordList.push(newRow);
                                    newRow = {};
                                }

                                let fieldMeteData = scope.tableMetaData.FlexTableConfigMap.FieldMetaData[fieldValue];
                                if (fieldMeteData != undefined && fieldMeteData.Type == 'REFERENCE') {
                                    
                                }

                                let refField = '', displayField = '';
                                let fieldDataTableDetail = scope.tableMetaData.DataTableDetailConfigMap[fieldValue];
                                if (fieldDataTableDetail != undefined &&
                                        fieldDataTableDetail.DisplayField != undefined && 
                                            row[fieldDataTableDetail.DisplayField] != undefined) {
                                    if (fieldValue.indexOf('__c') == -1) {
                                        refField = fieldValue;// + '.';
                                    } else {
                                        refField = fieldValue.replace('__c', '__r'); //.');
                                    }      
                                    displayField = fieldDataTableDetail.DisplayField;
                                }   else   {
                                    refField = fieldValue;
                                    if (fieldValue.indexOf('.') == -1) {
                                        if (fieldValue.indexOf('__c') == -1) {
                                            refField = fieldValue;// + '.Name';
                                        } else {
                                            refField = fieldValue.replace('__c', '__r');//.Name');
                                        }
                                    }
                                    displayField = 'Name';
                                }
                                let relatedDisplayField = refField + '.' + displayField;

                                let valueGetter = scope.parse(refField);
                                newRow[refField] = valueGetter(row);

                                let fieldValueGetter = scope.parse(relatedDisplayField);
                                newRow[relatedDisplayField] = fieldValueGetter(row);

                                newRow[fieldValue] = groupFieldValue;


                                //newRow['Id'] = groupFieldValue;
                                
                                // let fieldMeteData = scope.tableMetaData.FlexTableConfigMap.FieldMetaData[scope.fieldName];
                                // if (fieldMeteData != undefined && fieldMeteData.Type == 'REFERENCE') {
                                //         if(scope.fieldName.indexOf('.') == -1) {
                                //             if (scope.fieldName.indexOf('__c') == -1) {
                                //                 refIdField = scope.fieldName + '.Id';
                                //             } else {
                                //                 refIdField = scope.fieldName.replace('__c', '__r.Id');
                                //             }
                                //         }
                                //     let refFieldType = fieldMeteData.ReferenceFieldInfo.Type;
                                //     let fieldDisplayValue = groupFieldValue;
                                    

                                //     newRow[fieldValue] = scope.tableCommunicator.ReferenceDisplayFieldMap[row.Id][fieldValue];
                                // }

                                /*scope.tableCommunicator.rowIndexMap[newRow['Id']] = autoRowIndex;
                                autoRowIndex++;*/
                                // scope.tableCommunicator.ReferenceDisplayFieldMap[row.Id] = (scope.tableCommunicator.ReferenceDisplayFieldMap[row.Id] == undefined) ? {} : scope.tableCommunicator.ReferenceDisplayFieldMap[row.Id];
                                // scope.tableCommunicator.ReferenceDisplayFieldMap[row.Id][fieldValue] = (scope.tableCommunicator.ReferenceDisplayFieldMap[row.Id][fieldValue] == undefined) ? groupFieldValue : scope.tableCommunicator.ReferenceDisplayFieldMap[row.Id][fieldValue];
                                // newRow[fieldValue] = scope.tableCommunicator.ReferenceDisplayFieldMap[row.Id][fieldValue];
                            }

                            angular.forEach(numericFields, function (fieldAPIName, fieldIndex) {
                                newRow[fieldAPIName] = newRow[fieldAPIName] == undefined ? 0 : newRow[fieldAPIName];
                                if(row != undefined || row[fieldAPIName] != undefined)
                                {
                                    newRow['isGroupedSubTotal'] = true;
                                    newRow['isSubTotal'] = true;
                                    ((scope.tableCommunicator.maskValue == row[fieldAPIName] || row[fieldAPIName] == undefined) ? row[fieldAPIName] = 0 : '');
                                    newRow[fieldAPIName] = newRow[fieldAPIName] + row[fieldAPIName];
                                }
                            });
                        }
                    }
                }); 
                if(!jQuery.isEmptyObject(newRow)){
                    newGroupedRecordList.push(newRow);
                    newRow = {};
                }
                scope.tableCommunicator.recordsList = newGroupedRecordList;
                scope.totalRecords = scope.tableCommunicator.recordsList.length;
                scope.tableCommunicator.columnsList = scope.tableCommunicator.rowGroupingFieldList;
                scope.tableCommunicator.columnsList = scope.tableCommunicator.columnsList.concat(numericFields);
                scope.flexTableConfig.EnableExport = false;
                scope.flexTableConfig.EnablePagination = false;
                scope.flexTableConfig.EnablePageSize = false;
                

                
                /*for(let index = 0; index < scope.tableCommunicator.recordsList.length; index++){
                    if(scope.tableCommunicator.recordsList[index] != undefined && (!(scope.tableCommunicator.recordsList[index].isSubTotal != undefined || scope.tableCommunicator.recordsList[index].isTotal != undefined))){
                        scope.offset = scope.offset != undefined ? scope.offset : 0;
                        scope.tableCommunicator.rowIndexMap[scope.tableCommunicator.recordsList[index].Id] = scope.offset + autoRowIndex++;
                    }
                }*/
            }
            else{
            for(let index = 0; index < recordsList.length+1; index++){
                let row = recordsList[index];
                if(row == undefined){
                    continue;
                }
                //let 
                angular.forEach(scope.tableCommunicator.rowGroupingFieldList, function (fieldValue, fieldKey) {
                    computedRowMap[fieldValue] = computedRowMap[fieldValue] != undefined ? computedRowMap[fieldValue] : [];
                    computedRowMap[fieldValue].length == 0 ? computedRowMap[fieldValue].push(0) : computedRowMap[fieldValue];
                    let valueGetter = scope.parse(fieldValue);
                    let valueOfField = valueGetter(row);
                    if(row != undefined && row[fieldValue] === undefined && valueOfField != row[fieldValue]){
                        row[fieldValue] = valueOfField;
                    }
                    if(row != undefined && row['isSubTotal'] != true && groupTitleValue[fieldValue] != row[fieldValue]){
                        groupTitleValue[fieldValue] = row[fieldValue];
                        groupTitleIndex[fieldValue] = groupTitleIndex[fieldValue] != undefined ? groupTitleIndex[fieldValue] : [];
                        scope.tableCommunicator.rowGroupMap[row.Id] = scope.tableCommunicator.rowGroupMap[row.Id] != undefined ? scope.tableCommunicator.rowGroupMap[row.Id] : {};
                        scope.tableCommunicator.rowGroupMap[row.Id][fieldValue] = true;
                        let computedRow = {}
                        computedRow['isSubTotal'] = true;
                        computedRow['field'] = fieldValue;
                        if(index != 0){  //&& scope.tableCommunicator.recordsList[index]['isSubTotal'] != true){
                            let indexValue = index;
                            if(scope.tableCommunicator.recordsList[indexValue] == undefined || scope.tableCommunicator.recordsList[indexValue]['field'] == fieldValue){
                                indexValue = indexValue + 1
                            }
                                groupTitleIndex[fieldValue].push(indexValue);
                                computedRowArray.push(indexValue);
                                
                                if(isSubtotalEnabled){
                                    scope.tableCommunicator.recordsList.splice(indexValue,0,computedRow);
                                }
                        }
                    }
                });
                if(recordsList[index] != undefined && (!(recordsList[index].isSubTotal != undefined || recordsList[index].isTotal != undefined))){
                    scope.offset = scope.offset != undefined ? scope.offset : 0;
                    scope.tableCommunicator.rowIndexMap[recordsList[index].Id] = scope.offset + autoRowIndex++;
                }
            }
            
            let rowGroupingFieldListCopy = angular.copy(scope.tableCommunicator.rowGroupingFieldList);
            rowGroupingFieldListCopy.reverse().forEach( function (fieldValue, fieldKey) {                
                // LAST ROW GROUP SUB-TOTAL -- BEGAN                
                if(groupTitleIndex[fieldValue] != undefined){
                    groupTitleIndex[fieldValue].push(scope.tableCommunicator.recordsList.length);
                    let computedRow = {}
                    computedRow['isSubTotal'] = true;   
                    computedRow['field'] = fieldValue;  
                    let indexValue = scope.tableCommunicator.recordsList.length;  
                    if(scope.tableCommunicator.recordsList[indexValue] == undefined || scope.tableCommunicator.recordsList[indexValue]['field'] == fieldValue){
                        indexValue = indexValue + 1
                    }            
                    computedRowArray.push(indexValue);   
                    if(isSubtotalEnabled){
                        scope.tableCommunicator.recordsList.splice(indexValue,0,computedRow);
                    }
                }
                // LAST ROW GROUP SUB-TOTAL  -- END
            
            });

            for(let index = 0; index < scope.tableCommunicator.recordsList.length; index++){
                let row = scope.tableCommunicator.recordsList[index];
                angular.forEach(scope.tableCommunicator.rowGroupingFieldList, function (fieldValue, fieldKey) {
                    if(!(row['isSubTotal'] != true) && row['field'] != undefined && row['field'] == fieldValue){
                        let fieldName = row['field'];
                        computedRowMap[fieldName].push(index);
                    }
                });
            }

            if(isSubtotalEnabled){
                angular.forEach(scope.tableCommunicator.rowGroupingFieldList, function (fieldValue, fieldKey) {
                    computedRowArray = computedRowMap[fieldValue];
                    if(computedRowArray.length == 1){
                        let recordCount = scope.tableCommunicator.recordsList.length;
                        computedRowArray.push(recordCount);
                        if(scope.tableCommunicator.recordsList[computedRowArray[1]] == undefined || (scope.tableCommunicator.recordsList[computedRowArray[1]] != undefined && scope.tableCommunicator.recordsList[computedRowArray[1]]['isSubTotal'] != true)){
                            let computedRow = {}
                            computedRow['isSubTotal'] = true; 
                            scope.tableCommunicator.recordsList.splice(computedRowArray[1],0,computedRow);
                        }
                    }
                    for(let index = 1; index < computedRowArray.length; index++){
                        angular.forEach(rowGroupSubTotalFieldMap, function (rowGroupSubTotalFieldValue, rowGroupSubTotalFieldKey) {
                            let groupSubTotalIndex = computedRowArray[index];
                            for(let counter = computedRowArray[index-1] ; counter < computedRowArray[index]; counter++){
                                let rowRecord = recordsList[counter];
                                let dataTableDetailConfigMap = scope.tableMetaData.DataTableDetailConfigMap
                                let keyField = (dataTableDetailConfigMap[rowGroupSubTotalFieldKey] && dataTableDetailConfigMap[rowGroupSubTotalFieldKey].DisplayField!= undefined )? rowGroupSubTotalFieldKey.replace('__c', '__r') + '.' + dataTableDetailConfigMap[rowGroupSubTotalFieldKey].DisplayField : rowGroupSubTotalFieldKey;
                                let valueGetter = scope.parse(keyField);
                                let rowValue = valueGetter(rowRecord);
                                rowValue = rowValue != undefined ? rowValue : 0;
                                groupSubTotalRow[rowGroupSubTotalFieldKey] = groupSubTotalRow[rowGroupSubTotalFieldKey] != undefined ? groupSubTotalRow[rowGroupSubTotalFieldKey] : {};
                                groupSubTotalRow[rowGroupSubTotalFieldKey][groupSubTotalIndex] = groupSubTotalRow[rowGroupSubTotalFieldKey][groupSubTotalIndex] != undefined ? groupSubTotalRow[rowGroupSubTotalFieldKey][groupSubTotalIndex] : 0;
                                if(scope.tableCommunicator.maskValue == rowValue || rowValue == undefined)
                                {
                                    rowValue = 0;
                                }
                                let firstColumn = scope.tableCommunicator.columnsList[0];
                                firstColumn = firstColumn == 'Id' || firstColumn == 'id' ? scope.tableCommunicator.columnsList[1] : firstColumn;
                                {
                                    // Row Grouping SubTotal Label to be displayed in the first Column :- "Grouping Field Name : Grouped FieldValue"
                                    if(rowRecord.isSubTotal && recordsList[counter-1].isSubTotal && recordsList[counter-2].isSubTotal){
                                        rowRecord = recordsList[counter-3];
                                    }else if(rowRecord.isSubTotal && recordsList[counter-1].isSubTotal){
                                        rowRecord = recordsList[counter-2];
                                    }else if(rowRecord.isSubTotal){
                                        rowRecord = recordsList[counter-1];
                                    }
                                        groupSubTotalRow[firstColumn] == undefined ? groupSubTotalRow[firstColumn] = {} : groupSubTotalRow[firstColumn];  
                                        let subtotalLabelValue = scope.parse(scope.tableCommunicator.ReferenceDisplayFieldAPIName[fieldValue])(rowRecord);
                                        subtotalLabelValue = subtotalLabelValue == undefined ? ' -- ' : subtotalLabelValue;


                                        let dataTableDetailSubTotalLabel = scope.dataTableDetailMap[fieldValue].SubTotalLabel ? scope.dataTableDetailMap[fieldValue].SubTotalLabel + ' - ' : '';
                                        groupSubTotalRow[firstColumn][groupSubTotalIndex] = dataTableDetailSubTotalLabel + scope.tableCommunicator.fieldLabelMap[fieldValue] + ' : ' + subtotalLabelValue; 
                                }
                                groupSubTotalRow[rowGroupSubTotalFieldKey][groupSubTotalIndex] = groupSubTotalRow[rowGroupSubTotalFieldKey][groupSubTotalIndex] + rowValue;
                            }
                        });                        
                    }
                });
            }
            let computedRow = {};
            {
                angular.forEach(groupSubTotalRow, function(fieldValueArray, fieldKey) {
                    angular.forEach(fieldValueArray, function(calculatedValue, rowKey) {
                        let row = scope.tableCommunicator.recordsList[rowKey];
                        if(row != undefined && row['isSubTotal'] == true){
                            scope.tableCommunicator.recordsList[rowKey][fieldKey] = calculatedValue;
                        }
                    });
                });
            }
            {   //User Story 161384: LAHSA - Need Formula support in subtotals of tables. This should allow to show more advance items in subtotals such as Percentages - Part 2
                angular.forEach(scope.tableCommunicator.columnTotalFieldList, function(fieldName) {
                    if(scope.tableCommunicator.columnSubtotalFieldMap[fieldName] != undefined){
                        let columnSubtotalList=JSON.parse(scope.tableCommunicator.columnSubtotalFieldMap[fieldName]);
                        if(columnSubtotalList.col1 != undefined && columnSubtotalList.col2 != undefined){
                            angular.forEach(computedRowMap[scope.tableCommunicator.rowGroupingFieldList], function( rowKey) {
                                let row = scope.tableCommunicator.recordsList[rowKey];
                                if(row != undefined && row['isSubTotal'] == true){
                                    scope.tableCommunicator.recordsList[rowKey][fieldName] = scope.tableCommunicator.recordsList[rowKey][columnSubtotalList.col2] != undefined ? scope.tableCommunicator.recordsList[rowKey][columnSubtotalList.col2] : 0;
                                    scope.tableCommunicator.recordsList[rowKey][fieldName] = scope.tableCommunicator.recordsList[rowKey][fieldName] - (scope.tableCommunicator.recordsList[rowKey][columnSubtotalList.col1] != undefined ? scope.tableCommunicator.recordsList[rowKey][columnSubtotalList.col1] : 0);
                                    let tempValue = (scope.tableCommunicator.recordsList[rowKey][fieldName] / (scope.tableCommunicator.recordsList[rowKey][columnSubtotalList.col1])) * 100;
                                    scope.tableCommunicator.recordsList[rowKey][fieldName] = tempValue == 'Infinity	' ? 'N/A' : tempValue;
                                    console.log(scope.tableCommunicator.recordsList[rowKey][fieldName]);
                                }
                            });
                        }                        
                    }                    
                });
            }
            if(formulaJSON && !jQuery.isEmptyObject(formulaJSON) && !isSubtotalEnabled){
                for(let index = 0; index < scope.tableCommunicator.recordsList.length; index++){
                    let SubTotalRowIndex = index + 1;
                    let newRow = {};
                    let isExisting = {};    
                    isExisting[SubTotalRowIndex] = false;
                    scope.tableCommunicator.subTotalMap = scope.tableCommunicator.subTotalMap != undefined ? scope.tableCommunicator.subTotalMap : {};
                    angular.forEach(formulaJSON, function (jsonValue, rowField) {
                        if(jsonValue[SubTotalRowIndex] != undefined){
                            scope.tableCommunicator.subTotalMap[SubTotalRowIndex] = scope.tableCommunicator.subTotalMap[SubTotalRowIndex] != undefined ? scope.tableCommunicator.subTotalMap[SubTotalRowIndex] : {};
                            if(jsonValue[SubTotalRowIndex].indexOf('r.f[') == -1){ 
                                newRow[rowField] = jsonValue[SubTotalRowIndex];
                                newRow['isSubTotal'] = true;
                            }
                            else{
                                //newRow[rowField] = '{{' + jsonValue[SubTotalRowIndex].replace(new RegExp('r.f\\[', 'g'), 'tableCommunicator.recordsList.'+rowField+'[\'tableCommunicator.recordsList[').replace(new RegExp('\\]\\+', 'g'), '].Id\']+') + '}}';
                                //newRow[rowField] = '{{' + jsonValue[SubTotalRowIndex].replace(new RegExp('r.f\\[', 'g'), 'tableCommunicator.recordsList[').replace(new RegExp('\\]\\+', 'g'), '].' + rowField + '+') + '}}';
                                let fieldValueList = '';
                                let evaluateFormulaFlag = true;
                                if(!jQuery.isEmptyObject(jsonValue) && jsonValue[SubTotalRowIndex] != undefined) { 
                                        fieldValueList = jsonValue[SubTotalRowIndex].replace(new RegExp('r.f\\[', 'g'), '').replace(new RegExp('r.f\\[', 'g'), '').replace(new RegExp('\\]', 'g'), '' ).split(/(\-|\+)/g);

                                    let isMasked = false;
                                    for(let index = 0; index < fieldValueList.length; index++){
                                        let rowIndex = fieldValueList[index];
                                        if(rowIndex == '+' || rowIndex == '-'){
                                            continue;
                                        }
                                        if(scope.tableCommunicator.recordsList[rowIndex] != undefined && scope.tableCommunicator.recordsList[rowIndex][rowField] != undefined && ((scope.tableCommunicator.recordsList[rowIndex].isSubTotal != undefined && scope.tableCommunicator.recordsList[rowIndex].isSubTotal) || scope.tableCommunicator.maskValue == scope.tableCommunicator.recordsList[rowIndex][rowField])){
                                            isMasked = true;    
                                            jsonValue[SubTotalRowIndex] = jsonValue[SubTotalRowIndex].replace(new RegExp('r.f\\['+rowIndex+'\\]', 'g'), '').replace(/(^(\+|\-))|((\-|\+)$)/g, '').replace(/(\-\+)|(\-\-)/g, '-').replace(/(\+\+)|(\+\-)/g, '+'); //False +ve for non literal regex used for sanitization, as we are not using for sanitization purpose
                                        } else {
                                            isMasked = false;
                                        }
                                        jsonValue[SubTotalRowIndex] = (jsonValue[SubTotalRowIndex] == '' && isMasked) ? scope.tableCommunicator.maskValue : jsonValue[SubTotalRowIndex];
                                    }
                                }

                                // handle refernce field 
                                let keyField;
                                if(scope.tableCommunicator.fieldMetaData[rowField].Type == 'REFERENCE' && scope.tableMetaData.DataTableDetailConfigMap[rowField] != undefined){
                                    keyField = scope.tableMetaData.DataTableDetailConfigMap[rowField].DisplayField!= undefined? rowField.replace('__c', '__r') + '.' + scope.tableMetaData.DataTableDetailConfigMap[rowField].DisplayField : rowField;
                                    let fieldType = scope.tableCommunicator.fieldMetaData[keyField].Type != 'REFERENCE' ? scope.tableCommunicator.fieldMetaData[keyField].Type : scope.tableCommunicator.fieldMetaData[keyField].ReferenceFieldInfo.Type;
                                    if(fieldType != 'INTEGER' &&
                                        fieldType != 'CURRENCY' &&
                                        fieldType != 'PERCENT' &&
                                        fieldType != 'DOUBLE' ){
                                            evaluateFormulaFlag = false
                                    }
                                }else{
                                    keyField = rowField;
                                }
                                if(evaluateFormulaFlag){   
                                    var splittedFormula = jsonValue[SubTotalRowIndex].split('+');
                                    var newFormula = '0';
                                    for(let i = 0; i < splittedFormula.length; i++){
                                        let splitPart = splittedFormula[i];
                                        newFormula = newFormula + '+(' + splitPart + ' ? ' + splitPart + ' : 0)';
                                    }
                                    jsonValue[SubTotalRowIndex] =  newFormula;
                                    newRow[rowField] =  jsonValue[SubTotalRowIndex].replace(new RegExp('r.f\\[', 'g'), 'tableCommunicator.recordsList[').replace(new RegExp('r.f\\[', 'g'), 'tableCommunicator.recordsList[').replace(new RegExp('\\]', 'g'), '].' + keyField );
                                    let refSplitField = keyField.split('.')[0];
                                    newRow[rowField] = newRow[rowField].replace(keyField + ' ?', refSplitField + ' ?');
                                    newRow['isSubTotal'] = true;
                                    angular.forEach(scope.tableCommunicator.subTotalMap, function (subTotalMapDetail, SubTotalRowId) {
                                        if(newRow[rowField].indexOf('tableCommunicator.recordsList['+SubTotalRowId+'].' + rowField) != -1){
                                            let subTotalValue = 'tableCommunicator.recordsList['+SubTotalRowId+'].' + rowField;
                                            if(scope.tableCommunicator.subTotalMap[SubTotalRowId][rowField] != undefined){
                                                newRow[rowField] = newRow[rowField].replace(subTotalValue, scope.tableCommunicator.subTotalMap[SubTotalRowId][rowField]);
                                            }
                                        } else{
                                            if(newRow[rowField].indexOf('tableCommunicator.recordsList[') == -1 && newRow[rowField].match(new RegExp("0", "g")) != null && newRow[rowField].match(new RegExp("0", "g")).length == fieldValueList.length){
                                                newRow[rowField] = scope.tableCommunicator.maskValue;
                                            }
                                        }
                                    });
                                    scope.tableCommunicator.subTotalMap[SubTotalRowIndex][rowField] = (newRow[rowField]);
                                }
                            }
                            if(isExisting[SubTotalRowIndex] ){
                                scope.tableCommunicator.recordsList[SubTotalRowIndex] = newRow;
                            }
                            else{
                                scope.tableCommunicator.recordsList.splice(SubTotalRowIndex, 0, newRow);
                                isExisting[SubTotalRowIndex] = true
                                newRow = scope.tableCommunicator.recordsList[SubTotalRowIndex]
                            }
                        }
                        newRow = newRow != undefined ? newRow : {};
                        //console.log(SubTotalRowIndex,' :  ', rowField, ' :  ', jsonValue[SubTotalRowIndex]);
                    });
                }
                }
                let recordsListLength = scope.tableCommunicator.recordsList.length;
                angular.forEach(formulaJSON, function (jsonValue, rowField) {
                        if(jsonValue['LASTROW'] != undefined){
                            scope.tableCommunicator.recordsList[recordsListLength -1] != undefined && scope.tableCommunicator.recordsList[recordsListLength -1].isTotal != undefined && scope.tableCommunicator.recordsList[recordsListLength -1].isTotal ? scope.tableCommunicator.recordsList.pop() :  '';
                            totalRow[rowField] = {};
                            let temRefField =[];
                            if(rowField.indexOf('.')!= -1){
                                temRefField = rowField.split('.');
                            }
                            if(jsonValue['LASTROW'].indexOf('(1:N)') != -1){
                                for(let index = 0; index < recordsListLength; index++){
                                    if(scope.tableCommunicator.recordsList[index] != undefined  && scope.tableCommunicator.recordsList[index][rowField] != scope.tableCommunicator.maskValue && !scope.tableCommunicator.recordsList[index]['isSubTotal']){// && scope.tableCommunicator.maskValue != scope.tableCommunicator.recordsList[index][rowField]){                        
                                        let totalRowString = (!jQuery.isEmptyObject(totalRow[rowField])) ?  totalRow[rowField].toString() : '';
                                        if (temRefField.length > 1){
                                            totalRow[rowField] = totalRowString + ('(tableCommunicator.recordsList[' + index + '].' + temRefField[0] +' ? (!isNaN(tableCommunicator.recordsList[' + index + '].' + rowField + ') ? tableCommunicator.recordsList[' + index + '].' + rowField + ': 0):0) +');
                                        }else{
                                            totalRow[rowField] = totalRowString + ('(!isNaN(tableCommunicator.recordsList[' + index + '].' + rowField + ') ? tableCommunicator.recordsList[' + index + '].' + rowField + ': 0) +');
                                            // totalRow[rowField] = totalRowString + 'tableCommunicator.recordsList[' + index + '].' + rowField + '+';
                                        }
                                    }                                          
                                }
                                (!jQuery.isEmptyObject(totalRow[rowField])) ? totalRow[rowField] = totalRow[rowField].replace(/\+$/, "") : totalRow[rowField]; 
                            }
                            else if(jsonValue['LASTROW'].indexOf('r.f[') == -1 && jsonValue['LASTROW'].indexOf('(1:N))') == -1){
                                totalRow[rowField] = jsonValue['LASTROW'];
                            }
                        }
                        let maskCount = 0;
                        if(!jQuery.isEmptyObject(totalRow) && totalRow[rowField] && Object.keys(totalRow[rowField]).length !== 0) {                           
                            let fieldValueList = totalRow[rowField].replace(new RegExp('tableCommunicator.recordsList\\[', 'g'), '').replace(new RegExp('\\]', 'g'), '' ).replace(new RegExp('.'+rowField, 'g'), '').split('+'); //False +ve for non literal regex used for sanitization, as we are not using for sanitization purpose
                            for(let index = 0; index < fieldValueList.length; index++){
                                let rowIndex = fieldValueList[index];
                                if(scope.tableCommunicator.recordsList[rowIndex] != undefined && scope.tableCommunicator.recordsList[rowIndex][rowField] != undefined && ((scope.tableCommunicator.recordsList[rowIndex].isSubTotal != undefined && scope.tableCommunicator.recordsList[rowIndex].isSubTotal) || scope.tableCommunicator.maskValue == scope.tableCommunicator.recordsList[rowIndex][rowField])){
                                    totalRow[rowField] = totalRow[rowField].replace(new RegExp('tableCommunicator.recordsList\\['+rowIndex+'\\]' + '.' + rowField, 'g'), 0); //False +ve for non literal regex used for sanitization, as we are not using for sanitization purpose
                                    maskCount++;
                                }
                            }
                        }
                        if(maskCount == recordsCount || ( totalRow[rowField] && Object.keys(totalRow[rowField]).length == 0)){
                            totalRow[rowField] = 0//scope.tableCommunicator.maskValue;
                        }
                });
            }
            if(!jQuery.isEmptyObject(totalRow)) {
                totalRow['isTotal'] = true;
                scope.tableCommunicator.recordsList.push(totalRow);
            }
        }
    }

    // This function gets the record list from the data base
    this.getRecordList = function(offset,pageSize,tableCommunicator){
        return  tableCommunicator.recordsCollection.chain()
                                        .offset(offset)
                                        .limit(pageSize)
                                        .data();
    }

    //to get the Label of Field
    this.getFieldLabel = function(fieldAPIName,scope){
        fieldAPIName = fieldAPIName.trim();
        if(fieldAPIName == 'RecordTypeId'){
            fieldAPIName = 'RecordType';
        }
        let fieldMetaDataLabel = '';
        if(scope.fieldMetaData[fieldAPIName] == undefined && scope.fieldMetaData[fieldAPIName + 'Id'] != undefined )
        {
            scope.fieldMetaData[fieldAPIName] = scope.fieldMetaData[fieldAPIName + 'Id'];
        }
        if(scope.fieldMetaData[fieldAPIName] != undefined ){
            if(scope.fieldMetaData[fieldAPIName].Type == 'REFERENCE'){
                fieldMetaDataLabel = scope.fieldMetaData[fieldAPIName].ReferenceFieldInfo.Label;
            }else{
                fieldMetaDataLabel = scope.fieldMetaData[fieldAPIName].Label; 
            } 
            scope.tableCommunicator.fieldLabelOriginalMap[fieldMetaDataLabel]  = fieldAPIName;
        }
           
        let fieldLabel =  scope.dataTableDetailMap[fieldAPIName] != undefined ? scope.dataTableDetailMap[fieldAPIName].FieldLabelOverride != undefined ? scope.dataTableDetailMap[fieldAPIName].FieldLabelOverride : fieldMetaDataLabel : fieldMetaDataLabel ; 
        return fieldLabel;
    }
    this.initializeResizeAndDrag = function(scope){

        //for Column Resize
        j$(document).ready(function (e) {
            //var $table = j$(''#'+scope.flexTableConfig.Name+'resizable'');
            var $table = j$('.gridTable');
            var startW = 0;
            var startW_neighbor = 0;
            var td_index_neighbor = 0;
            var ui_minColWidth = 0;
            //var startMouseX;

            $table.find("tr:first th, tr:first td").resizable({
                handles: 'e',
                minWidth: 30,
                start: function (event, ui) {
                    ui_minColWidth = j$(this).resizable("option", "minWidth");
                    startW = j$(this).width();
                    td_width = startW;
                    startW_neighbor = ui.element.parents('.table-responsive').find('.gridTable').first().width();
                    startMouseX = event.pageX;
                },
                stop: function (event, ui) {

                },
                resize: function (event, ui) {;
                    var mouseDiff = event.pageX - startMouseX;
                    if (ui.element.width() != td_width || mouseDiff > 0) {
                        td_width = ui.element.width();
                        
                        var table = ui.element.parents('.table-responsive').find('.gridTable').first();

                        //var d = Number(td_width) - Number(ui.originalSize.width);


                        table_width = Number(startW_neighbor) + mouseDiff;
                        table.width(table_width);

                    }
                }
            });
        });
    }
    //Initialize the sortField  at initial load 
    this.initializeSortField = function(scope){
        let sortableColumnName = this.getPaginationCookie(scope,"sortFieldName");
        let sortDirection = this.getPaginationCookie(scope,"sortDirection");
        if(scope.flexTableConfig.SortDirection != undefined){
            if (scope.flexTableConfig.SortDirection == 'ASC'){
                scope.isDsc = false;
            }else{
                scope.isDsc = true;
            }
        }else{
            scope.isDsc = false;
        } 
        scope.sortFields = scope.sortFields != undefined ? scope.sortFields : [];
        scope.sortFieldNames = scope.sortFieldNames != undefined ? scope.sortFieldNames : [];
        let tempSortFieldAry = [];
        if(scope.tableCommunicator.rowGroupingFieldList != undefined && scope.tableCommunicator.rowGroupingFieldList.length > 0){
            let rowGroupingFields = scope.tableCommunicator.rowGroupingFieldList;
            scope.sortField = rowGroupingFields[0];
            angular.forEach(rowGroupingFields , function(value, key) {
                scope.sortFields.push([value, scope.isDsc]);             
                scope.sortFieldNames.push(value);
                tempSortFieldAry.push(value);
            });
        }
        if(scope.flexTableConfig.OrderBy != undefined && sortableColumnName =='' ){
            if(scope.flexTableConfig.OrderBy.indexOf(',') != -1){
                scope.sortFieldNames = scope.sortFieldNames != undefined ? scope.sortFieldNames:[];
                let mulitipleSortFields = scope.flexTableConfig.OrderBy.split(',');
                for(let index = 0; index < mulitipleSortFields.length; index++){
                    mulitipleSortFields[index] = mulitipleSortFields[index].trim();                                    
                    let strSortDir = scope.flexTableConfig.SortDirection != undefined ? (scope.flexTableConfig.SortDirection == 'ASC' ? false : true) : false;
                    /*
                    let strSortDir =  ((mulitipleSortFields[index].toLowerCase().indexOf(' asc') != -1) ? 
                                        ( mulitipleSortFields[index] = mulitipleSortFields[index].substring(0,mulitipleSortFields[index].length-4), 'Asc') : 
                                            (mulitipleSortFields[index].toLowerCase().indexOf(' desc') != -1 ? 
                                                (mulitipleSortFields[index] = mulitipleSortFields[index].substring(0,mulitipleSortFields[index].length-5), 'Desc') : ''));
                    */                   
                    
                    
                    if(mulitipleSortFields[index].toLowerCase().indexOf(' asc') != -1){
                        mulitipleSortFields[index] = mulitipleSortFields[index].substring(0,mulitipleSortFields[index].length-4);
                        strSortDir = false;
                    }
                    if(mulitipleSortFields[index].toLowerCase().indexOf(' desc') != -1){
                        mulitipleSortFields[index] = mulitipleSortFields[index].substring(0,mulitipleSortFields[index].length-5);
                        strSortDir = true;
                    }  
                    scope.sortField = mulitipleSortFields[0];
                    if(tempSortFieldAry.indexOf(mulitipleSortFields[index]) == -1){
                        scope.sortFields.push([mulitipleSortFields[index].trim(), strSortDir]);               
                        scope.sortFieldNames.push(mulitipleSortFields[index].trim());
                        tempSortFieldAry.push(mulitipleSortFields[index]);
                    }                
                }
            }
            else{
                    scope.sortField = scope.flexTableConfig.OrderBy;
                    scope.sortFieldNames.push(scope.flexTableConfig.OrderBy);
                    if(scope.flexTableConfig.SortDirection != undefined){
                        if(scope.flexTableConfig.SortDirection.toLowerCase() == 'desc'){
                            scope.sortFields.push([scope.sortField, true]);
                        }
                        else{
                            scope.sortFields.push([scope.sortField, false]);                            
                        }
                    }
                    else{                        
                        scope.sortFields.push([scope.sortField, false]);
                    }
                    
                }
        }else if(sortableColumnName != undefined && sortableColumnName !='' ){
            scope.sortField = sortableColumnName;  
            if(scope.flexTableConfig.SortDirection != undefined && sortDirection == undefined){
                if(scope.flexTableConfig.SortDirection.toLowerCase() == 'desc'){
                    scope.sortFields.push([scope.sortField, true]);
                }
                else{
                    scope.sortFields.push([scope.sortField, false]);                            
                }
            }else if(sortDirection != undefined){
                scope.isDsc = sortDirection;
                scope.sortFields.push([scope.sortField, sortDirection]);
            }else{                        
                scope.sortFields.push([scope.sortField, false]);
            }
        }else{
            scope.sortField = 'LastModifiedDate';  
            if(scope.flexTableConfig.SortDirection != undefined){
                if(scope.flexTableConfig.SortDirection.toLowerCase() == 'desc'){
                    scope.sortFields.push([scope.sortField, true]);
                }
                else{
                    scope.sortFields.push([scope.sortField, false]);                            
                }
            }
            else{                        
                scope.sortFields.push([scope.sortField, false]);
            }
              
        }
       
        let dataTableDetailConfigMap = scope.tableMetaData.DataTableDetailConfigMap;
        scope.sortFieldLabel = scope.sortFieldLabel != undefined?scope.sortFieldLabel:'';
        let multiSortFielsList = [], rowGroupingFieldSortingLabel = false;
        if(scope.tableCommunicator.enableGroupedSubTotalRow == true && scope.tableCommunicator.rowGroupingFieldList.length > 0 && scope.sortFields.length > 0){
            scope.sortFields = scope.sortFields.slice(0,1);
            rowGroupingFieldSortingLabel = (scope.tableCommunicator.rowGroupingFieldList.indexOf(scope.sortFields[0][0]) != -1) ? true : false;
        }
        for(let index = 0; index < scope.sortFields.length; index++){
            if(scope.tableCommunicator.columnsList.indexOf(scope.sortFields[index][0]) == -1 || scope.tableCommunicator.rowGroupingFieldList.length > 0 ){
                if(multiSortFielsList.indexOf(scope.sortFields[index][0]) != -1 ){ 
                    scope.sortFields.pop();
                    multiSortFielsList.pop();
                    continue;
                }
                
                multiSortFielsList.push(scope.sortFields[index][0]);
                let SortDirectionText = scope.sortFields[index][1] == false ? 'ascending order' : (scope.sortFields[index][1] ==true ? 'descending order': scope.sortFields[index][1]);
                scope.sortFields[index][1] = scope.sortFields[index][1] == 'ASC' ? false : (scope.sortFields[index][1] == 'DESC' ? true : scope.sortFields[index][1]);
                let sortMessage = this.getFieldLabel(scope.sortFields[index][0],scope) + ' ' + SortDirectionText;
                if((scope.sortFieldLabel == '' || scope.sortFieldLabel.indexOf(sortMessage) == -1) && scope.isSearchTable != true){
                    scope.showSortMessage = scope.showSortMessage != true ? true : scope.showSortMessage;
                    scope.sortFieldLabel +=  sortMessage + ', ';
                }
            }
        }
        
        scope.tableCommunicator.sortFields = scope.sortFields;
        scope.tableCommunicator.sortFieldNames =  scope.sortFieldNames;
        
        scope.sortFieldLabel = scope.sortFieldLabel.trim();
        if(scope.sortFieldLabel.lastIndexOf(',') == scope.sortFieldLabel.length-1){
            scope.sortFieldLabel = scope.sortFieldLabel.trim().substring(0, scope.sortFieldLabel.length-1);
        }
        if(scope.sortFields.length == 0){
            scope.sortFields.push([scope.sortField, true]);
        }
        //handle the sorteField we are providing to lokiJS
        scope.handleLokiSortField(); 
        //if(scope.tableCommunicator.rowGroupingFieldList != undefined && scope.tableCommunicator.rowGroupingFieldList.length > 0){
            scope.tableCommunicator.sort(scope.sortField,scope.isDsc,undefined);
            //scope.tableCommunicator.recordsList = DataBaseService.sort(scope.lokiSortField,scope.flexTableConfig.SortDirection,scope);
            scope.showSortMessage = true;
        //}
        
        if(scope.sortFieldLabel == '' || scope.sortFieldLabel == 'Records are sorted by'){
            scope.showSortMessage = false;
        }
    }
    // This function sets the initial variables for footer
    this.initFooterData = function(scope){
        scope.pageNumber = 1;  
        scope.totalPages = Math.ceil(scope.totalRecords/scope.pageSize['size']);      
        scope.hasNext = true;
        scope.hasPrevious = false;                
    }

    this.setPaginationCookie = function(scope,key,value){
        
        let paginationCookieKey = '';
        let listViewLabel;

        if(scope.tableCommunicator.ParentRecord.Id != undefined){
            paginationCookieKey = scope.tableCommunicator.ParentRecord.Id+'_';
        }

        if(scope.tableCommunicator.listViewLabel != undefined){
             paginationCookieKey += scope.tableCommunicator.tableId+'_'+scope.tableCommunicator.listViewLabel;
        }else{
            if(scope.filterListViewList != undefined){
                for(var i=0;i<scope.filterListViewList.length ;i++){
                    let filterListView = scope.filterListViewList[i];
                    if(filterListView.IsActive == true && filterListView.IsMasterView == true){
                        listViewLabel = filterListView.Label;
                        break;
                    }
                }
            }
            
            if(listViewLabel != undefined && listViewLabel != '' ){
                paginationCookieKey += scope.tableCommunicator.tableId+'_'+listViewLabel;
            }else{
                paginationCookieKey += scope.tableCommunicator.tableId;
            }
        } 

        var jsonData = sessionStorage.getItem(paginationCookieKey);
        if(((jsonData === undefined) || (jsonData === null))) {
			jsonData = {};
			jsonData['sf'] = ''; // sortFieldName
			jsonData['sd'] = ''; // sortDirection
			jsonData['pn'] = ''; // pageNumber
			jsonData['ps'] = ''; // pageSize
			jsonData['qs'] = ''; // QuickSearch
		} else {
			jsonData = JSON.parse(jsonData);
		}

        switch(key) {
			case "sortFieldName" : {
				jsonData['sf'] = value;
			}break;
			case "sortDirection" : {
				jsonData['sd'] = value;
			}break;
			case "pageNumber" : {
				jsonData['pn'] = value;
			}break;
			case "pageSize" : {
				jsonData['ps'] = value;
			}break;
			case "SearchTerm" : {
				jsonData['qs'] = value;
			}break;
		}
        if(scope.tableCommunicator.parentId == 'undefined'){
            sessionStorage.setItem(paginationCookieKey, JSON.stringify(jsonData));
        }
        
		       
    }

    this.getPaginationCookie = function(scope,key){
 
        let paginationCookieKey='';
        let listViewLabel;

        if(scope.tableCommunicator.ParentRecord.Id != undefined){
            paginationCookieKey = scope.tableCommunicator.ParentRecord.Id+'_';
        }

        if(scope.tableCommunicator.listViewLabel != undefined){
             paginationCookieKey += scope.tableCommunicator.tableId+'_'+scope.tableCommunicator.listViewLabel;
        }else{
            if(scope.filterListViewList != undefined){
                for(var i=0;i<scope.filterListViewList.length ;i++){
                    let filterListView = scope.filterListViewList[i];
                    if(filterListView.IsActive == true && filterListView.IsMasterView == true){
                        listViewLabel = filterListView.Label;
                        break;
                    }
                }
            }
            
            if(listViewLabel != undefined && listViewLabel != '' ){
                paginationCookieKey += scope.tableCommunicator.tableId+'_'+listViewLabel;
            }else{
                paginationCookieKey += scope.tableCommunicator.tableId;
            }
        }
         
        var jsonData = sessionStorage.getItem(paginationCookieKey);
		if(((jsonData === undefined) || (jsonData === null))) {
			return '';
		} else {
			jsonData = JSON.parse(jsonData);
			switch(key) {
				case "sortFieldName" : {
					return jsonData['sf'];
				}
				case "sortDirection" : {
					return jsonData['sd'];
				}
				case "pageNumber" : {
					return jsonData['pn'];
				}
				case "pageSize" : {
					return jsonData['ps'];
				}
				case "SearchTerm" : {
					return jsonData['qs'];
				}
			}
		}

		return '';                
    }

   
});