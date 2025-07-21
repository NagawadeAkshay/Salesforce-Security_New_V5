var j$ = jQuery.noConflict();
function backToParent(){
	window.location.href = attachments_windowLocParentObjectId;
}

// Method to Close Modal Once Attached..
function closeModalForAttachment(mode,attachTableType,attchTableName){
	if(attachTableType == 'EnhancedAttachment'){
		let elId = attchTableName +'modalDivCloseIcon';
		angular.element(j$('#'+elId)).trigger('click');
	}else{
	angular.element(j$('#attachmentmodalDivCloseIcon'+mode)).trigger('click');
}
}
//var customAttachmentsApp = angular.module($scope.attachments_pbId,['ui.bootstrap']);
customAttachmentsApp.controller('customAttachmentsAppCtrl',function($q, $scope, Scopes,$sce){
	Scopes.store('customAttachmentsAppCtrl', $scope);
	$scope.fileList = [];     
	$scope.recordTypePicklist = []; 
	$scope.documentGroupPicklist = [];
	$scope.customFileObjectList = [];
	$scope.isLoading = false;
	$scope.FileName;
	$scope.isSuccessful = false;
	$scope.onlyCustomFiles = [];
	$scope.customFiles = [];      
	$scope.selectedRow = [];  
	$scope.selectedRecId = [];  
	$scope.Edited = false;  
	$scope.timeOffset = Scopes.get('mastercustomAttachmentsAppCtrl').attachments_timeOffset;
	$scope.noRecords = false;
	$scope.hideAction = {};
	$scope.HideDisableRowActions;
	$scope.ParentRecEditAccess;
	$scope.isHistoryAng = Scopes.get('mastercustomAttachmentsAppCtrl').attachments_isHistory;
	$scope.attachments_parentObjectId = Scopes.get('mastercustomAttachmentsAppCtrl').attachments_parentObjectId;
	$scope.attachments_pageBlockId = Scopes.get('mastercustomAttachmentsAppCtrl').attachments_pageBlockId;
	$scope.attachments_isView = Scopes.get('mastercustomAttachmentsAppCtrl').attachments_isView;
	$scope.attachments_isDigiSign = Scopes.get('mastercustomAttachmentsAppCtrl').attachments_isDigiSign;
	$scope.attachments_parentObject = Scopes.get('mastercustomAttachmentsAppCtrl').attachments_parentObject;
	$scope.attachments_pbId = Scopes.get('mastercustomAttachmentsAppCtrl').attachments_pbId;
	$scope.attachments_namespace = Scopes.get('mastercustomAttachmentsAppCtrl').attachments_namespace;
	$scope.attachments_deleteConfirmLabel = Scopes.get('mastercustomAttachmentsAppCtrl').attachments_deleteConfirmLabel;
	$scope.attachments_alertHeaderLabel = Scopes.get('mastercustomAttachmentsAppCtrl').attachments_alertHeaderLabel;
	$scope.attachments_attachmentClassification = Scopes.get('mastercustomAttachmentsAppCtrl').attachments_attachmentClassification;   
	$scope.setLoading = function(loading){            
		$scope.isLoading = loading;
	};              
	$scope.closeAlert = function(index) {
		$scope.isSuccessful=false;
	};	
	$scope.getDateTime = function(value){
	var time = undefined;
	if(value != undefined){
	return $scope.toUTCDate(new Date(value+$scope.timeOffset));
	}
	return time;
	};

	$scope.toUTCDate = function(date){
	var _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
	return _utc;
	};

	$scope.trustSrcHTML = function(src) {
		return $sce.trustAsHtml(src);
	}

	$scope.loadData = function(){
	$scope.getAttachments(true);    
	}        
	/*-------------------------------------------
	Function Name : getAttachments().
	Purpose : Fetch data for display Table.
	Invoke at the time of loading.

	---------------------------------------------*/                                          
	$scope.getAttachments = function(loadConfigData){
		//console.log('SCope:==',$scope);
		var i=0;                 
		Visualforce.remoting.Manager.invokeAction(
			_RemotingAttachmentsActions.fetchAttachments,
			$scope.attachments_parentObjectId,$scope.attachments_pageBlockId,$scope.attachments_isView,loadConfigData,$scope.attachments_isDigiSign,$scope.isHistoryAng,
			function(result,event){ 
				$scope.fileList = [];
				if(event.status){
					if(loadConfigData){
						$scope.HideDisableRowActions = result.HideDisableRowActions;
						$scope.ParentRecEditAccess = result.isParentRecEditAccess;
						$scope.attachmentlocaleDateTime = result.AttachmentDateTime;
						for(var action in result.ActionConfig){
							if(action=='Edit'){
								$scope.hideAction['Edit'] = result.ActionConfig[action].hideAction;
								//console.log('Edit Action-->>', $scope.hideAction['Edit']);
							}else
							if(action=='Delete'){
								$scope.hideAction['Delete'] = result.ActionConfig[action].hideAction;   
								//console.log('Delete Action-->>', $scope.hideAction['Delete']) 
							}else
							if(action=='Create' ){
								$scope.hideAction['Create'] = result.ActionConfig[action].hideAction;
								//console.log('Create Action-->>', $scope.hideAction['Create'])
							}
						}			  
					}
					for (var item in event.result.AttachmentList){                                                                 
						$scope.fileList.push( event.result.AttachmentList[item]);                                 
					}    
					if($scope.fileList != undefined && $scope.fileList.length == 0){
						$scope.noRecords = true;
					}else{
						$scope.noRecords = false;
					}																					
				}else{
					////console.log('result------->>>>',result); 
				}            
				$scope.$apply(function(){
				$scope.setLoading(false);
				});                            
			},                         
			{escape:true}
		);  

	}; 

	$scope.editAttachment = function(index,attId,classification){		
		j$('#editAttModal'+$scope.attachments_pbId).modal(); 
		$scope.frame = document.getElementById('iframeEditContentId'+$scope.attachments_pbId);
		j$('#iframeEditContentId'+$scope.attachments_pbId).height(100);
		if($scope.frame != null)
			$scope.frameDoc = $scope.frame.contentDocument || $scope.frame.contentWindow.document;
		if($scope.frameDoc != null)
			$scope.frameDoc.documentElement.textContent = "";
		lastFocus = document.activeElement;			
		j$('#iframeEditContentId'+$scope.attachments_pbId).attr('src','/apex/AttachmentEdit?ParentId='+ $scope.attachments_parentObject +'&pBlockId='+ $scope.attachments_pbId +'&attachmentId='+ attId +'&classification='+$scope.attachments_attachmentClassification +'&attchTableType=Attachment'); 
	}

	$scope.addAttachment = function(){
		//console.log('In Add attachment--'); 
		j$('#addAttModal'+$scope.attachments_pbId).modal();
		$scope.frame = document.getElementById('iframeAddAttContentId'+$scope.attachments_pbId);
		j$('#iframeAddAttContentId'+$scope.attachments_pbId).height(100);
		
		if($scope.frame != null)
			$scope.frameDoc = $scope.frame.contentDocument || $scope.frame.contentWindow.document;
		if($scope.frameDoc != null)
			
			$scope.frameDoc.documentElement.textContent = "";
			
		lastFocus = document.activeElement;	
		j$('#iframeAddAttContentId'+$scope.attachments_pbId).attr('src','/apex/AttachmentAdd?parentId='+ $scope.attachments_parentObject +'&pBlockId='+ $scope.attachments_pbId +'&classification='+ $scope.attachments_attachmentClassification +'&attchTableType=Attachment'); 		
		
	};
	
	$scope.confirmAndDelete = function(attId){
		//console.log('Entered confirmAndDelete function!');
		var deleteMessage = $scope.attachments_deleteConfirmLabel;
		bootbox.dialog({
			message: deleteMessage,            
			title:"Confirm",  
			onEscape: function() {},
			backdrop: false,
			closeButton: true,
			animate: true,
			buttons: {
				No: {   
					label: "No",
					className: "customBtn btn-ext",
					callback: function() {}
				},
				"Yes": {
					label: "Yes" ,
					className: "customBtn btn-ext",
					callback: function(result) {
						if(result){
							//showLoadingPopUp();
							$scope.deleteAttchment(attId);
						} 
					}
				},
			}
		});         
	};

	$scope.deleteAttchment = function(attId){		 
		Visualforce.remoting.Manager.invokeAction(
			_RemotingAttachmentsActions.DeleteRecord,
			attId,
			function(deleteResult, event){
				if(event.status){ 
					$scope.$apply(function () {                         
						var deleteMessage;
						if(deleteResult.Success){
							deleteMessage = deleteResult.Message;;
							$scope.getAttachments(false);                                                
						}else{
							var result = deleteResult.Message;
							/*var deleteMessageArray = result.split(':');
							var deleteMessage = deleteMessageArray[2];
							var deleteErrorMessageArray = deleteMessage.split(',');
							deleteMessage = deleteErrorMessageArray[1];  */
							deleteMessage = result;                   
						}
						hideLoadingPopUp();                         
						var titleMessage = $scope.attachments_alertHeaderLabel;
						bootbox.dialog({
							size: 'small',
							message: deleteMessage,
							title: titleMessage,
							onEscape: function() {},
							backdrop: false,
							closeButton: true,
							animate: true,
							buttons: {
								ok: {
									label: "Ok",
									className: "customBtn btn-ext",
								}
							}
						});
					});
				}                                  
			},                          
			{ buffer: false, escape: false, timeout: 30000 }
		); 
	}
	$scope.loadData();	 
	j$('#addAttModal, #editAttModal').on('hidden.bs.modal', function (e) {
		$scope.loadData();		 	
	})	  
});     

customAttachmentsApp.factory('Scopes', function ($rootScope) {
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

