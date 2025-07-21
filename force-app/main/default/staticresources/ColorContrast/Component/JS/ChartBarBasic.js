//var BarBasicChartApp= angular.module(chartBarBasic_chartHTMLId,[]); 
BarBasicChartApp.controller('BarBasicChartAppCtrl',function ($scope, $filter, $q, Scopes) {
	Scopes.store('BarBasicChartAppCtrl', $scope);
	var j$ = jQuery.noConflict();
	var chart;	
	var currentFY = Scopes.get('MasterBarBasicChartAppCtrl').chartBarBasic_currentFiscalYear;
	var phaseNameParam = Scopes.get('MasterBarBasicChartAppCtrl').chartBarBasic_phaseNameParam;
	var fiscalYear = ''; var division = '';
	var isDashboard = false;
	$scope.chartId = Scopes.get('MasterBarBasicChartAppCtrl').chartBarBasic_chartHTMLId;
	$scope.resultTable =[];
	$scope.cName = Scopes.get('MasterBarBasicChartAppCtrl').chartBarBasic_chartName;	
	//$scope.newFilterClause = '';
	$scope.newFilterClause = Scopes.get('MasterBarBasicChartAppCtrl').chartBarBasic_chartParameters;	
	$scope.isEnhancedView = Scopes.get('MasterBarBasicChartAppCtrl').chartBarBasic_isEnhancedView;
	$scope.chartBarBasic_contextRecordId = Scopes.get('MasterBarBasicChartAppCtrl').chartBarBasic_contextRecordId;
	
	if(phaseNameParam.indexOf('Dashboard') != -1){
		phaseNameParam = Scopes.get('MasterBarBasicChartAppCtrl').chartBarBasic_phaseNameParam;
		if(!phaseNameParam){
			 phaseNameParam = Scopes.get('MasterBarBasicChartAppCtrl').chartBarBasic_defaultPhase;
		}		
		isDashboard = true;
		fiscalYear = Scopes.get('MasterBarBasicChartAppCtrl').chartBarBasic_fiscalYear;
		division = Scopes.get('MasterBarBasicChartAppCtrl').chartBarBasic_division;
		if(fiscalYear != ''){
			 var fyStr =  ' (' + fiscalYear.split('-').join(',') + ') ';
			 $scope.newFilterClause = '{yearfilterclause} ' + fyStr;
		}
	}

	$scope.fetchInitialData = function(cName,chartId){
		if($scope.chartBarBasic_contextRecordId == ''){
			$scope.showDataLabel = !$scope.isPhase;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartBarBasicActions.fetchInitialData,cName,phaseNameParam ,chartId,isDashboard,$scope.newFilterClause,
				paintBarBasicChart,
				{escape:false, buffer: false}
			);
		}
		else{
			$scope.showDataLabel = true;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartBarBasicActions.fetchInitDataWithRecordId,cName,phaseNameParam ,chartId,isDashboard,$scope.newFilterClause,$scope.chartBarBasic_contextRecordId,
				paintBarBasicChart,
				{escape:false, buffer: false}
			);
		}

		function paintBarBasicChart(result, event){
			if(event.status){
				$scope.$apply(function () {
					$scope.NoDataAvailable = (result.NoDataAvailable == 'true'? true : false);
					$scope.Charttitle = result.ChartTitle;
					$scope.title = result.Title;
					$scope.HeaderStyle = (result.HeaderStyle == null || result.HeaderStyle == '') ? 'Horizontal' : result.HeaderStyle;   //UI-Shrawan-11022015 handling null cases
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
						$scope.ChartTitle = result.Title;
						$scope.EnableExporting = true;
						$scope.chartHeight = 600;
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
				$scope.constructChart(eval(result.Data),result.chartId,result.chartId.trim(),result.FormatterPrefix,eval(result.category));
			}
		}
	}

	$scope.fetchData = function(phaseNameParam ,filterClause,cName,chartId){
		//console.log('Inside fetch Data');
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
				type: 'bar',
				//marginLeft : 100
				height: $scope.chartHeight
				//width: 418
			},
			title: {
				text: $scope.ChartTitle
			},
			xAxis: {
				categories: category,
				tickPosition: 'on',
				title: {
					text: $scope.yAxisLabel,
					margin : 6,
					align : 'middle',
					style:{
						textOverflow: 'ellipsis',
						fontFamily: 'Helvetica'
					}
				},
				labels : {
					align : 'right',
					style : {
						textOverflow: 'ellipsis',
						fontFamily: 'Helvetica'
					}
				}
			},
			plotOptions : {
				series: {
					colorByPoint: true
				},
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
			yAxis: {
				title: {
					text: $scope.xAxisLabel,
					align : 'middle',
					margin : 20,
					style : {
						textOverflow: 'ellipsis',                      
						fontFamily: 'Helvetica'
					}
				},
				endOnTick : false,
				labels : {
					align : 'middle',
					style : {
						textOverflow: 'ellipsis',
						fontFamily: 'Helvetica'
					}
				}
			},
			legend: {
				enabled : false
			},
			tooltip: {
				valueSuffix: formatterPrefix,
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

BarBasicChartApp.factory('Scopes', function ($rootScope) {
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
