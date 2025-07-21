//var StackedColumnChartApp = angular.module(chartStackedColumn_chartHTMLId,[]);
StackedColumnChartApp.controller('StackedColumnChartAppCtrl',function ($scope, $q, $filter, Scopes) {
	Scopes.store('StackedColumnChartAppCtrl', $scope);
	var j$ = jQuery.noConflict();
	var chart;
	var currentFY = Scopes.get('MasterStackedColumnChartAppCtrl').chartStackedColumn_currentFiscalYear;
	var phaseNameParam = Scopes.get('MasterStackedColumnChartAppCtrl').chartStackedColumn_phaseNameParam;
	//console.log('MasterStackedColumnChartAppCtrl phaseNameParam--->>>',phaseNameParam);
	var fiscalYear = '';
	var division = '';
	var isDashboard = false;
	$scope.selectedYVal = '';
	$scope.selectedXVal = '';
	$scope.showAllData = false;
	$scope.chartId = Scopes.get('MasterStackedColumnChartAppCtrl').chartStackedColumn_chartHTMLId;
	$scope.resultTable =[];
	$scope.cName = Scopes.get('MasterStackedColumnChartAppCtrl').chartStackedColumn_chartName;	
	$scope.isEnhancedView = Scopes.get('MasterStackedColumnChartAppCtrl').chartStackedColumn_isEnhancedView;
	$scope.newFilterClause = '';
	$scope.chartStackedColumn_contextRecordId = Scopes.get('MasterStackedColumnChartAppCtrl').chartStackedColumn_contextRecordId;
	
	//if(phaseNameParam.indexOf('Dashboard') != -1){
		phaseNameParam = Scopes.get('MasterStackedColumnChartAppCtrl').chartStackedColumn_phaseParam;
		if(!phaseNameParam){
			 phaseNameParam = Scopes.get('MasterStackedColumnChartAppCtrl').chartStackedColumn_defaultPhase;
		}		
		isDashboard = true;
		fiscalYear = Scopes.get('MasterStackedColumnChartAppCtrl').chartStackedColumn_fiscalYear;
		division = Scopes.get('MasterStackedColumnChartAppCtrl').chartStackedColumn_division;

		if(fiscalYear != ''){
			 var fyStr =  ' (' + fiscalYear.split('-').join(',') + ') ';
			 $scope.newFilterClause = '{yearfilterclause} ' + fyStr;
		}		
	//}

	$scope.fetchInitialData = function(cName,chartId){
		var paramMap = {};
		paramMap.chartName = cName;
		paramMap.phaseName = phaseNameParam;
		paramMap.chartId = chartId;
		paramMap.isDashboard = isDashboard;
		paramMap.filterClause = $scope.newFilterClause;
		//console.log('paramMap',paramMap);
		paramMap.recordId = $scope.chartStackedColumn_contextRecordId;
		paramMap.selectedYVal = $scope.selectedYVal;
		paramMap.selectedXVal = $scope.selectedXVal;
		paramMap.showAllData = $scope.showAllData;	  
		if($scope.chartStackedColumn_contextRecordId == ''){
			$scope.showDataLabel = !$scope.isPhase;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartStackedColumnActions.fetchInitialData,paramMap,
				paintBarStackedChart,
				{escape:false, buffer: false}
			);
		}else{
			$scope.showDataLabel = true;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartStackedColumnActions.fetchInitDataWithRecordId,paramMap,
				paintBarStackedChart,
				{escape:false, buffer: false}
			);
		}

		function paintBarStackedChart(result, event){
			  if(event.status){
				$scope.$apply(function () {
					$scope.NoDataAvailable = (result.NoDataAvailable == 'true'? true : false);
					//if($scope.selectedYVal != '' && $scope.selectedXVal != '') {
						$scope.records = result;
						$scope.selectedXVal = '';
						$scope.selectedYVal = '';
					//}else{
						$scope.Charttitle = result.ChartTitle;
						$scope.title = result.Title;
						$scope.HeaderStyle= (result.HeaderStyle == null || result.HeaderStyle == '') ? 'Horizontal' : result.HeaderStyle;   //UI-Shrawan-11022015 handling null cases
						$scope.resultTable = result;
						$scope.dataTable = result.dataTable;
						$scope.Help = result.HelpId == undefined?false:result.HelpId;
						$scope.isAdmin = result.IsAdmin;
						$scope.isPhase = result.isPhase;
						$scope.xAxisLabel = result.Xaxis;
						$scope.yAxisLabel = result.Yaxis;
						$scope.modalId = result.chartId;
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
						//console.log('result >>>>>',result);
						//console.log('Charttitle >>>>>',$scope.Charttitle );
						$scope.chartHeight;
						if($scope.isPhase){
							$scope.chartHeight = 250;
						}else if($scope.isEnhancedView == 'true'){
							$scope.chartHeight = 450;
						}else{
							$scope.chartHeight = 230;
						}
					//}
				});
				if($scope.selectedXVal == '' && $scope.selectedYVal == '') {
					$scope.constructChart(JSON.parse(result.categoryJSONForLineChart),JSON.parse(result.Categories),result.FormatterPrefix,result.chartId,result.chartId.trim(),JSON.parse(result.seriesForLineChart));
			  	}
			  }
		}
	}
	$scope.fetchData = function(phaseNameParam ,filterClause,cName,chartId){
		$scope.newFilterClause =  filterClause;
		$scope.fetchInitialData (cName,chartId);
	}
	$scope.constructChart = function(result,resultCategories,formatterPrefix,chartId,modalId,seriesForLineChart)    {
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
				 type : 'column',
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
				column: {
					stacking: 'normal',
					events : {
						click: function(event) {
							//console.log('event-----',event);
							var selectedYValue = event.point.y;
							var selectedXValue = event.point.category;
							$scope.getDataForSelectedValue(selectedYValue,selectedXValue);
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
	$scope.getAllData = function(){
		$scope.records = undefined;
		$scope.showAllData = true;
		//console.log('$scope.showAllData',$scope.showAllData);
		$scope.fetchInitialData($scope.cName,$scope.chartId);
		$scope.showAllData = false;
		j$('#'+$scope.modalId+'recordsModal').addClass('fade in');
		j$('#'+$scope.modalId+'recordsModal').css('display', 'block');
		j$('#'+$scope.modalId+'recordsModal').attr('aria-hidden', 'false');
		
	}
	$scope.getDataForSelectedValue = function(selectedYVal,selectedXVal){
		$scope.records = undefined;
		$scope.selectedYVal = selectedYVal;
		$scope.selectedXVal = selectedXVal;
		$scope.fetchInitialData($scope.cName,$scope.chartId);
		$scope.selectedYVal = '';
		$scope.selectedXVal = '';
	}
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
