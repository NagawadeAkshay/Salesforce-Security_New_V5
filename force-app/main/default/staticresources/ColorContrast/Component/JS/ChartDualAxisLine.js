//var BarBasicChartApp= angular.module(chartDualAxisLine_chartHTMLId,[]);
DualAxisLineChartApp.controller('ChartDualAxisLineAppCtrl',function ($scope, $filter, $q, Scopes) {
	Scopes.store('ChartDualAxisLineAppCtrl', $scope);
	var j$ = jQuery.noConflict();
	var chart;
	var currentFY = Scopes.get('MasterChartDualAxisLineAppCtrl').chartDualAxisLine_currentFiscalYear;
	var phaseNameParam = Scopes.get('MasterChartDualAxisLineAppCtrl').chartDualAxisLine_phaseNameParam;
	var fiscalYear = ''; 
	var division = '';
	var isDashboard = false;
	
	$scope.chartId = Scopes.get('MasterChartDualAxisLineAppCtrl').chartDualAxisLine_chartHTMLId;
	$scope.resultTable =[];
	$scope.cName = Scopes.get('MasterChartDualAxisLineAppCtrl').chartDualAxisLine_chartName;
	$scope.newFilterClause = '';
	$scope.isEnhancedView = Scopes.get('MasterChartDualAxisLineAppCtrl').chartDualAxisLine_isEnhancedView;
	$scope.chartDualAxisLine_contextRecordId = Scopes.get('MasterChartDualAxisLineAppCtrl').chartDualAxisLine_contextRecordId;
	
	//if(phaseNameParam.indexOf('Dashboard') != -1){
		phaseNameParam = Scopes.get('MasterChartDualAxisLineAppCtrl').chartDualAxisLine_phaseNameParam;
		if(!phaseNameParam){
			 phaseNameParam = Scopes.get('MasterChartDualAxisLineAppCtrl').chartDualAxisLine_defaultPhase;
		}		
		isDashboard = true;
		fiscalYear = Scopes.get('MasterChartDualAxisLineAppCtrl').chartDualAxisLine_fiscalYear;
		division = Scopes.get('MasterChartDualAxisLineAppCtrl').chartDualAxisLine_division;

		if(fiscalYear != ''){
			 var fyStr =  ' (' + fiscalYear.split('-').join(',') + ') ';
			 $scope.newFilterClause = '{yearfilterclause} ' + fyStr;
		}
	//}

	$scope.fetchInitialData = function(cName,chartId){	  
		if($scope.chartDualAxisLine_contextRecordId == ''){
		$scope.showDataLabel = !$scope.isPhase;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartDualAxisLineActions.fetchInitialData,cName,phaseNameParam ,chartId,isDashboard,$scope.newFilterClause,
				paintBarBasicChart,
				{escape:false, buffer: false}
		);
		}else{
			$scope.showDataLabel = true;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartDualAxisLineActions.fetchInitDataWithRecordId,cName,phaseNameParam ,chartId,isDashboard,$scope.newFilterClause,$scope.chartDualAxisLine_contextRecordId,
				paintBarBasicChart,
				{escape:false, buffer: false}
			);
		}

		function paintBarBasicChart(result, event){
			  //console.log('result for basic bar chart---->>>>',result);
			  if(event.status){
				$scope.$apply(function () {
					$scope.NoDataAvailable = (result.NoDataAvailable == 'true'? true : false);
					$scope.Charttitle = result.ChartTitle;
					$scope.title = result.Title;
					$scope.HeaderStyle= (result.HeaderStyle == null || result.HeaderStyle == '') ? 'Horizontal' : result.HeaderStyle;   //UI-Shrawan-11022015 handling null cases
					$scope.resultTable = result;
					$scope.records = result;
					$scope.dataTable = result.dataTable;
					$scope.Help = result.HelpId == undefined?false:result.HelpId;
					$scope.isAdmin = result.IsAdmin;
					$scope.isPhase = result.isPhase;
					$scope.ChartHeaderTitle = result.Title
					if($scope.isEnhancedView == 'true'){
						$scope.isPhase = false;
						$scope.yAxisLabel = result.YaxisWholeLabel;
						$scope.xAxisLabel = result.XaxisWholeLabel;
						$scope.zAxisLabel = result.ZaxisWholeLabel;
						$scope.ChartTitle = result.Title;
						$scope.EnableExporting = true;
						$scope.chartHeight = 600;
					}else{
						$scope.xAxisLabel = result.Xaxis;
						$scope.yAxisLabel = result.Yaxis;
						$scope.zAxisLabel = result.Zaxis;
						$scope.ChartTitle = '';
						$scope.EnableExporting = false;
					}				
					$scope.chartHeight;
					if($scope.isPhase){
						$scope.chartHeight = 220; //$scope.chartHeight = 250;
					}else if($scope.isEnhancedView == 'true'){
						$scope.chartHeight = 450;
					}else{
						$scope.chartHeight = 220;	//$scope.chartHeight = 230;
					}

				});
				$scope.constructChart(eval(result.Data),result.chartId,result.chartId.trim(),result.FormatterPrefix,eval(result.category));
			  }
		}
	}

	$scope.fetchData = function(phaseNameParam ,filterClause,cName,chartId){
		$scope.newFilterClause =  filterClause;
		$scope.fetchInitialData (cName,chartId);
	}
	
	$scope.constructChart = function(result,chartId,modalId,formatterPrefix,category){
		// Build the chart
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

		j$('#chart'+chartId).highcharts({
		   chart: {
				height: $scope.chartHeight,
				zoomType: 'xy'

			},
			title: {
				text: $scope.ChartTitle
			},            
			xAxis: [{
				categories: category,
				crosshair: true
			}],
			plotOptions : {
				bar : {
					events : {
						click : function (event){
							j$('#'+modalId+'recordsModal').addClass('fade in');
							j$('#'+modalId+'recordsModal').css('display', 'block');
							j$('#'+modalId+'recordsModal').attr('aria-hidden', 'false');
						}
					}
				}
			},
			exporting : {
				enabled : $scope.EnableExporting,
				scale:1.85
			},
			navigation: {
				buttonOptions: {
					verticalAlign: 'top',
					y:-10
				}
			},         
			yAxis: [{ // Primary yAxis               
				title: {
					text: $scope.xAxisLabel,
					align : 'middle',
					margin : 10,
					style : {
						textOverflow: 'ellipsis',                      
						fontFamily: 'Helvetica'
					}                  
				}
			}, 
			{ // Secondary yAxis
				title: {
					text: $scope.zAxisLabel,
					align : 'middle',
					margin : 10,
					style : {
						textOverflow: 'ellipsis',                      
						fontFamily: 'Helvetica'
					}
				},			  
				opposite: true
			}],            
			legend: {
				enabled : false
			},
			tooltip: {
				valueSuffix: formatterPrefix,
				shadow: false,
				backgroundColor: 'rgba(255,255,255,0.8)',
				style : {
						textOverflow: 'ellipsis',
						fontFamily: 'Helvetica'
				},
				formatter: function() {
					tooltipVal = '<b>' + this.point.category + '</b>';
					if(formatterPrefix == '$'){
						tooltipVal += ' : <b>'+ $filter('currency')(this.point.y, '$') +'</b>';
					}else{
						tooltipVal += ' : <b>'+ this.point.y +'</b>';
					}
					return tooltipVal;
				}
			},
			credits: {
				enabled: false
			},
			series:result
		});
	}
	$scope.fetchInitialData($scope.cName,$scope.chartId);
	$scope.chartName = $scope.cName;
});
DualAxisLineChartApp.factory('Scopes', function ($rootScope) {
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