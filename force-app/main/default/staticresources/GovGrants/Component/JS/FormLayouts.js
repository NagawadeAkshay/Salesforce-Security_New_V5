var namespace = "";
var j$ = jQuery.noConflict();
var formTableApp = angular.module('FormComponent', []);

formTableApp.controller('FormLayoutCtrl', function ($q,$scope,$window,$sce) {
	$scope.isRefresh = false;
	$scope.isPreviewMode = false;
	$scope.showValidateButton = true;
	$scope.errorCreatingTable = false;
	$scope.messages = [];
	$scope.flex = true;
	$scope.formActionParameters = {};
	$scope.formActionConfigParameters = {};
	$scope.formTableHeaderTitle = '';
	$scope.pdfOpenInModal = function(row) {
		//console.log('row====',row);
		if(row.RenderType == 'iText Layout'){
               j$('#addPdfModal').modal();
               j$('#iframepdfContentId').attr('src','/apex/GNT__DynamicLayoutExport?packageId=&id='+row.recordId+'&viewTemplateName='+row.FormName+'&flexTableParam='+row.keyValMapJSON);    
        }else{
               window.open('/apex/GNT__DynamicLayoutExport?packageId=&id='+row.recordId+'&viewTemplateName='+row.FormName+'&flexTableParam='+row.keyValMapJSON,'_blank');    
         }
     }

     $scope.handleMessageTimeOut = function(messageType){
     	let msgType = messageType;
     	messageTimeBasedClose(msgType);
     }

	$scope.validateForms  = function() {
		$scope.messages = [];
		$scope.validateActionMap = {};
		$scope.validateActionMap.action = $scope.formActionConfigParameters['Validate'];
		Visualforce.remoting.Manager.invokeAction(
			_RemotingFormLayoutsActions.validateForm,
			 formLayouts_recordId,formLayouts_packageId,formLayouts_formTypes,$scope.validateActionMap,
			function(msg,event) {
				if (msg.IsSuccess) {
					$scope.$apply(function () {						
						$scope.messages.push({type: 'success',msg:''+msg.Msg});
					});
					$scope.initFormTable();
				} else {
					$scope.$apply(function () {
					   $scope.messages.push({type: 'danger',msg:''+msg.Msg});
					});
				} 

				// Call Message Time Out...
				if($scope.messages != undefined || $scope.messages !=''){
					let msgType = $scope.messages[0].type;	
					$scope.handleMessageTimeOut(msgType);
				}
			},
			{ buffer: false, escape: false}
		);
	}
	
	$scope.trustSrcHTML = function(src) {
		return $sce.trustAsHtml(src);
	}
	
	$scope.aside = {title: 'Title', content: 'Hello Aside<br />This is a multiline message!'};

	$scope.trustSrcHTML = function(src) {
		return $sce.trustAsHtml(src);
	}
	$scope.toUTCDate = function(date){
		var _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
		return _utc;
	};
	$scope.getDateTime = function(value){
		var time = undefined;
		if(value != undefined){
			return $scope.toUTCDate(new Date(value+$scope.timeOffset));
		}
		return time;
	};
	$scope.getDate = function(value){
		var time = undefined;
		if(value != undefined){
			return $scope.toUTCDate(new Date(value));
		}
		return time;
	};
	/* Initialize the arrays that will be required here after */
	$scope.columns = [];

	$scope.closeAlert = function(index) {
		$scope.messages.splice(index, 1);
	};

	$scope.trustSrc = function(src) {
		return $sce.trustAsResourceUrl(src);
	}
	
	$scope.setLoading = function(loading) {
		$scope.isLoading = loading;
	};
	
	$scope.openModalFromHTML = function(winURL){
		$scope.windowURL = '';		
		var tableIdStartIndex = winURL.indexOf('&tableId=');
		var tableIdValue = winURL.substring(tableIdStartIndex+9);
		var headerValueStartIndex = winURL.indexOf('&header=');
		var headerValue = winURL.substring(headerValueStartIndex+8, tableIdStartIndex);
		$scope.windowURL = winURL ;
		$scope.windowTitle = headerValue;
		$scope.windowWidth = '1200px';
		$scope.windowContentWidth = '1170px';
		$scope.windowHeight = '500px';
		//var modalId = '#'+tableIdValue+'modalDiv';		
		j$('#FormComponentmodalDiv').modal();
		//j$(modalId).modal();
	}

	$scope.paintFormTable = function(formTableResult){		
		$scope.noRecords = false;
		$scope.formTableHeaderTitle = formTableResult.FormHeader;
		$scope.isPreviewMode = formTableResult.IsFormPreview;
		$scope.showValidateButton = !formTableResult.hideValidateButton;
		$scope.formActionParameters = formTableResult.HideActionsMap;	
		$scope.formActionConfigParameters = formTableResult.ActionsMap;
		//$scope.messages.push({type: 'Info',msg:'Pankaj Testing'});

		$scope.fieldsMap = formTableResult.FieldMetadata;
		$scope.renderBtnPDF = formTableResult.renderBtnForPDF;
		$scope.renderBtnCSV = formTableResult.renderBtnForCSV;
		$scope.columnsNameList = formTableResult.columnList;
		$scope.columns = [];
		for(var i=0; i < $scope.columnsNameList.length;i++) {
			var f = $scope.columnsNameList[i];
			var refFieldPath = f.field;			
			$scope.columns.push({"field": f,"displayName":f.displayName,"width":f.width, "refField":refFieldPath,"type":f.type});			
		}
		/* 3. Create the table data information */
		if(formLayouts_isPreview != 'true'){
			$scope.tableData = formTableResult.DataList;
		}
		if($scope.tableData != undefined && $scope.tableData.length == 0){
			$scope.noRecords = true;
		}

		/* 6. Set the loading to false */
		$scope.setLoading(false);
	};

	/* Initialize the preview flex table */
	$scope.initFormTablePreview = function(){
		$scope.setLoading(true);
		var deferred = $q.defer();
		Visualforce.remoting.Manager.invokeAction(
			_RemotingFormLayoutsActions.fetchPreviewData,
			 formLayouts_layoutId,formLayouts_pageBLockId,formLayouts_packageId,
			function(flexTableResult, event){
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(flexTableResult);
						$scope.paintFormTable(flexTableResult);
					});
				}
				else{
					$scope.$apply(function () {
						$scope.errorCreatingTable = true;
						$scope.setLoading(false);
						$scope.messages.push({type: 'Info',msg:'' + event.message});
						hideLoadingPopUp();
					});
				} 
			},
			{ buffer: false, escape: false}
		);
		return deferred.promise;
	};
	
	/* Initialize the flex table */
	$scope.initFormTable = function(){
		$scope.setLoading(true);
		var deferred = $q.defer();
		Visualforce.remoting.Manager.invokeAction(
			_RemotingFormLayoutsActions.getLayouts,
			formLayouts_layoutId,formLayouts_recordId,formLayouts_pageBLockId,formLayouts_packageId,formLayouts_formTypes,
			function(dataResult, event){				
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(dataResult);
						if(dataResult.DataList != undefined){
							$scope.paintFormTable(dataResult);
						}
					});
				} else {
					$scope.$apply(function () {
						$scope.errorCreatingTable = true;
						$scope.setLoading(false);
						$scope.messages.push({type: 'danger',msg: 'Error creating table:' + event.message});
					});
				}
				hideLoadingPopUp();
			},
			{ buffer: false, escape: false}
		);
		return deferred.promise;
	};
	//$scope.defaultFiscalValue = '';	
	if(formLayouts_isPreview == 'true'){
		$scope.initFormTablePreview();
	}else{
		$scope.initFormTable();
	}
	$scope.extraParameters = '?isdtp=vw&';

	if( formLayouts_FiscalYear != '' &&  formLayouts_FiscalYear != undefined && formLayouts_FiscalYear != 'undefined'){
		$scope.extraParameters += 'pv0='+formLayouts_FiscalYear+'&';
	}
	if( formLayouts_Division != '' &&  formLayouts_Division != undefined && formLayouts_Division != 'undefined'){
		$scope.extraParameters += 'pv1='+formLayouts_Division;
	}

});

formTableApp.filter('orderObjectBy', function() {
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
formTableApp.filter('noFractionCurrency',[ '$filter', '$locale',
	function(filter, locale) {
		var currencyFilter = filter('currency');
		var formats = locale.NUMBER_FORMATS;
		return function(amount, currencySymbol) {
		  var value = currencyFilter(amount, currencySymbol);
		  var sep = value.indexOf(formats.DECIMAL_SEP);
		  if(amount >= 0) {
			return value;
		  }
		  return value;//.substring(0, sep) + '';
		};
	}
]);
formTableApp.directive("customhtml", function($compile,$parse){
	return {
		restrict: 'E',
		scope: {
			fieldContent: '=',
			fieldName: '='
		},
		link: function(scope, element, attr){
			var texAreaContent = $parse(scope.fieldName)(scope.fieldContent);
			var text = String(texAreaContent).replace(/<[^>]+>/gm, '');
			if(texAreaContent != undefined && texAreaContent != 'undefined'){
				var content = texAreaContent.replace(/PlaceHolderID/g, "FormComponent" );
				element.html(content).show();
				element.attr('title', text);
				$compile(element.contents())(scope);
			}

		}
	}
});

angular.element(document).ready(function() {
	angular.bootstrap(document.getElementById("FormComponent"),['FormComponent']);
});


function closeFlexModal() {
	j$('#FormComponentmodalDiv').modal('hide') ;
	angular.element(document.getElementById("FormComponent")).scope().getPageRecords();
	angular.element(document.getElementById("FormComponent")).scope().$apply();
}

// the winURL should be in this format - /apex/<PageName>?id=<ID>&header=<MODAL HEADER>&tableId=<FLEXTABLENAME>
function openFlexModal(url ){
	//console.log('Ok');
	angular.element(document.getElementById("FormComponent")).scope().openModalFromHTML(url);
	angular.element(document.getElementById("FormComponent")).scope().$apply();
}

function loadingScreen(){
	j$.blockUI(
		{
			message: '<img src="/img/loading.gif" alt="Loading gif"/>'

		}
	);
	setTimeout(j$.unblockUI, 5000);
}