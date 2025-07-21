flexGrid.directive('panel',function($compile){

var template =  
                '<div class="row displayFlexCenter">'+                
                    '<div class="col-xs-6 col-md-7 header-title ">'+
                        //Collapse Icon
                        '<a id="{{flexTableConfig.Name}}FlexCollapse" data-toggle="collapse"  data-target="#{{flexTableConfig.Name}}FlexToggle" class="focusItem"  ng-click="togglePanels($event);">'+
                            '<span  class="togglePageBlock fa" ng-class="(false ? ( totalRecords < 1 ? \'fa-caret-down\': \'fa-caret-up\') : \'fa-caret-up\')"></span >'+
                            //Header Name
                            '<span class="flexHeaderName pull-left" tabindex="0" ng-bind="tableCommunicator.listViewLabel != undefined? tableCommunicator.listViewLabel :flexTableConfig.Header != null?flexTableConfig.Header : flexTableConfig.Name"></span>'+ 
                    
                        '</a>'+                       
                       
                        //Filter List view Drop Down 
                        '<span ng-if="tableCommunicator.showListViewDropDown"class="dropdown" id="dropdownListView">'+
                            '<a tabIndex="0"  class="headingDropdown dropdown-toggle"  title="" data-toggle="dropdown" >'+
                                '<span ng-if="tableCommunicator.showListViewDropDown"  class="fa fa-angle-double-down" ></span>'+                                            
                                '<span class="hidden508">{!$Label.FlexTableListViewMenu}</span>'+                                           
                            '</a>'+                        
                            '<ul class="dropdown-menu dropdown-menu-left" style="width: auto;">'+
                                '<li class="listyle" ng-if="item.IsActive == true" ng-repeat="item in filterListViewList">'+
                                    '<a tabIndex="0" class="tableLinks" ng-click="tableCommunicator.changeListView(item,$index);" title="{{item.Label}}" target="_self">'+
                                        '<span ng-show="item.IsSelected == true"><i class="fa fa-check"></i></span>'+
                                        '<span ng-bind="item.Label"></span>'+
                                        '<span class="hidden508">List item</span>'+
                                    '</a>' +                                                    
                                '</li>' +
                            '</ul>'+
                        '</span>'+
                        //Header Instruction 
                        '<span id="{{flexTableConfig.Name}}HeaderInst">'+
                        '<helpicon help-text="flexTableConfig.HeaderDescription" help-text-id="flexTableConfig.Name">'+
                    '</span>'+
                    '<div class="sessiontext"><span tabindex="0" class="sessionClass" ng-if="checkResetMessage(tableCommunicator)"> Click ‘Reset Table’ under the menu icon to refresh the table’s default values</span></div>'+
                '</div>'+
                '<!--div class="col-xs-2 col-md-1 header-title ">'+
                    '<span  class="fa fa-info helpIcon">  </span><!--{{flexTableConfig.HeaderDescription}}-->' +

                    
                '</div-->'+
            '<div class="col-xs-6 col-md-5 header-buttons text-right displayFlexCenter flexEnd">'+
               
                //Top Actions
                    '<action actions="flexTableActionMap.Top"  table-communicator="tableCommunicator" communicator="communicator"/>'+
                        //Undo Editing Button
                    '<button ng-if="communicator[tableCommunicator.tableId].isMassEdit"  title="Undo Edit" type="button" class="secondaryBtn" tabIndex="0" ng-click="tableCommunicator.undoEditing()">Undo Edit</button>' +
                    '<button  title="Save" ng-if="(tableCommunicator.tableId == communicator.parentFlexTableId) && (communicator.isMassSave || communicator.isSave)" type="button" class="secondaryBtn" tabIndex="0" ng-click="tableCommunicator.saveRecords()">Save</button>' +
                     //Modify Layout
                    '<span class="header-bars">'+
                        '<span class="fa fa-cog cursorpointer"  id="modifyPageLayout" title="Modify Flex Table Layout" ng-if="checkCookie() && adminSetup" ng-click="redirect();"></span>'+   
                        //Menu 
                        '<span class="dropdown">'+                                         
                            '<a class="dropdown-toggle" tabindex="0" data-toggle="dropdown" title="Menu">'+
                                '<span ng-if="flexTableConfig.DisableMenu == false"  class="fa fa-bars"></span>'+                                                
                                '<span class="hidden508">Menu</span>'+
                            '</a>'+

                            '<ul class="dropdown-menu dropdown-menu-right">'+
                                //Menu : Top Level Action(Display Type = Menu)
                                '<li class="listyle"  ng-repeat="action in flexTableActionMap.Top">'+
                                    '<a ng-if="action.HeaderActionDisplayType == \'Menu\' && action.HideAction != true" tabIndex="0"  class="tableLinks" ng-click="actionHandler(action)" title="{{action.Name}}" target="_self">'+
                                        '<span ng-if="action.IconCSS != \'null\'" ng-bind-html="trustSrcHTML(action.IconCSS)"></span>'+
                                        '<span title="No image found" ng-if="action.IconSS == \'null\'" class="fa fa-picture"></span>'+
                                        '<span class="separator" aria-hidden="true"> | </span>'+
                                        '<span>{{action.Name}}</span>'+
                                    '</a>'+
                                '</li>'+
                                //Menu: Refresh
                                '<li class="listyle" >'+
                                        '<a tabIndex="0" class="tableLinks" ng-click="tableCommunicator.refreshGrid();">'+
                                            '<span title="Refresh" class="fa fa-refresh"></span>'+
                                            '<span class="separator" aria-hidden="true"> | </span>'+
                                            '<span>Refresh</span>'+
                                        '</a>'+
                                    '</li>'+ 
                                    //Menu: reset Table
                                    '<li class="listyle" ng-if="resetTable()" >'+
                                    '<a tabIndex="0" class="tableLinks" ng-click="tableCommunicator.removeSessionStorage();">'+
                                        '<span title="Refresh" class="fa fa-eraser" style="color:red"></span>'+
                                        '<span class="separator" aria-hidden="true"> | </span>'+
                                        '<span>Reset Table</span>'+
                                    '</a>'+
                                '</li>'+  
                                //Menu : Download as PDF
                                '<li class="listyle" ng-if="flexTableConfig.EnableExport">'+
                                    '<a tabIndex="0"  class="tableLinks" ng-click="tableCommunicator.exportGrid(\'pdf\');" title="{{choice.title}}" >'+
                                        '<span class="fa fa-file-pdf-o" style="color:#16A085"></span>'+
                                        '<span class="separator" aria-hidden="true"> | </span>'+
                                        '<span >Download as PDF</span>'+
                                    '</a>'+
                                '</li>'+
                                //Menu : Download as CSV
                                '<li class="listyle" ng-if="flexTableConfig.EnableExportXls">'+
                                    '<a tabIndex="0"  class="tableLinks" ng-click="tableCommunicator.exportGrid(\'application/vnd.ms-excel\');" title="{{choice.title}}">'+
                                        '<span class="fa fa-file-excel-o" style="color:#16A085"></span>'+
                                        '<span class="separator" aria-hidden="true"> | </span>'+
                                        '<span >Download as XLS</span>'+
                                    '</a>'+
                                '</li>'+
                                 //Menu: Help
                                '<li class="listyle" ng-if="flexTableConfig.EnableHelp == true">'+
                                    '<a tabIndex="0" class="tableLinks" ng-click="tableCommunicator.openHelp();" title="Help" >'+
                                        '<span class="fa fa-question-circle" ></span>'+
                                        '<span class="separator" aria-hidden="true"> | </span>'+
                                        '<span>Help</span>'+
                                    '</a>'+
                                '</li>'+
                            '</ul>'+
                        '</span>'+
                    '</span>'+
                '</div>'+
                '</div>';
    var linker = function(scope,element,attrs){
        element.html(template).show();
        $compile(element.contents())(scope);
    }
    return {
        restrict : 'E',
        controller : 'panelController',
        scope :{
            tableMetaData : '=',
            tableCommunicator : '=',
            communicator : '=' 
        },           
        link: linker
    }
});

flexGrid.controller('panelController', ['$scope', 'DataBaseService','griddataprovider','gridfactory','MessageService','GridHelperService','$timeout','$sce', function($scope, DataBaseService,griddataprovider,gridfactory,MessageService,GridHelperService,$timeout,$sce){
    let flexTableConfigMap = $scope.tableMetaData.FlexTableConfigMap;
    $scope.flexTableActionMap = $scope.tableMetaData.FlexTableActionMap;
    $scope.flexTableConfig = flexTableConfigMap.FlexTableConfig;
    $scope.filterListViewList = $scope.tableMetaData.FlexTableFilterListViewList;
    $scope.adminSetup = adminSetup;
    $scope.currentPageURL = flexGridEnhanced_currentPageURL;
    $scope.togglePanels = function(event) {
        var id= event.currentTarget.id;
        j$('#'+id).find("span.togglePageBlock").toggleClass('fa-caret-down fa-caret-up');
    }

    $scope.checkCookie = function() {
        return j$.cookie('setup') == 'present';
    }

    $scope.resetTable = function() {
        if($scope.tableCommunicator.parentId == 'undefined'){
            return true;
        }
        return false;
    }

    $scope.checkResetMessage = function(tableCommunicator) {
        if($scope.tableCommunicator.parentId == 'undefined'){

            let pageSize = GridHelperService.getPaginationCookie($scope,"pageSize");
            let pageNumber = GridHelperService.getPaginationCookie($scope,"pageNumber");
            let SearchTerm = GridHelperService.getPaginationCookie($scope,"SearchTerm");
            let sortFieldName = GridHelperService.getPaginationCookie($scope,"sortFieldName");
            let sortDirection = GridHelperService.getPaginationCookie($scope,"sortDirection");

            if((sortDirection != undefined && sortDirection != '' && $scope.isSorted  != sortDirection)||(sortFieldName != undefined && sortFieldName != '' && $scope.flexTableConfig.OrderBy != sortFieldName)||(SearchTerm != undefined && SearchTerm != '')||(pageSize != "" && pageSize['size'] != $scope.flexTableConfig.DefaultPageSizeEnhanced) || (pageNumber != "" && pageNumber>1)){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        } 
    }

    $scope.redirect = function(){
        let redirectId = $scope.flexTableConfig.FlexTableId;
        if($scope.communicator.GridType == 'FlexTable'){
            redirectId = $scope.flexTableConfig.FlexTableId;
        }
        else if($scope.communicator.flexGridMetaData.parentFlexTableId == $scope.flexTableConfig.FlexTableId){
            redirectId =  $scope.communicator.flexGridMetaData.flexGridId;             
        }
        window.open("/"+redirectId+"?isdtp=vw");
    }
    // Start  Provide support for menu action
    $scope.actionHandler = function(action){
        $scope.checkForConfirmationMsg(action);  
     }
     $scope.checkForConfirmationMsg = function(action){
        $scope.checkActionBehavior(action); 
        
    }
    $scope.checkActionBehavior = function(action){
        
        switch(action.ActionBehavior){            
            case 'ExecuteClass' : 
                $scope.executeClass(action);    
            break;     
            default: 
                $window.open(action.ActionURLLong,'_self');                
        }
    }
    $scope.executeClass = function(action){
        $scope.ExeClassAction = action;
        if(action.ActionClass != undefined){
            $scope.communicator.openLoadingPopUp();
            let executeClassParamJson = griddataprovider.executeClassParams($scope,action);
            gridfactory.executeClass(executeClassParamJson,$scope.executeSuccessHandler,$scope.executeErrorHandler);
        }
    }

    $scope.executeSuccessHandler = function(result,event){
        let msgType = 'success', messageType = 'success';
        if (result.Success == true || result.Success == 'true'){
            messageType = result.type != undefined ? result.type : 'success';
            if(result.Message != undefined && result.PageURL != undefined){
                $scope.tableCommunicator.messages = [];
                $scope.clearMessages();
                if( $scope.ExeClassAction.MessageConfig != undefined){
                    result.Message = $scope.ExeClassAction.MessageConfig;
                }
                MessageService.push(messageType,$scope.tableCommunicator.messages,result.Message);
               
                if(result.PageURL != undefined){
                    $scope.ExeClassAction.ActionURLLong = result.PageURL;
                    $timeout(function(){ $scope.openUrl($scope.ExeClassAction);}, 3000);
                }else{
                    $timeout(function(){$scope.checkRefreshBehavior($scope.ExeClassAction);}, 3000);       
                }
            }
            else if (result.Message != undefined){
                $scope.tableCommunicator.messages = [];
                MessageService.push(messageType,$scope.tableCommunicator.messages,result.Message);
                if(result.PageURL != undefined){
                    $scope.ExeClassAction.ActionURLLong = result.PageURL;
                    $timeout(function(){ $scope.openUrl($scope.ExeClassAction);}, 3000);
                }else{
                    $timeout(function(){$scope.checkRefreshBehavior($scope.ExeClassAction);}, 3000);       
                }
            }
            else if(result.PageURL != undefined){
                 $scope.ExeClassAction.ActionURLLong = result.PageURL;
                 $scope.openUrl($scope.ExeClassAction);
            }    
            
            
            $scope.refreshAllRequiredMaps();
        }
        if(result.Success == false || result.Success == 'false'){
            $scope.tableCommunicator.messages = [];
            let messageType = result.type != undefined ? result.type : 'danger';
            MessageService.push( messageType, $scope.tableCommunicator.messages, result.Message);      
        }
        messageTimeBasedClose(messageType);
        $scope.$apply();
        $scope.communicator.closeLoadingPopUp();
    }

    $scope.executeErrorHandler = function(result,event){
        $scope.communicator.closeLoadingPopUp();
        let msgType = 'success';
        $scope.tableCommunicator.messages = [];
        MessageService.push('danger',$scope.tableCommunicator.messages,event.message);
        msgType = 'danger';
        messageTimeBasedClose(msgType);
    }
    $scope.refreshAllRequiredMaps = function(){    
        angular.forEach($scope.communicator.tableObjectIdMap,function(value,key){
            if($scope.communicator.tableObjectIdMap[key] != undefined){                        
                let tableId = $scope.communicator.tableObjectIdMap[key];
                if($scope.communicator[tableId] != undefined && $scope.communicator[tableId].refreshRequiredMaps != undefined) {
	                $scope.communicator[tableId].refreshRequiredMaps();
	            }
            }
        });
    }
    $scope.checkRefreshBehavior = function(action){
        if($scope.currentPageURL != undefined && $scope.currentPageURL.indexOf('#/!') != -1){
            $scope.currentPageURL = $scope.currentPageURL.replace('#/!','');
        }
        //let winURL = decodeURIComponent($scope.currentPageURL);
        let winURL = $scope.currentPageURL;
         switch(action.RefreshBehaviour){
            case 'Refresh the entire page':
                $window.open(winURL,'_self');
                break;
            case 'Refresh parent page':
                $window.open($window.parent.flexGridEnhanced_currentPageURL,'_self');
                break;
            case 'Refresh the grid':
                $scope.tableCommunicator.refreshGrid();    
                break;
            case 'Refresh all flextables':
                refreshAllFlexGrid(); // JavaScript finction (NOT a ANGULAR function) present in FlexGridEnhanced.Component
                $scope.tableCommunicator.refreshGrid();// to refresh parent grid also
                break;
            case 'Close modal and refresh grid' :
                closeModaliFrame(modalFlexEditLayout_tableName);   
                $scope.tableCommunicator.refreshGrid();
                break;
            case 'Close modal and refresh all flextables' :
                closeModaliFrame(modalFlexEditLayout_tableName);
                refreshAllFlexGrid(); 
                $scope.tableCommunicator.refreshGrid();// to refresh parent grid also           
                break;
            default : GridHelperService.initFooterData($scope);
         }

    }
    // End  Provide support for menu action
    $scope.initlistViewLabel = function(){
        let userSelectedLV;
        for(var i=0;i<$scope.filterListViewList.length ;i++){
            let filterListView = $scope.filterListViewList[i];
            if(filterListView.IsActive == true && filterListView.IsUserListView == true){
                userSelectedLV = filterListView.Label;
                break;
            }
        }

        for(var i=0;i<$scope.filterListViewList.length ;i++){
            let filterListView = $scope.filterListViewList[i];
            if(filterListView.IsUserListView == true &&  filterListView.Label == userSelectedLV){
                $scope.tableCommunicator.listViewLabel = filterListView.Label;
                break;
            }else if(filterListView.IsActive == true && filterListView.IsMasterView == true){
                $scope.tableCommunicator.listViewLabel = filterListView.Label;
                break;
            }
        }
    }


    $scope.trustSrcHTML = function(src) {
        return $sce.trustAsHtml(src);
    };
    $scope.initlistViewLabel();
}]);