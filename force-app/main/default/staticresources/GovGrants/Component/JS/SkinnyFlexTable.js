 var namespace = skinnyFlexTable_namespace;

var j$ = jQuery.noConflict();  
skinnyFlexTableApp.controller('SkinnyFlexTableCtrl', function ($q, $scope, $timeout, $modal, $log, $element, $window, $sce, $location, Scopes) {
	Scopes.store('SkinnyFlexTableCtrl', $scope);
	$scope.flexTableId = Scopes.get('MasterSkinnyFlexTableCtrl').skinnyFlexTable_TableId;
	$scope.isCustomLookupField = Scopes.get('MasterSkinnyFlexTableCtrl').skinnyFlexTable_isCustomLookupField;
	$scope.showTree = false;
	$scope.headerDescription = Scopes.get('MasterSkinnyFlexTableCtrl').skinnyFlexTable_headerDescription;
	$scope.URLParams = window.location.search;
	$scope.hideHeader = true;
	$scope.timeOffset = Scopes.get('MasterSkinnyFlexTableCtrl').skinnyFlexTable_timeOffset;
	$scope.newFilterClause = Scopes.get('MasterSkinnyFlexTableCtrl').skinnyFlexTable_flexTableLookupfilter;
	$scope.currentPageURL = decodeURIComponent(Scopes.get('MasterSkinnyFlexTableCtrl').skinnyFlexTable_currentPageURL);
	$scope.QuickSearchReportText = '';
	$scope.LookupSearchReportText = '';
	$scope.fieldId = decodeURIComponent(Scopes.get('MasterSkinnyFlexTableCtrl').skinnyFlexTable_fieldId);
	$scope.formId = decodeURIComponent(Scopes.get('MasterSkinnyFlexTableCtrl').skinnyFlexTable_formId);
	$scope.accountId= '';
	$scope.searchedItems='';
	$scope.skinnyFlexTable_FlexTableFields = Scopes.get('MasterSkinnyFlexTableCtrl').skinnyFlexTable_FlexTableFields;
	$scope.skinnyFlexTable_sobjectName = Scopes.get('MasterSkinnyFlexTableCtrl').skinnyFlexTable_sobjectName;
	$scope.mergeFields = decodeURIComponent(Scopes.get('MasterSkinnyFlexTableCtrl').skinnyFlexTable_mergeParameters);
	$scope.listmergeFields = Scopes.get('MasterSkinnyFlexTableCtrl').skinnyFlexTable_listmergeParameters;
	$scope.sortBy = Scopes.get('MasterSkinnyFlexTableCtrl').skinnyFlexTable_sortBy;
	$scope.sortDirection = Scopes.get('MasterSkinnyFlexTableCtrl').skinnyFlexTable_sortDirection;

	if($scope.currentPageURL.indexOf('&retURL') != -1){
		$scope.currentPageURL = encodeURIComponent($scope.currentPageURL.substring(0, $scope.currentPageURL.indexOf('retURL')));
	}
	$scope.retURL = '?retParams='+ $scope.URLParams.substring(1,$scope.URLParams.length) + '&retURL=' + encodeURIComponent($scope.currentPageURL);
	/* Static data relevant to flex table */
	$scope.alphabets = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','All'];
	$scope.pageSizes = [];
	$scope.sortInfo  = { fields: [], directions: ['desc', 'asc']}; 
	$scope.isRefresh = false;
	$scope.searchTerm = '';
	$scope.errorCreatingTable = false;
	$scope.messages = [];
	$scope.isSOSL = false;
	$scope.flex = true;
	$scope.hideRowLevelAction = false;
	$scope.initialParameters = {};
    $scope.treeFilterClause = '';
	$scope.aside = {title: 'Title', content: 'Hello Aside<br />This is a multiline message!'};
	$scope.redirect = function(tableConfigInfos){
		//console.log("Redirecting....!");
		$window.open("/"+tableConfigInfos.FlexTableRecordId+"?isdtp=vw");
	}
	$scope.result = function(){
		//console.log('LookupSearchReportText',$scope.LookupSearchReportText);
        if($scope.LookupSearchReportText <= 1){
            return false;
        }
        else{
            return true;
        } 
    } 
	$scope.checkCookie = function() {
		return j$.cookie('setup') == 'present';
	}
	$scope.selectValue = function(selectedId,value,ev){

		if(ev != undefined && ev.which == 1){
			ev.preventDefault();
		}
		//console.log('selectedId----',selectedId);
		//console.log('value----',value);
		//console.log('$scope.isCustomLookupField----',$scope.isCustomLookupField);
		//window.opener.setLookupValue($scope.fieldId,selectedId,value);		
		if($scope.isCustomLookupField == 'true') {
			window.parent.setCustomLookupValue($scope.fieldId,selectedId,value);
		} else {
		window.parent.setLookupValue($scope.fieldId,selectedId,value);
		}		
		
		//top.window.opener.lookupPick2(formId,fieldId+'_lkid',fieldId,valueID,valueName, false);
		// window.parent.lookupPick2(formId,fieldId+'_lkid',fieldId,valueID,valueName, false);
	}
	$scope.openHierarchy = function(selectedId,accountText){
		$scope.accountId = selectedId;
		$scope.showTree = true;
		$scope.accountText = accountText;                   
        $scope.treeFilter =  $scope.treeFilterClause;                 
	}
	$scope.goBack = function(){
		$scope.showTree = false;
	}
	$scope.toUTCDate = function(date){
		var _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
		return _utc;
	};
	$scope.getDateTime = function(value){
		var time = undefined;
		if(value != undefined){
			return $scope.toUTCDate(new Date(value+$scope.timeOffset));                  
		}
		return time;
	};
	$scope.getDate = function(value){
		var time = undefined;
		if(value != undefined){
			return $scope.toUTCDate(new Date(value));                  
		}
		return time;
	};
	/* Initialize the arrays that will be required here after */
	$scope.columns = [];
	$scope.pickListMap = {};
	$scope.filterMap = {};
	$scope.filterDisplayMap = {}; 
	$scope.filterDisplayMapOnFilter = {};
	$scope.selectedRecords = {};
	$scope.flagForRenderPDFCSVButton = false; 													
	$scope.first = function(){
		$scope.messages = [];            
		showLoadingPopUp();            
		$scope.pageNumber = 1;
		$scope.getPageRecords();
	};
	$scope.last = function(){
		$scope.messages = [];
		showLoadingPopUp();
		$scope.pageNumber = $scope.totalPages;
		$scope.getPageRecords();
	};
	$scope.next = function(){
		$scope.messages = [];
		if($scope.hasNext == true){
			showLoadingPopUp();
			$scope.pageNumber++;
			$scope.getPageRecords();
		}             
	}; 
	$scope.previous = function(){
		$scope.messages = [];
		showLoadingPopUp();
		$scope.pageNumber--;
		$scope.getPageRecords();
	};
	$scope.refresh = function(size){
		showLoadingPopUp();
		$scope.messages = [];
		if(size != undefined){
			$scope.pageSize = size;
			if(size == 'All'){
				$scope.pageSize = $scope.totalRecordsCount;
			} 
		}
		$scope.pageNumber = 1;                
		$scope.getPageRecords();
	};

	$scope.sort = function(column){
		if(column.type != 'TEXTAREA' && column.type != 'MULTIPICKLIST'){
			if(column.field != undefined){                                       
				showLoadingPopUp();                                       
				var fieldName = column.field;
				if($scope.sortFieldName == fieldName && ($scope.sortDirection == 'ASC' || $scope.sortDirection == 'asc')){
					$scope.sortDirection = 'desc';
				}else if($scope.sortFieldName == fieldName && ($scope.sortDirection == 'DESC' || $scope.sortDirection == 'desc')){
					$scope.sortDirection = 'asc';
				}else {
					$scope.sortDirection = 'asc';
				}    
				$scope.sortFieldName = fieldName ;                
				$scope.pageNumber = 1;
				$scope.getPageRecords();
			} 
		} else{
			alert('Sorry, sorting is not allowed on this column.');
		} 
	}
	$scope.trustSrc = function(src) {
		return $sce.trustAsResourceUrl(src);
	}
	$scope.setLoading = function(loading) {
		$scope.isLoading = loading;
	};
	$scope.paintFlexTable = function(flexTableResult){	
		$scope.noRecords = false; 
		$scope.keyValueMap = flexTableResult.KeyValueMap;
		$scope.flexTableHeader = flexTableResult.FlexTableHeader;
		$scope.objectMetadata = flexTableResult.ObjectMetaData;
		$scope.offset = flexTableResult.Offset;
		//$scope.hideRowLevelAction = ( flexTableResult.DataTableInfoMap.RowLevelActionForDisabled == undefined || flexTableResult.DataTableInfoMap.RowLevelActionForDisabled == '' || flexTableResult.DataTableInfoMap.RowLevelActionForDisabled == 'Show') ? false : true;
		$scope.userOffset;
		//$scope.hideQuickSearchText = false;
		/*if($scope.headerButtonLinkCount > 1){
		$scope.hideQuickSearchText = true;
		}*/
		/* 2. Create the column information */
		/* Special case handling for Task object */                
		$scope.objectName = flexTableResult.DataTableInfo.ObjectName;
		var InitialFilterClause = flexTableResult.IntialFilterClause;		
		if( flexTableResult.IntialFilterClause != undefined && flexTableResult.IntialFilterClause != '' ) {
			$scope.filterClause = flexTableResult.IntialFilterClause;
			//console.log('$scope.newFilterClause12 ',$scope.newFilterClause );
			//angular.copy($scope.filterClause, $scope.newFilterClause);
			if( $scope.newFilterClause == undefined || $scope.newFilterClause == '' || $scope.newFilterClause == null ) {
				$scope.newFilterClause = ''+ $scope.filterClause;
				//console.log('$scope.newFilterClause12 ',$scope.newFilterClause );
			} else {
				$scope.newFilterClause = $scope.newFilterClause+' and '+ $scope.filterClause;
				//console.log('$scope.newFilterClause13',$scope.newFilterClause );
			}
		}
		// $scope.renderBtnAsToPDF = flexTableResult.RenderDownloadPDFMenuAsButton; 
		//$scope.newFilterClause = $scope.filterClause;                          
		$scope.fieldsMap = flexTableResult.FieldMetadata; 
		$scope.columnsNameList = flexTableResult.ColumnsNameList;
		for(var i=0; i < $scope.columnsNameList.length;i++) {
			var f = $scope.columnsNameList[i];
			var showFilter = true;
			// Pankaj : Need to discuss
			/*if(InitialFilterClause != undefined && InitialFilterClause != ''){
			if(InitialFilterClause.indexOf(f) != -1){
			showFilter = false;    
			}
			}*/
			var fieldDataType;
			var displayName;
			var columnWidth='';
			if(flexTableResult.FieldMetadata[f].Type == 'PICKLIST'){                        
				$scope.pickListMap[f] = flexTableResult.FieldMetadata[f].PicklistValues;
			} 
			var refFieldPath = 'row';
			var refFieldValue ;                      
			if(flexTableResult.FieldMetadata[f].Type == 'REFERENCE'){                        
				var refField = f.split('.');                                                
				for(var j=0;j < refField.length - 1 ; j++){                               
					refFieldPath += '[\''+refField[j]+'\']'                                              
				}
				////console.log('refFieldPath ---',refFieldPath ); 
				refFieldValue = refField[j];
				////console.log('refFrefFieldValue ---',refFieldValue ); 
				if(refFieldValue.toLowerCase() == 'name'){
					fieldDataType = 'REFERENCE';  
					displayName = flexTableResult.FieldMetadata[f].Label; 
					if(j > 1){
						displayName = flexTableResult.FieldMetadata[f].ReferenceFieldInfo.Label;
					}                           
				}else{  
					refFieldPath += '[\''+refFieldValue+'\']';                      
					fieldDataType = flexTableResult.FieldMetadata[f].ReferenceFieldInfo.Type; 
					displayName = flexTableResult.FieldMetadata[f].ReferenceFieldInfo.Label; 
				}					  
			}else{
				refFieldPath += '[\''+f+'\']';
				refFieldValue = f;
				fieldDataType = flexTableResult.FieldMetadata[f].Type;
				displayName = flexTableResult.FieldMetadata[f].Label;
			}
			if( flexTableResult.FieldMetadata[f].ColumnWidth != undefined && flexTableResult.FieldMetadata[f].ColumnWidth != '' && flexTableResult.FieldMetadata[f].ColumnWidth != null && flexTableResult.FieldMetadata[f].ColumnWidth != 'null' ) {
				columnWidth = flexTableResult.FieldMetadata[f].ColumnWidth + "%";
			} 
			$scope.columns.push({"field": f,"refField": refFieldPath ,"refFieldValue":refFieldValue,"displayName":displayName,"width":columnWidth,"showFilter":showFilter,"type":fieldDataType,"term1":'',"term2":''});                                                   
		}  
		$scope.tableData = flexTableResult.DataTableInfo.RecordsList;
		////console.log('flexTableResult.DataTableInfo: ',flexTableResult.DataTableInfo);
		if($scope.tableData != undefined && $scope.tableData.length == 0){
			$scope.noRecords = true;
		}
		$scope.pageSizeArray = flexTableResult.DataTableInfoMap.PageSizes.split(';');
		////console.log('$scope.pageSizeArray------->>>>>',$scope.pageSizeArray);
		for(i = 0;i <  $scope.pageSizeArray.length; i++){                    
			$scope.pageSizes.push( $scope.pageSizeArray[i]);                    
		}   
		if(flexTableResult.DataTableInfo.ResultSize >= flexTableResult.DefaultPageSize && flexTableResult.DataTableInfo.ResultSize <= flexTableResult.MaxRecordsCount){
			$scope.pageSizes.push('All');    
		}
		/* 5. Create the table configuration information required between server calls*/
		$scope.queryColumns = flexTableResult.DataTableInfo.QueryColumns; 
		$scope.hideDecisionFields = flexTableResult.DataTableInfo.HideDecisionFields;
		$scope.resultSize = flexTableResult.DataTableInfo.ResultSize;   
		$scope.totalRecordsCount = flexTableResult.DataTableInfo.ResultSize;
		$scope.totalRecords = 'Total records: '+ flexTableResult.DataTableInfo.ResultSize;
		$scope.pageNumber = flexTableResult.DataTableInfo.PageNumber;
		$scope.totalPages = flexTableResult.DataTableInfo.TotalPages;
		$scope.pageSize = flexTableResult.DataTableInfo.PageSize; 
		$scope.hasNext = flexTableResult.DataTableInfo.HasNext; 
		$scope.hasPrevious = flexTableResult.DataTableInfo.HasPrevious;   
		$scope.pageInfo = 'Page ' + $scope.pageNumber + ' of ' +  $scope.totalPages;
		$scope.sortFieldName =  flexTableResult.DataTableInfo.SortColumn; 
		if($scope.sortFieldName == undefined){
			$scope.sortFieldName = '';    
		}
		$scope.sortDirection =  flexTableResult.DataTableInfo.SortDir;
		if($scope.sortDirection == undefined){
			$scope.sortDirection = 'ASC';    
		}
		/* 6. Set the loading to false */
		$scope.setLoading(false);
		j$('#lookuploading').show();	
	};
	
	$scope.searchLookup = function(LookupSearchReportText,event){		
		$scope.LookupSearchReportText = LookupSearchReportText;
		//console.log('$scope.LookupSearchReportText',$scope.LookupSearchReportText);
		//console.log('$scope.newFilterClauseserch ',$scope.newFilterClause );
		$scope.messages = [];
		if( event == null || event.keyCode == 13 ) {
			$scope.searchTerm = LookupSearchReportText;
			$scope.isSOSL = true;
			$scope.pageNumber = 1;
			$scope.getPageRecords();
		    setTimeout(function(){if(modalHandler(1) != undefined){modalHandler(1);}},500);
		}
	}
	$scope.getPageRecords = function(){   
		$scope.messages =[];
		$scope.isRefresh = true;
		if($scope.pageNumber == 0){
			$scope.pageNumber = 1;    
		}
		$scope.isSOSL = false;
		if($scope.searchTerm){
			$scope.isSOSL = true;
		}
		$scope.newFilterClause = $scope.newFilterClause;		
		if(!$scope.newFilterClause){
			$scope.newFilterClause = '';
			//console.log('$scope.newFilterClausepage ',$scope.newFilterClause );
		}		
		$scope.hideDecisionFields = '';
		var deferred = $q.defer(); 
		Visualforce.remoting.Manager.invokeAction(
		_RemotingSkinnyFlexTableActions.getPageRecordsWithMergeFields, 
			$scope.queryColumns,$scope.hideDecisionFields,$scope.objectName,$scope.pageNumber,$scope.pageSize,$scope.sortFieldName,$scope.sortDirection, $scope.searchTerm,$scope.newFilterClause,$scope.isSOSL,$scope.mergeFields,$scope.listmergeFields,
			function(flexTableResult, event){ 				                      
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(flexTableResult);  
						$scope.tableData = flexTableResult.RecordsList;
						$scope.noRecords = false;
						if($scope.tableData.length == 0){
							$scope.noRecords = true;
						}															
						$scope.queryColumns = flexTableResult.QueryColumns; 
						$scope.hideDecisionFields = flexTableResult.HideDecisionFields;                                                               
						$scope.objectName = flexTableResult.ObjectName; 
						$scope.resultSize = flexTableResult.ResultSize;                                                                    
						$scope.totalRecords = 'Total records: '+ flexTableResult.ResultSize;
						$scope.pageNumber = flexTableResult.PageNumber;
						$scope.totalPages = flexTableResult.TotalPages;
						$scope.pageSize = flexTableResult.PageSize; 
						$scope.hasNext = flexTableResult.HasNext; 
						$scope.hasPrevious = flexTableResult.HasPrevious;   
						$scope.pageInfo = 'Page ' + $scope.pageNumber + ' of ' +  $scope.totalPages; 
						//$scope.setLoading(false); 
						$scope.windowURL = '' ;
						$scope.isRefresh = false;    
						$scope.isSOSL = flexTableResult.isSOSL;						
						//console.log('$scope.LookupSearchReportText--',$scope.LookupSearchReportText);					
						$scope.searchedItems = 'Searched Items';
						/*if($scope.LookupSearchReportText){
							$scope.searchedItems = 'Searched Items';
						}else{
							$scope.searchedItems = 'Recently Viewed';
						}*/
					});                                                                               
				}else{
					$scope.$apply(function () {
						$scope.messages = [];
						$scope.messages.push({type: 'danger',msg: 'Error creating table:' + event.message});
					});
				}
				hideLoadingPopUp();
				adjustToggleBarHeightUI();  
				//console.log('----','#'+$scope.flexTableId);
				//console.log('----',j$('#'+$scope.flexTableId).height());  
				window.parent.resizeCustomLookupModal(j$('#'+$scope.flexTableId).height());                                                                 
			}, 
			{ buffer: false, escape: false, timeout: 30000 }
		); 
		return deferred.promise;                            
	};
	/* Initialize the flex table */
	$scope.initFlexTable = function(){ 
		$scope.setLoading(true);                          
		var deferred = $q.defer(); 
        var searchTerm = Scopes.get('MasterSkinnyFlexTableCtrl').skinnyFlexTable_searchTerm.trim();
			//To show all records on onload of page. To show recently viewed code is commented. 
		$scope.LookupSearchReportText = searchTerm;
		//console.log('Search Term',$scope.LookupSearchReportText);
		$scope.initialParameters['searchTerm'] = $scope.LookupSearchReportText;
		$scope.searchedItems = 'Searched Items';

		/*if(searchTerm && searchTerm.length > 1){		
			//console.log('Search Term',searchTerm);
			$scope.LookupSearchReportText = searchTerm;
				//console.log('Search Term',$scope.LookupSearchReportText);
				$scope.initialParameters['searchTerm'] = $scope.LookupSearchReportText;
			
		}else{
			$scope.initialParameters['searchTerm'] = 'ALL';
			$scope.searchedItems = 'Recently Viewed';
		}
		if($scope.LookupSearchReportText){
			$scope.searchedItems = 'Searched Items';
		}else{
			$scope.searchedItems = 'Recently Viewed';
		}*/
		$scope.initialParameters['PageSize'] = '10';
		$scope.initialParameters['SortDirection'] = $scope.sortDirection;
		$scope.initialParameters['SortBy'] = $scope.sortBy;
		$scope.initialParameters['PageNumber'] = '1';
		$scope.initialParameters['isSOSL'] = 'true';
		$scope.initialParameters['mergeFields'] = $scope.mergeFields;
		$scope.initialParameters['listmergeFields'] = $scope.listmergeFields;
		//To show sort direction arrow on onload of page.
		$scope.sortFieldName = $scope.sortBy;

		//$scope.generateFilterString( $scope.QuickSearchReportText );
		//console.log('$scope.newFilterClauseint ',$scope.newFilterClause );
		if( $scope.newFilterClause == undefined ) {
			$scope.newFilterClause = '';
			//console.log('$scope.newFilterClauseint ',$scope.newFilterClause );
		}
		Visualforce.remoting.Manager.invokeAction(
			_RemotingSkinnyFlexTableActions.paintLookupFlexTable, 
			$scope.skinnyFlexTable_FlexTableFields,$scope.skinnyFlexTable_sobjectName,$scope.newFilterClause,$scope.initialParameters,
			function(flexTableResult, event){
				if (event.status) {
					userTimeZone = flexTableResult.UserLocale;
					$scope.userOffset = getUserOffset(userTimeZone);
                    $scope.treeFilterClause = flexTableResult.FilterClause;
					$scope.$apply(function () {
						deferred.resolve(flexTableResult); 
						if(flexTableResult.DataTableInfo.RecordsList != undefined){
							$scope.paintFlexTable(flexTableResult); 
						}                                                 
					});                                                                                                            
				} 
				else{
					$scope.$apply(function () {
						$scope.errorCreatingTable = true;
						$scope.setLoading(false);
						$scope.messages.push({type: 'danger',msg: 'Error creating table:' + event.message});
					});
				}  
				hideLoadingPopUp();
			}, 
			{ buffer: false, escape: false}
		);
		return deferred.promise;     
	}; 
	$scope.isSkinnyTable = false;     
	$scope.initFlexTable();  
	$scope.extraParameters = '?isdtp=vw&';  
});
skinnyFlexTableApp.filter('orderObjectBy', function() {
	return function(items, field, reverse) {
		var filtered = [];
		angular.forEach(items, function(item) {
			filtered.push(item);
		});
		filtered.sort(function (a, b) {
			return (a[field] > b[field]) ? 1 : ((a[field] < b[field]) ? -1 : 0);
		});
		if(reverse) filtered.reverse();
		return filtered;
	};
}); 
skinnyFlexTableApp.filter('noFractionCurrency',[ '$filter', '$locale',
function(filter, locale) {
	var currencyFilter = filter('currency');
	var formats = locale.NUMBER_FORMATS;
	return function(amount, currencySymbol) {
		var value = currencyFilter(amount, currencySymbol);
		var sep = value.indexOf(formats.DECIMAL_SEP);
		if(amount >= 0) { 
			return value;
		}
		return value;//.substring(0, sep) + '';
	};
} 
]); 
skinnyFlexTableApp.directive("customhtml", function($compile,$parse){
	return {
		restrict: 'E',                 
		scope: {
			fieldContent: '=',          
			fieldName: '=',      
			flexTableId: '='
		},                
		link: function(scope, element, attr){
			var texAreaContent = $parse(scope.fieldName)(scope.fieldContent);
			var text = String(texAreaContent).replace(/<[^>]+>/gm, '');
			if(texAreaContent != undefined && texAreaContent != 'undefined'){
				var content = texAreaContent.replace(/PlaceHolderID/g,flexTableId);          
				element.html(content).show();
				element.attr('title', text);
				$compile(element.contents())(scope);
			}
		}
	} 
});

skinnyFlexTableApp.directive("dateTimePicker", function($compile,$filter){
	return {
		restrict: 'A',                 
		scope: {
			timePicker: '=',
			format:'@'     
		}, 
		require: 'ngModel',                               
		link: function(scope, element, attr,ngModel){
			ngModel.$formatters.push(function(value) {
				if( value != null && value != undefined && !isNaN(value)) {
					if(scope.timePicker == false){
						return $filter('date')(value, 'MM/dd/yyyy');
					}else{
						return $filter('date')(value, 'MM/dd/yyyy h:mm a');
					}
				}
				return '';                        
			});
			ngModel.$parsers.push(function (value) {
				return Date.parse(value);
			});
			element.datetimepicker({
				timepicker:scope.timePicker,
				format: scope.format
			});                                        
		}
	} 
});

skinnyFlexTableApp.filter('millSecondsToTimeString', function() {
	return function(millseconds) {
		var seconds = Math.floor(millseconds / 1000);
		var days = Math.floor(seconds / 86400);
		var hours = Math.floor((seconds % 86400) / 3600);
		var minutes = Math.floor(((seconds % 86400) % 3600) / 60);
		var timeString = '';
		if(days > 0) timeString += (days > 1) ? (days + " days ") : (days + " day ");
		if(hours > 0) timeString += (hours > 1) ? (hours + " hours ") : (hours + " hour ");
		if(minutes >= 0) timeString += (minutes > 1) ? (minutes + " minutes ") : (minutes + " minute ");
		return timeString;
	}
});


skinnyFlexTableApp.directive("tree", function($compile,$parse, $timeout,$q){            
	return {                
		restrict: 'E', 
		scope: {
			accountId: "=",
			fieldId: "=",
            accountText:"=",
            treeFilter:"="
		},                                                                                             
		link: function(scope, element, attr){ 			
			scope.getAccountHierarchy = function(){                      
				Visualforce.remoting.Manager.invokeAction(
					_RemotingSkinnyFlexTableActions.getAccountHierarchy ,
                    scope.accountId,scope.treeFilter,                   
					function(accountHierarchy, event){                         
						if (event.status) {
							scope.$apply(function () {                                
								////console.log('accountHierarchy--->>',accountHierarchy); 
								scope.accountHierarchy = accountHierarchy;                                       
								element.treeview({                        
								data: scope.accountHierarchy.AccountHierarchy,
								onNodeSelected: function(event, data) {
									/*window.opener.setLookupValue(scope.fieldId,data.Id,data.text); //for new window*/
									window.parent.setLookupValue(scope.fieldId,data.Id,data.text); 
								}                       
								});                                        								
								var node =  element.treeview('search',[scope.accountText, { ignoreCase: false,exactMatch: true,revealResults: true}]); 
								element.treeview('expandNode', [ node[0], { levels:9999,silent: true } ]); 
								scope.isLoading = false;
							});                                                                                                            
						}                         
					},                            
					{ buffer: false, escape: false}
				);                          
			};                    
			scope.getAccountHierarchy();                                                                                                                     
		}    
	} 
});        


/*
var adjustToggleBarHeight = function(){
};
*/      
function loadingScreen(){
	j$.blockUI(
	{
		message: '<img src="/img/loading.gif" alt="Loading gif"/>'
	}
	);
	setTimeout(j$.unblockUI, 5000); 
}
var userTimeZone = 0;        
function formatLocalDt(dateObj) {
	tzo = -dateObj.getTimezoneOffset(),
	dif = tzo >= 0 ? '+' : '-',
	pad = function(num) {
		var norm = Math.abs(Math.floor(num));
		return (norm < 10 ? '0' : '') + norm;
	};
	return dateObj.getFullYear() 
	+ '-' + pad(dateObj.getMonth()+1)
	+ '-' + pad(dateObj.getDate());                
}

function formatLocalDate(dateObj) {
	tzo = -dateObj.getTimezoneOffset(),
	dif = tzo >= 0 ? '+' : '-',
	pad = function(num) {
		var norm = Math.abs(Math.floor(num));
		return (norm < 10 ? '0' : '') + norm;
	};
	return dateObj.getFullYear() 
	+ '-' + pad(dateObj.getMonth()+1)
	+ '-' + pad(dateObj.getDate())
	+ 'T' + pad(dateObj.getHours())
	+ ':' + pad(dateObj.getMinutes()) 
	//+ ':' + pad(dateObj.getSeconds())
	+ ':00'
	//+'Z' ;
	+ getUserOffset( userTimeZone );
}

function getUserOffset(s) {
	var ms = s % 1000;
	s = (s - ms) / 1000;
	var secs = s % 60;
	s = (s - secs) / 60;
	var mins = s % 60;
	var hrs = (s - mins) / 60;
	var absHrs = Math.abs(Math.floor(hrs));
	return (hrs>=0 ? '+' : '-' ) + (absHrs <10 ? '0'+absHrs :absHrs) + ':' + (mins <10 ? '0'+mins : mins) ;
}

j$("#success-alert").fadeTo(45000, 1).slideUp("slow", function(){
	j$("#success-alert").alert('close');
}); 
skinnyFlexTableApp.factory('Scopes', function ($rootScope) {
    var mem = {};
 
    return {
        store: function (key, value) {
            $rootScope.$emit('scope.stored', key);
            mem[key] = value;
        },
        get: function (key) {
            return mem[key];
        }
    };
});
