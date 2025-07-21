flexGrid.directive('colheader',function($compile){

var template =  '<div ng-class="filedType == \'CURRENCY\' || filedType == \'DOUBLE\' ||filedType == \'INTEGER\'||filedType == \'PERCENT\'? \'tableColumnHeader displayFlex rightIndentHeader\' : \'tableColumnHeader displayFlex\' ">'+
                    
                    '<span class="handPointer displayFlex" >'+
                        '<span  class="hidden508" ng-if="fieldMetadata[column].Label == undefined"> Empty Column </span>'+
                            '<span ng-click="setSortArrow(column,!isSorted,$event);" ng-style="{ {{tableCommunicator.isSpreadSheet ? spreadSheetStyles : \'\'}} }">'+
                                '<span  ng-bind="fieldLabel"/>'+
                        '</span>'+
                        '<span class="sortArrowSpace" ng-if="!(tableCommunicator.isSpreadSheet)" tabindex="0" aria-label="Sort">'+
                        
                            '<i ng-if="(column == sortField  && isSorted != undefined && !isSorted) || (tableCommunicator.sortFieldNames != undefined && tableCommunicator.sortFieldNames.indexOf(column) != -1)" ng-class="{\'fa fa-long-arrow-up\': !isSorted}"></i>'+
                            '<i ng-if="(column == sortField  && isSorted != undefined && isSorted) || (tableCommunicator.sortFieldNames != undefined && tableCommunicator.sortFieldNames.indexOf(column) != -1)" ng-class="{\'fa fa-long-arrow-down\': isSorted}"></i>'+
                        '</span>'+
                        '<div class="dropdown thDropMenu" tabindex="0">'+
                           '<button type="button" class="thDropMenuBtn" tabindex="0" data-toggle="modal" data-target="#{{tableCommunicator.tableId}}{{column}}"><span class="fa fa-caret-down"></span></button>'+

                        '</div>'+
                        '<helpicon help-text="helpText" help-text-id="helptTextId" ng-if="helpText != undefined"/>'+                    
                        '<div id="{{tableCommunicator.tableId}}{{column}}" class="modal flexGridDropdownModal fade" role="dialog">'+
                            '<div class="modal-dialog">'+
                                '<div class="modal-content">'+
                                    '<div class="modal-header">'+
                                        '<button type="button" class="close closeBtn" data-dismiss="modal" >X</button>'+
                                        '<h4 class="modal-title" ng-bind="fieldLabel" id="title{{tableCommunicator.tableId}}{{column}}"> </h4>'+
                                   ' </div>'+
                                    '<div class="modal-body">'+

                                        '<div class="dropdown open thDropMenuList">'+
                                            
                                            '<ul class="dropdown-menu multi-level dropdownList" role="menu" aria-labelledby="dropdownMenu">'+
                                                    '<li ng-if="!(tableCommunicator.isSpreadSheet)" ng-click="setSortArrow(column,false,$event);"><a href="#"><span class="icon fa fa-long-arrow-up"></span><span class="text">Sort Ascending</span></a></li>'+
                                                    '<li ng-if="!(tableCommunicator.isSpreadSheet)" ng-click="setSortArrow(column,true,$event);"><a href="#"><span class="icon fa fa-long-arrow-down"></span><span class="text">Sort Descending</span></a></li>'+
                                                    '<li ng-if="!(tableCommunicator.isSpreadSheet)" class="divider"></li>'+
                                                '<li class="dropdown-submenu open">'+
                                                    '<a tabindex="-1" href="#" class="columnSelect"><span class="icon fa fa-columns"></span><span class="text">Columns</span></a>'+
                                                    '<ul class="dropdown-menu selectMultipleCheck">'+
                                                        '<li ng-repeat="key in columnsList">'+
                                                            '<a href="javascript:void(0);"><div class="checkbox"><label "><input  type="checkbox"  ng-checked="tableCommunicator.visibleColumns[key]" ng-model="tableCommunicator.visibleColumns[key]" ng-click="checkboxClickHandler(key, $event)" class="checkbox{{columnIdMap[key]}}"  name="check{{columnIdMap[key]}}" >{{ tableCommunicator.fieldLabelMap[key]}}</label></div></a>'+
                                                        '</li>'+
                                                    '</ul>'+
                                               ' </li>'+
                                            '</ul>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>';+
                        
                    '</span>'+
                '</div>';
    var linker = function(scope,element,attrs){
        element.html(template).show();
        scope.$watch('tableCommunicator.listViewLabel', function(newValue, oldValue) {
            if (newValue){
                scope.initializeColumnDetails();
            }
        }, true);
        scope.$watch('tableCommunicator.isRemoveSessionStorage', function(newValue, oldValue) {
            if (newValue){
                scope.initializeColumnDetails();
            }
        }, true); 
        $compile(element.contents())(scope);    
    }

    return {
        restrict : 'A',
        controller : 'colheaderController',
        scope :{
            tableMetaData : '=',
            column : '=',
            tableCommunicator : '=',
            sortField : '='
        }, 
        link: linker
    }
});

flexGrid.controller('colheaderController', ['$scope','GridHelperService','MessageService','GridEventsHandlerService','$sce','$window', function($scope,GridHelperService,MessageService,GridEventsHandlerService,$sce,$window){
    $scope.tableCommunicator.isAllEdited = false;   
    $scope.fieldMetaData = $scope.tableMetaData.FlexTableConfigMap.FieldMetaData;//make FieldMetaData small case
    $scope.flexTableConfig = $scope.tableMetaData.FlexTableConfigMap.FlexTableConfig;
    $scope.dataTableDetailMap = $scope.tableMetaData.DataTableDetailConfigMap;
    $scope.columnsList = $scope.tableCommunicator.columnsList;
    $scope.columnIdMap = {};
    $scope.helptTextId = $scope.column+$scope.flexTableConfig.FlexTableId;
    $scope.fieldLabel = $scope.tableCommunicator.fieldLabelMap[$scope.column];
    $scope.spreadSheetStyles = "'pointer-events':'none','cursor':'default'";
    $scope.tableCommunicator.isSpreadSheet = $scope.flexTableConfig.IsSpreadSheet;
    $scope.filedType = $scope.fieldMetaData[$scope.column].Type
    $scope.initializeColumnDetails = function(){

        //get the Label of the Column.
        for (var i = 0; i < $scope.columnsList.length; i++) {
            $scope.columnIdMap[$scope.columnsList[i]] =$scope.flexTableConfig.FlexTableId+$scope.columnsList[i].replace(/\./g,'');
        }
        //Check the width of Column in dataTableDetailMap.
        if($scope.dataTableDetailMap[$scope.column] != undefined){
            $scope.helpText = $scope.dataTableDetailMap[$scope.column].HelpText;
        }
        // get display filed with data type
        if($scope.tableMetaData.DataTableDetailConfigMap[$scope.column] != null && $scope.tableMetaData.DataTableDetailConfigMap[$scope.column].DisplayField !=null){
            let displayFieldAPI = $scope.tableMetaData.DataTableDetailConfigMap[$scope.column].DisplayField;
            if($scope.fieldMetaData[displayFieldAPI] != null ){
                $scope.filedType =  $scope.fieldMetaData[displayFieldAPI].Type;
            }           
        }
        //initialize sort direction of icon
        if($scope.flexTableConfig.SortDirection != undefined || $scope.tableCommunicator.rowGroupingFieldList.indexOf($scope.column) != -1){
            if ($scope.flexTableConfig.SortDirection == 'ASC' || $scope.flexTableConfig.SortDirection == undefined){
                $scope.isSorted = false;
            }else{
                $scope.isSorted = true;
            }
        }else{
            $scope.isSorted = false;
        }

        let sortDirection = GridHelperService.getPaginationCookie($scope,"sortDirection");
        if(sortDirection !== undefined && sortDirection !== ''){
            $scope.isSorted = sortDirection;
        }
        if($scope.flexTableConfig.OrderBy != undefined && $scope.tableCommunicator.rowGroupingFieldList.indexOf($scope.column) == -1){
            let OrderByfieldString = $scope.flexTableConfig.OrderBy;
            if(OrderByfieldString.toLowerCase().indexOf(',') != -1 && (OrderByfieldString.toLowerCase().indexOf('desc') != -1 || OrderByfieldString.toLowerCase().indexOf('asc') != -1)){
                $scope.isSorted = undefined; 
                let mulitipleSortFields = $scope.flexTableConfig.OrderBy.split(',');
                
                for(let index = 0; index < mulitipleSortFields.length; index++){
                    mulitipleSortFields[index] = mulitipleSortFields[index].trim();      
                    let sortFiledWithOrder = mulitipleSortFields[index].toLowerCase();                      
                    if(sortFiledWithOrder.indexOf($scope.column.toLowerCase()) != -1){                     
                        if(sortFiledWithOrder.indexOf(' asc') != -1){
                            mulitipleSortFields[index] = mulitipleSortFields[index].substring(0,mulitipleSortFields[index].length-4);
                            $scope.isSorted = false;
                        }
                        if(sortFiledWithOrder.indexOf(' desc') != -1){
                            mulitipleSortFields[index] = mulitipleSortFields[index].substring(0,mulitipleSortFields[index].length-5);
                            $scope.isSorted = true;
                        }   
                    }                 
                }                
            }       
        }
             
        if($scope.tableCommunicator.enableGroupedSubTotalRow == true && $scope.tableCommunicator.rowGroupingFieldList.length > 0){
            $scope.isSorted = undefined;
        }     
    }
    // sort direction icon for dropdown sort
    $scope.setSortArrow = function(column,sortDirection,event){
        if($scope.tableCommunicator.isSpreadSheet || $scope.$parent.communicator[$scope.tableCommunicator.tableId].isEdit == true || $scope.$parent.communicator[$scope.tableCommunicator.tableId].isMassEdit == true) {
            $scope.tableCommunicator.showConfirmBoxIfIsEdit();
            return false;
        }
        if(!$scope.tableCommunicator.enableGroupedSubTotalRow && ($scope.tableCommunicator.rowGroupingFieldList != undefined && $scope.tableCommunicator.rowGroupingFieldList.length == 0)){
            $scope.isSorted = sortDirection;
            $scope.tableCommunicator.sort(column,$scope.isSorted,event);
            $scope.setCookiesData($scope,column,sortDirection);
        }
       
        
    }

    $scope.setCookiesData = function($scope,column,sortDirection){
        if( column != undefined && column != '' ) {
            GridHelperService.setPaginationCookie($scope,"sortFieldName", column);
            GridHelperService.setPaginationCookie($scope,"sortDirection", sortDirection);
            GridHelperService.setPaginationCookie($scope,"pageNumber", 1);
        }
    }

    //Map to know which  columns is hidden.
    $scope.checkboxClickHandler = function(ColumnName, event){
        $scope.tableCommunicator.visibleColumns[ColumnName] = !$scope.tableCommunicator.visibleColumns[ColumnName];
        let modalId = $scope.tableCommunicator.tableId + ColumnName;//j$("#a0J4100000GBMfUEAXggf_dev7__SampleDate__c .modal-title").attr("id");
        let titleId = j$(".flexGridDropdownModal.fade.in .modal-title")[0];
       
        
         
        if(titleId.textContent === event.target.parentElement.innerText){
           // console.log("triggering close event");
            j$("#" + modalId + " .closeBtn").trigger("click");
        }
        if($scope.tableCommunicator.visibleColumns[ColumnName] == true){
            $scope.$parent.colLength = $scope.$parent.colLength + 1;
        }
        if($scope.tableCommunicator.visibleColumns[ColumnName] == false){
            $scope.$parent.colLength = $scope.$parent.colLength - 1;
        }
    }


    $scope.initializeColumnDetails();
    
    //this function will stop dropdown to close when we select checkbox
    j$('.dropdown-menu').on('click', function(e) {
      if(j$(this).hasClass('selectMultipleCheck')) {
          e.stopPropagation();
      }
    });

     // let thDropMenuHeight = j$('.thDropMenuWrap').outerHeight();
     // j$('.thDropMenuWrap .thDropMenu').css('min-height', thDropMenuHeight);
}]);

function handlePopEvent(event){
   
    event.stopPropagation();
}




