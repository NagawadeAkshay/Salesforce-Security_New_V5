//var ProgressChartApp= angular.module(chartProgress_chartHTMLId, ['ui.bootstrap','ngAnimate', 'ngSanitize', 'mgcrea.ngStrap']);
ProgressChartApp.controller('ChartProgressCtrl',function ($scope, $q, Scopes) {
	Scopes.store('ChartProgressCtrl', $scope);
	var isDashboard = false;
	var currentFY = Scopes.get('MasterChartProgressCtrl').chartProgress_currentFiscalYear;
	var fiscalYear = ''; 
	var division = '';
	var phaseNameParam = Scopes.get('MasterChartProgressCtrl').chartProgress_phaseNameParam; 
	$scope.chartId = Scopes.get('MasterChartProgressCtrl').chartProgress_chartHTMLId;  
	$scope.resultTable =[];
	$scope.cName = Scopes.get('MasterChartProgressCtrl').chartProgress_chartName;	
	$scope.newFilterClause = '';
	$scope.chartProgress_contextRecordId = Scopes.get('MasterChartProgressCtrl').chartProgress_contextRecordId;
	
	//if(phaseNameParam == 'Dashboard'){
		phaseNameParam =  Scopes.get('MasterChartProgressCtrl').chartProgress_phaseParam;
		if(!phaseNameParam){
			phaseNameParam = Scopes.get('MasterChartProgressCtrl').chartProgress_defaultPhase;
		}
		isDashboard = true;
		fiscalYear = Scopes.get('MasterChartProgressCtrl').chartProgress_fiscalYear;
		division = Scopes.get('MasterChartProgressCtrl').chartProgress_division;
		if(fiscalYear != ''){ 
			var fyStr =  ' (' + fiscalYear.split('-').join(',') + ') ';
			$scope.newFilterClause = '{yearfilterclause} ' + fyStr;
		}
	//}

	$scope.showRecords = function(resultBar){
		$scope.records = resultBar;		
		j$('#'+$scope.chartId+'recordsModal').addClass('fade in');
		j$('#'+$scope.chartId+'recordsModal').css('display', 'block');
		j$('#'+$scope.chartId+'recordsModal').attr('aria-hidden', 'false');
	}

	$scope.initProgressChartData = function(){     
		var deferred = $q.defer();
		if($scope.chartProgress_contextRecordId == ''){ 
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartProgressActions.fetchInitialData,$scope.cName,phaseNameParam,$scope.chartId,isDashboard,$scope.newFilterClause,    
				function(result, event){
					if (event.status) {
						$scope.$apply(function () {
							deferred.resolve(result);							
							$scope.title = result.Title;
							$scope.isPhase = result.isPhase;
							$scope.HeaderStyle= (result.HeaderStyle == null || result.HeaderStyle == '') ? 'Horizontal' : result.HeaderStyle;   
							$scope.chartStack = result.result;
							$scope.Help = result.HelpId == undefined?false:result.HelpId;
							$scope.resultTable = result;
							$scope.recordsTable = result;
							$scope.isAdmin = result.IsAdmin;
						});
					}else if (event.type == 'exception') {
						//console.log('Exception');
					}
				},
				{ buffer: false, escape: false, timeout: 30000 }
			); 
		}
		else{
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartProgressActions.fetchInitDataWithRecordId,$scope.cName,phaseNameParam,$scope.chartId,isDashboard,$scope.newFilterClause,$scope.chartProgress_contextRecordId,    
				function(result, event){
					if (event.status) {
						$scope.$apply(function () {
							deferred.resolve(result);							
							$scope.title = result.Title;
							$scope.isPhase = result.isPhase;
							$scope.HeaderStyle= (result.HeaderStyle == null || result.HeaderStyle == '') ? 'Horizontal' : result.HeaderStyle;   
							$scope.chartStack = result.result;
							$scope.Help = result.HelpId == undefined?false:result.HelpId;
							$scope.resultTable = result;
							$scope.recordsTable = result;
							$scope.isAdmin = result.IsAdmin;
						});
					}else if (event.type == 'exception') {
						//console.log('Exception');
					}
				},
				{ buffer: false, escape: false, timeout: 30000 }
			); 
		}
		return deferred.promise;
	}
	$scope.initProgressChartData();
	/* Filter Functions */
	$scope.fetchData = function(phaseNameParam ,filterClause,cName,chartId){
		$scope.newFilterClause =  filterClause;
		$scope.cName = cName;
		phaseNameParam = phaseNameParam;
		$scope.chartId = chartId;
		$scope.initProgressChartData ();
	}
	$scope.chartName = $scope.cName;
});

ProgressChartApp.factory('Scopes', function ($rootScope) {
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