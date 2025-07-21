var gridEventsHandler = angular.module('gridEventsHandler', ['dataBaseServices','gridHelper','utilityServices']);
gridEventsHandler.service('GridEventsHandlerService', function (DataBaseService,GridHelperService,MessageService, $window) {
    this.bindAllEvents = function(scope){
        
        scope.handleLokiSortField = function(){
            if(scope.sortField != undefined){
                scope.lokiSortField = scope.sortField;
                if(scope.fieldMetaData[scope.sortField].Type == 'REFERENCE'){
                    if(scope.dataTableDetailMap[scope.sortField] != undefined &&
                            scope.dataTableDetailMap[scope.sortField].DisplayField != undefined){
                                scope.lokiSortField = scope.sortField.replace('__c','__r.');
                                scope.lokiSortField = scope.lokiSortField+scope.dataTableDetailMap[scope.sortField].DisplayField;  
                    }else{
                        if(scope.sortField.indexOf('.') == -1){
                            if(scope.sortField.indexOf('__c') != -1){
                                scope.lokiSortField =  scope.sortField.replace('__c','__r.Name');  
                            }else{
                                scope.lokiSortField =  scope.tableCommunicator.getStandardFieldName(scope.sortField);
                            }
                        }
                    }    
                }
            }
        }


        scope.tableCommunicator.sort = function(fieldName,isDsc,event){
            if(scope.tableCommunicator.isSpreadSheet) {
                return false; 
            }
            console.log('sort:===');
            scope.sortFields = scope.sortFields != undefined ? scope.sortFields : [];
            scope.sortFieldNames = scope.sortFieldNames != undefined ? scope.sortFieldNames : [];
            scope.sortFields.length == 0 ? scope.sortFields.push([scope.sortField, scope.isDsc]) : scope.sortFields;
            //scope.selectedSortField = scope.selectedSortField != undefined ? scope.selectedSortField : [];
                let sortArray = [];
                sortArray.push(fieldName);  
                sortArray.push(isDsc);
                if(event != undefined){ 
                    if(event.shiftKey){                
                        angular.forEach(scope.sortFields , function(value, key) {
                            if(value[0]!=undefined && scope.sortFieldNames.indexOf(value[0])){
                                scope.sortFieldNames.push(value[0]);
                            } 
                            // if(fieldName !=undefined){
                            //     scope.sortFieldNames.push(fieldName.toLowerCase());
                            // }
                            if(scope.sortFieldNames.indexOf(fieldName.toLowerCase()) > -1){
                                if(value[0].toLowerCase() == fieldName.toLowerCase()){
                                        scope.sortFields[key] = sortArray;
                                }
                            } else{
                                scope.sortFields.push(sortArray);
                                scope.sortFieldNames.push(fieldName);
                            }
                        });
                    }else{
                            scope.sortFields = [];
                            scope.sortFieldNames = [];
                            //scope.selectedSortField = [];
                            scope.sortFields.push([fieldName,isDsc]);
                            scope.sortFieldNames.push(fieldName);
                            //scope.selectedSortField.indexOf(fieldName.toLowerCase()) ? scope.selectedSortField.push(fieldName.toLowerCase()) : scope.selectedSortField;
                    }
                }
            else{
                if(scope.sortFields.length == 0 && fieldName != undefined){
                    scope.sortFields = [];
                    scope.sortFields.push(sortArray);
                    scope.sortFieldNames = [];
                // scope.sortFieldNames = scope.sortFieldNames != undefined ? scope.sortFieldNames:[];
                    scope.sortFieldNames.push(fieldName);
                }
                //scope.selectedSortField = [];
                //scope.selectedSortField.indexOf(fieldName.toLowerCase()) ? scope.selectedSortField.push(fieldName.toLowerCase()) : scope.selectedSortField;                               
            }
            
            scope.sortField = fieldName;
            scope.handleLokiSortField();
            scope.showSortMessage = scope.showSortMessage != undefined ? false : true ;
            scope.isDsc = isDsc;
            scope.tableCommunicator.recordsList = DataBaseService.sort(scope.lokiSortField,isDsc,scope);
            scope.reinitializeFooterData();
            GridHelperService.generateHideActionMap(scope);
            if(!((scope.totalRecords<=scope.pageSize['size'])&&scope.tableCommunicator.enableGroupedSubTotalRow!=true)||(scope.tableCommunicator.rowGroupingFieldList==undefined||scope.tableCommunicator.rowGroupingFieldList.length==0)){
                GridHelperService.evaluateFormulaJSON(scope);
            }
            if(scope.flexTableConfig.EnableRecordSelection == true){
                scope.tableCommunicator.setSelectAllRecordCheckbox();
            }
            if(event != undefined){
                scope.tableCommunicator.sortFieldNames =  scope.sortFieldNames;
            }            
        }
        
        scope.setCookiesData = function(column){
			if( scope.pageNumber != undefined && scope.pageNumber != '' ) {
                GridHelperService.setPaginationCookie(scope,"pageNumber", scope.pageNumber);
			}
            if(scope.quickSearchTerm != undefined ) {
                GridHelperService.setPaginationCookie(scope,"SearchTerm", scope.quickSearchTerm);
			}
            if(scope.pageSize != undefined && scope.pageSize != '' ) {
                GridHelperService.setPaginationCookie(scope,"pageSize", scope.pageSize);
			}
	    }

        // Footer pagination events
        scope.next = function(){
            if(scope.communicator[scope.tableCommunicator.tableId].isEdit == true){
                scope.tableCommunicator.showConfirmBoxIfIsEdit();
                return false;
            }
            scope.communicator.openLoadingPopUp(); 
            scope.pageNumber++;
            scope.tableCommunicator.pageRefreshNumber = scope.pageNumber;
            scope.hasPrevious = true; 
            if(scope.pageNumber == scope.totalPages){
                scope.hasNext = false;
            } 
            scope.offset = scope.offset + scope.pageSize['size'];
            scope.tableCommunicator.recordsList = DataBaseService.navigatePage(scope);
            if(scope.flexTableConfig.EnableRecordSelection == true){
                scope.tableCommunicator.setSelectAllRecordCheckbox();
            }
            GridHelperService.generateHideActionMap(scope);
            GridHelperService.evaluateFormulaJSON(scope);
            setTimeout(function(){scope.communicator.closeLoadingPopUp();}, scope.pageSize['size']*200);
            scope.setCookiesData(); 
        }

        scope.previous = function(){
            if( scope.communicator[scope.tableCommunicator.tableId].isEdit == true){
                scope.tableCommunicator.showConfirmBoxIfIsEdit();
                return false;
            }
            scope.communicator.openLoadingPopUp(); 
            scope.pageNumber--;
            scope.tableCommunicator.pageRefreshNumber = scope.pageNumber;
            scope.hasNext = true;
            if(scope.pageNumber == 1){
                scope.hasPrevious = false;    
            }
            scope.offset = scope.offset - scope.pageSize['size'];
            scope.tableCommunicator.recordsList = DataBaseService.navigatePage(scope);
            if(scope.flexTableConfig.EnableRecordSelection == true){
                scope.tableCommunicator.setSelectAllRecordCheckbox();
            }
            GridHelperService.generateHideActionMap(scope);
            GridHelperService.evaluateFormulaJSON(scope);
            setTimeout(function(){scope.communicator.closeLoadingPopUp();}, scope.pageSize['size']*200);
            scope.setCookiesData(); 
        }

        scope.last = function(){
            if(scope.communicator[scope.tableCommunicator.tableId].isEdit == true){
                scope.tableCommunicator.showConfirmBoxIfIsEdit();
                return false;
            }
            scope.communicator.openLoadingPopUp(); 
            scope.pageNumber = Math.ceil(scope.totalRecords / scope.pageSize['size']);
            scope.tableCommunicator.pageRefreshNumber = scope.pageNumber;
            let recordsOnLastPage = scope.totalRecords % scope.pageSize['size'];
            if(recordsOnLastPage == 0){
                recordsOnLastPage = scope.pageSize['size'];
            }
            scope.offset = scope.totalRecords - recordsOnLastPage;
            scope.hasNext = false;
            scope.hasPrevious = true;
            scope.tableCommunicator.recordsList = DataBaseService.navigatePage(scope);
            if(scope.flexTableConfig.EnableRecordSelection == true){
                scope.tableCommunicator.setSelectAllRecordCheckbox();
            }
            GridHelperService.generateHideActionMap(scope);
            GridHelperService.evaluateFormulaJSON(scope);
            setTimeout(function(){scope.communicator.closeLoadingPopUp();}, scope.pageSize['size']*200);
            scope.setCookiesData(); 
        }

        scope.first = function(){
            if(scope.communicator[scope.tableCommunicator.tableId].isEdit == true){
                scope.tableCommunicator.showConfirmBoxIfIsEdit();
                return false;
            }
            scope.communicator.openLoadingPopUp(); 
            scope.pageNumber = 1;
            scope.tableCommunicator.pageRefreshNumber = scope.pageNumber;
            scope.hasNext = true;
            scope.hasPrevious = false;
            scope.offset = 0;
            scope.tableCommunicator.recordsList = DataBaseService.navigatePage(scope);
            if(scope.flexTableConfig.EnableRecordSelection == true){
                scope.tableCommunicator.setSelectAllRecordCheckbox();
            }
            GridHelperService.generateHideActionMap(scope);
            GridHelperService.evaluateFormulaJSON(scope);
            setTimeout(function(){scope.communicator.closeLoadingPopUp();}, scope.pageSize['size']*200);
            scope.setCookiesData(); 
        }

        scope.changePageSize = function(pageSize){
            if( scope.communicator[scope.tableCommunicator.tableId].isEdit == true){
                scope.tableCommunicator.showConfirmBoxIfIsEdit();                
                return false;
            }
            //setTimeout(function(){ scope.communicator.openLoadingPopUp();}, pageSize * 50);
            scope.communicator.openLoadingPopUp(); 
                      
            if(pageSize =='All'){
                scope.pageSize['size'] = scope.flexTableConfig.MaxRecordsCount;       
            }else{
                scope.pageSize['size'] = parseInt(pageSize);   
            }
            scope.tableCommunicator.showMassEditActions = scope.totalRecords <= scope.pageSize['size'] ? true : false;
            scope.offset = 0;
            scope.tableCommunicator.recordsList = DataBaseService.navigatePage(scope);
             if(scope.flexTableConfig.EnableRecordSelection == true){
                scope.tableCommunicator.setSelectAllRecordCheckbox();
            }
            scope.reinitializeFooterData();
            GridHelperService.generateHideActionMap(scope);
            GridHelperService.evaluateFormulaJSON(scope);
            let delayTime = scope.pageSize['size'] > 500 ? 10000 : scope.pageSize['size']*200;
            setTimeout(function(){scope.communicator.closeLoadingPopUp();}, delayTime);
            scope.setCookiesData(); 
           //scope.communicator.closeLoadingPopUp();

        }

        // Record selection events
        scope.selectRecord = function(recordId,selectVal){
            scope.tableCommunicator.recordSelectionMap[recordId] = selectVal; 
            scope.tableCommunicator.setSelectAllRecordCheckbox();
        }

        /*
            this method marks all checkbox of records on page & creates recordsSelectionMap(Id vs IscheckboxSelected). 
        */
        scope.selectAllRecords = function(selectVal){
            if(scope.tableCommunicator.recordSelectionMap == undefined){
                scope.tableCommunicator.recordSelectionMap = {};   
            }
            for(i=0;i<scope.tableCommunicator.recordsList.length;i++){
                var record = scope.tableCommunicator.recordsList[i];
				if(record.Id != undefined)
                	scope.tableCommunicator.recordSelectionMap[record.Id] = selectVal;
            }
            scope.selectAll = selectVal;
        } 

        scope.communicator.refreshAllGrid = function(){
            scope.tableCommunicator.refreshGrid();
        }

        // Header panel events
        scope.tableCommunicator.refreshGrid = function(){
            scope.communicator.openLoadingPopUp();
            scope.communicator[scope.tableCommunicator.tableId].isMassEdit = false;
            scope.communicator[scope.tableCommunicator.tableId].isEdit = false;
            scope.communicator.isMassSave = false;
            scope.pageNumber = scope.tableCommunicator.pageRefreshNumber;
            scope.communicator.isSave = false;
            scope.quickSearchTerm = '';
            scope.messages = [];        
            scope.tableCommunicator.recordsCollection.removeDataOnly();
            //scope.communicator.editRowIdMap = {};
            for(var i = scope.tableCommunicator.recordsList.length -1; i >= 0 ; i--){
                if( scope.communicator.editRowIdMap[scope.tableCommunicator.recordsList[i].Id] != undefined){
                     scope.communicator.editRowIdMap[scope.tableCommunicator.recordsList[i].Id] = false;    
                }
                if(scope.tableCommunicator.recordsList[i].Id != undefined && scope.tableCommunicator.recordsList[i].Id.length < 15){
                    scope.tableCommunicator.recordsList.splice(i,1);
                }
            }
            scope.communicator.saveRecordsMap = {};
            scope.communicator.newSaveRecordsMap = {}    
            scope.communicator.editRowIdMap = {};
            var input = document.getElementById("quickserchtext");
            if(input != undefined){
            input.value='';
            }            
            if(scope.communicator.parentFlexTableId != scope.tableCommunicator.tableId && (scope.communicator.grandChild1FlexTableId == undefined && scope.communicator.grandChild2FlexTableId == undefined)){
                scope.tableCommunicator = scope.communicator.scopeofparenttable;
                let PageNo =  scope.tableCommunicator.pageRefreshNumber;
                scope.tableMetaData =  scope.communicator.parentTableMetaData;
                scope.parentId = undefined;                
                scope.setVariables();     
                scope.pageNumber = PageNo;               
            }                      
            scope.getFirstPageRecords();
        }

        scope.tableCommunicator.removeSessionStorage = function(){
           
            let paginationCookieKey ='';
            if(scope.tableCommunicator.ParentRecord.Id != undefined){
                paginationCookieKey = scope.tableCommunicator.ParentRecord.Id+'_';
            }
            if(scope.tableCommunicator.listViewLabel != undefined){
                paginationCookieKey += scope.tableCommunicator.tableId+'_'+scope.tableCommunicator.listViewLabel;
            }else{
                paginationCookieKey += scope.tableCommunicator.tableId;
            }
            
            sessionStorage.removeItem(paginationCookieKey);
            MessageService.push('success',scope.tableCommunicator.messages,'Table has been reset.');
            let msgType = 'success';

            if(scope.tableCommunicator.isRemoveSessionStorage != undefined && scope.tableCommunicator.isRemoveSessionStorage != 'isRepeated'){
                scope.tableCommunicator.isRemoveSessionStorage = 'isRepeated';
            }else{
                scope.tableCommunicator.isRemoveSessionStorage = paginationCookieKey;
            }

            scope.communicator.openLoadingPopUp();
            scope.communicator[scope.tableCommunicator.tableId].isMassEdit = false;
            scope.communicator[scope.tableCommunicator.tableId].isEdit = false;
            scope.communicator.isMassSave = false;
            scope.pageNumber = scope.tableCommunicator.pageRefreshNumber;
            scope.communicator.isSave = false;
            scope.quickSearchTerm = '';
            scope.messages = [];        
            scope.tableCommunicator.recordsCollection.removeDataOnly();
            //scope.communicator.editRowIdMap = {};
            for(var i = scope.tableCommunicator.recordsList.length -1; i >= 0 ; i--){
                if( scope.communicator.editRowIdMap[scope.tableCommunicator.recordsList[i].Id] != undefined){
                     scope.communicator.editRowIdMap[scope.tableCommunicator.recordsList[i].Id] = false;    
                }
                if(scope.tableCommunicator.recordsList[i].Id != undefined && scope.tableCommunicator.recordsList[i].Id.length < 15){
                    scope.tableCommunicator.recordsList.splice(i,1);
                }
            }
            scope.communicator.saveRecordsMap = {};
            scope.communicator.newSaveRecordsMap = {}    
            scope.communicator.editRowIdMap = {};
            var input = document.getElementById("quickserchtext");
            if(input != undefined){
            input.value='';
            }            
            if(scope.communicator.parentFlexTableId != scope.tableCommunicator.tableId){
                scope.tableCommunicator = scope.communicator.scopeofparenttable;
                let PageNo =  scope.tableCommunicator.pageRefreshNumber;
                scope.tableMetaData =  scope.communicator.parentTableMetaData;
                scope.parentId = undefined;                
                scope.setVariables();     
                scope.pageNumber = PageNo;               
            }
            let tableId = '#'+scope.tableCommunicator.tableName+'_quickserchtext';
            j$(tableId).val('');                    
            scope.getFirstPageRecords();
            messageTimeBasedClose(msgType);

        }

     /* Bug 177766 - START - Logic to set Offset, page number, hasnext and hasprevious values */ 
        scope.tableCommunicator.ifRefreshBehaviourIsBlank = function(){ //recordList
                 if(scope.pageNumber  > Math.ceil(scope.totalRecords/scope.pageSize['size'])){
                     /*Example- if we have total 11 records and we deleted 11th record from page 3. Default page size  is 5
                     then currentpageNum will be 3 > math.ceil(10(after delete total records will be 10)/5) */
                    scope.offset =   $scope.  pageSize['size']*($scope.pageNumber-1); 
                    scope.totalPages = Math.ceil(scope.totalRecords/scope.pageSize['size']);
					if(scope.totalPages != 0)
                    	scope.pageNumber = scope.totalPages; 
                    scope.tableCommunicator.recordsList = DataBaseService.navigatePage(scope);
                    setTimeout(function(){scope.communicator.closeLoadingPopUp();}, scope.pageSize['size']*200);
                    scope.hasPrevious = true;
                    scope.hasNext = false;
                }else if(scope.pageNumber  < Math.ceil(scope.totalRecords/scope.pageSize['size'])){
                    /*Example: If we have 17 records and default page size is 5 so Total pages will be 4 
                     If we delete record from page 3 = if condition is 3 < Math.ceil(16/5) in total records 
                     it will consider record conunt once we delete record i.e. 16 in this case */
                    scope.totalPages = Math.ceil(scope.totalRecords/scope.pageSize['size']);
                }else if(scope.pageNumber  == Math.ceil(scope.totalRecords/scope.pageSize['size'])){ 
                    /*Example: If we have 16 records and default page size is 5 so Total pages will be 4 and if we delete record from page 3. 
                     then this scenario will get executed */
                    scope.totalPages = Math.ceil(scope.totalRecords/scope.pageSize['size']);
                    scope.hasPrevious = true;
                    scope.hasNext = false;
                }
        }
     /* Bug 177766 - END */ 

        /*
            this method marks selectALl checkbox(at the coloumnheader) depending on selected records. 
        */
        scope.tableCommunicator.setSelectAllRecordCheckbox =  function(){
            if(scope.flexTableConfig.EnableRecordSelection == false){
                return null;
            }
            let totalCount = 0;
            for(i=0;i<scope.tableCommunicator.recordsList.length;i++){
                var record = scope.tableCommunicator.recordsList[i];
                if(scope.tableCommunicator.recordSelectionMap[record.Id] == true){
                    totalCount++;
                }
            }
            let checkbox = document.getElementById(scope.flexTableConfig.Name+'checkBox');
            if(checkbox != undefined){
                if(totalCount == scope.tableCommunicator.recordsList.length && totalCount != 0){
                    checkbox.indeterminate = false;
                    scope.selectAll = true;
                }else if(totalCount == 0){
                    checkbox.indeterminate = false;
                    scope.selectAll = false;
                }else{
                    checkbox.indeterminate = true;
                }
            }
        }

        scope.tableCommunicator.resetSelectAllRecordCheckbox = function(){
            if(scope.flexTableConfig.EnableRecordSelection == false){
                return null;
            }  
            
            let checkbox = document.getElementById(scope.flexTableConfig.Name+'checkBox'); 
            if(checkbox != undefined){
                checkbox.indeterminate = false;
                scope.selectAll = false;
            }
        }

        scope.tableCommunicator.loadRecords = function(filterClause){
            scope.masterFilterClause = filterClause;
            scope.getFirstPageRecords();    
        }
        scope.tableCommunicator.changeListView = function(listView){
            if( scope.communicator[scope.tableCommunicator.tableId].isEdit == true||  scope.communicator[scope.tableCommunicator.tableId].isMassEdit == true){
                scope.tableCommunicator.showConfirmBoxIfIsEdit();
                return false;
            }

            if(listView.Label != undefined){
                scope.tableCommunicator.listViewLabel = listView.Label;
            }
            let tableId = '#'+scope.tableCommunicator.tableName+'_quickserchtext';
            let inputSearchText = GridHelperService.getPaginationCookie(scope,"SearchTerm");
            j$(tableId).val(inputSearchText);

            scope.messages = [];
            scope.masterFilterClause =  listView.FilterClause;
			let isMasterFilterClausePresent = (scope.masterFilterClause == undefined || scope.masterFilterClause == '') ? false : true;
            scope.isParentTargetLookupField = true;
            scope.tableCommunicator.showMassEditActions = scope.totalRecords <= scope.pageSize['size'] ? true : false;
            if(scope.parentId != undefined){
                if(scope.flexTableConfig.ParentTargetLookupField != undefined){
                    let appendClause = scope.flexTableConfig.ParentTargetLookupField+' = '+'\''+scope.parentId+'\'';
                    if(scope.masterFilterClause != undefined){
                        scope.masterFilterClause = scope.masterFilterClause.replace(new RegExp('{!parentId}','g'),escape(scope.parentId)); 
                    }else{
                        scope.masterFilterClause =  appendClause; 
                    }
                    // $scope.filterListViewList[i].FilterClause =  $scope.masterFilterClause;
                }else{
                    scope.isParentTargetLookupField = false;
                    scope.flexTableConfig.ShowHeaderPanel = false;
                    MessageService.push(scope,'ParentTargetLookup');
                }    
            }
            if(scope.masterFilterClause != undefined){
				scope.masterFilterClause = scope.replaceAllMergeFields(scope.masterFilterClause);
			}
            scope.tableCommunicator.recordsCollection.removeDataOnly();
            scope.tableCommunicator.updatedFlexHeader = listView.Label;
            scope.tableCommunicator.listViewLabel = listView.Label;
            if(!isMasterFilterClausePresent){
				scope.masterFilterClause = 'Id = null';
				MessageService.push(null, scope.tableCommunicator.messages,'filterClauseMust');
				scope.$apply();
			}//else{
				scope.getFirstPageRecords();
			//}
        }

        //advance Filter Events
        //Query on records with adv Filter Clause    
        scope.tableCommunicator.advFilterSearch = function(advFilterClause){
            scope.advFltrClause = advFilterClause; 
            let recordsInfo = DataBaseService.search(scope);
            scope.tableCommunicator.recordsList = recordsInfo['recordsList'];
            scope.totalRecords = recordsInfo['totalRecords'];
            scope.reinitializeFooterData();
            GridHelperService.generateHideActionMap(scope);
            GridHelperService.evaluateFormulaJSON(scope);
            console.log('Adv filterClause : ',advFilterClause);
            console.log('Adv filterClause records : ',scope.tableCommunicator.recordsList);    
        }

        //QuickSearch
        scope.quickSearch = function(quickSearchTerm){
            // Bug 361210: Workaround as ng-model value for quickSearchTerm is not getting reset in removeSessionStorage()
            let tableId = '#'+scope.tableCommunicator.tableName+'_quickserchtext';
            let inputValue = j$(tableId).val().trim();
            if (inputValue == '') {
                quickSearchTerm = '';
            }
            if(scope.tableCommunicator.isSpreadSheet || scope.communicator[scope.tableCommunicator.tableId].isEdit == true ) {
                $scope.tableCommunicator.showConfirmBoxIfIsEdit();
                return false;
            }
            scope.quickSearchTerm = quickSearchTerm;
            scope.pageNumber = 1;
            scope.setCookiesData();
            let quickSearchClause = {};
            searchArray = [];
            if(scope.quickSearchTerm != undefined){
                quickSearchClause ['$or'] = searchArray;
                let quickSearchTermIsValidDate = false;
                if(/^((0?[13578]|10|12)(-|\/)(([1-9])|(0[1-9])|([12])([0-9]?)|(3[01]?))(-|\/)((19)([2-9])(\d{1})|(20)([01])(\d{1})|([8901])(\d{1}))|(0?[2469]|11)(-|\/)(([1-9])|(0[1-9])|([12])([0-9]?)|(3[0]?))(-|\/)((19)([2-9])(\d{1})|(20)([01])(\d{1})|([8901])(\d{1})))$/.test(scope.quickSearchTerm) || /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[1-2][0-9]|3[01])/.test(scope.quickSearchTerm)
                || /^(0?[1-9]|[1-2][0-9]|3[01])[\/](0?[1-9]|1[0-2])/.test(scope.quickSearchTerm) || /[\/]\d{4}$/.test(scope.quickSearchTerm)){
                    quickSearchTermIsValidDate = true;
                }
                for (let i=0; i<scope.tableCommunicator.columnsList.length; i++){
                    let fieldName = scope.tableCommunicator.columnsList[i];
                    let fieldSelector = {};
                    if(!quickSearchTermIsValidDate && (scope.fieldMetaData[fieldName].Type == 'DOUBLE' || scope.fieldMetaData[fieldName].Type == 'CURRENCY')){
                        if(!isNaN(parseFloat(scope.quickSearchTerm.replace(/[,()$]/ig, '')))){
                            fieldSelector[fieldName] = {$regex : parseFloat(scope.quickSearchTerm.replace(/[,()$]/ig, ''))};
                        }
                    }
                    /*if(!quickSearchTermIsValidDate && (scope.fieldMetaData[fieldName].Type == 'DOUBLE' || scope.fieldMetaData[fieldName].Type == 'CURRENCY')){
                        const searchTerm = scope.quickSearchTerm.replace(/[,()$]/ig, '');
                        if(!isNaN(parseFloat(searchTerm))){
                            const searchTermString = searchTerm.replace('.', '\\.');
                            fieldSelector[fieldName] = {$regex :searchTermString};
                        }
                    }*/
                    else if(scope.fieldMetaData[fieldName].Type == 'DATE'){
                        if(quickSearchTermIsValidDate){
                            if(new Date(scope.quickSearchTerm).getTimezone()=='EDT'){
                                let searchDate = new Date(scope.quickSearchTerm).getTime() - (new Date().getTimezoneOffset() * 60000); //new Date(scope.quickSearchTerm).getTime() + timeOffset ;
                            fieldSelector[fieldName] = {$eq : searchDate};
                            }else{
                                let searchDate;
                             /*   if(new Date(scope.quickSearchTerm).getTimezone() != new Date().getTimezone()){
                                    searchDate = new Date(scope.quickSearchTerm).getTime() + timeOffset  ; 
                                }else{
                                    searchDate = new Date(scope.quickSearchTerm).getTime() + timeOffset + 3600000;
                                }   */
                                
                                if(new Date(scope.quickSearchTerm).getTimezone() != new Date().getTimezone()){
                                    searchDate = new Date(scope.quickSearchTerm).getTime() + timeOffset   ; 
                                }else{
                                    searchDate = new Date(scope.quickSearchTerm).getTime() - (new Date().getTimezoneOffset() * 60000);
                                }                                
                                fieldSelector[fieldName] = {$eq : searchDate};
                            }
                            
                        }
                    }
                    else if(scope.fieldMetaData[fieldName].Type == 'REFERENCE'){
                        if(scope.dataTableDetailMap[fieldName] != undefined &&
                            scope.dataTableDetailMap[fieldName].DisplayField != undefined){
                                let referencField =  fieldName.replace('__c','__r.');  
                                fieldSelector[referencField+scope.dataTableDetailMap[fieldName].DisplayField] = {$contains : scope.quickSearchTerm};
                        }else{
                            if(fieldName.indexOf('.') == -1){
                                let referencField =  fieldName.replace('__c','__r.Name');  
                                fieldSelector[referencField] = {$contains : scope.quickSearchTerm};    
                            }else{
                                fieldSelector[fieldName] = {$contains : scope.quickSearchTerm};   
                            }
                        }
                            
                    }
                    else if(scope.fieldMetaData[fieldName].Type == 'MULTIPICKLIST'){
                        let searchTerm = scope.quickSearchTerm;
                        if(scope.fieldMetaData[fieldName].PickListFieldInfo.FieldPicklistValueLabelMap != '' && scope.fieldMetaData[fieldName].PickListFieldInfo.FieldPicklistValueLabelMap != undefined)
                            angular.forEach(scope.fieldMetaData[fieldName].PickListFieldInfo.FieldPicklistValueLabelMap, function(item, index) {
                                if(item != '' && item != undefined){
                                     searchTerm = scope.quickSearchTerm.includes(item) ? searchTerm = searchTerm.replace(item,index) : searchTerm;
                                }
                            });
                        fieldSelector[fieldName] = {$contains : searchTerm};
                    }
                    else {
                        fieldSelector[fieldName] = {$contains : scope.quickSearchTerm};
                    }
                    if(!angular.equals(fieldSelector, {})){
                        searchArray.push(fieldSelector)
                    };
                }
            }
            
            //scope.searchTermHighlight(scope.quickSearchTerm, j$(".gridTable")[0]);
            scope.quickSearchClause = quickSearchClause;
            let recordsInfo = DataBaseService.search(scope);
            scope.tableCommunicator.recordsList = recordsInfo['recordsList'];
            scope.totalRecords = recordsInfo['totalRecords'];
            scope.reinitializeFooterData();
            GridHelperService.generateHideActionMap(scope);
            GridHelperService.evaluateFormulaJSON(scope);
        }

        scope.getQuickSearchClause = function(quickSearchTerm){
            let quickSearchClause = {};
            searchArray = [];
            quickSearchClause ['$or'] = searchArray;
                let quickSearchTermIsValidDate = false;
                if(/^((0?[13578]|10|12)(-|\/)(([1-9])|(0[1-9])|([12])([0-9]?)|(3[01]?))(-|\/)((19)([2-9])(\d{1})|(20)([01])(\d{1})|([8901])(\d{1}))|(0?[2469]|11)(-|\/)(([1-9])|(0[1-9])|([12])([0-9]?)|(3[0]?))(-|\/)((19)([2-9])(\d{1})|(20)([01])(\d{1})|([8901])(\d{1})))$/.test(scope.quickSearchTerm) || /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[1-2][0-9]|3[01])/.test(scope.quickSearchTerm)
                || /^(0?[1-9]|[1-2][0-9]|3[01])[\/](0?[1-9]|1[0-2])/.test(scope.quickSearchTerm) || /[\/]\d{4}$/.test(scope.quickSearchTerm)){
                    quickSearchTermIsValidDate = true;
                }
                for (let i=0; i<scope.tableCommunicator.columnsList.length; i++){
                    let fieldName = scope.tableCommunicator.columnsList[i];
                    let fieldSelector = {};
                    if(!quickSearchTermIsValidDate && (scope.fieldMetaData[fieldName].Type == 'DOUBLE' || scope.fieldMetaData[fieldName].Type == 'CURRENCY')){
                        if(!isNaN(parseFloat(scope.quickSearchTerm.replace(/[,()$]/ig, '')))){
                            fieldSelector[fieldName] = {$regex : parseFloat(scope.quickSearchTerm.replace(/[,()$]/ig, ''))}; //False +ve for non literal regex used for sanitization, as we are not using for sanitization purpose
                        }
                    }
                    else if(scope.fieldMetaData[fieldName].Type == 'DATE'  || scope.fieldMetaData[fieldName].Type == 'DATETIME'){
                        if(quickSearchTermIsValidDate){
                            if(new Date(scope.quickSearchTerm).getTimezone()=='EDT'){
                                let searchDate = new Date(scope.quickSearchTerm).getTime() - (new Date().getTimezoneOffset() * 60000); //new Date(scope.quickSearchTerm).getTime() + timeOffset ;
                            fieldSelector[fieldName] = {$eq : searchDate};
                            }else{
                                let searchDate;
                                
                                if(new Date(scope.quickSearchTerm).getTimezone() != new Date().getTimezone()){
                                    searchDate = new Date(scope.quickSearchTerm).getTime() + timeOffset   ; 
                                }else{
                                    searchDate = new Date(scope.quickSearchTerm).getTime() - (new Date().getTimezoneOffset() * 60000);
                                }                                
                                fieldSelector[fieldName] = {$eq : searchDate};
                            }
                            
                        }
                    }
                    else if(scope.fieldMetaData[fieldName].Type == 'REFERENCE'){
                        if(scope.dataTableDetailMap[fieldName] != undefined &&
                            scope.dataTableDetailMap[fieldName].DisplayField != undefined){
                                let referencField =  fieldName.replace('__c','__r.');  
                                fieldSelector[referencField+scope.dataTableDetailMap[fieldName].DisplayField] = {$contains : scope.quickSearchTerm};
                        }else{
                            if(fieldName.indexOf('.') == -1){
                                let referencField =  fieldName.replace('__c','__r.Name');  
                                fieldSelector[referencField] = {$contains : scope.quickSearchTerm};    
                            }else{
                                fieldSelector[fieldName] = {$contains : scope.quickSearchTerm};   
                            }
                        }
                            
                    }
                    else if(scope.fieldMetaData[fieldName].Type == 'MULTIPICKLIST'){
                        let searchTerm = scope.quickSearchTerm;
                        if(scope.fieldMetaData[fieldName].PickListFieldInfo.FieldPicklistValueLabelMap != '' && scope.fieldMetaData[fieldName].PickListFieldInfo.FieldPicklistValueLabelMap != undefined)
                            angular.forEach(scope.fieldMetaData[fieldName].PickListFieldInfo.FieldPicklistValueLabelMap, function(item, index) {
                                if(item != '' && item != undefined){
                                     searchTerm = scope.quickSearchTerm.includes(item) ? searchTerm = searchTerm.replace(item,index) : searchTerm;
                                }
                            });
                        fieldSelector[fieldName] = {$contains : searchTerm};
                    }
                    else {
                        fieldSelector[fieldName] = {$contains : scope.quickSearchTerm};
                    }
                    if(!angular.equals(fieldSelector, {})){
                        searchArray.push(fieldSelector)
                    };
                }
            return quickSearchClause;
        }

        scope.getQuickSearchFilterClause = function(quickSearchTerm){
            let quickSearchClause = '';
            let quickSearchTermIsValidDate = false;
            if(/^((0?[13578]|10|12)(-|\/)(([1-9])|(0[1-9])|([12])([0-9]?)|(3[01]?))(-|\/)((19)([2-9])(\d{1})|(20)([01])(\d{1})|([8901])(\d{1}))|(0?[2469]|11)(-|\/)(([1-9])|(0[1-9])|([12])([0-9]?)|(3[0]?))(-|\/)((19)([2-9])(\d{1})|(20)([01])(\d{1})|([8901])(\d{1})))$/.test(scope.quickSearchTerm) || /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[1-2][0-9]|3[01])/.test(scope.quickSearchTerm)
            || /^(0?[1-9]|[1-2][0-9]|3[01])[\/](0?[1-9]|1[0-2])/.test(scope.quickSearchTerm) || /[\/]\d{4}$/.test(scope.quickSearchTerm)){
                quickSearchTermIsValidDate = true;
            }
            for (let i=0; i<scope.tableCommunicator.columnsList.length; i++){
                let fieldName = scope.tableCommunicator.columnsList[i];
                let fieldSelector = {};
                let fieldSelector1 = {};
                if((scope.fieldMetaData[fieldName].Type == 'DOUBLE' || scope.fieldMetaData[fieldName].Type == 'CURRENCY') ||  scope.fieldMetaData[fieldName].Type == 'PERCENT' ){
                    let searchTerm= scope.quickSearchTerm;
                    if(scope.fieldMetaData[fieldName].Type == 'CURRENCY'){
                        searchTerm = searchTerm.replace('$','');
                    } 
                    if(!isNaN(parseFloat(searchTerm.replace(/[,()$]%/ig, '')))){
                        var numberValue ;
                        var numbers ='';
                        if(scope.fieldMetaData[fieldName].Type == 'DOUBLE') {
                            var numbers = /[0-9]+(\.[0-9][0-9]?)?/;
                                if(scope.quickSearchTerm.match(numbers) ) {
                                    numberValue = scope.quickSearchTerm.replace(/[,()$]/ig, '');
                                    quickSearchClause +=  fieldName + ' = ' + parseFloat(numberValue.replace(/[,()$%]/ig, '')) +' OR ';
                                }
                        }
                        if(scope.fieldMetaData[fieldName].Type == 'CURRENCY' ){
                            var numbers = /[0-9]+(\.[0-9][0-9]?)?/;
                            if(searchTerm.match(numbers) ) {
                                numberValue = scope.quickSearchTerm.replace(/\$/g,"");
                                quickSearchClause +=  fieldName + ' = ' + parseFloat(numberValue.replace(/[,()$%]/ig, '')) +' OR ';
                            }
                            
                        }
                        if(scope.fieldMetaData[fieldName].Type == 'PERCENT' ){
                            var numbers = /[0-9]+(\.[0-9][0-9]?)?/;
                            var percentNumber=     scope.quickSearchTerm;
                            percentNumber= percentNumber.replace('%' ,'');
                            if(scope.quickSearchTerm.match(numbers) && percentNumber.replace(/[,()$]%/ig, '').length < 6) {
                                
                                numberValue = percentNumber.replace(/\$/g,"");
                                quickSearchClause +=  fieldName + ' = ' + parseFloat(numberValue.replace(/[,()$%]/ig, '')) +' OR ';
                            }
                            
                        }


                       
                    }
                }
                else if(scope.fieldMetaData[fieldName].Type == 'DATE'   || scope.fieldMetaData[fieldName].Type == 'DATETIME'){
                    if(quickSearchTermIsValidDate){
                        if(new Date(scope.quickSearchTerm).getTimezone()=='EDT'){
                            let searchDate = new Date(scope.quickSearchTerm).getTime() - (new Date().getTimezoneOffset() * 60000); //new Date(scope.quickSearchTerm).getTime() + timeOffset ;
                        }else{
                            let searchDate;
                            if(new Date(scope.quickSearchTerm).getTimezone() != new Date().getTimezone()){
                                searchDate = new Date(scope.quickSearchTerm).getTime() + timeOffset   ; 
                            }else{
                                searchDate = new Date(scope.quickSearchTerm).getTime() - (new Date().getTimezoneOffset() * 60000);
                            }                                
                           
                        }
                        var filterClause ='';
                        var numbers = /^[0-9]+$/;
                        var dateRE = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
                        var dateREWithDateAndMonth = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])$/;

                        if(scope.quickSearchTerm.match(numbers)) {
                            filterClause =  scope.getDateQueryForQuickSearch(fieldName, scope.quickSearchTerm);
                        } else if(scope.quickSearchTerm.match(dateRE)) {
                            filterClause =  scope.getFullDateQueryForQuickSearch(fieldName, scope.quickSearchTerm);
                        } else if(scope.quickSearchTerm.match( dateREWithDateAndMonth )) {
                            filterClause =  scope.getMonthAndDayDateQueryForQuickSearch(fieldName, scope.quickSearchTerm);
                        }
                        if (filterClause != ''){
                            quickSearchClause += '('+ filterClause + ') OR ';
                        }
                       
                        
                    }
                }
                else if(scope.fieldMetaData[fieldName].Type == 'REFERENCE'){
                    if(scope.dataTableDetailMap[fieldName] != undefined &&
                        scope.dataTableDetailMap[fieldName].DisplayField != undefined){
                            let referencField =  fieldName.replace('__c','__r.');  
                            quickSearchClause +=  referencField+scope.dataTableDetailMap[fieldName].DisplayField + '=\''+  scope.quickSearchTerm + '\' OR';
                    }else{
                        if(fieldName.indexOf('.') == -1){
                            let referencField = '';  
                            if (fieldName.indexOf('.') === -1) {
                                switch(fieldName.toLowerCase()){
                                    case 'lastmodifiedbyid':
                                        referencField = 'LastModifiedBy.Name';
                                        break;
                                    case 'createdbyid':
                                        referencField = 'CreatedBy.Name';
                                        break;
                                    case 'recordtypeid':
                                        referencField = 'RecordType.Name';
                                        break;
                                    case 'ownerid':
                                        referencField = 'Owner.Name';
                                    break;
                                    case 'parentid':
                                        referencField = 'Parent.Name';
                                    break;
                                    default:
                                      //  console.log('refField.toLowerCase()--'+refField.toLowerCase());
                                        if (fieldName.indexOf('__c') === -1) {
                                            referencField = fieldName + '.Name';
                                        } else {
                                            referencField = fieldName.replace('__c', '__r.Name');
                                        }
                                      // referencField = refField;                                
                                }
                            } 
                            quickSearchClause += referencField + '=\''+  scope.quickSearchTerm+'\' OR ';    
                        }else{
                            quickSearchClause +=  fieldName +'=\'' +scope.quickSearchTerm+'\' OR '; 
                        }
                    }
                        
                }
                else if(scope.fieldMetaData[fieldName].Type == 'MULTIPICKLIST'){
                    let searchTerm = scope.quickSearchTerm;
                    if(scope.fieldMetaData[fieldName].PickListFieldInfo.FieldPicklistValueLabelMap != '' && scope.fieldMetaData[fieldName].PickListFieldInfo.FieldPicklistValueLabelMap != undefined)
                        angular.forEach(scope.fieldMetaData[fieldName].PickListFieldInfo.FieldPicklistValueLabelMap, function(item, index) {
                            if(item != '' && item != undefined){
                                 searchTerm = scope.quickSearchTerm.includes(item) ? searchTerm = searchTerm.replace(item,index) : searchTerm;
                            }
                        });
                    quickSearchClause +=  fieldName +'=\''+ searchTerm+'\' OR ';
                }else if(scope.fieldMetaData[fieldName].Type == 'BOOLEAN' ){
                    if(scope.quickSearchTerm == 'true'){
                        quickSearchClause +=  fieldName +'='+ true+ ' OR ';
                    }else if(scope.quickSearchTerm == 'false'){
                        quickSearchClause +=  fieldName +'='+ false+ ' OR ';
                    }
                   
                }else if(scope.fieldMetaData[fieldName].Type == 'PHONE'){
                    quickSearchClause +=  fieldName +' = \'' + scope.quickSearchTerm+'\' OR ';
                }
                else if(scope.fieldMetaData[fieldName].Type == 'TEXTAREA'){
                    //quickSearchClause +=  fieldName +' like \'%' + scope.quickSearchTerm+'%\' OR ';
                } else {
                    quickSearchClause +=  fieldName +' like \'%' + scope.quickSearchTerm+'%\' OR ';
                }
              
            }
            return quickSearchClause;
            
        }
        //QuickSearch
        scope.search = function(quickSearchTerm){
            let tableId = '#'+scope.tableCommunicator.tableName+'_quickserchtext';
            let inputValue = j$(tableId).val().trim();
            if (inputValue == '') {
                quickSearchTerm = '';
            }
            if(scope.tableCommunicator.isSpreadSheet || scope.communicator[scope.tableCommunicator.tableId].isEdit == true ) {
                $scope.tableCommunicator.showConfirmBoxIfIsEdit();
                return false;
            }
            scope.quickSearchTerm = quickSearchTerm;
            scope.pageNumber = 1;
            scope.setCookiesData();
            let quickSearchClause = {};
         
            searchArray = [];
            searchArray1 = [];
           
            scope.quickSearchClause = quickSearchClause;
            let recordsInfo ;
            if(quickSearchTerm != '' && ( scope.tableCommunicator.recordsCollection.data.length == 10000  || scope.isSearchWithAll == true ) ){
                if(scope.quickSearchTerm != undefined){
                    scope.quickSearchClause = scope.getQuickSearchFilterClause(scope.quickSearchTerm);
                } 
                scope.isSearchWithAll = true; 
                scope.searchWithAllRecord();
                scope.reinitializeFooterData();
               
            }else if(scope.isSearchWithAll ==  true  && quickSearchTerm == '') {
                if(scope.quickSearchTerm != undefined){
                    scope.quickSearchClause = scope.getQuickSearchClause(scope.quickSearchTerm);
                } 
                scope.getFirstPageRecords(); 
                if(quickSearchTerm == ''){
                    scope.isSearchWithAll = false ;
                }                
            }else{
                if(scope.quickSearchTerm != undefined){
                    scope.quickSearchClause = scope.getQuickSearchClause(scope.quickSearchTerm);
                } 
                recordsInfo = DataBaseService.search(scope);
                scope.tableCommunicator.recordsList = recordsInfo['recordsList'];
                scope.totalRecords = recordsInfo['totalRecords'];
                scope.reinitializeFooterData();
                GridHelperService.generateHideActionMap(scope);
                GridHelperService.evaluateFormulaJSON(scope);
            }
            
           
        }

        scope.getDateQueryForQuickSearch = function(fieldName, searchTerm){
            return 'CALENDAR_MONTH('+fieldName+')='+searchTerm+' OR CALENDAR_YEAR('+fieldName+')='+searchTerm+' OR DAY_IN_MONTH('+fieldName+')='+searchTerm+' ';
        }
    
        scope.getFullDateQueryForQuickSearch = function(fieldName, searchTerm){
            var searchSplit = searchTerm.split("\/");
            if( scope.userOffset == undefined ) {
                scope.userOffset = '0:0';
            }
            var date = new Date();
            date.setMonth(searchSplit[0]-1);
            date.setDate(searchSplit[1]);
            date.setYear(searchSplit[2]);
            date.setHours(0);
            date.setMinutes(0);
    
            var date1 = new Date(date.getTime() - new Date().getTimezoneOffset() );
            tmpVar = date1;
            return '( CALENDAR_MONTH('+fieldName+')='+( date1.getMonth() + 1) +' and CALENDAR_YEAR('+fieldName+')='+date1.getFullYear()+' and DAY_IN_MONTH('+fieldName+')='+(date1.getDate())+') ';
        }
    
        scope.getMonthAndDayDateQueryForQuickSearch = function(fieldName, searchTerm){
            var searchSplit = searchTerm.split("\/");
            return '( CALENDAR_MONTH('+fieldName+')='+searchSplit[0]+' and DAY_IN_MONTH('+fieldName+')='+searchSplit[1]+') ';
        }

        scope.reinitializeFooterData = function(){
            scope.pageNumber = 1; 
            scope.offset = 0; 
            scope.totalPages = Math.ceil(scope.totalRecords/scope.pageSize['size']); 
            scope.hasNext = true;
            if(scope.pageNumber == scope.totalPages){
                scope.hasNext = false;    
            }     
            scope.hasPrevious = false;
        }

        scope.searchTermHighlight = function(SearchTerm, searchText){
            var regex;
            searchText.highlightRegex();
            try { regex = new RegExp(SearchTerm, 'ig') }
            catch (e) {  }

            if (typeof regex !== 'undefined') {
                $(this).removeClass('error');
                if ($(this).val() != '')
                searchText.highlightRegex(regex);
            }
        }

        scope.undoInlineMode = function(row){
            scope.communicator.editRowIdMap[row.Id] = false;   
            delete scope.communicator.editRowIdMap[row.Id];   
   
            if (scope.communicator.newSaveRecordsMap[scope.tableCommunicator.tableId] != undefined &&
                scope.communicator.newSaveRecordsMap[scope.tableCommunicator.tableId][row.Id] != undefined) {
                delete scope.communicator.newSaveRecordsMap[scope.tableCommunicator.tableId][row.Id];
            }
            let index = scope.tableCommunicator.recordsList.indexOf(row);
          //  scope.tableCommunicator.recordsList[index] = scope.tableCommunicator.recordsShadowMap[index]; 
            if(scope.tableCommunicator.recordsShadowMapWithId[row.Id]!= undefined){
            scope.tableCommunicator.recordsList[index] = scope.tableCommunicator.recordsShadowMapWithId[row.Id];
            }          

            if(jQuery.isEmptyObject(scope.communicator.newSaveRecordsMap[scope.tableCommunicator.tableId])){
                scope.communicator[scope.tableCommunicator.tableId].reset();
            }
        }

        scope.communicator[scope.tableCommunicator.tableId].reset = function(){    
            scope.communicator[scope.tableCommunicator.tableId].isEdit = false;
            scope.tableCommunicator.isEdit = false;
            scope.communicator.isSave = false;
            scope.tableCommunicator.setSelectAllRecordCheckbox(); 
            scope.communicator[scope.tableCommunicator.tableId].isMassEdit = false;
            scope.communicator.isMassSave = false;     
        }

        scope.tableCommunicator.openInModalWindow  = function(action,winURL){ 
            scope.communicator.openLoadingPopUp();
            winURL = winURL + '&parentTableId='+scope.flexTableConfig.FlexTableId+'&TableName='+scope.flexTableConfig.Name+'&TableType=Flex Grid Enhanced'; 
            if(action.RefreshBehaviour != undefined){
                winURL = winURL + '&RefreshBehaviour='+action.RefreshBehaviour;
            }
            scope.tableCommunicator.modalWindowURL = winURL; 
            if(action.ModalTitle != undefined){
                scope.windowTitle =  action.ModalTitle;
            }else{
                scope.windowTitle = scope.flexTableConfig.Name ;
            }
            if(action.ModalHeight != undefined){               
                scope.windowDialogHeight = (parseInt(action.ModalHeight)+50).toString() +'px';//
                scope.windowHeight = (parseInt(action.ModalHeight)).toString() +'px'; //
            }
            if(action.ModalWidth != undefined){
                if((parseInt(action.ModalWidth)) < 100) {
                    scope.windowWidth  = (parseInt(action.ModalWidth)).toString() + '%';  //
                } else {
                    scope.windowWidth  = (parseInt(action.ModalWidth)).toString() +'px';  //
                }
            }else{
                scope.windowWidth = '800px';
                scope.windowContentWidth = '800px';
            }
            if(action.ShowConfirmationBox){
                scope.$apply();
            }            
            j$('#'+scope.flexTableConfig.Name+'modalDiv').modal();
            lastFocus = document.activeElement;
            flexModalId = scope.flexTableConfig.Name;
            j$('#'+scope.flexTableConfig.Name+'iframeContentId').attr('src',winURL);
            scope.communicator.closeLoadingPopUp();
        }

        scope.tableCommunicator.deleteLokiRecords = function(delRecordsList){
            let delFilterClause = {};
            searchArray = [];
            delFilterClause ['$or'] = searchArray;
            let delRecordObj = {};
            for (var i = 0; i < delRecordsList.length; i++) {
                searchArray.push({Id : delRecordsList[i]});
            }
            scope.tableCommunicator.recordsList = DataBaseService.deleteRecords(scope,delFilterClause);
        }

        scope.communicator[scope.tableCommunicator.tableId].initSortField = function(){
            GridHelperService.initializeSortField(scope);             
        }

        scope.communicator[scope.tableCommunicator.tableId].refreshTable = function(returnValuesMap){
            let newRecordsMap = returnValuesMap.newRecordsMap;
            let updatedRecordsMap = returnValuesMap.updatedRecordsMap;
            let newList = [];
            let updateList = [];
            for (var i = 0; i < scope.tableCommunicator.recordsList.length; i++) {
                if (scope.tableCommunicator.recordsList[i].Id != undefined && scope.communicator.editRowIdMap[scope.tableCommunicator.recordsList[i].Id] == true){
                    if(scope.tableCommunicator.recordsList[i].Id.length != 15 && scope.tableCommunicator.recordsList[i].Id.length !=18){
                        newList.push(newRecordsMap[scope.tableCommunicator.recordsList[i].Id]);  
                        scope.communicator.editRowIdMap[scope.tableCommunicator.recordsList[i].Id] == false;  
                    }else{
                        if(updatedRecordsMap[scope.tableCommunicator.recordsList[i].Id] != undefined){
                            let updateRecord = updatedRecordsMap[scope.tableCommunicator.recordsList[i].Id];
                            updateRecord['$$hashKey'] = scope.tableCommunicator.recordsList[i]['$$hashKey'];
                            updateRecord['$loki'] = scope.tableCommunicator.recordsList[i]['$loki'];
                            updateRecord['meta'] = scope.tableCommunicator.recordsList[i]['meta'];
                            updateList.push(updateRecord);    
                        }
                        scope.communicator.editRowIdMap[scope.tableCommunicator.recordsList[i].Id] = false;
                    }
                }
            }
            scope.tableCommunicator.recordsList = DataBaseService.saveRecords(scope,newList,updateList);
        }

        scope.communicator[scope.tableCommunicator.tableId].refreshRequiredMaps = function(objectName){
            scope.tableCommunicator.refreshRequiredMaps();
        }

        scope.communicator[scope.tableCommunicator.tableId].clearMessages = function(currentTableId){
            if(scope.tableCommunicator != currentTableId){
                scope.tableCommunicator.messages = [];
            }
        }
        scope.tableCommunicator.checkRequiredFields = function (tableId, row) { //objectName,row){
            //let tableId = scope.communicator.tableObjectIdMap[objectName]
            if (scope.communicator[tableId] != undefined && scope.communicator[tableId].checkRequiredFields != undefined) {
                return scope.communicator[tableId].checkRequiredFields(row,tableId);    
            }else{
                return false;
            }
            
        }

        scope.communicator[scope.tableCommunicator.tableId].checkRequiredFields = function(row,tableId){
            let isRequiredError = false;
            delete row.showChild; //267589
            if(!angular.equals(scope.communicator[tableId].requiredFieldsMap,{})){
                angular.forEach(scope.communicator[tableId].requiredFieldsMap,function(value,field){
                    if(!isRequiredError){
                        if(typeof row[field] != 'string' && isNaN(row[field])){
                            row[field] = '';
                        }
                        if((row[field] === '') || (row[field] === null) || (row[field] === undefined)){
                            isRequiredError = true;
                            scope.tableCommunicator.messages = [];                            
                        }
                    }
                });
            }
            return isRequiredError;  
        }

        scope.tableCommunicator.exportGrid = function(mode){
            let message='You may receive a message \'The file could be corrupted or unsafe\' while opening Excel file. Please ignore it and click \'Yes\' to continue when prompted.';              
            if(mode!='pdf'){
                scope.showConfirmBox(message,mode);
            }else{
                scope.exportGridFile(mode);
            }           
        }

        scope.exportGridFile = function(mode){
            if(scope.communicator.GridType != 'FlexTable'){ 
                let d = new Date();
                let n = d.toLocaleDateString()+'__'+d.toLocaleTimeString();
                if(scope.communicator.parentRecordId != null &&
                    scope.communicator.parentRecordId!="" &&
                    scope.communicator.parentRecordId!=undefined ){
                let n = d.toLocaleDateString()+'__'+d.toLocaleTimeString();
                $window.open(encodeURI(scope.communicator.nameSpacePrefix+'FlexTableExport?mode='+mode+'&flexGridName='+ scope.communicator.flexGridMetaData.flexGridName+'&flexGridType=FlexGrid&id='+scope.communicator.parentRecordId+'&listParm='+encodeURIComponent(flexGridEnhanced_listParameters)+'&flexTableParam='+encodeURIComponent(flexGridEnhanced_stringParameters)+'&locale='+n),"_blank");
                }else{
                    $window.open(encodeURI(scope.communicator.nameSpacePrefix+'FlexTableExport?mode='+mode+'&flexGridName='+ scope.communicator.flexGridMetaData.flexGridName+'&flexGridType=FlexGrid&listParm='+encodeURIComponent(flexGridEnhanced_listParameters)+'&flexTableParam='+encodeURIComponent(flexGridEnhanced_stringParameters)+'&locale='+n),"_blank");
                }
            }else{
                scope.tableCommunicator.exportTable(mode);
            }
        }

        scope.tableCommunicator.exportTable = function(mode){
            let d = new Date();
            let n = d.toLocaleDateString()+'__'+d.toLocaleTimeString();
           /* if(mode != 'pdf'){
                mode = 'text/csv';
            }*/
            scope.communicator.listParameters = scope.communicator.listParameters != undefined ? scope.communicator.listParameters :'';
            $window.open(encodeURI(scope.communicator.nameSpacePrefix+'FlexTableExport?mode='+mode+'&flexTableName='+ scope.flexTableConfig.Name+'&flexGridType=Data Table Enhanced&flexTableParam='+angular.toJson(scope.communicator.stringParameters)+'&listParm='+angular.toJson(scope.communicator.listParameters)+'&locale='+n),"_blank");
        }
        scope.showConfirmBox = function(msg,mode){
            bootbox.dialog({
                message: msg,
                title:"Confirm",
                onEscape: function() {},
                backdrop: true,
                closeButton: true,
                animate: true,
                buttons: {
                    No: {   
                        label: "No",
                        callback: function() { }
                    },
                    "Yes": {
                        label: "Yes" ,
                        callback: function(result) {
                            if(mode!='pdf'){
                                scope.exportGridFile(mode);
                            }
                           
                        }
                    },   
                }  
            });
        }

        scope.tableCommunicator.showConfirmBoxIfIsEdit = function(){
            bootbox.dialog({
                message: 'Please save record before performing any action',
                title:"Confirm",
                onEscape: function() {},
                backdrop: true,
                closeButton: true,
                animate: true,
                buttons: {
                    Ok: {   
                        label: "Ok",
                        callback: function() { 
                        }
                    },
                    
                }  
            });
        }
        scope.communicator.openLoadingPopUp = function(){
            console.log('open popup',scope.communicator.parentFlexTableName);  
            j$('#'+scope.communicator.parentFlexTableName+'FlexToggle').prepend('<div class="rowLevelOverlay"><img class="nav-logo" id="govGrantsPleaseWaitHolderId" src="'+scope.communicator.govGrantPleaseWaitIconURL+ '" alt="GovGrants Logo "/><span class="sr-only">Loading...</span></div>');                 
        }

        scope.communicator.closeLoadingPopUp = function(){
           j$('#'+scope.communicator.parentFlexTableName+'FlexToggle').find('.rowLevelOverlay').remove();    
        }
        
        scope.tableCommunicator.openHelp = function (){
            if(scope.flexTableConfig.HelpDocId != null){
                window.open('/servlet/servlet.FileDownload?file='+scope.flexTableConfig.HelpDocId,'_blank');
            }else{
                window.open('/apex/' + scope.communicator.nameSpacePrefix + 'Help?id='+scope.flexTableConfig.HelpConfig, '_blank','width=900, height=700');
            }
        }

        scope.tableCommunicator.refreshRequiredMaps = function(){
            scope.tableCommunicator.hideActionMap = {};   // to refresh the maps

            GridHelperService.generateHideActionMap(scope);             
            GridHelperService.generateHideTopActionMap(scope);
            GridHelperService.evaluateFormulaJSON(scope);            
            DataBaseService.createHideTableCellMap(scope, scope.tableCommunicator.maskValue);

            scope.tableCommunicator.getOverAllTotal();
        }

        // return proper exception message 
        scope.tableCommunicator.parseExceptionMessage = function(errorMessage){
            let innerMsg = '';
            if(errorMessage != undefined && errorMessage.indexOf('GNT.CustomExceptions.') !=-1 && errorMessage.indexOf('Class.GNT.') !=-1){
                //innerMsg = errorMessage.match(/(?<=GNT.CustomExceptions.\s*).*?(?=\s*Class.GNT.)/g);               
                var firstvariable = "GNT.CustomExceptions.";
                var secondvariable = "Class.GNT."; 
                errorMessage = errorMessage.replace(/(\r\n|\n|\r)/gm,"");                
                errorMessage = errorMessage.match(new RegExp(firstvariable + "(.*)" + secondvariable)); 
                innerMsg = errorMessage[1];
            }else{
                let parts;
                let subParts;
                innerMsg = errorMessage;
                parts = errorMessage.split(':', 2);
                if( parts[0] != undefined && parts.length > 1 && scope.tableCommunicator.fieldLabelMap !=undefined && Object.entries(scope.tableCommunicator.fieldLabelMap).length > 0 ){
                    if(scope.tableCommunicator.fieldLabelMap[parts[0]] != null ){
                        innerMsg = fieldToLabelMap[parts[0]] + ' : ' ;
                    }else{
                        innerMsg = parts[0] + ' : ';
                    }
                    if( parts[1] != undefined && parts[1].indexOf(',') == -1){
                        innerMsg += parts[1];
                    }                        
                }               
                if(parts[1] != undefined && parts[1] != '' && parts[1].indexOf(',')!= -1){
                    innerMsg = parts[1];
                    subParts = parts[1].split(',',2);
                    //subParts[0] - Upsert failed. First exception on row 0 with id a1441000004B47YAAS; first error: FIELD_CUSTOM_VALIDATION_EXCEPTION
                    //subParts[1] - This is trigger error In Progress.: []
                    if(subParts[1] != undefined && subParts[1] != '' ){
                        innerMsg = subParts[1];
                        let partString = subParts[1]; // partString - This is trigger error In Progress.: []
                        let partStringIndex = partString.indexOf(': [');
                        let errorMessageStr;
                        if(partStringIndex > 0){
                            errorMessageStr = partString.substring(0,partString.indexOf(': ['));
                        }else{
                            errorMessageStr  = partString;
                        }
                            // errorMessage -  This is trigger error In Progress.
                        if(errorMessageStr != ""){
                            innerMsg = errorMessageStr.trim();
                            if(innerMsg.indexOf(':') != -1){
                                innerMsg = scope.tableCommunicator.parseExceptionMessage(innerMsg); // called recursive funtion to parse stack trace of error messages for finding correct error message
                            }
                        }
                    }                    
                }                         
            }
            return innerMsg;
        }

        scope.tableCommunicator.recordChangeHandler = function(record,fieldName,fieldValue){
            if(scope.fieldMetaData[fieldName].Type == 'PICKLIST' || (scope.fieldMetaData[fieldName].Type == "REFERENCE" && scope.fieldMetaData[fieldName].ReferenceFieldInfo.Type == "PICKLIST")){
                if(fieldValue != undefined && fieldValue.Label != undefined){
                    fieldValue = fieldValue.Label;
                }
            }
            if(scope.fieldMetaData[fieldName].Type == 'DATE' || scope.fieldMetaData[fieldName].Type == 'DATETIME' ){
                if(fieldValue == ''){
                    fieldValue = null;
                }
            }
            /*if (['CURRENCY'].indexOf(scope.fieldMetaData[fieldName].Type) != -1) {
                if((fieldValue != '' || fieldValue != undefined)){
                    fieldValue = typeof(fieldValue) === 'String' ? fieldValue != '-' ? fieldValue.replace(/,/g,"").replace(/$/g,"") : '':fieldValue;
                 // fieldValue = fieldValue != '-' ? fieldValue.replace(/,/g,"").replace(/$/g,"") : '';
                }
            }*/
            if(scope.fieldMetaData[fieldName].Type == 'TIME' ){
                if(typeof fieldValue == 'number' && fieldValue == 0){
                    fieldValue = 1;
                }
                if(typeof fieldValue == 'string'){
                    if(fieldValue == '' ){
                        fieldValue = null;
                    }
                    let valueParts = fieldValue.split(' ');
                    let finalTimeValue = valueParts.length > 1 ? valueParts[1] : valueParts[0];
                    let finalValueParts = finalTimeValue.toString().split(':');
                    fieldValue = ((parseInt(finalValueParts[0]) * 60) + (parseInt(finalValueParts[1]))) * 60 * 1000;
                }
            }
            if (['INTEGER','DOUBLE','CURRENCY'].indexOf(scope.fieldMetaData[fieldName].Type) != -1) {
                if((fieldValue != '' || fieldValue != undefined)){
                    fieldValue = typeof(fieldValue) === 'string' ? (fieldValue != '-' ? fieldValue.replace(/,/g,"").replace(/$/g,"") : ''):fieldValue;
                }
            }        
            if (['INTEGER','DOUBLE','CURRENCY','PERCENT'].indexOf(scope.fieldMetaData[fieldName].Type) != -1 && fieldValue == undefined) {
                fieldValue = null;
            }

            if (scope.communicator.newSaveRecordsMap[scope.tableCommunicator.tableId] == undefined) {
                scope.communicator.newSaveRecordsMap[scope.tableCommunicator.tableId] = {};
            }
            if(record.Id != undefined){
               // if (record.Id.length >= 15 && scope.communicator.newSaveRecordsMap[scope.tableCommunicator.tableId][record.Id] == undefined) {
                    scope.saveRecord = {};
                //}
               // if (record.Id.length >= 15) {
                    if (scope.communicator.newSaveRecordsMap[scope.tableCommunicator.tableId] != undefined && scope.communicator.newSaveRecordsMap[scope.tableCommunicator.tableId][record.Id] != undefined) {
                        scope.saveRecord = scope.communicator.newSaveRecordsMap[scope.tableCommunicator.tableId][record.Id];
                    }
                    scope.saveRecord['Id'] = angular.copy(record.Id);
                    scope.saveRecord[fieldName] = fieldValue;
                    scope.communicator.newSaveRecordsMap[scope.tableCommunicator.tableId][record.Id] = angular.copy(scope.saveRecord);
               // } else {
               //     record[fieldName] = fieldValue;
               //     scope.communicator.newSaveRecordsMap[scope.tableCommunicator.tableId][record.Id] = angular.copy(record);
               // }
            }

        //    angular.forEach(scope.communicator[scope.tableCommunicator.tableId].requiredFieldsMap,function(value,field){
        //        if(value == true){                    
                    scope.communicator.newSaveRecordsMap[scope.tableCommunicator.tableId][record.Id][fieldName] = fieldValue;
        //        }
        //    });            

            //angular.forEach(scope.tableCommunicator.defaultValueMap, function(value,field){
                if(scope.tableCommunicator.defaultValueMap[fieldName] != undefined && (scope.communicator.newSaveRecordsMap[scope.tableCommunicator.tableId][record.Id][fieldName] == undefined || scope.communicator.newSaveRecordsMap[scope.tableCommunicator.tableId][record.Id][fieldName] === '' || scope.communicator.newSaveRecordsMap[scope.tableCommunicator.tableId][record.Id][fieldName] === ' ')){
                     scope.communicator.newSaveRecordsMap[scope.tableCommunicator.tableId][record.Id][fieldName] = scope.tableCommunicator.defaultValueMap[fieldName];
                }
            //}); 

            //console.log('FieldValue Changed:',scope.communicator.saveRecordsMap);
        }

        scope.communicator[scope.tableCommunicator.tableId].newRecordUniqueId = function(){
            let prefix = '';
            if(scope.communicator.parentFlexTableId == scope.tableCommunicator.tableId){
                scope.communicator.parentUniqueId++;
                prefix = 'p'+scope.communicator.parentUniqueId;
            }else if(scope.communicator.child1FlexTableId == scope.tableCommunicator.tableId){
                scope.communicator.childUniqueId++;
                prefix = 'c1'+scope.communicator.childUniqueId;
            }else if(scope.communicator.child2FlexTableId == scope.tableCommunicator.tableId){
                scope.communicator.childUniqueId++;
                prefix = 'c2'+scope.communicator.childUniqueId;
            }else if(scope.communicator.grandChild1FlexTableId == scope.tableCommunicator.tableId){
                scope.communicator.granChildUniqueId++;
                prefix = 'gc1'+scope.communicator.granChildUniqueId;
            }else if(scope.communicator.grandChild2FlexTableId == scope.tableCommunicator.tableId){
                scope.communicator.granChildUniqueId++;
                prefix = 'gc2'+ scope.communicator.granChildUniqueId;
            }
            return prefix;
        }
        scope.communicator[scope.tableCommunicator.tableId].deletedb = function(){
            scope.tableCommunicator.idbAdapter.deleteDatabase(scope.tableCommunicator.tableName);
        }
        scope.deletedb = function(){
            angular.forEach(scope.communicator.levelVsTableIdMap, function (value, key) {
                if (scope.communicator.levelVsTableIdMap[key] != undefined && scope.communicator[value] != undefined && scope.communicator[value].deletedb != undefined) {
                            scope.communicator[value].deletedb();
                        }    
                    }); 
        }
        window.onbeforeunload = function (event) {
            scope.deletedb();
        }; 
    }
});