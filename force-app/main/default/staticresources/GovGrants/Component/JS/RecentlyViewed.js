var phaseName =recentlyViewed_phaseNameObj;       
var recentlyViewedApp = angular.module('RecentlyViewedApp', ['ui.bootstrap']); 
recentlyViewedApp.controller('AccordionCtrlRecent', function($q, $scope, $timeout) {
   $scope.isopen = true;
   $scope.recentlyViewedCollapsed = true;
   $scope.openLink = function(winURL,$event){ 
   	// If middle mouse button is clicked the hiding the popup.   
	if(event.button == 1){
   	  	hideLoadingPopUp();
   	  	window.open('/'+winURL,'_blank');
   	  }	
   	  else{
   	  	window.open('/'+winURL,'_self'); 
   	  }	
	  
   }
  
   $scope.initRecentlyViewed = function(){                                                    
	   var deferred = $q.defer(); 
	   $scope.groups = [];   
	   Visualforce.remoting.Manager.invokeAction(
		   _RemotingActionsRecentlyViewed.getRecentlyViewedObjects,
		   phaseName, 
		   function(result, event) {                         
			   if (event.status) {
				   $scope.$apply(function() {
					   deferred.resolve(result); 					   
					   if(result.ShowComponent){
						   $scope.setValues(result); 
						   //document.getElementById('RecentlyViewedApp').style.display = 'inline-block';  //UI-Shrawan-11022015 changed from block
					   }                                                                        
				   });                                                                                                            
			   }
		   }, 
		   { buffer: false, escape: false, timeout: 30000 }
	   );  
	   return deferred.promise;     
   };
   					
   $scope.setValues= function(result) { 
	   $scope.groups = result.RecentViewedData;     	
	   $scope.headerLabel= result.HeaderLabel;   	
	   $scope.recentlyViewedCollapsed = result.RecentViewedCollapsed;	   
	   $scope.lightTabColor =  '#FFFFFF';
   };
   
   $scope.LightenColor = function(hex, opacity){
		var h=hex.replace('#', '');
		h =  h.match(new RegExp('(.{'+h.length/3+'})', 'g')); //False +ve for non literal regex used for sanitization, as we are not using for sanitization purpose		   
		for(var i=0; i<h.length; i++)
		h[i] = parseInt(h[i].length==1? h[i]+h[i]:h[i], 16);			   
		if (typeof opacity != 'undefined')  h.push(opacity);			   
		return 'rgba('+h.join(',')+')';
	};  
   
   $scope.updateRecentlyViewedCollapsed = function(flag){
	   var deferred = $q.defer();  
	   if(flag){   /* 10212015-UI-Shrawan Added for new UI */
		   expandSideBar(expandedSidebarIconsCallback);  
	   }
	   Visualforce.remoting.Manager.invokeAction(
		   _RemotingActionsRecentlyViewed.updateRecentlyViewedCollapsed,
		   $scope.recentlyViewedCollapsed, 
		   function(result, event) {                         
			   if (event.status) {
				   $scope.$apply(function() {
					   deferred.resolve(result);
						//$scope.recentlyViewedCollapsed = collapsed;
				   });                                                                                                            
			   }    
			   adjustToggleBarHeightUI();            
		   }, 
		   { buffer: false, escape: false, timeout: 30000 }
	   );  
	   return deferred.promise; 
	};                          
   $scope.initRecentlyViewed(); 

   $scope.showTooltip= function(thisVal,parentId){ 		
	if(parentId != null || parentId != undefined || parentId != ''){		
		j$('#'+thisVal).tooltipster({                    
			theme: 'tooltipster-shadow',
			content :'Loading...',
			updateAnimation:false,
			contentAsHTML:true, 
			interactive:true, 
			minWidth:100, 
			position:'right',   
						  
			functionBefore: function(origin, fetchLayout) {
				fetchLayout();
				Visualforce.remoting.Manager.invokeAction(
					_RemotingActionsRecentlyViewed.fetchMiniLayout, parentId,
					function(result, event){
						if (event.status) {							
							if(!jQuery.isEmptyObject(result)){
								tooltipContent =  '<div class="tooltipWrapper" >'; 
								tooltipContent = $scope.getMiniLayoutContent(result,origin);
								tooltipContent +='</div>';									
								origin.tooltipster('content', tooltipContent );									
							}else{									
								j$('#'+thisVal.id).tooltipster('hide');
							}
							
						}
				});
			}                   
		}); 
		j$('#'+thisVal).tooltipster('show');                
	}
}; 
			
$scope.getMiniLayoutContent = function(result,origin){
	var tooltip = tooltipContent;
	//console.log('RESULT',result);
	var tab = result.Tab;
	var record = result.Record;                           
	if(tab != null) {
	j$.each(result.Tab, function(i, tabVal) { 
	  j$.each(tabVal.pageBlocks, function(j, pageBlockVal) {  
		  tooltip +='<p class="tooltip-title">'+record ['Name']+'</p>';   
		  tooltip +='<div id="TooltipBody" class="panel-body">';
		  tooltip +='<form class="form-horizontal" role="form">'
		  j$.each(pageBlockVal.fields, function(k, field) {   
				if(field.hideField != 'true')   {                     
					tooltip += '<div class="form-group border-ext ">';
					tooltip += ' <div class="row">';                                   
						tooltip += ' <div class="col-md-4 col-xs-4 col-sm-4">';
						tooltip += field.fieldLabel;
						tooltip += '</div>';
				  
						var fieldVal =  j$('<span/>').html(encodeURI(record [field.fieldAPIName])).text(); 
						if(field.dataType == 'CURRENCY'){
							fieldVal = '$' + fieldVal;
						}
						//console.log('[-----',fieldVal );                                   
						tooltip += ' <div class="col-md-8 col-xs-8 col-sm-8" style="word-wrap:break-word; font-weight: bold;">';
						tooltip += decodeURI(fieldVal);     
						tooltip += '</div>';                                                                                     
					tooltip += '</div>';
					tooltip += '</div>';
					tooltip +='<br/>';
				}   
																	 
		  })
	  })
	})
	tooltip +='</form>';
	tooltip +='</div>';             
	}else {        				
		tooltip +='<p class="tooltip-title">'+record ['Name']+'</p>';
		tooltip +='<div id="TooltipBody" class="panel-body">';
		tooltip +='<form class="form-horizontal" role="form">';
		tooltip += '<div class="form-group border-ext ">';
		tooltip += ' <div class="row">';                                   
		tooltip += ' <div class="col-md-4 col-xs-4 col-sm-4">';
		tooltip += 'Name';
		tooltip += '</div>';				
		tooltip += ' <div class="col-md-8 col-xs-8 col-sm-8" style="word-wrap:break-word; font-weight: bold;">';
		tooltip += record ['Name'];     
		tooltip += '</div>';   
		tooltip += '</div>';
		tooltip += '</div>';
		tooltip +='</form>';
		tooltip += '</div>';
	}
	return tooltip;
};

$scope.hideTooltip= function(thisVal,parentId){ 
	 j$('#'+thisVal).tooltipster('hide'); 
}


});

recentlyViewedApp.directive('ngEnter', function () {
	   return function (scope, element, attrs) {
		   
		   element.on("keydown keypress", function (event) {	
			//	Commenting out $eval function for security review if in future it does not work then we will check out for the replacement of $eval function.   
			//    if(event.which === 13 || event.keyCode == 13) {
			// 	   scope.$apply(function (){
			// 		   scope.$eval(attrs.ngEnter);
			// 	   });			  
			// 	   event.preventDefault();
			//    }
		   });
	   };
	});
angular.bootstrap(document.getElementById("RecentlyViewedApp"),['RecentlyViewedApp']); 