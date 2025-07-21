function closeModalWindow(){
          angular.element(document.getElementById('OverlayComponentDiv')).scope().modalWindow.dismiss('cancel');
          refresh();
    }    
    function clickCall(link){
        angular.element(document.getElementById('OverlayComponentDiv')).scope().open(link);       
    }   
    //angular.module('OverlayComponent', ['ui.bootstrap']);
	                       
    govGrantsApp.controller('OverlayComponentCtrl', function ($scope, $modal, $log) {  
      var modalContent = 'ModalWindowTemplate';
	
      $scope.open = function (windowURL,height) {        
        $scope.windowURL = windowURL;
		console.log('height-->>',height);
		if(height == undefined){
			height='400';
		}
        var h = height+'px';
        var w = '600'+'px'; 
        $scope.modalstyle = {height:h,width:w};
        var modalInstance = $modal.open({
          templateUrl: modalContent,
          controller: ModalInstanceCtrl,
          resolve: {
            windowURL: function () {
              return $scope.windowURL;
            },
            modalstyle: function () {
              return $scope.modalstyle;
            }
          }
        }); 
        $scope.modalWindow = modalInstance;
        modalInstance.result.then(function () {
          }, function () {
            //$log.info('Modal dismissed at: ' + new Date());            
        });
      };
    });

    // Please note that $modalInstance represents a modal window (instance) dependency.
    // It is not the same as the $modal service used above.

    var ModalInstanceCtrl = function ($scope, $modalInstance, windowURL,modalstyle) {
      $scope.windowURL = windowURL;   
      $scope.modalstyle = modalstyle;   
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    };