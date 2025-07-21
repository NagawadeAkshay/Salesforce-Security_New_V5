var j$ = jQuery.noConflict();
//var FunnelChartApp = angular.module(chartFunnelBasic_chartHTMLId,[]); //'ui.bootstrap','ngAnimate', 'ngSanitize', 'mgcrea.ngStrap'
FunnelChartApp.controller('FunnelChartAppCtrl',function ($scope, $filter, $q, Scopes) {
	Scopes.store('FunnelChartAppCtrl', $scope);
	var currentFY = Scopes.get('MasterFunnelChartAppCtrl').chartFunnelBasic_currentFiscalYear;
	var phaseNameParam = Scopes.get('MasterFunnelChartAppCtrl').chartFunnelBasic_phaseNameParam; 
	var  fiscalYear = Scopes.get('MasterFunnelChartAppCtrl').chartFunnelBasic_fiscalYear;
	var chart;            
	$scope.isDashboard = false;    
	$scope.chartId = Scopes.get('MasterFunnelChartAppCtrl').chartFunnelBasic_chartHTMLId;  
	$scope.resultTable =[];
	$scope.newFilterClause='';
	$scope.selectedYVal = '';
	$scope.selectedXVal = '';
	$scope.showAllData = false;	
	$scope.cName = Scopes.get('MasterFunnelChartAppCtrl').chartFunnelBasic_chartName;        	
	$scope.isEnhancedView = Scopes.get('MasterFunnelChartAppCtrl').chartFunnelBasic_isEnhancedView;
	$scope.chartFunnelBasic_contextRecordId = Scopes.get('MasterFunnelChartAppCtrl').chartFunnelBasic_contextRecordId;
	
	if(phaseNameParam == 'Dashboard'){
		phaseNameParam = Scopes.get('MasterFunnelChartAppCtrl').chartFunnelBasic_phaseParam;
		if(!phaseNameParam){
			phaseNameParam = 'Planning';
		}
		$scope.isDashboard = true;
	}
	if(fiscalYear != ''){
		var fyStr =  ' (' + fiscalYear.split('-').join(',') + ') ';
		$scope.newFilterClause = '{yearfilterclause} ' + fyStr;
		//console.log('Funnel newFilterClause  :', $scope.newFilterClause );
	}

	$scope.fetchInitialData = function(cName,chartId){
	var paramMap = {};
		paramMap.chartName = cName;
		paramMap.phaseName = phaseNameParam;
		paramMap.chartId = chartId;
		paramMap.isDashboard = $scope.isDashboard;
		//console.log('paramMap====',paramMap);
		paramMap.filterClause = $scope.newFilterClause;
		paramMap.recordId = $scope.chartFunnelBasic_contextRecordId;
		paramMap.selectedYVal = $scope.selectedYVal;
		paramMap.selectedXVal = $scope.selectedXVal;
		paramMap.showAllData = $scope.showAllData;		
		if($scope.chartFunnelBasic_contextRecordId == ''){
			$scope.showDataLabel = !$scope.isPhase;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartFunnelBasicActions.fetchInitialData,paramMap,
				paintFunnelBasicChart,
				{escape:false, buffer: false}
			);
		}else{
			$scope.showDataLabel = true;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartFunnelBasicActions.fetchInitDataWithRecordId,paramMap,
				paintFunnelBasicChart,
				{escape:false, buffer: false}
			);
		}

		function paintFunnelBasicChart(result, event){
			if(event.status){
				//console.log('result------' , result);
				$scope.$apply(function () {
					$scope.NoDataAvailable = (result.NoDataAvailable == 'true'? true : false);
					$scope.Charttitle = result.ChartTitle;
					$scope.selectedXVal = '';
					$scope.selectedYVal = '';
					$scope.title = result.Title;
					$scope.HeaderStyle = (result.HeaderStyle == null || result.HeaderStyle == '') ? 'Horizontal' : result.HeaderStyle;   //UI-Shrawan-11022015 handling null cases
					$scope.resultTable = result;
					$scope.isPhase = result.isPhase;
					$scope.modalId = result.chartId;
					$scope.XAxisSuffix = result.XAxisSuffix;
					$scope.YAxisSuffix = result.YAxisSuffix;
					$scope.XAxisPrefix = result.XAxisPrefix;
					$scope.YAxisPrefix = result.YAxisPrefix;
					$scope.XFormattedNumber = result.XFormattedNumber;
					$scope.YFormattedNumber = result.YFormattedNumber;
					$scope.DisableLegend = result.DisableLegend;
					$scope.AllowDecimalNumberXaxis = result.AllowDecimalNumberXaxis;
					$scope.AllowDecimalNumberYaxis = result.AllowDecimalNumberYaxis;
					
					if($scope.isEnhancedView == 'true'){
						$scope.isPhase = false;                     
						$scope.ChartTitle = result.Title;
						$scope.EnableExporting = true; 
						$scope.chartHeight = 420; 
						$scope.chartWidth = 450;
						$scope.neckWidth = '20%';               
					}else{
						$scope.ChartTitle = '';
						$scope.EnableExporting = false;
						$scope.chartHeight = 220; 
						$scope.chartWidth = 250;
						$scope.neckWidth = '25%';
					}    
					$scope.records = result;					                   
				});                       
			}
			if($scope.selectedXVal == '' && $scope.selectedYVal == '') {
				$scope.constructChart(result,result.chartId.trim(),result.XAxisPrefix,result.YAxisPrefix,result.XFormattedNumber,result.YFormattedNumber,result.DisableLegend,result.AllowDecimalNumberXaxis,result.AllowDecimalNumberYaxis,result.XAxisSuffix,result.YAxisSuffix); 
			}
		}
	}   

	$scope.constructChart = function (result,modalId,XaxisPrefix,YaxisPrefix,XFormattedNumber,YFormattedNumber,DisableLegend,AllowDecimalNumberXaxis,AllowDecimalNumberYaxis,XAxisSuffix,YAxisSuffix) {
		//console.log('resultfunnel',result);
		Highcharts.setOptions({ // Apply to all charts
			chart: {
				events: {
					beforePrint: function () {
						this.oldhasUserSize = this.hasUserSize;
						this.resetParams = [this.chartWidth, this.chartHeight, false];
						//this.setSize(300, 300, false);                   
					},
					afterPrint: function () {
						this.setSize.apply(this, this.resetParams);
						this.hasUserSize = this.oldhasUserSize;                  
					}
				}
			}
		});
		
		j$("#chart"+result.chartId).highcharts({
			chart: {
				type: 'funnel',
				height : $scope.chartHeight,                    
				style : {
					margin: '0 auto'
				}    
			},
			title: {
				text:$scope.ChartTitle
				//x: -60
			},
			tooltip: {
				/*valueSuffix: result.FormatterPrefix,
				formatter: function() {
					tooltipVal = '<b>'+this.point.name+'</b>' ;
					if(result.FormatterPrefix == '$'){                           
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
			legend :{
				enabled : DisableLegend,
				itemMarginTop: 20,                                        
				layout: 'horizontal',  
				itemStyle : {
					fontWeight : 'normal'
				},
			},
			plotOptions: {
				funnel : {
					width :$scope.chartWidth,
					point : {
						events : {
							click : function(event){
								//console.log('hello');
								var selectedYValue = this.index;
								var selectedXValue = this.name;
								//console.log('selectedYValue1',selectedYValue);
								//console.log('selectedXValue1',selectedXValue);
								//console.log('event111',event);
								$scope.getDataForSelectedValue(selectedYValue,selectedXValue);
								//console.log('this------>>>>>',this);
								//console.log('this.index--->>>>>',this.index);
								//console.log('this.name------>>>>>',this.name);
								j$('#'+modalId+'recordsModal').addClass('fade in');
								j$('#'+modalId+'recordsModal').css('display', 'block');
								j$('#'+modalId+'recordsModal').attr('aria-hidden', 'false');
							},
							legendItemClick: function () {
                        		return false;
							}
						}
					},
					events : {
						click : function(event){
						
							
						}
					}
				},
				series: {
					dataLabels: {
						enabled: false,
						format: result.FormatterPrefix,
						color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
						style :{
							textShadow : 'none',
							fontWeight : 'normal'
						},
						softConnector: true
					},
					neckWidth: $scope.neckWidth,
					neckHeight: '25%',
					showInLegend: true
					//-- Other available options
					// height: pixels or percent
					// width: pixels or percent
				}
			},
			credits :{
				enabled :false
			},

			exporting : {
				enabled : $scope.EnableExporting,
				scale:1.85                                                  
			},
			series: [{
				name : $scope.title,
				data : JSON.parse(result.funnelChartJSON)
			}]     
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
	/*Filter method*/
	$scope.fetchData = function(phaseNameParam ,filterClause,cName,chartId){
		$scope.newFilterClause =  filterClause;
		$scope.fetchInitialData (cName,chartId);
	}

	$scope.fetchInitialData($scope.cName,$scope.chartId);
});

FunnelChartApp.factory('Scopes', function ($rootScope) {
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