EnhancedChartApp.controller('EnhancedChartAppCtrl',function ($scope, $filter, $q, Scopes) {
  Scopes.store('EnhancedChartAppCtrl', $scope);
  var j$ = jQuery.noConflict();
  var chart;
  var currentFY = Scopes.get('MasterEnhancedChartAppCtrl').EnhancedChart_currentFiscalYear;
  var phaseNameParam = Scopes.get('MasterEnhancedChartAppCtrl').EnhancedChart_phaseNameParam;
  var fiscalYear = '';
  var division = '';
  var isDashboard = false;
  $scope.selectedYVal = '';
  $scope.selectedXVal = '';
  $scope.items = {};
  $scope.itemMap = {};
  $scope.chartsType = '';
  $scope.isFilterDisabled = true;
  var hideEnhancedView = false;
  $scope.itemMap1 = {};
  $scope.filterFieldLabel = '';
  $scope.showAllData = false;
  $scope.chartId = Scopes.get('MasterEnhancedChartAppCtrl').EnhancedChart_chartHTMLId;
  $scope.resultTable = {};
  $scope.isCallBack = false;
  $scope.cName = Scopes.get('MasterEnhancedChartAppCtrl').EnhancedChart_chartName;
  $scope.recId = Scopes.get('MasterEnhancedChartAppCtrl').EnhancedChart_recId;
  $scope.newFilterClause = Scopes.get('MasterEnhancedChartAppCtrl').EnhancedChart_chartParameters;
  $scope.isEnhancedView = Scopes.get('MasterEnhancedChartAppCtrl').EnhancedChart_isEnhancedView;
  $scope.EnhancedChart_contextRecordId = Scopes.get('MasterEnhancedChartAppCtrl').EnhancedChart_contextRecordId;

   if(phaseNameParam.indexOf('Dashboard') != -1){
        phaseNameParam = Scopes.get('MasterEnhancedChartAppCtrl').EnhancedChart_phaseNameParam;
        if(!phaseNameParam){
            phaseNameParam = Scopes.get('MasterEnhancedChartAppCtrl').EnhancedChart_defaultPhase;
        }
        isDashboard = true;
        fiscalYear = Scopes.get('MasterEnhancedChartAppCtrl').EnhancedChart_fiscalYear;
        division = Scopes.get('MasterEnhancedChartAppCtrl').EnhancedChart_division;
        if(fiscalYear != ''){
            var fyStr =  ' (' + fiscalYear.split('-').join(',') + ') ';
            $scope.newFilterClause = '{yearfilterclause} ' + fyStr;
        }
    }

    $scope.fetchInitialData = function(cName,chartId, recId){
        var paramMap = {};
        paramMap.chartName = cName;
        paramMap.recId = recId;
        paramMap.phaseName = phaseNameParam;
        paramMap.chartId = chartId;
        paramMap.isDashboard = isDashboard;
        paramMap.filterClause = $scope.newFilterClause;
        paramMap.recordId = $scope.chartPieBasic_contextRecordId;
        paramMap.selectedYVal = $scope.selectedYVal+'';
        paramMap.selectedXVal = $scope.selectedXVal+'';
        paramMap.showAllData = $scope.showAllData;
        $scope.showDataLabel = !$scope.isPhase;
        $scope.disableShowAllData = false;
        Visualforce.remoting.Manager.invokeAction(
            _RemotingEnhancedChartActions.fetchInitialData,
            paramMap,
            paintEnhancedChart,
            {escape:false, buffer: false}
        );

        function paintEnhancedChart(result, event){
            if(event.status){
                var jsonObj = {}
                $scope.$apply(function () {
                    $scope.HeaderStyle= (result.HeaderStyle == null || result.HeaderStyle == '') ? 'Horizontal' : result.HeaderStyle;  
                     //UI-Shrawan-11022015 handling null cases

                    jsonObj = JSON.parse(result.JSONData);
                    $scope.resultTable.chartSFId = result.chartConfigId ;
                    $scope.title = jsonObj.title.text;
                    if(jsonObj.chart.type == 'heatmap'){
                      $scope.disableShowAllData = true;
                    }

                    // Setting Chart height & width for PhaseConfig , PageBlockConfig
                    if($scope.isEnhancedView == 'true'){
                        $scope.isPhase = false;
                        $scope.yAxisLabel = result.Yaxis;
                        $scope.xAxisLabel = result.Xaxis;
                        $scope.ChartTitle = result.Title;
                        $scope.items = result.pickListValArray;
                        $scope.filterFieldLabel = result.filterFieldLabel;
                        $scope.chartsType = jsonObj.chart.type;
                        $scope.itemMap = result.pickListValArrayMap;
                        $scope.isFilterDisabled = result.isFilterDisabled;
                        //$scope.itemMap1 = result.categories;
                        $scope.EnableExporting = true;
                        $scope.chartHeight = "450px";
                    }else{
                        $scope.xAxisLabel = result.Xaxis;
                        $scope.yAxisLabel = result.Yaxis;
                        $scope.ChartTitle = '';
                        $scope.EnableExporting = false;
                        $scope.chartHeight = "220px";
                    }
                    $scope.cheight = {
                        "height" :  $scope.chartHeight
                    }

                    if($scope.showAllData || ($scope.selectedXVal != '' && ($scope.selectedYVal != '' || $scope.selectedYVal == 0))) {
                        $scope.records = result.fetchChartinitialData;
                        var recordData = $scope.records;
                        $scope.modalId = result.fetchChartinitialData.chartId;
                        $scope.showAllData = false;                       
                        $scope.selectedYVal = '';
                        $scope.selectedXVal = '';                      
                        $scope.$broadcast("dataSenderEvent",recordData,$scope.isEnhancedForSearch);
                        j$('#'+$scope.modalId+'recordsModal').addClass('fade in');
                        j$('#'+$scope.modalId+'recordsModal').css('display', 'block');
                        j$('#'+$scope.modalId+'recordsModal').attr('aria-hidden', 'false');
                    }
                });

                if($scope.selectedXVal == '' && $scope.selectedYVal == '') {
                    $scope.chartType = jsonObj.chart.type;
                    $scope.addEventSupport(result);
                    if(!$scope.isCallBack)
                        $scope.constructEnhancedChart(result.JSONData, $scope.chartId);
                       // $scope.constructEnhancedChart(result, $scope.chartId);
                }
            }
        }
    }

    // $scope.hideElement = function(){
    //   var element = document.getElementById('filter_Div');
    //   element.hidden = true;
    // }

    $scope.selectedItem;
    //arreyList.
    $scope.changeFunction = function (selectedtem) {
      var data = JSON.parse($scope.itemMap[selectedtem]);
      //alert($scope.itemMap);
      //alert(selectedtem);
      //alert(data);
      var dataY = [];
      var dataX = [];
      var dataZ = [];
      var dataPie = [];
      var dataBubble = [];
      for(let obj in data){
        if(data[obj].y != undefined || data[obj].x != undefined){
            dataY.push(data[obj].y);
            dataX.push(data[obj].x);
            var pie = {name: data[obj].x, y:data[obj].y}
            dataPie.push(pie);
            if($scope.chartsType == null){
              dataZ.push(data[obj].z);
            }
            if($scope.chartsType == 'bubble'){
              var bubble = {x: data[obj].x, y:data[obj].y, z:data[obj].z, name:data[obj].name, header:data[obj].header}
              dataBubble.push(bubble);
            }
        }
      }
      //alert($scope.itemMap1);
      if($scope.chartsType == null){
        Highcharts.charts.forEach((chart) => {
          chart.series[0].update({
            data: dataZ
          }, false, false, false);
          chart.series[1].update({
            data: dataY
          }, false, false, false);
          chart.redraw();
        });
      }
      else if($scope.chartsType == 'bubble'){
        Highcharts.charts.forEach((chart) => {
          chart.series[0].update({
            data: dataBubble
          }, false, false, false);
          chart.redraw();
        });
      }
      else if($scope.chartsType == 'pie' || $scope.chartsType == 'scatter' || $scope.chartsType == 'funnel'){
        Highcharts.charts.forEach((chart) => {
          chart.series[0].update({
            data: dataPie
          }, false, false, false);
          chart.redraw();
        });
      }else{
        Highcharts.charts.forEach((chart) => {
          chart.series[0].update({
            data: dataY
          }, false, false, false);
          chart.xAxis[0].update({
            categories: dataX
          }, false, false, false);
          chart.redraw();
        });
      }
    };

    // var selectItem = document.getElementById('selectList');
    // selectItem.addEventListener('change', (e) => {
    //     confirm('Success');
    // });

    $scope.addEventSupport = function(result){
        var jsonObj = JSON.parse(result.JSONData);
        var objClick = {click: $scope.callBack}
        var objEvent = {events:objClick}
        
        if(typeof jsonObj.chart == "undefined")
            jsonObj['chart'] = {};

        if(typeof jsonObj.plotOptions == "undefined")
            jsonObj['plotOptions'] = {};

        if(typeof jsonObj.plotOptions.series == "undefined")
            jsonObj.plotOptions['series'] = objEvent;

        if(jsonObj.chart.type == 'heatmap'){
          jsonObj.plotOptions.series = {events:{}};
        }
        else{

          if(typeof jsonObj.plotOptions.series == "undefined")
            jsonObj.plotOptions.series['events'] = objClick;

          if(typeof jsonObj.plotOptions.series.events == "undefined")
            jsonObj.plotOptions.series['events'] = objClick;
        }

        if(result != null)
          jsonObj.title.text = '';
        result.JSONData = jsonObj;
    }

/*
var jsonObj = JSON.parse(result.JSONData);
        var objClick = {click: $scope.callBack}
        var objEvent = {events:objClick}
        if(typeof jsonObj.plotOptions == "undefined")
          jsonObj['plotOptions'] = {};

        if(typeof jsonObj.plotOptions.series == "undefined")
          jsonObj.plotOptions['series'] = {};

        if(typeof jsonObj.chart == "undefined")
          jsonObj['chart'] = {};

        if(jsonObj.chart.type == 'bubble' || jsonObj.chart.type == 'funnel')
          jsonObj.plotOptions.series['events'] = objClick;
        else
          jsonObj.plotOptions['series'] = objEvent;
        
        if(jsonObj.chart.type == 'heatmap')
          jsonObj.plotOptions.series['events'] = {};

        if(result != null)
          jsonObj.title.text = '';
        result.JSONData = jsonObj;
    }
    */

    $scope.fetchData = function(phaseNameParam ,filterClause,cName,chartId){
        $scope.newFilterClause =  filterClause;
        $scope.fetchInitialData (cName,chartId);
    }

    $scope.callBack = function (event){
        $scope.isCallBack = true;
        var selectedYValue = event.point.y;
        var selectedXValue = '';
        if(event.point.x != undefined)
            selectedXValue = event.point.x;
        if(event.point.category != undefined)
            selectedXValue = event.point.category;
        if($scope.chartType != 'bubble')
            if(event.point.name != undefined)
                selectedXValue = event.point.name;

        $scope.getDataForSelectedValue(selectedYValue,selectedXValue);

        // j$('#'+$scope.chartId+'recordsModal').addClass('fade in');
        // j$('#'+$scope.chartId+'recordsModal').css('display', 'block');
        // j$('#'+$scope.chartId+'recordsModal').attr('aria-hidden', 'false');
    }

    $scope.constructEnhancedChart = function(result,chartId){
        // Build the chart
        Highcharts.setOptions({ // Apply to all charts
            chart: {
                events: {
                    beforePrint: function () {
                        this.oldhasUserSize = this.hasUserSize;
                        this.resetParams = [this.chartWidth, this.chartHeight, false];
                        //this.setSize(500, 800, false);
                    },
                    afterPrint: function () {
                        this.setSize.apply(this, this.resetParams);
                        this.hasUserSize = this.oldhasUserSize;
                        
                    }
                }
            },
            lang: {
              thousandsSep: ','
            }
        });
        // if($scope.isFilterDisabled == true){
        //   $scope.hideElement();
        // }
        j$('#chart'+chartId).highcharts(result);
    }

      $scope.getAllData = function(isEnhancedView){
          $scope.isEnhancedForSearch = isEnhancedView;
          if(isEnhancedView == 'true')
            j$('#'+$scope.chartId+'enhancedView').css('display', 'none');
          $scope.showAllData = true;
          $scope.fetchInitialData($scope.cName,$scope.chartId,$scope.recId);
      }

      $scope.getDataForSelectedValue = function(selectedYVal,selectedXVal){
          $scope.selectedYVal = selectedYVal;
          $scope.selectedXVal = selectedXVal;
          $scope.fetchInitialData($scope.cName,$scope.chartId,$scope.recId);
      }
      
      $scope.fetchInitialData($scope.cName,$scope.chartId,$scope.recId);
      $scope.chartName = $scope.cName;
  });

  EnhancedChartApp.factory('Scopes', function ($rootScope) {
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