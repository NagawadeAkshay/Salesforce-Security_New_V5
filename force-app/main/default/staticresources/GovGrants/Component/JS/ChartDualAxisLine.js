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
	$scope.selectedYVal = '';
	$scope.selectedXVal = '';
	$scope.showAllData = false;
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
	var paramMap = {};
		paramMap.chartName = cName;
		paramMap.phaseName = phaseNameParam;
		paramMap.chartId = chartId;
		paramMap.isDashboard = isDashboard;
		//console.log('paramMap====',paramMap);
		paramMap.filterClause = $scope.newFilterClause;
		paramMap.recordId = $scope.chartDualAxisLine_contextRecordId;
		paramMap.selectedYVal = $scope.selectedYVal;
		paramMap.selectedXVal = $scope.selectedXVal; 
		paramMap.showAllData = $scope.showAllData;	  
		if($scope.chartDualAxisLine_contextRecordId == ''){
		$scope.showDataLabel = !$scope.isPhase;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartDualAxisLineActions.fetchInitialData,paramMap,
				paintBarBasicChart,
				{escape:false, buffer: false}
		);
		}else{
			$scope.showDataLabel = true;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartDualAxisLineActions.fetchInitDataWithRecordId,paramMap,
				paintBarBasicChart,
				{escape:false, buffer: false}
			);
		}

		function paintBarBasicChart(result, event){
			  //console.log('result for basic bar chart1111---->>>>',result);
			  if(event.status){
				$scope.$apply(function () {
					$scope.NoDataAvailable = (result.NoDataAvailable == 'true'? true : false);
					$scope.Charttitle = result.ChartTitle;
					$scope.selectedXVal = '';
					$scope.selectedYVal = '';
					$scope.title = result.Title;
					$scope.HeaderStyle= (result.HeaderStyle == null || result.HeaderStyle == '') ? 'Horizontal' : result.HeaderStyle;   //UI-Shrawan-11022015 handling null cases
					$scope.resultTable = result;
					$scope.records = result;
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
						$scope.zAxisLabel = result.Zaxis;
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
				$scope.constructChart(JSON.parse(result.Data),result.chartId,result.chartId.trim(),result.FormatterPrefix,JSON.parse(result.category),result.XAxisPrefix,result.YAxisPrefix,result.ZAxisPrefix,result.XFormattedNumber,result.YFormattedNumber,result.ZFormattedNumber,result.DisableLegend,result.AllowDecimalNumberXaxis,result.AllowDecimalNumberYaxis,result.AllowDecimalNumberZaxis,result.XAxisSuffix,result.YAxisSuffix,result.ZAxisSuffix);
			  }
		}
	}

	$scope.fetchData = function(phaseNameParam ,filterClause,cName,chartId){
		$scope.newFilterClause =  filterClause;
		$scope.fetchInitialData (cName,chartId);
	}
	
	$scope.constructChart = function(result,chartId,modalId,formatterPrefix,category,XaxisPrefix,YaxisPrefix,ZaxisPrefix,XFormattedNumber,YFormattedNumber,ZFormattedNumber,DisableLegend,AllowDecimalNumberXaxis,AllowDecimalNumberYaxis,AllowDecimalNumberZaxis,XAxisSuffix,YAxisSuffix,ZAxisSuffix){
		// Build the chart
		//console.log('result-----', result);
		//console.log('formatterPrefix-----', formatterPrefix);
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

				
				column : {
					stickyTracking : false,
					events : {
						click : function(event){
							//Prajakta: On click this event is fired
							//console.log('eventline',event);
							//console.log('eventlinecategory',event.point.category);
							//console.log('eventlinepouiny',event.point.y);
							var selectedYValue = event.point.y;;
							var selectedXValue = event.point.category;
							$scope.getDataForSelectedValue(selectedYValue,selectedXValue);						
							j$('#'+modalId+'recordsModal').addClass('fade in');
							j$('#'+modalId+'recordsModal').css('display', 'block');
							j$('#'+modalId+'recordsModal').attr('aria-hidden', 'false');
						},
						legendItemClick: function () {
                            return false;
						}
					}
				},
					spline : {
						events : {
							click : function(event){
								//console.log('eventpoint111',event);
								//console.log('eventline1',event.point.category);
								//console.log('eventline1',event.point.y);
								var selectedYValue = event.point.y;
								var selectedXValue = event.point.category;
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
			yAxis: [{
				//Primary Yaxis
				allowDecimals: AllowDecimalNumberYaxis,
				            
				title: {
					  
					text: $scope.yAxisLabel,
					align : 'middle',
					margin : 10,
					style : {
						textOverflow: 'ellipsis',                      
						fontFamily: 'Helvetica'
					}                  
				},
				labels: {
					formatter: function () {
						//console.log('this.axis.defaultLabelFormatter',this.axis.defaultLabelFormatter);
	                	var label;
	                	if(YFormattedNumber == true){
	                		//label = Highcharts.numberFormat(this.value);
	                		label = Highcharts.numberFormat(this.value, 2, '.', ',');
	                		//console.log('labelif',label);
	                	}else{
	                		label = this.value;
	                		//console.log('labelifelse',label);
	                	}
	                	//console.log('labelformaterY',label);
	                	//var label = $filter('currency')(this.axis.defaultLabelFormatter.call(this),'$');
	                	label = YaxisPrefix + label;
	                	label += YAxisSuffix;
	                	//console.log('chartIdformattter',chartId);
	                	//console.log('labelformater',label);
	                	//console.log('YFormattedNumber',YFormattedNumber);
	                	//var label = Highcharts.numberFormat(this.axis.defaultLabelFormatter.call(this))+ result.Xaxis;
	                	return label;
	            	}
            	}
			}, 
			{ // Secondary yAxis means z axis
				title: {
					allowDecimals: AllowDecimalNumberZaxis,
					text: $scope.zAxisLabel,
					align : 'middle',
					margin : 10,
					style : {
						textOverflow: 'ellipsis',                      
						fontFamily: 'Helvetica'
					}
				},			  
				opposite: true,
				labels: {
					formatter: function () {
						//console.log('this.axis.defaultLabelFormatter',this.axis.defaultLabelFormatter);
	                	//var label = $filter('currency')(this.axis.defaultLabelFormatter.call(this),'$');
	                	
	                	var label;
	                	if(ZFormattedNumber == true){
	                		 
	                		//label = $filter('currency')(this.axis.defaultLabelFormatter.call(this));
	                		label = Highcharts.numberFormat(this.value, 2, '.', ',');
	                		//console.log('labelif11',label);
	                	}else{
	                		label = this.value;
	                		//console.log('labelifelse1',label);
	                	}
	                	//console.log('labelformaterZ',label);
	                	label = ZaxisPrefix +label;
	                	label += ZAxisSuffix;
	                	//console.log('chartIdformattter',chartId);
	                	//console.log('labelformater',label);
	                	//console.log('ZFormattedNumber',ZFormattedNumber);
	                	//var label = Highcharts.numberFormat(this.axis.defaultLabelFormatter.call(this))+ result.Xaxis;
	                	return label;
	            	}
            	}
			}],            
			legend: {                    
				enabled : DisableLegend,                 
				itemStyle : {
					fontWeight : 'normal',
				},                                       
				layout : 'horizontal',
				//floating: true,
				/*labelFormatter: function () {
					if(DisableLegend ==  true){
						var s = this.name; 
					}
            		return s;
        		}*/
			},
			tooltip: {
				//Prajakta:on mouseover x  and y formatting should be same
				shared: true,
				formatter: function () {
	            	var s = '<b>' + this.x + '</b>';
	            	
	            	j$.each(this.points, function () {
	            		s += '<br/>' + this.series.name + ': '; 
	            		//for y axis
	            		if(this.colorIndex == 0) {//this means y axis
	            			s += YaxisPrefix;
	            			if(YFormattedNumber == true) {
	            				s += Highcharts.numberFormat(this.y, 2, '.', ',');
	            			} else {
	            				s+= this.y;
	            			}
	            			s += YAxisSuffix;
	            		} else if(this.colorIndex == 1) { //for Z Axis
	            			s += ZaxisPrefix;
	            			if(ZFormattedNumber == true) {
	            				s += Highcharts.numberFormat(this.y, 2, '.', ',');
	            			} else {
	            				s+= this.y;
	            			}
	            			s += ZAxisSuffix;
	            		}
	            		
	            	});
	            	
            	
            		return s;
        		}
				/*valueSuffix: formatterPrefix,
				//shared: true,
				shadow: false,
				backgroundColor: 'rgba(255,255,255,0.8)',
				style : {
						textOverflow: 'ellipsis',
						fontFamily: 'Helvetica'
				},
				formatter: function () {
            	var s = '<b>' + this.x + '</b>';

            	$.each(this.points, function () {
                s += '<br/>' + this.series.name + ': ' +
                    this.y + 'm';
           		 });

            	return s;
        		},
				formatter: function() {
					tooltipVal = '<b>' + this.point.category + '</b>';
					//console.log('tooltipVal',tooltipVal);

					if(formatterPrefix == '$'){
						tooltipVal += ' : <b>'+ $filter('currency')(this.point.y, '$') +'</b>';
					}else{
						tooltipVal += ' : <b>'+ this.point.y +'</b>';
					}
					return tooltipVal;
				}*/
			},
			credits: {
				enabled: false
			},
			
				series: result
			
		});
	}
	 $scope.getAllData = function(){
	 	// Prajakta:method for show all data
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
		//Prajakta:method for selected data
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