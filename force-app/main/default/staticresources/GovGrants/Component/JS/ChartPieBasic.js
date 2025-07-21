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
	$scope.selectedVal = '';
	$scope.cName = Scopes.get('MasterPieChartAppCtrl').chartPieBasic_chartName;
	$scope.recordId = Scopes.get('MasterPieChartAppCtrl').chartPieBasic_contextRecordId;	
	$scope.isEnhancedView = Scopes.get('MasterPieChartAppCtrl').chartPieBasic_isEnhancedView;	
	$scope.isDashboard = false;
	$scope.showAllData = false;
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
		//$scope.newFilterClause = $scope.newFilterClause.replace('{!selectedValue}', $scope.selectedVal);
		//console.log('$scope.newFilterClause---', $scope.newFilterClause);
		var paramMap = {};
		paramMap.chartName = cName;
		paramMap.phaseName = phaseNameParam;
		paramMap.chartId = chartId;
		paramMap.isDashboard = $scope.isDashboard;
		//console.log('paramMap====',paramMap);

		paramMap.filterClause = $scope.newFilterClause;
		paramMap.recordId = $scope.chartPieBasic_contextRecordId;
		paramMap.selectedVal = $scope.selectedVal;
		paramMap.showAllData = $scope.showAllData;
		if($scope.chartPieBasic_contextRecordId == ''){
			$scope.showDataLabel = !$scope.isPhase;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartPieBasicActions.fetchInitialData,paramMap,
				paintPieBasicChart,
				{escape:false, buffer: false,timeout:3000}
			);
		}else{
			$scope.showDataLabel = true;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartPieBasicActions.fetchInitDataWithRecordId,paramMap,
				paintPieBasicChart,
				{escape:false, buffer: false}
			);
		}

		function paintPieBasicChart(result, event){
		//console.log('result---',result);			
			if(event.status){
				$scope.$apply(function () {
					$scope.NoDataAvailable = (result.NoDataAvailable == 'true'? true : false);
					
					//if($scope.selectedVal != '') {
						$scope.records = result;
						$scope.selectedVal = '';
					//} else {
						$scope.Charttitle = result.ChartTitle;
						$scope.title = result.Title;										
						$scope.HeaderStyle = result.HeaderStyle;
						$scope.resultTable = result;
						//console.log('$scope.records--', $scope.records);
						$scope.selectedVal = ''
						$scope.isPhase = result.isPhase;
						$scope.isAdmin = result.IsAdmin;
						$scope.TableHeader = result.TableHeader;
						$scope.legendLayout = '';
						$scope.legendVerticalAlign = '';
						$scope.legendAlign = '';
						$scope.modalId = result.chartId;
						$scope.XAxisPrefix = result.XAxisPrefix;
						$scope.XAxisSuffix = result.XAxisSuffix;
						$scope.XFormattedNumber = result.XFormattedNumber;
						$scope.DisableLegend = result.DisableLegend;
						$scope.AllowDecimalNumberXaxis = result.AllowDecimalNumberXaxis;
						
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
							$scope.ChartHeight = 220;
						}
						$scope.Help = result.HelpId == undefined?false:result.HelpId;
					//}
					
				});
			}
			if($scope.selectedVal == '') {
				$scope.constructChart(JSON.parse(result.Data),'#chart'+result.chartId.trim(),result.ChartTitle, result.chartId.trim(), result.FormatterPrefix,result.XAxisPrefix,result.XFormattedNumber,result.DisableLegend,result.AllowDecimalNumberXaxis,result.XAxisSuffix);
			}
		}
	}

	$scope.constructChart  = function(result,chartId,title, modalId, formatter,XaxisPrefix,XFormattedNumber,DisableLegend,AllowDecimalNumberXaxis,XAxisSuffix){			
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
				//valueSuffix: formatter,
				/*formatter: function() {				
					tooltipVal = '<b>'+this.point.name+'</b>' ;
					if(formatter == '$'){
						tooltipVal += ' : <b>'+ $filter('currency')(this.point.y, '$') +'</b>';
					}else{
						tooltipVal += ' : <b>'+ this.point.y +'</b>';
					}
					return tooltipVal;
				}*/
				formatter: function () {
					//console.log('XFormattedNumber----',XFormattedNumber);
					var s = '<b>' + this.point.name + ': '+'</b>';
						s += XaxisPrefix;
						if((XFormattedNumber == true ) ){//for Xaxis.Only one value
							 s += Highcharts.numberFormat(this.point.y, 2, '.', ',');
							
							//console.log('sif',s);
						}else{
							 s += this.point.y;
							//console.log('selse',s);

						}
						s += XAxisSuffix;
						
            	
					return s;
				}
			},
		
		/*yAxis: {
				allowDecimals: AllowDecimalNumberXaxis,
				//type: 'logarithmic',
				//allowDecimals: true,
				// Primary yAxis 
				//minorTickLength: 10,
			// minorTickInterval: 'auto', // Primary yAxis 
				//minRange: 5,
        		//maxPadding:10, 
        		//minPadding:1,            
				
				labels: {
					formatter: function () {
						//console.log('this.axis.defaultLabelFormatter',this.axis.defaultLabelFormatter);
					//console.log('AllowDecimalNumberYaxis',AllowDecimalNumberYaxis);

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
	                	//console.log('chartIdformattter',chartId);
	                	//console.log('labelformater',label);
	                	//console.log('YFormattedNumber',YFormattedNumber);
	                	//var label = Highcharts.numberFormat(this.axis.defaultLabelFormatter.call(this))+ result.Xaxis;
	                	return label;
	            	}
            	}
			},*/  			
			legend: {
				enabled : DisableLegend,
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
					point: {
                    	events: {
                        	legendItemClick: function () {
                            	return false;
                         	}
                                        
                   		 }
               		 },
					size:$scope.pieSize,
					dataLabels: {
						enabled: false
					},
					stickyTracking : false,
					events: {
						click: function(event) {
						//onclick event is fired	
						//console.log('event-------',event);	
						var selectedAction = event.point.name;
						//angular.element(document.getElementById('asideId')).scope().initFilterChart(selectedAction);
						
						$scope.getDataForSelectedValue(selectedAction);
						//console.log('selectedAction-------',selectedAction);	
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
	$scope.getAllData = function(){
		//to show all data method
		$scope.records = undefined;
		$scope.showAllData = true;
		//console.log('$scope.showAllData',$scope.showAllData);
		$scope.fetchInitialData($scope.cName,$scope.chartId);
		$scope.showAllData = false;
		j$('#'+$scope.modalId+'recordsModal').addClass('fade in');
		j$('#'+$scope.modalId+'recordsModal').css('display', 'block');
		j$('#'+$scope.modalId+'recordsModal').attr('aria-hidden', 'false');
		
	}

	$scope.getDataForSelectedValue = function(selectedVal){
		//to show selected data method
		$scope.records = undefined;
		$scope.selectedVal = selectedVal;
		$scope.fetchInitialData($scope.cName,$scope.chartId);
		$scope.selectedXVal = '';
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