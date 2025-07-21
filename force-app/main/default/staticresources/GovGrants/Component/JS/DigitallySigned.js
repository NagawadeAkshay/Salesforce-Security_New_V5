var j$ = jQuery.noConflict(); 
var parentId = digitallySigned_parentObjectId;
var documentId;
digitalSignatureApp.controller('digitalSignatureCtrl',function($q, $scope, $window, Scopes) {
	Scopes.store('digitalSignatureCtrl', $scope);
	$scope.digiSigned_namespace = Scopes.get('MasterDigiSignAppCtrl').digitallySigned_namespace;
	$scope.digiSigned_pbId = Scopes.get('MasterDigiSignAppCtrl').digitallySigned_pbId;
	$scope.digiSigned_parentObjectId = Scopes.get('MasterDigiSignAppCtrl').digitallySigned_parentObjectId;
	$scope.digiSigned_pageblockId = Scopes.get('MasterDigiSignAppCtrl').digitallySigned_pageblockId;
	$scope.digiSigned_attachmentClassification = Scopes.get('MasterDigiSignAppCtrl').digitallySigned_attachmentClassification;
	$scope.digiSigned_DeleteConfirmLabel = Scopes.get('MasterDigiSignAppCtrl').digitallySigned_DeleteConfirmLabel;
	$scope.digitallySigned_isView = Scopes.get('MasterDigiSignAppCtrl').digitallySigned_isView;
	$scope.digitallySigned_isDigiSign = Scopes.get('MasterDigiSignAppCtrl').digitallySigned_isDigiSign;
	$scope.digitallySigned_DeleteConfirmLabel = Scopes.get('MasterDigiSignAppCtrl').digitallySigned_DeleteConfirmLabel;
	$scope.digiSigned_DeleteConfirmLabel = Scopes.get('MasterDigiSignAppCtrl').digitallySigned_alertHeaderLabel;
	$scope.digiSigned_timeOffset = Scopes.get('MasterDigiSignAppCtrl').digitallySigned_timeOffset;
	$scope.isDigiLoading = false;
	$scope.noRecords = false;
	$scope.hideAction = {};	
	$scope.apiKey = Scopes.get('MasterDigiSignAppCtrl').digitallySigned_apikey;
	$scope.apisign = Scopes.get('MasterDigiSignAppCtrl').digitallySigned_apiSign;
	$scope.HideDisableRowActions;
	//console.log('$scope.digiSigned_pbId===>>>',$scope.digiSigned_pbId);
	$scope.setLoading = function(loading){            
		$scope.isDigiLoading = loading;
	};
	$scope.getDateTime = function(value){
		var time = undefined;
		if(value != undefined){
			return $scope.toUTCDate(new Date(value+$scope.digiSigned_timeOffset));
		}
		return time;
	};

	$scope.toUTCDate = function(date){
		var _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
		return _utc;
	};
		
	$scope.loadData = function(){
		$scope.getDocuments(true);   
		//console.log('load data callled!');
	} 
	$scope.getDocuments = function(loadConfigData){
		//console.log('get Document get called!');
		var i=0;                 
		Visualforce.remoting.Manager.invokeAction(
			_RemotingDigiSignActions.fetchDocuments,
			$scope.digiSigned_parentObjectId,$scope.digiSigned_pbId,$scope.digitallySigned_isView,loadConfigData,$scope.digitallySigned_isDigiSign,
			function(result,event){ 
				$scope.fileList = [];
				if(event.status){ 
					if(loadConfigData){
						$scope.HideDisableRowActions = result.HideDisableRowActions;
						//console.log('result.ActionConfig---',result.ActionConfig);
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
					for (var item in event.result.DocumentList){                                                                 
						$scope.fileList.push( event.result.DocumentList[item]);                                 
}    
					if($scope.fileList != undefined && $scope.fileList.length == 0){
						$scope.noRecords = true;
					}else{
						$scope.noRecords = false;
}
				}else{
}
				$scope.$apply(function(){
					$scope.setLoading(false);
				});                            
			},                         
			{escape:true}
		);  
	};
	$scope.loadData();

	$scope.showSendForSign = function(attId) {
		//console.log('called showSendForSign and attId is :',attId);
		documentId = attId;
		j$('#sendModalDiv'+$scope.digiSigned_pbId).modal();
		j$('#iframeSendDigSign'+$scope.digiSigned_pbId).attr('src','/apex/'+'SendForSignature?documentId=' +documentId+'&pageBlockId='+$scope.digiSigned_pageblockId+'&parentId='+escape(parentId));
	};
	$scope.viewDocumentInfo = function(docId) {
		//console.log('viewDocumentInfo called and docId is: ',docId);
		j$('#viewDocument'+$scope.digiSigned_pbId).modal(); 
		j$('#iframeViewDocument'+$scope.digiSigned_pbId).attr('src','/apex/'+'DocumentView?digitalSignId=' +docId);  	
	};
	$scope.addDocument = function(){
		j$('#myModalAttDigSign').modal();
		j$('#iframeAddContentIdDigSign'+$scope.digiSigned_pbId).attr('src','/apex/AttachmentAdd?parentId='+ $scope.digiSigned_parentObjectId +'&pBlockId='+ $scope.digiSigned_pageblockId +'&classification='+ $scope.digiSigned_attachmentClassification+'&document=true&isDigiSign=true'); 		
	};
	$scope.showEditPopupDigSign = function(attId, classification) {		
		j$('#editModalDivTestDigSign'+$scope.digiSigned_pbId).modal();        
		j$('#iframeEditContentIdDigSign'+$scope.digiSigned_pbId).attr('src','/apex/'+'AttachmentEdit?parentId='+ $scope.digiSigned_parentObjectId +'&attachmentId='+ attId +'&classification='+ $scope.digiSigned_attachmentClassification);
	};
	$scope.cancelSign = function(docId) {		
	Visualforce.remoting.Manager.invokeAction(
			_RemotingDigiSignActions.cancelSignature,$scope.apiKey,$scope.apisign,docId,                                  
				  function(result,event){                          
					  if(event.status){									
					  //console.log('cancel signature success',event); 
					  }else{									
					  //console.log('result------->>>>',result);
					  }                                                      
			  },                         
		  {escape:true}
		  );
}
	$scope.deleteDocument = function(docId){		 
		Visualforce.remoting.Manager.invokeAction(
				_RemotingDigiSignActions.deleteDocument,
			docId,
			function(deleteResult, event){
				if(event.status){ 
					$scope.$apply(function () {                         
						var deleteMessage;
						if(deleteResult.Success){
							deleteMessage = deleteResult.Message;;
							$scope.getDocuments(false);                                                
						}else{
							var result = deleteResult.Message;
							var deleteMessageArray = result.split(':');
							var deleteMessage = deleteMessageArray[2];
							var deleteErrorMessageArray = deleteMessage.split(',');
							deleteMessage = deleteErrorMessageArray[1];                             
						}
						hideLoadingPopUp();                         
						var titleMessage = $scope.digiSigned_DeleteConfirmLabel;
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
	};

	$scope.confirmAndDelete = function(attId){
		var deleteMessage = $scope.digitallySigned_DeleteConfirmLabel;
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
							$scope.deleteDocument(attId);
						} 
					}
				},
			}
		});         
	};
}); 
digitalSignatureApp.factory('Scopes', function ($rootScope) {
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