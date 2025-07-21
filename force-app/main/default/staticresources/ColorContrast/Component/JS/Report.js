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

var reportApp = angular.module('reportApp', ['ui.bootstrap']);
reportApp.controller('reportController', function ($q,$scope,$timeout,$modal, $log,$element,$window,$sce,$location) {
	$scope.defaultFiscalValue = ''; 
	$scope.fiscalYearOptions = []; 
	// $scope.searchTerm = '';
	$scope.prefix = report_Namespace;
	$scope.listViewOptions = [];
	$scope.showDropdown = false;	
	$scope.defaultPhase = {};
  	
	if( report_division != '' &&  report_division != undefined && report_division != 'undefined'){		
		var spans = document.getElementsByClassName('select2-chosen');
		if(spans.length > 0){
			spans[0].innerHTML = report_division; 
		}
	} 
	
	///////////////////////////////////////////////////////
	$scope.initPhasesDropdown = function(){
		var deferred = $q.defer();		
		Visualforce.remoting.Manager.invokeAction(
			_RemotingReportsActions.initPhases,
			function(result, event){
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(result);						
						if(report_phase != ''){
							$scope.defaultPhase = {name: report_phase};
						}else
						{
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
	
	$scope.selectedPhases = [];
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
		var divisionName = report_division;
		result = '/apex/Report?t=Report&phase=' + phaseStr + '&Organization=' + orgStr + '&FiscalYear=' + yearStr + '&Division=' + divisionName;
		return result;
	}
	$scope.phaseFilterLabel = '';
	$scope.hasFilter = false;     
	// Load selected fitlers along with filter labels
	$scope.loadSelectFilters = function() {
		var selectedPhase = report_phase;
		if(undefined != selectedPhase && '' != selectedPhase) {
			$scope.hasFilter = true;
			$scope.selectedPhases = selectedPhase.split("-");			
			var phaseString = selectedPhase.split("-").join(",");
			$scope.phaseFilterLabel = 'Selected Phases: ' + phaseString + ';';
		}
		
		var selectedOrg = report_Organization;
		if(undefined != selectedOrg && '' != selectedOrg) {
			$scope.hasFilter = true;
			$scope.selectedOrgs = selectedOrg.split("-");			
			var orgString = selectedOrg.split("-").join(",");
			$scope.orgFilterLabel = 'Selected Organization: ' + orgString + ';';
		}
		
		var selectedYear = report_fiscalYear;
		if(undefined != selectedYear && '' != selectedYear) {
			$scope.hasFilter = true;
			$scope.selectedFYs = selectedYear.split("-");			
			var yearString = selectedYear.split("-").join(",");
			$scope.yearFilterLabel = 'Selected Fiscal Year: ' + yearString + ';';
		}
	}
	
	// For close icon on the filter labels
	$scope.clearSingleFilter = function(inptStr) {
		$scope[inptStr] = [];
		window.location.href = $scope.addFilterToURL();
	}
	
	$scope.clearAllFitler = function() {
		// Reset all filter to default
		window.location.href = '/apex/Report?t=Report';
	}
	
//////////////////////////////////////////////////////////////////       
	 
	$scope.setUrlFilterParameters = function(){		
		var spans = document.getElementsByClassName('select2-chosen');
		var searchTerm = '';
		if(spans.length > 0){
			//console.log(spans[0].innerHTML);
			if(spans[0].innerHTML != 'Start typing for auto complete'){
				searchTerm = spans[0].innerHTML;
			}			
		}
		if(searchTerm != undefined && searchTerm != null && searchTerm != 'null' && searchTerm != '' ){
			divisionName = searchTerm;
		}else{
			divisionName = report_division;
		}		
		// 10/20/2015 Swati - change to new filters
		//window.location.href = '/apex/Report?FiscalYear='+$scope.defaultFiscalValue+'&Division='+divisionName;
		window.location.href = $scope.addFilterToURL();		 
	} 
	
	$scope.initFiscalYear = function(){  
		var deferred = $q.defer(); 
		Visualforce.remoting.Manager.invokeAction(
			_RemotingReportsActions.GetFiscalYearValues,
			function(result, event){
				if (event.status) {
						$scope.$apply(function () {
							deferred.resolve(result);
							$scope.fiscalYearOptions = result.FiscalYearValues;
							if(report_fiscalYear != ''){
								$scope.defaultFiscalValue = report_fiscalYear;
							}else{
								$scope.defaultFiscalValue = result.currentFiscalYear;
							}
						});                                                                                                            
				}else if (event.type == 'exception') {
						////console.log('Exception');
				}
			}, 
			{ buffer: false, escape: false, timeout: 30000 }
		); 
		return deferred.promise;
	}    
	$scope.items = function(searchTerm,inputVal) {                                
		var deferred = $q.defer();  
		Visualforce.remoting.Manager.invokeAction(
			_RemotingReportsActions.GetTypeAheadRecords ,
			searchTerm,'Account','Name', true,
			function(sideBarSearchResult, event){                         
				if (event.status) {
					$scope.$apply(function () {                                                                                              
						deferred.resolve(sideBarSearchResult.Records);  
						//////console.log('sideBarSearchResult.Records',sideBarSearchResult.Records);                                                                 
					});                                                                                                             
				}                                                                         
			}, 
			{ buffer: false, escape: false, timeout: 30000 }
		);
		return deferred.promise;                                           
	};
	// Execute on page load
	$scope.initFiscalYear();
	$scope.initPhasesDropdown();
	$scope.loadSelectFilters();
});
