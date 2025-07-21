//var BarBasicChartApp= angular.module(chartBarBasic_chartHTMLId,[]); 
BarBasicChartApp.controller('BarBasicChartAppCtrl',function ($scope, $filter, $q, Scopes) {
	Scopes.store('BarBasicChartAppCtrl', $scope);
	var j$ = jQuery.noConflict();
	var chart;	
	var currentFY = Scopes.get('MasterBarBasicChartAppCtrl').chartBarBasic_currentFiscalYear;
	var phaseNameParam = Scopes.get('MasterBarBasicChartAppCtrl').chartBarBasic_phaseNameParam;
	var fiscalYear = ''; var division = '';
	var isDashboard = false;
	$scope.selectedYVal = '';
	$scope.selectedXVal = '';
	$scope.showAllData = false;
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
		var paramMap = {};
		paramMap.chartName = cName;
		paramMap.phaseName = phaseNameParam;
		paramMap.chartId = chartId;
		paramMap.isDashboard = isDashboard;
		//console.log('paramMap====',paramMap);
		paramMap.filterClause = $scope.newFilterClause;
		paramMap.recordId = $scope.chartPieBasic_contextRecordId;
		paramMap.selectedYVal = $scope.selectedYVal;
		paramMap.selectedXVal = $scope.selectedXVal;
		paramMap.showAllData = $scope.showAllData;
		if($scope.chartBarBasic_contextRecordId == ''){
			$scope.showDataLabel = !$scope.isPhase;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartBarBasicActions.fetchInitialData,paramMap,
				paintBarBasicChart,
				{escape:false, buffer: false}
			);
		}
		else{
			$scope.showDataLabel = true;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartBarBasicActions.fetchInitDataWithRecordId,paramMap,
				paintBarBasicChart,
				{escape:false, buffer: false}
			);
		}

		function paintBarBasicChart(result, event){
			if(event.status){
				$scope.$apply(function () {
					$scope.NoDataAvailable = (result.NoDataAvailable == 'true'? true : false);
					//if($scope.selectedYVal != '' && $scope.selectedXVal != '') {
						$scope.records = result;
						$scope.selectedXVal = '';
						$scope.selectedYVal = '';
					//} else{
					$scope.Charttitle = result.ChartTitle;
					$scope.title = result.Title;
					$scope.HeaderStyle = (result.HeaderStyle == null || result.HeaderStyle == '') ? 'Horizontal' : result.HeaderStyle;   //UI-Shrawan-11022015 handling null cases
					$scope.resultTable = result;
					$scope.dataTable = result.dataTable;
					$scope.Help = result.HelpId == undefined?false:result.HelpId;
					$scope.isAdmin = result.IsAdmin;
					$scope.isPhase = result.isPhase;
					$scope.ChartHeaderTitle = result.Title
						$scope.modalId = result.chartId;
						$scope.XAxisSuffix = result.XAxisSuffix;
						$scope.YAxisSuffix = result.YAxisSuffix;
						$scope.ZAxisSuffix = result.ZAxisSuffix;
						$scope.XAxisPrefix = result.XAxisPrefix;
						$scope.YAxisPrefix = result.YAxisPrefix;
						$scope.ZAxisPrefix = result.ZAxisPrefix;
						$scope.XFormattedNumber = result.XFormattedNumber;
						$scope.YFormattedNumber = result.YFormattedNumber;
						$scope.ZFormattedNumber = result.ZFormattedNumber;
						$scope.DisableLegend = result.DisableLegend;
						$scope.AllowDecimalNumberXaxis = result.AllowDecimalNumberXaxis;
						$scope.AllowDecimalNumberYaxis = result.AllowDecimalNumberYaxis;
						$scope.AllowDecimalNumberZaxis = result.AllowDecimalNumberZaxis;

					
					if($scope.isEnhancedView == 'true'){
						$scope.isPhase = false;
							$scope.yAxisLabel = result.Yaxis;
							$scope.xAxisLabel = result.Xaxis;
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
					//}
				});
				if($scope.selectedXVal == '' && $scope.selectedYVal == '') {
					$scope.constructChart(JSON.parse(result.Data),result.chartId,result.chartId.trim(),result.FormatterPrefix,JSON.parse(result.category),result.XAxisPrefix,result.YAxisPrefix,result.ZAxisPrefix,result.XFormattedNumber,result.YFormattedNumber,result.ZFormattedNumber,result.DisableLegend,result.AllowDecimalNumberXaxis,result.AllowDecimalNumberYaxis,result.AllowDecimalNumberZaxis,result.XAxisSuffix,result.YAxisSuffix, result.ZAxisSuffix);
			 
			  
				}
			}
		}
	}

	$scope.fetchData = function(phaseNameParam ,filterClause,cName,chartId){
		//console.log('Inside fetch Data');
		$scope.newFilterClause =  filterClause;
		$scope.fetchInitialData (cName,chartId);
	}

	$scope.constructChart = function(result,chartId,modalId,formatterPrefix,category,XaxisPrefix,YaxisPrefix,ZaxisPrefix,XFormattedNumber,YFormattedNumber,ZFormattedNumber,DisableLegend,AllowDecimalNumberXaxis,AllowDecimalNumberYaxis,AllowDecimalNumberZaxis,XAxisSuffix,YAxisSuffix,ZAxisSuffix){
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
				//PRAJAKTA: THIS CHART IS DISPLAYED VERTICALLTY SO X WILL BE CONSIDERED AS  Y AND VICE VERSA.
				allowDecimals: AllowDecimalNumberYaxis,
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
					},
                   formatter: function () {
						//console.log('this.axis.defaultLabelFormatter',this.axis.defaultLabelFormatter);
	                	var label;
	                	if(YFormattedNumber == true){
	                		//label = Highcharts.numberFormat(this.value);
	                		label = Highcharts.numberFormat(this.value, 2, '.', ',');
	                		//console.log('this.value'+this.value);
	                		//console.log('labelif',label);
	                	}else{
	                		label = this.value;
	                		//console.log('labelifelse',label);
	                	}
	                	//console.log('labelformaterX',label);
	                	//var label = $filter('currency')(this.axis.defaultLabelFormatter.call(this),'$');
	                	label = YaxisPrefix + label;
	                	label += YAxisSuffix;
	                	//console.log('chartIdformattter',chartId);
	                	//console.log('labelformater',label);
	                	//console.log('XFormattedNumber',YFormattedNumber);
	                	//var label = Highcharts.numberFormat(this.axis.defaultLabelFormatter.call(this))+ result.Xaxis;
	                	return label;
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
							//console.log('event.point.name11',event);
							//console.log('event.point.category',event.point.category);
							//console.log('event.point.category',event.point.y);
							var selectedYValue = event.point.category;
							var selectedXValue = event.point.y;
							//console.log('selectedYValue',selectedYValue);
							//console.log('selectedXValue',selectedXValue);
							$scope.getDataForSelectedValue(selectedYValue,selectedXValue);
							j$('#'+modalId+'recordsModal').addClass('fade in');
							j$('#'+modalId+'recordsModal').css('display', 'block');
							j$('#'+modalId+'recordsModal').attr('aria-hidden', 'false');
						},
						legendItemClick: function () {
                            	return false;
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
				//PRAJAKTA: THIS CHART IS DISPLAYED VERTICALLTY SO X WILL BE CONSIDERED AS  Y AND VICE VERSA.
				allowDecimals: AllowDecimalNumberXaxis,
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
					,
                   formatter: function () {
						//console.log('this.axis.defaultLabelFormatter',this.axis.defaultLabelFormatter);
	                	var label;
	                	if(XFormattedNumber == true){
	                		//label = Highcharts.numberFormat(this.value);
	                		label = Highcharts.numberFormat(this.value, 2, '.', ',');
	                		//console.log('this.value'+this.value);
	                		//console.log('labelif',label);
	                	}else{
	                		label = this.value;
	                		//console.log('labelifelse',label);
	                	}
	                	//console.log('labelformaterX',label);
	                	//var label = $filter('currency')(this.axis.defaultLabelFormatter.call(this),'$');
	                	label = XaxisPrefix + label;
	                	label += XAxisSuffix;
	                	//console.log('chartIdformattter',chartId);
	                	//console.log('labelformater',label);
	                	//console.log('XFormattedNumber',XFormattedNumber);
	                	//var label = Highcharts.numberFormat(this.axis.defaultLabelFormatter.call(this))+ result.Xaxis;
	                	return label;
	            	}


				}
			},
			legend: {
				enabled : DisableLegend
				/*itemStyle : {
					fontWeight : 'normal',
				},                                       
				layout : 'horizontal'*/

			},
			tooltip: {
				//valueSuffix: formatterPrefix,
				/*positioner: function () {
					return { x: 20, y: 40 };
				},*/
				shadow: false,
				backgroundColor: 'rgba(255,255,255,0.8)',
				style : {
					textOverflow: 'ellipsis',
					fontFamily: 'Helvetica'
				},
				/*formatter: function() {
					tooltipVal = '<b>' + this.point.category + '</b>';
					if(formatterPrefix == '$'){
						tooltipVal += ' : <b>'+ $filter('currency')(this.point.y, '$') +'</b>';
					}else{
						tooltipVal += ' : <b>'+ this.point.y +'</b>';
					}
					return tooltipVal;
				}*/
				formatter: function () {
					//console.log('XFormattedNumber----',XFormattedNumber);
					//console.log('this11----',this);
					//console.log('this11----',this);
					var s = '<b>' + this.x  + ': '+'</b>';
						s += XaxisPrefix;
						if((XFormattedNumber == true ) ){//for Xaxis.Only one value
							 s += Highcharts.numberFormat(this.y, 2, '.', ',');
							
							//console.log('sif',s);
						}else{
							 s += this.point.y;
							//console.log('selse',s);

				}
						s += XAxisSuffix;
						
            	
					return s;
				}

			},
			credits: {
				enabled: false
			},
			series:result
		});
    }
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
