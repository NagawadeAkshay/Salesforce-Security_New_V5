var j$ = jQuery.noConflict();
j$('#myCarousel').carousel({
	interval: 200000
});

var aid = manageUserExternalTheme_aid;
var internaltheme = manageUserExternalTheme_internaltheme;
var internalthemeselect = manageUserExternalTheme_internalthemeselect;
var externalthemeselect = manageUserExternalTheme_externalthemeselect;

var appVar = angular.module('CarouselDivId',['ui.bootstrap']);
appVar.controller('CarouselCtrl',function ($scope, $q) {	
	$scope.slides = [];
	$scope.selectedThemeName = '';
	$scope.accountId = null;
	$scope.isInternalTheme = false;	
	$scope.setSelectedTheme = function(){		
		saveThemeSelection($scope.selectedThemeName );
		/*angular.forEach($scope.slides, function(image) {
			if(image.active == true){
				//console.log('You have selected - ',image.name);
				saveThemeSelection(image.name);
			}
		});*/
	};
	
	if(aid != '' && aid != undefined && aid != null){
		$scope.accountId = aid;
	}
	if(internaltheme != '' && internaltheme != undefined && internaltheme != null || internalthemeselect != null){
		$scope.isInternalTheme = true;
	}
	if(externalthemeselect != null) {
		$scope.isInternalTheme = false;
	}
	
	$scope.setNext = function(){
		//console.log('NEXT - ');
		j$('#myCarousel').carousel('next');              	
	};                      
	
	$scope.setPrevious = function(){
		//console.log('PREV - ');
		j$('#myCarousel').carousel('prev');  
	};
	
	j$('#myCarousel').bind('slid.bs.carousel',function(){
		//$scope.selectedThemeName = j$('div.active').children('span').contents().first().text(); //angular.element('div.active').children('span').scope().slide.name;
		//$scope.selectedThemeName = angular.element('div.active').children('span').scope().slide.name;
		$scope.selectedThemeName = j$('div.active').children('span').scope().slide.name;		
	});
	
	$scope.getImageDataHandler = function(){  
		var deferred = $q.defer(); 
		Visualforce.remoting.Manager.invokeAction(
			_RemotingManageUserExternalThemeActions.GetImageData, 
			$scope.accountId, $scope.isInternalTheme,
			function(result, event){
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(result);						
						for (var i=0; i<result.count; i++) {
							if(i == 0){
								$scope.selectedThemeName = result.imageNames[0];
							}
							$scope.slides.push({
								image : result.images[i],
								name : result.imageNames[i],
								active: (i==0)?true:false
							});
						}						
					}); 
					
				}
			}, 
			{ buffer: false, escape: false, timeout: 30000 }
		); 
		return deferred.promise;
	};
	$scope.getImageDataHandler();
});
