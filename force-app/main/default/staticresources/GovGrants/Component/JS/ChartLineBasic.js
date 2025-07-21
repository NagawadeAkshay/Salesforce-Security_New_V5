//var LineChartApp= angular.module(chartLineBasic_chartHTMLId,['ui.bootstrap']); 
LineChartApp.controller('LineChartAppCtrl',function ($scope, $q, $filter, Scopes) {
	Scopes.store('LineChartAppCtrl', $scope);
	var j$ = jQuery.noConflict();
	var currentFY = Scopes.get('MasterLineChartAppCtrl').chartLineBasic_currentFiscalYear;
	var phaseNameParam = Scopes.get('MasterLineChartAppCtrl').chartLineBasic_phaseNameParam; 
	var fiscalYear = ''; 
	var division = '';	
	var chart;
	var isDashboard = false;
	$scope.selectedYVal = '';
	$scope.selectedXVal = '';
	$scope.showAllData = false;

	$scope.chartLineBasic_contextRecordId = Scopes.get('MasterLineChartAppCtrl').chartLineBasic_contextRecordId;
	
	$scope.chartId = Scopes.get('MasterLineChartAppCtrl').chartLineBasic_chartHTMLId;  
	$scope.resultTable =[];
	$scope.cName = Scopes.get('MasterLineChartAppCtrl').chartLineBasic_chartName;
	$scope.isEnhancedView = Scopes.get('MasterLineChartAppCtrl').chartLineBasic_isEnhancedView;	
	$scope.newFilterClause = Scopes.get('MasterLineChartAppCtrl').chartLineBasic_chartParameters;	
	
	//if(phaseNameParam.indexOf('Dashboard') != -1){
		phaseNameParam = Scopes.get('MasterLineChartAppCtrl').chartLineBasic_phaseParam;
		if(!phaseNameParam){
			phaseNameParam = Scopes.get('MasterLineChartAppCtrl').chartLineBasic_defaultPhase;
		}		
		isDashboard = true;
		fiscalYear = Scopes.get('MasterLineChartAppCtrl').chartLineBasic_fiscalYear;		
		division = Scopes.get('MasterLineChartAppCtrl').chartLineBasic_division;
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
		paramMap.recordId = $scope.chartLineBasic_contextRecordId;
		paramMap.selectedYVal = $scope.selectedYVal;
		paramMap.selectedXVal = $scope.selectedXVal;
		paramMap.showAllData = $scope.showAllData;	
		if($scope.chartLineBasic_contextRecordId == ''){
			$scope.showDataLabel = !$scope.isPhase;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartLineBasicActions.fetchInitialData,paramMap,
				paintLineChart,
				{escape:false, buffer: false}
			);
		}else{
			$scope.showDataLabel = true;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartLineBasicActions.fetchInitDataWithRecordId,paramMap,
				paintLineChart,
				{escape:false, buffer: false}
			);
		}

		function paintLineChart(result, event){			
			if(event.status){
				$scope.$apply(function () {
					$scope.NoDataAvailable = (result.NoDataAvailable == 'true'? true : false);					
					//if($scope.selectedYVal != '' && $scope.selectedXVal != '') {
						$scope.records = result;
						$scope.selectedXVal = '';
						$scope.selectedYVal = '';
					//} else{
						$scope.HeaderStyle= (result.HeaderStyle == null || result.HeaderStyle == '') ? 'Horizontal' : result.HeaderStyle;   //UI-Shrawan-11022015 handling null cases
						$scope.resultTable = result;
						$scope.title = result.Title;
						$scope.dataTable = result.dataTable;
						$scope.Help = result.HelpId == undefined?false:result.HelpId;
						$scope.isAdmin = result.IsAdmin;
						$scope.isPhase = result.isPhase;
						$scope.modalId = result.chartId;
						$scope.ChartHeaderTitle = result.Title;                     
						//added
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
							$scope.xAxisLabel = result.Xaxis;
							$scope.yAxisLabel = result.Yaxis;
							$scope.ChartTitle = result.Title;
							$scope.EnableExporting = true;
							$scope.chartHeight = 400;
						}else{
							$scope.xAxisLabel = result.Xaxis;
							$scope.yAxisLabel = result.Yaxis;
							$scope.ChartTitle = '';
							$scope.EnableExporting = false;
						}                        
						$scope.TableHeader = result.TableHeader;
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
					$scope.constructChart(JSON.parse(result.categoryJSONForLineChart),JSON.parse(result.Categories),result.FormatterPrefix,result.chartId,JSON.parse(result.seriesForLineChart),result.chartId.trim(),result.XAxisPrefix,result.YAxisPrefix,result.ZAxisPrefix,result.XFormattedNumber,result.YFormattedNumber,result.ZFormattedNumber,result.DisableLegend,result.AllowDecimalNumberXaxis,result.AllowDecimalNumberYaxis,result.AllowDecimalNumberZaxis,result.XAxisSuffix,result.YAxisSuffix,result.ZAxisSuffix);                       
				}
			}
		}
	}
	
	$scope.fetchData = function(phaseNameParam ,filterClause,cName,chartId,modalId){
		$scope.newFilterClause =  filterClause;
		$scope.fetchInitialData (cName,chartId);
	}
	
	$scope.constructChart = function(result,resultCategories,formatterPrefix,chartId,seriesForLineChart,modalId,XaxisPrefix,YaxisPrefix,ZaxisPrefix,XFormattedNumber,YFormattedNumber,ZFormattedNumber,DisableLegend,AllowDecimalNumberXaxis,AllowDecimalNumberYaxis,AllowDecimalNumberZaxis,XAxisSuffix,YAxisSuffix,ZAxisSuffix){ 
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
			chart: {
				type:'line',                        
				height : $scope.chartHeight                                            
			},                             
			title : {
				text : $scope.ChartTitle,                                                 
			},
			xAxis: {
				allowDecimals:AllowDecimalNumberYaxis,
				title: {
					text: $scope.xAxisLabel,
					align : 'middle',
					style : {                        
						//fontWeight : 900,
						textOverflow: 'ellipsis',
						fontFamily: 'Arial' 
					}
				},
				labels : {                   
					style : {
						textOverflow: 'ellipsis',                       
						fontFamily: 'Arial' 
					},
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
                  label = XaxisPrefix+ label;
				  label += XAxisSuffix;
                  //console.log('chartIdformattter',chartId);
                  //console.log('labelformater',label);
                  //console.log('XFormattedNumber',XFormattedNumber);
                  //var label = Highcharts.numberFormat(this.axis.defaultLabelFormatter.call(this))+ result.Xaxis;
                  return label;
					}
				},
				categories: resultCategories
			},
			plotOptions : {
				line : {
					stickyTracking : false,
					events : {
						click : function(event){
							//console.log('eventline11',event);
							//console.log('eventline',event.point.category);
							//console.log('eventline',event.point.y);
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
				},
					point : {
						events : {
							click : function(event){
								//console.log('eventpoint',event);
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
			yAxis: {
				allowDecimals:AllowDecimalNumberXaxis,
				title: {
					text: $scope.yAxisLabel,
					align : 'middle',
					style : {
						//fontWeight : 900,
						textOverflow: 'ellipsis',
						fontFamily: 'Arial' 
					}
				},
				labels : {                                       
					style : {
						textOverflow: 'ellipsis',
						fontFamily: 'Arial' 
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
                  label =  YaxisPrefix + label;
				  label += YAxisSuffix;
                  //console.log('chartIdformattter',chartId);
                  //console.log('labelformater',label);
                  //console.log('YFormattedNumber',YFormattedNumber);
                  //var label = Highcharts.numberFormat(this.axis.defaultLabelFormatter.call(this))+ result.Xaxis;
                  return label;
					}
				},
				plotLines: [{
					value: 0,
					color: '#808080'
				}]
			},
			tooltip: {               
				/*positioner: function () {
					return { x: 20, y: 40 };
				},*/
				shadow: false,
				backgroundColor: 'rgba(255,255,255,0.8)',
				style : {
					textOverflow: 'ellipsis',
					fontFamily: 'Arial' 
				},
				formatter: function () {
					//console.log('XFormattedNumber----',XFormattedNumber);
					//console.log('this11----',this);
					//console.log('this11----',this);
					var s = '<b>' + this.x  + ': '+'</b>';
						s += YaxisPrefix;
						if((YFormattedNumber == true ) ){//for Xaxis.Only one value
							 s += Highcharts.numberFormat(this.y, 2, '.', ',');
							
							//console.log('sif',s);
						}else{
							 s += this.point.y;
							//console.log('selse',s);

						}
						s += YAxisSuffix;
						
            	
					return s;
				}
			},
			navigation: {
				buttonOptions: {
					verticalAlign: 'top',
					y:-10
				}
			}, 

			exporting : {
				enabled : $scope.EnableExporting,   
				scale:1.85,                                                
				chartOptions : {                        
					legend: {
						itemStyle : {
							fontWeight : 'normal',  
						},      
						itemMarginTop: -20,
						itemMarginBottom : 20,                                                        
						layout: 'horizontal'                   
					},
					credits: {
						enabled: false
					} 
				}
			},
			credits : {
				enabled:false
			},
			legend: {                             
				enabled : DisableLegend,                 
				itemStyle : {
					fontWeight : 'normal',
				},                                       
				layout : 'horizontal'
			},
			series: seriesForLineChart
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

LineChartApp.factory('Scopes', function ($rootScope) {
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