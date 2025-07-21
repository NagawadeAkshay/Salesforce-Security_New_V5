//var j$ = jQuery.noConflict();
StackedColumnChartApp.controller('StackedColumnChartAppCtrl',function ($scope, $q, $filter, Scopes) {
	Scopes.store('StackedColumnChartAppCtrl', $scope);
	var j$ = jQuery.noConflict();
	var currentFY = Scopes.get('MasterStackedColumnChartAppCtrl').chartBarStacked_currentFiscalYear;
	var phaseNameParam = Scopes.get('MasterStackedColumnChartAppCtrl').chartBarStacked_chartPhaseParameters;
	var fiscalYear = ''; 
	var division = '';		
	var chart;
	$scope.selectedYVal = '';
	$scope.selectedXVal = '';	
	var isDashboard = false;
	$scope.showAllData = false;
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
		var paramMap = {};
		paramMap.chartName = cName;
		paramMap.phaseName = phaseNameParam;
		paramMap.chartId = chartId;
		paramMap.isDashboard = isDashboard;
		//console.log('paramMap====',paramMap);
		paramMap.filterClause = $scope.newFilterClause;
		paramMap.recordId = $scope.chartBarStacked_contextRecordId;
		paramMap.selectedYVal = $scope.selectedYVal;
		paramMap.selectedXVal = $scope.selectedXVal; 
		paramMap.showAllData = $scope.showAllData;
		//console.log('$scope.chartBarStacked_contextRecordId',$scope.chartBarStacked_contextRecordId)
		if($scope.chartBarStacked_contextRecordId == ''){

		$scope.showDataLabel = !$scope.isPhase;
		Visualforce.remoting.Manager.invokeAction(
			_RemotingChartBarStackedActions.fetchInitialData,paramMap,
			paintBarStackedChart,
			{escape:false, buffer: false}
		);
		}else{
			$scope.showDataLabel = true;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartBarStackedActions.fetchInitDataWithRecordId,paramMap,
				paintBarStackedChart,
				{escape:false, buffer: false}
			);
		}

		function paintBarStackedChart(result, event){
			//console.log('result---->',result);
			//console.log('event---->',event);
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
						$scope.HeaderStyle= result.HeaderStyle;
						$scope.resultTable = result;
						$scope.dataTable = result.dataTable;
						$scope.Help = result.HelpId == undefined?false:result.HelpId;
						$scope.isAdmin = result.IsAdmin;
						$scope.isPhase = result.isPhase;
						$scope.xAxisLabel = result.Xaxis;
						$scope.yAxisLabel = result.Yaxis;
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
							$scope.xAxisLabel = result.Yaxis;
							$scope.yAxisLabel = result.Xaxis;

							$scope.ChartTitle = result.Title;
							$scope.EnableExporting = true;
						}else{
							$scope.xAxisLabel = result.Yaxis;
							$scope.yAxisLabel = result.Xaxis;
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
					$scope.constructChart(JSON.parse(result.Data),JSON.parse(result.category),result.FormatterPrefix,result.chartId,result.chartId.trim(),JSON.parse(result.seriesForLineChart),result.XAxisPrefix,result.YAxisPrefix,result.ZAxisPrefix,result.XFormattedNumber,result.YFormattedNumber,result.ZFormattedNumber,result.DisableLegend,result.AllowDecimalNumberXaxis,result.AllowDecimalNumberYaxis,result.AllowDecimalNumberZaxis,result.XAxisSuffix,result.YAxisSuffix, result.ZAxisSuffix);
				}
			}
		}
	}
	$scope.fetchData = function(phaseNameParam ,filterClause,cName,chartId){
		$scope.newFilterClause =  filterClause;
		$scope.fetchInitialData (cName,chartId);
	}
	$scope.constructChart = function(result,resultCategories,formatterPrefix,chartId,modalId,seriesForLineChart,XaxisPrefix,YaxisPrefix,ZaxisPrefix,XFormattedNumber,YFormattedNumber,ZFormattedNumber,DisableLegend,AllowDecimalNumberXaxis,AllowDecimalNumberYaxis,AllowDecimalNumberZaxis,XAxisSuffix,YAxisSuffix,ZAxisSuffix) {
		//console.log('resultCategories',resultCategories);
		//console.log('result',result);
		//console.log('resultCategories',resultCategories);
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
				//PRAJAKTA: THIS CHART IS DISPLAYED VERTICALLTY SO X WILL BE CONSIDERED AS  Y AND VICE VERSA.
				allowDecimals: AllowDecimalNumberYaxis,
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
					},
				  formatter: function () {
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
	                  //console.log('XFormattedNumber',XFormattedNumber);
	                  //var label = Highcharts.numberFormat(this.axis.defaultLabelFormatter.call(this))+ result.Xaxis;
	                  return label;
              		}
					
					
					
				}
			},
			yAxis: {
				//PRAJAKTA: THIS CHART IS DISPLAYED VERTICALLTY SO X WILL BE CONSIDERED AS  Y AND VICE VERSA.

				allowDecimals: AllowDecimalNumberXaxis,

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
					},
					 formatter: function () {
					 	//console.log('AllowDecimalNumberXaxis',AllowDecimalNumberXaxis);
      					//console.log('AllowDecimalNumberYaxis',AllowDecimalNumberYaxis);

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
			tooltip: {
				
				//valuePrefix : formatterPrefix,
				/*positioner: function () {
						return { x: 20, y: 40 };
				},*/
				shadow: false,
				backgroundColor: 'rgba(255,255,255,0.8)',
				style : {
						textOverflow: 'ellipsis',
						fontFamily: 'Helvetica'
					},
				
					formatter: function () {
					//console.log('XFormattedNumber----',XFormattedNumber);
					//console.log('this11----',this);
					//console.log('this11----',this);
					var s = '<b>' + this.series.name  + ': '+'</b>';
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

			plotOptions: {
				series: {
					stacking: 'normal',
					point: {
					events : {
	                        click: function () {
	                        	//console.log('this------->',this.series.name);
	                        	//console.log('this------->',this.series.name);
	                        	var selectedYValue = this.category;
								var selectedXValue = this.series.name;
								//console.log('selectedYValue',selectedYValue);
								//console.log('selectedXValue',selectedXValue);
								$scope.getDataForSelectedValue(selectedYValue,selectedXValue);
								j$('#'+modalId+'recordsModal').addClass('fade in');
							 	j$('#'+modalId+'recordsModal').css('display', 'block');
							 	j$('#'+modalId+'recordsModal').attr('aria-hidden', 'false');

	                           
	                        } 
	                        
	                    }
                	},
					/*events : {
						click: function(event) {
													alert('Category: ' + this.category + ', value: ' + this.y);

							//console.log('eventbarstavke',event);
							var selectedYValue = event.point.category;
							var selectedXValue = event.point.y;

							$scope.getDataForSelectedValue(selectedYValue,selectedXValue);
							////console.log('clciked 12----',this);
							 j$('#'+modalId+'recordsModal').addClass('fade in');
							 j$('#'+modalId+'recordsModal').css('display', 'block');
							 j$('#'+modalId+'recordsModal').attr('aria-hidden', 'false');
						},*/
						legendItemClick: function () {
                        	return false;
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
				enabled : DisableLegend,
				reversed: true,
				layout: $scope.HeaderStyle == 'Horizontal' ? 'horizontal' : 'horizontal',
				align: $scope.HeaderStyle == 'Horizontal' ? 'center' : 'center',
				verticalAlign: $scope.HeaderStyle == 'Horizontal' ? 'bottom' : 'bottom',
				borderWidth: 0,
				itemStyle : {
					fontWeight : 'normal'
				},
				itemMarginTop: 10,
				itemMarginBottom : 10,
				floating : false,
				y: 10
			},
			credits: {
				enabled: false
			},
			series: result
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