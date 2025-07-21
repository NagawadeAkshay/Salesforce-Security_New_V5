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
		if($scope.chartLineBasic_contextRecordId == ''){
			$scope.showDataLabel = !$scope.isPhase;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartLineBasicActions.fetchInitialData,cName,phaseNameParam ,chartId,isDashboard,$scope.newFilterClause,
				paintLineChart,
				{escape:false, buffer: false}
			);
		}else{
			$scope.showDataLabel = true;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartLineBasicActions.fetchInitDataWithRecordId,cName,phaseNameParam ,chartId,isDashboard,$scope.newFilterClause,$scope.chartLineBasic_contextRecordId,
				paintLineChart,
				{escape:false, buffer: false}
			);
		}

		function paintLineChart(result, event){			
			if(event.status){
				$scope.$apply(function () {
					$scope.NoDataAvailable = (result.NoDataAvailable == 'true'? true : false);					
					$scope.HeaderStyle= (result.HeaderStyle == null || result.HeaderStyle == '') ? 'Horizontal' : result.HeaderStyle;   //UI-Shrawan-11022015 handling null cases
					$scope.resultTable = result;
					$scope.title = result.Title;
					$scope.records = result;
					$scope.dataTable = result.dataTable;
					$scope.Help = result.HelpId == undefined?false:result.HelpId;
					$scope.isAdmin = result.IsAdmin;
					$scope.isPhase = result.isPhase;
					$scope.ChartHeaderTitle = result.Title;                     
					if($scope.isEnhancedView == 'true'){
						$scope.isPhase = false;
						$scope.yAxisLabel = result.YaxisWholeLabel;
						$scope.xAxisLabel = result.XaxisWholeLabel;
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
				}); 
				$scope.constructChart(eval(result.categoryJSONForLineChart),eval(result.Categories),result.FormatterPrefix,result.chartId,eval(result.seriesForLineChart),result.chartId.trim());                       
			}
		}
	}
	
	$scope.fetchData = function(phaseNameParam ,filterClause,cName,chartId,modalId){
		$scope.newFilterClause =  filterClause;
		$scope.fetchInitialData (cName,chartId);
	}
	
	$scope.constructChart = function(result,resultCategories,formatterPrefix,chartId,seriesForLineChart,modalId){ 
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
					}
				},
				categories: resultCategories
			},
			plotOptions : {
				line : {
					stickyTracking : false,
					events : {
						click : function(event){							
							j$('#'+modalId+'recordsModal').addClass('fade in');
							j$('#'+modalId+'recordsModal').css('display', 'block');
							j$('#'+modalId+'recordsModal').attr('aria-hidden', 'false');
						}
					},
					point : {
						events : {
							click : function(){
								j$('#'+modalId+'recordsModal').addClass('fade in');
								j$('#'+modalId+'recordsModal').css('display', 'block');
								j$('#'+modalId+'recordsModal').attr('aria-hidden', 'false');    
							}
						}                           
					}
				}
			},
			yAxis: {
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
				enabled : true,                 
				itemStyle : {
					fontWeight : 'normal',
				},                                       
				layout : 'horizontal'
			},
			series: seriesForLineChart
		});        
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