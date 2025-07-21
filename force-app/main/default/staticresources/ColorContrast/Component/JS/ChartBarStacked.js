//var j$ = jQuery.noConflict();
StackedColumnChartApp.controller('StackedColumnChartAppCtrl',function ($scope, $q, $filter, Scopes) {
	Scopes.store('StackedColumnChartAppCtrl', $scope);
	var j$ = jQuery.noConflict();
	var currentFY = Scopes.get('MasterStackedColumnChartAppCtrl').chartBarStacked_currentFiscalYear;
	var phaseNameParam = Scopes.get('MasterStackedColumnChartAppCtrl').chartBarStacked_chartPhaseParameters;
	var fiscalYear = ''; 
	var division = '';		
	var chart;	
	var isDashboard = false;
	$scope.chartId = Scopes.get('MasterStackedColumnChartAppCtrl').chartBarStacked_chartHTMLId;	
	$scope.cName = Scopes.get('MasterStackedColumnChartAppCtrl').chartBarStacked_chartName;
	$scope.isEnhancedView = Scopes.get('MasterStackedColumnChartAppCtrl').chartBarStacked_isEnhancedView;
	$scope.resultTable =[];
	$scope.newFilterClause = '';
	$scope.chartBarStacked_contextRecordId = Scopes.get('MasterStackedColumnChartAppCtrl').chartBarStacked_contextRecordId;
	//if(phaseNameParam.indexOf('Dashboard') != -1){
		phaseNameParam = Scopes.get('MasterStackedColumnChartAppCtrl').chartBarStacked_phaseNameParam;
		if(!phaseNameParam){
			phaseNameParam = Scopes.get('MasterStackedColumnChartAppCtrl').chartBarStacked_defaultPhase;
		}		
		isDashboard = true;
		fiscalYear = Scopes.get('MasterStackedColumnChartAppCtrl').chartBarStacked_fiscalYear;
		division = Scopes.get('MasterStackedColumnChartAppCtrl').chartBarStacked_division;
		if(fiscalYear != ''){
			var fyStr =  ' (' + fiscalYear.split('-').join(',') + ') ';
			$scope.newFilterClause = '{yearfilterclause} ' + fyStr;
		}		
	//}

	$scope.fetchInitialData = function(cName,chartId){	  
		if($scope.chartBarStacked_contextRecordId == ''){
		$scope.showDataLabel = !$scope.isPhase;
		Visualforce.remoting.Manager.invokeAction(
			_RemotingChartBarStackedActions.fetchInitialData,cName,phaseNameParam ,chartId,isDashboard,$scope.newFilterClause,
			paintBarStackedChart,
			{escape:false, buffer: false}
		);
		}else{
			$scope.showDataLabel = true;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartBarStackedActions.fetchInitDataWithRecordId,cName,phaseNameParam ,chartId,isDashboard,$scope.newFilterClause,$scope.chartBarStacked_contextRecordId,
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
				$scope.constructChart(eval(result.categoryJSONForLineChart),eval(result.Categories),result.FormatterPrefix,result.chartId,result.chartId.trim(),eval(result.seriesForLineChart));
			}
		}
	}
	$scope.fetchData = function(phaseNameParam ,filterClause,cName,chartId){
		$scope.newFilterClause =  filterClause;
		$scope.fetchInitialData (cName,chartId);
	}
	$scope.constructChart = function(result,resultCategories,formatterPrefix,chartId,modalId,seriesForLineChart) {
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

		j$('#chart'+ chartId).highcharts ({
			chart : {
				type : 'bar',
				height : $scope.chartHeight,
				reflow: true
			},
			title : {
				text : $scope.ChartTitle
			},
			xAxis : {
				categories: resultCategories,
				title : {
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

StackedColumnChartApp.factory('Scopes', function ($rootScope) {
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