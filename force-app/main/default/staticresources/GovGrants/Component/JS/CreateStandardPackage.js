var agencyId;
var j$ = jQuery.noConflict();
j$('#addAttModalField').modal().hide();
var openWindow = function() {	
	j$('#addAttModalField').modal().show();
	j$('#iframeAddAttContentIdField').attr('src','/apex/CustomLookup?fieldId=AgencyInput&lookupType=001&formId=&filterCriteria=&searchTerm=&pageBlockDetailId=');
	//apex/CustomLookup?fieldId=AgencyInput&lookupType=001&formId=&filterCriteria=&searchTerm=&pageBlockDetailId=
	//apex/tmpFindAgency?id=a0s370000008AN1
}
var setLookupValue =function(fieldId,selectedId,value) {	
	agencyId = selectedId;
	j$('#'+fieldId).val(value);
	j$('#addAttModalField').modal().hide();
}
var selectPackageApp = angular.module('SelectPackageComponent', []);

selectPackageApp.controller('SelectPackageCtrl', function ($q,$scope,$timeout, $log,$element,$window,$sce,$location) {
	$scope.selectPackageObj = {};
	$scope.selectPackageObj.isLoading = true;
	$scope.recordType = '';
	$scope.IsEditPackage = false;
	$scope.messages = [];
	$scope.disableMandatory = false;
	// Need to read from parameter
	$scope.pkgType = '';
	$scope.parendFlexTableId = createStdPkg_parentTableName;
	$scope.isCloned = createStdPkg_isClone;
	$scope.packageId = '';
	$scope.packageId = createStdPkg_id;	

	if($scope.packageId != null && $scope.packageId != undefined && $scope.packageId != '' ) {
		$scope.selectPackageObj.selectedRadioBtn = 'New';
	}
	$scope.paintPackageInfoSection = function( dataResult ){		
		$scope.selectPackageObj.selectedFormList = [];
		$scope.selectPackageObj.isLoading = false;
		//$scope.selectPackageObj.availablePackages = dataResult.packageList;
		//$scope.selectPackageObj.selectedPackageForForms = $scope.selectPackageObj.availablePackages[0];
		$scope.pkgType = dataResult.submissionType;
		// $scope.packageId = dataResult.packageId;   commented because in upsert not getting value of pkgId.
		// //console.log('where packageId gets changed--->',dataResult.packageId);
		//$scope.filterCriteria = angular.element(document.getElementById('SelectPackageExistingPackages')).scope().newFilterClause;
		//$scope.filterCriteriaArray = $scope.filterCriteria.split(' and ');
		//$scope.filterCriteria = '';
		/*
		for(var i = 0; i < $scope.filterCriteriaArray.length; i++) {
			if($scope.filterCriteriaArray[i].indexOf('SubmissionType__c')>-1){
				$scope.submissionTypeArray = $scope.filterCriteriaArray[i].split('=');
				$scope.filterCriteriaArray[i] = $scope.submissionTypeArray[0] + ' = ' + '\''+$scope.pkgType+'\'';
			}
			if( i < $scope.filterCriteriaArray.length-1){
				$scope.filterCriteria = $scope.filterCriteria + $scope.filterCriteriaArray[i] + ' and ' ;
			} else {
				$scope.filterCriteria = $scope.filterCriteria + $scope.filterCriteriaArray[i] + ' ' ;
			}
		}
		angular.element(document.getElementById('SelectPackageExistingPackages')).scope().newFilterClause = $scope.filterCriteria;
		angular.element(document.getElementById('SelectPackageExistingPackages')).scope().getPageRecords();*/
		$scope.selectPackageObj.selectedPackageType = {};
		$scope.selectPackageObj.selectedPackageType.id = $scope.pkgType;
		$scope.getAvailableFormList();
		if( dataResult.packageName != undefined ) {
			$scope.selectPackageObj.packageName = dataResult.packageName;
			$scope.selectPackageObj.packageDescription = dataResult.packageDescription;
			$scope.selectPackageObj.requiredPackage = dataResult.isMandatory
			$scope.recordType = dataResult.recordType;
			$scope.selectPackageObj.selectedFormList = dataResult.PackageForms;
			$scope.selectPackageObj.agency = dataResult.Agency;
			$scope.selectPackageObj.hideForExternalUser = dataResult.hideForExternalUser;
			//$scope.disableMandatory = dataResult.disableMandAction;
		}
	};

	$scope.paintAvalaibleFormList = function( dataResult ){
		var formIdListStr = '';
		if(!$scope.IsEditPackage){
			$scope.selectPackageObj.selectedFormList = [];
		}
		if($scope.selectPackageObj.selectedFormList != undefined) {
			for(var i=0; i < $scope.selectPackageObj.selectedFormList.length;i++) {
				formIdListStr = formIdListStr +',' + $scope.selectPackageObj.selectedFormList[i].id;
			}
		}
		for(var i=0; i < dataResult.length;i++) {
			var idStr = dataResult[i].id;
			if (formIdListStr.indexOf(idStr) > -1) {
				dataResult.splice(i, 1); 
				i--;
			}
		}
		$scope.selectPackageObj.availableForms = dataResult;
	};

	$scope.showFlexTable = function(){
		showFlexTable();
	};
	$scope.hideFlexTable = function(){
		hideFlexTable();
	};

	$scope.moveFormsToRight = function() {
		//if($scope.selectPackageObj.availableForms.length > 0 && $scope.selectPackageObj.selectedAvailableForms != ''){		
		for(var i=0; i < $scope.selectPackageObj.selectedAvailableForms.length;i++) {
			if($scope.selectPackageObj.availableForms.length > 0 && $scope.selectPackageObj.selectedAvailableForms[i] != ''){
				var index = $scope.selectPackageObj.availableForms.indexOf($scope.selectPackageObj.selectedAvailableForms[i]);
				$scope.selectPackageObj.availableForms.splice(index, 1);
				if($scope.selectPackageObj.selectedFormList == undefined){
					$scope.selectPackageObj.selectedFormList = [];
				}
				$scope.selectPackageObj.selectedFormList.push( $scope.selectPackageObj.selectedAvailableForms[i] );
				$scope.selectPackageObj.selectedAvailableForms[i] = '';
			}
		}
	}
	$scope.moveFormsToLeft1 = function() {
		for(var i=0; i < $scope.selectPackageObj.selectedRightForms.length;i++) {                   
			if($scope.selectPackageObj.selectedFormList.length > 0 && $scope.selectPackageObj.selectedRightForms[i] != ''){
				var index = $scope.selectPackageObj.selectedFormList.indexOf($scope.selectPackageObj.selectedRightForms[i]);                       
				$scope.selectPackageObj.selectedFormList.splice(index, 1); 
				if($scope.selectPackageObj.availableForms == undefined){
					$scope.selectPackageObj.availableForms = [];
				}                                              
				$scope.selectPackageObj.availableForms.push( $scope.selectPackageObj.selectedRightForms[i]);                        
				$scope.selectPackageObj.selectedRightForms[i] = '';
			}                  
		}
	} 

	$scope.moveFormToLeft = function( selectedRightForm ) {
		var moveleftvar = $scope.selectPackageObj.selectedFormList;
		var index = $scope.selectPackageObj.selectedFormList.indexOf(selectedRightForm);
		$scope.selectPackageObj.selectedFormList.splice(index, 1); 
		$scope.selectPackageObj.availableForms.push( selectedRightForm );
	}

	/*$scope.moveFormsToLeft = function() {
	for(var i=0; i < $scope.selectPackageObj.selectedRightForms.length;i++) {
	var index = $scope.selectPackageObj.selectedFormList.indexOf($scope.selectPackageObj.selectedRightForms[i]);
	$scope.selectPackageObj.selectedFormList.splice(index, 1); 
	$scope.selectPackageObj.availableForms.push( $scope.selectPackageObj.selectedRightForms[i] );
	}
	}*/

	$scope.moveFormsToDown = function() {                 
		$scope.maxIndexForMoveDown = $scope.selectPackageObj.selectedFormList.length;                                                        
		for(var i=$scope.selectPackageObj.selectedRightForms.length; i > 0;i--) {                                                                                         
			var index = $scope.selectPackageObj.selectedFormList.indexOf($scope.selectPackageObj.selectedRightForms[i-1]); 			                                                                          
			if( index+1 < $scope.maxIndexForMoveDown){           				
				$scope.selectedFormToMoveDown = $scope.selectPackageObj.selectedFormList[index];
				$scope.selectPackageObj.selectedFormList[index] = $scope.selectPackageObj.selectedFormList[index+1];
				$scope.selectPackageObj.selectedFormList[index+1] = $scope.selectedFormToMoveDown;
			} else {
				//console.log('Maximun index reached!');
			}                      
		}
	}

	$scope.moveFormsToUp = function() {
		$scope.maxIndexForMoveUp = $scope.selectPackageObj.selectedFormList.length;                                    
		for(var i=0; i < $scope.selectPackageObj.selectedRightForms.length;i++) {                                                   
			var index = $scope.selectPackageObj.selectedFormList.indexOf($scope.selectPackageObj.selectedRightForms[i]);
			//console.log('index up----',index);                                                                               
			if( index < $scope.maxIndexForMoveUp && index!=0){                       
				$scope.selectedFormToMoveDown = $scope.selectPackageObj.selectedFormList[index];
				$scope.selectPackageObj.selectedFormList[index] = $scope.selectPackageObj.selectedFormList[index-1];
				$scope.selectPackageObj.selectedFormList[index-1] = $scope.selectedFormToMoveDown;
			} else {       
				//console.log('Can not move up hit index 0');                     
			}
		}
	}

	$scope.closeModalWindow = function(){
		parent.angular.element(parent.document.getElementById($scope.parendFlexTableId+'modalDiv')).scope().closeFlexModal(); 
	}

	$scope.createPackage = function(SelectExisting){
		showLoadingPopUp();
		var paramMap = {};
		$scope.selectedExtPackage = '';
		$scope.messages = [];
		
		if($scope.selectPackageObj.selectedPackageType.id == '-- Select --' || $scope.selectPackageObj.selectedPackageType.name == '-- Select --'){
			$scope.messages.push({type: 'danger',msg: 'Please select package type.'});
			hideLoadingPopUp();
			return ;
		}
		
		if($scope.selectPackageObj.packageName == '' || $scope.selectPackageObj.packageName == undefined){
			$scope.messages.push({type: 'danger',msg: 'Please enter package Name.'});
			hideLoadingPopUp();
			return ;
		}

		if($scope.selectPackageObj.packageDescription == '' || $scope.selectPackageObj.packageDescription == undefined){
			$scope.messages.push({type: 'danger',msg: 'Please enter package Description.'});
			hideLoadingPopUp();
			return ;
		}
		if( $scope.selectPackageObj.selectedFormList == undefined || $scope.selectPackageObj.selectedFormList.length == 0 ){
			$scope.messages.push({type: 'danger',msg: 'Please add atleast one form.'});
			hideLoadingPopUp();
			return ;
		}
		$scope.formidlst = [];
		for(var i=0; i < $scope.selectPackageObj.selectedFormList.length;i++) {
			$scope.form = {};
			$scope.form.id = $scope.selectPackageObj.selectedFormList[i].id;
			$scope.form.selected = $scope.selectPackageObj.selectedFormList[i].selected;
			$scope.formidlst.push( $scope.form );
		}
		if($scope.isCloned == 'true'){
			$scope.packageId = '';
		}
		paramMap.packageId = $scope.packageId;
		paramMap.formids = angular.toJson($scope.formidlst);
		paramMap.pkgType = $scope.selectPackageObj.selectedPackageType.id;
		paramMap.packageName = $scope.selectPackageObj.packageName;
		paramMap.packageDescription = $scope.selectPackageObj.packageDescription;
		paramMap.agency =  $scope.selectPackageObj.agency;
		paramMap.agencyId =  agencyId;
		//console.log(' paramMap.agency', paramMap.agency);
		paramMap.parendId = $scope.parendId;
		paramMap.recordType = $scope.recordType;
		paramMap.hideForExternalUser = $scope.selectPackageObj.hideForExternalUser
		//paramMap.requiredPackage = $scope.selectPackageObj.requiredPackage;
		paramMap.packageId = $scope.packageId;	
		paramMap.selectedAppId = $scope.selectAppObj.selectedAppType.id;	
		var deferred = $q.defer();
		Visualforce.remoting.Manager.invokeAction(
			_RemotingCreateStandardPackageActions.upsertStandardPackage,
			$scope.packageId, paramMap,
			function(dataResult, event){
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(dataResult);
						//$window.open(dataResult,'_self');
						hideLoadingPopUp();
						$scope.closeModalWindow();
						parent.angular.element(parent.document.getElementById($scope.parendFlexTableId)).scope().closeFlexModal();				
					});
					//closeAndRefreshParentTable();
					$scope.closeModalWindow();
					parent.angular.element(parent.document.getElementById($scope.parendFlexTableId)).scope().closeFlexModal();

					//parent.closeandrefreshPackageModal();
				} else{
					//parent.closePackageModal();
					$scope.$apply(function () {
						//render error msg 
						hideLoadingPopUp();
						$scope.messages.push({type: 'danger',msg: 'Error upserting Package:' + event.message});
					});
				} 
			},{ buffer: false, escape: false}
		);                                   
	};

	$scope.getAvailableFormList = function(){
		var deferred = $q.defer();
		Visualforce.remoting.Manager.invokeAction(
			_RemotingCreateStandardPackageActions.getFormList,
			'All', $scope.selectPackageObj.selectedPackageType.id,$scope.selectAppObj.selectedAppType.id,
			function(dataResult, event){
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(dataResult);
						$scope.paintAvalaibleFormList(dataResult);
					});
				} else{
					$scope.$apply(function () {
						$scope.messages.push({type: 'danger',msg: 'get Package List:' + event.message});
						//render error msg
					});
				} 
			},{ buffer: false, escape: false}
		);
	};

	$scope.getAvailalbleAppTypes = function(){
		var deferred = $q.defer();
		Visualforce.remoting.Manager.invokeAction(
			_RemotingCreateStandardPackageActions.getAppTypes,
			function(dataResult, event){
				$scope.selectPackageObj.isLoading = false;
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(dataResult);
						$scope.selectAppObj = {};
						$scope.selectAppObj.AppTypes = dataResult;
						$scope.selectAppObj.selectedAppType = $scope.selectAppObj.AppTypes[0];
						//$scope.paintPackageInfoSection(dataResult);
					});
				} else{
				$scope.$apply(function () {
					$scope.messages.push({type: 'danger',msg: 'Get package types:' + event.message});
					//render error msg
				});
				} 
			},{ buffer: false, escape: false}
		);
	}









	$scope.getAvailablePackageTypes = function(){
		var deferred = $q.defer();
		//console.log('selectedAppTypeselectedAppType',$scope.selectAppObj.selectedAppType.id)
		Visualforce.remoting.Manager.invokeAction(
			_RemotingCreateStandardPackageActions.getPackageTypes,
			$scope.selectAppObj.selectedAppType.id,
			function(dataResult, event){
				$scope.selectPackageObj.isLoading = false;
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(dataResult);
						$scope.selectPackageObj = {};
						$scope.selectPackageObj.packageTypes = dataResult;
						$scope.selectPackageObj.selectedPackageType = $scope.selectPackageObj.packageTypes[0];
						//$scope.paintPackageInfoSection(dataResult);
					});
				} else{
				$scope.$apply(function () {
					$scope.messages.push({type: 'danger',msg: 'Get package types:' + event.message});
					//render error msg
				});
				} 
			},{ buffer: false, escape: false}
		);
	}

	$scope.getPackageDetails = function(){
		var deferred = $q.defer();
		Visualforce.remoting.Manager.invokeAction(
			_RemotingCreateStandardPackageActions.getPackageDetails,
			$scope.packageId,$scope.selectAppObj.selectedAppType.id,
			function(dataResult, event){
				$scope.selectPackageObj.isLoading = false;
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(dataResult);
						$scope.selectPackageObj = {};
						$scope.paintPackageInfoSection(dataResult);
						//console.log('dataREsult---->',dataResult);
						$scope.selectPackageObj.packageTypes = dataResult.submissionType;
						//$scope.selectPackageObj.selectedPackageType = $scope.selectPackageObj.packageTypes[0];
						//$scope.paintPackageInfoSection(dataResult);
					});
				} else{
					$scope.$apply(function () {
						$scope.messages.push({type: 'danger',msg: 'Get package types:' + event.message});
						//render error msg
					});
				} 
			},{ buffer: false, escape: false}
		);
	}
	j$('#createStdPkgDiv').show();
	if($scope.packageId == null || $scope.packageId == '' ) {
		//$scope.getAvailablePackageTypes();
		$scope.getAvailalbleAppTypes();
		$scope.IsEditPackage = false;
	} else {
		$scope.getPackageDetails('');
		$scope.IsEditPackage = true;
	}
});
function closeModalWindow(){
	angular.element(document.getElementById('SelectPackageComponent')).scope().closeModalWindow();
}