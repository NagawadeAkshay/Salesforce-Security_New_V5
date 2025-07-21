var j$ = jQuery.noConflict();  
var GaugeApp = angular.module(chartGaugeAngular_chartHTMLId,[]); 

GaugeApp.controller('GaugeChartAppCtrl',function ($scope,$q,$filter) {
	var chartId = chartGaugeAngular_chartHTMLId;
	var currentFY = chartGaugeAngular_currentFiscalYear;
	var fiscalYear = ''; 
	var division = '';
	var phaseNameParam = chartGaugeAngular_phaseNameParam;

	$scope.isEnhancedView = chartGaugeAngular_isEnhancedView;
	$scope.chartId = chartGaugeAngular_chartHTMLId;  
	$scope.cName = chartGaugeAngular_chartName;
	$scope.isDashboard = false;   
	$scope.newFilterClause = ''; 

	//if(phaseNameParam.indexOf('Dashboard') != -1){
		phaseNameParam =   chartGaugeAngular_phaseParam;
		if(!phaseNameParam){
			phaseNameParam = chartGaugeAngular_defaultPhase;
		}
		$scope.isDashboard = true;
		if(fiscalYear != ''){ 
			var fyStr =  ' (' + fiscalYear.split('-').join(',') + ') ';
			$scope.newFilterClause = '{yearfilterclause} ' + fyStr;
		}
	//}

	$scope.initGaugeChartData = function(){     
		//var deferred = $q.defer();
		if(chartGaugeAngular_contextRecordId == ''){ 
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartGaugeAngularActions.fetchInitialData,$scope.cName,phaseNameParam,chartId,$scope.isDashboard,$scope.newFilterClause,               
				$scope.paintGaugeAngularChart,
				{buffer: false, escape: false}
			); 
		}
		else{
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartGaugeAngularActions.fetchInitDataWithRecordId,$scope.cName,phaseNameParam,chartId,$scope.isDashboard,$scope.newFilterClause,chartGaugeAngular_contextRecordId,               
				$scope.paintGaugeAngularChart,
				{ buffer: false, escape: false, timeout: 30000 }
			); 
		}
		//return deferred.promise;
	}

	$scope.paintGaugeAngularChart = function(result, event){
		if(event.status){
			$scope.$apply(function () {
				//deferred.resolve(result);
				$scope.isAdmin = result.IsAdmin;
				$scope.title = result.Title;
				$scope.resultTable = result;
				$scope.HeaderStyle= (result.HeaderStyle == null || result.HeaderStyle == '') ? 'Horizontal' : result.HeaderStyle;   //UI-Shrawan-11022015 handling null cases
				$scope.records = result;
				$scope.isPhase= result.isPhase;
				if($scope.isEnhancedView == 'true'){
					$scope.isPhase = false;                             
					$scope.ChartTitle = result.Title;
					$scope.EnableExporting = true;                              
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
		$scope.constructChart('#chart'+result.chartId,result,result.FormatterPrefix);
	}

	$scope.constructChart = function(chartId,result,formatter) {
		j$(chartId).highcharts({
			chart: {
				type: 'gauge',
				height : $scope.chartHeight
			},
			title: {
				text: $scope.ChartTitle
			},
			tooltip: {
				valueSuffix: formatter,
				formatter: function() {
					tooltipVal = '<b>'+this.series.name+'</b>' ;
					if(formatter == '$'){                           
						tooltipVal += ' : <b>'+ $filter('currency')(this.point.y, '$') +'</b>';
					}else{                      
						tooltipVal += ' : <b>'+ this.point.y +'</b>';
					} 
					return tooltipVal;
				}
			},
			plotOptions : {
				gauge : {
					stickyTracking : false
				}
			},
			pane: {
				startAngle: -150,
				endAngle: 150,
				background: [{
					backgroundColor: {
						linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
						stops: [
							[0, '#FFF'],
							[1, '#333']
						]
					},
					borderWidth: 0,
					outerRadius: '109%'
				}, {
					backgroundColor: {
						linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
						stops: [
							[0, '#333'],
							[1, '#FFF']
						]
					},
					borderWidth: 1,
					outerRadius: '107%'
				}, {
					// default background
				}, {
					backgroundColor: '#DDD',
					borderWidth: 0,
					outerRadius: '100%',
					innerRadius: '100%'
				}]
			},

			// the value axis
			yAxis: {
				min: 0,
				max: $scope.totalValue == 0? 200:$scope.totalValue,
				minorTickInterval: 'auto',
				minorTickWidth: 1,
				minorTickLength: 10,
				minorTickPosition: 'inside',
				minorTickColor: '#666',
				tickPixelInterval: 30,
				tickWidth: 2,
				tickPosition: 'inside',
				tickLength: 10,
				tickColor: '#666',
				labels: {
					step: 2,
					rotation: 'auto'
				},
				title: {
					text: $scope.TableHeader
				},
				plotBands: [{
					from: 0,
					to: $scope.HalfOfTotal,
					color: '#55BF3B' // green
				}, {
					from: $scope.HalfOfTotal,
					to: $scope.HalfOfTotal+$scope.OneForuthOfTotal,
					color: '#DDDF0D' // yellow
				}, {
					from: $scope.HalfOfTotal+$scope.OneForuthOfTotal,
					to: $scope.totalValue,
					color: '#DF5353' // red
				}]
			},
			credits :{
				enabled :false
			},
			exporting :{
				enabled : $scope.EnableExporting
			},

			series: [{
				name : $scope.TableHeader,
				data: [$scope.actualValue]                
			}]
		} 
		);
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