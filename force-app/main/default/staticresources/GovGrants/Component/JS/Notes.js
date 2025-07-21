var j$ = jQuery.noConflict(); 
function closeNoteModal(){	
	//j$('#editModalDivForNotes').modal().hide();  
	j$('#newModalDivForNotes').modal('hide');          
	//j$('#iframeAddContentIdForNotes').attr('src','');            
	//j$('#iframeEditContentIdForNotes').attr('src','');
	refreshList();
} 
/*var delMsg;
delMsg = notes_delMsg;
function delNote(noteId){            		
	var deleteMessage = notes_DeleteConfirmLabel;
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
				deleteNote(noteId);			 
			} 
		  }
		},
	  }
	});         
};

function deleteNotes(msg){ 		
	var deleteMessage;	
	deleteMessage = msg;	
	hideLoadingPopUp();                         
	var titleMessage = notes_AlertHeaderLabel;
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
}*/
customNotesApp.controller('customNotesAppCtrl',function($q, $scope, Scopes,$sce){
	Scopes.store('customNotesAppCtrl', $scope);

	$scope.fileList = [];     
	$scope.isLoading = false;
	$scope.noRecords = false;
	$scope.hideAction = {};
	$scope.HideDisableRowActions;
	$scope.ParentRecEditAccess;
	$scope.timeOffset = Scopes.get('mastercustomNotesAppCtrl').notes_timeOffset;
	$scope.notes_parentObjectId = Scopes.get('mastercustomNotesAppCtrl').notes_parentObjectId;
	$scope.notes_pageBlockId = Scopes.get('mastercustomNotesAppCtrl').notes_pageBlockId;
	$scope.notes_isView = Scopes.get('mastercustomNotesAppCtrl').notes_isView;
	$scope.notes_parentObject = Scopes.get('mastercustomNotesAppCtrl').notes_parentObject;
	$scope.notes_pbId = Scopes.get('mastercustomNotesAppCtrl').notes_pbId;
	$scope.notes_deleteConfirmLabel = Scopes.get('mastercustomNotesAppCtrl').notes_deleteConfirmLabel;
	$scope.notes_AlertHeaderLabel = Scopes.get('mastercustomNotesAppCtrl').notes_AlertHeaderLabel;
	$scope.setLoading = function(loading){            
			$scope.isLoading = loading;
		};
	$scope.loadData = function(){
		$scope.getNotes(true);    
	}  
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
	                                         
	$scope.getNotes = function(loadConfigData){
		
		var i=0;                 
		Visualforce.remoting.Manager.invokeAction(
			_RemotingNotesActions.fetchNotes,
			$scope.notes_parentObjectId,$scope.notes_pageBlockId,$scope.notes_isView,
			function(result,event){ 
				//console.log('result--->',result);
				//console.log('event.status',event.status);
				$scope.fileList = [];
				if(event.status){
					$scope.notesLocaleDateTime = result.NotesLocaleDateTime;
					if(loadConfigData){ 
						$scope.HideDisableRowActions = result.HideDisableRowActions;
						$scope.ParentRecEditAccess = result.isParentRecEditAccess;
						for(var action in result.ActionConfig){
							if(action=='Edit'){
								$scope.hideAction['Edit'] = result.ActionConfig[action].hideAction;
								////console.log('Edit Action-->>', $scope.hideAction['Edit']);
							}else
							if(action=='Delete'){
								$scope.hideAction['Delete'] = result.ActionConfig[action].hideAction;   
								////console.log('Delete Action-->>', $scope.hideAction['Delete']) 
							}else
							if(action=='Create' ){
								$scope.hideAction['Create'] = result.ActionConfig[action].hideAction;
								////console.log('Create Action-->>', $scope.hideAction['Create'])
							}
						}			  
					}
					for (var item in event.result.NoteList){                                                                 
						$scope.fileList.push( event.result.NoteList[item]);                                 
					}    
					if($scope.fileList != undefined && $scope.fileList.length == 0){
						$scope.noRecords = true;
					}else{
						$scope.noRecords = false;
					}																					
				}else{
					//////console.log('result------->>>>',result); 
				}            
				$scope.$apply(function(){
					$scope.setLoading(false);
				});                            
			},                         
			{escape:true}
		);  

	};
	$scope.confirmAndDelete = function(noteId){
		////console.log('Entered confirmAndDelete function!');
		var deleteMessage = $scope.notes_deleteConfirmLabel;
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
							$scope.delNote(noteId);
						} 
					}
				},
			}
		});         
	};
	
	$scope.delNote = function(noteId){		 
		Visualforce.remoting.Manager.invokeAction(
			_RemotingNotesActions.DeleteRecord,
			noteId,
			function(deleteResult, event){
				//console.log('deleteResult------>',deleteResult);
				if(event.status){ 
					$scope.$apply(function () {                         
						var deleteMessage;
						if(deleteResult.Success){
							deleteMessage = deleteResult.Message;;
							$scope.getNotes(false);                                                
						}else{
							var result = deleteResult.Message;
							var deleteMessageArray = result.split(':');
							var deleteMessage = deleteMessageArray[2];
							var deleteErrorMessageArray = deleteMessage.split(',');
							deleteMessage = deleteErrorMessageArray[1];                             
						}
						hideLoadingPopUp();                         
						var titleMessage = $scope.notes_AlertHeaderLabel;
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
	;

	$scope.addNotes = function(){
		//console.log('In Add attachment--'); 
		j$('#addNoteModal'+$scope.notes_pbId).modal();
		$scope.frame = document.getElementById('iframeAddNoteContentId'+$scope.notes_pbId);
		j$('#iframeAddNoteContentId'+$scope.notes_pbId).height(100);
		
		if($scope.frame != null)
			$scope.frameDoc = $scope.frame.contentDocument || $scope.frame.contentWindow.document;
		if($scope.frameDoc != null)
			
			$scope.frameDoc.documentElement.textContent = "";
			
		lastFocus = document.activeElement;	
		j$('#iframeAddNoteContentId'+$scope.notes_pbId).attr('src','/apex/NoteAdd?parentId='+ escape($scope.notes_parentObject) +'&pBlockId='+ escape($scope.notes_pbId)); 		
		
	};
	$scope.editNote = function(noteId){	
	//console.log('noteId---->',noteId);	
		j$('#editNoteModal'+$scope.notes_pbId).modal(); 
		$scope.frame = document.getElementById('iframeEditNoteContentId'+$scope.notes_pbId);
		j$('#iframeEditNoteContentId'+$scope.notes_pbId).height(100);
		if($scope.frame != null)
			$scope.frameDoc = $scope.frame.contentDocument || $scope.frame.contentWindow.document;
		if($scope.frameDoc != null)
			$scope.frameDoc.documentElement.textContent = "";
		lastFocus = document.activeElement;	
		//console.log('$scope.frameDoc',$scope.frameDoc);		
		j$('#iframeEditNoteContentId'+$scope.notes_pbId).attr('src','/apex/NoteAdd?id='+ noteId); 
	};
	$scope.viewNote = function(noteId){	
	//console.log('noteId---->',noteId);	
		j$('#viewNoteModal'+$scope.notes_pbId).modal(); 
		$scope.frame = document.getElementById('iframeViewNoteContentId'+$scope.notes_pbId);
		j$('#iframeViewNoteContentId'+$scope.notes_pbId).height(100);
		if($scope.frame != null)
			$scope.frameDoc = $scope.frame.contentDocument || $scope.frame.contentWindow.document;
		if($scope.frameDoc != null)
			$scope.frameDoc.documentElement.textContent = "";
		lastFocus = document.activeElement;	
		//console.log('$scope.frameDoc',$scope.frameDoc);		
		j$('#iframeViewNoteContentId'+$scope.notes_pbId).attr('src','/apex/NoteViewPage?id='+ noteId); 
	};
	$scope.loadData(); 
	j$('#addNoteModal, #editNoteModal, #viewNoteModal').on('hidden.bs.modal', function (e) {
		$scope.loadData();		 	
	})


	
});     


		