pageLayoutBuilderApp.controller('PageLayoutBuilderCtrl', function ($q, $scope, $window,
                                                                    pageLayoutBuilderHelper,
                                                                    NotificationService,WaitService,EverydayUtils) {
    
    $scope.closeModalAndRefresh = function(){
        j$('#pageBlockModalDiv').modal('hide');
        j$('#pageBlockDetailModalDiv').modal('hide');
        $scope.init();
    }
    $scope.addDrillDownFields = function(index,retVal){
        console.log('index--',index); 
        console.log('retVal--',retVal);

        console.log('$scope.availableFields--',$scope.availableFields); 
        var fields = retVal.AvailableFields;
        console.log('fields--',fields);
        $scope.$apply(function () {                            
            for(var i = 0 ; i < fields.length ; i++){
                $scope.availableFields.splice( index + i, 0, fields[i]); 
            }                                                                                                                  
        });                       
        console.log('$scope.availableFields--',$scope.availableFields);
        WaitService.end();   
        //$scope.availableFieldsIndexMap = pageLayoutBuilderHelper.getAvailableFieldsIndexMap($scope.availableFields);        
    }
    $scope.getReferenceFields = function(field,index,level){
        WaitService.start('Please wait...');
        if(level < 5){
            console.log('field--',field); 
            pageLayoutBuilderHelper.getReferenceFields(field,index,level,$scope.addDrillDownFields);   
        }else{
            
        } 

    }

    $scope.updateIndex = function(){
        for(var tabIndex = 0 ; tabIndex < $scope.formConfig.tabConfigList.length ; tabIndex++){
            var tabConfig = $scope.formConfig.tabConfigList[tabIndex];
            tabConfig.index = tabIndex;
            for(var pageBlockIndex = 0 ; pageBlockIndex < tabConfig.pageBlockConfigList.length ; pageBlockIndex++){
                var pageBlockConfig = tabConfig.pageBlockConfigList[pageBlockIndex];
                pageBlockConfig.index = pageBlockIndex;
                for(var pageBlockDetailIndex = 0 ; pageBlockDetailIndex < pageBlockConfig.pageBlockDetailConfigList.length ; pageBlockDetailIndex++){
                    var pageBlockDetailConfig = pageBlockConfig.pageBlockDetailConfigList[pageBlockDetailIndex];
                    pageBlockDetailConfig.index = pageBlockDetailIndex;
                }
            }
        }
    }
    $scope.setLayoutProperties = function(retVal){
        var layout = retVal.LayoutList[0];
        $scope.formConfig.layoutId = $scope.formConfig.layoutId == undefined ? layout.Id : $scope.formConfig.layoutId;
    }
    $scope.saveLayout = function(){
        WaitService.start('Please wait...');
        //console.log('$scope.formConfig- updated--',$scope.formConfig); 
        $scope.updateIndex();  
        console.log('$scope.formConfig- massaged--',$scope.formConfig);              
        Visualforce.remoting.Manager.invokeAction(
            _RemotingPageLayoutBuilderActions.SaveLayout,  
            angular.toJson($scope.formConfig),           
            function(saveResult, event){                         
                if (event.status) {
                    $scope.$apply(function () {  
                        console.log('saveResult-----',saveResult);
                        $scope.setLayoutProperties(saveResult);
                        $scope.setSavedChanges(); 
                        $scope.goToNextStep();                        
                        WaitService.end(); 
                    });                                                                                                           
                }                         
            }, 
            { buffer: false, escape: false}
        ); 
    }

    $scope.draggedAvailableFields = [];
    $scope.draggedSelectedFields = [];
    $scope.sortableHandler = {};

    $scope.disabledFieldsMap = {};

    $scope.pbdIndex = 0;
    $scope.pbIndex = 0;
    $scope.tabIndex = 0;

    $scope.pageBlockDetails = {};
    $scope.pageBlocks = {};
    $scope.tabs = {};

    $scope.unsavedChanges = false;
    

    $scope.pbdHandler = {};

    $scope.step = 1;

    $scope.goToPrevStep = function(){
        $scope.step = $scope.step == 3 ? 2 : $scope.step == 2 ? 1 : 1;
        $scope.pbdHandler.step = $scope.step;
    }
    $scope.goToNextStep = function(){
        $scope.step = $scope.step == 1 ? 2 : $scope.step == 2 ? 3 : 3;
        $scope.pbdHandler.step = $scope.step;
    }

    
    $scope.pbdHandler.openPageBlockDetailModal = function(pageBlockDetailConfig){
        console.log('--pageBlockDetailConfig---',pageBlockDetailConfig);   
        $scope.modalPageBlockDetailConfig = pageBlockDetailConfig;

        $scope.modalURL = '/apex/PageBlockDetailEditPage?id='+ $scope.modalPageBlockDetailConfig.fieldInfo.fieldId;
        j$('#pageBlockDetailModalDiv').modal('toggle');
    }
    
    $scope.openPageBlockModal = function(pageBlockConfig){        
        console.log('--pageBlockConfig---',pageBlockConfig);        
        $scope.modalPageBlockConfig = pageBlockConfig;
        $scope.modalURL = '/apex/PageBlockEditPage?id='+ $scope.modalPageBlockConfig.pageBlockId;
        j$('#pageBlockModalDiv').modal('toggle');
    }

    $scope.setUnsavedChanges = function(){
        $scope.unsavedChanges = true;
        $scope.pbdHandler.unsavedChanges = true;
    }
    $scope.setSavedChanges = function(){
        $scope.unsavedChanges = false;
        $scope.pbdHandler.unsavedChanges = false;
    }

    $scope.sortableHandler.movePageBlock = function(tabConfigId,from,toIndex){        
        $scope.setUnsavedChanges();
        var fromIndex = parseInt(from);
        $scope.$apply(function () {            
            $scope.tabs[tabConfigId].pageBlockConfigList.move(fromIndex,toIndex); 
            
            for(var pageBlockIndex = 0 ; pageBlockIndex < $scope.tabs[tabConfigId].pageBlockConfigList.length ; pageBlockIndex++){
                var pageBlockConfig = $scope.tabs[tabConfigId].pageBlockConfigList[pageBlockIndex];
                pageBlockConfig.index = pageBlockIndex;
            }
                     
        });  
        
    }
    $scope.updateIndexes = function(itemsList){
        for(var i = 0 ; i < itemsList.length ;i++){
            itemsList[i].index = i;
        }    
    }
    $scope.sortableHandler.moveFromAvailableFields = function(fieldName){                                                  
        for(var i = 0; i < $scope.availableFields.length ; i++){
            if($scope.availableFields[i].fieldAPIName == fieldName){
                var fieldInfo = $scope.availableFields[i];                                  
                $scope.draggedAvailableFields.push({'fieldInfo':fieldInfo});                             
            }    
        }                                                               
    }
    $scope.sortableHandler.moveFromSelectedFields = function(pageBlockConfigId,fieldName){
        $scope.setUnsavedChanges();                 
        var pageBlockConfig = $scope.pageBlocks[pageBlockConfigId];
        for(var i = 0; i < pageBlockConfig.pageBlockDetailConfigList.length ; i++){
            if(pageBlockConfig.pageBlockDetailConfigList[i].fieldInfo.fieldAPIName == fieldName){
                var pageBlockDetailConfig = pageBlockConfig.pageBlockDetailConfigList[i];
                $scope.draggedSelectedFields.push({'pageBlockConfigId':pageBlockConfigId,'index':i,'fieldInfo':pageBlockDetailConfig.fieldInfo});   
            }
        } 
        ////console.log('$scope.draggedSelectedFields--from--',$scope.draggedSelectedFields);                                              
    }            
    $scope.sortableHandler.moveToAvailableFields = function(targetId,ui){  
        $scope.setUnsavedChanges();               
        if($scope.draggedSelectedFields.length > 0){
            $scope.$apply(function () { 
                for(var i = 0 ; i < $scope.draggedSelectedFields.length ; i++){                            
                    //$scope.availableFields[$scope.draggedSelectedFields[i].availableFieldsIndex].disabled = false;
                    $scope.disabledFieldsMap[$scope.draggedSelectedFields[i].fieldInfo.fieldAPIName] = false;

                    var pageBlockConfigId = $scope.draggedSelectedFields[i].pageBlockConfigId;
                    var index = $scope.draggedSelectedFields[i].index;
                    j$(ui.item).remove();
                    $scope.pageBlocks[pageBlockConfigId].pageBlockDetailConfigList.splice(index,1);
                    $scope.updateIndexes($scope.pageBlocks[pageBlockConfigId].pageBlockDetailConfigList);
                }  
                //console.log('$scope.pageBlocks[pageBlockConfigId].pageBlockDetailConfigList--to--',$scope.pageBlocks[pageBlockConfigId].pageBlockDetailConfigList);
            }); 
            $scope.draggedSelectedFields = [];
        }                         
    }
    $scope.sortableHandler.moveToSelectedFields = function(targetId,ui){
        $scope.setUnsavedChanges();                               
        ////console.log('$scope.draggedSelectedFields--to--',$scope.draggedSelectedFields);
        var index = ui.item.index();            
        if($scope.draggedAvailableFields.length > 0){                    
            $scope.$apply(function () { 
                for(var i = 0 ; i < $scope.draggedAvailableFields.length ; i++){
                    var fieldInfo = $scope.draggedAvailableFields[i].fieldInfo;
                    var pageBlockDetailConfig = $scope.getPageBlockDetailConfigInfo(index,fieldInfo,targetId);                                  
                    $scope.pageBlockDetails[pageBlockDetailConfig.id] = pageBlockDetailConfig;                                      
                    $scope.pageBlocks[targetId].pageBlockDetailConfigList.splice(index,0,pageBlockDetailConfig);                             
                    //$scope.availableFields[$scope.draggedAvailableFields[i].availableFieldsIndex].disabled = true; 
                    $scope.disabledFieldsMap[$scope.draggedAvailableFields[i].fieldInfo.fieldAPIName] = true;                                                   
                }        
            });  
            $scope.draggedAvailableFields = [];                                              
            //console.log('$scope.pageBlocks[targetId]---up-',$scope.pageBlocks[targetId]);
        }
        if($scope.draggedSelectedFields.length > 0){                                                        
            $scope.$apply(function () { 
                for(var i = 0 ; i < $scope.draggedSelectedFields.length ; i++){                                                    
                    if($scope.draggedSelectedFields[i].pageBlockConfigId == targetId) {                                
                        $scope.pageBlocks[targetId].pageBlockDetailConfigList.move($scope.draggedSelectedFields[i].index,index);    
                    }else{  
                        j$(ui.item).remove();   
                        var pageBlockDetailConfig ={};                          
                        angular.copy($scope.draggedSelectedFields[i],pageBlockDetailConfig); 
                        pageBlockDetailConfig.index = index;                        
                        pageBlockDetailConfig.pageBlockConfigId = targetId;
                        $scope.pageBlocks[targetId].pageBlockDetailConfigList.splice(index,0,pageBlockDetailConfig);                                  
                        $scope.pageBlocks[$scope.draggedSelectedFields[i].pageBlockConfigId].pageBlockDetailConfigList.splice($scope.draggedSelectedFields[i].index,1); 
                        $scope.updateIndexes($scope.pageBlocks[$scope.draggedSelectedFields[i].pageBlockConfigId].pageBlockDetailConfigList);                                                                                                              
                    }                       
                } 
                $scope.draggedSelectedFields = [];
                ////console.log('formConfig---!!!!--',$scope.formConfig);
                //console.log('$scope.pageBlocks[targetId]--down--',$scope.pageBlocks[targetId]);
            });                                                                         
        }                                                                                
    }
    $scope.sortableHandler.clearDraggedFields = function(){               
        $scope.draggedAvailableFields = [];
        $scope.draggedSelectedFields = [];
    }

    $scope.openNewPageBlockModal = function(tabConfig){
        $scope.newPageBlock = {};        
        $scope.newPageBlock.bodyColumnSize = 1;
        j$('#newPageBlockModalDiv').modal('toggle');
        $scope.currentTabConfig = tabConfig;
    }

    $scope.addNewSection = function(){ 
        WaitService.start('Please wait...');
        j$('#newPageBlockModalDiv').modal('toggle');
        $scope.setUnsavedChanges();       
        console.log('----$scope.newPageBlock---',$scope.newPageBlock);  
        $scope.newPageBlock.bodyColumnSize = parseInt($scope.newPageBlock.bodyColumnSize);      
        var pageBlockConfig = $scope.getPageBlockConfigInfo($scope.currentTabConfig,$scope.newPageBlock);
        console.log('----pageBlockConfig---',pageBlockConfig);
        console.log('----1---',$scope.tabs[$scope.currentTabConfig.id].pageBlockConfigList);
        $scope.tabs[$scope.currentTabConfig.id].pageBlockConfigList.push(pageBlockConfig);
        console.log('----2---',$scope.tabs[$scope.currentTabConfig.id].pageBlockConfigList);
        WaitService.end();
    }

    

    $scope.getColumnClass = function(columns){
        switch(columns) {
            case 1:
                return 'single';
                break;
            case 2:
                return 'double';
                break;
            case 3:
                return 'triple';
                break;
            case 4:
                return 'quad';
                break;
        }
    }
    $scope.getPageBlockDetailConfigInfo = function(index,existingFieldInfo,pageBlockId){                

        var pageBlockDetail = {};
        pageBlockDetail.index = index;
        pageBlockDetail.pageBlockConfigId = pageBlockId;
                          
        var fieldInfo = {};
        fieldInfo.fieldAPIName = existingFieldInfo.fieldAPIName;
        fieldInfo.fieldLabel = existingFieldInfo.fieldLabel;
        fieldInfo.dataType = existingFieldInfo.dataType;
        fieldInfo.fieldId = existingFieldInfo.fieldId;                    
        pageBlockDetail.fieldInfo = fieldInfo;

        $scope.disabledFieldsMap[pageBlockDetail.fieldInfo.fieldAPIName] = true;
                       
        //var availableFieldsIndex = $scope.availableFieldsIndexMap[pageBlockDetail.fieldInfo.fieldAPIName];
        //pageBlockDetail.availableFieldsIndex = availableFieldsIndex;
        
        //$scope.availableFields[availableFieldsIndex].disabled = true;
        return pageBlockDetail;
    } 

    $scope.getPageBlockDetailConfigList = function(pageBlockId){
        var pageBlockDetailConfigList = $scope.pageBlocks[pageBlockId].pageBlockDetailConfigList == undefined ? [] : $scope.pageBlocks[pageBlockId].pageBlockDetailConfigList;                                   
        return pageBlockDetailConfigList; 
    }
    $scope.getPageBlockConfigInfo = function(tabConfig,existingPageBlockInfo){
        var pageBlockConfig = {};
        pageBlockConfig.index = $scope.pbIndex;
        pageBlockConfig.id = tabConfig.id + ($scope.pbIndex++);
        pageBlockConfig.parentId = escape(tabConfig.id);
        pageBlockConfig.title = 'New Page Block Section';
        pageBlockConfig.columns = 'double';
        if(existingPageBlockInfo != undefined){
            pageBlockConfig.columns = $scope.getColumnClass(existingPageBlockInfo.bodyColumnSize);
            pageBlockConfig.pageBlockId = existingPageBlockInfo.pageBlockId;
            pageBlockConfig.title = existingPageBlockInfo.title;
            //pageBlockConfig.tabId = existingPageBlockInfo.tabId;
        }
        $scope.pageBlocks[pageBlockConfig.id] = pageBlockConfig;                 
        pageBlockConfig.pageBlockDetailConfigList = $scope.getPageBlockDetailConfigList(pageBlockConfig.id); 
        return pageBlockConfig;
    }            
    $scope.getPageBlockConfigList = function(tabConfig,addNewPageBlock){
        var pageBlockConfigList = $scope.tabs[tabConfig.id].pageBlockConfigList == undefined ? [] : $scope.tabs[tabConfig.id].pageBlockConfigList;                                  
        if(addNewPageBlock){                   
            var pageBlockConfig = $scope.getPageBlockConfigInfo(tabConfig,undefined);               
            pageBlockConfigList.push(pageBlockConfig);   
        }
                                   
        return pageBlockConfigList;
    }
    $scope.getTabConfigInfo = function(formConfig,existingTabInfo){
        var tabConfig = {};  
        tabConfig.id = ($scope.tabIndex++) + '';   
        tabConfig.index = $scope.tabIndex++;  
        tabConfig.title = 'New Tab';           
        var addNewPageBlock = true;
        if(existingTabInfo != undefined){
            tabConfig.tabId = existingTabInfo.tabId;
            tabConfig.layoutId = existingTabInfo.layoutId;
            addNewPageBlock = false;
        }
        $scope.tabs[tabConfig.id] = tabConfig;
        tabConfig.pageBlockConfigList = $scope.getPageBlockConfigList(tabConfig,addNewPageBlock);
        return tabConfig;
    }  
    $scope.getTabConfigList = function(formConfig,addNewTab){
        var tabConfigList = formConfig.tabConfigList == undefined ? [] : formConfig.tabConfigList;                                                
        if(addNewTab){
            var tabConfig = $scope.getTabConfigInfo(formConfig,undefined);                   
            tabConfigList.push(tabConfig);
        }                                                                                          
        return tabConfigList;            
    }
    $scope.getFormConfigInfo = function(existingLayoutInfo){
        var formConfig = {};  
        formConfig.objectAPIName = $scope.objectAPIName;
        formConfig.description = 'Created using Form Builder';
        var addNewTab = true;
        if(existingLayoutInfo != undefined){
            formConfig.layoutId = existingLayoutInfo.layoutId;  
            addNewTab = false;     
        }                                             
        formConfig.tabConfigList = $scope.getTabConfigList(formConfig,addNewTab);
        return formConfig;
    } 
    $scope.getExistingLayout = function(layoutInfo){
        var existingLayoutInfo = layoutInfo;
        var formConfig = $scope.getFormConfigInfo(existingLayoutInfo);  

        for (var i = 0; i < layoutInfo.tabs.length; i++) {
            var existingTabInfo = layoutInfo.tabs[i];
            var tabConfig = $scope.getTabConfigInfo(formConfig,existingTabInfo);

            for (var j = 0; j < existingTabInfo.pageBlocks.length; j++) {
                var existingPageBlockInfo = existingTabInfo.pageBlocks[j];
                var pageBlockConfig = $scope.getPageBlockConfigInfo(tabConfig,existingPageBlockInfo);

                for (var k = 0; k < existingPageBlockInfo.fields.length; k++) {
                    var existingFieldInfo = existingPageBlockInfo.fields[k];
                    var pageBlockDetail = $scope.getPageBlockDetailConfigInfo(k,existingFieldInfo,pageBlockConfig.id);

                    pageBlockConfig.pageBlockDetailConfigList.push(pageBlockDetail);
                }
                tabConfig.pageBlockConfigList.push(pageBlockConfig);
            }
            formConfig.tabConfigList.push(tabConfig); 
        }  
        return formConfig;  
    }
    $scope.setUpFormConfig = function(layoutInfo){
        $scope.formConfig = {};
        if(layoutInfo != undefined){
            $scope.formConfig = $scope.getExistingLayout(layoutInfo);                    
        }else{                              
            $scope.formConfig = $scope.getFormConfigInfo(undefined);
        }
        //console.log('$scope.formConfig---',$scope.formConfig);                                           
    }
    $scope.setGlobalVariables = function(setUpResult){
        $scope.pageLayoutInfo = setUpResult; 
        $scope.availableFields = setUpResult.AvailableFields;
        $scope.describeMap = setUpResult.DescribeMap;  
        $scope.objectAPIName =  setUpResult.SobjectConfig.Name;  
        //$scope.availableFieldsIndexMap = pageLayoutBuilderHelper.getAvailableFieldsIndexMap(setUpResult.AvailableFields);               
        $scope.setUpFormConfig(setUpResult.Layout);                   
    }

    var params = {};
    params.PageLayoutId = pageLayoutId;
    params.SobjectConfigId = sobjectConfigId; 
    params.IsView = isView;           
    $scope.init = function(){
        WaitService.start('Loading...');
        Visualforce.remoting.Manager.invokeAction(
            _RemotingPageLayoutBuilderActions.GetSetupInfo,  
            params,           
            function(setUpResult, event){                         
                if (event.status) {
                    $scope.$apply(function () {                            
                        $scope.pageLayoutInfo = setUpResult; 
                        console.log('setUpResult----',setUpResult); 
                        //console.log('$scope.pageLayoutInfo----',$scope.pageLayoutInfo); 
                        $scope.setGlobalVariables(setUpResult);  
                        WaitService.end();                                                                                                    
                    });                                                                                                           
                }                         
            }, 
            { buffer: false, escape: false}
        );
    }
    $scope.init();
});