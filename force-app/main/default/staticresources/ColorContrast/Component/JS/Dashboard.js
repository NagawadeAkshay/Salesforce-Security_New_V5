function getCharts(phase){
	getChartsPerPhase(phase);
}

/* Helper function to remove element from array */
function arrayRemove(arr) {
	var what, a = arguments, L = a.length, ax;
	while (L > 1 && arr.length) {
		what = a[--L];
		while ((ax= arr.indexOf(what)) !== -1) {
			arr.splice(ax, 1);
		}
	}
	return arr;
}

var dashboardsApp = angular.module('DashboardsApp', ['ui.bootstrap']);
dashboardsApp.controller('DashboardsController',function ($scope, $q) {	
	$scope.prefix = dashboard_Namespace;
	$scope.listViewOptions = [];
	$scope.showDropdown = false;	
	$scope.defaultPhase = {};
	$scope.fiscalYearList = dashboard_FYList;
	
	$scope.initPhasesDropdown = function(){
		var deferred = $q.defer();		
		Visualforce.remoting.Manager.invokeAction(
			_RemotingDashboardsActions.initPhases,
			function(result, event){
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(result);						
						if(dashboard_phase != ''){
							$scope.defaultPhase = {name: dashboard_phase};
						}else{
							$scope.defaultPhase = {name: result.defaultPhaseName, label: result.defaultPhaseLabel};
						}
						if(result.phasesString != 'undefined' && result.phasesString != undefined){
							$scope.listViewOptions = result.phasesString;							
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

	$scope.defaultFiscalValue = '';
	if( dashboard_division != '' &&  dashboard_division != undefined && dashboard_division != 'undefined'){		
		var spans = document.getElementsByClassName('select2-chosen');
		if(spans.length > 0){
			spans[0].innerHTML = dashboard_division;
		}
	}
	
	$scope.selectedPhases = [];
	$scope.selectedOrgs = [];
	$scope.selectedFYs = [];
	
	// Setting filters for each dropdown when checkbox is selected. Disable function on <a>
	$scope.setSelectPhase = function(inptVal, event) {
		if(event.target.type == 'checkbox') {
			if(event.target.checked) {
				if('All' == inptVal) {
					// If 'All' is selected clear other selection
					j$(event.target).parent().parent().siblings().children('a').children('input').attr('checked', false);
					$scope.selectedPhases = [];
				}else {
					// If phase is selected after 'All' is selected, clear 'All'
					j$(event.target).parent().parent().siblings().children("a:contains('ALL')").children('input').attr('checked', false);
					$scope.selectedPhases = arrayRemove($scope.selectedPhases, 'All');
				}
				
				$scope.selectedPhases.push(inptVal);
			}else {
				$scope.selectedPhases = arrayRemove($scope.selectedPhases, inptVal);
			}
		}
		
		event.stopPropagation();
		return false;
	}
	
	$scope.setSelectOrganization = function(inptVal, event) {
		if(event.target.type == 'checkbox') {
			if(event.target.checked) {
				$scope.selectedOrgs.push(inptVal);
			}else {
				$scope.selectedOrgs = arrayRemove($scope.selectedOrgs, inptVal);
			}
		}
		
		event.stopPropagation();
		return false;
	}
	
	$scope.setSelectYear = function(inptVal, event) {
		if(event.target.type == 'checkbox') {
			if(event.target.checked) {
				$scope.selectedFYs.push(inptVal.toString());
			}else {
				$scope.selectedFYs = arrayRemove($scope.selectedFYs, inptVal.toString());
			}
		}
		
		event.stopPropagation();
		return false;
	}
	
	// For ng-checked on each option
	$scope.isSelected = function(inpt, type) {
		var index;
		if(type == 'phase') {
			index = j$.inArray(inpt, $scope.selectedPhases);
		}else if(type == 'org') {
			index = j$.inArray(inpt, $scope.selectedOrgs);
		}else if (type == 'fy') {
			index = j$.inArray(inpt.toString(), $scope.selectedFYs);
		}else {
			return false;
		}
		
		return (index >= 0);
	}

	$scope.addFilterToURL = function() {
		var result, phaseStr, orgStr, yearStr;
		if(undefined != $scope.selectedPhases && $scope.selectedPhases.length > 0) {
			phaseStr = $scope.selectedPhases.join('-');
		}else {
			phaseStr = '';
		}
		if(undefined != $scope.selectedOrgs && $scope.selectedOrgs.length > 0) {
			orgStr = $scope.selectedOrgs.join('-');
		}else {
			orgStr = '';
		}
		if(undefined != $scope.selectedFYs && $scope.selectedFYs.length > 0) {
			yearStr = $scope.selectedFYs.join('-');
		}else {
			yearStr = '';
		}
		
		var divisionName = dashboard_division;
		
		result = '/apex/Dashboard?t=Dashboard&phase=' + phaseStr + '&Organization=' + orgStr + '&FiscalYear=' + yearStr + '&Division=' + divisionName;
		//console.log('Dashboard URL after filters: ' + result);
		
		return result;
	}
	
	$scope.phaseFilterLabel = '';
	$scope.orgFilterLabel = '';
	$scope.yearFilterLabel = '';
	
	$scope.hasFilter = false;
	
	// Load selected fitlers along with filter labels
	$scope.loadSelectFilters = function() {
		var selectedPhase = dashboard_phase;
		if(undefined != selectedPhase && '' != selectedPhase) {
			$scope.hasFilter = true;
			$scope.selectedPhases = selectedPhase.split("-");
			
			var phaseString = selectedPhase.split("-").join(",");
			$scope.phaseFilterLabel = 'Selected Phases: ' + phaseString + ';';
		}
		
		var selectedOrg = dashboard_Organization;
		if(undefined != selectedOrg && '' != selectedOrg) {
			$scope.hasFilter = true;
			$scope.selectedOrgs = selectedOrg.split("-");
			
			var orgString = selectedOrg.split("-").join(",");
			$scope.orgFilterLabel = 'Selected Organization: ' + orgString + ';';
		}
		
		var selectedYear = dashboard_FiscalYear;
		if(undefined != selectedYear && '' != selectedYear) {
			$scope.hasFilter = true;
			$scope.selectedFYs = selectedYear.split("-");
			
			var yearString = selectedYear.split("-").join(",");
			$scope.yearFilterLabel = 'Selected Created Year: ' + yearString + ';';
		}
	}
	
	// For close icon on the filter labels
	$scope.clearSingleFilter = function(inptStr) {
		$scope[inptStr] = [];
		window.location.href = $scope.addFilterToURL();
	}
	
	$scope.clearAllFitler = function() {
		// Reset all filter to default
		window.location.href = '/apex/Dashboard?t=Dashboard';
	}

	$scope.setUrlFilterParameters = function(){
		$scope.extraParameters = '?pv0='+$scope.defaultFiscalValue;		
		var spans = document.getElementsByClassName('select2-chosen');
		var searchTerm = '';
		if(spans.length > 0){
			//console.log(spans[0].innerHTML);
			searchTerm = spans[0].innerHTML;
			//console.log('searchTerm >>', searchTerm );
		}
		if(searchTerm != undefined && searchTerm != null && searchTerm != 'null' && searchTerm != '' ){
			divisionName = searchTerm;
		}else{
			divisionName = dashboard_division;
		}		
		
		// 10/11/2015 Xiang - change to new filters
		//window.location.href = '/apex/Dashboard?t=Dashboard&phase='+$scope.defaultPhase.name+'&FiscalYear='+$scope.defaultFiscalValue+'&Division='+divisionName;
		window.location.href = $scope.addFilterToURL();
	}

	$scope.initFiscalYear = function(){
		var deferred = $q.defer();
		Visualforce.remoting.Manager.invokeAction(
			_RemotingDashboardsActions.GetFiscalYearValues,
			function(result, event){
				if (event.status) {
						$scope.$apply(function () {
							deferred.resolve(result);
							$scope.fiscalYearOptions = result.FiscalYearValues;
							if(dashboard_FiscalYear !=''){
								$scope.defaultFiscalValue = dashboard_FiscalYear;
							}else{
								$scope.defaultFiscalValue = result.currentFiscalYear ;
							}
							//console.log('$scope.fiscalYearOptions ', $scope.fiscalYearOptions);
						});
				}else if (event.type == 'exception') {
						//console.log('Exception');
				}
			},
			{ buffer: false, escape: false, timeout: 30000 }
		);
		return deferred.promise;
	}
	$scope.items = function(searchTerm,inputVal) {
		var deferred = $q.defer();
		Visualforce.remoting.Manager.invokeAction(
			_RemotingDashboardsActions.GetTypeAheadRecords ,
			searchTerm,'Account','Name', true,
			function(sideBarSearchResult, event){
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(sideBarSearchResult.Records);
						if(sideBarSearchResult.Records.length > 1){
							document.getElementById('DashboardsApp').style.height="500px";
						  }
						/////console.log('sideBarSearchResult.Records',sideBarSearchResult.Records);
					});
				}
			},
			{ buffer: false, escape: false, timeout: 30000 }
		);
		return deferred.promise;
	};

	$scope.goBtnHandler = function(){
	   $scope.showDropdown = false;
	}
	
	// Execute on page load
	$scope.initFiscalYear();
	$scope.initPhasesDropdown();
	$scope.loadSelectFilters();
});