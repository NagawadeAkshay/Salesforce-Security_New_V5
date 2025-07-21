flexGrid.directive('action',function($compile,$sce){
var template =  '<span ng-repeat="action in actions |  orderBy : \'Sequence\'" >' +
                    //TEST COMMENT<!--Row Actions-->
                    '<span ng-if="action.Location == \'Row\' && tableCommunicator.hideActionMap != undefined  && tableCommunicator.hideActionMap[row.Id][action.Name] != true ">' +
                        '<span  ng-if="(!($index == 0)) && action.IconCSS == \'null\'">|</span> ' +
                        '<a href="#!" tabIndex="0" class="tableLinks" title="{{action.ButtonHelpText != null ? action.ButtonHelpText : action.Name}}" ng-click="actionHandler(action); buttonHandler(tableCommunicator.tableId);">' +
                            '<span ng-if="action.IconCSS != \'null\'" ng-bind-html="trustAsHtml(action.IconCSS)"></span>' +
                            '<span ng-if="action.IconCSS == undefined" ng-bind="action.Name"></span>' +
                            '<span class="hidden" ng-bind="action.Name"></span>' +
                            '<span class="hidden508" ng-bind="action.Name"></span>' +
                        '</a>' +
                    '</span>' +
                    //<!--Disabled Row Action -->
                    '<span ng-if="action.Location == \'Row\' && tableCommunicator.hideActionMap != undefined && tableCommunicator.disableRowlevelAction == true  && tableCommunicator.hideActionMap[row.Id][action.Name] == true ">' +
                        '<span  ng-if="(!($index == 0)) && action.IconCSS == \'null\'">|</span> ' +
                        '<a href="#!" tabIndex="0" ng-class="{disabledOpacity: tableCommunicator.disableRowlevelAction }" class="tableLinks" title="{{action.ButtonHelpText != null ? action.ButtonHelpText : action.Name}}" ng-click="actionHandler(action)">' +
                            '<span ng-if="action.IconCSS != \'null\'" ng-bind-html="trustAsHtml(action.IconCSS)"></span>' +
                            '<span ng-if="action.IconCSS == undefined" ng-bind="action.Name"></span>' +
                            '<span class="hidden" ng-bind="action.Name"></span>' +
                            '<span class="hidden508" ng-bind="action.Name"></span>' +
                        '</a>' +
                    '</span>' +
                    //<!--Top Actions-->
                    '<span  ng-if="action.Location == \'Top\' && action.StandardAction != \'Save\'  &&  action.HeaderActionDisplayType == \'Button\'  && (!(tableCommunicator.hideActionMap != undefined && tableCommunicator.hideActionMap[\'Top\'] != undefined && tableCommunicator.hideActionMap[\'Top\'][action.Name] == true))" >' +
                        '<button title="{{action.ButtonHelpText != null ? action.ButtonHelpText : action.Name}}" type="button" class="secondaryBtn" tabIndex="0" ng-click="actionHandler(action); buttonHandler(tableCommunicator.tableId);"  ' +
                            'ng-if="action.EditableRows == undefined">{{action.Name}}</button>' +
                        '<button ng-if="action.EditableRows == \'AllRows\' && !communicator[tableCommunicator.tableId].isMassEdit && tableCommunicator.showMassEditActions" title="{{action.Name}}" type="button" class="secondaryBtn" tabIndex="0" ng-click="actionHandler(action); buttonHandler(tableCommunicator.tableId);">{{action.Name}}</button>' +
                        '<button ng-if="action.EditableRows == \'SelectedRows\' && !communicator[tableCommunicator.tableId].isMassEdit && tableCommunicator.showMassEditActions" title="{{action.Name}}" type="button" class="secondaryBtn" tabIndex="0" ng-click="actionHandler(action); buttonHandler(tableCommunicator.tableId);">{{action.Name}}</button>' +
                    '</span>' +
                '</span>';
    var linker = function(scope,element,attrs){
        // Handling Html Tag Such as Anchor Tag for HyperLink in formula Field..
        scope.trustAsHtml = function(viewValue) {
            if(viewValue != undefined && viewValue != 'undefined' && viewValue?.includes("<meta")){
                if(viewValue.includes("no-referrer")){
                    viewValue = viewValue.replaceAll("no-referrer", "origin");
                    viewValue = viewValue.replaceAll("<", "&lt;");
                    viewValue = viewValue.replaceAll(">", "&gt;");
                    }
            }
                viewValue = DOMPurify.sanitize(viewValue);
            if(viewValue != undefined && viewValue.includes('\'')){
                viewValue = viewValue.replace('\'', '\\\'');
            }	
            return $sce.trustAsHtml(viewValue);
        }
        element.html(template).show();
        $compile(element.contents())(scope);
    }

    return {
            restrict : 'E',           
            link: linker,
            controller : 'actionController',
            scope : {
                actions : '=',
                communicator : '=',
                row : '=',
                tableCommunicator : '='
            }
    }
});

flexGrid.controller('actionController', ['$scope','$timeout','griddataprovider','gridfactory', 'DataBaseService','MessageService','GridHelperService','$sce','$window','$parse', function($scope,$timeout, griddataprovider, gridfactory, DataBaseService,MessageService,GridHelperService,$sce,$window,$parse){
    $scope.currentPageURL = flexGridEnhanced_currentPageURL;
    $scope.parse = $parse;
    
    /* 
        -----------------------------------------
        CHECK REFRESH BEHAVIOR
        -----------------------------------------
    */
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
                $scope.parentcurrentPageURL = $window.parent.flexGridEnhanced_currentPageURL.replace('#/!','');                
                $window.open($scope.parentcurrentPageURL,'_self');
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
                /*Added below check for Bug 177766 -Created new function refreshGridOnDelete.
                 This will get executed when Refresh behaviour is not provided. Previously 
                 initFooterData was getting executed in case of delete no refresh behaviour */  
            case undefined:$scope.tableCommunicator.ifRefreshBehaviourIsBlank();
                    break;
            default : GridHelperService.initFooterData($scope);
         }

    }

    $scope.tableCommunicator.checkModalRefreshBehaviour = function(){

        var queryString = $scope.tableCommunicator.modalWindowURL ?  $scope.tableCommunicator.modalWindowURL.split('?')[1] : '';
        //var urlParams = new URLSearchParams(queryString);

        var urlParams = queryString.split('&').reduce(function (q, query) {
              var chunks = query.split('=');
              var key = chunks[0];
              var value = chunks[1];
              return (q[key] = value, q);
            }, {});
        if(urlParams['RefreshBehaviour'] == undefined){
            urlParams['RefreshBehaviour'] = 'Refresh the grid';
        }
        action= {};
        if(urlParams['RefreshBehaviour'] != undefined && urlParams['RefreshBehaviour'] != ''){
            action['RefreshBehaviour'] = urlParams['RefreshBehaviour'];
            $scope.checkRefreshBehavior(action);
            parent.showModalTitle('');    
        }
    }

    /*
        -----------------------------------------
        UNDO RECORDS
        -----------------------------------------
    */
    $scope.undoEditing = function(){
        for (let i = $scope.tableCommunicator.recordsList.length -1;i >= 0; i--){

            if($scope.tableCommunicator.recordsList[i] != undefined){
                if($scope.communicator.editRowIdMap[$scope.tableCommunicator.recordsList[i].Id] != undefined){
                    $scope.communicator.editRowIdMap[$scope.tableCommunicator.recordsList[i].Id] = false;
                }
                if($scope.tableCommunicator.recordsShadowMap[i] != undefined){
                    $scope.tableCommunicator.recordsList[i] = $scope.tableCommunicator.recordsShadowMap[i];    
                }
                if($scope.tableCommunicator.recordsList[i].Id != undefined && $scope.tableCommunicator.recordsList[i].Id.length < 15){
                    $scope.tableCommunicator.recordsList.splice(i,1); 
                    delete  $scope.communicator.editRowIdMap[$scope.tableCommunicator.recordsList[i].Id]; 
                }       
            }
        }

        // if($scope.communicator.saveRecordsMap[$scope.tableCommunicator.sobjectName] != undefined ){
        //     $scope.communicator.saveRecordsMap[$scope.tableCommunicator.sobjectName] = {};    
        // }

        if($scope.communicator.newSaveRecordsMap[$scope.tableCommunicator.tableId] != undefined ){
            $scope.communicator.newSaveRecordsMap[$scope.tableCommunicator.tableId] = {};    
        }
        $scope.communicator[$scope.tableCommunicator.tableId].isMassEdit = false;
        $scope.communicator.isMassSave = false;
        $scope.$apply();
    }

    $scope.tableCommunicator.undoEditing = function(){
        let undoConfirmMsg = undoConfirmLabel;
        $scope.showConfirmBox(undefined,undoConfirmMsg,true,false,false);    
    }

    /*
        -----------------------------------------
        EDIT ALL RECORDS
        -----------------------------------------
    */

    $scope.editAllRecords = function(){
        for (var i = 0; i < $scope.tableCommunicator.recordsList.length; i++) {
            $scope.communicator.editRowIdMap[$scope.tableCommunicator.recordsList[i].Id] = true;
            if ( !$scope.tableCommunicator.recordsList[i].isTotal && $scope.tableCommunicator.recordsList[i].Id.length >= 15 && $scope.communicator.newSaveRecordsMap[$scope.tableCommunicator.tableId][$scope.tableCommunicator.recordsList[i].Id] == undefined) {
                $scope.communicator.newSaveRecordsMap[$scope.tableCommunicator.tableId][$scope.tableCommunicator.recordsList[i].Id] = {};
                $scope.communicator.newSaveRecordsMap[$scope.tableCommunicator.tableId][$scope.tableCommunicator.recordsList[i].Id]['Id'] = $scope.tableCommunicator.recordsList[i]['Id'];
            }
            if(!angular.equals($scope.communicator[$scope.tableCommunicator.tableId].requiredFieldsMap,{})){
                angular.forEach($scope.communicator[$scope.tableCommunicator.tableId].requiredFieldsMap,function(value,key){
                    if($scope.tableCommunicator.recordsList[i][key] == undefined){
                        $scope.tableCommunicator.recordChangeHandler($scope.tableCommunicator.recordsList[i],key,'');   
                    }else {
                        $scope.communicator.newSaveRecordsMap[$scope.tableCommunicator.tableId][$scope.tableCommunicator.recordsList[i].Id][key] = $scope.tableCommunicator.recordsList[i][key];
                    }
                });
            }
            $scope.tableCommunicator.recordsShadowMap[i] = angular.copy($scope.tableCommunicator.recordsList[i]); 
        } 
        $scope.communicator[$scope.tableCommunicator.tableId].isMassEdit = true;
        $scope.communicator.isMassSave = true;
        $scope.tableCommunicator.setSelectAllRecordCheckbox();
    }
    
    /*
        -----------------------------------------
        EDIT SELECTED RECORDS 
        -----------------------------------------
    */
    $scope.editSelectedRecords = function(){
        let selectedRecords = $scope.tableCommunicator.recordSelectionMap;
        if(angular.equals($scope.tableCommunicator.recordSelectionMap,{}) == true){
            MessageService.push(null,$scope.tableCommunicator.messages,'SelectOneRecord');  
        }else{ 
            let selectionCount = 0;
            for (var i = 0; i < $scope.tableCommunicator.recordsList.length; i++) {
                let row = $scope.tableCommunicator.recordsList[i];
                if($scope.tableCommunicator.recordSelectionMap[row.Id] != undefined &&
                    $scope.tableCommunicator.recordSelectionMap[row.Id] == true){
                    selectionCount++;
                    $scope.communicator.editRowIdMap[row.Id] = true; 
                    if (row.Id.length >= 15 && $scope.communicator.newSaveRecordsMap[$scope.tableCommunicator.tableId][row.Id] == undefined) {
                        $scope.communicator.newSaveRecordsMap[$scope.tableCommunicator.tableId][row.Id] = {};
                    }
                    if(!angular.equals($scope.communicator[$scope.tableCommunicator.tableId].requiredFieldsMap,{})){
                        angular.forEach($scope.communicator[$scope.tableCommunicator.tableId].requiredFieldsMap,function(value,key){
                            if(row[key] == undefined){
                                $scope.tableCommunicator.recordChangeHandler(row,key,'');   
                            }else {
                                $scope.communicator.newSaveRecordsMap[$scope.tableCommunicator.tableId][row.Id][key] = row[key];
                            }
                        });
                    }
                    $scope.tableCommunicator.recordsShadowMap[i] = angular.copy(row); 
                }
            }
            if(selectionCount == 0){
                MessageService.push(null,$scope.tableCommunicator.messages,'SelectOneRecord');  
                $scope.communicator[$scope.tableCommunicator.tableId].isMassEdit = false;
                $scope.communicator.isMassSave = false;
            }else{
                $scope.communicator[$scope.tableCommunicator.tableId].isMassEdit = true;
                 $scope.communicator.isMassSave = true;  
            }
            
        }
        $scope.tableCommunicator.setSelectAllRecordCheckbox();
    }

    /*
        -----------------------------------------
        EDIT SINGLE RECORD
        -----------------------------------------
    */
    $scope.editSingleRecord = function(action){
        let pageNumber = $scope.tableCommunicator.pageNumber;
        if ($scope.communicator.newSaveRecordsMap[$scope.tableCommunicator.tableId] == undefined) {
            $scope.communicator.newSaveRecordsMap[$scope.tableCommunicator.tableId] = {};
        }
        if ($scope.row.Id.length >= 15 && $scope.communicator.newSaveRecordsMap[$scope.tableCommunicator.tableId][$scope.row.Id] == undefined) {
            $scope.communicator.newSaveRecordsMap[$scope.tableCommunicator.tableId][$scope.row.Id] = {};
            $scope.communicator.newSaveRecordsMap[$scope.tableCommunicator.tableId][$scope.row.Id]['Id'] = $scope.row['Id'];
        }
        if(action.EditableRows == 'SingleRow'){
            if(action.SingleRowEditBehavior == 'Inline'){
                $scope.communicator.editRowIdMap[$scope.row.Id] = true;
                if(!angular.equals($scope.communicator[$scope.tableCommunicator.tableId].requiredFieldsMap,{})){
                    angular.forEach($scope.communicator[$scope.tableCommunicator.tableId].requiredFieldsMap,function(value,key){
                        if($scope.row[key] == undefined){
                            $scope.tableCommunicator.recordChangeHandler($scope.row,key,'');   
                        } else {
                            $scope.communicator.newSaveRecordsMap[$scope.tableCommunicator.tableId][$scope.row.Id][key] = $scope.row[key];
                        }
                    });
                }
                $scope.tableCommunicator.isEdit = true;
                $scope.communicator[$scope.tableCommunicator.tableId].isEdit = true;
                $scope.communicator.isSave = true;
                $scope.tableCommunicator.recordsShadowMap[$scope.tableCommunicator.recordsList.indexOf($scope.row)] = angular.copy($scope.row); 
                $scope.tableCommunicator.recordsShadowMapWithId[$scope.row.Id] = angular.copy($scope.row);
            }
            if(action.SingleRowEditBehavior == 'Modal'){
                $scope.tableCommunicator.openInModalWindow(action);
            }
        }
    }
    /*
        -----------------------------------------
        EDIT RECORDS
        -----------------------------------------
    */
    $scope.editMultipleRecords = function(action){
        if ($scope.communicator.newSaveRecordsMap[$scope.tableCommunicator.tableId] == undefined) {
            $scope.communicator.newSaveRecordsMap[$scope.tableCommunicator.tableId] = {};
        }
        if(action.EditableRows == 'SelectedRows'){
            $scope.editSelectedRecords();        
        }
        if(action.EditableRows == 'AllRows'){
            $scope.editAllRecords();
        }

    }

    $scope.replaceRelatedRecordFields = function(winURL){
        let  winMergeFields = [];
        winMergeFields = winURL.match(/{!([^}]*)}/g);
        if(winMergeFields == null){
            return winURL;
        }
        for (let i=0;i<winMergeFields.length;i++){
            winMergeFields[i] = winMergeFields[i].replace('{!','').replace('}',''); //False +ve for incomplete - sanitization - as we are not using this for sanitization
            let merFields = winMergeFields[i].split(/\.(.+)/);    
            let valueGetter = $scope.parse(merFields[1]);
            let fieldValue = valueGetter($scope.row); 
            if($scope.tableCommunicator.sobjectName == merFields[0]){
                winURL = winURL.replace('{!'+merFields[0]+'.'+merFields[1]+'}',fieldValue);     
            }
        }
        return winURL;
    }

    $scope.replaceParentMergeFields = function(winURL){
        if($scope.tableCommunicator.tableId == $scope.communicator.parentFlexTableId){
            winURL = winURL.replace('{!parentId}',$scope.communicator.parentRecordId);
        }
        if($scope.tableCommunicator.parentId != undefined &&
            $scope.tableCommunicator.parentId != null && 
            $scope.tableCommunicator.parentId != ''){
            winURL = winURL.replace('{!parentId}', escape($scope.tableCommunicator.parentId));    
        }
        return winURL;
    }

    /*
        ------------------------------------------------------
        CLEAR THE MESSAGE OF ALL TABLES BEFORE CRUD OPERATIONS
        ------------------------------------------------------
    */

    $scope.clearMessages = function(){
        angular.forEach( $scope.communicator.tableObjectIdMap,function(value,key){
            if($scope.communicator[value] != undefined){
                $scope.communicator[value].clearMessages($scope.tableCommunicator.tableId);    
            }
        });
    }

    /*
        -----------------------------------------
        OPEN URL METHOD 
        -----------------------------------------
    */

    
    $scope.openUrl = function(action){
        $scope.communicator.openLoadingPopUp(); 
        let winURL = '';
        if(action.ActionURLLong != undefined){
            if(action.ActionURLLong.indexOf('#/!') != -1){
                    action.ActionURLLong = action.ActionURLLong.replace('#/!','');
            }
            winURL = decodeURIComponent(action.ActionURLLong);   
        }
        if(action.Location == 'Top'){
            winURL = $scope.replaceParentMergeFields(winURL);   
        }
        if($scope.row != undefined){
            winURL = winURL.replace('{!rowId}',$scope.row.Id);  
            winURL = $scope.replaceParentMergeFields(winURL);
            winURL = $scope.replaceRelatedRecordFields(winURL);  
        }
        winURL = $scope.tableCommunicator.replaceStringParamters(winURL);
        winURL = $scope.tableCommunicator.replaceListParamters(winURL);
        winURL = winURL.replace('{!query}',$scope.tableCommunicator.query); 
        //if currentPage consist of retURL then remove it 
        let currentPageURL = angular.copy($scope.currentPageURL);
        if (currentPageURL.indexOf('&retURL') != -1 || currentPageURL.indexOf('?retURL') != -1) {
            currentPageURL = currentPageURL.substring(0, currentPageURL.indexOf('retURL') - 1);
        }
       // attach new retURL as a current page URL without .
       let newUrl = new URL(window.location.href);
       let retUrl = newUrl.href.replace(newUrl.origin, '');
        if (winURL.indexOf("?") == -1) {
            winURL = winURL + '?retURL=' + encodeURIComponent(retUrl);            
        }else {
            winURL = winURL + '&retURL=' + encodeURIComponent(retUrl);           
        }
        if (action.WhereToOpen == 'SameWindow') {
            $window.open(winURL, '_self');
        }else if (action.WhereToOpen == 'NewTab') {
            $window.open(winURL, '_blank');
        }else if (action.WhereToOpen == 'NewWindow') { 
            $window.open(winURL, '_blank', 'width='+$window.innerWidth+',height=' +$window.innerHeight);
        }else if (action.WhereToOpen == 'Modal') {  
            $scope.tableCommunicator.openInModalWindow(action,winURL);
        }else if (action.WhereToOpen === 'SplitScreen'){
            $window.open(winURL, '_blank');
        }
        $timeout(function(){$scope.communicator.closeLoadingPopUp();}, 3500);
        
    }


    /*
        -----------------------------------------
            REMOVE AUDIT FIELDS BEFORE SAVING RECORD
        -----------------------------------------
    */

    $scope.removeAuditFields = function(row){

        //Need to add more AuditFields
        if(row['LastModifiedDate'] != undefined){
            delete row['LastModifiedDate'];
        }
        if(row['CreatedDate'] != undefined){
            delete row['CreatedDate'];
        }
        return row;
    }

     /*
        -----------------------------------------
        ADD DEFAULT VALUES BEFORE SAVING RECORD
        -----------------------------------------
    */
    $scope.addDefaultValues = function(massagedRow){
        //Default Values of the field which are not displayed on table
        angular.forEach($scope.tableCommunicator.defaultValueMap,function(value,key){
                massagedRow[key] = value;    
            //For RecordType Field -- Need to make it generic for standard Fields
            if(massagedRow['RecordType'] != undefined){
                massagedRow['RecordTypeId'] = massagedRow['RecordType'].Id != undefined ? massagedRow['RecordType'].Id : massagedRow['RecordType'] ;
                delete massagedRow['RecordType'];
            }
        });
        return massagedRow;
    }


    /*
        -----------------------------------------
        VALIDATE FIELDS
        -----------------------------------------
    */
    $scope.validateFields = function(){
        let tempMap = $scope.communicator.newSaveRecordsMap;
        for (tableId in tempMap) {
            let objectSpecificMap = tempMap[tableId];
            let objectSpecificList = [];

            for (id in objectSpecificMap) {
                let  row = objectSpecificMap[id];
                //For PICKLIST which comes as Object
                angular.forEach(row,function(value,key){
                    if(row[key] != null){
                        if(row[key].Value != undefined){
                            row[key] = row[key].Value;
                        }
                        if(key.indexOf('__r') != -1){
                            delete row[key];
                        }    
                    }
                }); 
                $scope.communicator.newSaveRecordsMap[tableId][id] = row;
            }
        }

    }

    /*
        ----------------------------------------------------------
        CHECK MAP BEFORE SENDING TO APEX SIDE FOR  REQUIRED FIELDS
        ----------------------------------------------------------
    */
    $scope.checkForRequiredFields = function() {
        let processedMap  = {};
        let tempMap = $scope.communicator.newSaveRecordsMap;
        $scope.isRequiredError = false;

        for (tableId in tempMap) {
            let objectSpecificMap = tempMap[tableId];
            let objectSpecificList = [];
            for (id in objectSpecificMap) {
                if(id.length > 14 && jQuery.isEmptyObject($scope.communicator.newSaveRecordsMap[tableId][id])){
                    delete $scope.communicator.newSaveRecordsMap[tableId][id];
                } else {
                    $scope.isRequiredError = $scope.tableCommunicator.checkRequiredFields(tableId,objectSpecificMap[id]);
                    if($scope.isRequiredError){
                        break;
                    }
                    objectSpecificList.push(objectSpecificMap[id]);
                }
            }
            if(!$scope.isRequiredError){
                processedMap[tableId] = objectSpecificList;
            }

        }
        if($scope.isRequiredError){
            return {};
        }
        else{
            return processedMap;
        }
    };

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

    /*
        -----------------------------------------
        SAVE RECORD METHOD
        -----------------------------------------
    */

    $scope.tableCommunicator.saveRecords = function(){
        // prevent Default Dialog Box for unsaved data entries
        if(typeof preventDefaultDialogBoxForGrid  !==  "undefined") {
            preventDefaultDialogBoxForGrid = true;
        }
        let saveRecordsMap = $scope.checkForRequiredFields();
        console.log('Before saving Results : ',saveRecordsMap);
        if(!$scope.isRequiredError){
            $scope.communicator.openLoadingPopUp();
            $scope.validateFields();
            let saveRecordsJson = griddataprovider.saveRecordsParams(saveRecordsMap,
                                           $scope.communicator.tableObjectsMap,
                                           $scope.communicator.levelVsTableIdMap,
                                           $scope.communicator.parentLookupFieldMap,
                                           $scope.communicator.queryfieldsMap);
            gridfactory.saveRecords(saveRecordsJson,$scope.saveRecordsSuccessHandler,$scope.saveRecordsErrorHandler);    
        }else{
            $scope.tableCommunicator.messages = [];
            MessageService.push('danger',$scope.tableCommunicator.messages,'Required Field Missing');
        }
    }
    //
    $scope.saveRecordsSuccessHandler = function(result,event){
        $scope.communicator.closeLoadingPopUp();
        let msgType = 'success';
        $scope.tableCommunicator.messages = []; 
        if(result.Success == false){
            angular.forEach($scope.tableCommunicator.fieldLabelOriginalMap, function (value, key) { 
                if(result.Message.indexOf(key) != -1 && result.Message.indexOf($scope.tableCommunicator.fieldLabelMap[value]) == -1){//Bug 266971
                    result.Message = result.Message.replace(key,$scope.tableCommunicator.fieldLabelMap[value]);
                }
            }); 
                if(result.Message?.includes("<meta")){
                    if(result.Message.includes("no-referrer")){
                        result.Message = result.Message.replaceAll("no-referrer", "origin");
                        result.Message = result.Message.replaceAll("<", "&lt;");
                        result.Message = result.Message.replaceAll(">", "&gt;");
                    }			
                }
                result.Message = DOMPurify.sanitize(result.Message); 
            let strMessage = $scope.tableCommunicator.parseExceptionMessage(result.Message);        
            MessageService.push('danger',$scope.tableCommunicator.messages,strMessage); 
            msgType = 'danger';
            $scope.$apply(); 
        }else if(result.Success == true){
            if(result.Message != undefined){
                    if(result.Message?.includes("<meta")){
                        if(result.Message.includes("no-referrer")){
                            result.Message = result.Message.replaceAll("no-referrer", "origin");
                            result.Message = result.Message.replaceAll("<", "&lt;");
                            result.Message = result.Message.replaceAll(">", "&gt;");
                        }			
                    }
                    result.Message = DOMPurify.sanitize(result.Message);
                 MessageService.push('warning',$scope.tableCommunicator.messages,result.Message);    
                 msgType = 'warning';
            }else{
                if(result.result != undefined){
                    console.log('After Saving Result : ',result.result);
                    $scope.communicator.recordsIDMap = ($scope.communicator.recordsIDMap != undefined && !jQuery.isEmptyObject($scope.communicator.recordsIDMap)) ? $scope.communicator.recordsIDMap : {};
                    angular.forEach(result.result,function(value,key){
                        //if($scope.communicator.tableObjectIdMap[key] != undefined){
                        //    let tableId = $scope.communicator.tableObjectIdMap[key];
                            // if($scope.communicator[tableId] != undefined && $scope.communicator[tableId].refreshTable != undefined){
                            //     $scope.communicator[tableId].refreshTable(result.result[key]);
                            // }
                        //}    
                            //console.log('saveRecordsSuccessHandler :   key   ' + key);

                            
                            $scope.communicator[key].refreshTable(value);
                            $scope.communicator[key].initSortField();
                            $scope.communicator[key].isEdit= false;
                            angular.forEach(value['newRecordsMap'],function(record,Id){
                                $scope.communicator.recordsIDMap[Id] = record.Id;
                            });   
                    }); 
                    //clear the messages of the tables.
                    $scope.clearMessages();
                }else{
                    angular.forEach($scope.communicator.editRowIdMap,function(value,key){
                            $scope.communicator.editRowIdMap[key] = false;                                  
                    });
                    // set isEdit mode false for all table 
                    angular.forEach($scope.communicator.tableIdVsObjectAPIMap,function(value,key){
                        if($scope.communicator[key] != undefined){
                            $scope.communicator[key].isEdit = false; 
                        }                                                        
                    });
                    
                    $scope.communicator[$scope.tableCommunicator.tableId].isEdit = false;
                }
                
                $scope.refreshAllRequiredMaps();
                let msgg = 'Saved Successfully!';
                if($scope.tableCommunicator.saveTopAction != undefined){
                    if($scope.tableCommunicator.saveTopAction.MessageConfig != undefined){
                        msgg = $scope.tableCommunicator.saveTopAction.MessageConfig;
                    }
                }
                    if(msgg?.includes("<meta")){
                        if(msgg.includes("no-referrer")){
                            msgg = msgg.replaceAll("no-referrer", "origin");
                            msgg = msgg.replaceAll("<", "&lt;");
                            msgg = msgg.replaceAll(">", "&gt;");
                        }			
                    }
                    msgg = DOMPurify.sanitize(msgg);  
                MessageService.push('success',$scope.tableCommunicator.messages,msgg);
                msgType = 'success';
                $scope.tableCommunicator.isEdit = false;
               // $scope.communicator[$scope.tableCommunicator.tableId].isEdit = false;
                               
                $scope.communicator.isSave = false;
                $scope.communicator.isMassSave = false;
                $scope.tableCommunicator.isMassEdit = false; 
                angular.forEach($scope.communicator.tableObjectIdMap,function(value,key){
                   if($scope.communicator[value] != undefined){
                        $scope.communicator[value].isMassEdit = false;    
                    }
                });
            }
            $scope.communicator.saveRecordsMap = {};
            $scope.communicator.newSaveRecordsMap = {};
            $scope.tableCommunicator.recordsShadowMap = {};
            $scope.tableCommunicator.recordsShadowMapWithId = {};
            $scope.communicator.editRowIdMap = {};
            if($scope.tableCommunicator.saveTopAction != undefined){
                $scope.checkRefreshBehavior($scope.tableCommunicator.saveTopAction);    
            }else{
                $scope.communicator.openLoadingPopUp();                
                $scope.tableCommunicator.refreshGrid(); 
            }
        }else{
            if(result.Message != undefined){
                $scope.tableCommunicator.messages = [];
                    if(result.Message?.includes("<meta")){
                        if(result.Message.includes("no-referrer")){
                            result.Message = result.Message.replaceAll("no-referrer", "origin");
                            result.Message = result.Message.replaceAll("<", "&lt;");
                            result.Message = result.Message.replaceAll(">", "&gt;");
                        }			
                    }
                    result.Message = DOMPurify.sanitize(result.Message);
                MessageService.push('danger',$scope.tableCommunicator.messages,result.Message); 
                msgType = 'danger';
            }
        }
        messageTimeBasedClose(msgType);
        $scope.$apply();   
    }

    $scope.saveRecordsErrorHandler = function(result,event){
        $scope.communicator.closeLoadingPopUp();
        let msgType = 'success';
        $scope.tableCommunicator.messages = [];
            if(event.message?.includes("<meta")){
                if(event.message.includes("no-referrer")){
                    event.message = event.message.replaceAll("no-referrer", "origin");
                    event.message = event.message.replaceAll("<", "&lt;");
                    event.message = event.message.replaceAll(">", "&gt;");
                }			
            }
            event.message = DOMPurify.sanitize(event.message);
        MessageService.push('danger',$scope.tableCommunicator.messages,event.message);
        msgType = 'danger'; 
        messageTimeBasedClose(msgType);
        $scope.$apply();
    }


   
    /*
        ------------------------------
        ADD NEW RECORD 
        ------------------------------
    */
    $scope.addNewRecord = function(){
        checkedWindow = true;
        let newRecord = {};
        let newRecordId = $scope.communicator[$scope.tableCommunicator.tableId].newRecordUniqueId();
        // if($scope.communicator.saveRecordsMap[$scope.tableCommunicator.sobjectName] == undefined){
        //     $scope.communicator.saveRecordsMap[$scope.tableCommunicator.sobjectName] = {};    
        // }

        if($scope.communicator.newSaveRecordsMap[$scope.tableCommunicator.tableId] == undefined){
            $scope.communicator.newSaveRecordsMap[$scope.tableCommunicator.tableId] = {};    
        }

        //$scope.communicator.saveRecordsMap[$scope.tableCommunicator.sobjectName]
        newRecord['Id'] = newRecordId;
        //$scope.communicator.saveRecordsMap[$scope.tableCommunicator.sobjectName][newRecord.Id] = newRecord;

        $scope.communicator.newSaveRecordsMap[$scope.tableCommunicator.tableId][newRecord.Id] = newRecord;
        if($scope.tableCommunicator.parentTargetLookupField != undefined &&
            $scope.tableCommunicator.parentId != undefined){
            newRecord[$scope.tableCommunicator.parentTargetLookupField] = escape($scope.tableCommunicator.parentId);
            
        }
        $scope.tableCommunicator.isEdit = true;
        $scope.communicator[$scope.tableCommunicator.tableId].isEdit = true;
        $scope.communicator.isSave = true;
        // Adding blank fields in saveRecordsMap
        for(let i=0;i<$scope.tableCommunicator.columnsList.length;i++){
            if($scope.tableCommunicator.fieldMetaData[$scope.tableCommunicator.columnsList[i]] != undefined){
                if($scope.tableCommunicator.fieldMetaData[$scope.tableCommunicator.columnsList[i]].IsCreateable == true){
                    if($scope.tableCommunicator.fieldMetaData[$scope.tableCommunicator.columnsList[i]].Type =='DATE' ||
                       $scope.tableCommunicator.fieldMetaData[$scope.tableCommunicator.columnsList[i]].Type == 'DATETIME' ||
                        $scope.tableCommunicator.fieldMetaData[$scope.tableCommunicator.columnsList[i]].Type == 'TIME'){
                        newRecord[$scope.tableCommunicator.columnsList[i]] = null;    
                    }else{
                        newRecord[$scope.tableCommunicator.columnsList[i]] = '';    
                    } 
                }
            }            
            $scope.removeAuditFields(newRecord);
        }  
         
        // Adding default value in saveRecordsMap.
        newRecord = $scope.addDefaultValues(newRecord);
        //$scope.communicator.saveRecordsMap[$scope.tableCommunicator.sobjectName][newRecord.Id] = newRecord;
        
        $scope.communicator.newSaveRecordsMap[$scope.tableCommunicator.tableId][newRecord.Id] = newRecord;
        $scope.tableCommunicator.recordsList.unshift(newRecord);
        $scope.communicator.editRowIdMap[newRecord.Id] = true;
    }


    /*
        -------------------------------
        REMOVE NEW RECORD
        -------------------------------
    */

    $scope.tableCommunicator.removeNewRecord = function(row){
        // if($scope.communicator.saveRecordsMap[$scope.tableCommunicator.sobjectName] != undefined &&
        //     $scope.communicator.saveRecordsMap[$scope.tableCommunicator.sobjectName][row.Id] != undefined ){
        //     delete $scope.communicator.saveRecordsMap[$scope.tableCommunicator.sobjectName][row.Id];    
        // }

        if($scope.communicator.newSaveRecordsMap[$scope.tableCommunicator.tableId] != undefined &&
            $scope.communicator.newSaveRecordsMap[$scope.tableCommunicator.tableId][row.Id] != undefined ){
            delete $scope.communicator.newSaveRecordsMap[$scope.tableCommunicator.tableId][row.Id];    
        }
        let index = $scope.tableCommunicator.recordsList.indexOf(row);
        $scope.tableCommunicator.recordsList.splice(index,1); 
        delete $scope.communicator.editRowIdMap[row.Id] ; 
        let editCount = 0;
        angular.forEach($scope.communicator.editRowIdMap , function(value, key) {
            if($scope.communicator.editRowIdMap[key] == true){
                editCount ++;
            }        
        });
        
        if(editCount == 0){
            $scope.tableCommunicator.isEdit = false;
            $scope.communicator[$scope.tableCommunicator.tableId].isEdit = false;
            $scope.communicator.isSave = false;
        }
    }
    /*
        -------------------------------
        DELETE RECORD
        ------------------------------- 
    */
    $scope.deleteRecords = function(action){
        $scope.communicator.openLoadingPopUp();
        $scope.delAction = action;
        let rowIdList = [];
        let deleteRecordsMap = {};
        if(action.Location == 'Top'){
            let selectedRecords = $scope.tableCommunicator.recordSelectionMap;
            if(angular.equals($scope.tableCommunicator.recordSelectionMap,{}) == true){
                $scope.communicator.closeLoadingPopUp();
                MessageService.push(null,$scope.tableCommunicator.messages,'SelectOneRecord');
                $scope.$apply();   
            }else{ 
                let selectionCount = 0;
                for (var i = 0; i < $scope.tableCommunicator.recordsList.length; i++) {
                    if($scope.tableCommunicator.recordSelectionMap[$scope.tableCommunicator.recordsList[i].Id] != undefined &&
                        $scope.tableCommunicator.recordSelectionMap[$scope.tableCommunicator.recordsList[i].Id] == true){
                        selectionCount++;
                        rowIdList.push($scope.tableCommunicator.recordsList[i].Id);
                    }
                }
                if(selectionCount == 0){
                    $scope.communicator.closeLoadingPopUp();
                    MessageService.push(null,$scope.tableCommunicator.messages,'SelectOneRecord'); 
                    $scope.$apply();  
                }else{
                    deleteRecordsMap[$scope.tableCommunicator.sobjectName] =  rowIdList; 
                    $scope.delRecordsList = rowIdList;
                    let delRecordJSON = griddataprovider.deleteRecordsParams(deleteRecordsMap);
                    gridfactory.deleteRecords(delRecordJSON,$scope.delRecordSuccessHandler,$scope.delRecordErrorHandler);       
                }
            }
        }else if(action.Location == 'Row'){
            rowIdList.push($scope.row.Id);
            deleteRecordsMap[$scope.tableCommunicator.sobjectName] =  rowIdList; 
            $scope.delRecordsList = rowIdList;
            let delRecordJSON = griddataprovider.deleteRecordsParams(deleteRecordsMap);
            gridfactory.deleteRecords(delRecordJSON,$scope.delRecordSuccessHandler,$scope.delRecordErrorHandler);  
        }
    }

    $scope.delRecordSuccessHandler = function(result,event){
        $scope.communicator.closeLoadingPopUp();
        let msgType = 'success';
        if(result.Success == false){
            $scope.tableCommunicator.messages = [];
                if(result.Message?.includes("<meta")){
                    if(result.Message.includes("no-referrer")){
                        result.Message = result.Message.replaceAll("no-referrer", "origin");
                        result.Message = result.Message.replaceAll("<", "&lt;");
                        result.Message = result.Message.replaceAll(">", "&gt;");
                    }			
                }
                result.Message = DOMPurify.sanitize(result.Message);
            MessageService.push('danger',$scope.tableCommunicator.messages,result.Message);  
            msgType = 'danger';
            $timeout(function(){ $scope.checkRefreshBehavior($scope.delAction);}, 2500);
        }else if(result.Success == true){
            if($scope.delAction.MessageConfig != undefined){
                result.Message = $scope.delAction.MessageConfig;
            }
            $scope.tableCommunicator.deleteLokiRecords($scope.delRecordsList);
            $scope.tableCommunicator.messages = [];

            $scope.refreshAllRequiredMaps();
            $scope.clearMessages();
                if(result.Message?.includes("<meta")){
                    if(result.Message.includes("no-referrer")){
                        result.Message = result.Message.replaceAll("no-referrer", "origin");
                        result.Message = result.Message.replaceAll("<", "&lt;");
                        result.Message = result.Message.replaceAll(">", "&gt;");
                    }			
                }
                result.Message = DOMPurify.sanitize(result.Message);
            MessageService.push('success',$scope.tableCommunicator.messages,result.Message);
            msgType = 'success'; 

            $scope.communicator.saveRecordsMap = {};
            $scope.communicator.newSaveRecordsMap = {};

            $timeout(function(){ $scope.checkRefreshBehavior($scope.delAction);}, 2500);
        }
        checkedWindow = true; //Bug 349116: 
        messageTimeBasedClose(msgType);
        $scope.$apply();      
        
    }

    $scope.delRecordErrorHandler = function(result,event){
        $scope.communicator.closeLoadingPopUp();
        let msgType = 'success';
        $scope.tableCommunicator.messages = [];
            if(event.message?.includes("<meta")){
                if(event.message.includes("no-referrer")){
                    event.message = event.message.replaceAll("no-referrer", "origin");
                    event.message = event.message.replaceAll("<", "&lt;");
                    event.message = event.message.replaceAll(">", "&gt;");
                }			
            }
        event.message = DOMPurify.sanitize(event.message); 
        checkedWindow = true; //Bug 349116: 
        MessageService.push('danger',$scope.tableCommunicator.messages,event.message);
        msgType = 'danger';
        messageTimeBasedClose(msgType);
    }

    /*
        -------------------------------
        EXECUTE CLASS 
        -------------------------------
    */
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
                    if(result.Message?.includes("<meta")){
                        if(result.Message.includes("no-referrer")){
                            result.Message = result.Message.replaceAll("no-referrer", "origin");
                            result.Message = result.Message.replaceAll("<", "&lt;");
                            result.Message = result.Message.replaceAll(">", "&gt;");
                        }			
                    }
                    result.Message = DOMPurify.sanitize(result.Message);
                MessageService.push(messageType,$scope.tableCommunicator.messages,result.Message);
               
                if(result.PageURL != undefined){
                    $scope.ExeClassAction.ActionURLLong = result.PageURL;
                    $scope.tableCommunicator.resetSelectAllRecordCheckbox();
                    $timeout(function(){ $scope.openUrl($scope.ExeClassAction);}, 3000);
                }else{
                    $timeout(function(){$scope.checkRefreshBehavior($scope.ExeClassAction);}, 3000);       
                }
            }
            else if (result.Message != undefined){
                $scope.tableCommunicator.messages = [];
                    if(result.Message?.includes("<meta")){
                        if(result.Message.includes("no-referrer")){
                            result.Message = result.Message.replaceAll("no-referrer", "origin");
                            result.Message = result.Message.replaceAll("<", "&lt;");
                            result.Message = result.Message.replaceAll(">", "&gt;");
                        }			
                    }
                    result.Message = DOMPurify.sanitize(result.Message);
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
                if(result.Message?.includes("<meta")){
                    if(result.Message.includes("no-referrer")){
                        result.Message = result.Message.replaceAll("no-referrer", "origin");
                        result.Message = result.Message.replaceAll("<", "&lt;");
                        result.Message = result.Message.replaceAll(">", "&gt;");
                    }			
                }
                result.Message = DOMPurify.sanitize(result.Message);
            MessageService.push( messageType, $scope.tableCommunicator.messages, result.Message);      
        }
        $scope.tableCommunicator.recordSelectionMap = {};
        messageTimeBasedClose(messageType);
        $scope.$apply();
        $scope.communicator.closeLoadingPopUp();
    }

    $scope.executeErrorHandler = function(result,event){
        $scope.communicator.closeLoadingPopUp();
        let msgType = 'success';
        $scope.tableCommunicator.messages = [];
            if(event.message?.includes("<meta")){
                if(event.message.includes("no-referrer")){
                    event.message = event.message.replaceAll("no-referrer", "origin");
                    event.message = event.message.replaceAll("<", "&lt;");
                    event.message = event.message.replaceAll(">", "&gt;");
                }			
            }
            event.message = DOMPurify.sanitize(event.message);
        MessageService.push('danger',$scope.tableCommunicator.messages,event.message);
        msgType = 'danger';
        messageTimeBasedClose(msgType);
    }

    /*
        -------------------------------
        CHECK ACTION BEHAVIOR
        -------------------------------
    */

   

    $scope.checkActionBehavior = function(action){
        
        switch(action.ActionBehavior){
            case 'EditRecord' : 
                $scope.editSingleRecord(action);
            break;
            case 'EditMultipleRecords' : 
                $scope.editMultipleRecords(action);
            break;
            case 'OpenURL' : 
                $scope.openUrl(action);    
            break;
			case 'OpenSheetJSUrl' : // By default for sheetjs
                    $scope.openSheetJSUrl(action);    
                break;
            case 'ExecuteClass' : 
                $scope.executeClass(action);    
            break;     
            default: 
                $window.open(action.ActionURLLong,'_self');                
        }
    }

    /*
        -------------------------------
        SHOW CONFIRMATION BOX
        -------------------------------
    */
    $scope.showConfirmBox = function(action,msg,isUndo,isDelete,isNew){
           //B27U30G20 added new function 
            msg = $scope.removeMaliciousValFromMsg(msg);
        bootbox.dialog({
            message: msg,
            title:"Confirm",
            onEscape: function() {
                checkedWindow = true;
				 if(j$(".tableGridWrap > table.gridTable").length > 0) {
                        j$(".tableGridWrap > table.gridTable > thead").removeClass("no-z-index");

                        j$('.tableGridWrap > table.gridTable > thead > tr > th.sticky-column').removeClass("no-z-index");
                        j$('.tableGridWrap > table.gridTable > tbody> tr > td.sticky-column').removeClass("no-z-index");

                        j$('.tableGridWrap  table.gridTable>tbody>tr>td.paddingZero').removeClass("no-z-index");

                        j$('.quickSearchBoxWrap').removeClass("no-z-index");
                        j$('.input-group-btn:last-child>.btn .quickSearchBtn .customBtn').removeClass("no-z-index");
                    }
            },
            backdrop: true,
            closeButton: true,
            animate: true,
            buttons: {
                No: {   
                    label: "No",
                    callback: function() {
                        checkedWindow = true;
						if(j$(".tableGridWrap > table.gridTable").length > 0) {
                                j$(".tableGridWrap > table.gridTable > thead").removeClass("no-z-index");

                                j$('.tableGridWrap > table.gridTable > thead > tr > th.sticky-column').removeClass("no-z-index");
                                j$('.tableGridWrap > table.gridTable > tbody> tr > td.sticky-column').removeClass("no-z-index");

                                j$('.tableGridWrap  table.gridTable>tbody>tr>td.paddingZero').removeClass("no-z-index");

                                j$('.quickSearchBoxWrap').removeClass("no-z-index");
                                j$('.input-group-btn:last-child>.btn .quickSearchBtn .customBtn').removeClass("no-z-index");
                            }
                     }
                },
                "Yes": {
                    label: "Yes" ,
                    callback: function(result) {
                        if(isDelete){
                            $scope.deleteRecords(action);
                        }
                        else if(isNew){
                             $scope.addNewRecord();
                        }
                        else if(isUndo){
                            $scope.undoEditing();
                        }
                        else if(result){
                            /*Bug 186069 START: Added checkedWindow = true*/
                            checkedWindow = true;
                            /*Bug 186069 END: Added checkedWindow = true*/
                            $scope.checkActionBehavior(action);   
                        }
                        if(j$(".tableGridWrap > table.gridTable").length > 0) {
                            j$(".tableGridWrap > table.gridTable > thead").removeClass("no-z-index");

                            j$('.tableGridWrap > table.gridTable > thead > tr > th.sticky-column').removeClass("no-z-index");
                            j$('.tableGridWrap > table.gridTable > tbody> tr > td.sticky-column').removeClass("no-z-index");

                            j$('.tableGridWrap  table.gridTable>tbody>tr>td.paddingZero').removeClass("no-z-index");

                            j$('.quickSearchBoxWrap').removeClass("no-z-index");
                            j$('.input-group-btn:last-child>.btn .quickSearchBtn .customBtn').removeClass("no-z-index");
                        }
                        
                    }
                },   
            }  
        });
    }
        //B27U30G20 added new function 
        $scope.removeMaliciousValFromMsg = function(message){
            if(message != undefined && message != 'undefined' && message?.includes("<meta")){  
                if(message.includes("no-referrer")){
                    message = message.replaceAll("no-referrer", "origin");
                    message = message.replaceAll("<", "&lt;");
                    message = message.replaceAll(">", "&gt;");
                }
            }
           
            message = DOMPurify.sanitize(message);
            if(message != undefined && message.includes('\'')){
                message = message.replaceAll(/\\/g, "\\\\");// fix will show single or multiple 's correctly to user
            }
            return message;
        }

    /*
        -------------------------------
        CHECK FOR CONFIRMATION BOX
        -------------------------------
    */
    $scope.checkForConfirmationMsg = function(action){
        if(action.ShowConfirmationBox == true){
            checkedWindow = false;
            if(action.ConfirmationMessage != undefined){
                if(action.StandardAction == 'Delete' ){
                    $scope.showConfirmBox(action,action.ConfirmationMessage,false,true,false);    
                }else if(action.StandardAction == 'New'){
                    $scope.showConfirmBox(action,action.ConfirmationMessage,false,false,true);
                   
                }
                else{
                    $scope.showConfirmBox(action,action.ConfirmationMessage,false,false,false);    
                }
            }
        }else{
            if(action.StandardAction == 'Delete' ){
                action.ConfirmationMessage = deleteConfirmLabel;
                $scope.showConfirmBox(action,action.ConfirmationMessage,false,true,false);    
            }else if(action.StandardAction == 'New'){
                    $scope.addNewRecord();
            }else{
                $scope.checkActionBehavior(action);    
            }
               
        }
    }

    /*
        -------------------------------
        ACTION HANDLER...
        -------------------------------
    */
   var checkedWindow = true;
    $scope.actionHandler = function(action){
		if(action.StandardAction == "Delete")
        	checkedWindow = true;
        if(checkedWindow){
            $scope.checkForConfirmationMsg(action);  
            
        }
       
    }

    $scope.buttonHandler = function(tableId){
       
      setTimeout(function () {
              j$('table.gridTable').each(function () {
                  
                  if (this.id) {

                      checkContainer(this.id);
                  }
              });
          }, 1000); 
         
      }
	/*
            -------------------------------
            Upload Download SheetJs
            -------------------------------
        */
       $scope.openSheetJSUrl = function(){
        
            //New Code to Handle Sheet Js Modal....
            $scope.windowTitle =  'Download & Upload Wizard';
            j$('#sheetJS'+$scope.tableCommunicator.tableName).modal();
            $scope.frame = document.getElementById('iframeSheetJS'+$scope.tableCommunicator.tableName);
            j$('#iframeSheetJS'+$scope.tableCommunicator.tableName).height(350);
            // Exception Handling JS  ......
            try{
                if($scope.frame != null)
                    $scope.frameDoc = $scope.frame.contentDocument || $scope.frame.contentWindow.document;
                if($scope.frameDoc != null)
                    $scope.frameDoc.documentElement.textContent = "";
                    
            }catch(ex){ 
                console.log('Sheet Js Msg==='+ex.message);
            }finally{
                lastFocus = document.activeElement;	
                j$('#iframeSheetJS'+$scope.tableCommunicator.tableName).attr('src','/apex/' + namespace + 'SheetJsImportExportWizard?islocal=false&parentTableId=' +$scope.tableCommunicator.tableId+ '&parentTableName='+$scope.tableCommunicator.tableName);
            }
        }
}]);