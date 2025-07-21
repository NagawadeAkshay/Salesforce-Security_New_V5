var j$ = jQuery.noConflict();
//var GaugeApp = angular.module(chartSolidGauge_chartHTMLId,[]);
GaugeApp.controller('GaugeChartAppCtrl',function ($scope, $q, $filter, Scopes) {
	Scopes.store('GaugeChartAppCtrl', $scope);
	var chartId = Scopes.get('MasterGaugeChartAppCtrl').chartSolidGauge_chartHTMLId;
	var currentFY = Scopes.get('MasterGaugeChartAppCtrl').chartSolidGauge_currentFiscalYear;
	var fiscalYear = ''; 
	var division = '';
	$scope.selectedVal = '';
	var phaseNameParam = Scopes.get('MasterGaugeChartAppCtrl').chartSolidGauge_phaseNameParam;
	$scope.isEnhancedView = Scopes.get('MasterGaugeChartAppCtrl').chartSolidGauge_isEnhancedView;
	$scope.chartId = Scopes.get('MasterGaugeChartAppCtrl').chartSolidGauge_chartHTMLId;
	$scope.cName = Scopes.get('MasterGaugeChartAppCtrl').chartSolidGauge_chartName;
	$scope.isDashboard = false;
	$scope.newFilterClause = '';
	fiscalYear = Scopes.get('MasterGaugeChartAppCtrl').chartSolidGauge_fiscalYear;
	$scope.chartSolidGauge_contextRecordId = Scopes.get('MasterGaugeChartAppCtrl').chartSolidGauge_contextRecordId;
	$scope.EnableExporting = false;
	$scope.showAllData = false;
	//if(phaseNameParam.indexOf('Dashboard') != -1){
		phaseNameParam = Scopes.get('MasterGaugeChartAppCtrl').chartSolidGauge_phaseParam;
		if(!phaseNameParam){
			phaseNameParam = Scopes.get('MasterGaugeChartAppCtrl').chartSolidGauge_defaultPhase;
		}
		$scope.isDashboard = true;
		if(fiscalYear != ''){
			var fyStr =  ' (' + fiscalYear.split('-').join(',') + ') ';
			$scope.newFilterClause = '{yearfilterclause} ' + fyStr;
		}
	//}

	$scope.getDataForSelectedValue = function(selectedVal){
		//selected data method
		$scope.records = undefined;
		$scope.selectedVal = selectedVal;
		$scope.initGaugeChartData($scope.cName,$scope.chartId);
		$scope.selectedVal='';
	
	}
	$scope.getAllData = function(){
		//to show all data method
		$scope.records = undefined;
		$scope.showAllData = true;
		//console.log('$scope.showAllData',$scope.showAllData);
		$scope.initGaugeChartData($scope.cName,$scope.chartId);
		$scope.showAllData = false;
		j$('#'+$scope.modalId+'recordsModal').addClass('fade in');
		j$('#'+$scope.modalId+'recordsModal').css('display', 'block');
		j$('#'+$scope.modalId+'recordsModal').attr('aria-hidden', 'false');
		
	}
	


	$scope.initGaugeChartData = function(cName,chartId){
		
			var paramMap = {};
		    //console.log('paramMap--------11',cName);
		    paramMap.chartName = cName;
			paramMap.phaseName = phaseNameParam;
			paramMap.chartId = chartId;
			paramMap.isDashboard = $scope.isDashboard;
			paramMap.filterClause = $scope.newFilterClause;
			paramMap.recordId = $scope.chartSolidGauge_contextRecordId;
			//paramMap.selectedVal = $scope.selectedVal;
			paramMap.showAllData = $scope.showAllData;
			//console.log('paramMap--------11',paramMap);
		if($scope.chartSolidGauge_contextRecordId == ''){
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartSolidGaugeActions.fetchInitialData,paramMap,$scope.paintGaugeSolidChart,{buffer: false, escape: false}
			);
		}
		else{
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartSolidGaugeActions.fetchInitDataWithRecordId,paramMap,$scope.paintGaugeSolidChart,{ buffer: false, escape: false, timeout: 30000 }
			);
		}		
	}

	$scope.paintGaugeSolidChart = function(result, event){
		if(event.status){
			//console.log("result="+JSON.stringify(result));
			$scope.$apply(function () {				
						
				$scope.isAdmin = result.IsAdmin;
				$scope.title = result.Title;
					$scope.records = result;
					$scope.modalId = result.chartId;
				$scope.resultTable = result;
				$scope.HeaderStyle= result.HeaderStyle;
				$scope.isPhase= result.isPhase;
					$scope.isShowAllData= result.isShowAllData;
					
				if($scope.isEnhancedView == 'true'){
						
						
					$scope.isPhase = false;
					$scope.ChartTitle = result.Title;
					$scope.EnableExporting = true;
					$scope.chartHeight = 450;
				}else{
					$scope.ChartTitle = '';
					$scope.EnableExporting = false;
					$scope.chartHeight = 200;
				}
				$scope.TableHeader = result.TableHeader;
				if($scope.isPhase){
					$scope.chartHeight = 200;	//250
				}else if($scope.isEnhancedView == 'true'){
					$scope.chartHeight = 450;
				}else{
					$scope.chartHeight = 200;	//230
				}
				$scope.totalValue = result.Total;
				$scope.actualValue = result.Actual;				
				$scope.OneForuthOfTotal = $scope.totalValue/4;
				$scope.HalfOfTotal = $scope.totalValue/2;
				
			});

		}		
		
		$scope.constructChart('#chart'+result.chartId,result,result.chartId.trim());
		
	}
	
	$scope.constructChart = function(chartId,result,modalId) {	
		var maxValue = $scope.totalValue;		
		j$(chartId).height($scope.chartHeight);
		j$(chartId).highcharts({
			chart: {
				type: 'solidgauge'
			},
			title:null,
			pane: {
				center: ['50%', '85%'],
				size: '120%',
				startAngle: -90,
				endAngle: 90,
				background: {
					backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
					innerRadius: '60%',
					outerRadius: '100%',
					shape: 'arc'
				}
			},
			tooltip: {
				enabled: true
			},
			yAxis: {
				stops: [
					[0.1, '#55BF3B'], // green
					[0.5, '#DDDF0D'], // yellow
					[0.9, '#DF5353'] // red
				],
				lineWidth: 0,
				minorTickInterval: null,
				tickPixelInterval: 400,
				tickWidth: 0,
				title: {
					y: -135,
					text:'<div style="text-align:center"><span style="font-size:24px;">'+$scope.TableHeader+'</span></div>'                        
				},
				labels: {
					y: 16,
				},
				min: 0,
				max: maxValue,
				tickPositions: [0, maxValue]
			},
			plotOptions: {
				solidgauge: {
					dataLabels: {
						y: 5,
						borderWidth: 0,
						useHTML: true
					},
					events:{
            			click : function(event){
            							if(result.isSelectedData == 'false'){
            								//console.log('event------',event); 
										 	var selectedAction = event.point.name; 
											$scope.getDataForSelectedValue(selectedAction);                        								
										 	j$('#'+modalId+'recordsModal').addClass('fade in');
										 	j$('#'+modalId+'recordsModal').css('display', 'block');
										 	j$('#'+modalId+'recordsModal').attr('aria-hidden', 'false');	
            							}
            							
	
            						
              						
					}
            			},
				}
			},
			exporting : {
				enabled : $scope.EnableExporting,
				scale:1.85				
				},
			credits: {
				enabled: false
			},
			series: [{
				name: $scope.TableHeader,
				data: [$scope.actualValue]                                                     
			}]
		});          
	};
	$scope.initGaugeChartData($scope.cName,$scope.chartId);
	/* Filter Functions */
	$scope.fetchData = function(phaseNameParam ,filterClause,cName,chartId){
		$scope.newFilterClause =  filterClause;
		$scope.cName = cName;
		phaseNameParam = phaseNameParam;
		$scope.chartId = chartId;
		$scope.initGaugeChartData (cName,chartId);
	}


});

GaugeApp.factory('Scopes', function ($rootScope) {
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