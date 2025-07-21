//var j$ = jQuery.noConflict();
//var ColumnDrillDownApp = angular.module(chartColumnDrilldown_chartHTMLId,[]);
ColumnDrillDownApp.controller('ColumnDrillDownAppCtrl',function ($scope, $q, $filter, Scopes) {
	var j$ = jQuery.noConflict();
	var chart;
	var currentFY = Scopes.get('MasterColumnDrillDownAppCtrl').chartColumnDrilldown_currentFiscalYear;
	var phaseNameParam = Scopes.get('MasterColumnDrillDownAppCtrl').chartColumnDrilldown_phaseNameParam; 
	var fiscalYear = ''; 
	var division = '';
	var isDashboard = false;
	var fiscalYearForEnhancedView = Scopes.get('MasterColumnDrillDownAppCtrl').chartColumnDrilldown_fiscalYear;
	
	$scope.chartId = Scopes.get('MasterColumnDrillDownAppCtrl').chartColumnDrilldown_chartHTMLId;  
	$scope.resultTable =[];
	$scope.cName = Scopes.get('MasterColumnDrillDownAppCtrl').chartColumnDrilldown_chartName;
    $scope.isEnhancedView = Scopes.get('MasterColumnDrillDownAppCtrl').chartColumnDrilldown_isEnhancedView;
    $scope.chartColumnDrilldown_contextRecordId = Scopes.get('MasterColumnDrillDownAppCtrl').chartColumnDrilldown_contextRecordId;
	$scope.newFilterClause = '';
		
	//if(phaseNameParam.indexOf('Dashboard') != -1){
		phaseNameParam = Scopes.get('MasterColumnDrillDownAppCtrl').chartColumnDrilldown_phaseParam;
		if(!phaseNameParam){
			 phaseNameParam = Scopes.get('MasterColumnDrillDownAppCtrl').chartColumnDrilldown_defaultPhase;
		}		
		isDashboard = true;		
		fiscalYear = Scopes.get('MasterColumnDrillDownAppCtrl').chartColumnDrilldown_fiscalYear;
		division = Scopes.get('MasterColumnDrillDownAppCtrl').chartColumnDrilldown_division;
		if(fiscalYear != ''){ 
			 var fyStr =  ' (' + fiscalYear.split('-').join(',') + ') ';
			 $scope.newFilterClause = '{yearfilterclause} ' + fyStr;
			 //console.log('$scope.newFilterClause columnDrillDown: ',$scope.newFilterClause);
		}
	/*}
	if(fiscalYearForEnhancedView != '') {
		var fyStr =  ' (' + fiscalYearForEnhancedView.split('-').join(',') + ') ';
		$scope.newFilterClause = '{yearfilterclause} ' + fyStr;
		//console.log('$scope.newFilterClause columnDrillDown: ',$scope.newFilterClause);
	}*/
		
	$scope.fetchInitialData = function(cName,chartId){	  
		if($scope.chartColumnDrilldown_contextRecordId == ''){
			$scope.showDataLabel = !$scope.isPhase;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartColumnDrilldownActions.fetchInitialData,cName,phaseNameParam ,chartId,isDashboard, $scope.newFilterClause,
				paintBarStackedChart,
				{escape:false, buffer: false}
			);
		}else{
			$scope.showDataLabel = true;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartColumnDrilldownActions.fetchInitDataWithRecordId,cName,phaseNameParam ,chartId,isDashboard,$scope.newFilterClause,$scope.chartColumnDrilldown_contextRecordId,
				paintBarStackedChart,
				{escape:false, buffer: false}
			);
		}
		
		function paintBarStackedChart(result, event){
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
					$scope.drilldown = result.drilldown;
					$scope.xAxis = result.Xaxis;
					$scope.yAxis = result.Yaxis;
					if($scope.isEnhancedView == 'true'){
						$scope.isPhase = false;
						$scope.yAxisLabel = result.Yaxis;
						$scope.xAxisLabel = result.Xaxis;
						$scope.ChartTitle = result.Title;
						$scope.EnableExporting = true;
						$scope.chartHeight = 400;
					}else{
						$scope.xAxisLabel = result.Xaxis;
						$scope.yAxisLabel = result.Yaxis;
						$scope.ChartTitle = '';
						$scope.EnableExporting = false;
					} 
					//$scope.heightForDrillDown;					
					if($scope.isPhase){
						$scope.heightForDrillDown = 220;    //240
					}else if($scope.isEnhancedView == 'true'){
						$scope.heightForDrillDown = 450;
					}else{
						$scope.heightForDrillDown = 220;    //210
					}										
				}); 
				$scope.constructChart(eval(result.categoryJSONForLineChart),eval(result.Categories),result.FormatterPrefix,result.chartId,eval(result.seriesForLineChart),eval(result.drillDown),result.chartId.trim());                       
			  }
		}
	}
	$scope.fetchData = function(phaseNameParam ,filterClause,cName,chartId,modalId){
		$scope.newFilterClause =  filterClause;
		$scope.fetchInitialData (cName,chartId);
	}
	
	var UNDEFINED;
	$scope.constructChart = function(result,resultCategories,formatterPrefix,chartId,seriesForLineChart,drillDown,modalId)    { 	
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
			},lang: {
				drillUpText: 'Back'
			}
		});        

		j$('#chart'+ chartId).highcharts({
			chart:{
				type : 'column',
				height: $scope.heightForDrillDown
				//marginLeft: 20
			},
			title : {
				text : $scope.ChartTitle
			},
			xAxis: {
				type: 'category',
				labels :{           
					style : {                                   
						fontFamily: 'Arial',
						fontWeight : 'normal',                                                      
						textOverflow : 'ellipsis' ,
						textDecoration : 'none'                                                       
					}                        
				}
			},
			legend : {
				enabled : false
			},
			yAxis: {
				title: {
					text: $scope.yAxis,
					margin: 10,
					style : {
						fontWeight : 900,
						fontFamily: 'Arial'                      
					}
				},
				labels : {
					style : {
						fontFamily: 'Arial',
						fontWeight : 'normal'                   
					}
				}                    
			},                                               
			plotOptions: {
				column : {
					dataLables : {
						zIndex : 10
					}
				},
				series: {
					borderWidth: 0,
					dataLabels: {
						enabled: false,
						format: '{point.y:.1f}'
					},
					point: {
						events: {
							click: function() {                             
								if( this.x != null ){
									j$('#'+modalId+'recordsModal').addClass('fade in');
									j$('#'+modalId+'recordsModal').css('display', 'block');
									j$('#'+modalId+'recordsModal').attr('aria-hidden', 'false');
								}                                   
							}
						}
					}  
				}                               
			}, 

			exporting : {
				enabled : $scope.EnableExporting,
				scale:1.85,
				chartOptions : {
					title : {
						text : $scope.Charttitle
					}
				}
			},
			credits: {
				enabled: false
			},
			series:seriesForLineChart,
			drilldown:{
				series : drillDown,
				activeAxisLabelStyle : {
					fontFamily: 'Arial',
					fontWeight : 'normal',                                                      
					textOverflow : 'ellipsis',
					textDecoration : 'none'                                                                         
				},
				drillUpButton : {
					relativeTo: 'spacingBox',
					theme : {
						style : {
							opacity  :0.5,
						}
					},
					position: {
						y:0
						//   y: -5,
						//   x: 65
					}                            
				}
			},
			tooltip: {               
				/*positioner: function () {
				return { x: 20, y: 40 };
				},*/
				shadow: false,
				backgroundColor: 'rgba(255,255,255,0.8)',
				useHTML: true,
				style : {
					textOverflow: 'ellipsis',
					fontFamily: 'Arial' ,                                              
				},
				formatter: function() {                
					tooltipVal = '<b>' + this.point.name + '</b>';
					if(formatterPrefix == '$'){                           
						tooltipVal += ' : <b>'+  $filter('currency')(this.point.y, '$') +'</b>';
					}else{                      
						tooltipVal += ' : <b>'+ this.point.y +'</b>';
					} 
					return tooltipVal;
				}
			}
		});        
	}    
	$scope.fetchInitialData($scope.cName,$scope.chartId);        
});
ColumnDrillDownApp.factory('Scopes', function ($rootScope) {
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
