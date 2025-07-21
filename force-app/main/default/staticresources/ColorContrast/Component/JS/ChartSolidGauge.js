var j$ = jQuery.noConflict();
//var GaugeApp = angular.module(chartSolidGauge_chartHTMLId,[]);
GaugeApp.controller('GaugeChartAppCtrl',function ($scope, $q, $filter, Scopes) {
	Scopes.store('GaugeChartAppCtrl', $scope);
	var chartId = Scopes.get('MasterGaugeChartAppCtrl').chartSolidGauge_chartHTMLId;
	var currentFY = Scopes.get('MasterGaugeChartAppCtrl').chartSolidGauge_currentFiscalYear;
	var fiscalYear = ''; 
	var division = '';
	var phaseNameParam = Scopes.get('MasterGaugeChartAppCtrl').chartSolidGauge_phaseNameParam;
	$scope.isEnhancedView = Scopes.get('MasterGaugeChartAppCtrl').chartSolidGauge_isEnhancedView;
	$scope.chartId = Scopes.get('MasterGaugeChartAppCtrl').chartSolidGauge_chartHTMLId;
	$scope.cName = Scopes.get('MasterGaugeChartAppCtrl').chartSolidGauge_chartName;
	$scope.isDashboard = false;
	$scope.newFilterClause = '';
	fiscalYear = Scopes.get('MasterGaugeChartAppCtrl').chartSolidGauge_fiscalYear;
	$scope.chartSolidGauge_contextRecordId = Scopes.get('MasterGaugeChartAppCtrl').chartSolidGauge_contextRecordId;
	
	//if(phaseNameParam.indexOf('Dashboard') != -1){
		phaseNameParam = Scopes.get('MasterGaugeChartAppCtrl').chartSolidGauge_phaseParam;
		if(!phaseNameParam){
			phaseNameParam = Scopes.get('MasterGaugeChartAppCtrl').chartSolidGauge_defaultPhase;
		}
		$scope.isDashboard = true;
		if(fiscalYear != ''){
			var fyStr =  ' (' + fiscalYear.split('-').join(',') + ') ';
			$scope.newFilterClause = '{yearfilterclause} ' + fyStr;
		}
	//}

	$scope.initGaugeChartData = function(){		
		if($scope.chartSolidGauge_contextRecordId == ''){
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartSolidGaugeActions.fetchInitialData,$scope.cName,phaseNameParam,chartId,$scope.isDashboard,$scope.newFilterClause,
				$scope.paintGaugeSolidChart,
				{buffer: false, escape: false}
			);
		}
		else{
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartSolidGaugeActions.fetchInitDataWithRecordId,$scope.cName,phaseNameParam,chartId,$scope.isDashboard,$scope.newFilterClause,$scope.chartSolidGauge_contextRecordId,
				$scope.paintGaugeSolidChart,
				{ buffer: false, escape: false, timeout: 30000 }
			);
		}		
	}

	$scope.paintGaugeSolidChart = function(result, event){
		if(event.status){
			$scope.$apply(function () {				
				$scope.isAdmin = result.IsAdmin;
				$scope.title = result.Title;
				$scope.resultTable = result;
				$scope.HeaderStyle= result.HeaderStyle;
				$scope.records = result;
				$scope.isPhase= result.isPhase;
				if($scope.isEnhancedView == 'true'){
					$scope.isPhase = false;
					$scope.ChartTitle = result.Title;
					$scope.EnableExporting = true;
					$scope.chartHeight = 450;
				}else{
					$scope.ChartTitle = '';
					$scope.EnableExporting = false;
				}
				$scope.TableHeader = result.TableHeader;
				if($scope.isPhase){
					$scope.chartHeight = 220;	//250
				}else if($scope.isEnhancedView == 'true'){
					$scope.chartHeight = 450;
				}else{
					$scope.chartHeight = 220;	//230
				}
				$scope.totalValue = result.Total;
				$scope.actualValue = result.Actual;				
				$scope.OneForuthOfTotal = $scope.totalValue/4;
				$scope.HalfOfTotal = $scope.totalValue/2;
			});
		}		
		$scope.constructChart('#chart'+result.chartId,result,result.chartId.trim());
	}
	
	$scope.constructChart = function(chartId,result,modalId) {	
		var maxValue = $scope.totalValue;		
		j$(chartId).height($scope.chartHeight);
		j$(chartId).highcharts({
			chart: {
				type: 'solidgauge'
			},
			title:null,
			pane: {
				center: ['50%', '85%'],
				size: '140%',
				startAngle: -90,
				endAngle: 90,
				background: {
					backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
					innerRadius: '60%',
					outerRadius: '100%',
					shape: 'arc'
				}
			},
			tooltip: {
				enabled: false
			},
			yAxis: {
				stops: [
					[0.1, '#55BF3B'], // green
					[0.5, '#DDDF0D'], // yellow
					[0.9, '#DF5353'] // red
				],
				lineWidth: 0,
				minorTickInterval: null,
				tickPixelInterval: 400,
				tickWidth: 0,
				title: {
					y: -82,
					text: $scope.TableHeader                        
				},
				labels: {
					y: 16,
				},
				min: 0,
				max: maxValue,
				tickPositions: [0, maxValue]
			},
			plotOptions: {
				solidgauge: {
					dataLabels: {
						y: 5,
						borderWidth: 0,
						useHTML: true
					}
				}
			},
			credits: {
				enabled: false
			},
			series: [{
				name: $scope.TableHeader,
				data: [$scope.actualValue]                                                     
			}]
		});          
	};
	$scope.initGaugeChartData();
	/* Filter Functions */
	$scope.fetchData = function(phaseNameParam ,filterClause,cName,chartId){
		$scope.newFilterClause =  filterClause;
		$scope.cName = cName;
		phaseNameParam = phaseNameParam;
		$scope.chartId = chartId;
		$scope.initGaugeChartData ();
	}
});
GaugeApp.factory('Scopes', function ($rootScope) {
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