var j$ = jQuery.noConflict();
//var PieApp = angular.module(chartPieBasic_chartHTMLId,['ui.bootstrap']);
var recId = chartPieBasic_recordId;
PieApp.controller('PieChartAppCtrl',function ($scope, $filter, $q, Scopes) {
	Scopes.store('PieChartAppCtrl', $scope);
	var phaseName = '';
	var fiscalYear = ''; 
	var division = '';
	var chart;
	var phaseNameParam = Scopes.get('MasterPieChartAppCtrl').chartPieBasic_phaseNameParam;
	$scope.chartId = Scopes.get('MasterPieChartAppCtrl').chartPieBasic_chartHTMLId;
	$scope.chartHTMLRender = 'chart'+$scope.chartId;
	$scope.resultTable =[];
	$scope.cName = Scopes.get('MasterPieChartAppCtrl').chartPieBasic_chartName;
	$scope.recordId = Scopes.get('MasterPieChartAppCtrl').chartPieBasic_contextRecordId;	
	$scope.isEnhancedView = Scopes.get('MasterPieChartAppCtrl').chartPieBasic_isEnhancedView;	
	$scope.isDashboard = false;
	$scope.newFilterClause = Scopes.get('MasterPieChartAppCtrl').chartPieBasic_chartParameters;	
	$scope.chartPieBasic_contextRecordId = Scopes.get('MasterPieChartAppCtrl').chartPieBasic_contextRecordId;
	//if(phaseNameParam.indexOf('Dashboard') != -1){
		phaseNameParam = Scopes.get('MasterPieChartAppCtrl').chartPieBasic_phaseParam;
		fiscalYear = Scopes.get('MasterPieChartAppCtrl').chartPieBasic_fiscalYear;
		division = Scopes.get('MasterPieChartAppCtrl').chartPieBasic_division;
		if(!phaseNameParam){
			phaseNameParam = Scopes.get('MasterPieChartAppCtrl').chartPieBasic_defaultPhase;
		}
		if(fiscalYear != ''){
			var fyStr =  ' (' + fiscalYear.split('-').join(',') + ') ';
			$scope.newFilterClause = '{yearfilterclause} ' + fyStr;
		}
		$scope.isDashboard = true;
	//}

	$scope.fetchInitialData = function(cName,chartId){		
		if($scope.chartPieBasic_contextRecordId == ''){
			$scope.showDataLabel = !$scope.isPhase;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartPieBasicActions.fetchInitialData,cName,phaseNameParam ,chartId,$scope.isDashboard,$scope.newFilterClause,
				paintPieBasicChart,
				{escape:false, buffer: false,timeout:3000}
			);
		}else{
			$scope.showDataLabel = true;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartPieBasicActions.fetchInitDataWithRecordId,cName,phaseNameParam ,chartId,$scope.isDashboard,$scope.newFilterClause,$scope.chartPieBasic_contextRecordId,
				paintPieBasicChart,
				{escape:false, buffer: false}
			);
		}

		function paintPieBasicChart(result, event){			
			if(event.status){
				$scope.$apply(function () {
					$scope.NoDataAvailable = (result.NoDataAvailable == 'true'? true : false);
					$scope.Charttitle = result.ChartTitle;
					$scope.title = result.Title;										
					$scope.HeaderStyle = result.HeaderStyle;
					$scope.resultTable = result;
					$scope.records = result;
					$scope.isPhase = result.isPhase;
					$scope.isAdmin = result.IsAdmin;
					$scope.TableHeader = result.TableHeader;
					$scope.legendLayout = '';
					$scope.legendVerticalAlign = '';
					$scope.legendAlign = '';
					if($scope.isEnhancedView == 'true'){
						$scope.enableExporting = true;
						$scope.ChartTitle = result.Title;
						$scope.ChartHeight = 450;
						$scope.pieSize = 200;
						$scope.legendLayout = 'horizontal';
						$scope.legendVerticalAlign = 'bottom';
						$scope.legendAlign = 'center';
					}else{
						$scope.enableExporting = false;						
						$scope.legendLayout = 'horizontal';
						$scope.legendVerticalAlign = 'bottom';
						$scope.legendAlign = 'center';
					}
					$scope.Help = result.HelpId == undefined?false:result.HelpId;
				});
			}
			$scope.constructChart(eval(result.Data),'#chart'+result.chartId.trim(),result.ChartTitle, result.chartId.trim(), result.FormatterPrefix);
		}
	}

	$scope.constructChart  = function(result,chartId,title, modalId, formatter){			
		Highcharts.setOptions({ // Apply to all charts
			chart: {
				events: {
					beforePrint: function () {
						this.oldhasUserSize = this.hasUserSize;
						this.resetParams = [this.chartWidth, this.chartHeight, false];
						//this.setSize(500, 800, false);
					},
					afterPrint: function () {
						//this.setSize.apply(this, this.resetParams);
						this.hasUserSize = this.oldhasUserSize;
					}
				}
			}
		});

		// Build the chart
		j$('#'+$scope.chartHTMLRender).highcharts({
			chart: {
				type: 'pie'   ,
				marginTop : 20,
				height : $scope.ChartHeight
			},
			title: {
				text: $scope.ChartTitle,
			},
			tooltip: {
				valueSuffix: formatter,
				formatter: function() {				
					tooltipVal = '<b>'+this.point.name+'</b>' ;
					if(formatter == '$'){
						tooltipVal += ' : <b>'+ $filter('currency')(this.point.y, '$') +'</b>';
					}else{
						tooltipVal += ' : <b>'+ this.point.y +'</b>';
					}
					return tooltipVal;
				}
			},	
			legend: {
				enabled : true,
				layout: $scope.legendLayout,
				align: $scope.HeaderStyle == 'Horizontal' ? $scope.legendAlign :   $scope.legendAlign,
				verticalAlign: $scope.HeaderStyle == 'Horizontal' ?   $scope.legendVerticalAlign:   $scope.legendVerticalAlign,				
				borderWidth: 0,
				itemStyle : {
					fontWeight : 'normal',
					fontFamily:'Helvetica'
				},
				itemMarginTop: -20,
				itemMarginBottom : 20,
				floating : false,
				y: 10,
				labelFormatter: function () {				
					return this.name;				
				}
			},
			plotOptions: {
				pie: {
					size:$scope.pieSize,
					dataLabels: {
						enabled: false
					},
					stickyTracking : false,
					events: {
						click: function(event) {							
							j$('#'+modalId+'recordsModal').addClass('fade in');
							j$('#'+modalId+'recordsModal').css('display', 'block');
							j$('#'+modalId+'recordsModal').attr('aria-hidden', 'false');
						}
					},
					showInLegend:true
				}
			},
			exporting : {
				enabled : $scope.enableExporting,
				scale:1.85,
				buttons : {
					contextButton : {
						theme : {
							zIndex : 100
						}
					}
				},
				fileName : $scope.title,
				chartOptions : {
					legend: {
						itemStyle : {
							fontWeight : 'normal',
							fontFamily:'Helvetica'
						},
						layout: 'Horizontal'
					},
					credits : {
						enabled : false
					}
				}
			},
			credits :{
				enabled :false
			},

			series: [{
				type : 'pie',
				data: result
			}]
		});
	}

	$scope.fetchData = function(phaseNameParam ,filterClause,cName,chartId){
	$scope.newFilterClause =  filterClause;
	$scope.fetchInitialData (cName,chartId);
	}

	$scope.chartName = $scope.cName;
	$scope.fetchInitialData($scope.cName,$scope.chartId);
});
PieApp.factory('Scopes', function ($rootScope) {
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