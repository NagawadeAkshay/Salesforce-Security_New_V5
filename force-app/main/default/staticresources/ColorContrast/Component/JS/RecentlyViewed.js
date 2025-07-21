var phaseName =recentlyViewed_phaseNameObj;       
var recentlyViewedApp = angular.module('RecentlyViewedApp', ['ui.bootstrap']); 
recentlyViewedApp.controller('AccordionCtrlRecent', function($q, $scope, $timeout) {
   $scope.isopen = true;
   $scope.recentlyViewedCollapsed = true;
   $scope.openLink = function(winURL){ 
	  window.open('/'+winURL,'_self'); 
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
		h =  h.match(new RegExp('(.{'+h.length/3+'})', 'g'));			   
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
});

recentlyViewedApp.directive('ngEnter', function () {
	   return function (scope, element, attrs) {
		   
		   element.on("keydown keypress", function (event) {	   
			   if(event.which === 13 || event.keyCode == 13) {
				   scope.$apply(function (){
					   scope.$eval(attrs.ngEnter);
				   });			  
				   event.preventDefault();
			   }
		   });
	   };
	});
angular.bootstrap(document.getElementById("RecentlyViewedApp"),['RecentlyViewedApp']); 