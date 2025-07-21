var phaseName = technicalSupportLinks_phaseNameObj;      
var setupCookiePresent = (j$.cookie('setup') == 'present');
var enModifyMetadata = technicalSupportLinks_enableModifyMetadata;
var phaseName = technicalSupportLinks_phaseNameObj;
if(enModifyMetadata == 'true' && setupCookiePresent == true) {
	var spanElement = document.createElement("span");
	//spanElement.setAttribute("class","fa fa-cog");
	spanElement.setAttribute("tabindex","0");
	spanElement.setAttribute("id","wrenchId");
	spanElement.setAttribute("style","left: 15px !important;");
	spanElement.setAttribute("title","Modify {{HeaderLabel}} Metadata");
	document.getElementById("extLinks"+technicalSupportLinks_phaseName).appendChild(spanElement);
}

var technicalSupportLinkApp = angular.module('TSLinkApp', ['ui.bootstrap']);
technicalSupportLinkApp.controller('AccordionCtrlTSLink', function($q, $scope, $timeout) {
	$scope.isopen = true; 
	$scope.techSupportLinksCollapsed = true;
	$scope.openLink = function(winURL,winNewWindow,$event){       
		if(winNewWindow == 'newWindow') {
			//console.log(' winURL '+winURL +' winNewWindow '+winNewWindow);
			if(event.button == 1){
				hideLoadingPopUp();
				window.open(winURL, 'NewWindow', '_blank' );  
		}
		}else   {
			window.open(winURL,'_self'); 
		}                          
	}  
	$scope.openSidebarConfigPage = function(){
		//console.log('$scope.phaseId ======',$scope.phaseId);
		window.open('/apex/'+technicalSupportLinks_nameSpacePre+'TechnicalSupportLinksView?flexTableName=Technical Support Links Config&phaseConfigLayoutId='+$scope.phaseId);
	}
	$scope.initExternalLinks = function(){                                           
		var deferred = $q.defer(); 
		Visualforce.remoting.Manager.invokeAction(
			_RemotingActionsTSLink.getLstExternalLink,
			phaseName, 
			function(result, event){                         
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(result);
						////console.log('Result',result); 
						if(result.ShowComponent){
							$scope.phaseId = result.PhaseId;
							$scope.setValues(result); 
							//document.getElementById('TSLinkApp').style.display = 'inline-block'; //UI-Shrawan-11022015  changed from block
						}
					});                                                                                                            
				}                                                                         
			}, 
			{ buffer: false, escape: false, timeout: 30000 }
		);  
		return deferred.promise;     
	};                                                        
	$scope.setValues= function(result) { 
		$scope.link = result.ExternalLinks;                    
		$scope.groups = [];   
		//console.log('$scope.groups',$scope.groups);
		i=0;  
		for(a in $scope.link) {       
			$scope.groups.push({"Name":$scope.link[a].Name,"Id":$scope.link[a].Id,"URL__c":$scope.link[a].URL__c,"OpenNewWindow__c":$scope.link[a].OpenNewWindow__c});			
			i++; 
		}
		$scope.groups.splice(i-1);
		//console.log('$scope.groups LENGTH',$scope.groups.length);
		$scope.techSupportLinksCollapsed = result.TechnicalSupportLinksCollapsed;
		$scope.HeaderLabel = result.TechnicalSupportLinksHeaderLabel;
		$scope.lightTabColor = '#FFFFFF';
	};  
	
	$scope.updateTechnicalSupportLinkCollapsed = function(flag){
		var deferred = $q.defer();
		if(flag){   /* 11102015-UI-Shrawan Added for new UI */
			expandSideBar(expandedSidebarIconsCallback);  
		}
		Visualforce.remoting.Manager.invokeAction(
			_RemotingActionsTSLink.updateTechnicalSupportLinkCollapsed,
			$scope.techSupportLinksCollapsed, 
			function(result, event) {                         
				if (event.status) {
					$scope.$apply(function() {
						deferred.resolve(result);
					});                                                                                                            
				}
				adjustToggleBarHeightUI();  //UI-Shrawan-11092015
			}, 
			{ buffer: false, escape: false, timeout: 30000 }
		);  
		return deferred.promise; 
	};   
	$scope.initExternalLinks();
});  

technicalSupportLinkApp.directive('ngEnter', function () {//removing unused code after discussion with aniket
	});