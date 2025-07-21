//var j$ = jQuery.noConflict();
//var StackedColumnChartApp = angular.module(chartGroupStackedBar_chartHTMLId,[]);

GroupStackedBarChartApp.controller('GroupStackedBarChartAppCtrl',function ($scope, $q, $filter, Scopes) {
	Scopes.store('GroupStackedBarChartAppCtrl', $scope);
	var currentFY = Scopes.get('MasterGroupStackedBarChartAppCtrl').chartGroupStackedBar_currentFiscalYear;
	var phaseNameParam = Scopes.get('MasterGroupStackedBarChartAppCtrl').chartGroupStackedBar_phaseNameParam;
	$scope.chartGroupStackedBar_contextRecordId = Scopes.get('MasterGroupStackedBarChartAppCtrl').chartGroupStackedBar_contextRecordId;
	var fiscalYear = '';
	var division = '';
	var j$ = jQuery.noConflict();
	var chart;
	var isDashboard = false;
	
	$scope.chartId = Scopes.get('MasterGroupStackedBarChartAppCtrl').chartGroupStackedBar_chartHTMLId;
	$scope.resultTable =[];
	$scope.cName = Scopes.get('MasterGroupStackedBarChartAppCtrl').chartGroupStackedBar_chartName;
	$scope.isEnhancedView = Scopes.get('MasterGroupStackedBarChartAppCtrl').chartGroupStackedBar_isEnhancedView;
	$scope.newFilterClause = '';
	
	//if(phaseNameParam.indexOf('Dashboard') != -1){
		phaseNameParam = Scopes.get('MasterGroupStackedBarChartAppCtrl').chartGroupStackedBar_phaseParam;
		if(!phaseNameParam){
			phaseNameParam = Scopes.get('MasterGroupStackedBarChartAppCtrl').chartGroupStackedBar_defaultPhase;
		}		
		isDashboard = true;
		fiscalYear = Scopes.get('MasterGroupStackedBarChartAppCtrl').chartGroupStackedBar_fiscalYear;
		division = Scopes.get('MasterGroupStackedBarChartAppCtrl').chartGroupStackedBar_division;
		if(fiscalYear != ''){
		var fyStr =  ' (' + fiscalYear.split('-').join(',') + ') ';
		$scope.newFilterClause = '{yearfilterclause} ' + fyStr;
		}		
	//}

	$scope.fetchInitialData = function(cName,chartId){	
		if($scope.chartGroupStackedBar_contextRecordId == ''){
			$scope.showDataLabel = !$scope.isPhase;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartGroupStackedBarActions.fetchInitialData,cName,phaseNameParam ,chartId,isDashboard,$scope.newFilterClause,
				paintBarStackedChart,
				{escape:false, buffer: false}
			);
		}else{
			$scope.showDataLabel = true;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartGroupStackedBarActions.fetchInitDataWithRecordId,cName,phaseNameParam ,chartId,isDashboard,$scope.newFilterClause,$scope.chartGroupStackedBar_contextRecordId,
				paintBarStackedChart,
				{escape:false, buffer: false}
			);
		}

		function paintBarStackedChart(result, event){
			if(event.status){
				$scope.$apply(function () {
					$scope.NoDataAvailable = (result.NoDataAvailable == 'true'? true : false);
					$scope.Charttitle = result.ChartTitle;
					$scope.title = result.Title;
					$scope.HeaderStyle= result.HeaderStyle;
					$scope.resultTable = result;
					$scope.records = result;
					$scope.dataTable = result.dataTable;
					$scope.Help = result.HelpId == undefined?false:result.HelpId;
					$scope.isAdmin = result.IsAdmin;
					$scope.isPhase = result.isPhase;
					$scope.xAxisLabel = result.Xaxis;
					$scope.yAxisLabel = result.Yaxis;
					if($scope.isEnhancedView == 'true'){
						$scope.isPhase = false;
						$scope.yAxisLabel = result.YaxisWholeLabel;
						$scope.xAxisLabel = result.XaxisWholeLabel;
						$scope.ChartTitle = result.Title;
						$scope.EnableExporting = true;
					}else{
						$scope.xAxisLabel = result.Xaxis;
						$scope.yAxisLabel = result.Yaxis;
						$scope.ChartTitle = '';
						$scope.EnableExporting = false;
					}				
					$scope.chartHeight;
					if($scope.isPhase){
						$scope.chartHeight = 220;	//250
					}else if($scope.isEnhancedView == 'true'){
						$scope.chartHeight = 450;
					}else{
						$scope.chartHeight = 220;	//230
					}
				});
				$scope.constructChart(JSON.parse(result.categoryJSONForLineChart),JSON.parse(result.Categories),result.FormatterPrefix,result.chartId,result.chartId.trim(),JSON.parse(result.seriesForLineChart));
			}
		}
	}
	$scope.fetchData = function(phaseNameParam ,filterClause,cName,chartId){
		$scope.newFilterClause =  filterClause;
		$scope.fetchInitialData (cName,chartId);
	}
	$scope.constructChart = function(result,resultCategories,formatterPrefix,chartId,modalId,seriesForLineChart){
		Highcharts.setOptions({ // Apply to all charts
			chart: {
				events: {
					beforePrint: function () {
						this.oldhasUserSize = this.hasUserSize;
						this.resetParams = [this.chartWidth, this.chartHeight, false];
						this.setSize(500, 800, false);
					},
					afterPrint: function () {
						this.setSize.apply(this, this.resetParams);
						this.hasUserSize = this.oldhasUserSize;
					}
				}
			}
		});

		j$('#chart'+ chartId).highcharts({
			chart:{
				type : 'bar',
				height : $scope.chartHeight,
				reflow: true
			},
			title : {
				text : $scope.ChartTitle
			},
			xAxis: {
				categories: resultCategories,
				title: {
					text: $scope.xAxisLabel,
					align : 'middle',
					style : {
						textOverflow: 'ellipsis',
						fontFamily: 'Helvetica'
					}
				},
				labels : {
					style : {
						textOverflow: 'ellipsis',
						fontSize : 10,
						fontFamily: 'Helvetica'
					}
				}
			},
			yAxis: {
				title: {
					text: $scope.yAxisLabel,
					align : 'middle',
					style : {
						textOverflow: 'ellipsis',
						fontFamily: 'Helvetica'
					}
				},
				labels : {
					style : {
						textOverflow: 'ellipsis',
						fontSize : 10,
						fontFamily: 'Helvetica'
					}
				}
			},
			tooltip: {
				valuePrefix : formatterPrefix,
				/*positioner: function () {
					return { x: 20, y: 40 };
				},*/
				shadow: false,
				backgroundColor: 'rgba(255,255,255,0.8)',
				style : {
					textOverflow: 'ellipsis',
					fontFamily: 'Helvetica'
				},
				formatter: function() {
					tooltipVal = '<b>' + this.series.name + '</b>';
					if(formatterPrefix == '$'){
						tooltipVal += ' : <b>'+ $filter('currency')(this.point.y, '$') +'</b>';
					}else{
						tooltipVal += ' : <b>'+ this.point.y +'</b>';
					}
					return tooltipVal;
				}
			},

			plotOptions: {
				series: {
					stacking: 'normal',
					events : {
						click: function(event) {
							//console.log('clciked 12----',this);
							j$('#'+modalId+'recordsModal').addClass('fade in');
							j$('#'+modalId+'recordsModal').css('display', 'block');
							j$('#'+modalId+'recordsModal').attr('aria-hidden', 'false');
						}
					}
				},
			},
			exporting : {
				enabled : $scope.EnableExporting,
				scale:1.85,
				buttons : {
					contextButton : {
						theme : {
							zIndex : 100
						}
					}
				}
			},
			legend: {
				enabled : false,
				layout: $scope.HeaderStyle == 'Horizontal' ? 'horizontal' : 'horizontal',
				align: $scope.HeaderStyle == 'Horizontal' ? 'center' : 'center',
				verticalAlign: $scope.HeaderStyle == 'Horizontal' ? 'bottom' : 'bottom',
				borderWidth: 0,
				itemStyle : {
					fontWeight : 'normal'
				},
				itemMarginTop: -10,
				itemMarginBottom : 10,
				floating : false,
				y: 10
			},
			credits: {
				enabled: false
			},
			series: seriesForLineChart
		});		
	}
	$scope.fetchInitialData($scope.cName,$scope.chartId);
});

GroupStackedBarChartApp.factory('Scopes', function ($rootScope) {
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