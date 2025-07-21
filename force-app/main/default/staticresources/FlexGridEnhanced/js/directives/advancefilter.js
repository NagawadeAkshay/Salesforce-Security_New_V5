flexGrid.directive('advancefilter',function($compile){

var template = '<div id="advf{{flexTableConfig.Name}}" class="advf advfWrap" ng-class="{\'collapse\' : showCollapsed, \'collapse in\': !showCollapsed}">'+
                    '<div class="row">'+
                        '<div class="col-md-3">'+
                            '<div class="form-group">'+
                                '<label for="repeatColumnSelect" tabindex="0"> Column Name </label><br/>'+                             
                                    '<select ng-options="tableCommunicator.fieldLabelMap[column] for column in columnsList" class="form-control" aria-label="Column Name" tabindex="0" ng-model="condition.LOperand.Value" style="width:100%;" ng-change="advanceFilterOption(fieldMetaData[condition.LOperand.Value]);">'+                                
                                    '</select>'+
                            '</div>'+
                        '</div>'+
                        '<div class="col-md-3">'+
                            '<div class="form-group">'+
                                '<label for="repeatOperatorSelect" tabindex="0"> Operator </label><br/>'+
                                '<select ng-options="inputOperatorFilterOption as inputOperatorFilterOption.label for inputOperatorFilterOption in inputOperatorFilterOptions"  aria-label="Operator" tabindex="0" class="form-control" ng-model="condition.Operator" ng-change="setOperator(condition.Operator);" style="width:100%;">'+
                                '</select>'+
                            '</div>'+
                        '</div>'+
                        '<div class="col-md-3">'+
                            '<div class="form-group">'+
                                '<label for="repeatValueSelect" tabindex="0"> Value </label><br/>'+
                                '<span >'+
                                    '<field field-type="{{fieldMetaData[condition.LOperand.Value].Type}}" field-name="Value"  tabindex="0" table-communicator="tableCommunicator" table-meta-data="tableMetaData" field-info="fieldMetaData[condition.LOperand.Value]"  record="condition.ROperand" is-edit="true" change-handler="checkCondition();"> </field>'+
                                '<span>'+ 
                                  // '<input type="text" tabindex="0" class="width100 textAreaContent form-control" ng-model="condition.ROperand.Value"  aria-label="Value" ng-change="checkCondition()"/>'+
                                '<span class="hidden508">Value</span>'+
                            '</div>'+
                        '</div>'+
                        '<div class="col-md-3">'+ 
                            '<div class="form-group">'+    
                                '<label for="filterAction"  tabindex="0" > Action </label>'+
                                '<div>' + 
                                    '<a title="Add Filter"   tabindex="0"  ng-class="{\'filter-disabled-class\': !isDisabled}" ng-click="addAdvanceFilter()"> <span><i  class="fa fa-plus fa-2x" aria-hidden="true" ></i></span><span class="hidden508">Add Filter</span></a>'+
                                    '<a title="Clear All"  tabindex="0"  ng-click="clearAllAdvFilter()"> <span><i class="fa fa-times fa-2x" aria-hidden="true"></i></span><span class="hidden508">Clear All</span></a>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="row">'+
                        '<div class="col-md-12">'+
                            '<span class="advfDetail"  tabindex="0"  ng-repeat="condition in group.Conditions | orderBy:\'index\'" class="btn btn-primary">'+
                                '<span ng-if="condition.LOperand.Value != \'\' && condition.Operator != \'\' "  >'+
                                    '<span>{{tableCommunicator.fieldLabelMap[condition.LOperand.Value]}}</span>'+
                                    '<span class="operatorLanel"> {{condition.Operators.label}}</span>'+
                                    '<strong ng-click="clearFilter($index)" class="pull-right"><a class="closeIcon" aria-label="Remove Filter Clause" tabindex="0" >X</a></strong>'+
                                    '<strong class="pull-right fieldValue mobadvfdetail"> <field field-type="{{fieldMetaData[condition.LOperand.Value].Type}}" field-name="searchText" field-info="fieldMetaData[condition.LOperand.Value]"  record="condition.ROperand" is-edit="false" table-communicator="tableCommunicator"> </field></strong>'+
                                    
                                '</span>'+
                            '</span>'+
                        '<div>'+
                    '</div>'+
                '</div>' ;
    var linker = function(scope,element,attrs){
        element.html(template).show();
        $compile(element.contents())(scope);
    }
    return {
            restrict : 'E',           
            link: linker,
            controller : 'advfilterController',
            scope : {
                tableCommunicator : '=',
                tableMetaData : '='
            }
    }
});


flexGrid.controller('advfilterController', ['$scope','$filter','ExpressionEvaluatorService','DataBaseService','GridHelperService', function($scope, $filter, ExpressionEvaluatorService,DataBaseService,GridHelperService){
    let flexTableConfigMap = $scope.tableMetaData.FlexTableConfigMap;
    $scope.dataTableDetailMap = $scope.tableMetaData.DataTableDetailConfigMap;
    $scope.flexTableConfig =  flexTableConfigMap.FlexTableConfig;
    $scope.fieldMetaData = flexTableConfigMap.FieldMetaData;
    $scope.columnsList = flexTableConfigMap.ColumnNamesList;
    let index = $scope.columnsList.indexOf('Id');
    if (index > -1) {
        $scope.columnsList.splice(index, 1);
    }
    
    let columnsList = [];
    // angular.forEach($scope.columnsList, function (fieldName, index) {
    //     if(($scope.fieldMetaData[fieldName].Type != 'REFERENCE' &&     
    // 		$scope.fieldMetaData[fieldName].Type != 'TIME'  && 
    // 		$scope.fieldMetaData[fieldName].Type != 'DATE'  && 
    // 		$scope.fieldMetaData[fieldName].Type != 'DATETIME'  && 
    //         $scope.fieldMetaData[fieldName].Type != 'MULTIPICKLIST') &&
    //         $scope.tableCommunicator.columnsList.indexOf(fieldName) != -1){
    //         columnsList.push(fieldName);
    // 	}
    // });
//User Story 171888: LAHSA : Enhancement - Data Table Enhanced - Provision of advanced filter option for Reference fields in Data Table Enhanced
    angular.forEach($scope.columnsList, function (fieldName, index) {
        if(($scope.fieldMetaData[fieldName].Type != 'REFERENCE' &&  
            $scope.fieldMetaData[fieldName].Type != 'MULTIPICKLIST') &&
            $scope.tableCommunicator.columnsList.indexOf(fieldName) != -1){
            columnsList.push(fieldName);
    	}
    });

    $scope.columnsList = columnsList;
    $scope.showCollapsed = true;
    $scope.lokiFilterClause = {};
    $scope.isDisabled = false;
    $scope.tableCommunicator = $scope.tableCommunicator != undefined ? $scope.tableCommunicator : {};
    $scope.tableCommunicator.checkCondition = function(){
        $scope.checkCondition();
    }

    //All Operators Options
    $scope.optionsMap = {};
    $scope.optionsMap['Equal'] = {'label':'equals to', 'value':'='};
    $scope.optionsMap['NotEqual'] = {'label':'not equals to', 'value':'!='};
    $scope.optionsMap['Greater'] = {'label':'greater than', 'value':'>'};
    $scope.optionsMap['Lesser'] = {'label':'less than', 'value':'<'};
    $scope.optionsMap['GreaterEq'] = {'label':'greater than or equal to', 'value':'>='};
    $scope.optionsMap['LesserEq'] = {'label':'less than or equal to', 'value':'<='};
    $scope.optionsMap['Contains'] = {'label':'contains', 'value':'Contains'};
    $scope.optionsMap['DoesNotContain'] = {'label':'does not contain', 'value':'DoesNotContain'};
    $scope.optionsMap['StartsWith'] = {'label':'starts with', 'value':'StartsWith'};
    $scope.optionsMap['EndsWith'] = {'label':'ends with', 'value':'EndsWith'};
    $scope.optionsMap['Excludes'] = {'label':'excludes', 'value':'Excludes'};
    $scope.optionsMap['Includes'] = {'label':'includes', 'value':'Includes'};
    $scope.group = {};
    $scope.group.LogicalOperator = 'AND';
    $scope.group.Groups = [];
    $scope.group.Conditions = [];

    $scope.lOperandValue =  $scope.columnsList.length > 0 ? $scope.fieldMetaData[$scope.columnsList[0]].Name : ''; 

    $scope.resetConditionBody = function(){
        if($scope.condition != undefined){
            $scope.lOperandValue = $scope.condition.LOperand.Value;     
        }
        $scope.condition = undefined;
        $scope.condition = {};
        $scope.condition.LOperand = {};
        $scope.condition.LOperand.Type = 'Field';
        $scope.condition.LOperand.Value = $scope.lOperandValue; 
        $scope.condition.Operator = '';
        $scope.condition.ROperand = {};
        $scope.condition.ROperand.Type = 'Freetext';
        $scope.condition.ROperand.Value = undefined;
        $scope.condition.ROperand.Values = [];
    }

    
    $scope.getOperatorOptions = function(optionsList){
        let options =  [];
        for(var i=0 ; i<optionsList.length; i++){
            options.push($scope.optionsMap[optionsList[i]]);
        }
        return options;
    }

    $scope.setInputFilterOptions = function (columnInfo){
        
        if(columnInfo.Type == 'DATE' || columnInfo.Type== 'CURRENCY' || 
           columnInfo.Type == 'DOUBLE' || columnInfo.Type == 'INTEGER' || 
           columnInfo.Type == 'PERCENT' || columnInfo.Type == 'DATETIME') {
                let options = ['Equal','Greater','Lesser','GreaterEq','LesserEq'];      
                $scope.inputOperatorFilterOptions = $scope.getOperatorOptions(options); 
                
        }else if(columnInfo.Type == 'STRING'   || columnInfo.Type == 'URL'
                || columnInfo.Type == 'EMAIL' || columnInfo.Type == 'PHONE'
                || columnInfo.Type == 'COMBOBOX' || columnInfo.Type == 'TEXTAREA') {
                let options = ['Contains','DoesNotContain','StartsWith','EndsWith'];      
                $scope.inputOperatorFilterOptions = $scope.getOperatorOptions(options);
        }else if(columnInfo.Type == 'BOOLEAN' || columnInfo.Type == 'RADIO'){
            let options = ['Equal','NotEqual'];      
            $scope.inputOperatorFilterOptions = $scope.getOperatorOptions(options);
        }else if(columnInfo.Type == 'MULTIPICKLIST') {
            let options = ['Includes','Excludes'];
            $scope.inputOperatorFilterOptions = $scope.getOperatorOptions(options);
        }else if(columnInfo.Type == 'PICKLIST') {
            let options = ['Equal','NotEqual'];
            let picklistValues = columnInfo.PickListFieldInfo.PicklistValues;
            $scope.inputOperatorFilterOptions = $scope.getOperatorOptions(options);
        }else if(columnInfo.Type == 'REFERENCE') {
            let options = ['Equal','NotEqual'];
            $scope.inputOperatorFilterOptions = $scope.getOperatorOptions(options);
        }
        //set one default operator
        if($scope.inputOperatorFilterOptions != undefined){
            $scope.condition.Operator = $scope.inputOperatorFilterOptions[0];   
        } 
    }
    
    $scope.advanceFilterOption = function(columnInfo){
        $scope.resetConditionBody();
        if(columnInfo != undefined){
            $scope.setInputFilterOptions(columnInfo);
        }        
        $scope.checkCondition();        
    }

    $scope.addAdvanceFilter = function(){
        if($scope.condition.LOperand.Value != null && $scope.condition.ROperand.Value != null && $scope.condition.Operator != ''){
            $scope.condition.Operators = $scope.condition.Operator;
            $scope.condition.Operator = $scope.condition.Operator.value;
            /*if($scope.fieldMetaData[$scope.condition.LOperand.Value].Type == 'DATE' || $scope.fieldMetaData[$scope.condition.LOperand.Value].Type == 'DATETIME'){
                $scope.condition.ROperand.Value = $scope.condition.ROperand.Value+timeOffset;
            }*/
            //Added searchText variable in Roperand  to display it on filter.
            let columnType = $scope.fieldMetaData[$scope.condition.LOperand.Value].Type;
            if(columnType != 'REFERENCE'){
                $scope.condition.ROperand.searchText = $scope.condition.ROperand.Value;
            }
            
            if(columnType == 'PICKLIST'){
              //  $scope.condition.ROperand.searchText = $scope.condition.ROperand.Value.Value; Bug 154935: Internal: In Advanced filter on E-Grid when we select any picklist data type field and select picklist value then no result is returned.
              $scope.condition.ROperand.searchText = $scope.condition.ROperand.Value; 
                  if($scope.condition.ROperand.Value===""){
                    $scope.condition.ROperand.Value = null;
                    $scope.condition.ROperand.searchText = null;
                  }else{
              $scope.condition.ROperand.Value = $scope.condition.ROperand.Value;
            }
                  //$scope.condition.ROperand.Value = $scope.condition.ROperand.Value;
                }
            
            if(columnType == 'DATE'){
                let value = $scope.condition.ROperand.Value;
                value = (value != undefined) ? value - (new Date().getTimezoneOffset() * 60000) : '';
                $scope.condition.ROperand.searchText = value;
            }
            if(columnType == 'DATETIME'){
                let value = $scope.condition.ROperand.Value;
                value = (value != undefined) ? value - (new Date().getTimezoneOffset() * 60000) - timeOffset : '';
                $scope.condition.ROperand.searchText = value;
            }
            if(columnType == 'PERCENT' || columnType== 'CURRENCY' || 
                columnType == 'DOUBLE' || columnType == 'INTEGER') {
                let rvalue = $scope.condition.ROperand.Value
                if(typeof(rvalue) == 'string' && rvalue.indexOf(',') != -1){
                    $scope.condition.ROperand.Value = parseFloat(rvalue.replace(/,/gi,''));
                    $scope.condition.ROperand.searchText = $scope.condition.ROperand.Value;
                }
            }
            $scope.group.Conditions.push($scope.condition);
            $scope.resetConditionBody();
            $scope.condition.LOperand.Value = $scope.fieldMetaData[$scope.columnsList[0]].Name;
            $scope.setInputFilterOptions($scope.fieldMetaData[$scope.columnsList[0]]);
            $scope.checkCondition();
            console.log('Conditions Array : ',$scope.group);
            $scope.lokiFilterClause = ExpressionEvaluatorService.expressionEvaluator($scope,$scope.group, false, false);
            $scope.tableCommunicator.advFilterSearch($scope.lokiFilterClause);
            //console.log('Result for Loki : ',$scope.lokiFilterClause);
            
        }
        else{
            //to set the default value at columns select option and operator select option
            $scope.condition.LOperand.Value = $scope.fieldMetaData[$scope.columnsList[0]].Name;
            $scope.setInputFilterOptions($scope.fieldMetaData[$scope.columnsList[0]]);
        }
        for(let i = 0; i < $scope.group.Conditions.length; i++){
            $scope.group.Conditions[i].ROperand.searchText = $scope.group.Conditions[i].ROperand.searchText ==undefined? 'none': $scope.group.Conditions[i].ROperand.searchText;
        }        

    }
    $scope.setOperator = function(selectedOperator){
        $scope.condition.Operator = selectedOperator;   
        $scope.checkCondition();  
    }

    $scope.clearAllAdvFilter = function(){
         $scope.resetConditionBody();
         $scope.group.Conditions = [];   
         $scope.addAdvanceFilter(); 
         $scope.lokiFilterClause = undefined;  
         $scope.tableCommunicator.advFilterSearch($scope.lokiFilterClause);
         $scope.checkCondition();
         //console.log('Result for Loki : ',$scope.lokiFilterClause); 
    }
    $scope.removeCondition = function(index){
        $scope.group.Conditions.splice(index,1);
        $scope.resetConditionBody();
        $scope.lokiFilterClause = ExpressionEvaluatorService.expressionEvaluator($scope,$scope.group, false, false);
        $scope.tableCommunicator.advFilterSearch($scope.lokiFilterClause);
        //console.log('Result for Loki : ',$scope.lokiFilterClause);
    }
     //$scope.addAdvanceFilter();

    $scope.checkCondition = function() {
       if($scope.condition != undefined && $scope.condition.LOperand != undefined && $scope.condition.ROperand != undefined && $scope.condition.Operator != undefined){
          $scope.isDisabled = $scope.condition.LOperand.Value != undefined && $scope.condition.ROperand.Value != undefined && $scope.condition.Operator != '';
        } 
    } 

    $scope.clearFilter =  function(index){
        $scope.group.Conditions.splice(index,1);
        $scope.lokiFilterClause = ExpressionEvaluatorService.expressionEvaluator($scope,$scope.group, false, false);
        $scope.tableCommunicator.advFilterSearch($scope.lokiFilterClause);
    } 
    //call at initialization to set operator options
    
    $scope.advanceFilterOption ($scope.fieldMetaData[$scope.columnsList[0]]);

}]);


