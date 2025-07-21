flexGrid.factory('griddataprovider', function () {
		
	var gridData = {	
	    getInitGridDataParams : function(){
	    	let params ={};
	        params.Name = gridName;
	        params.level = 0 ;
	        params.flexGridType = 'FlexGrid';
	        if(parentId != null){
	        	params.parentRecordId = escape(parentId);
	        }
	        let paramsJson = angular.toJson(params);
	        return paramsJson;   	
		},
		getInitTableDataParams : function(){
	    	let params ={};
	        params.Name = gridName;
	        params.level = 0 ;
	        params.flexGridType = 'FlexTable';
	        if(parentId != null){
	        	params.parentRecordId = escape(parentId);
	        }
	        let paramsJson = angular.toJson(params);
	        return paramsJson;   	
	    },
	    getCountPageRecordsParams : function(scope){
	    	let recordParamMap = {};
	        recordParamMap.pageNumber = 1;
	        recordParamMap.queryFieldsList = [' Count(ID) '];
	        recordParamMap.filterCriteria =  scope.masterFilterClause;
			recordParamMap.sObjectName = scope.flexTableConfig['SObjectName'];
			if(parentId != null){
	        	recordParamMap.parentRecordId = escape(parentId);
	        }
			if(enhancedSearchText!= null){
				recordParamMap.enhancedSearchText = enhancedSearchText;
			}
	        let recordParamJSon = angular.toJson(recordParamMap);
	        return  recordParamJSon;
	    },
	    getPageRecordsParams : function(scope,pageSize,limit){
	    	let recordParamMap = {};
	        recordParamMap.pageNumber = scope.pageNumber;
			recordParamMap.queryFieldsList = scope.tableMetaData.FlexTableConfigMap.QueryFieldsList ;
	        recordParamMap.filterCriteria =  scope.masterFilterClause;
			recordParamMap.FlexTableId = scope.flexTableConfig.FlexTableId;
			recordParamMap.updatdFlexHeader = scope.tableCommunicator.updatedFlexHeader;
	        let parentIdPrefix = '{{', parentIdSuffix = "}}";
			let parentIdString = recordParamMap.filterCriteria.match(new RegExp(parentIdPrefix + '(.*)' + parentIdSuffix));
			if(parentIdString != undefined && parentIdString.length == 2){
			    recordParamMap.filterCriteria = scope.masterFilterClause.replace(parentIdString[0], scope.communicator.recordsIDMap[parentIdString[1]]);
			}
	        recordParamMap.sObjectName = scope.flexTableConfig.SObjectName;
	        recordParamMap.pageSize = pageSize;
			recordParamMap.limitValue = limit;
			recordParamMap.sortableColumn = '';
			recordParamMap.userFields = scope.tableCommunicator.expressionUserFieldsArray;
			if(parentId != null){
	        	recordParamMap.parentRecordId = escape(parentId);
	        }

			
	        if(scope.flexTableConfig.SortDirection != undefined){
	        	recordParamMap.sortDirection = scope.flexTableConfig.SortDirection;
	        }else{
	        	recordParamMap.sortDirection = 'ASC';
	        }
			
			if(enhancedSearchText!= null && enhancedSearchText != ''){
				recordParamMap.enhancedSearchText = enhancedSearchText;
				scope.isSearchTable = true;
				scope.flexTableConfig.OrderBy =''
			}			
	        if(scope.tableCommunicator.rowGroupingFieldList != undefined && scope.tableCommunicator.rowGroupingFieldList.length > 0){
				let strSortDir = recordParamMap.sortDirection;
				let rowGroupingFieldListArray = [];
				angular.forEach(scope.tableCommunicator.rowGroupingFieldList , function(value, key) {
					value = scope.tableCommunicator.getReferenceFieldName(value);
					recordParamMap.sortableColumn = recordParamMap.sortableColumn + value + ' ' + strSortDir + ', ';
					rowGroupingFieldListArray.push(value.toLowerCase());
				});
				recordParamMap.sortableColumn = recordParamMap.sortableColumn.substring(0,recordParamMap.sortableColumn.lastIndexOf(', '));
				
				if(scope.flexTableConfig.OrderBy != undefined){
					let OrderByfieldString = scope.flexTableConfig.OrderBy.toLowerCase();
					if(OrderByfieldString.indexOf(',') != -1 && (OrderByfieldString.indexOf('desc') != -1 || OrderByfieldString.indexOf('asc') != -1)){
						let mulitipleSortFields = OrderByfieldString.split(',');
						for(let index = 0; index < mulitipleSortFields.length; index++){
							let SingleFieldWithDirection = mulitipleSortFields[index].split(' ');
							if(rowGroupingFieldListArray.indexOf(SingleFieldWithDirection[0]) == -1){
								if(mulitipleSortFields[index].toLowerCase().indexOf(' asc') != -1){
									mulitipleSortFields[index] = mulitipleSortFields[index].substring(0,mulitipleSortFields[index].length-4);
									strSortDir = 'Asc';
								}
								if(mulitipleSortFields[index].toLowerCase().indexOf(' desc') != -1){
									mulitipleSortFields[index] = mulitipleSortFields[index].substring(0,mulitipleSortFields[index].length-5);
									strSortDir = 'Desc';
								}
								recordParamMap.sortableColumn = recordParamMap.sortableColumn + ', ' + mulitipleSortFields[index] + ' ' + strSortDir;
							}
						}
						recordParamMap.sortableColumn = recordParamMap.sortableColumn + ', Id';
					}else{
						recordParamMap.sortableColumn = recordParamMap.sortableColumn + ', ' + OrderByfieldString +', Id'+ ' ' + strSortDir;
					}
				}else{
					recordParamMap.sortableColumn = recordParamMap.sortableColumn + ', Id ';
				}
				//recordParamMap.sortableColumn = recordParamMap.sortableColumn.substring(0,recordParamMap.sortableColumn.lastIndexOf(', '));
				rowGroupingfields = recordParamMap.sortableColumn;
				recordParamMap.sortDirection = '';
			}
			else if(scope.flexTableConfig.OrderBy != undefined){
				let OrderByfieldString = scope.flexTableConfig.OrderBy.toLowerCase();
				if(OrderByfieldString.indexOf(',') != -1 && (OrderByfieldString.indexOf('desc') != -1 || OrderByfieldString.indexOf('asc') != -1)){
					let mulitipleSortFields = OrderByfieldString.split(',');
					for(let index = 0; index < mulitipleSortFields.length; index++){
						if(mulitipleSortFields[index].indexOf(' desc') != -1 || mulitipleSortFields[index].indexOf(' asc') != -1 ){
	        				recordParamMap.sortableColumn = scope.flexTableConfig.OrderBy +', Id';
							recordParamMap.sortDirection = '';
						}
					}
				}
				else{
				//	recordParamMap.sortableColumn = scope.flexTableConfig.OrderBy;
					recordParamMap.sortableColumn = scope.tableCommunicator.getReferenceFieldName(scope.flexTableConfig.OrderBy);
					recordParamMap.sortableColumn = recordParamMap.sortableColumn +', Id';
				}
	        }else{
	        	recordParamMap.sortableColumn = 'LastModifiedDate , Id';
			}
			if(scope.quickSearchClause != undefined && scope.isSearchWithAll == true ){
				if(recordParamMap.filterCriteria != undefined && recordParamMap.filterCriteria != ""){
					recordParamMap.filterCriteria = recordParamMap.filterCriteria +' AND ( '+scope.quickSearchClause.substring(0,scope.quickSearchClause.length -3 ) +' )';
				}else{
					recordParamMap.filterCriteria =' ( '+scope.quickSearchClause.substring(0,scope.quickSearchClause.length -3 ) +' )'
				}
			}
	        
	        let recordParamJSon = angular.toJson(recordParamMap);
	        return  recordParamJSon;
	    },
	    executeClassParams : function(scope,action){
	    	let executeClassParamMap = {};
	    	executeClassParamMap.recordSelectionMap = scope.tableCommunicator.recordSelectionMap;
	    	executeClassParamMap.stringParameters = angular.toJson(scope.communicator.stringParameters);// keyValueMap
			executeClassParamMap.listParameters = angular.toJson(scope.communicator.listParameters);// listParameters
	    	executeClassParamMap.actionClass = action.ActionClass;
	    	executeClassParamMap.action = action;
	    	executeClassParamMap.tableName = scope.tableCommunicator.tableName;
	    	executeClassParamMap.gridName = scope.communicator.gridName;
			executeClassParamMap.url = scope.currentPageURL;
			executeClassParamMap.query = scope.tableCommunicator.query;
	    	if(scope.row != undefined){
	    		executeClassParamMap.selectedRecordId = escape(scope.row.Id);
			}
			if(parentId != null){
	        	executeClassParamMap.parentRecordId = escape(parentId);
	        }
	    	let executeClassParamJson = angular.toJson(executeClassParamMap);
	    	return executeClassParamJson;
	    },
	    fetchLookupDataParams : function(refField,sobjectName,searchTerm,filterClause,keyValueMap){
	    	let fetchLookupDataParamsMap = {};
	    	fetchLookupDataParamsMap.refField = refField;
	    	fetchLookupDataParamsMap.sobjectName = sobjectName;
	    	fetchLookupDataParamsMap.searchTerm = searchTerm;
	    	fetchLookupDataParamsMap.filterClause = filterClause;
	    	fetchLookupDataParamsMap.keyValueMap = keyValueMap;
	    	let fetchLookupDataParamsJson = angular.toJson(fetchLookupDataParamsMap);
	    	return fetchLookupDataParamsJson;
	    },
	    deleteRecordsParams : function(delRecordsMap){
	    	let delRecordParamMapJSON = angular.toJson(delRecordsMap);
	    	return delRecordParamMapJSON;
	    },
	    saveRecordsParams : function(saveRecordsMap,tableObjectsMap,levelVsTableIdMap,parentLookupFieldMap,queryfieldsMap){
	    	let saveRecordsParamMap = {};
	    	saveRecordsParamMap.tableObjectsMap = tableObjectsMap;
	    	saveRecordsParamMap.saveRecordsMap = saveRecordsMap;
			saveRecordsParamMap.levelVsTableIdMap = levelVsTableIdMap;
	    	saveRecordsParamMap.parentLookupFieldMap = parentLookupFieldMap;
	    	saveRecordsParamMap.queryfieldsMap = queryfieldsMap;
	    	let saveRecordsMapJSON = angular.toJson(saveRecordsParamMap);
	    	return saveRecordsMapJSON;	
	    }
	}
	return gridData;
})
