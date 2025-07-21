angular.module('ui.autosuggest', [])
		
.controller('AutoSuggestController', ['$scope', '$attrs', '$timeout','$window', function($scope, $attrs, $timeout,$compile,$window) {
	$scope.$watch(
		"extendedFilterCriteria",
		function handleWatchValueChange( newValue, oldValue ) {                            
			console.log('newValue----->>>',newValue); 
			console.log('extendedFilterCriteria----->>>',$scope.extendedFilterCriteria);                                   
		}
	);                             
}])
  
.directive('autosuggest', function($compile,$parse) {
	return {
		restrict: 'EA',
		controller: 'AutoSuggestController',                
		scope: {                    
			objectName : '@',
			searchFieldApiName :'@',
			extendedFilterCriteria : '=',
			callBackHandler : '&' ,
			options :'=',
			methodController :'='                              
		},
		link: function(scope, element, attr){ 
			var invokeServerCall = true;
			console.log('element----->>>',element);
			console.log('scope.options----->>>',scope.options);
			var ms = element.magicSuggest(scope.options); 
			scope.intController = scope.methodController || {};
			scope.intController.clear = function(){                        
				console.log('ms----->>>',ms);     
				ms.clear();
			} 
			scope.intController.setValue = function(values){                        
				console.log('values----->>>',values);     
				ms.setValue(values);
			} 
			scope.intController.setData = function(values){                        
				console.log('values-array---->>>',values);     
				ms.setData(values);
				invokeServerCall = false; 
			} 
			scope.intController.enable = function(values){                        
				ms.enable();
			}                 
			$(ms).on("keyup",function(e,m,v){
				//e.preventDefault();
				var paramMap ={};
				console.log('this----->>>',this);                        
				paramMap.SearchCriteria = this.input[0].value;
				if(paramMap.SearchCriteria.length < 2){  
					return;
				}  
				if(invokeServerCall){                        
					paramMap.ObjectName = scope.objectName;
					paramMap.FieldApiName = scope.searchFieldApiName ;
					paramMap.ExtendedFilterCriteria = scope.extendedFilterCriteria ;
					paramMap.MagicSuggest = true;
					console.log('paramMap----->>>',paramMap); 
					var paramMapString = JSON.stringify(paramMap);                       
					Visualforce.remoting.Manager.invokeAction(
						_RemotingAutoSuggestActions.GetAutoSuggestData,paramMapString,
						function(autoSuggestData,event){
							if(event.status){
								scope.$apply(function(){                                        
									console.log('autoSuggestData----->>>',autoSuggestData);
									suggestions = autoSuggestData.SuggestionList;
									$(ms)[0].setData(suggestions);  
									if(suggestions.length == 0){
										invokeServerCall = false;
									}   
									console.log('invokeServerCall ----->>>',invokeServerCall );                                                                                                                                                               
								});
							}
						},
						{buffer:true,escape:false}
					);  
				}                                                                      
			});  
			$(ms).on('selectionchange', function(){
				invokeServerCall = true;
				console.log('invokeServerCall ----->>>',invokeServerCall );
				var selected  = this.getSelection();
				console.log('selected----->>>',selected);
				if(selected.length > 0){
					scope.selectedIds = [];
					for(var i=0; i<selected.length; i++){
						scope.selectedIds.push(selected[i]);
					}  
					console.log('scope.selectedIds----->>>',scope.selectedIds); 
					scope.callBackHandler({selectedIds :scope.selectedIds});
					console.log('scope.dvfdsf----->>>'); 
				}
			});                                                          
		}
	};
});        