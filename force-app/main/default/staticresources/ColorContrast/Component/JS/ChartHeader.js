var j$ = jQuery.noConflict();
function closeRecordsModal(modalId){	
	j$('#'+modalId+'recordsModal').addClass(' ');
	j$('#'+modalId+'recordsModal').css('display', 'none');
	j$('#'+modalId+'recordsModal').attr('aria-hidden', 'true');
}

function closeEnhancedViewModal(modalId){
	j$('#'+modalId).addClass(' ');
	j$('#'+modalId).css('display', 'none');
	j$('#'+modalId).attr('aria-hidden', 'true');
	j$('#enahncedView').attr('src','');
}

function updateIframeSource(chartId,chartNameParam,chartTypeName) {
	j$('#enahncedView'+chartId).attr('src','/apex/'+chartHeader_namespace+'ChartsEnhancedView?chartId='+chartId+'&chartName='+chartNameParam+'&chartType='+chartTypeName+'&isEnhanced=true');
}

var asideAppCtrl = function ($scope, $q){
	var phaseNameParam = chartHeader_phaseNameParam;
	$scope.aside = {title: 'Title', content: 'Hello Aside<br />This is a multiline message!'};
	$scope.columns = [];
	$scope.inputTextFilterOptions = ["Contains","Starts with","Ends with"];
	$scope.picklistFilterOptions = ["Equals","Not equals"];
	$scope.defaultPicklistValue = '';
	$scope.showDropdown = false;
	$scope.pickListMap = {};
	$scope.filterMap = {};
	$scope.chartName = chartHeader_chartNameParam;
	$scope.chartId = chartHeader_chartId;	
	
	if(phaseNameParam.indexOf('Dashboard') != -1){
		phaseNameParam =  chartHeader_parametersPhase;
		if(!phaseNameParam){
			phaseNameParam = chartHeader_defaultPhase;
		}
	}
	var userPrefId = chartHeader_userPrefId;
	var retURL = chartHeader_retURL;
	var phaseNameFromURL = chartHeader_phaseNameParam;
	$scope.openRecord = function(recordId){	
		window.open('/'+recordId, '_blank');
	}
	$scope.openHelp =function(){
		window.open('/apex/Help?id='+$scope.Help, '_blank','width=900, height=700')
	}
	$scope.openManageChartPage = function(){		
		window.open('/apex/'+chartHeader_namespace+'ChartPreferenceEdit?nonAdminCall=true&id='+chartHeader_userPrefId+'&phaseName='+phaseNameFromURL+'&retURL='+retURL,'_blank','width=1400, height=500');
	}

	$scope.openMetaData = function(){
		window.open('/'+$scope.resultTable.chartSFId);
	}
	
	$scope.initFilterHandler = function(){
		var deferred = $q.defer();
		Visualforce.remoting.Manager.invokeAction(
			_RemotingChartsAsideFilterActions.initPieChartFilterData ,
			$scope.chartName, phaseNameParam,
			function(result, event){
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(result);						
						$scope.NoFilters = result.NoFilters;
						for(field in result){
							$scope.columns.push({"field":result[field].field, "displayName":result[field].filterFieldLabel, "type" : result[field].filterFieldType});							
							if(result[field].filterFieldType == 'PICKLIST'){
								$scope.pickListMap[field] = result[field].picklistValues;
							}							
						}
					});
				}else if (event.type == 'exception') {
					//console.log('Exception');
				}
			},
			{ buffer: false, escape: false, timeout: 30000 }
		);
		return deferred.promise;
	}

	$scope.filterStringRecords = function(fieldName,criteria,searchTerm){
		var conditionString = '';
		if(fieldName != '' && criteria != '' && searchTerm != undefined){
			if(criteria == 'Contains'){
				conditionString = fieldName + ' LIKE \'%' +  searchTerm + '%\'';
				$scope.filterMap[fieldName] = conditionString;
			}else if(criteria == 'Ends with'){
				conditionString = fieldName+ ' LIKE \'%' +  searchTerm + '\'';
				$scope.filterMap[fieldName] = conditionString;
			}else if(criteria == 'Starts with'){
				conditionString = fieldName+ ' LIKE \'' +  searchTerm + '%\'';
				$scope.filterMap[fieldName] = conditionString;
			}else if(criteria == 'Equals'){
				conditionString = fieldName+ ' = \'' +  searchTerm + '\'';
				$scope.filterMap[fieldName] = conditionString;
			}else if(criteria == 'Not equals'){
				conditionString = fieldName+ ' != \'' +  searchTerm + '\'';
				$scope.filterMap[fieldName] = conditionString;
			}
		}		
	};
	$scope.filterRangeRecords = function(field,fromField,toField){
		var conditionString = '';
		if(fromField != undefined && toField != undefined){
			conditionString = field + ' >= ' +  fromField + ' AND ' + field + ' <= ' + toField;
			$scope.filterMap[field] = conditionString;
		}else if(fromField != undefined && toField == undefined){
			conditionString = field + ' >= ' +  fromField;
			$scope.filterMap[field] = conditionString;
		}else if(fromField == undefined && toField != undefined){
			conditionString = field + ' <= ' + toField;
			$scope.filterMap[field] = conditionString;
		}		
	};

	$scope.filterDateRecords = function(field,fromDate,toDate){
		var conditionString = '';		
		if(fromDate != undefined && toDate != undefined){
			var fromDateVal = fromDate.getDate();
			var fromMonthVal = fromDate.getMonth()+1;
			var fromYearVal = fromDate.getFullYear();
			var fromDisplayDate = fromMonthVal + '/' + fromDateVal + '/' + fromYearVal;
			var toDateVal = toDate.getDate();
			var toMonthVal = toDate.getMonth()+1;
			var toYearVal = toDate.getFullYear();
			var toDisplayDate = toMonthVal + '/' + toDateVal + '/' + toYearVal ;
			conditionString = ' CALENDAR_YEAR(' + field + ')' + ' >= ' +  fromYearVal + ' AND ' + ' CALENDAR_YEAR(' + field + ')' + ' <= ' + toYearVal;
			conditionString += ' AND CALENDAR_MONTH(' + field + ')' + ' >= ' +  fromMonthVal + ' AND ' + ' CALENDAR_MONTH(' + field + ')' + ' <= ' + toMonthVal ;
			conditionString += ' AND DAY_IN_MONTH(' + field + ')' + ' >= ' +  fromDateVal + ' AND ' + ' DAY_IN_MONTH(' + field + ')' + ' <= ' + toDateVal ;
			$scope.filterMap[field] = conditionString;
		}		
	};

	$scope.filterBooleanRecords = function(field,filterTerm){
		var conditionString = field + ' = ' +  filterTerm;
		$scope.filterMap[field] = conditionString;		
	};
	$scope.clearAllFilter = function(){
		$scope.filterMap = {};
		//$scope.newFilterClause = $scope.filterClause;
		$scope.showFilterPane = false;
	};
	$scope.removeFilter = function(field){
		delete $scope.filterMap[field];		
		if(_.size(angular.copy($scope.filterMap)) == 0){
			$scope.showFilterPane = false;			
		}
		$scope.refreshAfterFilter();
	};
	$scope.filterRecords = function(){
		$scope.showFilterPane = true;
		$scope.refreshAfterFilter();
	};
	$scope.refreshAfterFilter = function(){
		var filterString = '';		
		var filterMapSize = _.size(angular.copy($scope.filterMap));
		if(filterMapSize > 0){
			for(filter in $scope.filterMap){
				filterString += ' AND '+ $scope.filterMap[filter];
			}
			if($scope.filterClause != null && $scope.filterClause != '') {
				$scope.newFilterClause = $scope.filterClause + filterString;
			}else{
				$scope.newFilterClause = filterString.substring(4,filterString.length);
			}
		}		
		$scope.fetchData(phaseNameParam ,$scope.newFilterClause,$scope.chartName,$scope.chartId);		
		$scope.clearAllFilter();
	};	
	$scope.initFilterHandler();
}