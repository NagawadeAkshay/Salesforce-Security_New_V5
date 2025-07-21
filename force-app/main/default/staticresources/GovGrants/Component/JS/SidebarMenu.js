var j$ = jQuery.noConflict();      
var setupCookiePresent = (j$.cookie('setup') == 'present');
var enModifyMetadata =  sidebarMenu_enableModifyMetadata;
var shwWrench = sidebarMenu_showWrench;
var phaseName = sidebarMenu_tabId;
var paramMap = sidebarMenu_parameterMap;
var type = sidebarMenu_type;
var userId = sidebarMenu_UserId;
var keyName = 'apex__'+userId+phaseName;
var cntr = 0;
if(shwWrench == 'true' && setupCookiePresent == true) {
	//alert('TRUE----------------------------------------------------------');
	//alert(cntr+' '+'hi');
	/*--code commented because it doesnt work--*/
	/*
	var spanElement = document.createElement("span");
	spanElement.setAttribute("class","fa fa-cog");
	spanElement.setAttribute("ng-click","openSidebarMenuBuilder();");
	document.getElementById("cogClass").appendChild(spanElement);
	*/
}

var sideBarMenuApp = angular.module('SideBarMenuApp'+sidebarMenu_type, ['ui.bootstrap']);
sideBarMenuApp.controller('SideBarMenuAppCtrl', function ($q,$scope,$timeout, $sce) {
	$scope.isopen = true;
	$scope.key = 'apex__'+sidebarMenu_UserId+sidebarMenu_phaseName;	
	$scope.collapsedArray = [];
	$scope.expandedArray = [];
	$scope.accordionCollapsed = false;
	$scope.showWrenchIcon = false;
	// UI-Shrawan-10012015
	$scope.IconType = function(){
		if(sidebarMenu_type == 'Activity'){
			return $scope.trustSrc('<i class="fa fa-flag"> </i>');
		}
		else if(sidebarMenu_type == 'Task'){
			return $scope.trustSrc('<i class="fa fa-tasks"> </i>');
		}
		if(sidebarMenu_type == 'BI&Analytics'){			
			return $scope.trustSrc('<i class="fa fa-bar-chart"> </i>');
		}
	}
	$scope.trustSrc = function(src) {
		return $sce.trustAsHtml(src);
	}
	$scope.openLink = function(winURL,winNewWindow,id,Name,event){
		showLoadingPopUp();
		$scope.key = 'apex__'+sidebarMenu_UserId+sidebarMenu_phaseName;		
		j$.removeCookie( $scope.key );
		$scope.lastVal = id;
		// $cookieStore.put($scope.key,$scope.lastVal);
		j$.cookie('apex__'+sidebarMenu_UserId+sidebarMenu_phaseName, id, { expires: null ,path : '/' });
		if(winNewWindow==true){
			window.open(winURL,'_blank');
		}else{
			window.open(winURL,'_self');
		} 		
	}
	$scope.openSidebarConfigPage = function(idVal){
		window.open('/' + idVal);
	}
	$scope.openSidebarMenuBuilder = function(){
		window.open('/apex/sidebarMenuBuilder?id=' + $scope.phaseId);
	}
	$scope.populateArrayData = function(idVal,expanded){
		if(expanded == true){
			index = $scope.expandedArray.indexOf(idVal);
			$scope.expandedArray.splice(index,1);
			$scope.collapsedArray.push(idVal);
		}else{
			index = $scope.collapsedArray.indexOf(idVal);
			$scope.collapsedArray.splice(index,1);
			$scope.expandedArray.push(idVal);
		}
		$scope.updateUserPreference(true);
	}

	$scope.initSideBarMenu = function(){                                    
		var deferred = $q.defer(); 
		Visualforce.remoting.Manager.invokeAction(
			_RemotingSidebarMenuActions.fetchAccordionData, 
			phaseName,paramMap,type,
			function(sideBarMenuResult, event){                         
				if (event.status) {
					$scope.$apply(function () { 
						deferred.resolve(sideBarMenuResult); 						
						if(sideBarMenuResult.ShowComponent){							
							$scope.key = 'apex__'+sidebarMenu_UserId+sidebarMenu_tabId;							
							$scope.lastVal = j$.cookie('apex__'+sidebarMenu_UserId+sidebarMenu_tabId);
							$scope.setValues(sideBarMenuResult);
							document.getElementById('SideBarMenuApp'+sidebarMenu_type).style.display = 'inline-block'; //UI-Shrawan-11022015  changed from block
						}                                                                                                         
					});                                                                                                            
				}                                                                         
			}, 
			{escape: false}
		); 
		return deferred.promise;     
	};
	$scope.showSidebarComponent = function(){
		var deferred = $q.defer(); 
		Visualforce.remoting.Manager.invokeAction(
			_RemotingActionsAccordion.showSidebarComponent, 
			phaseName,
			function(showSidebar, event){                         
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(showSidebar); 
						if(showSidebar){
							 $scope.initSideBarMenu();
							 document.getElementById('SideBarMenuApp').style.display = 'block';
						}                                                                                                     
					});                                                                                                            
				}                                                                         
			}, 
			{ buffer: false, escape: false, timeout: 30000 }
		); 
		return deferred.promise;   
	}

	$scope.updateUserPreference= function(flag){ 
		var bodyDivId;
		var deferred = $q.defer(); 
		if(flag){   /* 10212015-UI-Shrawan Added for new UI */
			expandSideBar(expandedSidebarIconsCallback);  
		}
		Visualforce.remoting.Manager.invokeAction(
			_RemotingSidebarMenuActions.updateUserPreference, 
			$scope.accordionCollapsed,$scope.expandedArray,$scope.collapsedArray,
			function(sideBarMenuResult, event){                         
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(sideBarMenuResult);                                                                                                   
					});                                                                                                            
				}  
				adjustToggleBarHeightUI();   
			}, 
			{escape: false}
		); 
		return deferred.promise;     
	}; 

	$scope.setValues= function(sideBarMenuResult){
		$scope.headerName = sideBarMenuResult.HeaderName;
		$scope.tabColor = "#"+sideBarMenuResult.HeaderColor;
		//console.log('Sidebar Menu==',sideBarMenuResult);   
		$scope.accordionCollapsed= sideBarMenuResult.UserPreference.accordionCollapsed;
		$scope.showWrenchIcon = sideBarMenuResult.UserPreference.showWrenchIcon;
		$scope.phaseId = sideBarMenuResult.PhaseId;
		if(sideBarMenuResult.UserPreference == ''){
			$scope.groups = sideBarMenuResult.AccordionData.GroupMap;
			for(group in $scope.groups){
				$scope.expandedArray.push($scope.groups[group].fields.Id)
			}
		}
		else{
			$scope.groups = sideBarMenuResult.AccordionData.GroupMap;
			$scope.collapsedArray = sideBarMenuResult.UserPreference.collapsedHeaders;
			if($scope.collapsedArray==''){
				$scope.collapsedArray = [];    
			}
			$scope.expandedArray = sideBarMenuResult.UserPreference.expandedHeaders;
			if($scope.expandedArray ==''){
				$scope.expandedArray = [];    
			}
			for(group in $scope.groups){
				if($scope.collapsedArray.indexOf($scope.groups[group].fields.Id)!=-1){
					$scope.groups[group].expanded = false;
				}else if($scope.expandedArray.indexOf($scope.groups[group].fields.Id)!=-1){
					$scope.groups[group].expanded = true;
				}
			}
		}
		$scope.key = 'apex__'+sidebarMenu_UserId+sidebarMenu_tabId;		
		$scope.lastVal = j$.cookie('apex__'+sidebarMenu_UserId+sidebarMenu_tabId);
	}; 
	$scope.initSideBarMenu();  
});
sideBarMenuApp.filter('orderObjectBy', function() {
	return function(items, field, reverse) {
		var filtered = [];
		angular.forEach(items, function(item) {
			filtered.push(item);
		});
		filtered.sort(function (a, b) {
			return (a[field] > b[field]) ? 1 : ((a[field] < b[field]) ? -1 : 0);
		});
		if(reverse) filtered.reverse();
			return filtered;
	};
});

sideBarMenuApp.directive('ngRightClick', function($parse) {
	return function(scope, element, attrs) {
		var fn = $parse(attrs.ngRightClick);
		element.bind('contextmenu', function(event) {
			scope.$apply(function() {
				event.preventDefault();
				fn(scope, {$event:event});
			});
		});
	};
});
angular.bootstrap(document.getElementById("SideBarMenuApp{!type}"),['SideBarMenuApp{!type}']); 