var j$ = jQuery.noConflict();
 
var ApprovalDecisionApp = angular.module('ApprovalDecisionComponent', []);
var clrTimeOut;

    ApprovalDecisionApp.controller('ApprovalDecisionCtrl', function ($q,$scope,$timeout, $log,$element,$window,$sce,$location) {
            //console.log('in Approval decision component');
            $scope.selectObj={};
            $scope.isReassignSelected = false;
            $scope.isCommentsshown = false;
            $scope.reassignFilterClause;
            $scope.reassignQueueFilterClause;
            $scope.reassignOptions;
            $scope.approvalAction;
            $scope.selectObj.isRendered = false;
            $scope.selectObj.recordSendToowner = false;
            $scope.selectObj.ShowComponent = false;
            $scope.selectObj.ShowDelegate = false;
            $scope.selectObj.commentRequired = 'false'; 
            $scope.keyValueMap;
             
           $scope.getApprovalProcessSteps = function(){
                $scope.recordId = recordIdvar;
                $scope.layoutType = layoutType;
                //console.log('$scope.selectedAction:1', $scope.selectObj.selectedAction);

                Visualforce.remoting.Manager.invokeAction(
                    _RemotingApprovalDecision.getApprovalOptions,
                    $scope.recordId, layoutType,
                    function(returnMap, event){ 
                //console.log('$scope.selectedAction:2', $scope.selectObj.selectedAction);

                    //console.log('returnMap',returnMap);                  
                        if (event.status) {
                            $scope.$apply(function () {
                                $scope.selectObj.isRendered = true;
                                $scope.selectApprovalObj = {};
                                $scope.selectApprovalObj.ApprovalTypes = returnMap.Options;
                                $scope.selectObj.ShowComponent = returnMap.RenderComponent;
                                $scope.selectObj.ShowDelegate = returnMap.IsDelegate;
                                //console.log('returnMap.isSendToownerFlag', returnMap.recordSendToowner);
                                if(returnMap.recordSendToowner == true){
                                  $scope.selectObj.recordSendToowner = true;
                                      $scope.selectObj.ShowComponent = true;
                                      $scope.selectObj.messageList = returnMap.msgList;
                                       $scope.selectObj.errorList = returnMap.errorList;
                                      //console.log('$scope.selectObj.messageList',$scope.selectObj.messageList);

                                }
                               angular.forEach($scope.selectApprovalObj.ApprovalTypes, function (value, key) {
                                //console.log('value-----------',value);
                                    if(value.Action == 'Reassign'){
                                        $scope.approvalAction = value.Action;
                                         $scope.reassignFilterClause = value.filterClause;
                                          $scope.reassignOptions = value.QueueOption;
                                          $scope.reassignQueueFilterClause = value.QueueFilterClause;
                                         if(flexTableParameters != null && flexTableParameters != undefined & flexTableParameters != ''){
                                            //console.log('flexTableParameters:===',flexTableParameters);
                                            $scope.keyValueMap = JSON.parse(flexTableParameters);
                                            angular.forEach($scope.keyValueMap, function (value, key) {
                                                $scope.reassignFilterClause = $scope.reassignFilterClause.replace('{!' + key + '}',value);

                                            });
                                         }

                                        if(listParameters != null && listParameters != undefined & listParameters != ''){
                                            //console.log('listParameters:===',listParameters);
                                            $scope.keyValueMap = JSON.parse(listParameters);
                                            angular.forEach($scope.keyValueMap, function (value, key) {
                                               if($scope.reassignFilterClause != null && $scope.reassignFilterClause != undefined && $scope.reassignFilterClause != '' && $scope.reassignFilterClause.indexOf('{!'+key+'}') != -1){
                                                        $scope.reassignFilterClause = $scope.reassignFilterClause.replace(new RegExp('{!'+key+'}','g'),'(\''+value.join('\',\'')+'\')'); //False +ve for non literal regex used for sanitization, as we are not using for sanitization purpose
                                                    }

                                                    if($scope.reassignQueueFilterClause != null && $scope.reassignQueueFilterClause != undefined && $scope.reassignQueueFilterClause != '' && $scope.reassignQueueFilterClause.indexOf('{!'+key+'}') != -1){
                                                        $scope.reassignQueueFilterClause = $scope.reassignQueueFilterClause.replace(new RegExp('{!'+key+'}','g'),'(\''+value.join('\',\'')+'\')'); //False +ve for non literal regex used for sanitization, as we are not using for sanitization purpose   
                                                    }
                                                //$scope.reassignFilterClause = $scope.reassignFilterClause.replace('{!' + key + '}',value);

                                            });

                                            


                                         }

                                        

                                    }
                                });

                               
                            });

                        }
                    },{ buffer: false, escape: false}
                 );
             }
             $scope.getApprovalProcessSteps();

             $scope.changedAction = function(result){
                //console.log('$scope.selectApprovalObj.ApprovalTypes',$scope.selectApprovalObj.ApprovalTypes);
                if($scope.selectObj.selectedAction == 'Reassign'){
                    $scope.isReassignSelected = true;
                    $scope.isCommentsshown = true;
                    $scope.selectObj.errMessage = '';
                    clearTimeout(clrTimeOut);
                    //$scope.selectObj.commentRequired = 'false'; 
                }else{
                     $scope.isReassignSelected = false;
                     $scope.isCommentsshown = true;
                     $scope.selectObj.errMessage = '';
                     clearTimeout(clrTimeOut);
                   // $scope.selectObj.commentRequired = 'true';

                }
                angular.forEach($scope.selectApprovalObj.ApprovalTypes, function (value, key) {
                    //console.log('$scope.selectApprovalObj.ApprovalTypes1',$scope.selectApprovalObj.ApprovalTypes);
           
                    if(value.Action == $scope.selectObj.selectedAction){
                        $scope.selectObj.commentRequired = value.CommentRequired;
                        $scope.selectObj.ConfirmationMessage = value.ConfirmationMessage;
                        $scope.selectObj.ConfirmationTitle = value.ConfirmationTitle;
                        //console.log('value.CommentRequired---',value.CommentRequired);
                        //console.log(' $scope.commentRequired ---', $scope.selectObj.commentRequired );
                       
                    }
                });

             }
             

             $scope.handleTimeout = function(){
               var messageType = '';
                if($scope.selectObj.message != undefined || $scope.selectObj.message !=''){
                   messageType = 'success';                     
                }

                if($scope.selectObj.errMessage != undefined || $scope.selectObj.errMessage !=''){
                      messageType = 'danger';                      
                }

                 $scope.approvalMessageTimeBasedClose(messageType); 
             }

            

            $scope.approvalMessageTimeBasedClose = function(msgType) {
              if(msgTypeArr.indexOf(msgType) != -1 && msgType != undefined && msgType != ''){
                if(messageTimeOut == 'NaN' || messageTimeOut==''){
                  messageTimeOut = 600000;
                }
                clrTimeOut=window.setTimeout(function() {
                          // $scope.selectObj.errMessage = undefined;
                          j$('#approvalerror').trigger('click');
                          j$(".alert").fadeTo(500, 0).slideUp(500, function(){
                             j$(this).remove(); 
                          });

                          }, messageTimeOut);
              }
            }

             $scope.dismisserror = function() {
                clearTimeout(clrTimeOut);
                 $scope.selectObj.errMessage = undefined; 
             }

            
             $scope.submitForApproval = function(selectedAction){
                //console.log('$scope.selectedAction:',$scope.selectObj.selectedAction);
                //console.log('$scope.recordId:', $scope.recordId);
                //console.log('$scope.selectedComment:', $scope.selectObj.selectedComment);
                //console.log('$scope.commentRequired:', $scope.commentRequired);
                //console.log('$scope.selectObj.ConfirmationMessage',$scope.selectObj.ConfirmationMessage);
                //console.log('$scope.selectObj.ConfirmationTitle',$scope.selectObj.ConfirmationTitle);
                //console.log('hello');
                if($scope.selectObj.commentRequired == undefined){
                    $scope.selectObj.commentRequired = 'false';

                }
                
                 //Bug 144218: Internal-Multiple issues in unsaved data changes functionality.
                if(typeof preventDefaultDialogBox  !==  "undefined") {
					preventDefaultDialogBox = true;
				}
                
                //$scope.selectObj.ShowComponent = true;
               // $scope.selectObj.errMessage = '';
                if($scope.selectObj.selectedAction == undefined){
                    //console.log('$scope.selectObj.selectedAction',$scope.selectObj.selectedAction );
                    $scope.selectObj.errMessage = 'Please select appropriate action before submitting.';

                }
                if( $scope.selectObj.selectedAction != undefined && ( $scope.selectObj.commentRequired == 'true' && ($scope.selectObj.selectedComment == undefined || $scope.selectObj.selectedComment == ''))){
                     //console.log('$scope.selectObj.selectedComment11',$scope.selectObj.selectedComment);
                     $scope.selectObj.errMessage = 'Comments are Required.';
                     $scope.selectObj.ShowComponent = true;
                     //console.log('$scope.selectObj.ShowComponent11',$scope.selectObj.ShowComponent);
                     return;
                     //$scope.selectObj.ShowComponent = true;
                }

                 if(($scope.selectObj.chosenUserId == undefined || $scope.selectObj.chosenUserId == '' ) && $scope.selectObj.selectedAction == 'Reassign'){
                     //console.log('$scope.selectObj.chosenUserId123',$scope.selectObj.chosenUserId);
                     $scope.selectObj.errMessage = 'Please Select User.';
                    $scope.selectObj.chosenUserId = '';
                    return;
                }

                if($scope.selectObj.selectedAction != undefined && ( $scope.selectObj.commentRequired == 'false' || ($scope.selectObj.commentRequired == 'true' && ($scope.selectObj.selectedComment != undefined && $scope.selectObj.selectedComment != '')))){
                    //console.log('$scope.selectObj.selectedActionpraj',$scope.selectObj.selectedAction);
                    //console.log('$scope.selectObj.commentRequiredpraj',$scope.selectObj.commentRequired);
                    //console.log('$scope.selectObj.selectedCommentpraj',$scope.selectObj.selectedComment);

                    if($scope.selectObj.selectedComment == undefined) {
                        $scope.selectObj.selectedComment = '';
                    }
                    if($scope.selectObj.chosenUserId == undefined) {
                         $scope.selectObj.chosenUserId = '';
                    }

                    //$scope.selectObj.isRendered = false;
                    if($scope.selectObj.ConfirmationMessage != undefined && $scope.selectObj.ConfirmationTitle != undefined){
                        $scope.showConfirmBox();    
                    }else{
                        $scope.performAction();

                    }
                
                }
            }
            //Show confirmation box on click of submit button
             $scope.showConfirmBox = function(){
        
                bootbox.dialog({
                  message: $scope.selectObj.ConfirmationMessage,
                  title:$scope.selectObj.ConfirmationTitle,
                  onEscape: function() {},
                  backdrop: true,
                  closeButton: true,
                  animate: true,
                  buttons: {
                    No: {   
                       label: "Cancel",
                      callback: function() {
                        // On click of cancel to show approval component
                         $scope.selectObj.ShowComponent = true;
                         $scope.selectObj.isRendered = true;

                      }
                    },
                    "Yes": {
                      label: "Continue" ,
                      callback: function(result) {
                         if(result){

                            //showLoadingPopUp();
                            $scope.performAction();
                        }
                      }
                    },
                  }
                });
     
             }
             //When action is successful then this method is call. 
             $scope.performAction = function(){
                showLoadingPopUp();
                    Visualforce.remoting.Manager.invokeAction(
                        _RemotingApprovalDecision.submitRecords,
                        $scope.selectObj.selectedAction,$scope.recordId,$scope.selectObj.selectedComment,$scope.selectObj.chosenUserId,
                        function(result, event){ 
                        //console.log('result------',result);                  
                            if (event.status) {
                                if(result.Success ==true){
                                    $scope.createSnapshot();
                                    hideLoadingPopUp();
                                    $scope.$apply(function () {
                                     $scope.selectObj.message = result.msg;
                                     $scope.selectObj.messageList = result.msgList;
                                    });
                                    
                                }else{
                                    $scope.$apply(function () {
                                     $scope.selectObj.errMessage = result.Message;
                                     hideLoadingPopUp();
                                     //$scope.selectObj.ShowComponent = false;
                                    });

                                }
                                
                            }
                        },{ buffer: false, escape: false}
                     );
                }

               $scope.createSnapshot = function(){

                    //if(nextStepExists == false || nextStepExists == 'false'){    
                           // showLoadingPopUp();   
                            Visualforce.remoting.Manager.invokeAction( 
                            _RemotingApprovalDecision.generateSnapshot,parentId,tmplateName,flexTableParameters,listParameters,
                                function(result,event){
                                    if (event.status) {
                                        if(result.Success ==true){
                                            //hideLoadingPopup();
                                            setTimeout(function(){ window.location.reload(); }, 200);
                                        }else{
                                            $scope.$apply(function () {
                                             $scope.selectObj.errMessage = result.Message;
                                             //hideLoadingPopUp();
                                             //$scope.selectObj.ShowComponent = false;
                                            });

                                        }
                                    }
                                });
                    //}

                    
                }
            


              
            
    

}); 

    ApprovalDecisionApp.directive("autoComplete", function($compile, $filter,$parse) {
        
        var fetchDataForDropDown = function(scope, element, filterClause,queueFilterClause,queueOption) {
            
            //console.log('filterClause---', filterClause);
            //console.log('filterClause---', filterClause);
            //console.log('scope---', scope);
            var selectRessign ={};
            if(filterClause == undefined){
                filterClause = '';
            }
            if(queueOption == undefined){
                queueOption = '';
            }
            if(queueFilterClause == undefined){
                queueFilterClause = '';
            }
            if(flexTableParameters == undefined){
                flexTableParameters = '';
            }
            if(listParameters == undefined){
                listParameters = '';
            }
            
            selectRessign.filterClause = filterClause; 
            selectRessign.queueFilterClause = queueFilterClause;
            selectRessign.queueOption = queueOption;
            selectRessign.flexTableParameters = flexTableParameters;
            selectRessign.listParameters = listParameters;

            var lookupval = 'Search...';
            //console.log('$scope.selectRessign',selectRessign);
            Visualforce.remoting.Manager.invokeAction(
            _RemotingApprovalDecision.getUserQueueRecords,
             selectRessign,
            function(lookupResult, event) {
                if (event.status) {
                    //scope.$apply(function () {                                                                                                       
                    var data = {
                        results: []
                    }
                    data.results = lookupResult.SobjList;
                    //query.callback( data); 
                    //console.log('data------', data);
                    element.select2({
                        placeholder: lookupval,
                        data: data
                    });

                    //});                                                                                                            
                } else {}
            }, {
                buffer: false,
                escape: false
            });
        }
        
        return {
            restrict: 'A',
            scope: {
              filterClause: '=',
              queueFilterClause: '=',
              queueOption:'='
             
            },
            link: function(scope, element, attr) {
                //----Function for replace all-----                                                                       
                fetchDataForDropDown(scope, element,scope.filterClause,scope.queueFilterClause,scope.queueOption);
            }
        }
    });


/*function createSnapshot(nextStepExists,isError){
    if(nextStepExists == false || nextStepExists == 'false'){    
        showLoadingPopUp();   
        Visualforce.remoting.Manager.invokeAction( 
            _RemotingApprovalDecision.generateSnapshot,parentId,tmplateName,flexTableParameters,listParameters,
            function(result,event){
                if(event.type == 'rpc'){ 
                    hideLoadingPopup();
                    window.location.href = windowLocationUrl;
                };
            }
        );
    }

    if(isError != true){
        window.location.href = windowLocationUrl;
    }
} 
}*/ 
