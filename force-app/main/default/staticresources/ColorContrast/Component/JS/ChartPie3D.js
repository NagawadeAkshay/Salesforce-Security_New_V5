var j$ = jQuery.noConflict();
var Pie3DApp = angular.module(chartPie3D_chartHTMLId,['ui.bootstrap','ngAnimate', 'ngSanitize', 'mgcrea.ngStrap']);
Pie3DApp.controller('Pie3DChartAppCtrl',function ($scope, $q) {
	var currentFY = chartPie3D_currentFiscalYear;
	var phaseNameParam = chartPie3D_phaseNameParam; 
	$scope.chartId = chartPie3D_chartHTMLId;  	
	$scope.resultTable =[];
	$scope.cName = chartPie3D_chartName;        
	var chart;   
	$scope.Help;         
	$scope.isDashboard = false;    
	var fiscalYear = ''; var division = '';
	$scope.newFilterClause = '';
	if(phaseNameParam.indexOf('Dashboard') != -1){
		phaseNameParam = chartPie3D_phaseParam;
		if(!phaseNameParam){
			phaseNameParam = chartPie3D_defaultPhase;
		}
		$scope.isDashboard = true;
		if(fiscalYear != ''){ 
			var fyStr =  ' (' + fiscalYear.split('-').join(',') + ') ';
			$scope.newFilterClause = '{yearfilterclause} ' + fyStr;
		}
	}

	$scope.fetchInitialData = function(cName,chartId){		
		if(chartPie3D_contextRecordId == ''){
			$scope.showDataLabel = !$scope.isPhase;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartPie3DActions.fetchInitialData,cName,phaseNameParam ,chartId,$scope.isDashboard,$scope.newFilterClause,
				paintPie3DChart,
				{escape:false, buffer: false}
			);
		}else{
			$scope.showDataLabel = true;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartPie3DActions.fetchInitDataWithRecordId,cName,phaseNameParam ,chartId,$scope.isDashboard,$scope.newFilterClause,chartPie3D_contextRecordId,
				paintPie3DChart,
				{escape:false, buffer: false}
			);
		}

		function paintPie3DChart(result, event){
			if(event.status){
				$scope.$apply(function () {
					$scope.NoDataAvailable = (result.NoDataAvailable == 'true'? true : false);
					$scope.Charttitle = result.ChartTitle;
					$scope.title = result.Title;
					$scope.HeaderStyle = (result.HeaderStyle == null || result.HeaderStyle == '') ? 'Horizontal' : result.HeaderStyle;   //UI-Shrawan-11022015 handling null cases
					$scope.resultTable = result;
					$scope.isPhase = result.isPhase;
					$scope.isAdmin = result.IsAdmin;
					$scope.Help = result.HelpId == undefined?false:result.HelpId;								                      
				});                       
			}
			$scope.constructChart(eval(result.Data),'#chart'+result.chartId.trim(),result.FormatterPrefix,result.ChartTitle); 
		}
	}   
	$scope.constructChart = function(result,chartId,formatter,title){ 
		// Build the chart
		j$(chartId).highcharts({
			chart: {
				type: 'pie',
				marginBottom : 10,
				options3d: {
					enabled: true,
					alpha: 45,
					depth :15,
					beta: 0
				}
			},
			title: {
				text: null,
				y:5
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			},
			legend: {
				maxHeight: 40    
			},
			plotOptions: {
				pie: {
					size:160,
					depth: 30,
					dataLabels: {
						enabled: false,
						style: {
							fontWeight: 'bold',
							fontSize :'10',
							color: 'white'
						}
					},
					showInLegend: !$scope.isPhase
				}
			},
			credits :{
				enabled :false    
			},
			series: [{
				type: 'pie',
				data: result
			}]
		});
	}
	$scope.fetchData = function(phaseNameParam ,filterClause,cName,chartId){
		$scope.newFilterClause =  filterClause;
		$scope.fetchInitialData (cName,chartId);
	}
	$scope.chartName = chartPie3D_chartName;
	$scope.fetchInitialData(chartPie3D_chartName,chartPie3D_chartHTMLId);
});