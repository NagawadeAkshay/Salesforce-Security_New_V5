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
		if($scope.chartFunnelBasic_contextRecordId == ''){
			$scope.showDataLabel = !$scope.isPhase;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartFunnelBasicActions.fetchInitialData,cName,phaseNameParam ,chartId,$scope.isDashboard,$scope.newFilterClause,
				paintFunnelBasicChart,
				{escape:false, buffer: false}
			);
		}else{
			$scope.showDataLabel = true;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartFunnelBasicActions.fetchInitDataWithRecordId,cName,phaseNameParam ,chartId,$scope.isDashboard,$scope.newFilterClause,$scope.chartFunnelBasic_contextRecordId,
				paintFunnelBasicChart,
				{escape:false, buffer: false}
			);
		}

		function paintFunnelBasicChart(result, event){
			if(event.status){
				$scope.$apply(function () {
					$scope.NoDataAvailable = (result.NoDataAvailable == 'true'? true : false);
					$scope.Charttitle = result.ChartTitle;
					$scope.title = result.Title;
					$scope.HeaderStyle = (result.HeaderStyle == null || result.HeaderStyle == '') ? 'Horizontal' : result.HeaderStyle;   //UI-Shrawan-11022015 handling null cases
					$scope.resultTable = result;
					$scope.isPhase = result.isPhase;
					if($scope.isEnhancedView == 'true'){
						$scope.isPhase = false;                     
						$scope.ChartTitle = result.Title;
						$scope.EnableExporting = true; 
						$scope.chartHeight = 470; 
						$scope.chartWidth = 450;
						$scope.neckWidth = '20%';               
					}else{
						$scope.ChartTitle = '';
						$scope.EnableExporting = false;
						$scope.chartWidth = 250;
						$scope.neckWidth = '25%';
					}    
					$scope.records = result;					                   
				});                       
			}
			$scope.constructChart(result,result.chartId.trim()); 
		}
	}   

	$scope.constructChart = function (result,modalId) {
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
				valueSuffix: result.FormatterPrefix,
				formatter: function() {
					tooltipVal = '<b>'+this.point.name+'</b>' ;
					if(result.FormatterPrefix == '$'){                           
						tooltipVal += ' : <b>'+ $filter('currency')(this.point.y, '$') +'</b>';
					}else{                      
						tooltipVal += ' : <b>'+ this.point.y +'</b>';
					} 
					return tooltipVal;
				}
			},
			legend :{
				enabled : true,
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
							click : function(){
								//console.log('this------>>>>>',this);
							}
						}
					},
					events : {
						click : function(event){							
							j$('#'+modalId+'recordsModal').addClass('fade in');
							j$('#'+modalId+'recordsModal').css('display', 'block');
							j$('#'+modalId+'recordsModal').attr('aria-hidden', 'false');
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
				data : eval(result.funnelChartJSON)
			}]     
		});

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