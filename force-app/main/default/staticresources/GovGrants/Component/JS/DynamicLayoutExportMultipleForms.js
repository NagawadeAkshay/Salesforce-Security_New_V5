/**
 * Devoloper Name:Amol Darekar
 * Creation Date:
 * Purpose:
 */
var app = angular.module('DynamicLayoutExportMultipleFormsApp', []);

app.controller('DynamicLayoutExportMultipleCtrl', ['$scope','$window', function($scope,$window) {
 var count = 0;
 var maxCount = 0;
 var namespace ='';
 $scope.resultMap = {};
 $scope.attachmentIdList = '[';
 $scope.pdfName = '';
 $scope.showProcessing = true;
 $scope.isError = false;
 $scope.timeOfInitialization='';
 $scope.pollCounter = 0;
 $scope.maxPollCounter = _RecordMaps.iTextPollCounter;
 $scope.pageDataHolder= '';
 $scope.pageTemaplateMap = {};
 $scope.pageAttachmentList = [];
 

 //Function to get from instance record info and create a list of object 
 //and call getSavedPFD() function
 $scope.getFormInstanceInfo = function(){
 	// $scope.deleteData();
	 $scope.formInstanceList = JSON.parse(_RecordMaps.formInstanceList);
	 $scope.PDFParamList = [];
	 $scope.urlParamMap = {'PDFParamList':[],'PageDataHolderId':$scope.pageDataHolder.Id};
     namespace = _RecordMaps.pkgNameSpance;
	 //Add record in list for Parent object page layout
	 //console.log('flexTableParam==>'+_RecordMaps.flexTableParam);

     $scope.PDFParamList.push({'Id':_RecordMaps.recordId,
							  	'viewTemplateName':_RecordMaps.viewTemplateName,
							    'flexTableParam':_RecordMaps.flexTableParam,
							    'skipRedirect':'true',
							    'PageDataHolderId': $scope.pageDataHolder.Id
							     });
	 //Create a map of JSON to pass as a parameter to remote action funtion
	 //Add record in a list for child form page layouts
	 angular.forEach($scope.formInstanceList, function(value, key){

	  $scope.PDFParamList.push(
	  	                        {'Id':value[namespace+'FormId__c'],
							  	'viewTemplateName':value[namespace+'PackageBusinessForm__r'][namespace+'FormConfig__r']['Name'],
							    'flexTableParam':JSON.stringify({'recordId':value[namespace+'FormId__c'],
							                      'parentId':value[namespace+'ParentRecordId__c'],
							                      'template':value[namespace+'PackageBusinessForm__r'][namespace+'FormConfig__r']['Name']
							                     }),
							     'exportPageName':value[namespace+'PackageBusinessForm__r'][namespace+'FormConfig__r'][namespace+'ExportPageName__c'],
							     'PageDataHolderId' : $scope.pageDataHolder.Id
							     }
	     						);
	 
	  });

	 maxCount = $scope.PDFParamList.length;

	 $scope.urlParamMap.PDFParamList = $scope.PDFParamList;
	 getSavedPFD();
};

$scope.getPlaceHolder = function(){
  $scope.pdfName = 'Creating attachment Parent Record';
  Visualforce.remoting.Manager.invokeAction(
			       _RemotingActionsDynamicMultipleExport.getPlaceHolder,
			       _RecordMaps.recordId,
			       function(result, event){ 
			            $scope.pageDataHolder = result;
			            $scope.$apply();
			            $scope.getFormInstanceInfo();
			       }, { buffer: false, escape: true, timeout: 30000 }
			    );
}();




//Use to create and save form as PDF
function getSavedPFD(){
	$scope.pdfName = 'Generating PDF....';
	angular.forEach($scope.urlParamMap.PDFParamList, function(value, key) {
		Visualforce.remoting.Manager.invokeAction(
		       _RemotingActionsDynamicMultipleExport.saveFormPDF,
		       value,
		       function(result, event){
		       	if(event.status){
		            count++;
		            //$scope.attachmentIdList.push(result.AttachmentIds);
		            $scope.pageTemaplateMap[value.viewTemplateName] = result.AttachmentIds;
		            $scope.pdfName = value.viewTemplateName+ ' processing complete';
		            //maxCount represent the total number of form present for the parent record
		            if(count < maxCount){
		            	//$scope.attachmentIdList += result.AttachmentIds+',';
		            }
		            else{
		            	$scope.resultMap = result;
		            	//$scope.getData();
		            	//$scope.deleteData();
		            	//Add code here to fetch the records from unmannged code
		            	/*$scope.attachmentIdList +=result.AttachmentIds+']';
		            	//console.log('$scope.attachmentIdList==>'+$scope.attachmentIdList);*/
		            	$scope.getMergedItextPDF();
		            	//console.log('$scope.attachmentIdList==>'+$scope.attachmentIdList);
		            }
		        }
		        else{
		        	$scope.isError = true;
		        	$scope.showProcessing = false;
		         }
		            $scope.$apply();
		       }, { buffer: false, escape: false,timeout: 120000});
	});	
  };


$scope.startPolling = function(){
    //console.log('polling started =====');
    $scope.pollCounter++;
    Visualforce.remoting.Manager.invokeAction(
        _RemotingActionsDynamicMultipleExport.PollForAttachment,
        {'parentId':$scope.pageDataHolder.Id},
        function(retVal, event) {
            //console.log('retVal =====',retVal);
            if (event.status) {
                $scope.$apply(function() {
                    if(retVal.Success == true){                                                                                                         
                        window.location.href = retVal.URL;
                    }else if($scope.pollCounter < $scope.maxPollCounter){
                        setTimeout(function(){ $scope.startPolling(); }, 5000);
                    }else{
                        $scope.isError = true;
		        	    $scope.showProcessing = false;
		        	    $scope.pdfName = '';
                    }
                });
            } else {
                $scope.message = 'Error...';
            }
        }, {buffer: false, escape: false, timeout: 120000}
    );
}

//Call to Itext merge pdf funtion
$scope.getMergedItextPDF  = function(){
	$scope.pdfName = 'Merging the PDF files';
	angular.forEach($scope.PDFParamList, function(value, key){
       $scope.attachmentIdList += $scope.pageTemaplateMap[value.viewTemplateName]+',';
	});

	$scope.attachmentIdList = $scope.attachmentIdList.substring(0, $scope.attachmentIdList.length - 1);
	$scope.attachmentIdList+=']'; 

	  $scope.timeOfInitialization = Date.now();
	  $scope.startPolling();
	 Visualforce.remoting.Manager.invokeAction(
	  _RemotingActionsDynamicMultipleExport.getMergedItextPDF,
			       {'attachmentIds':$scope.attachmentIdList,
			        'parentRecordId':$scope.urlParamMap.PageDataHolderId,
			        'task':'PDFMerger',
			        'fileName': 'MergedFile.pdf'},
			       function(result, event){ 
			       	if(event.status){
			            //console.log('Result::'+result);
			            $scope.showProcessing = false;
			            $window.open('/servlet/servlet.FileDownload?file='+result["AttachmentId"], '_self');
			            //$window.close();
			        }
			        else{
			        	setTimeout(function(){ $scope.startPolling(); }, 5000);
                        //$scope.isError = true;
		        	    //$scope.showProcessing = false;
			        }
			       }, { buffer: false, escape: false,timeout: 120000 }
			    );
};
}]);