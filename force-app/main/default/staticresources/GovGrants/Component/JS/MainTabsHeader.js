var mainTabsHeaderApp = angular.module('MainTabsHeaderApp', []);

j$(document).ready(function() { 
	if(j$('body').hasClass("isCollapsed")) {
		     j$('.footer').addClass("footerToggled");
		    } else {
		    	j$('.footer').removeClass("footerToggled");
		    }
	j$('#menu-toggle-2').on('click', function(){
		if (j$('#sidebar-wrapper').length > 0 ) {
		    if(j$('body').hasClass("isCollapsed")) {
		     j$('.footer').addClass("footerToggled");
		    } else {
		    	j$('.footer').removeClass("footerToggled");
		    }
		}
	});
});

// contact us sidebar toggle for desktop

j$(document).ready(function() {
	j$('#menu-toggle-2').on('click', function(){
		if(j$('body').hasClass("isCollapsed")) {
			j$('.wrapper').addClass("toggled-2");
		} else {
			j$('.wrapper').removeClass("toggled-2");
	 	}
	 });
});

// contact us sidebar toggle  for android

 j$(document).ready(function() {
	j$('#menu-toggle').on('click', function(){
		if(j$('body').hasClass("isCollapsed")) {
			j$('.wrapper').addClass("toggled");
			} else {
			j$('.wrapper').removeClass("toggled");
			}
		});
});


mainTabsHeaderApp.controller('MainTabsHeaderCtrl', ['$scope', '$sce', '$window', function($scope, $sce, $window){

	$scope.isSite = true;
	$scope.deptLogoURL = '';
	$scope.homepageURL = '';
	$scope.avatarImgURL = '';
	$scope.headerImageURL = '';
	$scope.rightHeaderLogo = '';
	$scope.headerImageCollapsedURL = '';
	$scope.currentAppLogoURL = '';
	$scope.activeAppLabel = '';
	$scope.activeAppName = '';
	$scope.phaseList = [];
	$scope.profileDropdownList = [];
	$scope.appDropdownList = [];
	$scope.logoUrl = '';
	$scope.siteLogoURL = '';
	$scope.sidebarCollapsed = false;
	$scope.activePhaseName = '';

	function checkSetupCookie() {
		return j$.cookie('setup') == 'present';
	}

	$scope.setupEnabled = checkSetupCookie();

	$scope.redirectToSetup = function(phase){
		var pageName = pckgnamespace + 'NativePageRedirectionHandler'
		$window.open("/apex/"+pageName+"?uid="+ phase.sourceRecordId +'&sobject=PhaseConfig__c');
	}

	$scope.navigatePhase = function(phase){
		showLoadingPopUp();
		/*var currentTabName = phase.name
		var currentTabURL = phase.url.split('apex')[1];
		var currentAppNameCookieVal = j$.cookie('apex__current_AppName');
		j$.cookie('apex__' + currentAppNameCookieVal.replace(/\s/g, ""), currentTabURL + ':' + currentTabName, {path: '/'});*/
		window.location = phase.url;
	};

	$scope.toggleSidebar = function() {
		$scope.sidebar = !$scope.sidebar;
		if($scope.sidebar) {
			j$('body').addClass('isCollapsed'); //remove jquery later after sidebar implementation				
		} else {
			j$('body').removeClass('isCollapsed');//remove jquery later after sidebar implementation				
		}
		updateUserPreference($scope.sidebar);
		if (!$scope.$$phase) $scope.$apply();
	};

	var updateUserPreference = function(sidebar){
        Visualforce.remoting.Manager.invokeAction(                
        _RemotingMainTabsActions.updateUserPreference,
        sidebar,
        function(result, event){
        	if(event.status){
        		
       		 }
        }, 
            {escape:false, buffer:false}
        );
    };

	$scope.getProfileItemIcons = function(name) {
		if((angular.isUndefined(name)) || (name == null) || (name == '')) return '';
		if (name.toLowerCase() == 'logout') {
			return 'fa fa-unlock-alt unlockIcon';
		} else if (name.toLowerCase() == 'myprofile') {
			return 'fa fa-user userIcon';
		} else if (name.toLowerCase() == 'settings') {
			return 'fa fa-cog';
		}
	};

	$scope.saveCurrentAppName = function(app) {
		showLoadingPopUp();
		Visualforce.remoting.Manager.invokeAction(                
			_RemotingMainTabsActions.saveCurrentAppName, app.name,
			function(result, event){
				if(event.status){
					j$.cookie('apex__current_AppName',result, {path: '/'});
					window.location = app.url;
				}    
			}, 
			{escape:false, buffer:false}
		);
	};

	var paramMap = {};
	paramMap["currentRecordId"] = currentRecordId;
	paramMap["urlTabName"] = urlTabName;

	Visualforce.remoting.Manager.invokeAction(                
		_RemotingMainTabsActions.fetchHeaderAndTabsData, paramMap,
		function(result, event){
			if(event.status){
				$scope.logoUrl = result["logoUrl"];
				$scope.isSite = result["isSite"];
				$scope.homepageURL = result["homePageURL"];
				$scope.avatarImgURL = result["renderDefaultAvatar"] ? defaultAvatarImgURL : result["chatterAvatarImgURL"];
				$scope.headerImageURL = result["govGrantHeaderImageURL"];
				$scope.rightHeaderLogo = result["rightHeaderLogo"];
				$scope.headerImageCollapsedURL = result["govGrantHeaderCollapseImageURL"];
				$scope.siteLogoURL = $scope.headerImageURL;
				$scope.currentAppLogoURL = result["currentAppLogoURL"];
				$scope.activeAppLabel = result["currentAppLabel"];
				$scope.activeAppName = result["currentAppName"];
				$scope.phaseList = result["phaseList"];
				$scope.profileDropdownList = result["profileDropdownList"];
				$scope.appDropdownList = result["appDropdownList"];
				$scope.activePhaseName = result["activeTabName"];
				$scope.sidebar = result["sidebar"];

				if($scope.sidebar) {
					j$('body').addClass('isCollapsed'); //remove jquery later after sidebar implementation					
					j$('#wrapper').addClass('toggled-2');
					j$('.footer').addClass('footerToggled');

				} else {
					j$('body').removeClass('isCollapsed');//remove jquery later after sidebar implementation							
					j$('#wrapper').removeClass('toggled-2');
					j$('.footer').removeClass('footerToggled');
					
				}

				if(($scope.activePhaseName === '') || ($scope.activePhaseName === null) || (angular.isUndefined($scope.activePhaseName))) {
					$scope.activePhaseName = j$.cookie('apex__govgrants_tabname');
				} else {
					j$.cookie('apex__govgrants_tabname', $scope.activePhaseName);
				}
				
				j$.cookie('apex__current_AppName', $scope.activeAppName, {path: '/'})

				angular.forEach($scope.phaseList, function(phase, key) {
					phase.tabIconCSS = $sce.trustAsHtml(phase.tabIconCSS);
				});
				
				$scope.$apply();
			} else if(event.type === 'exception') {
				console.error('Main Tabs Exception occured - fetchHeaderAndTabsData : ' + event.message);
			}    
		}, 
		{escape:false}
	);

	Visualforce.remoting.Manager.invokeAction(                
		_RemotingMainTabsActions.getDeptLogoAndLoggedInfo,
		function(result, event){
			if(event.status){

				$scope.deptLogoURL = result["departmentLogoURL"];

				$scope.$apply();
			} else if(event.type === 'exception') {
				console.error('Main Tabs Exception occured - getDeptLogoAndLoggedInfo: ' + event.message);
			}    
		}, 
		{escape:false}
	);

}]);

mainTabsHeaderApp.directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
            	element.removeClass('opacityZero');
            });
        }
    };
});

angular.bootstrap(document.getElementById("mainTabsId"),['MainTabsHeaderApp']);
