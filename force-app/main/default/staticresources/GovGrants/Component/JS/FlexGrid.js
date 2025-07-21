var j$ = jQuery.noConflict();

function PreventEnter(e) {
    if (e.which == 13) {
        e.preventDefault();
        //do something   
    } 
}
//var inlineEditGrid= angular.module('inlineEditGrid{!tableId}', ['ui.bootstrap']);
inlineEditGrid.controller('inlineEditGridCtrl', function($q, $scope, $timeout, $window, $sce, Scopes, $parse) {
    Scopes.store('inlineEditGridCtrl', $scope);
    $scope.flexGrid_DeleteConfirmLabel = Scopes.get('MasterinlineEditGridCtrl').flexGrid_DeleteConfirmLabel;
    $scope.flexGrid_AlertHeaderLabel = Scopes.get('MasterinlineEditGridCtrl').flexGrid_AlertHeaderLabel;
    $scope.flexGrid_tableId = Scopes.get('MasterinlineEditGridCtrl').flexGrid_tableId;
    $scope.flexGrid_CurrentPageURL = Scopes.get('MasterinlineEditGridCtrl').flexGrid_CurrentPageURL;
    $scope.flexGrid_CurrentPURL = Scopes.get('MasterinlineEditGridCtrl').flexGrid_CurrentPURL;
    $scope.flexGrid_keyValueMap = Scopes.get('MasterinlineEditGridCtrl').flexGrid_keyValueMap;
    $scope.flexGrid_listKeyValueMap = Scopes.get('MasterinlineEditGridCtrl').flexGrid_listKeyValueMap;
    $scope.flexGrid_timeOffset = Scopes.get('MasterinlineEditGridCtrl').flexGrid_timeOffset;
    //console.log('$scope.flexGrid_timeOffset: ',$scope.flexGrid_timeOffset);
    $scope.flexGrid_skipNavTabName = Scopes.get('MasterinlineEditGridCtrl').flexGrid_skipNavTabName;
    //console.log('$scope.flexGrid_skipNavTabName=in js====',$scope.flexGrid_skipNavTabName);

    /*$sce stands for Strict Contextual Escaping this is used for un-escaping html strings without using JSENCODE methods on the controller side*/
    //$scope.mode = '{!$Currentpage.parameters.mode}';
    $scope.mode = 'view'; 
    $scope.recordIdSlelectedrec = [];
    $scope.selectedFieldsMap = {};
    $scope.updatedRowsMap = {};
    $scope.selectedRecords = {};
    $scope.messages = [];
    $scope.reqFieldObjMap = {};
    $scope.modeToggleMap = {};
    $scope.legendForRowLevelActionsForChild1 = [];
    $scope.dependentColumnsMap = {};

    $scope.uniqueIdentifier = 0;
    $scope.isRefresh = false;
    $scope.initInlineEditableGrid = 'Hide';
    // When page load collapse child grids
    $scope.childGridCollapsed = true;
    $scope.allChildGridsCollapsed = true;
    //$scope.totalValue = 0;

    $scope.skipNavList2 = [];
    $scope.closeModalN2G = '';
    $scope.toggleLabel = 'Expand All';
    $scope.totalColumnValue = 0;
    $scope.EnablePagination = 'false';

    $scope.toggle = function() {
        if ($scope.mode == 'view') {
            $scope.mode = 'edit';
        } else {
            $scope.mode = 'view';
        }
    };
    /*N2G Search*/
    $scope.QuickSearchReportTextGrid = '';
    $scope.quickSearchCall = function(searchTerm, event) {
        $scope.QuickSearchReportTextGrid = searchTerm;
        //console.log('QuickSearchReportTextGrid: ',$scope.QuickSearchReportTextGrid);
    };
    $scope.quickSearchCallInModal = function(searchTerm, event, gridType) {
        $scope.QuickSearchReportTextGrid = searchTerm;
        if (event == null || event.keyCode == 13) {
            if (event != null && event.keyCode == 13) {
                event.preventDefault();
            }
            if ($scope.QuickSearchReportTextGrid != '' && $scope.QuickSearchReportTextGrid != undefined && gridType == 'Mass Editable Grid') {
                //console.log('Mass Editable called!  MassEditableGridSearchCtrl');
            j$('#flexGridSearch').modal();
                j$('#iframeFlexGridSearch').attr('src', '/apex/' + 'MassEditableGridSearch?searchTerm=' + $scope.QuickSearchReportTextGrid + '&gridName=' + $scope.flexGrid_tableId + '&keyValueMap=' + $scope.flexGrid_keyValueMap);
            lastFocus = document.activeElement;
            } else if ($scope.QuickSearchReportTextGrid != '' && $scope.QuickSearchReportTextGrid != undefined && gridType == 'Nested Navigation Grid') {
                //console.log('Inside quickSearchReportTextGrid');
                j$('#flexGridSearch').modal();
                j$('#iframeFlexGridSearch').attr('src', '/apex/' + 'FlexGridSearch?searchTerm=' + $scope.QuickSearchReportTextGrid + '&gridName=' + $scope.flexGrid_tableId + '&keyValueMap=' + $scope.flexGrid_keyValueMap);
        } else {
                bootbox.dialog({
                    size: 'small',
                    title: "Information",
                    message: 'Please add search term',
                    onEscape: function() {},
                    backdrop: false,
                    closeButton: true,
                    animate: true,
                    buttons: {
                        ok: {
                            label: "Ok",
                            className: "customBtn btn-ext",
                        }
                    }
                });
            }
        }
    };
    $scope.budgetGridOptions = {};
    // $scope.budgetGridOptions.editMode = false;
    $scope.budgetGridOptions.editMode = true;
    $scope.massGridOptions = {};
    $scope.massGridOptions.editMode = true;
    $scope.CounterForHide = 0;

    /* Functions that will be invoked across various actions */
    $scope.selectRecord = function(selectedRecords, recordId, selectVal, tableMetaData) {
        $scope.recordData = {};
        $scope.recordData['IsSelected'] = selectVal;
        $scope.recordData['SObj'] = tableMetaData.DataTableInfoMap.SObjectName;
        $scope.selectedRecords = selectedRecords;
        $scope.selectedRecords[recordId] = $scope.recordData;
        //$scope.recordIdSlelectedrec.push(recordId);			
        if (selectVal == true) {
            $scope.recordIdSlelectedrec.push(recordId);
        } else if (selectVal == false) {
            $scope.recordIdSlelectedrec.splice($scope.recordIdSlelectedrec.indexOf(recordId), 1);
        }
    }

    $scope.showHelpTooltip =function(thisVal,thm,id) {		                  
		j$('#'+id+'FlexGridtooltip').tooltipster({ 
			 theme: thm,                     
			 multiple: true,
			 position : 'bottom',
			 animation :'fade',          
			 contentAsHTML: true,    
			 content : '<span>'+ thisVal + '</span>'
		 });    
		//console.log('test=====hlepTooltip==thisVal==',thisVal);
		//console.log('test=====hlepTooltip==thm==',thm);
		//console.log('test=====hlepTooltip==id===',id);
		j$('#'+id+'FlexGridtooltip').tooltipster('show');    
	}
    $scope.hideHelpTooltip =function(thisVal,thm,id) {		                  		
		j$('#'+id+'FlexGridtooltip').tooltipster('hide');    
	}
    /*
    $scope.selectAllRecords = function(row,selectVal, tableMetaData){
    	//console.log('$scope.selectedRecords===', $scope.selectedRecords);
    	for(childRow in row[tableMetaData.ChildRelationshipName]){
    		//console.log('row[tableMetaData.ChildRelationshipName]===', row[tableMetaData.ChildRelationshipName][childRow]);
    		if(row[tableMetaData.ChildRelationshipName][childRow] != undefined &&  row[tableMetaData.ChildRelationshipName][childRow].Id != undefined && ( row[tableMetaData.ChildRelationshipName][childRow].Id.length == 15 || row[tableMetaData.ChildRelationshipName][childRow].Id.length == 18 ) ) {
    			$scope.recordData = {};
    			$scope.recordData['IsSelected'] = selectVal;
    			$scope.recordData['SObj'] = tableMetaData.DataTableInfoMap.SObjectName;
    			$scope.selectedRecords[row[tableMetaData.ChildRelationshipName][childRow].Id] = $scope.recordData;
    		}
    	}
    }
    */

    $scope.selectAllRecords = function(row, selectVal, tableMetaData) {
        $scope.recordIdSlelectedrec = [];
        for (childRow in row[tableMetaData.ChildRelationshipName]) {
            $scope.recordData = {};
            $scope.recordData['IsSelected'] = selectVal;
            $scope.recordData['SObj'] = tableMetaData.DataTableInfoMap.SObjectName;
            $scope.selectedRecords[row[tableMetaData.ChildRelationshipName][childRow].Id] = $scope.recordData;
            if (selectVal == true) {
                $scope.recordIdSlelectedrec.push(row[tableMetaData.ChildRelationshipName][childRow].Id);
            } else if (selectVal == false) {
                $scope.recordIdSlelectedrec.splice($scope.recordIdSlelectedrec.indexOf(row[tableMetaData.ChildRelationshipName][childRow].Id), 1);
            }
        }
    }

    // Start pagination functions
    $scope.next = function() {
        if ($scope.hasNext == true) {
            showLoadingPopUp();
            $scope.pageNumber++;
            $scope.getRecordsForGrid();
            $scope.setCookiesData();
        }
    };

    $scope.previous = function() {
        if ($scope.hasPrevious == true) {
            showLoadingPopUp();
            $scope.pageNumber--;
            $scope.getRecordsForGrid();
            $scope.setCookiesData();
        }
    };

    $scope.last = function() {
        if ($scope.hasNext == true) {
            showLoadingPopUp();
            $scope.pageNumber = $scope.totalPages;
            $scope.getRecordsForGrid();
            $scope.setCookiesData();
        }
    };

    $scope.first = function() {
        if ($scope.hasPrevious == true) {
            showLoadingPopUp();
            $scope.pageNumber = 1;
            $scope.getRecordsForGrid();
            $scope.setCookiesData();
        }
    };

    $scope.setCookiesData = function(column) {
            if ($scope.sortFieldName != undefined && $scope.sortFieldName != '') {
                j$.cookie($scope.uniqueSessionId + "sortFieldName", $scope.sortFieldName);
            }
            if ($scope.sortDirection != undefined && $scope.sortDirection != '') {
                j$.cookie($scope.uniqueSessionId + "sortDirection", $scope.sortDirection);
            }
            if ($scope.pageNumber != undefined && $scope.pageNumber != '') {
                j$.cookie($scope.uniqueSessionId + "pageNumber", $scope.pageNumber);
            }
            if ($scope.pageSize != undefined && $scope.pageSize != '') {
                j$.cookie($scope.uniqueSessionId + "pageSize", $scope.pageSize);
            }
        }
        // End pagination functions

    $scope.getRecordsForGrid = function() {
        if (undefined == $scope.sortColumn) {
            $scope.sortColumn = "";
        }

        var deferred = $q.defer();
        Visualforce.remoting.Manager.invokeAction(
            _RemotingFlexGridActions.RefreshGrid,
            $scope.queryColumns, $scope.childRelationshipQueries, $scope.hideDecisionFields, $scope.objectName, $scope.filterClause,
            $scope.sortColumn, $scope.sortDir, $scope.pageNumber, $scope.pageSize, false,
            function(flexTableResult, event) {
                if (event.status) {
                    $scope.$apply(function() {
                        deferred.resolve(flexTableResult);
                        $scope.tableData = flexTableResult.RecordsList;
                        $scope.noRecords = false;
                        if ($scope.tableData.length == 0) {
                            $scope.noRecords = true;
                        }
                        $scope.dataTableInfo.RecordsList = $scope.tableData;
                        
                            $scope.handlerecordsForSubTotalCondition();
                        
                        $scope.queryColumns = flexTableResult.QueryColumns;
                        $scope.hideDecisionFields = flexTableResult.HideDecisionFields;
                        $scope.objectName = flexTableResult.ObjectName;
                        $scope.resultSize = flexTableResult.ResultSize;
                        $scope.totalRecords = 'Total records: ' + flexTableResult.ResultSize;
                        $scope.pageNumber = flexTableResult.PageNumber;
                        $scope.totalPages = flexTableResult.TotalPages;
                        $scope.pageSize = flexTableResult.PageSize;
                        //$scope.pageSize = flexTableResult.DataTableInfoMap.PageSizeForFlexGrid;
                        $scope.hasNext = flexTableResult.HasNext;
                        $scope.hasPrevious = flexTableResult.HasPrevious;
                        $scope.pageInfo = 'Page ' + $scope.pageNumber + ' of ' + $scope.totalPages;
                        //$scope.setLoading(false); 
                        //$scope.setSelectAllCheckBox();
                        $scope.windowURL = '';
                        $scope.isRefresh = false;
                        $scope.refreshChildSizeMap();
                    });
                } else {
                    //console.log('executed unsuccessfully',flexTableResult);          
                }
                hideLoadingPopUp();
                //console.log('this--refrs',j$('.actionColumn').text().trim());
                /*if(j$('.actionColumn').text().trim() == 'Actions'){
                	//console.log('Action0000--refrs');
                	//j$('#leftActionColumnHeader').hide()
                	j$('.actionColumn').hide();
                }else{
                //console.log('else-refrs');
                	j$('.actionColumn').show();
                } */
                //adjustToggleBarHeight();
                $scope.isRefresh = false;
            }, {
                buffer: false,
                escape: false,
                timeout: 30000
            }
        );
    };
    
$scope.masseditableInlineSearch = function(searchTerm, event, gridType) { 		
    	
        $scope.QuickSearchReportTextGrid = searchTerm;
        console.log('test---123-');
        if (event == null || event.keyCode == 13) {     
            if (event != null && event.keyCode == 13) {
                event.preventDefault();
            }
            showLoadingPopUp();			
			$scope.generateFilterString1(searchTerm);
			$scope.getRecordsForGrid();
			console.log('test----');
        }
    };
    $scope.generateFilterString1 = function(searchTerm){
    	$scope.generateQuickSearchFilter1(searchTerm);
    	
    };
    $scope.generateQuickSearchFilter1 = function(searchTerm){
    	//console.log('==FlexTableMetaData====>',$scope.tableMetadata);
    	//console.log('searchTerm in generateQuickSearchFilter ',searchTerm);
    	$scope.columns = [];   
    	if( searchTerm != '' && searchTerm != undefined ) {
			searchTerm = searchTerm.replace("*", "%"); //False +ve for incomplete - sanitization - as we are not using this for sanitization
			var filterClause='';
			var finalFilterClause = '';	
			var fields = $scope.editableGridData.ParentTableMetadata.FieldMetadata;	
			//console.log('fields===>',fields);
			for( var i =0; i < $scope.editableGridData.ParentTableMetadata.ColumnsNameList.length; i++) {	
	    		$scope.columns[$scope.editableGridData.ParentTableMetadata.FieldMetadata];	
			//	if($scope.editableGridData.ParentTableMetadata.FieldMetadata.isFilterable == false) {
			//		break;
			//	}
				if(fields[$scope.editableGridData.ParentTableMetadata.ColumnsNameList[i]].IsFilterable == false) {
					break;
				}
				
				if(fields[$scope.editableGridData.ParentTableMetadata.ColumnsNameList[i]].Type == 'TEXTAREA' || fields[$scope.editableGridData.ParentTableMetadata.ColumnsNameList[i]].Type == 'REFERENCE' || fields[$scope.editableGridData.ParentTableMetadata.ColumnsNameList[i]].Type == 'PICKLIST' || fields[$scope.editableGridData.ParentTableMetadata.ColumnsNameList[i]].Type == 'STRING' || fields[$scope.editableGridData.ParentTableMetadata.ColumnsNameList[i]].Type == 'COMBOBOX' || fields[$scope.editableGridData.ParentTableMetadata.ColumnsNameList[i]].Type == 'EMAIL' || fields[$scope.editableGridData.ParentTableMetadata.ColumnsNameList[i]].Type == 'PHONE' || fields[$scope.editableGridData.ParentTableMetadata.ColumnsNameList[i]].Type == 'URL') {					
					filterClause =$scope.filterStringRecords1($scope.editableGridData.ParentTableMetadata.ColumnsNameList[i], $scope.editableGridData.ParentTableMetadata.ColumnsNameList[i], 'Contains', searchTerm, true);					
				}else if(fields[$scope.editableGridData.ParentTableMetadata.ColumnsNameList[i]].Type == 'DATE' || fields[$scope.editableGridData.ParentTableMetadata.ColumnsNameList[i]].Type == 'DATETIME' ) {				
					var numbers = /^[0-9]+$/;
					var dateRE = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
					var dateREWithDateAndMonth = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])$/;
					if(searchTerm.match(numbers)) {
						filterClause =  $scope.getDateQueryForQuickSearch1($scope.editableGridData.ParentTableMetadata.ColumnsNameList[i], searchTerm);
					} else if(searchTerm.match(dateRE)) {
						filterClause =  $scope.getFullDateQueryForQuickSearch1($scope.editableGridData.ParentTableMetadata.ColumnsNameList[i], searchTerm);
					} else if(searchTerm.match( dateREWithDateAndMonth )) {
						filterClause =  $scope.getMonthAndDayDateQueryForQuickSearch1($scope.editableGridData.ParentTableMetadata.ColumnsNameList[i], searchTerm);
					}									
				}
				else if(fields[$scope.editableGridData.ParentTableMetadata.ColumnsNameList[i]].Type == 'CURRENCY' || fields[$scope.editableGridData.ParentTableMetadata.ColumnsNameList[i]].Type == 'DOUBLE') {
					var numbers = /^[0-9]+$/;
					if(searchTerm.match(numbers)) {
						//console.log('column name currency nd double-->',$scope.editableGridData.ParentTableMetadata.ColumnsNameList[i]);
						filterClause =  $scope.getNumberQueryForQuickSearch1($scope.editableGridData.ParentTableMetadata.ColumnsNameList[i], searchTerm);
					}
				}				
				if( filterClause != '' ){
					finalFilterClause += filterClause + ' OR ';
				}				
			}
			
			filterClause = finalFilterClause;			
			if( filterClause != '' ) {
				if( $scope.quickSearchFilterClause != null && $scope.quickSearchFilterClause != '' ) {
					$scope.quickSearchFilterClause = '( ' + $scope.quickSearchFilterClause + ' ) and ( ' + filterClause + ' )';
				 } else {
				 	$scope.quickSearchFilterClause = '' + filterClause;
				 }
				filterClause = filterClause.substring(0,filterClause.length-4)
				//console.log('===>  filterclause '+filterClause);
				$scope.quickSearchFilterClause = '' + filterClause;
			}
				$scope.isSOSL = false;
			}else{
				$scope.quickSearchFilterClause = '';
			}
    		$scope.filterClause = $scope.quickSearchFilterClause;
			console.log('---filterClause----',filterClause);		
    };
    
   $scope.getDateQueryForQuickSearch1 = function(fieldName, searchTerm){
   		//console.log('searchTerm of getDateQueryForQuickSearch ==>',searchTerm);
		return 'CALENDAR_MONTH('+fieldName+')='+searchTerm+' OR CALENDAR_YEAR('+fieldName+')='+searchTerm+' OR DAY_IN_MONTH('+fieldName+')='+searchTerm+' ';
	}
	$scope.getFullDateQueryForQuickSearch1 = function(fieldName, searchTerm)
	{
		//console.log('searchTerm of getFullDateQueryForQuickSearch ==>',searchTerm);
		var searchSplit = searchTerm.split("\/");
		if( $scope.userOffset == undefined ) {
			$scope.userOffset = '0:0';
		}		
		var date = new Date();		
		date.setMonth(searchSplit[0]-1);
		date.setDate(searchSplit[1]);
		date.setYear(searchSplit[2]);
		date.setHours(0);
		date.setMinutes(0);			
		userTimeZone = $scope.editableGridData.ParentTableMetadata.Offset;
		//console.log('userTimeZone==>',userTimeZone);
		var date1 = new Date(date.getTime() - userTimeZone );
		//console.log('date1==>',date1);
		return '( CALENDAR_MONTH('+fieldName+')='+( date1.getMonth() + 1) +' OR CALENDAR_YEAR('+fieldName+')='+date1.getFullYear()+' OR DAY_IN_MONTH('+fieldName+')='+date1.getDate()+') ';
	}
	
	$scope.getMonthAndDayDateQueryForQuickSearch1 = function(fieldName, searchTerm)
	{		
		var searchSplit = searchTerm.split("\/");
		//console.log('searchSplit===>',searchSplit);
		return '( CALENDAR_MONTH('+fieldName+')='+searchSplit[0]+' OR DAY_IN_MONTH('+fieldName+')='+searchSplit[1]+') ';
	}
	
	$scope.getNumberQueryForQuickSearch1 = function(fieldName, searchTerm){
		return fieldName + '='+searchTerm;
	}
	$scope.filterStringRecords1 = function(fieldName,label,criteria,searchTerm,isQuickSearch){
		var conditionString = '';
		if(fieldName != '' && criteria != '' && searchTerm != undefined && searchTerm != '' && criteria != undefined){
			conditionString = (criteria == 'Contains') ? (fieldName + ' LIKE \'%' +  searchTerm + '%\'') :
								(criteria == 'Ends with') ? (fieldName+ ' LIKE \'%' +  searchTerm + '\'') :
								(criteria == 'Starts with') ? (fieldName+ ' LIKE \'' +  searchTerm + '%\'') :
								(criteria == 'Equals') ? (fieldName+ ' = \'' +  searchTerm + '\'') :
								(criteria == 'Not equals') ? (fieldName+ ' != \'' +  searchTerm + '\'') :
								(fieldName+ ' = \'' +  searchTerm + '\'');
			if(!isQuickSearch) {
				$scope.filterMap[fieldName] = conditionString;
				$scope.filterDisplayMapOnFilter[fieldName] = {"label":label,"criteria":criteria + ' ' +searchTerm,"val1":criteria,"val2":searchTerm };
			}
		} else if(!isQuickSearch && searchTerm == '') {
			delete $scope.filterMap[fieldName];
			delete $scope.filterDisplayMapOnFilter[fieldName];
		}
		//console.log('conditionString-->',conditionString);
		return conditionString;
	};
	 
    

    $scope.showMore = function(parentId, childKey) {
        //showLoadingPopUp();
        $scope.childSizeMap[childKey][parentId] = parseInt($scope.childSizeMap[childKey][parentId]) * 2;
        /* 		
        $scope.isRefresh = true;		
        $scope.pageSize = $scope.pageSize + 5;
        $scope.getRecordsForGrid(); 
        */
    };

    $scope.refreshGrid = function() {
        //showLoadingPopUp();
        $scope.isRefresh = true;
        $scope.getRecordsForGrid();
    };

    $scope.removeRecord = function(recordsArray, index, tableMetadata) {
        //delete $scope.overAllTotal[0];				
        if (recordsArray[index].Id != undefined) {
            delete $scope.updatedRowsMap[tableMetadata.ObjectMetaData.APIName][recordsArray[index].Id];
        }
        //$scope.updatedRowsMap={}; // temp fix need to check why delete is not working.
        recordsArray.splice(index, 1);
        // $scope.massGridOptions.editMode = true;
        $scope.CounterForHide = $scope.CounterForHide - 1;
        if ($scope.CounterForHide == 0) {
            $scope.massGridOptions.editMode = true;
        }
    };
    $scope.totalValue = {};
    $scope.updatedRowsHandler = function(obj, row, column, value) {
        $scope.totalValue[column] = 0;
        $scope.totalColumnValue = 0;
        if (!isNaN(value)) {
            $scope.totalValue[column] = parseInt(value);
        }
        if (row[column] == undefined) {
            row[column] = value;
        }
        if ($scope.selectedFieldsMap[row.Id] == undefined) {
            $scope.selectedFieldsMap[row.Id] = {};
        }
        $scope.selectedFieldsMap[row.Id][column] = true;
        $scope.updatedMap = $scope.updatedRowsMap[obj.APIName];
        if ($scope.updatedMap == undefined) {
            $scope.updatedMap = {};
        }
        if ((row.Id.length != 15 && row.Id.length != 18) || row.Id == undefined) {
            $scope.updatedMap[row.Id] = row;
        } else {
            $scope.rowInfo = $scope.updatedMap[row.Id];
            if ($scope.rowInfo == undefined) {
                $scope.rowInfo = {};
            }
            $scope.rowInfo[column] = value;
            $scope.rowInfo['Id'] = row.Id;
            $scope.updatedMap[row.Id] = $scope.rowInfo;
        }
        for (var key in $scope.totalValue) {
            if ($scope.totalValue.hasOwnProperty(key)) {
                $scope.totalColumnValue = $scope.totalColumnValue + $scope.totalValue[key];
            }
        }
        //$scope.totalColumnValue = $scope.totalColumnValue + $scope.totalValue[column];		 
        $scope.updatedRowsMap[obj.APIName] = $scope.updatedMap;
    };
    $scope.massageUpdatedRowsMap = function() {
        $scope.massagedUpdatedRowsMap = {};
        //console.log('$scope.updatedRowsMap===In massageUpdatedRowsMap functionn==',$scope.updatedRowsMap);
        $scope.tempMap = $scope.massagedUpdatedRowsMap1;
        for (objAPIName in $scope.tempMap) {
            var objectSpecificMap = $scope.tempMap[objAPIName];
            var objectSpecificList = [];
            for (id in objectSpecificMap) {
                var record = objectSpecificMap[id];
                if (id.length != 15 && id.length != 18) {
                    record.Id = undefined;
                }
                objectSpecificList.push(record);
            }
            $scope.massagedUpdatedRowsMap[objAPIName] = objectSpecificList;

        }
        //console.log('$scope.massagedUpdatedRowsMap===In massageUpdatedRowsMap functionn==',$scope.massagedUpdatedRowsMap);
    };

    $scope.saveRecords = function(actionItem, metadata) {
        // prevent Default Dialog Box for unsaved data entries
        if(typeof preventDefaultDialogBoxForGrid  !==  "undefined") {
            preventDefaultDialogBoxForGrid = true;
        }
        showLoadingPopUp();
        $scope.CounterForHide = 0;
        if ($scope.editableGridData.RecordType == 'Budget Grid') {
            $scope.saveBudgetRecords();
        } else {
            $scope.saveGridRecords(actionItem, metadata);
        }
		
    };
    $scope.undo = function(recordList,tableMetadata, id, index) {
        $scope.modeToggleMap[tableMetadata.ObjectMetaData.APIName][id] = false;
        $scope.CounterForHide = $scope.CounterForHide - 1;
        //console.log('index---',index);
        //console.log('$scope.editUndoTracker---',$scope.editUndoTracker);
        if ($scope.CounterForHide == 0) {
            $scope.massGridOptions.editMode = true;
        }        
        var row = recordList[index];
        //console.log('$scope.recordList[index]---',recordList[index]);
        recordList[index] = $scope.editUndoTracker[row.Id];
        //console.log('$scope.recordList[index]---',recordList[index]);
        //console.log('$scope.updatedRowsMap---',$scope.updatedRowsMap);
        if($scope.updatedRowsMap[tableMetadata.ObjectMetaData.APIName] != undefined && $scope.updatedRowsMap[tableMetadata.ObjectMetaData.APIName][id] != undefined){
            delete $scope.updatedRowsMap[tableMetadata.ObjectMetaData.APIName][id];
        }
    }
    $scope.closeModal = function(actionItem) {
    	$scope.frame = document.getElementById($scope.flexGrid_tableId+'iframeContentId');
    	j$("#"+$scope.flexGrid_tableId+"iframeContentId").height(100);
    	$scope.windowURL = '';
    	$scope.windowWidth = '50px';
        if (actionItem.RefreshBehaviour == 'Refresh the entire page') {
            window.location.reload();
        } else if ($scope.closeModalN2G == 'Nested Navigation Grid') {
            //console.log('close modal for n2g');
            $scope.initN2G();
        } else {
            //$scope.getRecordsForGrid();
            $scope.initInlineEditableGrid();
        }
    };

    $scope.getColSpan = function(tableMetadata){
        var colspan = tableMetadata.ColumnsNameList.length + 1;
        if(tableMetadata.ConfigInfo.EnableAutoIndex == true){
            colspan += 1;
        }
        if(tableMetadata.ActionInfo != undefined){
            colspan += 1;
        }
        if(tableMetadata.DataTableInfoMap.EnableTotalColumn == true){
            colspan += 1;
        }
        return colspan;
    }

    $scope.rowSpanTrackerMap = {};
    $scope.isRowGrouping = false;
    $scope.rowSpanHandler = function(uniqueId,recordList,tableMetadata){
        $scope.rowSpanTrackerMap[uniqueId] = {};
        var rowSpanTracker = $scope.rowSpanTrackerMap[uniqueId];
       
        for(var x = 0 ; x < tableMetadata.ColumnsNameList.length ; x++){
            var subTotalRowsIndexArray = []; 
            var col = tableMetadata.ColumnsNameList[x];  
            var colDetailInfo = tableMetadata.FieldMetadata.dataTableDetailInfo[col];

            if( colDetailInfo != undefined && colDetailInfo['EnableRowGrouping'] == true){    
            $scope.isRowGrouping = true;
            for(var y = 1 ; y < recordList.length ; y++){                  
                    var yobj = recordList[y];
                    yviewValueGetter = $parse(col);
                    var yfieldValue = yviewValueGetter(yobj); 

                    var y1obj = recordList[y-1];
                    y1viewValueGetter = $parse(col);
                    var y1fieldValue = y1viewValueGetter(y1obj);    

                    if(yfieldValue != y1fieldValue && recordList[y-1]['isSubTotal'] != true){                            
                        subTotalRowsIndexArray.push(y + subTotalRowsIndexArray.length);                            
                    }                    
                }
                if(x == 1){                    
                    subTotalRowsIndexArray.push(y + subTotalRowsIndexArray.length);                                        
                }
                //console.log('====subTotalRowsIndexArray====', subTotalRowsIndexArray);
                for(var index = 0 ; index < subTotalRowsIndexArray.length; index++){
                    var subTotalRecord = {};
                    subTotalRecord['isSubTotal'] = true;
                    subTotalRecord[col] = 'SubTotal'; 
                    subTotalRecord.Id = Math.floor((Math.random() * 10000) + 1);                   
                    recordList.splice(subTotalRowsIndexArray[index],0,subTotalRecord);
                }                                                                                             
            }
        } 
        if($scope.isRowGrouping == true){ 
	        for(var x = tableMetadata.ColumnsNameList.length -1 ; x >= 0  ; x--){           
	            var col = tableMetadata.ColumnsNameList[x];  
	            var colDetailInfo = tableMetadata.FieldMetadata.dataTableDetailInfo[col];            
	            if( colDetailInfo != undefined && colDetailInfo['EnableRowGrouping'] == true){            
	                var currentGroupingRowId = 0;        
	                rowSpanTracker[currentGroupingRowId] = rowSpanTracker[currentGroupingRowId] == undefined ? {} : rowSpanTracker[currentGroupingRowId];    
	                rowSpanTracker[currentGroupingRowId][col] = 1; 
	                var actualRowsArray = [0];                                    
	                for(var y = 1 ; y < recordList.length ; y++){  
	                                                                                                                                                                        
	                    if(currentGroupingRowId != undefined){
                            if(recordList[y].Id.length == 18 || (recordList[y]['isSubTotal'] == true &&  recordList[y][col] != 'SubTotal')){
	                            rowSpanTracker[currentGroupingRowId] = rowSpanTracker[currentGroupingRowId] == undefined ? {} : 
	                                                                        rowSpanTracker[currentGroupingRowId];
	                            rowSpanTracker[currentGroupingRowId][col] = rowSpanTracker[currentGroupingRowId][col] + 1; 
	
	                            var currentRowId = y;             
	                            rowSpanTracker[currentRowId] = rowSpanTracker[currentRowId] == undefined ? {} : rowSpanTracker[currentRowId];                        
	                            rowSpanTracker[currentRowId][col] = 0; 
                                //console.log('---up--',y); 
                                if(recordList[y].Id.length == 18){
	                            actualRowsArray.push(y);                                                                                     
                                }                                                                                  
                            }else if(recordList[y]['isSubTotal'] == true && recordList[y][col] == 'SubTotal'){                            
	                            currentGroupingRowId = undefined; 
	                            //console.log(y,'===actualRowsArray===1=',actualRowsArray);
	                            recordList[y]['SubTotalIndexes'] = actualRowsArray;
	                            actualRowsArray=[];                                                                                                 
	                        }                                                
	                        }else{
	                        if(recordList[y].Id != undefined && recordList[y].Id.length == 18){
	                            currentGroupingRowId = y; 
	                            rowSpanTracker[currentGroupingRowId] = rowSpanTracker[currentGroupingRowId] == undefined ? {} : rowSpanTracker[currentGroupingRowId];    
	                            rowSpanTracker[currentGroupingRowId][col] = 1; 
	                            actualRowsArray.push(y);                          
	                        }
	                    }
	                }
	            }
	        }
        //console.log('recordList',recordList);        
    }
    }
    
    $scope.handlerecordsForSubTotalCondition = function() {

        //console.log('====SubTotalEvaluatorJSON====', $scope.parentTableMetadata.ConfigInfo.SubTotalEvaluatorJSON);
        var subTotalEvaluatorJSON = angular.fromJson($scope.parentTableMetadata.ConfigInfo.SubTotalEvaluatorJSON);
        //console.log('====SubTotalEvaluatorJSON====', subTotalEvaluatorJSON);
        $scope.recordList = [];
        $scope.recordList = $scope.dataTableInfo.RecordsList;

        $scope.isChildSubTotalCase = false;
        $scope.isParentSubTotalCase = false;
        for(var i = 0 ; i < $scope.recordList.length ; i++){
            //console.log('====record====', $scope.recordList[i]); 
            //console.log('====record====', $scope.childMetadataKeysArray); 
            var record = $scope.recordList[i];            
            
            if($scope.childMetadataKeysArray != undefined){
                for(var j = 0; j <  $scope.childMetadataKeysArray.length ; j++) {
                    //console.log('====record====',$scope.childMetadataKeysArray[j]);
                    var ckey = $scope.childMetadataKeysArray[j];
                    //console.log('====record====ckey',ckey);
                    record['subTotal'+$scope.editableGridData[ckey].ChildRelationshipName] = [];   
                    angular.copy(record[$scope.editableGridData[ckey].ChildRelationshipName],record['subTotal'+$scope.editableGridData[ckey].ChildRelationshipName]);  
                    var childsubTotalEvaluatorJSON = angular.fromJson($scope.editableGridData[ckey].ConfigInfo.SubTotalEvaluatorJSON);
                    //console.log('====record====',childsubTotalEvaluatorJSON);
                    for (k in childsubTotalEvaluatorJSON) {                    
                        var subTotalRecord = {};
                        for (l in childsubTotalEvaluatorJSON[k]) {
                            subTotalRecord[l] = childsubTotalEvaluatorJSON[k][l];
                        }
                        //console.log('====record====',$scope.editableGridData[ckey]);
                        //console.log('====record====',$scope.editableGridData[ckey].ChildRelationshipName);
                        //console.log('====record====',record['subTotal'+$scope.editableGridData[ckey].ChildRelationshipName]);
                        if(record['subTotal'+ $scope.editableGridData[ckey].ChildRelationshipName] != undefined){
                            $scope.isChildSubTotalCase = true;
                            record['subTotal'+ $scope.editableGridData[ckey].ChildRelationshipName].splice(k, 0, subTotalRecord);
                        }
                    }
                    if($scope.isChildSubTotalCase == false){
                        $scope.rowSpanHandler(record.Id,record['subTotal'+ $scope.editableGridData[ckey].ChildRelationshipName],$scope.editableGridData[ckey]);
                    }
                }             
            }             
            //console.log('====record==final==', $scope.recordList[i]); 
        }
        
        for (i in subTotalEvaluatorJSON) {
            //console.log('-------',subTotalEvaluatorJSON[i]);
            var subTotalRecord = {};
            for (j in subTotalEvaluatorJSON[i]) {
                subTotalRecord[j] = subTotalEvaluatorJSON[i][j];
            }           
           $scope.isParentSubTotalCase = true;
           
           $scope.recordList.splice(i, 0, subTotalRecord);
        }
        
        //console.log('====$scope.isSubTotalCase====', $scope.isSubTotalCase);    
        //console.log('====record==final==', $scope.recordList[i]); 
        if($scope.isParentSubTotalCase == false){
            $scope.rowSpanHandler($scope.parentTableMetadata.ConfigInfo.FlexTableRecordId,$scope.recordList,$scope.parentTableMetadata);
        }
    }
    $scope.saveGridRecords = function(actionItem, metadata) {
        //console.log('actionItem======',actionItem);
        $scope.messages.length = 0;
        //showLoadingPopUp();
        $scope.massagedUpdatedRowsMap1 = {};
        angular.copy($scope.updatedRowsMap, $scope.massagedUpdatedRowsMap1);
        $scope.massageUpdatedRowsMap();
        //$scope.isRefresh = true;
        var deferred = $q.defer();
        //console.log('$scope.massagedUpdatedRowsMap=======',$scope.massagedUpdatedRowsMap);
        //console.log('$scope.parentTableMetadata=======',$scope.parentTableMetadata);
        //console.log('$scope.updatedRowsMapa=======',$scope.updatedRowsMap);
        //console.log('$scope.messages==============',$scope.messages);
        $scope.isRefresh = true;
        Visualforce.remoting.Manager.invokeAction(
            _RemotingFlexGridActions.UpdateRows,

            angular.toJson($scope.massagedUpdatedRowsMap), angular.toJson($scope.parentTableMetadata),
            function(updatedResult, event) {
                if (event.status) {
                    $scope.$apply(function() {
                        deferred.resolve(updatedResult);
                        if (updatedResult.Success == true) {
                            $scope.messages.length = 0;
                            //console.log("updaterow success 1");
                            $scope.dataTableInfo = updatedResult.DataTableInfo;
                            //----This is not a good solution to refresh, I will chnage it later
                            //$scope.initInlineEditableGrid();
                            $scope.mode = 'view';
                            $scope.isRefresh = false;
                            $scope.selectedFieldsMap = {};
                            $scope.updatedRowsMap = {};
                            $scope.modeToggleMap = {};
                            $scope.totalRecords = 'Total records: ' + $scope.dataTableInfo.ResultSize;
                            
                                $scope.handlerecordsForSubTotalCondition();
                            
                            if (actionItem.RefreshBehaviour == 'Refresh the entire page') {
                                window.location.reload();
                            } else {
                                $scope.getRecordsForGrid();
                            }
                            hideLoadingPopUp();
                            $scope.massGridOptions.editMode = true;
                            $scope.massEditAll = false;
                        } else {
                            //console.log("updaterow failure");
                            //console.log(" ===> $scope.uniqueIdentifier" +$scope.uniqueIdentifier);
                            //console.log('===> $scope.updatedRowsMapa length=======',Object.keys($scope.updatedRowsMap[metadata.ObjectMetaData.APIName]).length);
                            //console.log('===> $scope.updatedRowsMapa=======',$scope.updatedRowsMap);
                            for (key in $scope.updatedRowsMap[metadata.ObjectMetaData.APIName]) {
                                //console.log(" ===> $scope.updatedRowsMap after change Id" +key);
                                var keyName = key
                                $scope.updatedRowsMap[metadata.ObjectMetaData.APIName][key].Id = keyName;
                                $scope.modeToggleMap[metadata.ObjectMetaData.APIName][key] = true;
                            }
                            //console.log(" ===> $scope.updatedRowsMap after change" +JSON.stringify($scope.updatedRowsMap));
//                        	$scope.updatedRowsMap = {};
//                        	angular.copy($scope.massagedUpdatedRowsMap1, $scope.updatedRowsMap);
                            $scope.messages.push({
                                type: 'info',
                                msg: updatedResult.ErrorMessage
                            });
                            $scope.isRefresh = false;
                            //$scope.updatedRowsMap = {};
                            $scope.totalRecords = 'Total records: ' + $scope.dataTableInfo.ResultSize;
                            hideLoadingPopUp(); 
                            //$scope.massGridOptions.editMode = false; 
                        }
                    });
                } else {
                    //console.log('event--->>',event);
                }
            }, {
                buffer: false,
                escape: false
            }
        );
        
       // $scope.massGridOptions.editMode = true;
        return deferred.promise;
    };

    $scope.getLookupData = function(fieldName, sobjName, query, filterClause) {
        var deferred = $q.defer();
        Visualforce.remoting.Manager.invokeAction(
            _RemotingFlexGridActions.FetchLookupData,
            fieldName, sobjName, query.term, filterClause,
            function(lookupResult, event) {
                if (event.status) {
                    $scope.$apply(function() {
                        deferred.resolve(lookupResult);
                        var data = {
                            results: []
                        }
                        data.results = lookupResult.SobjList;
                        query.callback(data);
                    });
                } else {
                    $scope.$apply(function() {});
                }
            }, {
                buffer: false,
                escape: false
            }
        );
        return deferred.promise;
    };
    $scope.addNewChildRecord = function(metaData, row, index) {
        $scope.newRecord = {};
        for (var i = 0; i < metaData.ColumnsNameList.length; i++) {
            var fieldName = metaData.ColumnsNameList[i];
            var fieldPath = metaData.FieldMetadata[fieldName].Reference;
            if (metaData.KeyValueMap[fieldPath] != undefined) {
                $scope.newRecord[fieldPath] = metaData.KeyValueMap[fieldPath];
            }
        }
        for (reqField in metaData.ObjectMetaData.RequiredFields) {
            if ($scope.reqFieldObjMap[metaData.ObjectMetaData.APIName] == false) {
                metaData.ColumnsNameList.push(reqField);
                $scope.reqFieldObjMap[metaData.ObjectMetaData.APIName] = true;
            }
            if (metaData.KeyValueMap[reqField] != undefined) {
                $scope.newRecord[reqField] = metaData.KeyValueMap[reqField];
            }
        }
        $scope.newRecord[metaData.ChildRelationshipField] = row.Id;
        if ($scope.updatedRowsMap[metaData.ObjectMetaData.APIName] == undefined) {
            $scope.updatedRowsMap[metaData.ObjectMetaData.APIName] = {};
        }
        $scope.newRecord['Id'] = $scope.uniqueIdentifier;
        $scope.openInlineEdit(metaData, $scope.newRecord);
        $scope.updatedRowsMap[metaData.ObjectMetaData.APIName][$scope.uniqueIdentifier++] = $scope.newRecord;
        
		if($scope.isParentSubTotalCase == false && $scope.isChildSubTotalCase == false){			
			
			if ($scope.dataTableInfo.RecordsList[index][metaData.ChildRelationshipName] == undefined) {
				$scope.dataTableInfo.RecordsList[index][metaData.ChildRelationshipName] = [];
			}
			
			$scope.dataTableInfo.RecordsList[index][metaData.ChildRelationshipName].unshift($scope.newRecord);
			
		}else{
			if($scope.isChildSubTotalCase == true) {
				if($scope.recordList[index]['subTotal'+metaData.ChildRelationshipName] == undefined){
					$scope.recordList[index]['subTotal'+metaData.ChildRelationshipName] = [];
				}
				$scope.recordList[index]['subTotal'+metaData.ChildRelationshipName].unshift($scope.newRecord);
			}else if($scope.isChildSubTotalCase == false){	
				
				if($scope.recordList[index][metaData.ChildRelationshipName] == undefined){
					$scope.recordList[index][metaData.ChildRelationshipName] = [];
				}
				$scope.recordList[index][metaData.ChildRelationshipName].unshift($scope.newRecord);
			}
			
		}
		

    };
    $scope.calculateSubTotal = function(row, column, recordList) {
        var value = row['infoMap-' + column];
        var exp = value['expression'];
        if (exp != '') {
            exp = exp.replace(/\s/g, '');
            var subTotal;
            try{
                var ngent = $parse(exp);
                subTotal =ngent($scope);
            }catch(err) {
                //console.log('====err====',err); 
            }
            if (isNaN(subTotal)) {
                subTotal = undefined;
            } else if (!isFinite(subTotal)) {
                subTotal = undefined;
            } else {
                subTotal = parseFloat(subTotal).toFixed(2); //.replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
            }
            row[column] = subTotal;
            return subTotal;
        }else{
            var total = $scope.calculateTotalForSpecifiedColumnsAtBottomTotalRow(recordList,column);
            row[column] = total;
            return total;
		}  
    }
    $scope.overAllTotal = {};
    $scope.calculateSubTotalForRowGrouping = function(recordsList,row,column){
        if(row[column] == undefined){
        var subTotal = 0;
            var indexArray = row['SubTotalIndexes'];
        for(var i = 0 ; i < indexArray.length ; i++){
            var index = indexArray[i];
            var obj = recordsList[index];
            viewValueGetter = $parse(column);
            var fieldValue = viewValueGetter(obj);
            fieldValue = fieldValue == null ? 0 : fieldValue;
            if (!isNaN(fieldValue)) {
                subTotal += Number(fieldValue);
            }else{
                subTotal += fieldValue;
            }           
        }
            //console.log('---subTotal--',subTotal);
            row[column] = subTotal;
        return subTotal;
    }
        return row[column];
    }
    $scope.calculateTotalForSpecifiedColumnsAtRow = function(row, tableMetaData, index, dataTableInfo) {
        $scope.overAllTotal[tableMetaData.ConfigInfo.FlexTableRecordId] = $scope.overAllTotal[tableMetaData.ConfigInfo.FlexTableRecordId] == undefined ? {} : $scope.overAllTotal[tableMetaData.ConfigInfo.FlexTableRecordId];		
        
        var total = 0;
        
        var columns = tableMetaData.ColumnsNameList;
        var arithmaticExpression = tableMetaData.ColumnArithmeticExpression;
        for (var i = 0; i < columns.length; i++) {
            if (columns[i] != 'Id' &&
                tableMetaData.FieldMetadata.dataTableDetailInfo[columns[i]] != undefined &&
                tableMetaData.FieldMetadata.dataTableDetailInfo[columns[i]].EnableTotal == true) {

                var obj = row;
                viewValueGetter = $parse(columns[i]);
                var fieldValue = viewValueGetter(obj);
                //console.log('---fieldValue ****------',fieldValue);		
                if (!isNaN(fieldValue)) {
                    total += Number(fieldValue);
                    if(row['isSubTotal'] != true){
                    	$scope.overAllTotal[tableMetaData.ConfigInfo.FlexTableRecordId][index] = total;
                	}
                }
            }
        }
        total = total.toFixed(2);
        //console.log('total---------',total);

        return total;
    };

    $scope.calculateTotalForSpecifiedColumnsAtSubTotalRow = function(row, tableMetaData) {
       
        var total = 0;        
        var columns = tableMetaData.ColumnsNameList;       
        for (var i = 0; i < columns.length; i++) {
            if (columns[i] != 'Id' &&
                tableMetaData.FieldMetadata.dataTableDetailInfo[columns[i]] != undefined &&
                tableMetaData.FieldMetadata.dataTableDetailInfo[columns[i]].EnableTotal == true) {

                var fieldValue = row[columns[i]];//No need to use $parse here                    
                if (!isNaN(fieldValue)) {
                    total += Number(fieldValue);                    
                }
            }
        }
        total = total.toFixed(2);         
        return total;
    };

    $scope.calculateGrandTotalForSpecifiedColumnsAtBottomTotalRow = function(tableMetaData) {
        var total = 0; 
        //console.log('$scope.overAllTotal---------',$scope.overAllTotal);  
        for (var key in $scope.overAllTotal[tableMetaData.ConfigInfo.FlexTableRecordId]) {
            if ($scope.overAllTotal[tableMetaData.ConfigInfo.FlexTableRecordId].hasOwnProperty(key)) {
                if (key != undefined) {
                    total += Number($scope.overAllTotal[tableMetaData.ConfigInfo.FlexTableRecordId][key]);
                }
            }
        }
        $scope.totalRowAndColumnValue = total;
        $scope.overAllTotal[tableMetaData.ConfigInfo.FlexTableRecordId] = {};
        total = total.toFixed(2);
        return total;
    }

    $scope.deleteChildRecords = function(tableMetaData, row, index) {
        $scope.recordIds = [];
        var i;
        //get list of Ids to delete
        for (childRow in row[tableMetaData.ChildRelationshipName]) {
            if (row[tableMetaData.ChildRelationshipName][childRow] != undefined && row[tableMetaData.ChildRelationshipName][childRow].Id != undefined && (row[tableMetaData.ChildRelationshipName][childRow].Id.length == 15 || row[tableMetaData.ChildRelationshipName][childRow].Id.length == 18)) {
                //$scope.recordIds.push(row[tableMetaData.ChildRelationshipName][childRow].Id);				
                for (i = 0; i < $scope.recordIdSlelectedrec.length; i++) {
                    if ($scope.recordIdSlelectedrec[i] == row[tableMetaData.ChildRelationshipName][childRow].Id) {
                        $scope.recordIds.push(row[tableMetaData.ChildRelationshipName][childRow].Id);
                    }
                }
            }
        }
        $scope.objectNameToIDMap = {};
        $scope.objectNameToIDMap[tableMetaData.DataTableInfoMap.SObjectName] = $scope.recordIds;
        //$scope.newRecord = {};
        // DeleteRecords		 		
        var deleteMessage = $scope.flexGrid_DeleteConfirmLabel;
        bootbox.dialog({
            message: deleteMessage,
            title: "Confirm",
            onEscape: function() {},
            backdrop: false,
            closeButton: true,
            animate: true,
            buttons: {
                No: {
                    label: "No",
                    className: "customBtn btn-ext",
                    callback: function() {}
                },
                "Yes": {
                    label: "Yes",
                    className: "customBtn btn-ext",
                    callback: function(result) {
                        if (result) {
                            //showLoadingPopUp();
                            $scope.deleteChildsRecord(tableMetaData, row, index);
                        }
                    }
                },
            }
        });
    };

    $scope.deleteChildsRecord = function(tableMetaData, row, index) {
        Visualforce.remoting.Manager.invokeAction(
            _RemotingFlexGridActions.DeleteRecords,
            $scope.objectNameToIDMap,
            function(deleteResult, event) {
                if (event.status) {
                    $scope.$apply(function() {
                        var deleteMessage;
                        if (deleteResult.Success) {
                            deleteMessage = deleteResult.Message;;
                            $scope.getRecordsForGrid();
                        } else {
                            var result = deleteResult.Message;
                            var deleteMessageArray = result.split(':');
                            var deleteMessage = deleteMessageArray[2];
                            var deleteErrorMessageArray = deleteMessage.split(',');
                            deleteMessage = deleteErrorMessageArray[1];
                        }
                        hideLoadingPopUp();
                        var titleMessage = $scope.flexGrid_AlertHeaderLabel;
                        bootbox.dialog({
                            size: 'small',
                            message: deleteMessage,
                            title: titleMessage,
                            onEscape: function() {},
                            backdrop: false,
                            closeButton: true,
                            animate: true,
                            buttons: {
                                ok: {
                                    label: "Ok",
                                    className: "customBtn btn-ext",
                                }
                            }
                        });
                    });
                }
            }, {
                buffer: false,
                escape: false,
                timeout: 30000
            }
        );
    };

    $scope.calculateTotalForSpecifiedColumnsAtBottomTotalRow = function(recordList, columnName) {
        var total = 0;
        for (var i = 0; i < recordList.length; i++) {
            //console.log('-----recordList[i]--',recordList[i]);
            if (columnName != 'Id' && recordList[i]!= undefined && recordList[i]['isSubTotal'] != true) {
                var obj = recordList[i];
                viewValueGetter = $parse(columnName);
                var fieldValue = viewValueGetter(obj);
                if (!isNaN(fieldValue)) {
                    total += Number(fieldValue);
                }
            }
        }
        //console.log('-----total--',total);				  			  
        total = total.toFixed(2);
        return total;
    };

    $scope.massDelete = function() {
        $scope.objectNameToIDMap = {};
        for (rec in $scope.selectedRecords) { // 'IsSelected'
            if ($scope.selectedRecords[rec]['SObj'] != undefined) {
                if ($scope.objectNameToIDMap[$scope.selectedRecords[rec]['SObj']] == undefined) {
                    $scope.objectNameToIDMap[$scope.selectedRecords[rec]['SObj']] = [];
                }
                if ($scope.selectedRecords[rec]['IsSelected']) {
                    $scope.objectNameToIDMap[$scope.selectedRecords[rec]['SObj']].push(rec);
                }
            }
        }
        var deleteMessage = $scope.flexGrid_DeleteConfirmLabel;
        if (confirm(deleteMessage)) {
            $scope.messages = [];
            showLoadingPopUp();
            var deferred = $q.defer();
            Visualforce.remoting.Manager.invokeAction(
                _RemotingFlexGridActions.DeleteRecords,
                $scope.objectNameToIDMap,
                function(deleteResult, event) {
                    if (event.status) {
                        $scope.$apply(function() {
                            deferred.resolve(deleteResult);
                            var deleteMessage;
                            if (deleteResult.Success) {
                                $scope.messages.push({
                                    type: 'info',
                                    msg: deleteResult.Message
                                });
                                //----This is not a good solution to refresh, I will chnage it later
                                //$scope.initInlineEditableGrid();

                                $scope.getRecordsForGrid();

                            } else {
                                var result = deleteResult.Message;
                                var deleteMessageArray = result.split(':');
                                var deleteMessage = deleteMessageArray[2];
                                var deleteErrorMessageArray = deleteMessage.split(',');
                                deleteMessage = deleteErrorMessageArray[1];
                            }
                            hideLoadingPopUp();
                        });
                    }
                }, {
                    buffer: false,
                    escape: false,
                    timeout: 30000
                }
            );
            return deferred.promise;
        }
    };

    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    }
    $scope.trustSrcHTML = function(src) {
        return $sce.trustAsHtml(src);
    };
    $scope.addNewRecord = function(metaData) {
        showLoadingPopUp();
        //console.log("===> $scope.messages in addNewRecord"+$scope.messages);
        if ($scope.messages.length == 0) {
            //$scope.CounterForHide = $scope.CounterForHide+1;
            //$scope.overAllTotal[0] = 0;            	 
            //if($scope.updatedRowsMap[metaData.ObjectMetaData.APIName] == undefined){
            $scope.newRecord = {};
            $scope.mode = 'edit';
            for (var i = 0; i < metaData.ColumnsNameList.length; i++) {
                var fieldName = metaData.ColumnsNameList[i];
                var fieldPath = metaData.FieldMetadata[fieldName].Reference;
                if (metaData.KeyValueMap[fieldPath] != undefined) {
                    $scope.newRecord[fieldPath] = metaData.KeyValueMap[fieldPath];
                }
            }
            for (reqField in metaData.ConfigInfo.RequiredFieldsMap) {
                if ($scope.reqFieldObjMap[metaData.ObjectMetaData.APIName] == false) {
                    metaData.ColumnsNameList.push(reqField);
                    $scope.reqFieldObjMap[metaData.ObjectMetaData.APIName] = true;
                }
                if (metaData.KeyValueMap[reqField] != undefined) {
                    $scope.newRecord[reqField] = metaData.KeyValueMap[reqField];
                }
            }
            if (metaData.ParentRelationshipField != undefined) {
                if (metaData.KeyValueMap.parentRecordIdOfFlexTable != undefined) {
                    $scope.newRecord[metaData.ParentRelationshipField] = metaData.KeyValueMap.parentRecordIdOfFlexTable;
                }
            }
            if ($scope.updatedRowsMap[metaData.ObjectMetaData.APIName] == undefined) {
                $scope.updatedRowsMap[metaData.ObjectMetaData.APIName] = {};
            }
            $scope.newRecord['Id'] = $scope.uniqueIdentifier;
            $scope.openInlineEdit(metaData, $scope.newRecord);

            $scope.updatedRowsMap[metaData.ObjectMetaData.APIName][$scope.uniqueIdentifier++] = $scope.newRecord;
            //console.log("===> $scope.updatedRowsMap in addnewRecord"+JSON.stringify($scope.updatedRowsMap));
            if (metaData.ConfigInfo.SubTotalEvaluatorJSON == 'null') {
                $scope.dataTableInfo.RecordsList.unshift($scope.newRecord);
            } else {
                $scope.recordList.unshift($scope.newRecord);
            }

            //} 
        }
        hideLoadingPopUp();
    };
    $scope.handleModalClick = function() {
        j$('#newModalDiv' + $scope.flexGrid_tableId).modal();
        //j$('#iframeAddContentId{!tableId}').attr('src','/apex/'+$scope.parentTableMetadata.NamespacePrefix+'AnnouncementEdit');
    }
    $scope.buttonHandler = function(tableMetaData, actionItem) {
        showLoadingPopUp();
        $scope.actionHandler($scope.parentTableMetadata, actionItem, undefined, undefined);
        hideLoadingPopUp();
    };

    $scope.topLevelEditbuttonHandler = function(dataTableInfo, editableGridData) {
        //console.log('----$scope.isRowGrouping-',$scope.isRowGrouping);
        //console.log('----editableGridData-',editableGridData);
        showLoadingPopUp();
        $scope.mode = 'edit';
        var recordList;
        if($scope.isRowGrouping == false){
            recordList = dataTableInfo.RecordsList;
        }else{
            recordList = $scope.recordList; 

        }
        for (var i = 0; i < recordList.length; i++) {
            
            if ($scope.modeToggleMap[dataTableInfo.ObjectName] == undefined) {
                $scope.modeToggleMap[dataTableInfo.ObjectName] = {};
            }
            $scope.modeToggleMap[dataTableInfo.ObjectName][recordList[i].Id] = true;
            if(editableGridData.Child1TableMetadata != undefined){
                var childrecords = editableGridData.Child1TableMetadata.ChildRelationshipName;
                var objectAPI = editableGridData.Child1TableMetadata.ObjectMetaData.APIName;
            if (recordList[i][childrecords] != undefined && recordList[i][childrecords].length > 0) {
                for (var j = 0; j < recordList[i][childrecords].length; j++) {
                    if ($scope.modeToggleMap[objectAPI] == undefined) {
                        $scope.modeToggleMap[objectAPI] = {};
                    }
                    $scope.modeToggleMap[objectAPI][recordList[i][childrecords][j].Id] = true;
                }
            }
        }
        }
        if(recordList.length > 0){
            $scope.massGridOptions.editMode = false;
            $scope.massEditAll = true;
        }
        hideLoadingPopUp();
    };
    $scope.undoEditAll = function(){
        showLoadingPopUp();
        $scope.mode = 'view';
        $scope.massGridOptions.editMode = true;
        $scope.massEditAll = false;  
        $scope.selectedFieldsMap = {};
        $scope.updatedRowsMap = {};
        $scope.modeToggleMap = {};      
        hideLoadingPopUp();
    }
    $scope.editUndoTracker = {};
    $scope.openInlineEdit = function(tableMetaData, row) {
        $scope.CounterForHide = $scope.CounterForHide + 1;
        //console.log('$scope.CounterForHide---',$scope.CounterForHide);
        if ($scope.modeToggleMap[tableMetaData.ObjectMetaData.APIName] == undefined) {
            $scope.modeToggleMap[tableMetaData.ObjectMetaData.APIName] = {};
        }
        // //console.log("====> $scope.modeToggleMap"+JSON.stringify($scope.modeToggleMap));
        // //console.log("====> tableMetaData.ObjectMetaData.APIName"+JSON.stringify(tableMetaData.ObjectMetaData.APIName));
        $scope.modeToggleMap[tableMetaData.ObjectMetaData.APIName][row.Id] = true;
        //console.log('$scope.modeToggleMap--',$scope.modeToggleMap);
        $scope.massGridOptions.editMode = false;
        var tmpRow = {};
        tmpRow = angular.copy(row);
        //console.log('tmpRow--',tmpRow);
        $scope.editUndoTracker[row.Id] = tmpRow;
        //console.log('$scope.editUndoTracker---',$scope.editUndoTracker);
    };
    $scope.actionHandler = function(tableMetaData, actionItem, row, index) {
        var winURL = '';
        if (actionItem.ActionClass != 'null') {
            if (actionItem.Location == 'Top') {
                if (tableMetaData.ConfigInfo.EnableRecordSelection == 'true' && $scope.selectedRecords != undefined && $scope.selectedRecords != '') {
                    $scope.executeApexClass(actionItem, $scope.selectedRecords, tableMetaData);
                } else if (tableMetaData.ConfigInfo.EnableRecordSelection == 'true' && $scope.selectedRecords == '') {
                    $scope.messages.push({
                        type: 'info',
                        msg: 'Please select atleast one record.'
                    });
                } else {
                    $scope.selectedRecords = {};
                    $scope.executeApexClass(actionItem, $scope.selectedRecords, tableMetaData);
                }
            } else if (actionItem.Location == 'Row') {
                $scope.selectedRecord = {};
                if (row.Id != undefined) {
                    $scope.selectedRecord[row.Id] = true;
                }
                $scope.messages = [];
                showLoadingPopUp();
                $scope.executeApexClass(actionItem, $scope.selectedRecord, tableMetaData);
            }
        } else if (actionItem.ActionBehavior == 'Open in inline mode') {
            //console.log('index---',index);
            $scope.openInlineEdit(tableMetaData, row);
        } else if (actionItem.ActionURL != 'null' && actionItem.ActionURL != undefined) {
            var childRelationshipField = tableMetaData.ChildRelationshipField;
            winURL = actionItem.ActionURL;
            var regexForFlexGrid = /\{\!(\w*)\}/;
            var matchesForFlexGrid = regexForFlexGrid.exec(winURL);
            if (matchesForFlexGrid) {
                winURL = winURL.replace(regexForFlexGrid, row.Id);
            }
            if (row != undefined) {
                var objName = tableMetaData.ObjectMetaData.APIName;
                var mergeField = '{' + '!' + objName + '.id}';
                winURL = winURL.replace(new RegExp('(' + mergeField + ')', 'gi'), row.Id); //False +ve for non literal regex used for sanitization, as we are not using for sanitization purpose
            }
            if (tableMetaData.ConfigInfo.EnableRecordSelection == 'true') {
                var idsParam = '';
                if (winURL.indexOf('?') == -1) {
                    idsParam += '?';
                } else {
                    idsParam += '&';
                }
                idsParam += 'ids=';
                for (id in $scope.selectedRecords) {
                    if ($scope.selectedRecords[id] == true) {
                        idsParam += id + ',';
                    }
                }
                idsParam = idsParam.substring(0, idsParam.length - 1);
                winURL += idsParam;
            }
        }
        if (winURL != '' && actionItem.StandardAction != 'Delete') {
            $scope.handleOpenCondition(winURL, actionItem);
        } else if (actionItem.StandardAction == 'Delete') {
            if (row != null) {
                $scope.deleteRecord(tableMetaData, row.Id, index);
            }
        }
    }
    $scope.executeApexClass = function(actionItem, selectedRecords, tableMetaData) {
        var winURL = '';
        var deferred = $q.defer();
        $scope.messages = [];
        showLoadingPopUp();
        var idsMap = {};
        for (var key in selectedRecords) {
            if (selectedRecords.hasOwnProperty(key)) {
                if (key != 'undefined') {
                    idsMap[key] = selectedRecords[key].IsSelected;
                    if (idsMap[key] == undefined || idsMap[key] == 'undefined') {
                        idsMap[key] = selectedRecords[key];
                    }
                }
            }
        }
        Visualforce.remoting.Manager.invokeAction(
            _RemotingFlexGridActions.ExecuteClass,
            actionItem.ActionClass, idsMap, tableMetaData.KeyValueMap, actionItem.DataTableActionObj, tableMetaData.ConfigInfo.Name, $scope.flexGrid_CurrentPageURL,
            function(executeClassResult, event) {
                if (event.status) {
                    $scope.$apply(function() {
                        deferred.resolve(executeClassResult);
                        winURL = executeClassResult.PageURL;
                        if (executeClassResult.Error != null && executeClassResult.Error != '') {
                            alert(executeClassResult.Error);
                            hideLoadingPopUp();
                        } else if (winURL != null && winURL != '') {
                            $scope.handleOpenCondition(winURL, actionItem);
                        } else if (executeClassResult.Message != null && executeClassResult.Message != '') {
                            hideLoadingPopUp();
                            $scope.messages.push({
                                type: 'info',
                                msg: executeClassResult.Message
                            });
                            $scope.getRecordsForGrid();
                            hideLoadingPopUp();
                            //----This is not a good solution to refresh, I will chnage it later
                            //$scope.initInlineEditableGrid();
                            //$scope.getPageRecords(); 
                            //$scope.dataTableInfo = executeClassResult.DataTableInfo;                                    
                        }
                        hideLoadingPopUp();
                    });
                }
            }, {
                buffer: false,
                escape: false,
                timeout: 30000
            }
        );

    }
    $scope.handleModalOpenCondition = {};
    $scope.handleModalOpenCondition.handleOpenCondition = function(winURL, actionItem) {
        $scope.handleOpenCondition(winURL, actionItem);
        //console.log('New handleModalOPenCondition called');
    }
    $scope.handleOpenCondition = function(winURL, actionItem) {
        winURL = decodeURIComponent(winURL);
        if (winURL.toLowerCase().indexOf("saveurl") == -1) {
            if (winURL.indexOf("?") == -1) {
                winURL = winURL + '?saveURL=' + encodeURIComponent($scope.flexGrid_CurrentPURL);
            } else {
                winURL = winURL + '&saveURL=' + encodeURIComponent($scope.flexGrid_CurrentPURL);
            }
        }
        if (winURL.indexOf('&retURL') != -1) {
            winURL = winURL.substring(0, winURL.indexOf('retURL'));
        }
        var ret = decodeURIComponent($scope.currentPageURL);
        if (ret.indexOf('&retURL') != -1 || ret.indexOf('?retURL') != -1) {
            ret = ret.substring(0, ret.indexOf('retURL') - 1);
        }
        winURL += '&retURL=' + encodeURIComponent(ret);
        if (actionItem.ActionBehavior == 'Open in same window') {
            $window.open(winURL, '_self');
        } else if (actionItem.ActionBehavior == 'Open in new window') {
            $window.open(winURL, '_blank');
        } else if (actionItem.ActionBehavior == 'Open in overlay') {
            $scope.windowURL = winURL;
            $scope.windowTitle = actionItem.DataTableActionObj.Name;
            if (actionItem.height != 'null' && actionItem.height != '') {
                $scope.windowHeight = actionItem.Height + 'px';
            } else {
                $scope.windowHeight = '200px';
            }
            if (actionItem.width != 'null' && actionItem.Width != '') {
                if((parseInt(actionItem.Width)) < 100) {
                	$scope.windowWidth  = (parseInt(actionItem.Width)).toString() + '%';
				} else {
					$scope.windowWidth  = (parseInt(actionItem.Width)).toString() +'px';
				}
            } else {
                $scope.windowWidth = '50%';
            }
            $scope.buttonOnClick = actionItem;
            j$('#' + $scope.flexGrid_tableId + 'modalDiv').modal();
            lastFocus = document.activeElement;
            flexModalId = $scope.flexGrid_tableId;
        } else {
            $window.open(winURL, '_self');
        }
    };
    $scope.deleteRecord = function(tableMetaData, recordId, index) {
        var deleteMessage = $scope.flexGrid_DeleteConfirmLabel;
        bootbox.dialog({
            message: deleteMessage,
            title: "Confirm",
            onEscape: function() {},
            backdrop: false,
            closeButton: true,
            animate: true,
            buttons: {
                No: {
                    label: "No",
                    className: "customBtn btn-ext",
                    callback: function() {}
                },
                "Yes": {
                    label: "Yes",
                    className: "customBtn btn-ext",
                    callback: function(result) {
                        if (result) {
                            //showLoadingPopUp();
                            $scope.deleteRecords(tableMetaData, recordId, index);
                        }
                    }
                },
            }
        });
    };

    $scope.deleteRecords = function(tableMetaData, recordId, index) {
        Visualforce.remoting.Manager.invokeAction(
            _RemotingFlexGridActions.DeleteRecord,
            tableMetaData.ObjectMetaData.APIName, recordId,
            function(deleteResult, event) {
                if (event.status) {
                    $scope.$apply(function() {
                        var deleteMessage;
                        if (deleteResult.Success) {
                            deleteMessage = deleteResult.Message;;
                            $scope.overAllTotal[tableMetaData.ConfigInfo.FlexTableRecordId] = {};
                            if ($scope.CounterForHide == 0) {
                                $scope.getRecordsForGrid();
                            }
                            //$scope.saveRecords();
                            hideLoadingPopUp();
                        } else {
                            var result = deleteResult.Message;
                            var deleteMessageArray = result.split(':');
                            var deleteMessage = deleteMessageArray[2];
                            var deleteErrorMessageArray = deleteMessage.split(',');
                            deleteMessage = deleteErrorMessageArray[1];
                        }
                        hideLoadingPopUp();
                        var titleMessage = $scope.flexGrid_AlertHeaderLabel;
                        bootbox.dialog({
                            size: 'small',
                            message: deleteMessage,
                            title: titleMessage,
                            onEscape: function() {},
                            backdrop: false,
                            closeButton: true,
                            animate: true,
                            buttons: {
                                ok: {
                                    label: "Ok",
                                    className: "customBtn btn-ext",
                                }
                            }
                        });
                    });
                }
            }, {
                buffer: false,
                escape: false,
                timeout: 30000
            }
        );

    };

    $scope.getReferenceURL = function(row, column) {
        //console.log('Inside getReferenceURL fun');
        $scope.refField = column.split(".");
        if ($scope.refField[0] != undefined && row[$scope.refField[0]] != undefined) {
            $scope.retFieldValue = row[$scope.refField[0]].Id;
            if ($scope.retFieldValue.substr(0, 3) == '005') {
                return '/apex/' + $scope.parentTableMetadata.NamespacePrefix + 'ProfileRedirect?id=' + $scope.retFieldValue;
            } else {
                return '/' + $scope.retFieldValue;
            }
        }
    };
    $scope.setLoading = function(loading) {
        $scope.isLoading = loading;
    };
    $scope.saveBudgetRecords = function() {
        var recordToUpdate = [];
        for (var recordIndex = 0; recordIndex < $scope.budgetGridData.length; recordIndex++) {
            if ($scope.budgetGridData[recordIndex].Type == 'Actual') {
                for (var index = 0; index < $scope.colGrouping.length; index++) {
                    var record = $scope.budgetGridData[recordIndex][$scope.colGrouping[index]];
                    recordToUpdate.push(record);
                }
            }
        }
        $scope.messages = [];
        $scope.massagedUpdatedRowsMap = {};
        showLoadingPopUp();
        $scope.massagedUpdatedRowsMap[$scope.parentTableMetadata.ObjectMetaData.APIName] = recordToUpdate;
        $scope.isRefresh = true;
        var deferred = $q.defer();
        Visualforce.remoting.Manager.invokeAction(
            _RemotingFlexGridActions.UpdateRows,
            angular.toJson($scope.massagedUpdatedRowsMap), angular.toJson($scope.parentTableMetadata),
            function(updatedResult, event) {
                if (event.status) {
                    $scope.$apply(function() {
                        deferred.resolve(updatedResult);
                        if (updatedResult.Success == true) {
                            $scope.dataTableInfo = updatedResult.DataTableInfo;
                            $scope.createBudgetGrid();
                            $scope.isRefresh = false;
                            hideLoadingPopUp();
                            $scope.budgetGridOptions.editMode = true;
                        } else {
                            $scope.messages.push({
                                type: 'info',
                                msg: updatedResult.ErrorMessage
                            });
                            $scope.isRefresh = false;
                            hideLoadingPopUp();
                            $scope.budgetGridOptions.editMode = false;
                        }
                    });
                } else {}
            }, {
                buffer: false,
                escape: false
            }
        );
        return deferred.promise;
    }

    $scope.checkCookie = function() {
        return j$.cookie('setup') == 'present';
    }

    $scope.redirect = function(flexGridId) {
        $window.open("/" + flexGridId + "?isdtp=vw");
    }

    $scope.createBudgetGrid = function() {
        var columnGrouping = {};
        var colGrouping = [];
        var colGroupingLength = 0;
        $scope.iteratorColumns = {};
        var iteratorField = $scope.iteratorFieldsMap[0].field;
        var iteratorColumn = $scope.iteratorFieldsMap[0].column;
        for (var recordIndex = 0; recordIndex < $scope.dataTableInfo.RecordsList.length; recordIndex++) {
            var record = $scope.dataTableInfo.RecordsList[recordIndex];
            if (columnGrouping[record[iteratorField]] == undefined) {
                columnGrouping[record[iteratorField]] = [];
                colGrouping.push(record[iteratorField]);
                colGroupingLength++;
                var headerRecord = {
                    'column': iteratorColumn,
                    'record': record
                }
                $scope.iteratorColumns[record[iteratorField]] = headerRecord;
            }
            columnGrouping[record[iteratorField]].push(recordIndex);
        }
        $scope.colGrouping = colGrouping;
        var recordCounter = 0;
        var colGroupingCounter = 0;
        var gridData = [];
        do {
            var gridRow = {};
            gridRow['Type'] = 'Actual';
            gridRow['RowSpan'] = {};
            for (var rowIndex = 0; rowIndex < $scope.groupingFieldsMap.length; rowIndex++) {
                gridRow[$scope.groupingFieldsMap[rowIndex]['field']] = $scope.dataTableInfo.RecordsList[recordCounter];
                if (rowIndex == ($scope.groupingFieldsMap.length - 1)) {
                    gridRow['RowSpan'][$scope.groupingFieldsMap[rowIndex]['field']] = 1;
                } else {
                    gridRow['RowSpan'][$scope.groupingFieldsMap[rowIndex]['field']] = 0;
                }
            }
            for (var colIndex = 0; colIndex < colGrouping.length; colIndex++) {
                var record = $scope.dataTableInfo.RecordsList[recordCounter];
                if (colGrouping[colIndex] == record[iteratorField]) {
                    gridRow[colGrouping[colIndex]] = record;
                    gridRow['RowSpan'][colGrouping[colIndex]] = 1;
                    recordCounter++;
                }
            }
            gridData.push(gridRow);
        } while (recordCounter < $scope.dataTableInfo.RecordsList.length);
        var subTotalArray = [];
        var gridDataIndex = 0;
        var totalGridRow = {};
        totalGridRow['Type'] = 'Total';
        //totalGridRow['Label'] = 'Total';
        totalGridRow['Label'] = 'Sub-Total';
        totalGridRow['RowIndexArray'] = [gridDataIndex];
        if ($scope.groupingFieldsMap.length >= 2) {
            var rowIndex = $scope.groupingFieldsMap.length - 1;
            var parentRowIndex = $scope.groupingFieldsMap.length - 2;
            for (gridDataIndex = 1; gridDataIndex < gridData.length; gridDataIndex++) {
                var gridRow = gridData[gridDataIndex];
                var previousGridRow = gridData[gridDataIndex - 1];
                var field = $scope.groupingFieldsMap[parentRowIndex]['field'];
                if (gridRow[field][field] == previousGridRow[field][field]) {
                    totalGridRow['RowIndexArray'].push(gridDataIndex);
                } else {
                    gridData[totalGridRow['RowIndexArray'][0]]['RowSpan'][field] = totalGridRow['RowIndexArray'].length;
                    subTotalArray.push(gridDataIndex);
                    gridData.splice(gridDataIndex++, 0, totalGridRow);
                    totalGridRow = {};
                    totalGridRow['Type'] = 'Total';
                    totalGridRow['Label'] = 'Sub-Total';
                    totalGridRow['RowIndexArray'] = [];
                    totalGridRow['RowIndexArray'].push(gridDataIndex);
                }
            }
            gridData[totalGridRow['RowIndexArray'][0]]['RowSpan'][field] = totalGridRow['RowIndexArray'].length;
            subTotalArray.push(gridDataIndex);
            gridData.splice(gridDataIndex++, 0, totalGridRow);
        } else if ($scope.groupingFieldsMap.length == 1) {
            for (gridDataIndex = 0; gridDataIndex < gridData.length; gridDataIndex++) {
                subTotalArray.push(gridDataIndex);
            }
        }
        if (subTotalArray.length > 1) {
            var grandTotalGridRow = {};
            grandTotalGridRow['Type'] = 'Total';
            grandTotalGridRow['Label'] = 'Total';
            grandTotalGridRow['RowIndexArray'] = subTotalArray;
            gridData.splice(gridDataIndex++, 0, grandTotalGridRow);
        } else if (subTotalArray.length == 1) {
            var totalRowIndex = subTotalArray[0];
            gridData[totalRowIndex]['Label'] = 'Total';
        }
        $scope.budgetGridData = gridData;
    }
    $scope.paintEditableGrid = function(editableGridResult) {
        $scope.noChildTable = false;
        $scope.legendForRowLevelActionsForParent = [];
        $scope.parentTableMetadata = editableGridResult.ParentTableMetadata;
        $scope.dataTableInfo = editableGridResult.DataTableInfo;
        $scope.helpText = editableGridResult.helpText;
        $scope.hideColumnIfDataIsStar = $scope.hideColumnFunction($scope.dataTableInfo);
        $scope.childMetadataKeysArray = editableGridResult.ChildMetadataKeysArray;
        $scope.editableGridData = editableGridResult;
        if (editableGridResult.RecordType == 'Budget Grid') {
            $scope.groupingFieldsMap = angular.fromJson($scope.parentTableMetadata.DataTableInfoMap.RowJSON);
            $scope.iteratorFieldsMap = angular.fromJson($scope.parentTableMetadata.DataTableInfoMap.ColumnJSON);
            $scope.summarizableField = $scope.parentTableMetadata.DataTableInfoMap.SummarizableField;
            $scope.parentTableMetadata.DataTableInfoMap.BudgetGridEditJSON = angular.fromJson($scope.parentTableMetadata.DataTableInfoMap.BudgetGridEditJSON);
            $scope.hiddenColumn = angular.fromJson($scope.parentTableMetadata.DataTableInfoMap.HideColumnsJSON);
            $scope.createBudgetGrid();
        }
        
            $scope.handlerecordsForSubTotalCondition();
        
        if ($scope.parentTableMetadata.ConfigInfo.MassEditableGridConfigJSON != 'null') {
            //console.log('====MassEditableGridConfigJSON====', $scope.parentTableMetadata.ConfigInfo.MassEditableGridConfigJSON);
            var massEditableGridConfigJSON = angular.fromJson($scope.parentTableMetadata.ConfigInfo.MassEditableGridConfigJSON);
            //console.log('====MassEditableGridConfigJSON====',massEditableGridConfigJSON);
            $scope.massEditableGridConfigJSON = massEditableGridConfigJSON;
        }
        $scope.childRelationshipQueries = $scope.parentTableMetadata.ChildRelationshipQueries;
        $scope.queryColumns = $scope.dataTableInfo.QueryColumns;
        $scope.hideDecisionFields = $scope.dataTableInfo.HideDecisionFields;
        $scope.objectName = $scope.dataTableInfo.ObjectName;
        $scope.filterClause = $scope.dataTableInfo.FilterClause;
        $scope.sortColumn = $scope.dataTableInfo.SortColumn;
        $scope.sortDir = $scope.dataTableInfo.SortDir;
        $scope.pageNumber = $scope.dataTableInfo.PageNumber;
        $scope.pageSize = $scope.dataTableInfo.PageSize;
        
        
        if (typeof editableGridResult.Child1TableMetadata != 'undefined') {
            $scope.child1TableMetadata = editableGridResult.Child1TableMetadata;
            $scope.parentTableMetadata = editableGridResult.ParentTableMetadata;
            $scope.createParentTableMetadataMembers();
            $scope.legendForRowLevelActionsForChild1 = $scope.createActionLegends($scope.child1TableMetadata);
            var removeRecordActionLegend = {
                actionName: 'Remove Record',
                icon: $sce.trustAsHtml('<i class="fa fa-times"></i>')
            }
            $scope.legendForRowLevelActionsForChild1.push(removeRecordActionLegend);
        }
        $scope.legendForRowLevelActionsForParent = $scope.createActionLegends($scope.parentTableMetadata);
        $scope.showHeaderMap = {};
        $scope.resultSize = $scope.dataTableInfo.ResultSize;
        $scope.totalRecords = 'Total records: ' + $scope.dataTableInfo.ResultSize;
        $scope.totalPages = $scope.dataTableInfo.TotalPages;
        $scope.currentPage = $scope.dataTableInfo.PageNumber;
        $scope.pageInfo = 'Page ' + $scope.currentPage + ' of ' + $scope.totalPages;
        $scope.hasPrevious = $scope.dataTableInfo.HasPrevious;
        $scope.hasNext = $scope.dataTableInfo.HasNext;
        $scope.refreshChildSizeMap();

        if ($scope.childMetadataKeysArray == undefined) {
            $scope.noChildTable = true;
        }
    };

    $scope.refreshChildSizeMap = function() {
        $scope.childSizeMap = {};
        for (var childMeta in $scope.childMetadataKeysArray) {
            if ('remove' != childMeta) {
                $scope.childSizeMap[$scope.childMetadataKeysArray[childMeta]] = {};
                for (var singleRec in $scope.dataTableInfo.RecordsList) {
                    if ('remove' != singleRec) {
                        var id = $scope.dataTableInfo.RecordsList[singleRec].Id;
                        $scope.childSizeMap[$scope.childMetadataKeysArray[childMeta]][id] = $scope.editableGridData[$scope.childMetadataKeysArray[childMeta]].ListSize;
                    }
                }
            }
        }
    }

    $scope.createActionLegends = function(tableMetadata) {
        var actionInfo = tableMetadata.ActionInfo;
        $scope.legendForRowLevelActions = [];
        for (a in actionInfo) {
            if (actionInfo[a].Location.toLowerCase() === 'row') {
                var actionLegendForRowLevelActions = {
                    actionName: actionInfo[a].ActionName,
                    icon: $sce.trustAsHtml(actionInfo[a].Icon)
                };
                $scope.legendForRowLevelActions.push(actionLegendForRowLevelActions);
            }
        }
        return $scope.legendForRowLevelActions;
    };

    $scope.createParentTableMetadataMembers = function() {
        $scope.queryColumns = $scope.dataTableInfo.QueryColumns;
        $scope.hideDecisionFields = $scope.dataTableInfo.HideDecisionFields;
        $scope.objectName = $scope.dataTableInfo.ObjectName;
        $scope.childRelationshipQueries = $scope.parentTableMetadata.ChildRelationshipQueries;
        $scope.filterClause = $scope.dataTableInfo.FilterClause;
        $scope.sortColumn = $scope.dataTableInfo.SortColumn;
        $scope.sortDir = $scope.dataTableInfo.SortDir;
        $scope.pageNumber = $scope.dataTableInfo.PageNumber;
        $scope.pageSize = $scope.dataTableInfo.PageSize;
        //$scope.pageSize = $scope.dataTableInfo.PageSizeForFlexGrid;		
    };

    $scope.initInlineEditableGrid = function() {
        var deferred = $q.defer();
        Visualforce.remoting.Manager.invokeAction(
            _RemotingFlexGridActions.FetchEditableGridData,
            $scope.flexGrid_tableId, $scope.flexGrid_keyValueMap, $scope.flexGrid_listKeyValueMap, $scope.sforce1,
            function(editableGridResult, event) {
                if (event.status) {
                    $scope.$apply(function() {
                        deferred.resolve(editableGridResult);
                        $scope.isMassOperationAllowed = editableGridResult.MassFunctionality;
                        if($scope.isMassOperationAllowed == 'Show'){
                            $scope.massEditAll = false;
                        }
                        $scope.EnablePagination = editableGridResult.EnablePagination;
                        $scope.paintEditableGrid(editableGridResult);
                        //console.log('editableGridResult====', editableGridResult);
                        $scope.headerInstructionForGrid = editableGridResult.HeaderInstructionForGrid;
                        $scope.setLoading(false);
                        hideLoadingPopUp();
                        /*8.Flex Table Header for 508*/
                        //console.log('$scope.flexGrid_tableId====', $scope.flexGrid_tableId);
                        //console.log('skipNavMap[$scope.flexGrid_tableId]flexGrid====', skipNavMap[$scope.flexGrid_tableId + 'flexGrid']);
                        if (skipNavMap[$scope.flexGrid_tableId + 'flexGrid'] == undefined) {
                            $scope.getNavLinks2();
                            $timeout(function() {
                                $scope.getNavLinks_InnerHtml();
                            }, 2000);
                        }
                    });
                } else {
                    $scope.$apply(function() {
                        $scope.errorCreatingTable = true;
                        $scope.setLoading(false);
                        $scope.messages.push({
                            type: 'danger',
                            msg: 'Error creating table:' + event.message
                        });
                        hideLoadingPopUp();
                    });
                }
            }, {
                buffer: false,
                escape: false
            }
        );
        return deferred.promise;
    };

    $scope.initN2G = function() {
        var deferred = $q.defer();
        Visualforce.remoting.Manager.invokeAction(
            _RemotingFlexGridActions.FetchN2GData,
            $scope.flexGrid_tableId, $scope.flexGrid_keyValueMap, $scope.flexGrid_listKeyValueMap, $scope.sforce1,
            function(n2gResult, event) {
                if (event.status) {
                    $scope.$apply(function() {
                        deferred.resolve(n2gResult);
                        $scope.n2gData = n2gResult;
                        $scope.helpText = n2gResult.helpText;
                        $scope.headerInstructionForGrid = n2gResult.headerInstructionForGrid;
                        $scope.parentTableMetadata = n2gResult.ParentTableMetadata;
                        $scope.setLoading(false);
                        $scope.closeModalN2G = n2gResult.RecordType;
                        if (skipNavMap[$scope.flexGrid_tableId + 'flexGrid'] == undefined) {
                            $scope.getNavLinks2();
                            $timeout(function() {
                                $scope.getNavLinks_InnerHtml();
                            }, 2000);
                        }
                        /*pageTemplate method for 508 skip navigation*/
                        hideLoadingPopUp();

                    });
                } else {
                    $scope.$apply(function() {
                        $scope.errorCreatingTable = true;
                        $scope.setLoading(false);
                        $scope.messages.push({
                            type: 'danger',
                            msg: 'Error creating table:' + event.message
                        });
                        hideLoadingPopUp();
                    });
                }
            }, {
                buffer: false,
                escape: false
            }
        );
        return deferred.promise;
    };

    $scope.hiddenColumnMap = {};	    
    $scope.hideColumnFunction = function(result) { 
    	for(var i =0; i < $scope.parentTableMetadata.ColumnsNameList.length; i++) {    		
    		var col = $scope.parentTableMetadata.ColumnsNameList[i];  
    		var count = 0;
    		for(var j =0 ; j < result.ResultSize ; j++){	  
    			//console.log('==hiddenCondition==',hiddenCondition);
    			var hiddenCondition = $scope.getHide(result.RecordsList[j],col,$scope.parentTableMetadata);    			
    			if(hiddenCondition== 'true') {	
    				count= count +1;	    				    					    					    						
    			}	    			      			
    		}
    		//console.log('count of hidden column:',count); 
    		//console.log('result.ResultSize:',result.ResultSize);
	    	if(result.ResultSize > 0 && result.ResultSize == count){
	    		$scope.hiddenColumnMap[col] = true; 		    			  
	    	}else{
	    		$scope.hiddenColumnMap[col] = false; 
	    	}	
    	} 	  	    	
    }
    
    $scope.getHide =function (row,col,tableMetadata) {
    	var hiddenColumnJSON  = angular.fromJson(tableMetadata.DataTableInfoMap.HideColumnsJSON);     	        
        if (row != undefined) {
            var conditionsArray = hiddenColumnJSON;            
            var isHide = false;
            if (conditionsArray != undefined) {                
                for (var i = 0; i < conditionsArray.length; i++) {
                    if (conditionsArray[i].operator == '=') { 
                        if (row[conditionsArray[i].field] == conditionsArray[i].value && col == hiddenColumnJSON[i].column) {  
                            isHide = true;                             
                            break;                            
                        }
                    }
                }
                if (isHide == false) {
                    return 'false';
                }
                return 'true';
            }
        }
        return 'false';    	
    };
    
    $scope.getNavLinks2 = function() {
        j$('#skipNav').empty();
        j$('.skipNavSectionItem2').each(function() {
            if (j$(this).text() != '') {
                var hrefId = j$(this).attr('id');
                var currentItem = j$(this).attr('name')
                //console.log('==hrefId==1123', hrefId);
                if (currentItem.indexOf('Flex Grid') != -1) {
                    j$('#skipNav').append('<a id="' + hrefId + 'SkipLink" class="skip-main" href="#' + j$(this).attr('id') + 'FlexGrid">Skip to ' + j$(this).text() + '</a>');
            } else {
                    j$('#skipNav').append('<a id="' + hrefId + 'SkipLink" class="skip-main" href="#' + j$(this).attr('id') + '">Skip to ' + j$(this).text() + '</a>');
                }
            }
        });

    };
    $scope.getNavLinks_InnerHtml = function() {
        if (document.getElementById($scope.flexGrid_tableId + 'SkipLink') != undefined) {
            document.getElementById($scope.flexGrid_tableId + 'SkipLink').textContent = 'Skip to' + $scope.parentTableMetadata.FlexTableHeader;
        }
    };

    $scope.initFlexGrid = function() {
        Visualforce.remoting.Manager.invokeAction(
            _RemotingFlexGridActions.FetchGridType,
            $scope.flexGrid_tableId, $scope.flexGrid_keyValueMap, $scope.flexGrid_listKeyValueMap, $scope.sforce1,
            function(flexGridResult, event) {
                if (event.status) {
                    $scope.$apply(function() {
                        $scope.flexGrid = flexGridResult;
                        if (flexGridResult.GridType == 'Nested Navigation Grid') {
                            $scope.initN2G();
                        } else {
                            $scope.initInlineEditableGrid();
                        }
                        //$scope.setLoading(false);                                
                    });

                } else {
                    $scope.$apply(function() {
                        //$scope.setLoading(false);
                        $scope.messages.push({
                            type: 'danger',
                            msg: 'Error creating table:' + event.message
                        });
                    });
                }
            }, {
                buffer: false,
                escape: false
            }
        );
    };
    if ($scope.flexGrid_tableId != '') {
        /*Set the sforce1 varianle */
        if ((typeof sforce != 'undefined') && (sforce != null)) {
            $scope.sforce1 = true;
        } else {
            $scope.sforce1 = false;
        }
        $scope.initFlexGrid();
    }
});

inlineEditGrid.filter('noFractionCurrency', ['$filter', '$locale',
    function(filter, locale) {
        var currencyFilter = filter('currency');
        var formats = locale.NUMBER_FORMATS;
        return function(amount, currencySymbol) {
            var value = currencyFilter(amount, currencySymbol);
            var sep = value.indexOf(formats.DECIMAL_SEP);
            if (amount >= 0) {
                return value.substring(0, sep);
            }
            return value.substring(0, sep) + '';
        };
    }
]);

inlineEditGrid.filter('noFraction', ['$filter', '$locale',
    function(filter, locale) {
        var currencyFilter = filter('currency');
        var formats = locale.NUMBER_FORMATS;
        return function(amount, currencySymbol) {
            //console.log('=====$$$====',amount);
            var value = currencyFilter(amount, '',2);
            //console.log('=====$$$====',value);
            return value;
        };
    }
]);

inlineEditGrid.directive("dateTimePicker", function($compile, $filter) {
    return {
        restrict: 'A',
        scope: {
            timePicker: '=',
            format: '@'
        },
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {
            ngModel.$formatters.push(function(value) {
                if(value != undefined && value.contains('NaN')){
					return $filter('date')(value, '');
          		}
                if (scope.timePicker == false) {
                    return $filter('date')(value, 'MM/dd/yyyy');
                } else {
                    return $filter('date')(value, 'MM/dd/yyyy h:mm a');
                }
            });
            ngModel.$parsers.push(function(value) {
                return Date.parse(value);
            });
            element.datetimepicker({
                timepicker: scope.timePicker,
                format: scope.format,
                closeOnDateSelect: true
            });

        }
    }
});

inlineEditGrid.directive("autoComplete", function($compile, $filter) {
    var fetchDataForDropDown = function(scope, element, filterClause) {
        scope.colArray = scope.column.split('.');
        var lookupval = (scope.row[scope.colArray[0]] != undefined && scope.row[scope.colArray[0]].Name != undefined) ? scope.row[scope.colArray[0]].Name : 'Search...';
        Visualforce.remoting.Manager.invokeAction(
            _RemotingFlexGridActions.FetchLookupData,
            scope.refObj.ReferenceFieldInfo.Name, scope.refObj.ReferenceTo, null, filterClause,
            function(lookupResult, event) {
                if (event.status) {
                    //scope.$apply(function () {                                                                                                       
                    var data = {
                        results: []
                    }
                    data.results = lookupResult.SobjList;
                    //query.callback( data); 
                    element.select2({
                        placeholder: lookupval,
                        data: data
                    });
                    //});                                                                                                            
                } else {}
            }, {
                buffer: false,
                escape: false
            }
        );
    }
    var fetchDataForAutoSuggest = function(scope, element, filterClause) {
        scope.colArray = scope.column.split('.');
        var lookupval = (scope.row[scope.colArray[0]] != undefined && scope.row[scope.colArray[0]].Name != undefined) ? scope.row[scope.colArray[0]].Name : 'Search...';
        element.select2({
            minimumInputLength: 1,
            placeholder: lookupval,
            allowClear: true,
            formatInputTooShort: function() {
                return "Please enter 1 or more character";
            },
            query: function(query) {
                scope.queryData({
                    fieldName: scope.refObj.ReferenceFieldInfo.Name,
                    sobjName: scope.refObj.ReferenceTo,
                    query: query,
                    filterClause: filterClause
                });
            }
        });
		element.on('change', function (evt) {
            //console.log('event---',evt.added);      
       });
    }
    var dependentFieldHandler = function(scope, element, whereClause, newValue, oldValue) {
        var disabled = false;
        var controllingFieldsArray = scope.dependentColumnsMap[scope.refObj.Reference];
        var filterClause = scope.detailInfo[scope.refObj.Reference].WhereClause;
        if (controllingFieldsArray != undefined) {
            for (var i = 0; i < controllingFieldsArray.length; i++) {
                var cField = controllingFieldsArray[i];
                if (scope.row[cField] == undefined) {
                    disabled = true;
                    break;
                }
                if (newValue != undefined) {
                    if (newValue[cField] != scope.row[cField]) {
                        element.select2("val", "");
                    }
                }
                filterClause = filterClause.replaceAll('{' + cField + '}', scope.row[cField]);
            }
        }
        //console.log('--------filterClause---',filterClause);
        //console.log('--------tableMetadata--@@@-',scope.tableMetadata);
        var keyValueMap = scope.tableMetadata.KeyValueMap;
        //console.log('--------keyValueMap---',keyValueMap);
        for(key in keyValueMap){
            var val = keyValueMap[key];
            filterClause = filterClause.replaceAll('{' + key + '}', val);    
        }
        //console.log('--------filterClause---',filterClause);
        if (disabled == false) {
            element.prop("disabled", false);
            //fetchDataForDropDown(scope,element,filterClause);   
            if (scope.detailInfo[scope.refObj.Reference].RenderType == 'Autosuggest') {
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
            detailInfo: '=',
            fieldsColumnMap: '=',
            dependentColumnsMap: '=',
            tableMetadata: '='
        },
        link: function(scope, element, attr) {
            //----Function for replace all-----                                                        
            String.prototype.replaceAll = function(search, replacement) {
                var target = this;
                return target.replace(new RegExp(search, 'g'), replacement); //False +ve for non literal regex used for sanitization, as we are not using for sanitization purpose
            };
            if (scope.detailInfo != undefined) {

                //--code for controlling field
                for (field in scope.detailInfo) {
                    var whereClause = scope.detailInfo[field].WhereClause; //This has to be changed for namespace					
                    if (whereClause != undefined && whereClause.indexOf("{" + scope.fieldsColumnMap[scope.column] + "}") != -1) {
                        if (scope.dependentColumnsMap[field] == undefined) {
                            scope.dependentColumnsMap[field] = [];
                        }
                        scope.dependentColumnsMap[field].push(scope.fieldsColumnMap[scope.column]);
                    }
                }
                if (scope.detailInfo[scope.refObj.Reference] != undefined) {
                    if (scope.detailInfo[scope.refObj.Reference].WhereClause != undefined) {
                        dependentFieldHandler(scope, element, whereClause);
                        //-------------------------------------
                        scope.$watch('row', function(newValue, oldValue) {
                            if (newValue)
                                dependentFieldHandler(scope, element, newValue, oldValue);
                        }, true);
                    } else {
                        if (scope.detailInfo[scope.refObj.Reference].RenderType == 'Autosuggest') {
                            fetchDataForAutoSuggest(scope, element, null);
                        } else {
                            fetchDataForDropDown(scope, element, null);
                        }
                    }
                } else {
                    fetchDataForAutoSuggest(scope, element, null);
                }
            }
        }
    }
});
inlineEditGrid.directive("customhtml", function($compile, $parse) {
    return {
        restrict: 'E',
        scope: {
            fieldContent: '=',
            fieldName: '=',
            tableId: '='
        },
        link: function(scope, element, attr) {
            var texAreaContent = $parse(scope.fieldName)(scope.fieldContent);
            var text = String(texAreaContent).replace(/<[^>]+>/gm, '');
            if (texAreaContent != undefined && texAreaContent != 'undefined') {
                var content = texAreaContent.replace(/PlaceHolderID/g, "inlineEditGrid" + scope.tableId);
                element.html(content).show();
                element.attr('title', text);
                $compile(element.contents())(scope);
            }

        }
    }
});
inlineEditGrid.directive("modalWindowButton", function($compile, $parse) {
    var getTemplate = function(scope, element, attr) {
        var template = '<i class="' + scope.iconcss + '" ng-click="j$(\'#newModalDiv\').modal();"></i>';
        return template;
    }
    return {
        restrict: 'E',
        scope: {
            iconcss: '@'
        },
        link: function(scope, element, attr) {
            element.html(getTemplate(scope, element, attr)).show();
            $compile(element.contents())(scope);
        }
    }
});
inlineEditGrid.directive("bindhtml", function($compile, $parse) {
    return {
        restrict: 'A',
        scope: {
            fieldContent: '='
        },
        link: function(scope, element, attr) {
            element.html(scope.fieldContent).show();
            $compile(element.contents())(scope);
        }
    }
});
inlineEditGrid.directive('field', function($compile, $parse, $timeout) {
    var idTemplate = '<span><span ng-bind="row[column]"></span></span>';
    var dateViewTemplate = '<span title="{{getDate(row[column]) | date:\'MM/dd/yyyy\'}}" ng-bind="getDate(row[column]) | date:\'MM/dd/yyyy\'" ></span> ';
    var dateTimeViewTemplate = '<span title="{{getDateTime(row[column]) | date:\'MM/dd/yyyy h:mm:a\'}}" ng-bind="getDateTime(row[column]) | date:\'MM/dd/yyyy h:mm:a\'"></span>';
    var currencyTemplate = '<span title="{{row[column]| currency }}" class="pull-right"> {{row[column]| currency}}</span>'; // title="{{row[column] | noFractionCurrency }}"
    var doubleTemplate = '<span title="{{row[column] | number}}" ng-bind="row[column] | number"></span>';
    var percentTemplate = '<span title="{{row[column] | number}}%">{{row[column] | number}}%</span>';
    var stringTemplate = '<span>' +
        '<span tabIndex="0" ng-if="column == \'Name\'" class="" href="/{{row.Id}}{{retURL}}" title="{{a}}" ng-bind="a=row[column]"></span>' +
        '<span class="tableCellText" ng-if="column != \'Name\'" title="{{row[column]}}" ng-bind="row[column]"></span> ' +
        '</span> ';

    var stringReferenceTemplate = '<span><a tabIndex="0" href="{{b}}" title="{{a}}" ng-bind="b=refUrl(row,column);a={{row}}.{{column}}" id = {{row[fieldMetadata.Reference]}}{{row.Id}}{{tableMetadata.ConfigInfo.FlexTableRecordId}}><span class="hidden508">{{row}}.{{column}}</span></a></span> ';

    var emailTemplate = '<span><a tabIndex="0" class="tableRowLinks" href="mailto:a" title="{{row[column]}}" ng-bind="a=row[column]"><span class="hidden508">{{row[column]}}</span></a></span>';
    var booleanViewTemplate = '<span><span title="{{a}}" ng-bind="a=row[column]" ng-show="false"></span>' +
        '<span title="True"  ng-if="a == true || a == \'true\'" class="fa fa-check grey "></span>' +
        '<span title="False" ng-if="a == false|| a == \'false\'" class=""></span> ' +
        '</span>';
    //'<!-- var referenceTemplate = '<span><span tabIndex="0" title="{{a}} "class="tableRowLinks" ng-bind="a={{row}}.{{column}}">{{a}}</span></span> '; -->'
    //var referenceTemplate = '<span><a tabIndex="0" class="tableRowLinks" href="{{b}}" title="{{a}}" ng-bind="b=refUrl(row,column);a={{row}}.{{column}}" ng-mouseover="showTooltip(row[fieldMetadata.Reference] + row.Id +  tableMetadata.ConfigInfo.FlexTableRecordId,row[fieldMetadata.Reference],\''+fieldName+'\')" id = {{row[fieldMetadata.Reference]}}{{row.Id}}{{tableMetadata.ConfigInfo.FlexTableRecordId}}><span class="hidden508">{{a}}</span></a></span> ';
    var dateEditTemplate = '<span><input tabindex="0" class="textAreaContent" ng-change="valueChangedDate(row,column,row[column])" type="text"  ng-model="row[column]" format="m/d/Y"  time-picker="false" date-time-picker="angular" html-placeholder="MM/DD/YYYY" /></span>';
    var dateTimeEditTemplate = '<span><input tabindex="0" class="textAreaContent" ng-change="valueChangedDateTime(row,column,row[column])" type="text" ng-model="row[column]" format="m/d/Y h:m A" time-picker="true" date-time-picker="angular" html-placeholder="MM/DD/YYYY hh:mm"/></span>';
    var stringEditTemplate = '<span><input tabindex="0" class="textAreaContent" ng-change="valueChanged(row,column,row[column])" type="text"  ng-model="row[column]" /></span>';
    var currencyEditTemplate = '<span><input tabindex="0" class="textAreaContent" ng-change="valueChanged(row,column,row[column])" ng-paste="paste($event.originalEvent)" ng-blur="onblur(row[column])" ng-focus="onfocus(row[column])" type="text" ng-keydown="keydown($event,row[column]);" ng-model="row[column]" min="0" aria-label="Enter value"/></span>';
    var booleanEditTemplate = '<span><input tabindex="0" class="textAreaContent" ng-change="valueChanged(row,column,row[column])" type="checkbox"  ng-model="row[column]" aria-label="Checkbox"/></span>';
    var referenceEditTemplate = '<span><input tabindex="0" class="textAreaContent" ng-change="valueChanged(row,fieldMetadata.Reference,row[fieldMetadata.Reference])" ng-model="viewValue" type="text" query-data="getQuery(fieldName,sobjName,query,filterClause);" dependent-columns-map="dependentColumnsMap" ref-obj="fieldMetadata" table-metadata="tableMetadata" detail-info="tableMetadata.FieldMetadata.dataTableDetailInfo" fields-column-map="tableMetadata.FieldsColumnMap" row="row" column="column"  auto-complete="angular" /></span>';
    var textAreaEditTemplate = '<span><textarea tabindex="0" class="textAreaContent" rows="5" cols="25" ng-change="valueChanged(row,column,row[column])" type="text"  ng-model="row[column]" /></span>';
    var pickListTemplate = '<span><select tabindex="0" class="textAreaContent"  ng-change="valueChanged(row,column,row[column])" ng-model="row[column]" ng-options="opt for opt in fieldMetadata.PicklistValues"></select></span>';
    var urlTemplate = '<span><a tabIndex="0" class="tableRowLinks"  title="{{row[column]}}" ng-bind="a=row[column]"><span class="hidden508">{{row[column]}}</span></a></span>';
    var getTemplate = function(readOnly, objectMetadata, content, mode) {
        var fieldName = content.FieldPath;
        //console.log('===> $scope.fieldName 1'+fieldName);
        fieldName = fieldName.replace('.', '');
        //console.log('===> $scope.fieldName 2'+fieldName);
        var referenceTemplate = '<span ><a tabIndex="0" class="tableRowLinks" href="{{b}}" title="{{a}}" aria-label="{{a}}" ng-bind="b=refUrl(row,column);a={{row}}.{{column}}" ng-mouseover="showTooltip(row[fieldMetadata.Reference],row.Id,\'' + fieldName + '\',tableMetadata.ConfigInfo.FlexTableRecordId)" ng-focus="showTooltip(row[fieldMetadata.Reference],row.Id,\'' + fieldName + '\',tableMetadata.ConfigInfo.FlexTableRecordId)" ng-blur="hideTooltip(row[fieldMetadata.Reference],row.Id,\'' + fieldName + '\',tableMetadata.ConfigInfo.FlexTableRecordId)" id = {{row[fieldMetadata.Reference]}}{{row.Id}}' + fieldName + '{{tableMetadata.ConfigInfo.FlexTableRecordId}}><span class="hidden508">{{row}}.{{column}}</span></a></span> ';
        var template = '';
        switch (content.Type) {
            case 'ID':
                if (mode == 'view' || content.IsUpdateable == 'false' || content.isAutoNumber == true || content.isFormulaeField == true) {
                    template = idTemplate;
                } else if (mode == 'edit') {
                    template = stringEditTemplate;
                }
                break;
            case 'DATE':
                if (mode == 'view' || content.IsUpdateable == 'false' || content.isAutoNumber == true || content.isFormulaeField == true) {
                    template = dateViewTemplate;
                } else if (mode == 'edit') {
                    template = dateEditTemplate;
                }
                break;
            case 'DATETIME':
                if (mode == 'view' || content.IsUpdateable == 'false' || content.isAutoNumber == true || content.isFormulaeField == true) {
                    template = dateTimeViewTemplate;
                } else if (mode == 'edit') {
                    template = dateTimeEditTemplate;
                }
                break;
            case 'CURRENCY':
                if (mode == 'view' || content.IsUpdateable == 'false' || content.isAutoNumber == true || content.isFormulaeField == true) {
                    template = currencyTemplate;
                } else if (mode == 'edit') {
                    template = currencyEditTemplate;
                }
                break;
            case 'DOUBLE':
                if (mode == 'view' || content.IsUpdateable == 'false' || content.isAutoNumber == true || content.isFormulaeField == true) {
                    template = doubleTemplate;
                } else if (mode == 'edit') {
                    template = currencyEditTemplate;
                }
                break;
            case 'STRING':
                if (mode == 'view' || content.IsUpdateable == 'false' || content.isAutoNumber == true || content.isFormulaeField == true) {
                    template = stringTemplate;
                } else if (mode == 'edit') {
                    template = stringEditTemplate;
                }
                break;
            case 'PICKLIST':
                if (mode == 'view' || content.IsUpdateable == 'false' || content.isAutoNumber == true || content.isFormulaeField == true) {
                    template = stringTemplate;
                } else if (mode == 'edit') {
                    template = pickListTemplate;
                }
                break;
            case 'MULTIPICKLIST':
                if (mode == 'view' || content.IsUpdateable == 'false' || content.isAutoNumber == true || content.isFormulaeField == true) {
                    template = stringTemplate;
                } else if (mode == 'edit') {
                    template = stringEditTemplate;
                }
                break;
            case 'PHONE':
                if (mode == 'view' || content.IsUpdateable == 'false' || content.isAutoNumber == true || content.isFormulaeField == true) {
                    template = stringTemplate;
                } else if (mode == 'edit') {
                    template = stringEditTemplate;
                }
                break;
            case 'ANYTYPE':
                if (mode == 'view' || content.IsUpdateable == 'false' || content.isAutoNumber == true || content.isFormulaeField == true) {
                    template = stringTemplate;
                } else if (mode == 'edit') {
                    template = stringEditTemplate;
                }
                break;
            case 'EMAIL':
                if (mode == 'view' || content.IsUpdateable == 'false' || content.isAutoNumber == true || content.isFormulaeField == true) {
                    template = emailTemplate;
                } else if (mode == 'edit') {
                    template = stringEditTemplate;
                }
                break;
            case 'BOOLEAN':
                if (mode == 'view' || content.IsUpdateable == 'false' || content.isAutoNumber == true || content.isFormulaeField == true) {
                    template = booleanViewTemplate;
                } else if (mode == 'edit') {
                    template = booleanEditTemplate;
                }
                break;
            case 'TEXTAREA':
                if (mode == 'edit') {
                    template = textAreaEditTemplate;
                }
                break;
            case 'REFERENCE':
                //console.log('content.FieldPath '+content.FieldPath);
                if (content.FieldPath.includes(".Name")) {
                    if ((mode == 'view' || content.IsUpdateable == 'false')) {
                        //console.log('content for reference');
                        template = referenceTemplate;
                    } else if (mode == 'edit') {
                        template = referenceEditTemplate;
                    }
                } else {
                    if ((mode == 'view' || content.IsUpdateable == 'false')) {
                        //console.log('content for reference');
                        template = stringReferenceTemplate;
                    } else if (mode == 'edit') {
                        template = referenceEditTemplate;
                    }
                }
                break;
            case 'PERCENT':
                if (mode == 'view' || content.IsUpdateable == 'false' || content.isAutoNumber == true || content.isFormulaeField == true) {
                    template = percentTemplate;
                } else if (mode == 'edit') {
                    template = stringEditTemplate;
                }
                break;
            case 'URL':
                if (mode == 'view' || content.IsUpdateable == 'false' || content.isAutoNumber == true || content.isFormulaeField == true) {
                    template = urlTemplate;
                } else if (mode == 'edit') {
                    template = stringEditTemplate;
                }
                break;
        }
        return template;
    }
    var paintFieldHTML = function(scope, element, attrs) {
        if (scope.mode == 'view') {
            if (scope.fieldMetadata.Type == 'TEXTAREA') {
                var texAreaContent = scope.row[scope.column];
                var text = String(texAreaContent).replace(/<[^>]+>/gm, '');
                if (texAreaContent != undefined && texAreaContent != 'undefined') {
                    var textAreaTemplate = '<!--[if IE 9 ]><div class="tableCell"><![endif]--><span>' + texAreaContent + '</span><!--[if IE 9 ]></div><![endif]-->';
                    element.html(textAreaTemplate).show();
                    element.attr('title', text);
                }
            } else {
                element.html(getTemplate(scope.tableMetadata.ConfigInfo.ReadOnlyFieldsMap[scope.fieldMetadata.Reference], scope.objectMetadata, scope.fieldMetadata, scope.mode)).show();
            }
        } else if (scope.mode == 'edit') {
            if (!(scope.tableMetadata.ConfigInfo.ReadOnlyFieldsMap[scope.fieldMetadata.Reference] == true)) {
                if (scope.fieldMetadata.Type == 'PICKLIST') {
                    for (var i = 0; i < scope.fieldMetadata.PicklistValues.length; i++) {
                        if(scope.row[scope.column] == undefined){
                        	scope.row[scope.column] = scope.fieldMetadata.PicklistValues[0];
                    	}
                        // if (scope.row[scope.column] == scope.fieldMetadata.PicklistValues[i]) {
                        //     scope.selectedVal = scope.fieldMetadata.PicklistValues[i];
                        //     break;
                        // }
                    }
                }
                element.html(getTemplate(scope.tableMetadata.ConfigInfo.ReadOnlyFieldsMap[scope.fieldMetadata.Reference], scope.objectMetadata, scope.fieldMetadata, scope.mode)).show();
            } else {
                if (scope.fieldMetadata.Type == 'TEXTAREA') {
                    var texAreaContent = scope.row[scope.column];
                    var text = String(texAreaContent).replace(/<[^>]+>/gm, '');
                    if (texAreaContent != undefined && texAreaContent != 'undefined') {
                        var textAreaTemplate = '<!--[if IE 9 ]><div class="tableCell"><![endif]--><span>' + texAreaContent + '</span><!--[if IE 9 ]></div><![endif]-->';
                        element.html(textAreaTemplate).show();
                        element.attr('title', text);
                    }
                } else {
                    element.html(getTemplate(scope.tableMetadata.ConfigInfo.ReadOnlyFieldsMap[scope.fieldMetadata.Reference], scope.objectMetadata, scope.fieldMetadata, 'view')).show();
                }
            }
        }
        $compile(element.contents())(scope);
    }

    var linker = function(scope, element, attrs) {
        scope.row = scope.rowValue;
        scope.column = scope.columnValue;
        scope.getQuery = function(fieldName, sobjName, query, filterClause) {
            scope.getQueryData({
                fieldName: fieldName,
                sobjName: sobjName,
                query: query,
                filterClause: filterClause
            });
        };
        paintFieldHTML(scope, element, attrs);
        scope.toggleMode = function() {
            if (scope.mode == 'view') {
                scope.mode = 'edit'
            } else {
                scope.mode = 'view';
            }
            paintFieldHTML(scope, element, attrs);
        };

        scope.paste = function(evt) {
            var item = event.clipboardData.items[0];
            item.getAsString(function(data) {
                data = data.replace(/[a-z,A-Z,!@#\$%\^\&*\)\(+=_-]/g, '');
                data = parseFloat(data).toFixed(2);

                scope.row[scope.column] = data;
                scope.$apply();
            });
        }

        scope.keydown = function(evt, value) {
            //console.log('===down==',value);
            var charCode = evt.keyCode || evt.charCode;
            //console.log('===charCode==',charCode);
            scope.allowDecimal = true;
            if (charCode == 190 || charCode == 110) {

                var index;
                if(value.constructor === Array){
                    index = value.indexOf('.');
                }
                //console.log('index==12===:', index);
                if (index != -1) {
                    evt.preventDefault();
                }
            } else if ((charCode > 47 && charCode < 58 )|| (charCode > 95 && charCode < 106)) {
                //console.log('charCode Double : ', charCode);
                var index;
                if(value.constructor === Array){
                    index = value.indexOf('.');
                }
                var charAfterdot = (value.length + 1) - index;
                //console.log('charAfterdot=====:', charAfterdot);
                if (charAfterdot > 3 && index >= 0) {
                    evt.preventDefault();
                }
            } else if (charCode == 8) {
                //console.log('===value=1=',value); 
                var len = value.length;
                if (len == 0) {
                    value = "0";
                    //console.log('===value==',value);
                }
            } else if (charCode == 37 || charCode == 39 || charCode == 46 || charCode == 9) {} else {
                evt.preventDefault();
            }
        }
        scope.onfocus = function(value) {
            if (value == '0') {
                value = '';
                scope.row[scope.column] = value;
            }
        }
        scope.onblur = function(value) {
            if (value == '') {
                value = '0';
                scope.row[scope.column] = value;
            }
        }
        scope.valueChangedDateTime = function(row, column, value) {
            //console.log('valueChangedDateTime: ',value);     
            var date = new Date(value);
            /*var month = (date.getMonth() + 1);
            month = month < 10 ? "0"+month : month;
            var str = date.getFullYear() + '-' + month + '-' + date.getDate();*/
            var str = date.toISOString();
            //console.log('valueChangedDateTime str: ',str);
            scope.getUpdatedRows({
                obj: scope.objectMetadata,
                row: row,
                column: column,
                value: str
            });
        };

        scope.valueChangedDate = function(row, column, value) {
            //console.log('valueChangedDate: ',value);     
            var date = new Date(value);
            var month = (date.getMonth() + 1);
            month = month < 10 ? "0" + month : month;
            var str = date.getFullYear() + '-' + month + '-' + date.getDate();
            //console.log('valueChangedDate str: ',str);
            scope.getUpdatedRows({
                obj: scope.objectMetadata,
                row: row,
                column: column,
                value: str
            });
        };
        scope.valueChanged = function(row, column, value) {

            //console.log('value---',value);

            var newValue = value;
            if (scope.fieldMetadata.Type == 'CURRENCY' || scope.fieldMetadata.Type == 'DOUBLE') {
                newValue = parseFloat(value);
                //scope.row[scope.column] = newValue;
            }
            scope.getUpdatedRows({
                obj: scope.objectMetadata,
                row: row,
                column: column,
                value: newValue
            });
        };
        scope.toUTCDate = function(date) {
            var _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
            return _utc;
        };
        scope.getDateTime = function(value) {
            var time = undefined;
			var off = flexTableCtrlTimeOffset ;
            if (value != undefined) {
				var localOffset = new Date().getTimezoneOffset();
				if(off == undefined){
					off =0;
				}
				var datevalue = value + off + (localOffset*60000);
                var date = new Date(datevalue);
                date.toString("MM/dd/yyyy h:mm a")         
            }
           return date;
          
           // return time;
        };
        scope.getDate = function(value) {
            var time = undefined;
            if (value != undefined) {
                return scope.toUTCDate(new Date(value));
            }
            return time;
        };
        scope.showTooltip = function(parentId, rowId, fieldName, recordId) {
            //console.log('parentId ',parentId);
            //console.log('rowId ',rowId); 
            //console.log('fieldName ',fieldName);
            //console.log('recordId ',recordId);
            var thisVal = escape(parentId) + rowId + fieldName + recordId;
            //console.log('thisVal ',thisVal);
            if (parentId != null || parentId != undefined || parentId != '') {
                //console.log("Inside tooltipster");
                j$('#' + thisVal).tooltipster({
                    theme: 'tooltipster-shadow',
                    content: 'Loading...',
                    updateAnimation: false,
                    contentAsHTML: true,
                    interactive: true,
                    minWidth: 100,
                    position: 'right',
                    //   autoClose:false,                        
                    functionBefore: function(origin, fetchLayout) {
                        fetchLayout();
                        Visualforce.remoting.Manager.invokeAction(
                            _RemotingFlexGridActions.fetchLayout, parentId,
                            function(result, event) {
                                //console.log('event '+event);
                                //console.log('result '+result);
                                if (event.status) {
                                    if (!jQuery.isEmptyObject(result)) {
                                        tooltipContent =  '<div class="tooltipWrapper" >';
                                        tooltipContent = scope.getMiniLayoutContent(result, origin);
                                        tooltipContent += '</div>';
                                        origin.tooltipster('content', tooltipContent);
                                    } else {
                                        j$('#' + thisVal.id).tooltipster('hide');
                                    }
                                }
                            });
                    }
                });
                j$('#' + thisVal).tooltipster('show');
            }
        };
        scope.hideTooltip = function(parentId, rowId, fieldName, recordId) {
			var thisVal = escape(parentId) + rowId + fieldName + recordId;
            j$('#' + thisVal).tooltipster('hide');
        }
        scope.getMiniLayoutContent = function(result, origin) {
            var tooltip = tooltipContent;
            var tab = result.Tab;
            var record = result.Record;
            if (tab != null) {
                j$.each(result.Tab, function(i, tabVal) {
                    j$.each(tabVal.pageBlocks, function(j, pageBlockVal) {
                        tooltip += '<p class="tooltip-title">' + record['Name'] + '</p>';
                        tooltip += '<div id="TooltipBody" class="panel-body">';
                        tooltip += '<form class="form-horizontal" role="form">'
                        j$.each(pageBlockVal.fields, function(k, field) {
                            if (field.hideField != 'true') {
                                tooltip += '<div class="form-group border-ext ">';
                                tooltip += ' <div class="row">';
                                tooltip += ' <div class="col-md-4 col-xs-4 col-sm-4">';
                                tooltip += field.fieldLabel;
                                tooltip += '</div>';
                                var fieldVal = j$('<span/>').html(encodeURI(record[field.fieldAPIName])).text();
                                if (field.dataType == 'CURRENCY') {
                                    fieldVal = '$' + fieldVal;
                                }
                                tooltip += ' <div class="col-md-8 col-xs-8 col-sm-8" style="word-wrap:break-word; font-weight: bold;">';
                                tooltip += decodeURI(fieldVal);
                                tooltip += '</div>';
                                tooltip += '</div>';
                                tooltip += '</div>';
                                tooltip += '<br/>';
                            }
                        })
                    })
                })
                tooltip += '</form>';
                tooltip += '</div>';
            } else {

                tooltip += '<p class="tooltip-title">' + record['Name'] + '</p>';
                tooltip += '<div id="TooltipBody" class="panel-body">';
                tooltip += '<form class="form-horizontal" role="form">';
                tooltip += '<div class="form-group border-ext ">';
                tooltip += ' <div class="row">';
                tooltip += ' <div class="col-md-4 col-xs-4 col-sm-4">';
                tooltip += 'Name';
                tooltip += '</div>';
                tooltip += ' <div class="col-md-8 col-xs-8 col-sm-8" style="word-wrap:break-word; font-weight: bold;">';
                tooltip += record['Name'];
                tooltip += '</div>';
                tooltip += '</div>';
                tooltip += '</div>';
                tooltip += '</form>';
                tooltip += '</div>';
            }
            return tooltip;
        };
    }

    return {
        restrict: "E",
        link: linker,
        scope: {
            fieldMetadata: '=',
            objectMetadata: '=',
            rowValue: '=',
            columnValue: '=',
            tableMetadata: '=',
            refUrl: '&',
            mode: '@',
            getQueryData: '&',
            getUpdatedRows: '&',
            dependentColumnsMap: '=',
            timeOffset: '='
        }
    };
});
inlineEditGrid.directive("action", function($compile, $parse) {
    var getTemplate = function(actions, config, mode) {
        var template = '';
        if (config.ActionDisplayType == 'Menu') {

        } else {
            template = '<span ng-repeat="item in actions">' +
                '<span ng-if="(item.Location == \'Row\') && (mode==\'view\' || (item.DataTableActionObj[tableMetaData.NamespacePrefix+\'StandardAction__c\'] != \'Delete\' && mode==\'edit\'))">' +
                '<span class="separator" ng-if="(!($index == 0)) && item.Icon == \'null\'">|</span> ' +
                '<a href="#!" tabIndex="0" class="tableLinks" title="{{item.DataTableActionObj.Name}}" ng-click="actionHandler(item,row);">' +
                '<span ng-if="item.Icon != \'null\'" bindhtml="angular" field-content="item.Icon"></span>' +
                '<span ng-if="item.Icon == \'null\'">{{item.DataTableActionObj.Name}}</span>' +
                '<span class="hidden" ng-bind="item.DataTableActionObj.Name"></span>' +
                '<span class="hidden508" ng-bind="item.DataTableActionObj.Name"></span>' +
                '</a>' +
                '</span>' +
                '</span>' +
                '<span ng-if="item.Location == \'Top\'">' +
                '<button title="{{item.DataTableActionObj.Name}}" type="button" class="customBtn" tabIndex="0">{{item.DataTableActionObj.Name}}</button>' +
                '</span>' +
                '</span>';
        }
        return template;

    }
    var linker = function(scope, element, attrs) {
        if (scope.row.Id != undefined) {
            scope.actionInfo = scope.tableMetaData.ActionInfo;
            scope.configInfo = scope.tableMetaData.ConfigInfo;
            scope.actions = {};
            for (index in scope.actionInfo) {
                if (((scope.actionInfo[index].HideDecisionField == 'null' && scope.actionInfo[index].hideAction == 'true') ||
                        (scope.row[scope.actionInfo[index].HideDecisionField] == true && scope.actionInfo[index].hideAction == 'true') ||
                        (scope.row[scope.actionInfo[index].HideDecisionField] == true && scope.actionInfo[index].hideAction == 'null')) != true) {
                    scope.actions[index] = scope.actionInfo[index];
                }
            }
            scope.actionHandler = function(actionItem, row) {
                //console.log('actionHandler Clicked!');
                //console.log('scope.tableMetaData: ', scope.tableMetaData);
                //console.log('actionItem: ', actionItem);
                //console.log('row: ', row);
                //console.log('action===', scope.action);
                //scope.action.actionHandler(scope.tableMetaData,actionItem,row,index);
                if (scope.action != undefined && scope.action.actionHandler != undefined) {
                    scope.action.actionHandler(scope.tableMetaData, actionItem, row, index);
                } else {
                scope.actionConfigHandler({
                    tableMetaData: scope.tableMetaData,
                    item: actionItem,
                    row: row,
                    index: index
                });
                }
                //scope.actionConfigHandler({tableMetaData:scope.tableMetaData,actionItem:actionItem,row:row,index:index});//old
                //console.log('scope.actionConfigHandler: ', scope.actionConfigHandler);
            };
            element.html(getTemplate(scope.actions, scope.configInfo, scope.mode)).show();
            $compile(element.contents())(scope);
        }
    }
    return {
        restrict: 'E',
        scope: {
            tableMetaData: '=',
            row: '=',
            action: '=',
            actionConfigHandler: '&',
			mode:'@'
        },
        link: linker
    };
});
inlineEditGrid.directive("checkbox", function($compile, $parse) {
    var getTemplate = function(row, selectedRecords, tableMetaData) {
        return '<input type="checkbox" ng-init="selectionChkBox=false" ng-checked="selectionChkBox = selectedRecords[row.Id][\'IsSelected\']" ng-model="selectionChkBox"  ng-click="actionHandler(selectedRecords, row, !selectionChkBox, tableMetaData)" aria-label="Select"/>';
    }
    var linker = function(scope, element, attrs) {
        scope.actionHandler = function(selectedRecords, row, selectionChkBox, tableMetaData) {
            scope.selectRecord(selectedRecords, row.Id, selectionChkBox, tableMetaData);
        };
        element.html(getTemplate(scope.row, scope.selectedRecords, scope.tableMetaData)).show();
        $compile(element.contents())(scope);
    }
    return {
        restrict: 'E',
        scope: {
            row: '=',
            selectedRecords: '=',
            selectRecord: '&',
            tableMetaData: '='
        },
        link: linker
    };
});

inlineEditGrid.controller('budgetgridController', function($q, $scope, $timeout, $window, $sce) {
    $scope.getReferenceURL = function(row, column) {
        $scope.refField = column.split(".");
        if ($scope.refField[0] != undefined && row[$scope.refField[0]] != undefined) {
            $scope.retFieldValue = row[$scope.refField[0]].Id;
            if ($scope.retFieldValue.substr(0, 3) == '005') {
                return '/apex/' + $scope.parentTableMetadata.NamespacePrefix + 'ProfileRedirect?id=' + $scope.retFieldValue;
            } else {
                return '/' + $scope.retFieldValue;
            }
        }
    };
});

inlineEditGrid.directive("budgetgrid", function($compile, $parse) {
    var getTemplate = function(budgetGridData, rowGrouping, columnGrouping, parentTableMetadata, iteratorColumns, summarizableField, hiddenColumn) {
        var template = '';
        template = '<table width="100%" cellpadding="0" cellspacing="0" border="0" class="tableClass table" style="table-layout: fixed; width= 100%">' +
            '<tbody  class="tbody-no-border-top budgetBody">' +
            '<tr class="flexTableHeader">' +
            '<th ng-repeat="columnInfo in rowGrouping"  class="table-bordered budgetTh" ng-hide="hiddenColumns[columnInfo.field]" >' +
            '<div class="tableColumnHeader">' +
            '<span class="hidden508" ng-if="parentTableMetadata.FieldMetadata[columnInfo.column].Label == undefined"> Empty Column </span>' +
            '<span ng-if="parentTableMetadata.FieldMetadata[columnInfo.column].Label != undefined" ng-bind="parentTableMetadata.FieldMetadata[columnInfo.column].Label" />' +
            '</div>' +
            '</th>' +
            '<th ng-repeat="columnInfo in columnGrouping" class="table-bordered budgetTh" >' +
            '<div class="tableColumnHeader">' +
            '<field mode="view" table-metadata="parentTableMetadata" object-metadata="parentTableMetadata.ObjectMetaData" field-metadata="parentTableMetadata.FieldMetadata[iteratorColumns[columnInfo].column]" row-value="iteratorColumns[columnInfo].record" column-value="iteratorColumns[columnInfo].column" ref-url="getReferenceURL(iteratorColumns[columnInfo].record,iteratorColumns[columnInfo].column)" get-query-data="getLookupData(fieldName,sobjName,query,filterClause)" get-updated-rows="updatedRowsHandler(obj,iteratorColumns[columnInfo].record,iteratorColumns[columnInfo].column,value)"></field>' +
            '</div>' +
            '</th>' +
            '<th align="right" class="table-bordered budgetTh" >' +
            '<div class="tableColumnHeader">' +
            'Total' +
            '</div>' +
            '</th>' +
            '</tr>' +

            '<tr ng-if="budgetGridData.length > 3"  ng-class="{totalRow: row.Type == \'Total\'}" class="table-bordered ext-budget-hover" ng-repeat="row in budgetGridData" >' +
            '<td rowSpan="{{row.RowSpan[columnInfo.field]}}" ng-if="row.RowSpan[columnInfo.field] > 0 || row.Type == \'Total\'" class="fieldTd tdContent" ng-repeat="columnInfo in rowGrouping" ng-hide="getHide(row,columnInfo.field,hiddenColumn)">' +
            '<span class="gridEntryTd" ng-if="row.Type == \'Actual\'">' +
            '<field mode="view" table-metadata="parentTableMetadata" object-metadata="parentTableMetadata.ObjectMetaData" field-metadata="parentTableMetadata.FieldMetadata[columnInfo.column]" row-value="row[columnInfo.field]" column-value="columnInfo.column" ref-url="getReferenceURL(row[columnInfo.field],columnInfo.column)" get-query-data="getLookupData(fieldName,sobjName,query,filterClause)" get-updated-rows="updatedRowsHandler(obj,row[columnInfo.field],columnInfo.column,value)"></field>' +
            '</span>' +
            '<span ng-if="row.Type == \'Total\' && $index == 0">' +
            '{{row.Label}}' +
            '</span>' +
            '</td>' +
            '<td align="right" class="fieldTd tdContent" ng-repeat="columnInfo in columnGrouping" ng-hide="hiddenColumns[columnInfo.field]">' +
            '<span class="gridEntryTd" ng-if="row.Type == \'Actual\'">' +
            '<action mode="view" class="pull-left" row="row[columnInfo]" table-meta-data="parentTableMetadata" action-config-handler="actionHandler(tableMetaData,item,row)"/>' +
            '<field mode="{{getMode(row[columnInfo],parentTableMetadata)}}" table-metadata="parentTableMetadata" object-metadata="parentTableMetadata.ObjectMetaData" field-metadata="parentTableMetadata.FieldMetadata[summarizableField]" row-value="row[columnInfo]" column-value="summarizableField" ref-url="getReferenceURL(row[columnInfo],summarizableField)" get-query-data="getLookupData(fieldName,sobjName,query,filterClause)" get-updated-rows="updatedRowsHandler(obj,row[columnInfo],summarizableField,value)"></field>' +
            '</span>' +
            '<span ng-if="row.Type == \'Total\'">' +
            '${{getTotal(row,columnInfo,budgetGridData)}}' +
            '</span>' +
            '</td>' +
            '<td class="totalColumn" align="right" class="fieldTd tdContent" ng-hide="hiddenColumns[columnInfo.field]">' +
            '<span ng-if="row.Type == \'Actual\'">' +
            '${{getRowTotalForActual(row)}}' +
            '</span>' +
            '<span ng-if="row.Type == \'Total\'">' +
            '${{getRowTotalForTotal(row)}}' +
            '</span>' +
            '</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>' +
            '<div ng-if="budgetGridData.length<=3" style="text-align:center">' +
            'No Records Found' +
            '</div>';
        return template;
    }

    var linker = function(scope, element, attrs) {
        scope.getHide = function(row, col, hiddenColumn) {
            if(hiddenColumn != undefined){
            row = row[col];
            if (row != undefined) {
                var conditionsArray = hiddenColumn;
                var isHide = false;
                if (conditionsArray != undefined) {
                    for (var i = 0; i < conditionsArray.length; i++) {
                        if (conditionsArray[i].operator == '=') {
                            if (row[conditionsArray[i].field] == conditionsArray[i].value && col == hiddenColumn[i].column) {
                                isHide = true;
                                if (scope.hiddenColumns == undefined) {
                                    scope.hiddenColumns = {};
                                }
                                scope.hiddenColumns[col] = true;
                                break;
                            }
                        }
                    }
                    if (isHide == false) {
                        return 'false';
                    }
                    return 'true';
                }
            } else {
                if (scope.hiddenColumns != undefined && scope.hiddenColumns[col] == true) {
                    return 'true';
                }
            }
            }
            return 'false';
        }

        scope.getMode = function(row, parentTableMetadata) {
            var conditionsArray = parentTableMetadata.DataTableInfoMap.BudgetGridEditJSON;
            var isEditMode = false;
            if (conditionsArray != undefined) {
                for (var i = 0; i < conditionsArray.length; i++) {
                    if (row[conditionsArray[i].field] == conditionsArray[i].value) {
                        isEditMode = true;
                        // scope.budgetGridOptions.editMode =  true;  
                        scope.budgetGridOptions.editMode = false;
                        break;
                    }
                }
                if (isEditMode == false) {
                    return 'view';
                }
                return 'edit';
            }
            return 'view';
        }
        scope.getRowTotalForActual = function(row) {
            var total = 0;
            for (var i = 0; i < scope.columnGrouping.length; i++) {
                var record = row[scope.columnGrouping[i]];
                // to fix $null in total at row level				
                if (record[scope.summarizableField] != '') {
                    total += parseFloat(record[scope.summarizableField]) || 0;
                }
            }
            total = total.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            return total;
        }
        scope.getRowTotalForTotal = function(row) {
            var total = 0;
            for (var i = 0; i < scope.columnGrouping.length; i++) {
                var record = row[scope.columnGrouping[i]];
                //total += record['Total'];  
                var mystring = record['Total'];
                mystring = mystring.replace(/,/g, "");
                total += parseFloat(mystring) || 0;
            }
            total = total.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            return total;
        }

        scope.getTotal = function(row, columnInfo, budgetGridData) {
            var total = 0;
            for (var j = 0, lenth = row.RowIndexArray.length; j < lenth; j++) {
                var index = row.RowIndexArray[j];
                var gridRecord = budgetGridData[index];
                if (gridRecord.Type == 'Actual') {
                    if (gridRecord[columnInfo][scope.summarizableField] != '') {
                        //new to prevent $null at column level						
                        var toSum = parseFloat(gridRecord[columnInfo][scope.summarizableField]) || 0;
                        total += toSum;
                    }
                }
                if (gridRecord.Type == 'Total') {
                    subTotal = gridRecord[columnInfo]['Total'];
                    subTotal = subTotal.replace(/,/g, "");
                    var toSum = parseFloat(subTotal);
                    total += toSum;
                }
            }
            if (row[columnInfo] == undefined) {
                row[columnInfo] = {};
            }
            //  total = total.toFixed(2);		  
            total = total.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            row[columnInfo]['Total'] = total;
            return row[columnInfo]['Total'];
        }
        scope.actionHandler = function(tableMetaData, item, row) {
            scope.actionConfigHandler({
                tableMetaData: tableMetaData,
                item: item,
                row: row
            });
        }
        element.html(getTemplate(scope.budgetGridData, scope.rowGrouping, scope.columnGrouping, scope.parentTableMetadata, scope.iteratorColumns, scope.summarizableField, scope.hiddenColumn, scope.budgetGridOptions)).show();
        $compile(element.contents())(scope);
    }
    return {
        restrict: 'E',
        controller: 'budgetgridController',
        scope: {
            budgetGridData: '=',
            budgetGridOptions: '=',
            rowGrouping: '=',
            columnGrouping: '=',
            hiddenColumn: '=',
            parentTableMetadata: '=',
            iteratorColumns: '=',
            summarizableField: '=',
            refUrl: '&',
            actionConfigHandler: '&'
        },
        link: linker
    };
});

inlineEditGrid.controller('N2GController', ['$scope', '$attrs', '$timeout', '$window', function($scope, $attrs, $timeout, $window) {

    $scope.getReferenceURL = function(row, column) {
        $scope.refField = column.split(".");
        if ($scope.refField[0] != undefined && row[$scope.refField[0]] != undefined) {
            $scope.retFieldValue = row[$scope.refField[0]].Id;
            if ($scope.retFieldValue.substr(0, 3) == '005') {
                return '/apex/' + $scope.parentTableMetadata.NamespacePrefix + 'ProfileRedirect?id=' + $scope.retFieldValue;
            } else {
                return '/' + $scope.retFieldValue;
            }
        }
    };
    $scope.getNextPageRecords = function(tableMetadata) {
            showLoadingPopUp();
            $scope.pageNumber = $scope.pageNumber + 1;
            $scope.getTableData(tableMetadata);
        }
        //getPreviousPageRecords(tableMetadata)
    $scope.getPreviousPageRecords = function(tableMetadata) {
        showLoadingPopUp();
        $scope.pageNumber = $scope.pageNumber - 1;
        $scope.getTableData(tableMetadata);
    }
    $scope.getTableData = function(tableMetadata) {
        var tableData;
        var dataTableInfoMap = tableMetadata.DataTableInfoMap;
        if (undefined == dataTableInfoMap.SortColumn) {
            dataTableInfoMap.SortColumn = "";
        }
        if (undefined == dataTableInfoMap.OrderBy) {
            dataTableInfoMap.OrderBy = "";
        }
        if (undefined == dataTableInfoMap.SortDirection) {
            dataTableInfoMap.SortDirection = "";
        }
        if(dataTableInfoMap.HideDecisionFields== undefined){
        	dataTableInfoMap.HideDecisionFields= "";
        }
        var configFilterClause = dataTableInfoMap.ConfigFilterClause;
        if($scope.quickSearchFilterClause != undefined && $scope.quickSearchFilterClause != ''){
        	configFilterClause += ' AND (' + $scope.quickSearchFilterClause + ')';
        }

        var parentId = escape($scope.parentId);
        var configFilterClauseUpdated = configFilterClause.replace('parentId', parentId);
        var parentObjectname = $scope.tableMetadata.DataTableInfoMap == undefined ? null : $scope.tableMetadata.DataTableInfoMap.SObjectName == undefined ? null : $scope.tableMetadata.DataTableInfoMap.SObjectName;
        var childObjectname = $scope.childMetadata == undefined ? null : $scope.childMetadata.DataTableInfoMap == undefined ? null : $scope.childMetadata.DataTableInfoMap.SObjectName == undefined ? null : $scope.childMetadata.DataTableInfoMap.SObjectName;
        var cFilterClause = $scope.childMetadata == undefined ? null : $scope.childMetadata.DataTableInfoMap == undefined ? null : $scope.childMetadata.DataTableInfoMap.ConfigFilterClause == undefined ? null : $scope.childMetadata.DataTableInfoMap.ConfigFilterClause;
        var parentLookupField = $scope.childMetadata == undefined ? null : $scope.childMetadata.ConfigInfo == undefined ? null : $scope.childMetadata.ConfigInfo.ParentTargetLookupField == undefined ? null : $scope.childMetadata.ConfigInfo.ParentTargetLookupField;
        //console.log('dataTableInfoMap 1:', dataTableInfoMap);
        Visualforce.remoting.Manager.invokeAction(
            _RemotingFlexGridActions.RefreshN2G,
            dataTableInfoMap.ColumnString, null, dataTableInfoMap.HideDecisionFields, dataTableInfoMap.SObjectName, configFilterClauseUpdated,
            dataTableInfoMap.OrderBy, dataTableInfoMap.SortDirection, $scope.pageNumber, $scope.pageSize, false,
            parentObjectname, childObjectname, cFilterClause, parentLookupField,
            function(n2gResult, event) {
                if (event.status) {
                    $scope.$apply(function() {
                        $scope.recordsList = n2gResult.RecordsList;
                        $scope.pageNumber = n2gResult.PageNumber;
                        $scope.pageSize = n2gResult.PageSize;
                        $scope.totalPages = n2gResult.TotalPages;
                        $scope.resultSize = n2gResult.ResultSize;
                        $scope.hasPrevious = n2gResult.HasPrevious;
                        $scope.hasNext = n2gResult.HasNext;
                        $scope.wait = false;
                        $scope.recCount = n2gResult.recordCountofGrid;
                    });
                } else {
                    //console.log('executed unsuccessfully',flexTableResult);          
                }
                hideLoadingPopUp();
            }, {
                buffer: false,
                escape: false,
                timeout: 30000
            }
        );

    }

	$scope.n2gInlineSearch = function(searchTerm, event, gridType) { 		
    	
        $scope.QuickSearchReportTextGrid = searchTerm;
        if (event == null || event.keyCode == 13) {     
            if (event != null && event.keyCode == 13) {
                event.preventDefault();
            }
            showLoadingPopUp();			
			$scope.generateFilterString(searchTerm);
			$scope.getTableData($scope.tableMetadata);
        }
    };
    
    $scope.generateFilterString = function(searchTerm){
    	$scope.generateQuickSearchFilter(searchTerm);
    };
    
    $scope.generateQuickSearchFilter = function(searchTerm){
    	//console.log('==FlexTableMetaData====>',$scope.tableMetadata);
    	//console.log('searchTerm in generateQuickSearchFilter ',searchTerm);
    	$scope.columns = [];   
    	if( searchTerm != '' && searchTerm != undefined ) {
			searchTerm = searchTerm.replace("*", "%"); //False +ve for incomplete - sanitization - as we are not using this for sanitization
			var filterClause='';
			var finalFilterClause = '';	
			var fields = $scope.tableMetadata.FieldMetadata;	
			//console.log('fields===>',fields);
			for( var i =0; i < $scope.tableMetadata.ColumnsNameList.length; i++) {	
	    		$scope.columns[$scope.tableMetadata.FieldMetadata];	
				if($scope.tableMetadata.FieldMetadata.isFilterable == false) {
					break;
				}
				
				if(fields[$scope.tableMetadata.ColumnsNameList[i]].Type == 'TEXTAREA' || fields[$scope.tableMetadata.ColumnsNameList[i]].Type == 'REFERENCE' || fields[$scope.tableMetadata.ColumnsNameList[i]].Type == 'PICKLIST' || fields[$scope.tableMetadata.ColumnsNameList[i]].Type == 'STRING' || fields[$scope.tableMetadata.ColumnsNameList[i]].Type == 'COMBOBOX' || fields[$scope.tableMetadata.ColumnsNameList[i]].Type == 'EMAIL' || fields[$scope.tableMetadata.ColumnsNameList[i]].Type == 'PHONE' || fields[$scope.tableMetadata.ColumnsNameList[i]].Type == 'URL') {					
					filterClause =$scope.filterStringRecords($scope.tableMetadata.ColumnsNameList[i], $scope.tableMetadata.ColumnsNameList[i], 'Contains', searchTerm, true);					
				}else if(fields[$scope.tableMetadata.ColumnsNameList[i]].Type == 'DATE' || fields[$scope.tableMetadata.ColumnsNameList[i]].Type == 'DATETIME' ) {				
					var numbers = /^[0-9]+$/;
					var dateRE = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
					var dateREWithDateAndMonth = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])$/;
					if(searchTerm.match(numbers)) {
						filterClause =  $scope.getDateQueryForQuickSearch($scope.tableMetadata.ColumnsNameList[i], searchTerm);
					} else if(searchTerm.match(dateRE)) {
						filterClause =  $scope.getFullDateQueryForQuickSearch($scope.tableMetadata.ColumnsNameList[i], searchTerm);
					} else if(searchTerm.match( dateREWithDateAndMonth )) {
						filterClause =  $scope.getMonthAndDayDateQueryForQuickSearch($scope.tableMetadata.ColumnsNameList[i], searchTerm);
					}									
				}
				else if(fields[$scope.tableMetadata.ColumnsNameList[i]].Type == 'CURRENCY' || fields[$scope.tableMetadata.ColumnsNameList[i]].Type == 'DOUBLE') {
					var numbers = /^[0-9]+$/;
					if(searchTerm.match(numbers)) {
						//console.log('column name currency nd double-->',$scope.tableMetadata.ColumnsNameList[i]);
						filterClause =  $scope.getNumberQueryForQuickSearch($scope.tableMetadata.ColumnsNameList[i], searchTerm);
					}
				}				
				if( filterClause != '' ){
					finalFilterClause += filterClause + ' OR ';
				}				
			}
			
			filterClause = finalFilterClause;			
			if( filterClause != '' ) {
				if( $scope.quickSearchFilterClause != null && $scope.quickSearchFilterClause != '' ) {
					$scope.quickSearchFilterClause = '( ' + $scope.quickSearchFilterClause + ' ) and ( ' + filterClause + ' )';
				 } else {
				 	$scope.quickSearchFilterClause = '' + filterClause;
				 }
				filterClause = filterClause.substring(0,filterClause.length-4)
				//console.log('===>  filterclause '+filterClause);
				$scope.quickSearchFilterClause = '' + filterClause;
			}
				$scope.isSOSL = false;
			}else{
				$scope.quickSearchFilterClause = '';
			}
			//console.log('---$scope.quickSearchFilterClause----',$scope.quickSearchFilterClause);		
    };
    
   $scope.getDateQueryForQuickSearch = function(fieldName, searchTerm){
   		//console.log('searchTerm of getDateQueryForQuickSearch ==>',searchTerm);
		return 'CALENDAR_MONTH('+fieldName+')='+searchTerm+' OR CALENDAR_YEAR('+fieldName+')='+searchTerm+' OR DAY_IN_MONTH('+fieldName+')='+searchTerm+' ';
	}
	$scope.getFullDateQueryForQuickSearch = function(fieldName, searchTerm)
	{
		//console.log('searchTerm of getFullDateQueryForQuickSearch ==>',searchTerm);
		var searchSplit = searchTerm.split("\/");
		if( $scope.userOffset == undefined ) {
			$scope.userOffset = '0:0';
		}		
		var date = new Date();		
		date.setMonth(searchSplit[0]-1);
		date.setDate(searchSplit[1]);
		date.setYear(searchSplit[2]);
		date.setHours(0);
		date.setMinutes(0);			
		userTimeZone = $scope.tableMetadata.Offset;
		//console.log('userTimeZone==>',userTimeZone);
		var date1 = new Date(date.getTime() - userTimeZone );
		//console.log('date1==>',date1);
		return '( CALENDAR_MONTH('+fieldName+')='+( date1.getMonth() + 1) +' OR CALENDAR_YEAR('+fieldName+')='+date1.getFullYear()+' OR DAY_IN_MONTH('+fieldName+')='+date1.getDate()+') ';
	}
	
	$scope.getMonthAndDayDateQueryForQuickSearch = function(fieldName, searchTerm)
	{		
		var searchSplit = searchTerm.split("\/");
		//console.log('searchSplit===>',searchSplit);
		return '( CALENDAR_MONTH('+fieldName+')='+searchSplit[0]+' OR DAY_IN_MONTH('+fieldName+')='+searchSplit[1]+') ';
	}
	
	$scope.getNumberQueryForQuickSearch = function(fieldName, searchTerm){
		return fieldName + '='+searchTerm;
	}

	$scope.filterStringRecords = function(fieldName,label,criteria,searchTerm,isQuickSearch){
		var conditionString = '';
		if(fieldName != '' && criteria != '' && searchTerm != undefined && searchTerm != '' && criteria != undefined){
			conditionString = (criteria == 'Contains') ? (fieldName + ' LIKE \'%' +  searchTerm + '%\'') :
								(criteria == 'Ends with') ? (fieldName+ ' LIKE \'%' +  searchTerm + '\'') :
								(criteria == 'Starts with') ? (fieldName+ ' LIKE \'' +  searchTerm + '%\'') :
								(criteria == 'Equals') ? (fieldName+ ' = \'' +  searchTerm + '\'') :
								(criteria == 'Not equals') ? (fieldName+ ' != \'' +  searchTerm + '\'') :
								(fieldName+ ' = \'' +  searchTerm + '\'');
			if(!isQuickSearch) {
				$scope.filterMap[fieldName] = conditionString;
				$scope.filterDisplayMapOnFilter[fieldName] = {"label":label,"criteria":criteria + ' ' +searchTerm,"val1":criteria,"val2":searchTerm };
			}
		} else if(!isQuickSearch && searchTerm == '') {
			delete $scope.filterMap[fieldName];
			delete $scope.filterDisplayMapOnFilter[fieldName];
		}
		//console.log('conditionString-->',conditionString);
		return conditionString;
	};
	
    
    $scope.confirmAndDelete = function(tableMetaData, recordId) {
        var deleteMessage = deleteConfirmLabel;
        bootbox.dialog({
            message: deleteMessage,
            title: "Confirm",
            onEscape: function() {},
            backdrop: false,
            closeButton: true,
            animate: true,
            buttons: {
                No: {
                    label: "No",
                    className: "customBtn btn-ext",
                    callback: function() {}
                },
                "Yes": {
                    label: "Yes",
                    className: "customBtn btn-ext",
                    callback: function(result) {
                        if (result) {
                            //showLoadingPopUp();
                            $scope.deleteRecord(tableMetaData, recordId);
                        }
                    }
                },
            }
        });
    };

    $scope.deleteRecord = function(tableMetaData, recordId) {
        if (tableMetaData.ObjectMetaData.IsDeletable == 'true') {
            $scope.messages = [];
            Visualforce.remoting.Manager.invokeAction(
                _RemotingFlexGridActions.DeleteRecord,
                tableMetaData.ObjectMetaData.APIName, recordId,
                function(deleteResult, event) {
                    if (event.status) {
                        $scope.$apply(function() {
                            var deleteMessage;
                            if (deleteResult.Success) {
                                deleteMessage = deleteResult.Message;;
                                $scope.getTableData(tableMetaData);
                            } else {
                                var result = deleteResult.Message;
                                var deleteMessageArray = result.split(':');
                                var deleteMessage = deleteMessageArray[2];
                                var deleteErrorMessageArray = deleteMessage.split(',');
                                deleteMessage = deleteErrorMessageArray[1];
                            }
                            hideLoadingPopUp();
                            bootbox.alert({
                                size: 'small',
                                backdrop: false,
                                message: deleteMessage,
                                buttons: {
                                    ok: {
                                        label: "Ok",
                                        className: "customBtn btn-ext",
                                    }
                                }
                            });
                        });
                    }
                }, {
                    buffer: false,
                    escape: false,
                    timeout: 30000
                }
            );
        }

    }
    $scope.openInlineEdit = function(tableMetaData, row) {
        $scope.CounterForHide = $scope.CounterForHide + 1;
        //console.log('$scope.CounterForHide-----: ', $scope.CounterForHide);
        //console.log('tableMetaData-----: ', tableMetaData);
        //console.log('row-----: ', row);
        if ($scope.modeToggleMap[tableMetaData.ObjectMetaData.APIName] == undefined) {
            $scope.modeToggleMap[tableMetaData.ObjectMetaData.APIName] = {};
        }
        $scope.modeToggleMap[tableMetaData.ObjectMetaData.APIName][row.Id] = true;
        //console.log('$scope.modeToggleMap-----: ', $scope.modeToggleMap);
    };
    $scope.action = {};

    $scope.action.actionHandler = function(tableMetaData, actionItem, row, index) {
        //console.log('main action handler called tableMetaData: ', tableMetaData);
        //console.log('Inside N2GController : ', $scope.flexGrid_tableId);
        var winURL = '';
        if (actionItem.ActionClass != 'null') {
            if (actionItem.Location == 'Top') {
                if (tableMetaData.ConfigInfo.EnableRecordSelection == 'true' && $scope.selectedRecords != undefined && $scope.selectedRecords != '') {
                    $scope.executeApexClass(actionItem, $scope.selectedRecords, tableMetaData);
                } else if (tableMetaData.ConfigInfo.EnableRecordSelection == 'true' && $scope.selectedRecords == '') {
                    $scope.messages.push({
                        type: 'info',
                        msg: 'Please select atleast one record.'
                    });
                } else {
                    $scope.selectedRecords = {};
                    $scope.executeApexClass(actionItem, $scope.selectedRecords, tableMetaData);
                }
            } else if (actionItem.Location == 'Row') {
                $scope.selectedRecord = {};
                if (row.Id != undefined) {
                    $scope.selectedRecord[row.Id] = true;
                }
                $scope.messages = [];
                showLoadingPopUp();
                $scope.executeApexClass(actionItem, $scope.selectedRecord, tableMetaData);
            }
        } else if (actionItem.ActionBehavior == 'Open in inline mode') {
            $scope.openInlineEdit(tableMetaData, row);
        } else if (actionItem.ActionURL != 'null' && actionItem.ActionURL != undefined) {
            var childRelationshipField = tableMetaData.ChildRelationshipField;
            winURL = actionItem.ActionURL;
            var regexForFlexGrid = /\{\!(\w*)\}/;
            var matchesForFlexGrid = regexForFlexGrid.exec(winURL);
            if (matchesForFlexGrid) {
                winURL = winURL.replace(regexForFlexGrid, row.Id);
            }
            if (row != undefined) {
                var objName = tableMetaData.ObjectMetaData.APIName;
                var mergeField = '{' + '!' + objName + '.id}';
                winURL = winURL.replace(new RegExp('(' + mergeField + ')', 'gi'), row.Id); //False +ve for non literal regex used for sanitization, as we are not using for sanitization purpose
            }
            if (tableMetaData.ConfigInfo.EnableRecordSelection == 'true') {
                var idsParam = '';
                if (winURL.indexOf('?') == -1) {
                    idsParam += '?';
                } else {
                    idsParam += '&';
                }
                idsParam += 'ids=';
                for (id in $scope.selectedRecords) {
                    if ($scope.selectedRecords[id] == true) {
                        idsParam += id + ',';
                    }
                }
                idsParam = idsParam.substring(0, idsParam.length - 1);
                winURL += idsParam;
            }
            //console.log('actionItem handleModalOPenCndition: ', actionItem);
            $scope.handleModalOpenCondition.handleOpenCondition(winURL, actionItem);
        }
        else if (winURL != '' && actionItem.StandardAction != 'Delete') {
            $scope.handleModalOpenCondition.handleOpenCondition(winURL, actionItem);
        } else if (actionItem.StandardAction == 'Delete') {
            if (row != null) {
                //  $scope.deleteRecord(tableMetaData,row.Id,index);   
                //  $scope.deleteRecord(tableMetaData,row.Id);    
                $scope.confirmAndDelete(tableMetaData, row.Id);
            }
        }
    }
    $scope.handleOpenCondition = function(winURL, actionItem) {
        winURL = decodeURIComponent(winURL);
        if (winURL.toLowerCase().indexOf("saveurl") == -1) {
            if (winURL.indexOf("?") == -1) {
                winURL = winURL + '?saveURL=' + encodeURIComponent($scope.flexGrid_CurrentPURL);
            } else {
                winURL = winURL + '&saveURL=' + encodeURIComponent($scope.flexGrid_CurrentPURL);
            }
        }

        if (winURL.indexOf('&retURL') != -1) {
            winURL = winURL.substring(0, winURL.indexOf('retURL'));
        }
        var ret = decodeURIComponent($scope.currentPageURL);
        if (ret.indexOf('&retURL') != -1 || ret.indexOf('?retURL') != -1) {
            ret = ret.substring(0, ret.indexOf('retURL') - 1);
        }
        winURL += '&retURL=' + encodeURIComponent(ret);

        if (actionItem.ActionBehavior == 'Open in same window') {
            $window.open(winURL, '_self');
        } else if (actionItem.ActionBehavior == 'Open in new window') {
            $window.open(winURL, '_blank');
        } else if (actionItem.ActionBehavior == 'Open in overlay') {
            $scope.windowURL = winURL;
            $scope.windowTitle = actionItem.DataTableActionObj.Name;
            if (actionItem.height != 'null' && actionItem.height != '') {
                $scope.windowHeight = actionItem.Height + 'px';
            } else {
                $scope.windowHeight = '200px';
            }
            if (actionItem.width != 'null' && actionItem.Width != '') {
                if((parseInt(actionItem.Width)) < 100) {
                	$scope.windowWidth  = (parseInt(actionItem.Width)).toString() + '%';
				} else {
					$scope.windowWidth  = (parseInt(actionItem.Width)).toString() +'px';
				}
                $scope.windowContentWidth = actionItem.Width + 'px';
            } else {
                $scope.windowWidth = '50%';
            }
            //console.log('parent child scope :', $scope.$parent.flexGrid_tableId);
            j$('#' + $scope.$parent.flexGrid_tableId + 'modalDiv').modal();
            lastFocus = document.activeElement;
            flexModalId = $scope.$parent.flexGrid_tableId;
        } else {
            $window.open(winURL, '_self');
        }
    };

}]);

inlineEditGrid.directive("n2g", function($compile, $parse) {

    var getTemplate = function(recordsList, tableMetadata, level, n2gData, childMetadata, wait, nextlevel) {
        //console.log('n2gData.ParentTableMetadata.ConfigInfo: ',tableMetadata);
        //var columnsNameList = scope.tableMetadata.ColumnsNameList;
        var template =

        	'<div ng-if="n2gData.ParentTableMetadata.ConfigInfo.EnableQuickSearch == \'true\'">' +
        	'<div ng-if="n2gData.ParentTableMetadata.ConfigInfo.QuickSearchBehaviour  == \'Inline\'" class="quick-search hidden-xs"  >'+
            '<div class="input-group add-on col-md-3 col-xs-6">'+
            '<label for="quickSearchTextGrid" class="hidden">Quick Search Text</label>'+
            '<input type="search" id="quickSearchTextGrid1" onkeypress="PreventEnter(event);" name="QuickSearchReportTextGrid" tabIndex="0" ng-model="QuickSearchReportTextGrid" style="z-index:0 !important;" ng-keyup="n2gInlineSearch(QuickSearchReportTextGrid, $event, flexGrid.GridType);" class="form-control quicksearch " placeholder="Quick Search" aria-label="Quick Search Field"/>'+
            '<div class="input-group-btn"  >'+
            '<a href="javascript:viod(0);" class="btn quickSearchBtn customBtn btn" ng-click="n2gInlineSearch(QuickSearchReportTextGrid, null,flexGrid.GridType);"><i class="fa fa-search"></i><span class="hidden508">Quick Search</span></a>'+
            '</div>'+
            '</div>'+
			'</div>'+
			'</div>'+   	

            '<table ng-if="wait==true" width="100%" cellpadding="0" style="margin-bottom:0;" cellspacing="0" border="0" class="table">' +
            '<tbody>' +
            '<tr >' +
            '<td>' +
            'Loading...' +
            '</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>' +
            '<table ng-if="wait==false" width="100%" cellpadding="0" style="margin-bottom:0;" cellspacing="0" border="0" class="table" id ="table-ext" >' +
            '<thead ng-if="recordsList.length==0">' +
            '<tr class="n2gheader">' +
            '<th class="text-center">' +
            '<span>No records found</span>' +
            '</th>' +
            '</tr>' +
            '</thead>' +
            '<!-- Start Table Header -->' +
            '<thead ng-if="recordsList.length>0">' +
            '<tr class="n2gheader">' +
            '<th style="width:10px;" ng-show="nextlevel">' +
            '<span class="hidden508">nextlevel</span>' +
            '</th>' +
			'<th ng-if="tableMetadata.ConfigInfo.EnableAutoIndex == \'true\'">'+
            '<span>#</span>' +
            '</th>'+
            '<th   ng-repeat="column in tableMetadata.ColumnsNameList" width="{{tableMetadata.FieldMetadata[column].ColumnWidth}}% " ng-if="column != \'Id\'">' +
            '<span ng-class="{\'pull-right\':tableMetadata.FieldMetadata[column].Type == \'CURRENCY\'}" ng-if="tableMetadata.FieldMetadata[column].Label != undefined && tableMetadata.FieldMetadata[column].Type != \'REFERENCE\'" ng-bind="tableMetadata.FieldMetadata[column].Label"></span>' +
            '<span ng-if="tableMetadata.FieldMetadata[column].Type == \'REFERENCE\'" ng-bind="tableMetadata.FieldMetadata[column].ReferenceFieldInfo.Label"/>' + 
            '</th>' +
            '<th style="width:90px;" ng-if="tableMetadata.ActionInfo != undefined">' +
            '<span>Actions</span>' +
            '</th>' +
            '</tr>' +
            '</thead>' +
            '<!-- Start Table Columns -->' +
            '<tbody ng-if="recordsList.length>0" ng-repeat="row in recordsList" class="tbody-ext n2ggrid-icon">' +
            '<tr class="tr-ext">' +
            '<td style="width:10px;" ng-show="nextlevel">' +
	           
            '<a ng-click="showChild = !showChild;" href="#!" class="focusActionItem n2g-table-icon"><span class="hidden508">Press Enter to expand/collapse Child records</span><div  ng-if="recCount[row.Id]>0" class="plus-div" ><i class="fa" ng-class="{\'fa-plus-circle\':!showChild,\'fa-minus-circle\':showChild}" style="font-size:1.2em" ></i></div></a>' +
            '<a href="#!" class="focusActionItem n2g-table-icon"><div  class="plus-div" ng-if="recCount[row.Id]<=0" ><i class="fa fa-minus-circle" style="font-size:1.2em" ></i></div><span class="hidden508">No Child Record found</span></a>' +
			'</td>' +
			'<td  ng-if="tableMetadata.ConfigInfo.EnableAutoIndex == \'true\'">{{$index + 1}}</td>'+ 
            '<td style="word-wrap:break-word;" ng-repeat="column in tableMetadata.ColumnsNameList" ng-if="column != \'Id\'" class="">' +
            '<field mode="view" table-metadata="tableMetadata" object-metadata="tableMetadata.ObjectMetaData" field-metadata="tableMetadata.FieldMetadata[column]" row-value="row" column-value="column" ref-url="getReferenceURL(row,column)" get-query-data="getLookupData(fieldName,sobjName,query)" get-updated-rows="updatedRowsHandler(obj,row,column,value)"></field>' +
            '</td>' +
            '<td style="width:90px;">' +

            '<action mode="view" ng-show="row.Id.length == 15 || row.Id.length == 18" row="row" table-meta-data="tableMetadata" action="action"/>' +
            '</td>' +
            '</tr>' +
            '<tr ng-if="showChild && level < 3" class="tr-ext">' +
            '<td style="width:10px;">' +
            '</td>' +
            '<td class=""  colspan="{{tableMetadata.ColumnsNameList.length}}">' +
            '<n2g delete-record="deleteRecord" n2g-data="n2gData" level="level+1" table-metadata="childMetadata" parent-id="row.Id" handle-modal-open-condition="handleModalOpenCondition"/>' +
            '</td>' +
            '</tr>' +
            '</tbody>' +
            '<tfoot ng-if="recordsList.length>0" >' +
            '<tr class="n2gheader">' +
            '<th colspan="{{tableMetadata.ColumnsNameList.length + 1}}">' +
            '<div class="row" style="margin:0">' +
            '<div class="col-md-4">' +
            '<span>' +
            '<span style="vertical-align: text-bottom;">Total Records: {{resultSize}}</span>' +
            '</span>' +
            '</div>' +
            '<div class="col-md-4">' +
            '' +
            '</div>' +
            '<div class="col-md-4">' +
            '<span class="pull-right">' +
            /*       '<span style="padding-right:10px;" ng-if="hasPrevious"><a ng-click="getPreviousPageRecords(tableMetadata);" href="#"><i class="fa fa-arrow-circle-o-left fa-2x"></i></a></span>'+
									'<span style="padding-right:10px;" ng-if="!hasPrevious"><a class="disable-action" href="#"><i class="fa fa-arrow-circle-o-left fa-2x"></i></a></span>'+
									'<span style="vertical-align: super;">Page {{pageNumber}} of {{totalPages}}</span>'+
									'<span style="padding-left:10px;" ng-if="hasNext"><a ng-click="getNextPageRecords(tableMetadata); " href="#"><i class="fa fa-arrow-circle-o-right fa-2x"></i></a></span>'+
									'<span style="padding-left:10px;" ng-if="!hasNext"><a class="disable-action" href="#"><i class="fa fa-arrow-circle-o-right fa-2x"></i></a></span>'+
							*/
            '<span style="padding-right:10px;" ng-if="hasPrevious"><a ng-click="getPreviousPageRecords(tableMetadata);" href="javascript:viod(0);"><i class="fa fa-backward"></i><span class="hidden508">Previous</span></a></span>' +
            '<span style="padding-right:10px;" ng-if="!hasPrevious"><a class="disable-action" href="javascript:viod(0);"><i class="fa fa-backward"></i><span class="hidden508">Previous</span></a></span>' +
            '<span class="separator">&nbsp;|&nbsp;</span>' +
            '<span class="bold">Page {{pageNumber}} of {{totalPages}}</span>' +
            '<span class="separator">&nbsp;|&nbsp;</span>' +
            '<span style="padding-left:10px;" ng-if="hasNext"><a ng-click="getNextPageRecords(tableMetadata); " href="javascript:viod(0);"><i class="fa fa-forward"></i><span class="hidden508">Next</span></a></span>' +
            '<span style="padding-left:10px;" ng-if="!hasNext"><a class="disable-action" href="javascript:viod(0);"><i class="fa fa-forward" ></i><span class="hidden508">Next</span></a></span>' +

            '</span>' +
            '</div>' +
            '</div>' +
            '</th>' +
            '</tr>' +
            '</tfoot>' +
            '</table>';

        return template;
    }

    var linker = function(scope, element, attrs) {
        scope.pageNumber = scope.tableMetadata.DataTableInfoMap.PageNumber;
        scope.pageSize = scope.tableMetadata.DataTableInfoMap.PageSize;
        scope.totalPages = scope.tableMetadata.DataTableInfoMap.TotalPages;
        scope.resultSize = scope.tableMetadata.DataTableInfoMap.ResultSize;
        scope.hasPrevious = scope.tableMetadata.DataTableInfoMap.HasPrevious;
        scope.hasNext = scope.tableMetadata.DataTableInfoMap.HasNext;
        if (scope.level == 0) {
            scope.wait = false;
            scope.recordsList = scope.tableMetadata.DataTableInfo.RecordsList;
            scope.childMetadata = scope.n2gData.ChildTableMetadata;
            scope.getTableData(scope.tableMetadata);
        } else if (scope.level == 1) {
            scope.wait = true;
            scope.childMetadata = scope.n2gData.GrandChildTableMetadata;
            scope.getTableData(scope.tableMetadata);
        } else if (scope.level == 2) {
            scope.wait = true;
            scope.childMetadata = undefined;
            scope.getTableData(scope.tableMetadata);
        }
        if (scope.childMetadata == undefined || scope.childMetadata.DataTableInfoMap == undefined) {
            scope.nextlevel = false;
        } else {
            scope.nextlevel = true;
        }
        element.html(getTemplate(scope.recordsList, scope.tableMetadata, scope.level, scope.n2gData, scope.childMetadata, scope.wait, scope.nextlevel)).show();
        $compile(element.contents())(scope);
    }
    return {
        restrict: 'E',
        controller: 'N2GController',
        scope: {
            tableMetadata: '=',
            level: '=',
            n2gData: '=',
            parentId: '=',
            deleteRecord: '=',
            handleModalOpenCondition: '='
        },
        link: linker
    };
});
inlineEditGrid.factory('Scopes', function($rootScope) {
    var mem = {};

    return {
        store: function(key, value) {
            $rootScope.$emit('scope.stored', key);
            mem[key] = value;
        },
        get: function(key) {
            return mem[key];
        }
    };
});