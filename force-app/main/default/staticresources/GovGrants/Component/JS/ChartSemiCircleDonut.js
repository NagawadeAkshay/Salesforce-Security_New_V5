SemiCircularDonutApp.controller('DonutChartAppCtrl1',function ($scope, $filter, $q, Scopes) {
	Scopes.store('DonutChartAppCtrl1', $scope);
	var j$ = jQuery.noConflict();
	var chart;
	$scope.selectedVal = '';
	var currentFY = Scopes.get('MasterDonutChartAppCtrl1').chartSemiCircleDonut_currentFiscalYear;
	var phaseNameParam = Scopes.get('MasterDonutChartAppCtrl1').chartSemiCircleDonut_phaseNameParam; 
	$scope.chartId = Scopes.get('MasterDonutChartAppCtrl1').chartSemiCircleDonut_chartHTMLId;  
	$scope.resultTable =[];
	$scope.cName = Scopes.get('MasterDonutChartAppCtrl1').chartSemiCircleDonut_chartName;
	$scope.newFilterClause = '';
	$scope.isEnhancedView = Scopes.get('MasterDonutChartAppCtrl1').chartSemiCircleDonut_isEnhancedView;
	$scope.isDashboard = false;
	$scope.showAllData = false;
	$scope.chartSemiCircleDonut_contextRecordId = Scopes.get('MasterDonutChartAppCtrl1').chartSemiCircleDonut_contextRecordId;
	
	//if(phaseNameParam.indexOf('Dashboard') != -1){
		 phaseNameParam = Scopes.get('MasterDonutChartAppCtrl1').chartSemiCircleDonut_phaseParam;
		 fiscalYear = Scopes.get('MasterDonutChartAppCtrl1').chartSemiCircleDonut_fiscalYear;
		 division = Scopes.get('MasterDonutChartAppCtrl1').chartSemiCircleDonut_division;
		if(!phaseNameParam){
			 phaseNameParam = Scopes.get('MasterDonutChartAppCtrl1').chartSemiCircleDonut_defaultPhase;
		}
		if(fiscalYear != ''){ 
			 var fyStr =  ' (' + fiscalYear.split('-').join(',') + ') ';
			 $scope.newFilterClause = '{yearfilterclause} ' + fyStr;
		}
		$scope.isDashboard = true;
	//}
	   
	$scope.fetchInitialData = function(cName,chartId){
		var paramMap = {};
			//console.log('paramMap--------11',paramMap);
			paramMap.chartName = cName;
			paramMap.phaseName = phaseNameParam;
			paramMap.chartId = chartId;
			paramMap.isDashboard = $scope.isDashboard;
			paramMap.filterClause = $scope.newFilterClause;
			paramMap.recordId = $scope.chartSemiCircleDonut_contextRecordId;
			paramMap.selectedVal = $scope.selectedVal;
			paramMap.showAllData = $scope.showAllData;
			//console.log('paramMap--------11',paramMap);
	    
		if($scope.chartSemiCircleDonut_contextRecordId == ''){
			
			//console.log('paramMap--------11',paramMap);
			$scope.showDataLabel = !$scope.isPhase;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartSemiCircleDonutActions.fetchInitialData,paramMap,
				paintDonutChart,
				{escape:false, buffer: false}
			);
		}else{
			$scope.showDataLabel = true;
			Visualforce.remoting.Manager.invokeAction(
				_RemotingChartSemiCircleDonutActions.fetchInitDataWithRecordId,paramMap,
				paintDonutChart,
				{escape:false, buffer: false}
			);
		}
				
		function paintDonutChart(result, event){
			  if(event.status){
				$scope.$apply(function () {
					$scope.NoDataAvailable = (result.NoDataAvailable == 'true'? true : false);                        
					
					//if($scope.selectedVal != '') {
						$scope.records = result;
						$scope.selectedVal = '';
					//}else{
						$scope.title = result.Title;
						$scope.modalId = result.chartId;
						$scope.XAxisPrefix = result.XAxisPrefix;
						$scope.XAxisSuffix = result.XAxisSuffix;
						$scope.XFormattedNumber = result.XFormattedNumber;
						$scope.DisableLegend = result.DisableLegend;
						$scope.AllowDecimalNumberXaxis = result.AllowDecimalNumberXaxis;
						$scope.HeaderStyle= (result.HeaderStyle == null || result.HeaderStyle == '') ? 'Horizontal' : result.HeaderStyle;   //UI-Shrawan-11022015 handling null cases
						$scope.isPhase = result.isPhase;
						if($scope.isEnhancedView == 'true'){
							$scope.isPhase = false;                         
							$scope.ChartTitle = result.Title;
							$scope.EnableExporting = true;
							$scope.chartHeight = 450;
							$scope.chartSize = null;                            
						}else{                          
							$scope.ChartTitle = '';
							$scope.EnableExporting = false;
							$scope.chartHeight = 220;	//230
							$scope.chartSize = 200; 
						}
						$scope.resultTable = result;
						$scope.isAdmin = result.IsAdmin;
						$scope.Help = result.HelpId == undefined?false:result.HelpId;
					//}									   
				}); 
				if($scope.selectedVal == '') {
				 	$scope.constructChart(JSON.parse(result.Data),result.chartId,result.chartId.trim(),result.FormatterPrefix,result.XAxisPrefix,result.XFormattedNumber,result.DisableLegend,result.AllowDecimalNumberXaxis,result.XAxisSuffix);                       
			  	}
			  }
		}
	}
	
  
		
   $scope.constructChart =   function(result,chartId,modalId,formatter,XaxisPrefix,XFormattedNumber,DisableLegend,AllowDecimalNumberXaxis,XAxisSuffix){ 
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
				plotBackgroundColor: null,
				plotBorderWidth: 0,
				plotShadow: false,
				marginTop:80,
				height:$scope.chartHeight           			  
			},
			title: {
				text: $scope.ChartTitle
			},
			tooltip: {
				/*valueSuffix: formatter,
				formatter: function() {
					tooltipVal = '<b>'+this.point.name+'</b>' ;
					if(formatter == '$'){                           
						tooltipVal += ' : <b>'+ $filter('currency')(this.point.y, '$') +'</b>';
					}else{                      
						tooltipVal += ' : <b>'+ this.point.y +'</b>';
					} 
					return tooltipVal;
				}	*/	
				formatter: function () {
					//On mouseover we should get same data
					//console.log('XFormattedNumber----',XFormattedNumber);
					var s = '<b>' + this.point.name + ': '+'</b>';
						s += XaxisPrefix;
						if((XFormattedNumber == true ) ){
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
			exporting : {
				enabled : $scope.EnableExporting, 
				scale:1.85           
			},
			plotOptions: {
				pie: {
					size:$scope.chartSize, 
					dataLabels : { 
						enabled : false
					},                
					point: {
                    	events: {
                        	legendItemClick: function () {
                            	return false;
                         	}
                                        
                   		 }
               		 },                
					events: {
							click: function(event) {  
								//on click event is fired from here
							//console.log('event------',event); 
								 var selectedAction = event.point.name; 
								 $scope.getDataForSelectedValue(selectedAction);                        								
								 j$('#'+modalId+'recordsModal').addClass('fade in');
								 j$('#'+modalId+'recordsModal').css('display', 'block');
								 j$('#'+modalId+'recordsModal').attr('aria-hidden', 'false');
							}
						},               
					showInLegend : true,
					startAngle: -90,
					endAngle: 90,
				}
			},
			legend: {   
				enabled : DisableLegend,                
				layout: $scope.HeaderStyle == 'Horizontal' ? 'horizontal' : 'horizontal',                   
				align: $scope.HeaderStyle == 'Horizontal' ? 'center' : 'center',                 
				verticalAlign: $scope.HeaderStyle == 'Horizontal' ? 'bottom' : 'bottom',
				borderWidth: 0,
				itemStyle : {
					fontWeight : 'normal'
				},
				itemMarginTop: -20,
				itemMarginBottom : 20,
				floating : false,
				 y: 10
			},				
			credits :{
				enabled :false    
			},			
			series: [{
				type: 'pie',
				name:  $scope.ChartTitle,
				innerSize: '50%',
				data: result
			}]
		});
    }	
	$scope.chartName = $scope.cName;	
	$scope.fetchData = function(phaseNameParam ,filterClause,cName,chartId){
		$scope.newFilterClause =  filterClause;
		$scope.fetchInitialData (cName,chartId);
	}
	$scope.getDataForSelectedValue = function(selectedVal){
		//selected data method
		$scope.records = undefined;
		$scope.selectedVal = selectedVal;
		$scope.fetchInitialData($scope.cName,$scope.chartId);
		$scope.selectedXVal = '';

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
	
	$scope.fetchInitialData($scope.cName,$scope.chartId);
});


SemiCircularDonutApp.factory('Scopes', function ($rootScope) {
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
