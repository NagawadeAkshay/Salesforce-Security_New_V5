var dBService = angular.module('dataBaseServices',[]);
dBService.service('DataBaseService', function(){ 
    this.recordsCollection = {};
    //Initialize database with flextable name.
    this.initializeLokiDB = function(dbName,tableCommunicator){
        tableCommunicator.idbAdapter = new LokiIndexedAdapter('LokiAdapt');
        tableCommunicator.db = new loki(dbName,{
            adapter: tableCommunicator.idbAdapter,
            autosave: true, 
            autosaveInterval: 2000
        });
        tableCommunicator.recordsCollection = tableCommunicator.db.addCollection(dbName);
    }

    this.success = function (scope, result, event){

    }
    this.error = function (scope ,result, event){

    }
    //Update database with mask value and create the map to hide cell.
    this.createHideTableCellMap = function(scope,maskValue){
        if(scope.tableMetaData.DataTableDetailConfigMap != undefined){    
            let dataTableDetailConfigMap = scope.tableMetaData.DataTableDetailConfigMap;
            angular.forEach(dataTableDetailConfigMap, function (value, key) {

                scope.tableCommunicator.overAllEnabledField = undefined;
                let formulaJSON = angular.fromJson(dataTableDetailConfigMap[key].FormulaJSON);
                if(formulaJSON != undefined && formulaJSON.GRANDTOTAL != undefined && formulaJSON.GRANDTOTAL.indexOf('SUM(') == -1){                    
                    scope.tableCommunicator.overAllTotalValue = scope.tableCommunicator.overAllTotalValue != undefined ? scope.tableCommunicator.overAllTotalValue : {};
                    scope.tableCommunicator.overAllTotalValue[key] = formulaJSON.GRANDTOTAL;
                    scope.tableCommunicator.overAllTotalValue['isGrandTotal'] = true;
                }

                let keyField=scope.tableMetaData.DataTableDetailConfigMap[key].DisplayField!= undefined? key.replace('__c', '__r') + '.' + scope.tableMetaData.DataTableDetailConfigMap[key].DisplayField : key;
                let fieldType = scope.tableCommunicator.fieldMetaData[keyField].Type != 'REFERENCE' ? scope.tableCommunicator.fieldMetaData[keyField].Type : scope.tableCommunicator.fieldMetaData[keyField].ReferenceFieldInfo.Type;

                if(value.EnableOverAllTotal == true && scope.tableCommunicator.columnsList.indexOf(key) != -1 && (["INTEGER","PERCENT","DOUBLE","CURRENCY"].indexOf(fieldType) != -1)){
                    scope.tableCommunicator.overAllEnabledField = keyField;
                    scope.tableCommunicator.overAllTotalParams['columnList'] = scope.tableCommunicator.overAllTotalParams['columnList'] != undefined ? scope.tableCommunicator.overAllTotalParams['columnList'] : [];
                    scope.tableCommunicator.overAllTotalParams['filterClause'] = scope.tableCommunicator.overAllTotalParams['filterClause'] != undefined ? scope.tableCommunicator.overAllTotalParams['filterClause'] : {}; 
                    (scope.tableCommunicator.overAllTotalParams['columnList']).indexOf(keyField) == -1 ? scope.tableCommunicator.overAllTotalParams['columnList'].push(keyField) : '';
                    let filterClause = scope.masterFilterClause;
                    scope.tableCommunicator.overAllTotalParams['filterClause'][scope.tableCommunicator.overAllEnabledField] = filterClause;
                    //scope.tableCommunicator.isOverAllEnabled = true;                    
                }
                if(scope.tableCommunicator.hideCellJSONMap[key] != undefined){
                    scope.tableCommunicator.hideTableCellMap = scope.tableCommunicator.hideTableCellMap != undefined ? scope.tableCommunicator.hideTableCellMap : {};
                    scope.tableCommunicator.columnwiseHiddenRowIdList = scope.tableCommunicator.columnwiseHiddenRowIdList != undefined ? scope.tableCommunicator.columnwiseHiddenRowIdList : {};
                    let results =   scope.tableCommunicator.recordsCollection.chain()
                                    .find(scope.tableCommunicator.hideCellJSONMap[key])
                                    .data();
                    if(results != undefined && results.length > 0){
                        for(let i = 0; i < results.length; i++){
                            scope.tableCommunicator.hideTableCellMap[results[i].Id] = scope.tableCommunicator.hideTableCellMap[results[i].Id] != undefined ? scope.tableCommunicator.hideTableCellMap[results[i].Id] : {};
                            scope.tableCommunicator.hideTableCellMap[results[i].Id][key] = true;
                            scope.tableCommunicator.overAllTotalParams['hideExpressionRecordList'] = scope.tableCommunicator.overAllTotalParams['hideExpressionRecordList'] != undefined ? scope.tableCommunicator.overAllTotalParams['hideExpressionRecordList'] : {};
                            scope.tableCommunicator.overAllTotalParams['hideExpressionRecordList'][key] = scope.tableCommunicator.overAllTotalParams['hideExpressionRecordList'][key] != undefined ? scope.tableCommunicator.overAllTotalParams['hideExpressionRecordList'][key] : [];
                            scope.tableCommunicator.overAllTotalParams['hideExpressionRecordList'][key].push(results[i].Id);
                            results[i][key] = maskValue;
                        }
                    }
                    scope.tableCommunicator.recordsCollection.update(results);
                }
            });
        }
    }
//create the map to readOnly cell.
    this.createreadOnlyTableCellMap = function(scope){
        if(scope.tableCommunicator.readOnlyCellJSONMap != undefined){
            angular.forEach(scope.tableCommunicator.readOnlyCellJSONMap, function (value, key) {
                if(scope.tableCommunicator.readOnlyCellJSONMap[key] != undefined){
                    scope.tableCommunicator.readOnlyTableCellMap = scope.tableCommunicator.readOnlyTableCellMap != undefined ? scope.tableCommunicator.readOnlyTableCellMap : {};
                    let results =  scope.tableCommunicator.recordsCollection.chain()
                                        .find(value)
                                        .data();
                    if(results != undefined && results.length > 0){
                        for(let i = 0; i < results.length; i++){
                            scope.tableCommunicator.readOnlyTableCellMap[results[i].Id] = scope.tableCommunicator.readOnlyTableCellMap[results[i].Id] != undefined ? scope.tableCommunicator.readOnlyTableCellMap[results[i].Id]: {};
                            scope.tableCommunicator.readOnlyTableCellMap[results[i].Id][key] = true;
                        }
                    }
                }
            });
        }
        //scope.tableCommunicator.recordsCollection.update(results);
    }
    //search database. 
    this.search = function (scope){
        let clause = this.generateFilterClause(scope.quickSearchClause,scope.advFltrClause);
        let recordsInfo = {};
        recordsInfo['totalRecords'] =  scope.tableCommunicator.recordsCollection.chain()
                                            .find(clause)
                                            .data()
                                            .length;
                                
        if(scope.sortField == ''){
            recordsInfo['recordsList'] =   scope.tableCommunicator.recordsCollection.chain()
                                                .find(clause)
                                                .limit(scope.pageSize['size'])
                                                .data();
        }else{
            /*if('string,textarea,picklist,reference,id,richtextarea,email,url'.indexOf(scope.fieldMetaData[scope.lokiSortField].Type.toLowerCase()) > -1){
                function customSort(obj1, obj2) {
                    if(obj1[scope.lokiSortField] == undefined || obj2[scope.lokiSortField] == undefined) return;
                    let objValue1 = obj1[scope.lokiSortField].toLowerCase();
                    let objValue2 = obj2[scope.lokiSortField].toLowerCase();
                    if (objValue1 === objValue2) return 0;
                    if (objValue1 > objValue2) return scope.isDsc == true ? -1 : 1;
                    if (objValue1 < objValue2) return scope.isDsc == true ? 1 : -1;
                };

                recordsInfo['recordsList'] =   scope.tableCommunicator.recordsCollection.chain()
                                                    .find(clause)                                    
                                                    .sort(customSort)
                                                    .limit(scope.pageSize['size'])
                                                    .data();
            }
            else*/
            if(scope.sortFields != undefined && scope.sortFields.length == 1){                
                recordsInfo['recordsList'] =   scope.tableCommunicator.recordsCollection.chain()
                                                    .find(clause)
                                                    .simplesort(scope.lokiSortField,scope.isDsc)
                                                    .limit(scope.pageSize['size'])
                                                    .data();
            }else{
                recordsInfo['recordsList'] =   scope.tableCommunicator.recordsCollection.chain()
                                                    .find(clause)
                                                    .compoundsort(scope.sortFields)
                                                    .limit(scope.pageSize['size'])
                                                    .data();
            }
        }
        
        return recordsInfo;
    }
    //sort database with specific field.
    this.sort = function (fieldName, isDsc,scope){
        if(scope.tableCommunicator.isSpreadSheet) {
            return false; 
        }
        let clause = this.generateFilterClause(scope.quickSearchClause,scope.advFltrClause);
        let recordsList = {};
        isDsc = isDsc == undefined ? false : isDsc;
        isDsc = isDsc == 'DESC' ? true : (isDsc == 'ASC' ? false : isDsc);
       /* if(scope.tableCommunicator.rowGroupingFieldList != undefined && scope.tableCommunicator.rowGroupingFieldList.length != 0){
            scope.sortFields = [];
            scope.sortField  = scope.tableCommunicator.getReferenceFieldName(scope.tableCommunicator.rowGroupingFieldList[0]);
            angular.forEach(scope.tableCommunicator.rowGroupingFieldList, function (value, key) {
                value = scope.tableCommunicator.getReferenceFieldName(value);
                scope.sortFields.push([value,isDsc]);
            });
            scope.sortFields.push([fieldName,isDsc]);
        }*/
        if(scope.sortFields != undefined && scope.sortFields.length == 1){
            /*if('string,textarea,picklist,reference,id,richtextarea,email,url'.indexOf(scope.fieldMetaData[fieldName].Type.toLowerCase()) > -1){
               // console.log('IF',scope.fieldMetaData[fieldName].Type);
                function customSort(obj1, obj2) {
                    if(obj1[fieldName] == undefined || obj2[fieldName] == undefined) return;
                    let objValue1 = obj1[fieldName].toLowerCase();
                    let objValue2 = obj2[fieldName].toLowerCase();
                    if (objValue1 === objValue2) return 0;
                    if (objValue1 > objValue2) return scope.isDsc == true ? -1 : 1;
                    if (objValue1 < objValue2) return scope.isDsc == true ? 1 : -1;
                };

                    recordsList = scope.tableCommunicator.recordsCollection.chain()
                                    .find(clause)
                                    .sort(customSort)
                                    .limit(scope.pageSize)
                                    .data();
            } else*/
           // console.log('else',scope.fieldMetaData[fieldName].Type);
                //recordsList = this.getRecordList(scope,clause,fieldName,isDsc,'simplesort');
                recordsList= scope.tableCommunicator.recordsCollection.chain()
                                .find(clause)
                                .simplesort(fieldName, isDsc)
                                .limit(scope.pageSize['size'])
                                .data();
            }
            else{
                recordsList = scope.tableCommunicator.recordsCollection.chain()
                            .find(clause)
                            .compoundsort(scope.sortFields)
                            .limit(scope.pageSize['size'])
                            .data();                 
                }
        
        return recordsList;
    }

    /******************************************************/
    
    //Modified the method to consider the search term and advance filter clause 
    this.navigatePage = function (scope){
        let clause = this.generateFilterClause(scope.quickSearchClause,scope.advFltrClause); 
        let recordList = [];
        let sortFieldLocal = scope.lokiSortField;
      //  isDsc = isDsc == 'DESC' ? true : (isDsc == 'ASC' ? false : isDsc);
        if(scope.tableCommunicator.rowGroupingFieldList != undefined && scope.tableCommunicator.rowGroupingFieldList.length != 0){
            scope.sortFields = [];
            scope.sortField = sortFieldLocal = scope.tableCommunicator.getReferenceFieldName(scope.tableCommunicator.rowGroupingFieldList[0]);
            scope.isDsc =  scope.flexTableConfig.SortDirection != undefined?(scope.flexTableConfig.SortDirection == 'ASC'? false : true): false;
            angular.forEach(scope.tableCommunicator.rowGroupingFieldList, function (value, key) {
                value = scope.tableCommunicator.getReferenceFieldName(value);
                scope.sortFields.push([value, scope.isDsc]);
            });

            if(scope.flexTableConfig.OrderBy != undefined){
                let OrderByfieldString = scope.flexTableConfig.OrderBy;
                if(OrderByfieldString.indexOf(',') != -1 && (OrderByfieldString.toLowerCase().indexOf('desc') != -1 || OrderByfieldString.toLowerCase().indexOf('asc') != -1)){
                    let mulitipleSortFields = OrderByfieldString.split(',');
                    for(let index = 0; index < mulitipleSortFields.length; index++){
                        if(scope.tableCommunicator.rowGroupingFieldList.indexOf(mulitipleSortFields[index]) == -1){
                            if(mulitipleSortFields[index].toLowerCase().indexOf(' asc') != -1){
                                mulitipleSortFields[index] = mulitipleSortFields[index].substring(0,mulitipleSortFields[index].length-4);
                                scope.isDsc = false;
                            }
                            if(mulitipleSortFields[index].toLowerCase().indexOf(' desc') != -1){
                                mulitipleSortFields[index] = mulitipleSortFields[index].substring(0,mulitipleSortFields[index].length-5);
                                scope.isDsc = true;
                            }
                            scope.sortFields.push([mulitipleSortFields[index], scope.isDsc]); 
                        }
                    }
                }else{
                    scope.sortFields.push([scope.flexTableConfig.OrderBy, scope.isDsc]);
                }
            }
        }
        if(scope.sortField == ''){
            recordList = scope.tableCommunicator.recordsCollection.chain()
                                .find(clause)
                                .offset(scope.offset)
                                .limit(scope.pageSize['size'])
                                .data(); 
        }else{
            if(scope.sortField != undefined && scope.sortFields != undefined && scope.sortFields.length == 1){
                //recordList = this.getRecordList(scope,clause,sortFieldLocal,scope.isDsc,'simplesort');     
                recordList=scope.tableCommunicator.recordsCollection.chain()
                                .find(clause)
                                .simplesort(sortFieldLocal,scope.isDsc)
                                .offset(scope.offset)
                                .limit(scope.pageSize['size'])
                                .data();                
            }
            if(scope.sortFields != undefined && scope.sortFields.length > 1){
                recordList = scope.tableCommunicator.recordsCollection.chain()
                                .find(clause)
                                .compoundsort(scope.sortFields)
                                .offset(scope.offset)
                                .limit(scope.pageSize['size'])
                                .data();
            }        
        }
        return recordList;
    }
   
    this.generateFilterClause = function(quickSearchClause,advFltrClause){
        let findClause = {};
        let clauseArray = [];
        //Clubbing of Advance Filter 
        if(advFltrClause != undefined && advFltrClause != null){
            if(advFltrClause['$and'].length > 0){
                findClause = advFltrClause;
            }
        }
        if(quickSearchClause != undefined){
            findClause = {};
            findClause = quickSearchClause;
        } 
        if(advFltrClause != undefined && advFltrClause != null && quickSearchClause != undefined){
            findClause = {};
            if(advFltrClause['$and'].length > 0){
                clauseArray.push(advFltrClause);
            }
            clauseArray.push(quickSearchClause);
            findClause['$and'] = clauseArray; 
        }
        return findClause ;  
    }

    this.deleteRecords = function(scope,delFilterClause){
        scope.tableCommunicator.recordsCollection.chain()
             .find(delFilterClause)
             .remove();

        scope.totalRecords =   scope.tableCommunicator.recordsCollection.chain()
                                    .data()
                                    .length;
        return this.navigatePage(scope);
    }

    this.saveRecords = function(scope,newList,updateList){
        if(newList.length > 0){
            scope.tableCommunicator.recordsCollection.insert(newList);    
        }
        if(updateList.length > 0){
            scope.tableCommunicator.recordsCollection.update(updateList);   
        }
        scope.totalRecords =  scope.tableCommunicator.recordsCollection.chain()
                                .data()
                                .length;
        return this.navigatePage(scope); 
    }

    this.gotoPageNo  = function (scope,result, event){

    }
});