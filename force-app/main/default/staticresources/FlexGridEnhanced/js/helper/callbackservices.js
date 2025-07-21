var callBackServices = angular.module('callBackServices', ['dataBaseServices', 'expressionEvaluator', 'gridHelper', 'utilityServices']);

callBackServices.service('InitFlexGridConfigService', function (GridHelperService, ExpressionEvaluatorService, MessageService) {
    /*  
        This function is called on success of init flex grid. 
        It basically does the following tasks:
            1. Set up the required variables at scope and communicator level 
            2. These variables include config data for
                a. Parent
                b. Child 1
                c. Child 2
                d. Grand Child 1
                e. Grand Child 2
    */
    this.success = function (scope, initResult, event) {
        let self = this;
        scope.$apply(function () {
            if (initResult.Success == false){
                console.log('ERROR:==',initResult.Message);
                scope.customException = {};
                scope.customException.messages = [];
                MessageService.push('danger',scope.customException.messages,self.getErrorMessage(initResult.Message));
            }else{
                 self.setupConfigVariables(scope, initResult);   
            }
           
        });
    }

    this.error = function (scope, initResult, event) {
        // handle error
    }

    this.getErrorMessage = function(message){
        message = message.split('StackTrace')[0];
        return message;
    }

    this.setupConfigVariables = function (scope, initResult) {
        this.setScopeVariables(scope, initResult);
        if(initResult.GridType == 'FlexGrid' || initResult.GridType == 'FlexTable'){
            this.setCommunicatorVariables(scope, initResult);
        }
        else{
            scope.communicator.flexGridMetaData.parentFlexTableId = scope.tableMetaData.FlexTableConfigMap.FlexTableConfig.FlexTableId;
        }
        //console.log('Communicator : ',scope.communicator);     
    }
    
    this.setScopeVariables = function (scope, initResult) {
        scope.initCompleted = true;
        scope.communicator.nameSpacePrefix = initResult.NameSpacePrefix;        
        scope.tableMetaData = initResult.ParentFlexTable;
        if(initResult.ParentRecord != undefined){
            scope.tableMetaData.ParentRecord = initResult.ParentRecord;
            scope.tableMetaData.ParentRecordTypeName = initResult.ParentRecordTypeName;
        }
        scope.communicator.govGrantPleaseWaitIconURL = '';
        if(initResult.govGrantPleaseWaitIconURL != undefined ){
            scope.communicator.govGrantPleaseWaitIconURL = initResult.govGrantPleaseWaitIconURL;
        }
        //set Grid Type and Current User Info in Communicator
        scope.communicator.GridType = initResult.GridType;
        scope.communicator.currentUserInfo = initResult.CurrentUserInfo;
    }

    this.setParentRecord = function (scope, initResult, level){
        if(initResult[level] != undefined && initResult[level].ParentRecord != undefined){
            if(scope.communicator.ParentRecord == undefined){
                scope.communicator.ParentRecord = initResult[level].ParentRecord;
            }
            else{
                let parentRecord = initResult[level].ParentRecord;
                for(let key in parentRecord){
                    if(parentRecord.hasOwnProperty(key)){
                        scope.communicator.ParentRecord[key] = parentRecord[key]
                    }
                }
            }
        }
        scope.communicator.ParentRecord = initResult.ParentRecord;

        if(initResult.ParentRecord != undefined){
            scope.communicator.ParentRecord = initResult.ParentRecord;
            scope.communicator.ParentRecord.RecordType = scope.communicator.ParentRecord.RecordType != undefined ? scope.communicator.ParentRecord.RecordType : {};
            if(scope.communicator.ParentRecord.RecordTypeId == undefined && !jQuery.isEmptyObject(scope.communicator.ParentRecord.RecordType) && scope.communicator.ParentRecord.RecordType.Id != undefined){
                scope.communicator.ParentRecord['RecordTypeId'] = scope.communicator.ParentRecord.RecordType.Id;
            }
            if(initResult.ParentRecordTypeName != undefined){
                scope.communicator.ParentRecord.RecordType['DeveloperName'] = initResult.ParentRecordTypeName;
            }
        }
    }

    this.setCommunicatorVariables = function (scope, initResult) {
        //scope.communicator.ParentRecord = {};
        scope.communicator.GridTableName = j$.isEmptyObject(initResult.FlexGridMetaData)  ? initResult.ParentFlexTable.FlexTableConfigMap.FlexTableConfig.Name : initResult.FlexGridMetaData.flexGridName;
        if(initResult.GridType == 'FlexGrid'){
            scope.communicator.flexGridMetaData = initResult.FlexGridMetaData;
            scope.communicator.IsSpreadSheet = scope.communicator.flexGridMetaData.IsSpreadSheet;
        }
        if (flexGridEnhanced_stringParameters != undefined && flexGridEnhanced_stringParameters != null && flexGridEnhanced_stringParameters != '') {
            scope.communicator.stringParameters = angular.fromJson(flexGridEnhanced_stringParameters);
        }
        scope.communicator.stringParameters = scope.communicator.stringParameters ? scope.communicator.stringParameters : {};
        if(tablevsAttributesJSON[scope.communicator.GridTableName] != undefined && tablevsAttributesJSON[scope.communicator.GridTableName]["pBlockId"] != undefined){
            scope.communicator.stringParameters["pageBlockId"] =  tablevsAttributesJSON[scope.communicator.GridTableName]["pBlockId"];
        }
        if(initResult.ParentFlexTable != undefined){
            scope.communicator.parentFlexTableId = initResult.ParentFlexTable.FlexTableConfigMap.FlexTableConfig.FlexTableId;
            scope.communicator.tableObjectsMap['Parent'] = initResult.ParentFlexTable.FlexTableConfigMap.FlexTableConfig.SObjectName;
            scope.communicator.levelVsTableIdMap['Parent'] = scope.communicator.parentFlexTableId;
            scope.communicator.parentFlexTableName = initResult.ParentFlexTable.FlexTableConfigMap.FlexTableConfig.Name;
            scope.communicator.tableObjectIdMap[scope.communicator.tableObjectsMap['Parent']] = scope.communicator.parentFlexTableId ;
            scope.communicator.tableIdVsObjectAPIMap[scope.communicator.parentFlexTableId] = scope.communicator.tableObjectsMap['Parent'];
            this.setParentRecord(scope, initResult, 'ParentFlexTable');
        }
        if(flexGridEnhanced_listParameters != undefined && flexGridEnhanced_listParameters != null && flexGridEnhanced_listParameters != '') {
            scope.communicator.listParameters = angular.fromJson(flexGridEnhanced_listParameters);
        }
        if (initResult.Child1 != undefined) {
            scope.communicator.child1MetaData = initResult.Child1;
            scope.communicator.child1FlexTableId = initResult.Child1.FlexTableConfigMap.FlexTableConfig.FlexTableId;
            scope.communicator.tableObjectsMap['Child1'] = initResult.Child1.FlexTableConfigMap.FlexTableConfig.SObjectName;
            scope.communicator.levelVsTableIdMap['Child1'] = scope.communicator.child1FlexTableId;
            let sobjName = initResult.Child1.FlexTableConfigMap.FlexTableConfig.SObjectName;
            let parentTargetLookupField = initResult.Child1.FlexTableConfigMap.FlexTableConfig.ParentTargetLookupField;
            scope.communicator.parentLookupFieldMap[scope.communicator.child1FlexTableId] = parentTargetLookupField;
            if(scope.communicator.tableObjectIdMap[sobjName] == undefined){
                scope.communicator.tableObjectIdMap[sobjName] = scope.communicator.child1FlexTableId ;
            }
            scope.communicator.tableIdVsObjectAPIMap[scope.communicator.child1FlexTableId] = sobjName;
            this.setParentRecord(scope, initResult, 'Child1');
        }
        if (initResult.Child2 != undefined) {
            scope.communicator.child2MetaData = initResult.Child2;
            scope.communicator.child2FlexTableId = initResult.Child2.FlexTableConfigMap.FlexTableConfig.FlexTableId;
            scope.communicator.tableObjectsMap['Child2'] = initResult.Child2.FlexTableConfigMap.FlexTableConfig.SObjectName;
            scope.communicator.levelVsTableIdMap['Child2'] = scope.communicator.child2FlexTableId;
            let sobjName = initResult.Child2.FlexTableConfigMap.FlexTableConfig.SObjectName;
            let parentTargetLookupField = initResult.Child2.FlexTableConfigMap.FlexTableConfig.ParentTargetLookupField;
            scope.communicator.parentLookupFieldMap[scope.communicator.child2FlexTableId] = parentTargetLookupField;
            if(scope.communicator.tableObjectIdMap[sobjName] == undefined){
                scope.communicator.tableObjectIdMap[sobjName] = scope.communicator.child2FlexTableId;
            }
            scope.communicator.tableIdVsObjectAPIMap[scope.communicator.child2FlexTableId] = sobjName;
            this.setParentRecord(scope, initResult, 'Child2');

        }
        if (initResult.GrandChild1 != undefined) {
            scope.communicator.grandChild1MetaData = initResult.GrandChild1;
            scope.communicator.grandChild1FlexTableId = initResult.GrandChild1.FlexTableConfigMap.FlexTableConfig.FlexTableId;
            scope.communicator.tableObjectsMap['GrandChild1'] = initResult.GrandChild1.FlexTableConfigMap.FlexTableConfig.SObjectName;
            scope.communicator.levelVsTableIdMap['GrandChild1'] = scope.communicator.grandChild1FlexTableId;
            let sobjName = initResult.GrandChild1.FlexTableConfigMap.FlexTableConfig.SObjectName;
            let parentTargetLookupField = initResult.GrandChild1.FlexTableConfigMap.FlexTableConfig.ParentTargetLookupField;
            scope.communicator.parentLookupFieldMap[scope.communicator.grandChild1FlexTableId] = parentTargetLookupField;
            if(scope.communicator.tableObjectIdMap[sobjName] == undefined){
                scope.communicator.tableObjectIdMap[sobjName] = scope.communicator.grandChild1FlexTableId ;
            }
            scope.communicator.tableIdVsObjectAPIMap[scope.communicator.grandChild1FlexTableId] = sobjName;
            this.setParentRecord(scope, initResult, 'GrandChild1');

        }
        if (initResult.GrandChild2 != undefined) {
            scope.communicator.grandChild2MetaData = initResult.GrandChild2;
            scope.communicator.grandChild2FlexTableId = initResult.GrandChild2.FlexTableConfigMap.FlexTableConfig.FlexTableId;
            scope.communicator.tableObjectsMap['GrandChild2'] = initResult.GrandChild2.FlexTableConfigMap.FlexTableConfig.SObjectName;
            scope.communicator.levelVsTableIdMap['GrandChild2'] = scope.communicator.grandChild2FlexTableId;
            let sobjName = initResult.GrandChild2.FlexTableConfigMap.FlexTableConfig.SObjectName;
            let parentTargetLookupField = initResult.GrandChild2.FlexTableConfigMap.FlexTableConfig.ParentTargetLookupField;
            scope.communicator.parentLookupFieldMap[scope.communicator.grandChild2FlexTableId] = parentTargetLookupField;
            if(scope.communicator.tableObjectIdMap[sobjName] == undefined){
                scope.communicator.tableObjectIdMap[sobjName] = scope.communicator.grandChild2FlexTableId ;
            }
            scope.communicator.tableIdVsObjectAPIMap[scope.communicator.grandChild2FlexTableId] = sobjName;
            this.setParentRecord(scope, initResult, 'GrandChild2');
        }

        scope.communicator.parentTableHeader = initResult.ParentFlexTable.FlexTableConfigMap.FlexTableConfig.Header != undefined ? initResult.ParentFlexTable.FlexTableConfigMap.FlexTableConfig.Header : initResult.ParentFlexTable.FlexTableConfigMap.FlexTableConfig.Name;       
    }

});

callBackServices.service('FirstPageRecordsService', function (DataBaseService, ExpressionEvaluatorService, GridHelperService) {
    this.success = function (scope, result, event) {
        //console.log('sForce : init Page Record Result Length : ', result.length);
        // 1. Insert the first page records in the DB
        scope.tableCommunicator.ApprovalLockedRecordsMap = result.ApprovalLockedRecordsMap;
        if(scope.tableCommunicator.recordsCollection.chain().data().length > 0){
            scope.tableCommunicator.recordsCollection.removeDataOnly();
        }
        scope.tableCommunicator.recordsCollection.insert(result.RecordsList);
        //console.log('lokiJS : init Page Record Result : ', scope.tableCommunicator.recordsCollection.data);
        scope.tableCommunicator.recordsList = GridHelperService.getRecordList(0, scope.pageSize['size'], scope.tableCommunicator);
        //2.To Enable Column resize and Column Drag Feature.
        GridHelperService.initializeResizeAndDrag(scope);
        //3. Populate the "hideCellJSONMap" and "scope.tableCommunicator.readOnlyCellJSONMap" for first page and mask data in the DB           
//GridHelperService.expressionEvaluator(scope);
        scope.tableCommunicator.IsSpreadSheet = scope.flexTableConfig.IsSpreadSheet || scope.communicator.IsSpreadSheet;

        DataBaseService.createHideTableCellMap(scope,scope.tableCommunicator.maskValue);
        DataBaseService.createreadOnlyTableCellMap(scope);

        //4.Evaluates the Formula to the Format needed for Our Processing 
            // instead we are calling this from gridEventsHandler -> totalCountRecordSuccessHandler - 53340
        //GridHelperService.evaluateFormulaJSON(scope);

        //5. Generate the "hideActionMap" for actions part of the type --> Row
        GridHelperService.generateHideActionMap(scope);
    }

    this.error = function (scope, result, event) {
        //console.log('sForce : Error : ', event);
    }

});


callBackServices.service('AllRecordsCountService', function () {
    this.success = function (scope, result, event) {
        scope.$apply(function () {
            if (result != null && result[0] != null) {
                if(result[0]["expr0"] == undefined){// in result come from SOSL 
                    var resultLenght = result.length;
                    result = {};
                    result[0] = {expr0: resultLenght}
                }
                scope.totalRecords = (result[0]["expr0"] < 10000) ? (result[0]["expr0"] == null ? 0 : result[0]["expr0"]) : 10000;
                if(scope.totalRecords <= 200 && scope.pageSizes.indexOf('All') == -1){
                    scope.pageSizes.push('All');
                    scope.pageSizesMap.push({'value' :  parseInt(scope.flexTableConfig.MaxRecordsCount), 'label' : 'All'});
                }
                //console.log('sForce : Total records Count : ', scope.totalRecords);
            }else{
                scope.totalRecords = 0;
            }
        });
    }

    this.error = function (scope, result, event) {
        //console.log('sForce : Error : ', event);
    }

});

callBackServices.service('AllRecordsService', function (DataBaseService, GridHelperService) {
    this.success = function (scope, result, event) {
        //console.log('sForce : All Page Record Result Length:===   ', result.RecordsList.length);
        // 1. Insert the remaining records in the DB
        result.RecordsList.splice(0,scope.flexTableConfig.DefaultPageSizeEnhanced);// remove records which allready get in firstpage call
        let resultList = result.RecordList;
        if(scope.tableCommunicator.ApprovalLockedRecordsMap != undefined && Object.keys(scope.tableCommunicator.ApprovalLockedRecordsMap).length > 0){
            let ApprovalLockedRecordsMap = scope.tableCommunicator.ApprovalLockedRecordsMap;
            angular.forEach(ApprovalLockedRecordsMap, function (value, key) {
                if(result.ApprovalLockedRecordsMap == undefined){
                    result.ApprovalLockedRecordsMap = {};
                }
                result.ApprovalLockedRecordsMap[key] = value;
            }); 
        }                                                                
        scope.tableCommunicator.ApprovalLockedRecordsMap = result.ApprovalLockedRecordsMap;
        if(scope.tableCommunicator.recordsCollection.chain().data().length!=(scope.pageSize['size']+result.RecordsList.length)){
            scope.tableCommunicator.recordsCollection.insert(result.RecordsList);
        } 
        //scope.tableCommunicator.recordsCollection.insert(result.RecordsList);
        //console.log('lokiJS : recordsColletion Data:===', scope.tableCommunicator.recordsCollection.data);
        //2. Populate the "hideCellJSONMap" and "scope.tableCommunicator.readOnlyCellJSONMap" for first page and mask data in the DB           
    //GridHelperService.expressionEvaluator(scope);
        DataBaseService.createHideTableCellMap(scope,scope.tableCommunicator.maskValue);
        DataBaseService.createreadOnlyTableCellMap(scope);
        //3. Generate the "hideActionMap" for actions part of the type --> Row
        GridHelperService.generateHideActionMap(scope);
        //4. Initialize the sortField which is by default been sort or through flexTableconfig(OrderBy) at initial load 
        GridHelperService.initializeSortField(scope);
        //5.Evaluates the Formula to the Format needed for Our Processing
        if((scope.tableCommunicator.rowGroupingFieldList != undefined && scope.tableCommunicator.rowGroupingFieldList.length > 0) && scope.tableCommunicator.enableGroupedSubTotalRow == true){
            let groupField = scope.sortFields[0][0];
            let fieldType = scope.tableMetaData.FlexTableConfigMap.FieldMetaData[groupField].Type;
            let refField = scope.tableMetaData.DataTableDetailConfigMap[scope.sortFields[0][0]].DisplayField != undefined ? scope.tableMetaData.DataTableDetailConfigMap[scope.sortFields[0][0]].DisplayField : 'Name';
            if(fieldType == 'REFERENCE' && refField != undefined){
                groupField = groupField.replace('__c', '__r') + '.' + refField;
            }
            scope.tableCommunicator.recordsList = scope.tableCommunicator.recordsCollection.chain()
                                                       .simplesort(groupField, scope.sortFields[0][1])
                                                       .data();
            GridHelperService.evaluateFormulaJSON(scope);
        }
        //6. Initialize the footer variables
        GridHelperService.initFooterData(scope);
    }

    this.error = function (scope, result, event) {
       // console.log('sForce : Error:===', event);
    }
});


callBackServices.service('SearchFirstPageRecordsService', function (DataBaseService, ExpressionEvaluatorService, GridHelperService) {
    this.success = function (scope, result, event) {
        //console.log('sForce : init Page Record Result Length : ', result.length);
        // 1. Insert the first page records in the DB
        scope.tableCommunicator.ApprovalLockedRecordsMap = result.ApprovalLockedRecordsMap;
        if(scope.tableCommunicator.recordsCollection.chain().data().length > 0){
            scope.tableCommunicator.recordsCollection.removeDataOnly();
        }
        scope.tableCommunicator.recordsCollection.insert(result.RecordsList);
        //console.log('lokiJS : init Page Record Result : ', scope.tableCommunicator.recordsCollection.data);
        scope.tableCommunicator.recordsList = GridHelperService.getRecordList(0, scope.pageSize['size'], scope.tableCommunicator);
        scope.totalRecords  = scope.tableCommunicator.recordsCollection.data.length;
        //2.To Enable Column resize and Column Drag Feature.
        GridHelperService.initializeResizeAndDrag(scope);
        //3. Populate the "hideCellJSONMap" and "scope.tableCommunicator.readOnlyCellJSONMap" for first page and mask data in the DB           
//GridHelperService.expressionEvaluator(scope);
        scope.tableCommunicator.IsSpreadSheet = scope.flexTableConfig.IsSpreadSheet || scope.communicator.IsSpreadSheet;

        DataBaseService.createHideTableCellMap(scope,scope.tableCommunicator.maskValue);
        DataBaseService.createreadOnlyTableCellMap(scope);

        //4.Evaluates the Formula to the Format needed for Our Processing 
            // instead we are calling this from gridEventsHandler -> totalCountRecordSuccessHandler - 53340
        //GridHelperService.evaluateFormulaJSON(scope);

        //5. Generate the "hideActionMap" for actions part of the type --> Row
        GridHelperService.generateHideActionMap(scope);
    }

    this.error = function (scope, result, event) {
        //console.log('sForce : Error : ', event);
    }

});
