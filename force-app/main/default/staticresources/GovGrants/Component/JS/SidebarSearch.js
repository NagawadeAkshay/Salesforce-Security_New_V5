j$ = jQuery.noConflict();
var setupCookie = (j$.cookie('setup') == 'present');
var eModifyMetadata = sidebarSearch_enableModifyMetadata;    
if(eModifyMetadata == 'true' && setupCookie == true) {
	var sElement = document.createElement("span");
	sElement.setAttribute("class","fa fa-cog");
	sElement.setAttribute("tabindex","0");
	sElement.setAttribute("id","wrenchId");
	//sElement.setAttribute("style","left: 15px !important;");
	sElement.setAttribute("title","Modify {{SearchLabel}} Metadata");
	sElement.setAttribute("ng-click","SidebarCollapsed = !SidebarCollapsed; openSidebarConfigPage();");
	document.getElementById("search"+sidebarSearch_phaseName).appendChild(sElement);
}
var phaseName = sidebarSearch_phaseNameVal;

var searchApp = angular.module('SearchApp', ['ui.bootstrap']);
searchApp.controller('SearchAppCtrl', function ($q,$scope,$timeout) {
	$scope.SidebarCollapsed = true;
	$scope.typeAheadSelect = false;
	$scope.searchTerm = searchText;
	$scope.search = function(){		
	
		if($scope.typeAheadSelect==true){
			window.open('/'+$scope.searchId,'_self');
		}
		
		else if($scope.searchTerm != undefined &&  $scope.searchTerm.replace(/[^A-Z0-9]/gi, "").length > 1){
			showLoadingPopUp();
			var searchT = $scope.searchTerm.replace(/[^A-Z0-9\s]/gi, "");
			//var searchT = $scope.searchTerm.replace(/[^A-Z0-9]/gi, "");
			window.open($scope.SearchResultPage+'&searchText='+searchT+'&searchObject='+$scope.default.FilterId,'_self');
		}else{
			alert(twoCharMsg);
			
			/*j$('#popoverId').popover({
				animation: true,
				content: 'Please enter atleast 2 characters to search.',
				html: true
			});
			$timeout(function() {
				j$('#popoverId').popover('destroy')
			}, 1000);*/
		}   
	};
   
  
	$scope.openSidebarConfigPage = function(){		
		window.open('/apex/'+sidebarSearch_nsPrefix+'ConfigureSearchSidebar?id='+$scope.phaseId);
		//window.open('/apex/FlexTableView?flexTableName=Configure Sidebar Search&phaseConfigName={!phaseName}&sidebarSearch=true&id='+$scope.phaseId);
	};
   
	$scope.initSidebarSearch = function(){                                    
		var deferred = $q.defer(); 
		Visualforce.remoting.Manager.invokeAction(
			_RemotingSearchActions.fetchSearchInitialData, 
			phaseName,
			function(sideBarSearchResult, event){                         
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(sideBarSearchResult); 
						if(sideBarSearchResult.ShowComponent==true){							
							$scope.phaseId = sideBarSearchResult.PhaseId;
							$scope.setValues(sideBarSearchResult);
							document.getElementById('SearchApp').style.display = 'block';
							$scope.phaseName = phaseName;
						}                                                  
					});                                                                                                            
				}                                                                         
			}, 
			{ buffer: false, escape: false, timeout: 30000 }
		); 
		return deferred.promise;     
	};   
	$scope.initSidebarSearch();  
	$scope.setValues = function(sideBarSearchResult){
		var ListViewOptionsData = new Array();
		var count = 0;
		$scope.allObjects;
		var defaultCount = 0;
		$scope.ListViewOptions = sideBarSearchResult.SobjectData; 
		$scope.sobjectList = sideBarSearchResult.SobjectData;
		var isObjeSelected = false;
		for(l in $scope.ListViewOptions) {
			var filteObj = {"FilterId": l, "Name": $scope.ListViewOptions[l]};
			ListViewOptionsData.push(filteObj);
			if(l == searchObject) {
				$scope.default = filteObj;
				isObjeSelected = true;
			}
			if($scope.allObjects == undefined){
				$scope.allObjects  = l;
			}else{
				$scope.allObjects += ','+l;
			}    
		}	   	  
		$scope.listViewOptions = new Array();	  
		$scope.listViewOptions = ListViewOptionsData.sort(); 
		$scope.listViewOptions.splice(0,0,{"FilterId": $scope.allObjects , "Name": "All"});
		if(isObjeSelected == false) {
			$scope.default = $scope.listViewOptions[0]; 	   
		}
		$scope.isTypeAhead = sideBarSearchResult.isTypeAhead;
		$scope.SidebarCollapsed =  sideBarSearchResult.SidebarCollapsed;
		$scope.SearchResultPage = sideBarSearchResult.SearchResultPage;
		$scope.SearchLabel = sideBarSearchResult.SearchHeader;
		//document.getElementById('selectSearchId').style.display ='block';
		//document.getElementById('textBoxSearchId').style.display ='table';
		document.getElementById('selectSearchId').style.visibility ='visible';
		document.getElementById('textBoxSearchId').style.visibility ='visible';
	}
   
	$scope.openViewPage= function(sideBarSearchResult){
		$scope.typeAheadSelect = true;
		$scope.searchId = sideBarSearchResult.Id;
	}
   
	$scope.updateSidebarCollapsed= function(flag){                                    
	   var deferred = $q.defer(); 
	   if(flag){   /* 10212015-UI-Shrawan Added for new UI */
		   expandSideBar(expandedSidebarIconsCallback);  
	   }
	   Visualforce.remoting.Manager.invokeAction(
		   _RemotingSearchActions.updateSidebarCollapsed, 
		   $scope.SidebarCollapsed,
		   function(sideBarSearchResult, event){                         
			   if (event.status) {
				   $scope.$apply(function () {
					   ////console.log('$scope.SidebarCollapsed',$scope.SidebarCollapsed);
					   deferred.resolve(sideBarSearchResult);					                  
				   });                                                                                                            
			   }
			   adjustToggleBarHeightUI();
		   }, 
		   { buffer: false, escape: false, timeout: 30000 }
	   ); 
	   return deferred.promise;     
	};
   
	$scope.items = function(searchTerm,inputVal) {                                
	   var deferred = $q.defer();  
	   Visualforce.remoting.Manager.invokeAction(
		   _RemotingSearchActions.GetTypeAheadRecords,
		   searchTerm,$scope.default.FilterId,
		   function(sideBarSearchResult, event){                         
			   if (event.status) {
				   $scope.$apply(function () {                                                                                              
					   deferred.resolve(sideBarSearchResult.Records);  					  
				   });                                                                                                             
			   }                                                                         
		   }, 
		   { buffer: false, escape: false, timeout: 30000 }
	   );
	   return deferred.promise;                                           
	};   
	$scope.LightenColor = function(hex, opacity){
	   var h=hex.replace('#', '');
	   h =  h.match(new RegExp('(.{'+h.length/3+'})', 'g')); //False +ve for non literal regex used for sanitization, as we are not using for sanitization purpose
	   for(var i=0; i<h.length; i++)
	   h[i] = parseInt(h[i].length==1? h[i]+h[i]:h[i], 16);	   
	   if (typeof opacity != 'undefined')  h.push(opacity);	   
	   return 'rgba('+h.join(',')+')';
	}                                            
});

searchApp.directive('bindHtmlUnsafe', function( $compile ) {
   return function( $scope, $element, $attrs ) {   
	   var compile = function( newHTML ) { // Create re-useable compile function
		   newHTML = $compile(newHTML)($scope); // Compile html
		   $element.html('').append(newHTML); // Clear and append it
	   };	   
	   var htmlName = $attrs.bindHtmlUnsafe; // Get the name of the variable 
									 // Where the HTML is stored	   
	   $scope.$watch(htmlName, function( newHTML ) { // Watch for changes to                                                       // the HTML
		   if(!newHTML) return;
		   compile(newHTML);   // Compile it
	   });   
   };
});
searchApp.directive('ngEnter', function () {
   return function (scope, element, attrs) {
	   element.on("keydown keypress", function (event) {
		//	Commenting out $eval function for security review if in future it does not work then we will check out for the replacement of $eval function.	   
		//    if(event.which === 13) {
		// 	   scope.$apply(function (){
		// 		   scope.$eval(attrs.ngEnter);
		// 	   });			  
		// 	   event.preventDefault();
		//    }
	   });
   };
});
angular.bootstrap(document.getElementById("SearchApp"),['SearchApp']);