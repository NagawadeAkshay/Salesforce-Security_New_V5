var namespace = flexTable_namespace;
//Temp Function for the Help Text for flexTable.
 /*       
function showHelpTooltip(thisVal,thm,id) {             
   //console.log('thisVal',thisVal);                     
   j$('#'+id+'tooltip').tooltipster({ 
		theme: thm,                     
		multiple: true,
		position : 'right',
		animation :'fade',          
		contentAsHTML: true,    
		content : thisVal
	});    
	j$('#'+id+'tooltip').tooltipster('show');                                                                 
} */
						  
function adjustToggleBarHeightUI(){
	var finalHeight = 0;
	var paddingtop = 0;
	var paddingtop1 = 0;
	var windowHeight = j$(window).height();
	var loginpanelHeight = j$('#loginpanel').height();
	var rightpanelHeight = j$('#rightPanel').height();
	var rightColumnHeight = j$('#rightcolumn').height();
	//finalHeight =  rightColumnHeight;
	finalHeight = Math.max( windowHeight, rightColumnHeight); 
	paddingtop = (windowHeight-loginpanelHeight)/2;
	paddingtop1 = (windowHeight-rightpanelHeight)/2;
	j$('#leftcolumn').css('min-height', finalHeight);
	j$('#rightcolumn').css('min-height', finalHeight);
	j$('#loginpanel').css('padding-top', paddingtop);
	j$('#rightPanel').css('padding-top', paddingtop1);
}

var j$ = jQuery.noConflict();

var autoSuggestionObject = {};

flexTableApp.controller('FlexTableCtrl', function ($q, $scope, $window, $sce, $parse, Scopes) {
	Scopes.store('FlexTableCtrl', $scope);
	$scope.hiddencolumns = [];								  
	$scope.flexTableId = Scopes.get('MasterFlexTableCtrl').flexTable_TableId;
	$scope.uniqueSessionId = Scopes.get('MasterFlexTableCtrl').flexTable_uniqueSessionId;
	$scope.headerDescription = Scopes.get('MasterFlexTableCtrl').flexTable_headerDescription;
	$scope.URLParams = window.location.search;
	$scope.hideHeader = true;
	$scope.timeOffset = Scopes.get('MasterFlexTableCtrl').flexTable_timeOffset;
	$scope.isInsideDynamicLayout = Scopes.get('MasterFlexTableCtrl').flexTable_insideDynamicLayout;
	$scope.currentPageURL = decodeURIComponent(Scopes.get('MasterFlexTableCtrl').flexTable_currentPageURL);
	//console.log('Inside child scope currentPageURL: ',$scope.currentPageURL);
	$scope.currentPageURLButtons = decodeURIComponent(Scopes.get('MasterFlexTableCtrl').flexTable_currentPageURLButtons);
	//console.log('Inside child scope currentPageURLButtons: ',$scope.currentPageURLButtons);
	$scope.flexTable_dataTableConfigName = Scopes.get('MasterFlexTableCtrl').flexTable_dataTableConfigName;
	$scope.flexTable_isPreview = Scopes.get('MasterFlexTableCtrl').flexTable_isPreview;
	$scope.flexTable_isFieldHistoryFlexTable = Scopes.get('MasterFlexTableCtrl').flexTable_isFieldHistoryFlexTable;
	//console.log('InsideJs flexTable_isFieldHistoryFlexTable--->>>',$scope.flexTable_isFieldHistoryFlexTable);
	$scope.flexTable_keyValueMap = Scopes.get('MasterFlexTableCtrl').flexTable_keyValueMap;
	$scope.flexTable_listKeyValueMap = Scopes.get('MasterFlexTableCtrl').flexTable_listKeyValueMap;	
	$scope.flexTable_searchTerm = Scopes.get('MasterFlexTableCtrl').flexTable_searchTerm;
	$scope.flexTable_gridSearchTerm = Scopes.get('MasterFlexTableCtrl').flexTable_gridSearchTerm;
	console.log('$scope.flexTable_gridSearchTerm in js: ',$scope.flexTable_gridSearchTerm);
	$scope.flexTable_objectName = Scopes.get('MasterFlexTableCtrl').flexTable_objectName;
	$scope.flexTable_phaseName = Scopes.get('MasterFlexTableCtrl').flexTable_phaseName;
	$scope.flexTable_sObjectOfFieldHistory = Scopes.get('MasterFlexTableCtrl').flexTable_sObjectOfFieldHistory;
	//console.log('InsideJs flexTable_sObjectOfFieldHistory--->>>',$scope.flexTable_sObjectOfFieldHistory);
	$scope.flexTable_parentRecord = Scopes.get('MasterFlexTableCtrl').flexTable_parentRecord;
	$scope.parentScope = $scope;
	$scope.QuickSearchReportText = ''; 	
	//console.log('$scope parentScope--->>>>',$scope.parentScope);	
	
	$scope.flexTable_isN2GGridSearch = Scopes.get('MasterFlexTableCtrl').flexTable_isN2GGridSearch;
	$scope.flexTable_filterClauseGridSearch = Scopes.get('MasterFlexTableCtrl').flexTable_filterClauseGridSearch;
	console.log('$scope.flexTable_isN2GGridSearch isnide sr:',$scope.flexTable_isN2GGridSearch);
	console.log('$scope.flexTable_filterClauseGridSearch inside sr: ',$scope.flexTable_filterClauseGridSearch);	
	$scope.flexTable_skipNavTabName = Scopes.get('MasterFlexTableCtrl').flexTable_skipNavTabName;
	
	$scope.data = {
		historyObj: ''		
   };
	$scope.singleRecordSelection = Scopes.get('MasterFlexTableCtrl').flexTable_singleRecordSelection;
	$scope.isFilterCriteriaChanged = false;
	/*if($scope.currentPageURLButtons.indexOf('&saveURL') != -1){		
		$scope.currentPageURLButtons = $scope.currentPageURLButtons.substring(0, $scope.currentPageURLButtons.indexOf('&saveURL'));		
	}*/
	if($scope.currentPageURLButtons.indexOf('&retURL') != -1){
		//console.log('$scope.currentPageURLButtons before removing: ',$scope.currentPageURLButtons);
		//console.log('Index of &retURL: ',$scope.currentPageURLButtons.indexOf('&retURL'));
		$scope.currentPageURLButtons = $scope.currentPageURLButtons.substring(0, $scope.currentPageURLButtons.indexOf('&retURL'));
		//console.log('retURL currentPageURLButtons indexof: ',$scope.currentPageURLButtons);
	}
	if($scope.currentPageURL.indexOf('&retURL') != -1){
		$scope.currentPageURL = encodeURIComponent($scope.currentPageURL.substring(0, $scope.currentPageURL.indexOf('retURL')));
	}
	$scope.retURL = '?retParams='+ $scope.URLParams.substring(1,$scope.URLParams.length) + '&retURL=' + encodeURIComponent($scope.currentPageURL);

	/* Static data relevant to flex table */
	$scope.alphabets = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','All'];
	$scope.pageSizes = [];
	$scope.sortInfo  = { fields: [], directions: ['desc', 'asc']};
	$scope.isRefresh = false;
	$scope.searchTerm = '';
	$scope.errorCreatingTable = false;
	$scope.messages = [];
	$scope.isSOSL = false;
	$scope.flex = true;
	$scope.showStickySearchTextBox = true;
	$scope.hideRowLevelAction = false;
	$scope.initialParameters = {};
	$scope.searchTest = 'true';
	$scope.StickyObjectName = '';
	$scope.StickySearchCriteria='';     
	$scope.StickyUserSelection = '';    
	//$scope.SelectedCriteria = {};
	$scope.aside = {title: 'Title', content: 'Hello Aside<br />This is a multiline message!'};
	$scope.exportOptionForPDF = [
							{title:"Download as PDF",exportAs:"PDF",imageURL:flexTable_PDf,
							pageURL:"/apex/" + namespace + "FlexTableExport?flexTableName="+$scope.flexTable_dataTableConfigName +"&mode=pdf"}
							];
	$scope.exportOptionForCSV = [
							{title:"Download as CSV",exportAs:"CSV",imageURL:flexTable_xl,
							pageURL:"/apex/" + namespace + "FlexTableExport?flexTableName="+$scope.flexTable_dataTableConfigName +"&mode=text/csv"},
							];
	$scope.inputTextFilterOptions = [
					"Contains",
					"Starts with",
					"Ends with"
				   ];
	$scope.picklistFilterOptions = [
					"Equals",
					"Not equals"
				   ];

	$scope.fiscalYearOptions = [];
	$scope.clearStickySearch = false;
	// UI-Shrawan-10282015  Added for UI enhancements
	$scope.actionIcon = function(){
	  return $scope.trustSrcHTML('<i class="fa fa-angle-double-down"> </i>');
	}

	$scope.trustSrcHTML = function(src) {
		return $sce.trustAsHtml(src);
	}
	
	$scope.addSpacecToMultiselect = function(src) {
		if(src != undefined){
			$scope.newString = src.replace(/;/g,"; ");
			return $sce.trustAsHtml($scope.newString);
		}
	}
	
	$scope.showHelpTooltip =function(thisVal,thm,id) {		                  
		j$('#'+id+'tooltip').tooltipster({ 
			 theme: thm,                     
			 multiple: true,
			 position : 'right',
			 animation :'fade',          
			 contentAsHTML: true,    
			 content : '<span>'+ thisVal + '</span>'
		 });    
		j$('#'+id+'tooltip').tooltipster('show');    
	}
	$scope.exportTable = function(exportInfo){
		var d = new Date();
		var n = d.toLocaleDateString()+'__'+d.toLocaleTimeString();
		$window.open(encodeURI(exportInfo.pageURL+"&filterClause="+$scope.newFilterClause+"&flexTableHeader="+$scope.flexTableHeader+"&locale="+n),"_blank");
	}
	$scope.redirect = function(tableConfigInfos){
		$window.open("/"+tableConfigInfos.FlexTableRecordId+"?isdtp=vw");
	}
	$scope.checkCookie = function() {
		return j$.cookie('setup') == 'present';
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
	$scope.openPDFOrCSV = function(pdfOrCsv){
		if(pdfOrCsv=='PDF'){
			$window.open("/apex/" + namespace + "FlexTableExport?flexTableName="+$scope.flexTable_dataTableConfigName +"&mode=pdf&filterClause="+$scope.newFilterClause,"_blank");
		}
		else if(pdfOrCsv=='CSV'){
			$window.open("/apex/" + namespace + "FlexTableExport?flexTableName="+$scope.flexTable_dataTableConfigName +"&mode=text/csv&filterClause="+$scope.newFilterClause,"_blank");
		}
	}
	
	$scope.calculateTotalRowValues = function(recordList,columnName){               
		var total = 0;
		for(var i= 0 ; i<recordList.length ;i++){
			if(!isNaN(recordList[i][columnName])){
				total += Number(recordList[i][columnName]);                        
			}
		}
					  
		//$scope.overAllTotal.push($scope.totalRowAndColumnValue);
	   // //console.log('overAllTotal------>>>',$scope.overAllTotal);
		//$scope.overAllTotal = $scope.overAllTotal + total;
		total = total.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
		total = '$' + total;
		return total;
	};
	
	
	/* Initialize the arrays that will be required here after */
	$scope.columns = [];
	$scope.pickListMap = {};
	$scope.filterMap = {};
	$scope.filterDisplayMap = {};
	$scope.filterDisplayMapOnFilter = {};
	$scope.selectedRecords = {};
	$scope.flagForRenderPDFCSVButton = false;
	$scope.isStickySelectionChanged = false;
	//$scope.setSelectionAllChkBox = false;
	$scope.initilizeDisplayMap = function() {
		angular.copy($scope.filterDisplayMap, $scope.filterDisplayMapOnFilter);
		//$scope.filterDisplayMapOnFilter = {};
		for(column in $scope.columns) {
			//$scope.columns[column].field
			$scope.columns[column].term1 = '';
			$scope.columns[column].term2 = '';
			if( $scope.filterDisplayMapOnFilter[$scope.columns[column].field] != undefined ) {
				$scope.columns[column].term1 = $scope.filterDisplayMapOnFilter[$scope.columns[column].field].val1;
				$scope.columns[column].term2 = $scope.filterDisplayMapOnFilter[$scope.columns[column].field].val2;
			}
		}
	}

	/* Functions that will be invoked across various actions */
	$scope.selectRecord = function(recordId,selectVal){
		if( $scope.singleRecordSelection ) {
			$scope.selectedRecords = {};
			$scope.selectedRecords[recordId] = selectVal;
		} else {
			$scope.selectedRecords[recordId] = selectVal;
			$scope.setSelectAllCheckBox();
		}
	}
	$scope.setSelectAllCheckBox = function(){
		var totalCount = 0;
		for(i=0;i<$scope.tableData.length;i++){
			var record = $scope.tableData[i];
			if($scope.selectedRecords[record.Id] == true){
				totalCount++;
			}
		}
		if(totalCount == $scope.tableData.length && $scope.tableData.length != 0){
			$scope.selAllChkBox = true;
		}else{
			$scope.selAllChkBox = false;
		}
	}
	$scope.selectAllRecords =function(selectVal){
		for(i=0;i<$scope.tableData.length;i++){
			var record = $scope.tableData[i];
			if(record[$scope.tableConfigInfo.HideDecisionForRecordSelection] != true){
				$scope.selectedRecords[record.Id] =  selectVal;
			}
		}
		$scope.selAllChkBox = selectVal;
	}
	$scope.closeAlert = function(index) {
		$scope.messages.splice(index, 1);
	};
	$scope.first = function(){
		$scope.messages = [];
		showLoadingPopUp();
		$scope.pageNumber = 1;
		$scope.getPageRecords();
		$scope.setCookiesData();
	};
	$scope.last = function(){
		$scope.messages = [];
		showLoadingPopUp();
		$scope.pageNumber = $scope.totalPages;
		$scope.getPageRecords();
		$scope.setCookiesData();
	};
	$scope.next = function(){
		$scope.messages = [];
		if($scope.hasNext == true){
			showLoadingPopUp();
			$scope.pageNumber++;
			$scope.getPageRecords();
			$scope.setCookiesData();
		}
	};
	$scope.previous = function(){
		$scope.messages = [];
		showLoadingPopUp();
		$scope.pageNumber--;
		$scope.getPageRecords();
		$scope.setCookiesData();
	};
	$scope.refresh = function(size){
		showLoadingPopUp();
		$scope.messages = [];
		if(size != undefined){
			$scope.pageSize = size;
			if(size == 'All'){
				$scope.pageSize = $scope.totalRecordsCount;
			}
		}
		$scope.pageNumber = 1;
		$scope.getPageRecords();
		$scope.setCookiesData();
		$scope.frame = document.getElementById($scope.flexTableId+'iframeContentId');
		if($scope.frame != null)
			$scope.frameDoc = $scope.frame.contentDocument || $scope.frame.contentWindow.document;
		if($scope.frameDoc != null)
			$scope.frameDoc.documentElement.innerHTML = "";
	};
	$scope.searchByIndex = function(indexVal){
		if(indexVal == 'All'){
			$scope.clearAllFilter();
		}else{
			var fieldName = $scope.sortFieldName;
			if(fieldName != undefined){
				$scope.filterStringRecords(fieldName,fieldName,'Starts with',indexVal,false);
				$scope.filterRecords();
			}
		}
	};
	$scope.quickSearchCall = function( searchTerm, event ){
		$scope.QuickSearchReportText = searchTerm;
		if( event == null || event.keyCode == 13 ) {
			if(event!=null && event.keyCode == 13 ) {
				event.preventDefault();
			}
			showLoadingPopUp();
			$scope.generateFilterString( searchTerm );
			$scope.getPageRecords();
		}
	};
	$scope.generateQuickSearchFilter = function( searchTerm ){
		if( searchTerm != '' && searchTerm != undefined ) {
			searchTerm = searchTerm.replace("*", "%");
			var filterClause='';
			for(column in $scope.columns) {
				if($scope.columns[column].type == 'REFERENCE' || $scope.columns[column].type == 'PICKLIST' || $scope.columns[column].type == 'STRING' || $scope.columns[column].type == 'EMAIL' || $scope.columns[column].type == 'PHONE' || $scope.columns[column].type == 'URL') {
					if( column != "1" ) {
						filterClause += ' OR ';
					}
					filterClause +=$scope.filterStringRecords($scope.columns[column].field, $scope.columns[column].field, 'Contains', searchTerm, true);
				}else if($scope.columns[column].type == 'DATE' || $scope.columns[column].type == 'DATETIME' ) {
					var numbers = /^[0-9]+$/;
					var dateRE = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
					var dateREWithDateAndMonth = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])$/;
					if(searchTerm.match(numbers)) {
						if( column != "1" ) {
							filterClause += ' OR ';
						}
						filterClause +=  $scope.getDateQueryForQuickSearch($scope.columns[column].field, searchTerm);
					} else if(searchTerm.match(dateRE)) {
						if( column != "1" ) {
							filterClause += ' OR ';
					}
						filterClause +=  $scope.getFullDateQueryForQuickSearch($scope.columns[column].field, searchTerm);
					} else if(searchTerm.match( dateREWithDateAndMonth )) {
						if( column != "1" ) {
							filterClause += ' OR ';
						}
						filterClause +=  $scope.getMonthAndDayDateQueryForQuickSearch($scope.columns[column].field, searchTerm);
					}

				}else if($scope.columns[column].type == 'CURRENCY' || $scope.columns[column].type == 'DOUBLE') {
					var numbers = /^[0-9]+$/;
					if(searchTerm.match(numbers)) {
						if( column != "1" ) {
							filterClause += ' OR ';
						}
						filterClause +=  $scope.getNumberQueryForQuickSearch($scope.columns[column].field, searchTerm);
					}
				}
			}
			if( filterClause != '' ) {
				if( $scope.newFilterClause != null && $scope.newFilterClause != '' ) {
					$scope.newFilterClause = '( ' + $scope.newFilterClause + ' ) and ( ' + filterClause + ' )';
				} else {
					$scope.newFilterClause = ''+filterClause;
				}
			}
			$scope.isSOSL = false;
		}
	}
	$scope.getDateQueryForQuickSearch = function(fieldName, searchTerm){
		return 'CALENDAR_MONTH('+fieldName+')='+searchTerm+' OR CALENDAR_YEAR('+fieldName+')='+searchTerm+' OR DAY_IN_MONTH('+fieldName+')='+searchTerm+' ';
	}

	$scope.getFullDateQueryForQuickSearch = function(fieldName, searchTerm){
		var searchSplit = searchTerm.split("\/");
		if( $scope.userOffset == undefined ) {
			$scope.userOffset = '0:0';
		}
		//$scope.toUTCDate
		var date = new Date();		
		date.setMonth(searchSplit[0]-1);
		date.setDate(searchSplit[1]);
		date.setYear(searchSplit[2]);
		date.setHours(0);
		date.setMinutes(0);
		
		var date1 = new Date(date.getTime() - userTimeZone );
		//console.log('====2=', date1);
		tmpVar = date1;
		return '( CALENDAR_MONTH('+fieldName+')='+( date1.getMonth() + 1) +' and CALENDAR_YEAR('+fieldName+')='+date1.getFullYear()+' and DAY_IN_MONTH('+fieldName+')='+date1.getDate()+') ';
	}

	$scope.getMonthAndDayDateQueryForQuickSearch = function(fieldName, searchTerm){
		var searchSplit = searchTerm.split("\/");
		return '( CALENDAR_MONTH('+fieldName+')='+searchSplit[0]+' and DAY_IN_MONTH('+fieldName+')='+searchSplit[1]+') ';
	}

	$scope.getNumberQueryForQuickSearch = function(fieldName, searchTerm){
		return fieldName + '='+searchTerm;
	}

	$scope.sort = function(column){
		if(column.type != 'TEXTAREA' && column.type != 'MULTIPICKLIST'){
			if(column.field != undefined){
				showLoadingPopUp();
				var fieldName = column.field;

				if($scope.sortFieldName == fieldName && ($scope.sortDirection == 'ASC' || $scope.sortDirection == 'asc')){
					$scope.sortDirection = 'desc';
				}else if($scope.sortFieldName == fieldName && ($scope.sortDirection == 'DESC' || $scope.sortDirection == 'desc')){
					$scope.sortDirection = 'asc';
				}else {
					$scope.sortDirection = 'asc';
				}
				$scope.sortFieldName = fieldName ;
				$scope.pageNumber = 1;
				$scope.getPageRecords();
				$scope.setCookiesData();
			}
		} else{
			alert('Sorry, sorting is not allowed on this column.');
		}
	}

	$scope.setCookiesData = function(column){
		if( $scope.sortFieldName != undefined && $scope.sortFieldName != '' ) {
			j$.cookie($scope.uniqueSessionId+"sortFieldName", $scope.sortFieldName );
		}
		if( $scope.sortDirection != undefined && $scope.sortDirection != '' ) {
			j$.cookie($scope.uniqueSessionId+"sortDirection", $scope.sortDirection );
		}
		if( $scope.pageNumber != undefined && $scope.pageNumber != '' ) {
			j$.cookie($scope.uniqueSessionId+"pageNumber", $scope.pageNumber );
		}
		if( $scope.pageSize != undefined && $scope.pageSize != '' ) {
			j$.cookie($scope.uniqueSessionId+"pageSize", $scope.pageSize);
		}
	}

	$scope.openHelp = function (){
		if($scope.tableConfigInfo.IsHelpDownloadable == 'true'){
			window.open('/servlet/servlet.FileDownload?file='+$scope.tableConfigInfo.HelpDocId,'_blank');
		}else{
			window.open('/apex/' + namespace + 'Help?id='+$scope.tableConfigInfo.Help, '_blank','width=900, height=700');
		}
	}

	$scope.regexForMergeFieldInConfirmMessage = function(confirmMsg,regexObj){
		var match = null;
		var regex = regexObj;///\{\!(\w*)\}/g;
		var matches = new Array();
		while (match = regex.exec(confirmMsg)) {
			var matchArray = [];
			for (i in match) {
				if (parseInt(i) == i) {
					matchArray.push(match[i]);
				}
			}
			matches.push(matchArray);
		}
		return matches;
	}

	$scope.openLink = function(rowActionInfo,row,isTopItem){
		$scope.messages = [];
		
		if(rowActionInfo.showConfirmationBox ){
			var count = 0;
			var selectedRecord;
			var selectedRecordIdCount;
			var targetUser;
			var confirmMsg = rowActionInfo.confirmationMessage;
			//console.log(' ==> confirmMsg ==> '+confirmMsg);
			for(selectedRecord in $scope.selectedRecords){
				if($scope.selectedRecords[selectedRecord]){
					count++;    
				}
			}
			/*if(count == 0){
				bootbox.alert("No Records Selected", function() {
				  //console.log('No records found');
				});
			}else{*/
				var regex = /\{\!(\w*)\}/g;
				var value;
				var matches = $scope.regexForMergeFieldInConfirmMessage(confirmMsg,regex);
				selectedRecordIdCount = count;
				for(array in matches){
					value = matches[array][1];
					if(selectedRecordIdCount != undefined && value == "selectedRecordIdCount"){
						confirmMsg = confirmMsg.replace(matches[array][0],selectedRecordIdCount);
					}else if($scope.keyValueMap[value] != undefined ) {
						confirmMsg = confirmMsg.replace(matches[array][0],$scope.keyValueMap[value]);
					}
					else{
						confirmMsg = confirmMsg.replace(matches[array][0],'');
					}
				}
				$scope.showConfirmBox(confirmMsg,rowActionInfo,row,isTopItem);
		}else{
			$scope.openLink2(rowActionInfo,row,isTopItem);
		}
	}
	
	$scope.openLink2 = function(rowActionInfo,row,isTopItem){
		//if($scope.methodCalled == true){
			//$scope.methodCalled = false;
			$scope.messages = [];
			var winURL = '';
			if(rowActionInfo.actionURL != 'null'){
				if(rowActionInfo.standardAction.toLowerCase() == 'new'){
					if(rowActionInfo.actionURL != null && rowActionInfo.actionURL != ''){
						var winURL = rowActionInfo.actionURL;

					}
				}else if(rowActionInfo.standardAction.toLowerCase() == 'edit'){
					if(rowActionInfo.actionURL != null && rowActionInfo.actionURL != ''){
						var winURL = rowActionInfo.actionURL;
						if(row != null){
							var objName = $scope.objectName;
							var mergeField = '{' + '!' + objName  + '.id}';
							winURL = winURL.replace(new RegExp('(' + mergeField + ')', 'gi'), row.Id);

						}
						if(row != null){
							var objName = $scope.objectName;
							var mergeField = '{' + '!' + objName  + '.Name}';							
							winURL = winURL.replace(new RegExp('(' + mergeField + ')', 'gi'), row.Name);
						}
					}
				}else{
					//hideLoadingPopUp();
					var winURL = rowActionInfo.actionURL;
					if(row != null){
						var objName = $scope.objectName;
						var mergeField = '{' + '!' + objName  + '.id}';
						winURL = winURL.replace(new RegExp('(' + mergeField + ')', 'gi'), row.Id);
					}
					if(row != null){
						var reg = new RegExp(/{\![^}\.]*\.(.[^}]*)\}/g);
						var result;
						while ((result = reg.exec(winURL)) !== null) {
							if(result[1].lastIndexOf('\.') > -1) {
								var splitList = result[1].split('\.');								
								winURL = winURL.replace(result[0], row[splitList[0]][splitList[1]]);
							} else {
								winURL = winURL.replace(result[0], row[result[1]]);
							}
						}
					}
					if($scope.tableConfigInfo.EnableRecordSelection == 'true'){
						var idsParam='';
						if(winURL.indexOf('?') == -1){
							idsParam += '?';
						}else{
							idsParam += '&';
						}
						idsParam += 'ids=';
						for(id in $scope.selectedRecords){
							if($scope.selectedRecords[id] == true){
								idsParam += id + ',';
							}
						}
						idsParam = idsParam.substring(0,idsParam.length-1);
						winURL += idsParam ;
					}
				}

			}else if(rowActionInfo.actionClass != 'null'){
				if(isTopItem == true){
					if($scope.tableConfigInfo.EnableRecordSelection == 'true' && $scope.selectedRecords != undefined && $scope.selectedRecords != ''){
						$scope.executeApexClass(rowActionInfo,$scope.selectedRecords,$scope.keyValueMap);
						$scope.selectedRecords = {};
					}else if($scope.tableConfigInfo.EnableRecordSelection == 'true' && $scope.selectedRecords == ''){
						$scope.messages.push({type: 'info',msg: 'Please select atleast one record.'});
					}else{
						$scope.selectedRecords = {};
						$scope.executeApexClass(rowActionInfo,$scope.selectedRecords,$scope.keyValueMap);
					   // $scope.selectedRecords = '';
					}
				}else{
					$scope.selectedRecord = {};
					if(row.Id != undefined){
						$scope.selectedRecord[row.Id] = true;
					}
					$scope.executeApexClass(rowActionInfo,$scope.selectedRecord,$scope.keyValueMap);
				}
			}
			if(winURL != '' && rowActionInfo.standardAction.toLowerCase() != 'delete'){
				$scope.handleOpenCondition(winURL,rowActionInfo);
			} else if(rowActionInfo.standardAction.toLowerCase() == 'delete'){
				//console.log(" ==> In delete function ==>");
				if(row != null){
					//console.log(" ==> row.Id ==> "+row.Id);
					//console.log(" ==> rowActionInfo.confirmationMessage ==>"+rowActionInfo.confirmationMessage);
				if(rowActionInfo.confirmationMessage && rowActionInfo.showConfirmationBox){
					//console.log('===> in if ');
					$scope.deleteRecords(row.Id);
				}else{
					//console.log('===> in else ');
					var message = flexTable_DeleteConfirmLabel;
					$scope.showConfirmBox(message,rowActionInfo,row,isTopItem);
				}
			}
		   }
	}

	/* to show confirm boot box*/
	$scope.showConfirmBox = function(message,rowActionInfo,row,isTopItem){
		//console.log('===> in showConfirmBox function ==> ');
		bootbox.dialog({
			  message: message,
			  title:"Confirm",
			  onEscape: function() {},
			  backdrop: true,
			  closeButton: true,
			  animate: true,
			  buttons: {
				No: {   
				   label: "No",
				  callback: function() {}
				},
				"Yes": {
				  label: "Yes" ,
				  callback: function(result) {
					 if(result){
						//showLoadingPopUp();
						$scope.deleteRecords(row.Id);
					}
				  }
				},
			  }
		});
	 }


	$scope.handleOpenCondition = function(winURL,rowActionInfo){

	   // winURL = decodeURIComponent(winURL);
		if(rowActionInfo.standardAction.toLowerCase() == 'edit' || rowActionInfo.standardAction.toLowerCase() == 'new'){
			if(winURL.toLowerCase().indexOf("saveurl")== -1){
				if(winURL.indexOf("?") == -1){
					winURL = winURL + '?saveURL='+encodeURIComponent($scope.currentPageURL);
				}else{
					winURL = winURL + '&saveURL='+encodeURIComponent($scope.currentPageURL);
				}
			}
		}
		if(winURL.indexOf('&retURL') != -1){
			winURL = winURL.substring(0, winURL.indexOf('retURL'));
		}
		var ret = decodeURIComponent($scope.currentPageURL);
		if(ret.indexOf('&retURL') != -1 || ret.indexOf('?retURL') != -1 ){
			ret = ret.substring(0, ret.indexOf('retURL')-1);
		}
		if(winURL.indexOf("?") == -1){
			winURL += '?retURL='+encodeURIComponent(ret);
		}else{
			winURL += '&retURL='+encodeURIComponent(ret);
		}

		//winURL = encodeURIComponent(winURL);

		if(rowActionInfo.actionBehavior == 'Open in same window'){
			showLoadingPopUp();
			$window.open(winURL,'_self');
		}else if(rowActionInfo.actionBehavior == 'Open in new window'){
			hideLoadingPopUp();
			$window.open(winURL,'_blank');
		}else if(rowActionInfo.actionBehavior == 'Open in overlay'){
			//table Id to hide and refresh it outside of scope
			winURL = winURL + '&parentTableId='+$scope.flexTableId;
			hideLoadingPopUp();
			$scope.windowURL = winURL ;
			if(rowActionInfo.modalTitle != 'null'){
				$scope.windowTitle =  rowActionInfo.modalTitle;
			}else{
				$scope.windowTitle = rowActionInfo.dataTableActionObj.Name ;
			}
			if(rowActionInfo.height != 'null' && rowActionInfo.height != ''){				
				$scope.windowDialogHeight = (parseInt(rowActionInfo.height)+50).toString() +'px';
				$scope.windowHeight = (parseInt(rowActionInfo.height)).toString() +'px';
				  resizeFlag=false;			 
			}else{
			   // $scope.windowHeight = '500px';
			  //  $scope.windowDialogHeight  = '550px';
				  resizeFlag=true;
			}
			if(rowActionInfo.width != 'null' && rowActionInfo.width != ''){
				$scope.windowWidth  = (parseInt(rowActionInfo.width)+50).toString() +'px';
				$scope.windowContentWidth = (parseInt(rowActionInfo.width)).toString() +'px';
			}else{
				//modal();
				$scope.windowWidth = '550px';
				$scope.windowContentWidth = '500px';
			}
			//loadingScreen();
			//showLoadingPopUp();
			j$('#'+$scope.flexTableId+'modalDiv').modal();
			//$scope.methodCalled = true;
		}else{
			showLoadingPopUp();
			$window.open(winURL,'_self');
		}
		autoresizeIframe();
	}
	$scope.trustSrc = function(src) {
		return $sce.trustAsResourceUrl(src);
	}
	// the winURL should be in this format - /apex/<PageName>?id=<ID>&header=<MODAL HEADER>&tableId=<FLEXTABLENAME>
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
		$scope.windowHeight = '800px';
		var modalId = '#'+tableIdValue+'modalDiv';		
		j$(modalId).modal();
	}

	$scope.executeApexClass = function(rowActionInfo,selectedRecords,keyValueMap){
		var winURL = '';
		var deferred = $q.defer();
		if(keyValueMap == undefined){
			keyValueMap =  {};
		}
		showLoadingPopUp();
		Visualforce.remoting.Manager.invokeAction(
			_RemotingFlexTableActions.ExecuteClass,
			rowActionInfo.actionClass,selectedRecords,keyValueMap,rowActionInfo.dataTableActionObj,$scope.flexTable_dataTableConfigName ,$scope.currentPageURLButtons,
			function(executeClassResult, event){
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(executeClassResult);
						winURL = executeClassResult.PageURL;
						$scope.messages = [];
						if(executeClassResult.Error != null && executeClassResult.Error != ''){
							hideLoadingPopUp();
							alert(executeClassResult.Error);
							//$scope.methodCalled = true;
						}else if(winURL != null && winURL != ''){
						   $scope.handleOpenCondition(winURL,rowActionInfo);
						}else if(executeClassResult.Message != null && executeClassResult.Message != ''){
							$scope.messages.push({type: 'info',msg: executeClassResult.Message});
							$scope.getPageRecords();
							//$scope.methodCalled = true;
							hideLoadingPopUp();
							$scope.selectedRecords = {};
						}
					});
				}
			},
			{ buffer: false, escape: false, timeout: 30000 }
		);
	}
	
	$scope.deleteRecords = function(recordId) {			              
				Visualforce.remoting.Manager.invokeAction(
					_RemotingFlexTableActions.DeleteRecord,
					$scope.objectName, recordId,
					function(deleteResult, event) {
						if (event.status) {
							$scope.$apply(function() {
								var deleteMessage;
								if (deleteResult.Success) {
									deleteMessage = deleteResult.Message;;
									$scope.getPageRecords();
								} else {
									var result = deleteResult.Message;
									var deleteMessageArray = result.split(':');
									var deleteMessage = deleteMessageArray[2];
									var deleteErrorMessageArray = deleteMessage.split(',');
									deleteMessage = deleteErrorMessageArray[1];
								}
								hideLoadingPopUp();
								var titleMessage = flexTable_AlertHeaderLabel;
								bootbox.dialog({
									size: 'small',
									message: deleteMessage,
									title: titleMessage,
									onEscape: function() {},
									backdrop: false,
									closeButton: true,
									animate: true,
									buttons: {
											ok: {
												label: "Ok",
												className: "customBtn btn-ext",
											}
										}
								});
							});
						}
					}, {
						buffer: false,
						escape: false,
						timeout: 30000
					}
				);
	
			};

	$scope.filterStringRecords = function(fieldName,label,criteria,searchTerm,isQuickSearch){
		var conditionString = '';
		if(fieldName != '' && criteria != '' && searchTerm != undefined && searchTerm != '' && criteria != undefined){
			conditionString = (criteria == 'Contains') ? (fieldName + ' LIKE \'%' +  searchTerm + '%\'') :
								(criteria == 'Ends with') ? (fieldName+ ' LIKE \'%' +  searchTerm + '\'') :
								(criteria == 'Starts with') ? (fieldName+ ' LIKE \'' +  searchTerm + '%\'') :
								(criteria == 'Equals') ? (fieldName+ ' = \'' +  searchTerm + '\'') :
								(criteria == 'Not equals') ? (fieldName+ ' != \'' +  searchTerm + '\'') :
								(fieldName+ ' = \'' +  searchTerm + '\'');
			if(!isQuickSearch) {
				$scope.filterMap[fieldName] = conditionString;
				$scope.filterDisplayMapOnFilter[fieldName] = {"label":label,"criteria":criteria + ' ' +searchTerm,"val1":criteria,"val2":searchTerm };
			}
		} else if(!isQuickSearch && searchTerm == '') {
			delete $scope.filterMap[fieldName];
			delete $scope.filterDisplayMapOnFilter[fieldName];
		}
		return conditionString;
	};
	$scope.filterRangeRecords = function(field,label,fromField,toField){
		var conditionString = '';
		if(fromField != undefined && toField != undefined && toField.length > 0 && fromField.length > 0){			                 
			conditionString = field + ' >= ' +  fromField + ' AND ' + field + ' <= ' + toField;
			$scope.filterMap[field] = conditionString;
			//$scope.filterDisplayMapOnFilter[field] = ' within ' + fromField + ' and ' + toField;
			$scope.filterDisplayMapOnFilter[field] = {"label":label,"criteria":' within ' + fromField + ' and ' + toField,"val1":fromField,"val2":toField };
		}else if((fromField != undefined && fromField !='') && (toField == undefined || toField == '')){			
			conditionString = field + ' >= ' +  fromField;
			$scope.filterMap[field] = conditionString;
			//$scope.filterDisplayMapOnFilter[field] = ' >=' + fromField ;
			$scope.filterDisplayMapOnFilter[field] = {"label":label,"criteria":' >=' + fromField,"val1":fromField,"val2":toField };
		}else if((toField != undefined && toField !='') && (fromField == undefined || fromField == '')){			
			conditionString = field + ' <= ' + toField;
			$scope.filterMap[field] = conditionString;
			//$scope.filterDisplayMapOnFilter[field] = ' <= ' + toField;
			$scope.filterDisplayMapOnFilter[field] = {"label":label,"criteria":' <= ' + toField,"val1":fromField,"val2":toField};
		}
	};

	$scope.filterDateRecords = function(field,label,fromDate,toDate){
		var conditionString = '';
		if(fromDate != undefined && fromDate != '' &&  toDate != undefined && toDate != '' && !isNaN(fromDate) && !isNaN(toDate)){
			fromDate = new Date( fromDate );
			toDate = new Date( toDate );
			fromDate.setHours(00);
			fromDate.setMinutes(00);
			fromDate.setSeconds(00);
			toDate.setHours(00);
			toDate.setMinutes(00);
			toDate.setSeconds(00);
			conditionString = ' ' + field + ' >= ' +  formatLocalDt( fromDate );
			conditionString += ' and ' + field + ' <= ' + formatLocalDt( toDate );
			$scope.filterMap[field] = conditionString;
			$scope.filterDisplayMapOnFilter[field] = {"label":label,"criteria":' within ' + formatLocalDt( fromDate )  + ' and ' + formatLocalDt( toDate ),"val1":fromDate,"val2":toDate};
		}else if(fromDate != undefined && fromDate != '' && !isNaN(fromDate)){
			fromDate = new Date( fromDate );
			fromDate.setHours(00);
			fromDate.setMinutes(00);
			fromDate.setSeconds(00);
			conditionString = ' ' + field + ' >= ' +  formatLocalDt( fromDate );
			$scope.filterMap[field] = conditionString;
			$scope.filterDisplayMapOnFilter[field] = {"label":label,"criteria":' from ' + formatLocalDt( fromDate ),"val1":fromDate,"val2":toDate};
		}else if(toDate != undefined && toDate != ''&& !isNaN(toDate)){
			toDate = new Date( toDate );
			toDate.setHours(00);
			toDate.setMinutes(00);
			toDate.setSeconds(00);
			conditionString = ' ' + field + ' <= ' +  formatLocalDt( toDate);
			$scope.filterMap[field] = conditionString;
			$scope.filterDisplayMapOnFilter[field] = {"label":label,"criteria":' until ' + formatLocalDt( toDate),"val1":fromDate,"val2":toDate};
		} else{
			delete $scope.filterMap[field];
			delete $scope.filterDisplayMapOnFilter[field];
		}
	};

	$scope.filterDateTimeRecords = function(field,label,fromDate,toDate,column){
		var conditionString = '';
		if(fromDate != undefined && fromDate != '' &&  toDate != undefined && toDate != '' && !isNaN(fromDate) && !isNaN(toDate)){
			fromDate = new Date( fromDate );
			toDate = new Date( toDate );
			var fromDateStr = new Date(fromDate.getTime() - fromDate.getTimezoneOffset() * 60000).toISOString();
			conditionString = ' ' + field + ' >= ' +  formatLocalDate(fromDate);
			var toDateStr = new Date(toDate.getTime() - toDate.getTimezoneOffset() * 60000).toISOString();
			conditionString += ' and ' + field + ' <= ' +  formatLocalDate(toDate );
			$scope.filterMap[field] = conditionString;
			$scope.filterDisplayMapOnFilter[field] = {"label":label,"criteria":' within ' + fromDate.toLocaleString()  + ' and ' + toDate.toLocaleString(),"val1":fromDate,"val2":toDate};
		} else if((fromDate != undefined && fromDate != '' && !isNaN(fromDate))) {
			fromDate = new Date( fromDate );
			toDate = new Date( toDate );
			var fromDateStr = new Date(fromDate.getTime() - fromDate.getTimezoneOffset() * 60000).toISOString();
			conditionString = ' ' + field + ' >= ' +  formatLocalDate(fromDate);
			$scope.filterMap[field] = conditionString;
			$scope.filterDisplayMapOnFilter[field] = {"label":label,"criteria":' from ' + fromDate.toLocaleString(),"val1":fromDate,"val2":toDate};
		} else if(toDate != undefined && toDate != '' && !isNaN(toDate)){
			fromDate = new Date( fromDate );
			toDate = new Date( toDate );
			var toDateStr = new Date(toDate.getTime() - toDate.getTimezoneOffset() * 60000).toISOString();
			conditionString += ' ' + field + ' <= ' +  formatLocalDate(toDate );
			$scope.filterMap[field] = conditionString;
			$scope.filterDisplayMapOnFilter[field] = {"label":label,"criteria":' Until ' + toDate.toLocaleString(),"val1":fromDate,"val2":toDate};
		} else{
			delete $scope.filterMap[field];
			delete $scope.filterDisplayMapOnFilter[field];
		}
	};

	$scope.filterBooleanRecords = function(field,label,filterTerm){
		if(filterTerm != undefined){
			var conditionString = field + ' = ' +  filterTerm;
			$scope.filterMap[field] = conditionString;
			$scope.filterDisplayMapOnFilter[field] = {"label":label,"criteria":' = ' +  filterTerm,"val1":filterTerm,"val2":''};
		}
	};
	$scope.clearAllFilter = function(){
		$scope.filterMap = {};
		$scope.filterDisplayMap = {};
		//angular.copy($scope.filterClause, $scope.newFilterClause);
		$scope.newFilterClause = '' + $scope.filterClause;
		$scope.showFilterPane = false;
		$scope.getPageRecords();
	};
	$scope.removeFilter = function(field){
		delete $scope.filterMap[field];
		delete $scope.filterDisplayMap[field];
		if(_.size(angular.copy($scope.filterMap)) == 0){
			$scope.showFilterPane = false;
		}
		$scope.refreshAfterFilter();
	};
	$scope.filterRecords = function(){
		angular.copy($scope.filterDisplayMapOnFilter, $scope.filterDisplayMap);
		$scope.showFilterPane = true;
		$scope.refreshAfterFilter();
	};

	$scope.generateFilterString = function( quickSearchText ){
		$scope.newFilterClause = '';		
		if($scope.filterClause != undefined && $scope.filterClause != null && $scope.filterClause != '') {

			//angular.extend($scope.newFilterClause, $scope.filterClause );
			//angular.copy($scope.filterClause, $scope.newFilterClause);
			$scope.newFilterClause = ''+$scope.filterClause;
		}
		var filterString = '';
		for(filter in $scope.filterMap){
			filterString += ' AND '+ $scope.filterMap[filter];			
		}
		if(filterString != '') {
			if($scope.newFilterClause != null && $scope.newFilterClause != '') {
				$scope.newFilterClause = $scope.newFilterClause + filterString;
		}else{
			$scope.newFilterClause = filterString.substring(4,filterString.length);
		}

		}
		if($scope.StickySearchCriteria != ''){
			//$scope.newFilterClause = $scope.newFilterClause+' AND '+$scope.StickySearchCriteria;
			////console.log('$scope.newFilterClause--------->>>>>',$scope.newFilterClause);
		}
		$scope.generateQuickSearchFilter( quickSearchText );
		$scope.pageNumber = 1;
		
	};
	$scope.refreshAfterFilter = function(){
		showLoadingPopUp();
		$scope.generateFilterString( $scope.QuickSearchReportText );

		j$.removeCookie($scope.uniqueSessionId+'filterMapInst');
		j$.removeCookie($scope.uniqueSessionId+'filterDispMap');
		j$.cookie($scope.uniqueSessionId+"filterMapInst", JSON.stringify( $scope.filterMap ));
		j$.cookie($scope.uniqueSessionId+"filterDispMap", JSON.stringify( $scope.filterDisplayMap ));
		$scope.getPageRecords();
	};
	$scope.setLoading = function(loading) {
		$scope.isLoading = loading;
	};
	
	$scope.filterFlexTable = function(selectedFilter,index){                      
		/* Clearing all filters start */
		//jQueryMagicSuggest.clear();                  
		$scope.QuickSearchReportText = '';
		$scope.isFilterCriteriaChanged = true;  
		//console.log('autoSuggestionObject[$scope.flexTable_dataTableConfigName]--->>>',autoSuggestionObject[$scope.flexTable_dataTableConfigName]);
		autoSuggestionObject[$scope.flexTable_dataTableConfigName ].clear();
		j$('#quickSearchText1').val(''); // ng-model is not restting hence jquery.                
		$scope.filterDisplayMapOnFilter = {};
		$scope.filterDisplayMap={};
		$scope.filterMap = {};
		j$.removeCookie($scope.uniqueSessionId+"filterDispMap");
		j$.removeCookie($scope.uniqueSessionId+'filterMapInst');
		//$scope.clearAllFilter();
		/* Clearing all filters end */
		for(var i =0 ;i<$scope.FlexTableFilterListViewValues.length ;i++) {
			$scope.FlexTableFilterListViewValues[i].isSelected = false;
		}
		$scope.FlexTableFilterListViewValues[index].isSelected = true;                
		$scope.isStickySelectionChanged = false;                
		$scope.filterClause  = selectedFilter.clause;                                                         
		$scope.updatedHeader = selectedFilter.label;
		$scope.generateFilterString('');
		$scope.getPageRecords();
	}

	$scope.updateFlexHeader = function(){
		if($scope.FlexTableFilterListViewValues){
			for(var i=0;i<$scope.FlexTableFilterListViewValues.length ;i++){
				if($scope.FlexTableFilterListViewValues[i].isSelected == true){
					return $scope.FlexTableFilterListViewValues[i].label;
				}
			}
		}                
	}
	$scope.getCounter = function(row,column){
		$scope.counter = $scope.counter == undefined ? 0 : $scope.counter+1;                                		
	}
	$scope.getHide = function(row, col, hiddenColumn) {						
			if (row != undefined) {
				var conditionsArray = hiddenColumn;
				var isHide = false;
				if (conditionsArray != undefined) {
					for (var i = 0; i < conditionsArray.length; i++) {
						if (conditionsArray[i].operator == '=') {
							if (row[conditionsArray[i].field] == conditionsArray[i].value && col == hiddenColumn[i].column) {
								isHide = true;  
								if ($scope.hiddenColumns == undefined) {
									$scope.hiddenColumns = {};
								}
								$scope.hiddenColumns[col] = $scope.hiddenColumns[col] == undefined ? 0 : $scope.hiddenColumns[col]+1;                                								
								break;                                      
							}
						}
						else if (conditionsArray[i].operator == '!=') {
							if (row[conditionsArray[i].field] != conditionsArray[i].value && col == hiddenColumn[i].column) {
								isHide = true; 
								if ($scope.hiddenColumns == undefined) {
									$scope.hiddenColumns = {};
								}
								$scope.hiddenColumns[col] = $scope.hiddenColumns[col] == undefined ? 0 : $scope.hiddenColumns[col]+1;                                 								
								break;                                         
							}
						}                                
					}		
					if (isHide == false) {
						return 'false';
					}else{
						
					}					
					return 'true';
				}
			}                                    
		}

	$scope.paintFlexTable = function(flexTableResult){
		//console.log('@@@ in paintFlexTable ');
		$scope.noRecords = false;
		$scope.keyValueMap = flexTableResult.KeyValueMap;
		$scope.flexTableHeader = flexTableResult.FlexTableHeader;
		$scope.objectMetadata = flexTableResult.ObjectMetaData;
		$scope.tableConfigInfo = flexTableResult.ConfigInfo;
		//console.log('@@@ $scope.tableConfigInfo '+ $scope.tableConfigInfo);
		$scope.dataTableInfoFC = flexTableResult.DataTableInfo.FilterClause;
		$scope.flexTableHeader = $scope.tableConfigInfo.Header;
		$scope.dataTableInfoMap =  flexTableResult.DataTableInfoMap;
		if($scope.dataTableInfoMap != undefined){
			//console.log('@@@ $scope.dataTableInfoMap is defined');
			$scope.StickySearchFieldApiName = flexTableResult.DataTableInfoMap.StickySearchFieldApiName;
			$scope.StickySearchLastSearchTerm = flexTableResult.DataTableInfoMap.StickySearchLastSearchTerm;
			$scope.ConfigFilterClause = flexTableResult.DataTableInfoMap.ConfigFilterClause;
			$scope.FlexTableFilterListViewValues = flexTableResult.DataTableInfoMap.LabelToFilterClause;
			$scope.StickySearchPlaceHolderText = flexTableResult.DataTableInfoMap.StickySearchPlaceHolderText;                             
			$scope.StickyObjectName = flexTableResult.DataTableInfoMap.SObjectName;
			//console.log('@@@ flexTableResult.DataTableInfoMap.SObjectName '+flexTableResult.DataTableInfoMap.SObjectName);
			//console.log('@@@ $scope.StickyObjectName '+$scope.StickyObjectName);
		}                
		$scope.FlexTableHistoryList = flexTableResult.ChildRelationShips;
		$scope.FlexTableHistoryRelatedList = flexTableResult.ChildRelationShipList;
		$scope.DefaultMap = flexTableResult.DefaultMap;
		$scope.NoChildPresent= flexTableResult.NoChildPresent;
		//console.log('@@@ $scope.DefaultMap '+$scope.DefaultMap);
		if($scope.NoChildPresent == 'false' || $scope.NoChildPresent == false){
			for (var key in $scope.DefaultMap ) {
					//console.log('@@@ key '+key);
					$scope.data.historyObj = key;
					break;
			  }                   
		}
		//$scope.data.historyObj = flexTableResult.childObject;
		$scope.ShowFilterViewList = false;
		var activeCount = 0;
		if($scope.FlexTableFilterListViewValues != undefined){
			for(var i=0;i<$scope.FlexTableFilterListViewValues.length;i++){

				if($scope.FlexTableFilterListViewValues[i].isActive == true){
					activeCount++;
				}                        
			}
			if(activeCount == 1){
				//$scope.ShowFilterViewList = false;  
				$scope.flexTableHeader = $scope.FlexTableFilterListViewValues[i-1].Label;
			}else if(activeCount > 1){
				$scope.ShowFilterViewList = true;  
				$scope.updatedHeader = $scope.updateFlexHeader();
			}                    
			/*if($scope.ShowFilterViewList){
				$scope.updatedHeader = $scope.updateFlexHeader();
			}else{
				$scope.updatedHeader = $scope.flexTableHeader;
			} */                                       
		}                
		
		$scope.FlexTableMetaData = flexTableResult;
		//$scope.ShowFilterViewList = flexTableResult.DataTableInfoMap.ShowFilterViewList;
		$scope.FlexTableRecordId = flexTableResult.ConfigInfo.FlexTableRecordId;   
		$scope.FlexKeyValueMap = flexTableResult.KeyValueMap;             
		if($scope.StickySearchFieldApiName){
			$scope.showStickySearchTextBox = true;
		}else{
			$scope.showStickySearchTextBox = false;
		}                
		/* 1. Create the action buttons, links, etc. information */
		$scope.actionInfo = flexTableResult.ActionInfo;
		$scope.topActionItems = [];
		$scope.rowActionItems = [];
		$scope.headerButtonLinkCount = 0;
		$scope.offset = flexTableResult.Offset;

	   if(flexTableResult.DataTableInfoMap== undefined){
		   $scope.hideRowLevelAction = true;
	   }else{
		   $scope.hideRowLevelAction = ( flexTableResult.DataTableInfoMap.RowLevelActionForDisabled == undefined || flexTableResult.DataTableInfoMap.RowLevelActionForDisabled == '' || flexTableResult.DataTableInfoMap.RowLevelActionForDisabled == 'Show') ? false : true;
	   }
		//$scope.hideRowLevelAction = ( flexTableResult.DataTableInfoMap.RowLevelActionForDisabled == undefined || flexTableResult.DataTableInfoMap.RowLevelActionForDisabled == '' || flexTableResult.DataTableInfoMap.RowLevelActionForDisabled == 'Show') ? false : true;
	   // $scope.hideRowLevelAction = true;
		$scope.userOffset;
		//$scope.hideQuickSearchText = false;

		for(a in $scope.actionInfo) {
			$scope.addAction = true;
			/*if(($scope.actionInfo[a].HideForUserType == 'Internal' && $scope.tableConfigInfo.IsInternalUser == 'true')
				||($scope.actionInfo[a].HideForUserType == 'External' && $scope.tableConfigInfo.IsInternalUser == 'false')
				||($scope.actionInfo[a].HideForUserType == 'Both')
				){
					$scope.addAction = false;
			}else*/if($scope.actionInfo[a].StandardAction == 'New' && $scope.objectMetadata.IsCreateable != 'true'){
				$scope.addAction = false;
			}else if($scope.actionInfo[a].StandardAction == 'Edit' && $scope.objectMetadata.IsUpdateable != 'true'){
				$scope.addAction = false;
			}else if($scope.actionInfo[a].StandardAction == 'Delete' && $scope.objectMetadata.IsDeletable != 'true'){
				$scope.addAction = false;
			}
			if($scope.addAction == true){
				var name = a;
				if($scope.actionInfo[a].Location == 'Top'){
					if($scope.actionInfo[a].HeaderActionDisplayType == 'Button' || $scope.actionInfo[a].HeaderActionDisplayType == 'Link'){
						$scope.headerButtonLinkCount = $scope.headerButtonLinkCount + 1;
					}
					$scope.topActionItems.push({"name":name,"confirmationMessage":$scope.actionInfo[a].ConfirmationMessage,"showConfirmationBox":$scope.actionInfo[a].ShowConfirmationBox,"isModalDialog":$scope.actionInfo[a].IsModalDialog,"standardAction":$scope.actionInfo[a].StandardAction,"actionURL":$scope.actionInfo[a].ActionURL,"actionBehavior":$scope.actionInfo[a].ActionBehavior,"actionClass":$scope.actionInfo[a].ActionClass,"sequence":$scope.actionInfo[a].Sequence,"height":$scope.actionInfo[a].Height,"width":$scope.actionInfo[a].Width,"icon":$scope.actionInfo[a].Icon,"HeaderActionDisplayType":$scope.actionInfo[a].HeaderActionDisplayType,"toolTip":a,"dataTableActionObj":$scope.actionInfo[a].DataTableActionObj,"hideDecisionField":$scope.actionInfo[a].HideDecisionField,"hideAction" :$scope.actionInfo[a].hideAction,"HideDecisionForTopButtons":$scope.actionInfo[a].HideDecisionForTopButtons,"modalTitle":$scope.actionInfo[a].ModalTitle});
				}else if($scope.actionInfo[a].Location == 'Row'){
					$scope.rowActionItems.push({"name":name,"confirmationMessage":$scope.actionInfo[a].ConfirmationMessage,"showConfirmationBox":$scope.actionInfo[a].ShowConfirmationBox,"isModalDialog":$scope.actionInfo[a].IsModalDialog,"standardAction":$scope.actionInfo[a].StandardAction,"actionURL":$scope.actionInfo[a].ActionURL,"actionBehavior":$scope.actionInfo[a].ActionBehavior,"actionClass":$scope.actionInfo[a].ActionClass,"sequence":$scope.actionInfo[a].Sequence,"height":$scope.actionInfo[a].Height,"width":$scope.actionInfo[a].Width,"icon":$scope.actionInfo[a].Icon,"dataTableActionObj":$scope.actionInfo[a].DataTableActionObj,"hideDecisionField":$scope.actionInfo[a].HideDecisionField,"hideAction" :$scope.actionInfo[a].hideAction,"modalTitle":$scope.actionInfo[a].ModalTitle});
				}
			}
		}
		/*if($scope.headerButtonLinkCount > 1){
			$scope.hideQuickSearchText = true;
		}*/
		/* 2. Create the column information */
		/* Special case handling for Task object */
		$scope.objectName = flexTableResult.DataTableInfo.ObjectName;

		var InitialFilterClause = flexTableResult.IntialFilterClause;		
		if( flexTableResult.IntialFilterClause != undefined && flexTableResult.IntialFilterClause != '' ) {
			$scope.filterClause = flexTableResult.IntialFilterClause;
			//angular.copy($scope.filterClause, $scope.newFilterClause);
			if( $scope.newFilterClause == undefined || $scope.newFilterClause == '' || $scope.newFilterClause == null ) {
				$scope.newFilterClause = ''+ $scope.filterClause;				
			} else {
				$scope.newFilterClause = $scope.newFilterClause+' and '+ $scope.filterClause;				
			}
		}

	   // $scope.renderBtnAsToPDF = flexTableResult.RenderDownloadPDFMenuAsButton;
		//$scope.newFilterClause = $scope.filterClause;
		$scope.fieldsMap = flexTableResult.FieldMetadata;
		$scope.renderBtnPDF = flexTableResult.renderBtnForPDF;
		$scope.renderBtnCSV = flexTableResult.renderBtnForCSV;
		$scope.columnsNameList = flexTableResult.ColumnsNameList;
		for(var i=0; i < $scope.columnsNameList.length;i++) {
			var f = $scope.columnsNameList[i];
			var showFilter = true;

			   // Pankaj : Need to discuss
			/*if(InitialFilterClause != undefined && InitialFilterClause != ''){
				if(InitialFilterClause.indexOf(f) != -1){
					showFilter = false;
				}
			}*/
			var fieldDataType;
			var displayName;
			var columnWidth='';
			if(flexTableResult.FieldMetadata[f].Type == 'PICKLIST'){
				$scope.pickListMap[f] = flexTableResult.FieldMetadata[f].PicklistValues;
			}
			var refFieldPath = 'row';
			var refFieldValue ;
			if(flexTableResult.FieldMetadata[f].Type == 'REFERENCE' && f.indexOf('.') != -1){
				var refField = f.split('.');				
				for(var j=0;j < refField.length - 1 ; j++){
					refFieldPath += '[\''+refField[j]+'\']'
				}
				refFieldValue = refField[j];				
				if(refFieldValue.toLowerCase() == 'name'){
					fieldDataType = 'REFERENCE';
					displayName = flexTableResult.FieldMetadata[f].Label;
					if(j > 1){
						displayName = flexTableResult.FieldMetadata[f].ReferenceFieldInfo.Label;
					}
				}else{
					refFieldPath += '[\''+refFieldValue+'\']';
					fieldDataType = flexTableResult.FieldMetadata[f].ReferenceFieldInfo.Type;
					displayName = flexTableResult.FieldMetadata[f].ReferenceFieldInfo.Label;
				}

			}else{
				refFieldPath += '[\''+f+'\']';
				refFieldValue = f;
				fieldDataType = flexTableResult.FieldMetadata[f].Type;
				displayName = flexTableResult.FieldMetadata[f].Label;
			}

			if( flexTableResult.FieldMetadata[f].ColumnWidth != undefined && flexTableResult.FieldMetadata[f].ColumnWidth != '' && flexTableResult.FieldMetadata[f].ColumnWidth != null && flexTableResult.FieldMetadata[f].ColumnWidth != 'null' ) {
				columnWidth = flexTableResult.FieldMetadata[f].ColumnWidth + "%";
			}

			$scope.columns.push({"field": f,"refField": refFieldPath ,"refFieldValue":refFieldValue,"displayName":displayName,"width":columnWidth,"showFilter":showFilter,"type":fieldDataType,"term1":'',"term2":''});
			
		}
		/* 3. Create the table data information */
		if($scope.flexTable_isPreview != 'true'){
			$scope.tableData = flexTableResult.DataTableInfo.RecordsList;
		}
		if($scope.tableData != undefined && $scope.tableData.length == 0){
			$scope.noRecords = true;
		}

		/* 4. Create the table configuration information */


		$scope.pageSizeArray = flexTableResult.ConfigInfo.PageSizes.split(';');

		/* 5. Create the table configuration information required between server calls*/
		$scope.queryColumns = flexTableResult.DataTableInfo.QueryColumns;
		$scope.hideDecisionFields = flexTableResult.DataTableInfo.HideDecisionFields;
		$scope.resultSize = flexTableResult.DataTableInfo.ResultSize;
		for(i = 0;i <  $scope.pageSizeArray.length; i++){
			$scope.pageSizes.push( $scope.pageSizeArray[i]);
		}
		if(flexTableResult.DataTableInfo.ResultSize >= flexTableResult.ConfigInfo.DefaultPageSize && flexTableResult.DataTableInfo.ResultSize <= flexTableResult.ConfigInfo.MaxRecordsCount){
			$scope.pageSizes.push('All');
		}		
		$scope.totalRecordsCount = flexTableResult.DataTableInfo.ResultSize;
		$scope.totalRecords = 'Total Records: '+ flexTableResult.DataTableInfo.ResultSize;
		$scope.pageNumber = flexTableResult.DataTableInfo.PageNumber;
		$scope.totalPages = flexTableResult.DataTableInfo.TotalPages;
		$scope.pageSize = flexTableResult.DataTableInfo.PageSize;
		$scope.hasNext = flexTableResult.DataTableInfo.HasNext;
		$scope.hasPrevious = flexTableResult.DataTableInfo.HasPrevious;
		$scope.pageInfo = 'Page ' + $scope.pageNumber + ' of ' +  $scope.totalPages;
		$scope.sortFieldName =  flexTableResult.DataTableInfo.SortColumn;
		if($scope.sortFieldName == undefined){
			$scope.sortFieldName = '';
		}
		$scope.sortDirection =  flexTableResult.DataTableInfo.SortDir;
		if($scope.sortDirection == undefined){
			$scope.sortDirection = 'ASC';
		}
		/* 6. Set the loading to false */
		$scope.setLoading(false);
		
		/* 7.Column Hide*/
		$scope.hiddenColumn = angular.fromJson(flexTableResult.DataTableInfoMap.HideColumnsJSON);		
		$scope.hiddencolumns = [];
		
		/*8.Flex Table Header for 508*/		
		
		console.log('skipNavMap[$scope.flexTable_dataTableConfigName+flexTable]====',skipNavMap[$scope.flexTable_dataTableConfigName+'flexTable']);
		if(skipNavMap[$scope.flexTable_dataTableConfigName+'flexTable'] == undefined){							
			$scope.getNavLinks2();
		}
		
	};
	$scope.getNavLinks2 = function(){
		j$( '#skipNav' ).empty();
		j$('.skipNavSectionItem2').each(function() {
	        if (j$(this).text() != '') {
	            var hrefId = j$(this).attr('id');
	            console.log('==hrefId==1123', hrefId);
	             j$('#skipNav').append('<a id="'+hrefId+'SkipLink" class="skip-main" href="#'+j$(this).attr('id')+'">Skip to: '+j$(this).text()+'</a>');	            		    
	        }	        	       
	    });
		
	};
	
	$scope.getPageRecords = function(){
		$scope.isRefresh = true;
		if($scope.pageNumber == 0){
			$scope.pageNumber = 1;
		}   
		//console.log('====> $scope.pageNumber '+$scope.pageNumber);  
		//console.log('====> $scope.isRefresh '+$scope.isRefresh);  
		 
		var paramMap = {};
		paramMap.queryColumns = $scope.queryColumns;
		paramMap.hideDecisionFields = $scope.hideDecisionFields;
		//console.log('====> $scope.data.historyObj '+$scope.data.historyObj);
		paramMap.pageNumber = $scope.pageNumber;
		paramMap.pageSize = $scope.pageSize;
		//console.log('====> $scope.isRefresh '+$scope.pageSize); 
		paramMap.sortFieldName = $scope.sortFieldName;
		paramMap.sortDirection = $scope.sortDirection;
		paramMap.searchTerm = $scope.searchTerm;
		if($scope.isHistory == true){
			//console.log('In history');
			paramMap.objectName = $scope.data.historyObj;
			paramMap.isHistory = true;
			paramMap.newFilterClause = $scope.dataTableInfoFC;
		}else{
			paramMap.newFilterClause = $scope.newFilterClause;
			paramMap.objectName = $scope.objectName;
			paramMap.isHistory = false;
		}
		paramMap.isSOSL = $scope.isSOSL;
		paramMap.stickySearchTerm = $scope.StickyUserSelection;
		paramMap.flexTableId = $scope.FlexTableRecordId;
		paramMap.isSelectionChagned = $scope.isStickySelectionChanged;      
		paramMap.stickySearchCriteria = $scope.StickySearchCriteria; 
		paramMap.isFilterCriteriaChanged = $scope.isFilterCriteriaChanged;     
		paramMap.updatedFlexHeader = $scope.updatedHeader;   
		paramMap.flexKeyValueMap = angular.toJson($scope.FlexKeyValueMap);                         		   
		var deferred = $q.defer();
		Visualforce.remoting.Manager.invokeAction(
			_RemotingFlexTableActions.UpdateFlexTableWithStickySearch,
			paramMap,
			function(flexTableResult, event){
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(flexTableResult);
						$scope.tableData = flexTableResult.RecordsList;
						$scope.noRecords = false;
						if($scope.tableData.length == 0){
							$scope.noRecords = true;
						}

						$scope.queryColumns = flexTableResult.QueryColumns;
						$scope.hideDecisionFields = flexTableResult.HideDecisionFields;
						$scope.objectName = flexTableResult.ObjectName;
						$scope.resultSize = flexTableResult.ResultSize;
						$scope.totalRecords = 'Total Records: '+ flexTableResult.ResultSize;
						$scope.pageNumber = flexTableResult.PageNumber;
						$scope.totalPages = flexTableResult.TotalPages;
						$scope.pageSize = flexTableResult.PageSize;
						$scope.hasNext = flexTableResult.HasNext;
						$scope.hasPrevious = flexTableResult.HasPrevious;
						$scope.pageInfo = 'Page ' + $scope.pageNumber + ' of ' +  $scope.totalPages;
						//$scope.setLoading(false);
						$scope.setSelectAllCheckBox();
						$scope.windowURL = '' ;
						$scope.isRefresh = false;
					});
				}
				$scope.isSOSL = false;
				$scope.isStickySelectionChanged = false;
				$scope.isFilterCriteriaChanged = false;
				hideLoadingPopUp();
			  //  refreshTables();
					/*if(j$('.actionColumn').text().trim() == 'Actions'){
						//j$('#leftActionColumnHeader').hide()
						j$('.actionColumn').hide();
					}else{
						j$('.actionColumn').show();
					}*/
				adjustToggleBarHeightUI();

			   // //console.log('Resizing Iframe..............ln 1616..........................');

			   // autoresizeIframe();
			},
			{ buffer: false, escape: false, timeout: 30000 }
		);
		return deferred.promise;
	};
	
	$scope.showTooltip= function(thisVal,parentId){ 
                    //console.log('parentId',parentId); 
                    //console.log('thisVal',thisVal);
                    
                      if(parentId != null || parentId != undefined || parentId != ''){
                        //console.log('==in minilayout--->>');
                          j$('#'+thisVal).tooltipster({                    
                            theme: 'tooltipster-shadow',
                            content :'Loading...',
                            updateAnimation:false,
                            contentAsHTML:true, 
                            interactive:true, 
                            minWidth:100, 
                            position:'right',   
                         //   autoClose:false,                        
                            functionBefore: function(origin, fetchLayout) {
                                fetchLayout();
                                Visualforce.remoting.Manager.invokeAction(
                                    _RemotingFlexTableActions.fetchLayout,parentId,
                                    function(result, event){
                                        if (event.status) {
                                        //console.log('origin--->>',origin);
                                        //console.log('result--->>',result);
                                            if(!jQuery.isEmptyObject(result)){
                                                tooltipContent =  '<div class="container-fluid">'+
                                                            '<div class="panel border-ext">'; 
                                                tooltipContent = $scope.getMiniLayoutContent(result,origin);
                                                tooltipContent +='</div></div>';
                                                //console.log(tooltipContent );
                                                origin.tooltipster('content', tooltipContent );
                                                //console.log('origin--22->>',origin);
                                            }else{
                                                //console.log('In else part--->>');
                                                j$('#'+thisVal.id).tooltipster('hide');
                                            }
                                            
                                        }
                                });
                            }                   
                        }); 
                        j$('#'+thisVal).tooltipster('show');                
                       }
                }; 
                
                $scope.getMiniLayoutContent = function(result,origin){
                    var tooltip = tooltipContent;
                    //console.log('RESULT',result);
                    var tab = result.Tab;
                    var record = result.Record;                           
                    if(tab != null) {
                    j$.each(result.Tab, function(i, tabVal) { 
                      j$.each(tabVal.pageBlocks, function(j, pageBlockVal) {  
                          tooltip +='<p class="tooltip-title">'+record ['Name']+'</p>';   
                          tooltip +='<div id="TooltipBody" class="panel-body">';
                          tooltip +='<form class="form-horizontal" role="form">'
                          j$.each(pageBlockVal.fields, function(k, field) {   
                                if(field.hideField != 'true')   {                     
                                    tooltip += '<div class="form-group border-ext ">';
                                    tooltip += ' <div class="row">';                                   
                                        tooltip += ' <div class="col-md-4 col-xs-4 col-sm-4">';
                                        tooltip += field.fieldLabel;
                                        tooltip += '</div>';
                                  
                                        var fieldVal =  j$('<span/>').html(encodeURI(record [field.fieldAPIName])).text(); 
                                        if(field.dataType == 'CURRENCY'){
                                            fieldVal = '$' + fieldVal;
                                        }
                                        //console.log('[-----',fieldVal );                                   
                                        tooltip += ' <div class="col-md-8 col-xs-8 col-sm-8" style="word-wrap:break-word; font-weight: bold;">';
                                        tooltip += decodeURI(fieldVal);     
                                        tooltip += '</div>';                                                                                     
                                    tooltip += '</div>';
                                    tooltip += '</div>';
                                    tooltip +='<br/>';
                                }   
                                                                                     
                          })
                      })
                    })
                    tooltip +='</form>';
                    tooltip +='</div>';             
                    }else {        				
        				tooltip +='<p class="tooltip-title">'+record ['Name']+'</p>';
        				tooltip +='<div id="TooltipBody" class="panel-body">';
        				tooltip +='<form class="form-horizontal" role="form">';
        				tooltip += '<div class="form-group border-ext ">';
        				tooltip += ' <div class="row">';                                   
        				tooltip += ' <div class="col-md-4 col-xs-4 col-sm-4">';
        				tooltip += 'Name';
        				tooltip += '</div>';				
        				tooltip += ' <div class="col-md-8 col-xs-8 col-sm-8" style="word-wrap:break-word; font-weight: bold;">';
        				tooltip += record ['Name'];     
        				tooltip += '</div>';   
        				tooltip += '</div>';
        				tooltip += '</div>';
        				tooltip +='</form>';
        				tooltip += '</div>';
        			}
                    return tooltip;
                };
	
	$scope.applyStickySearch = function(stickySearchTerm,stickyFieldApiName,existingFilterCriteria){		
		$scope.isRefresh = true;
		var newSearchCriteriaList = [];
		var newSearchCriteria='';
		stickySearchTerm += '';
		if($scope.pageNumber == 0){
			$scope.pageNumber = 1;
		}		
		if(stickySearchTerm){
			newSearchCriteriaList = stickySearchTerm.split(',');
			for(var i=0;i<newSearchCriteriaList;i++){
				newSearchCriteria += '\''+newSearchCriteriaList[i]+'\''+','
			}                   
			newSearchCriteria = newSearchCriteria.slice(0, -1);			         
			if($scope.newFilterClause){
				$scope.lastestFilterClause = existingFilterCriteria + 'AND '+stickyFieldApiName+' IN('+stickySearchTerm+')';
			}else{
				$scope.lastestFilterClause = 'WHERE '+stickyFieldApiName+' IN('+stickySearchTerm+')';
			}
		}else{
			$scope.lastestFilterClause = existingFilterCriteria;
		}   
				                       
		var paramMap = {};
		paramMap.queryColumns = $scope.queryColumns;
		paramMap.hideDecisionFields = $scope.hideDecisionFields;
		paramMap.objectName = $scope.objectName;
		paramMap.pageNumber = $scope.pageNumber;
		paramMap.pageSize = $scope.pageSize;
		paramMap.sortFieldName = $scope.sortFieldName;
		paramMap.sortDirection = $scope.sortDirection;
		paramMap.searchTerm = $scope.searchTerm;
		paramMap.newFilterClause = $scope.lastestFilterClause;
		paramMap.isSOSL = $scope.isSOSL;
		paramMap.stickySearchTerm = stickySearchTerm;
		paramMap.flexTableId = $scope.FlexTableRecordId;
		var paramMapString = JSON.stringify(paramMap);
		var deferred = $q.defer();
		Visualforce.remoting.Manager.invokeAction(
			_RemotingFlexTableActions.UpdateFlexTableWithStickySearch,paramMapString,                    
			function(flexTableResult, event){
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(flexTableResult);
						$scope.tableData = flexTableResult.RecordsList;
						$scope.noRecords = false;
						if($scope.tableData.length == 0){
							$scope.noRecords = true;
						}

						$scope.queryColumns = flexTableResult.QueryColumns;
						$scope.hideDecisionFields = flexTableResult.HideDecisionFields;
						$scope.objectName = flexTableResult.ObjectName;
						$scope.resultSize = flexTableResult.ResultSize;
						$scope.totalRecords = 'Total Records: '+ flexTableResult.ResultSize;
						$scope.pageNumber = flexTableResult.PageNumber;
						$scope.totalPages = flexTableResult.TotalPages;
						$scope.pageSize = flexTableResult.PageSize;
						$scope.hasNext = flexTableResult.HasNext;
						$scope.hasPrevious = flexTableResult.HasPrevious;
						$scope.pageInfo = 'Page ' + $scope.pageNumber + ' of ' +  $scope.totalPages;
						//$scope.setLoading(false);
						$scope.setSelectAllCheckBox();
						$scope.windowURL = '' ;
						$scope.isRefresh = false;
					});
				}
				$scope.isSOSL = false;
				hideLoadingPopUp();
			  //  refreshTables();
					/*if(j$('.actionColumn').text().trim() == 'Actions'){
						//j$('#leftActionColumnHeader').hide()
						j$('.actionColumn').hide();
					}else{
						j$('.actionColumn').show();
					}*/
				adjustToggleBarHeightUI();

			   // //console.log('Resizing Iframe..............ln 1616..........................');

			   // autoresizeIframe();
			},
			{ buffer: false, escape: false, timeout: 30000 }
		);
		return deferred.promise;
	};

	$scope.refreshLayoutSpecificFlexTables = function() {	   
		$scope.isRefresh = true;
		if($scope.pageNumber == 0){
			$scope.pageNumber = 1;
		}

		var deferred = $q.defer();
		Visualforce.remoting.Manager.invokeAction(
			_RemotingFlexTableActions.GetPageRecords,
			$scope.queryColumns,$scope.hideDecisionFields,$scope.objectName,$scope.pageNumber,$scope.pageSize,$scope.sortFieldName,$scope.sortDirection, $scope.searchTerm,$scope.newFilterClause,false,
			function(flexTableResult, event){
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(flexTableResult);
						////console.log('flexTableResult--->>',flexTableResult);
						$scope.tableData = flexTableResult.RecordsList;
						////console.log('$scope.tableData.length --->>',$scope.tableData.length );
						$scope.noRecords = false;
						if($scope.tableData.length == 0){
							$scope.noRecords = true;
						}
						$scope.queryColumns = flexTableResult.QueryColumns;
						$scope.hideDecisionFields = flexTableResult.HideDecisionFields;
						$scope.objectName = flexTableResult.ObjectName;
						$scope.resultSize = flexTableResult.ResultSize;
						$scope.totalRecords = 'Total Records: '+ flexTableResult.ResultSize;
						$scope.pageNumber = flexTableResult.PageNumber;
						$scope.totalPages = flexTableResult.TotalPages;
						$scope.pageSize = flexTableResult.PageSize;
						$scope.hasNext = flexTableResult.HasNext;
						$scope.hasPrevious = flexTableResult.HasPrevious;
						$scope.pageInfo = 'Page ' + $scope.pageNumber + ' of ' +  $scope.totalPages;
						//$scope.setLoading(false);
						$scope.setSelectAllCheckBox();
						$scope.windowURL = '' ;
						$scope.isRefresh = false;
					});
				}
				hideLoadingPopUp();
				////console.log('this--refrs',j$('.actionColumn').text().trim());
					/*if(j$('.actionColumn').text().trim() == 'Actions'){
						//console.log('Action0000--refrs');
						//j$('#leftActionColumnHeader').hide()
						j$('.actionColumn').hide();
					}else{
					////console.log('else-refrs');
						j$('.actionColumn').show();
					}*/
				adjustToggleBarHeightUI();			 
			},
			{ buffer: false, escape: false, timeout: 30000 }
		);
		return deferred.promise;

	};
	/* Initialize the skinny flex table */
	$scope.initFlexSkinnyTable = function(){
		$scope.setLoading(true);
		var deferred = $q.defer();

		Visualforce.remoting.Manager.invokeAction(
			_RemotingFlexTableActions.FetchInitialSearchData,
			$scope.flexTable_searchTerm,$scope.flexTable_objectName,$scope.flexTable_phaseName,$scope.flexTable_keyValueMap,$scope.flexTable_listKeyValueMap,$scope.sforce1,
			function(flexTableResult, event){
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(flexTableResult);
						$scope.paintFlexTable(flexTableResult);
					});
				} else{
					$scope.$apply(function () {
						$scope.errorCreatingTable = true;
						$scope.setLoading(false);
						$scope.messages.push({type: 'danger',msg: 'Error creating table:' + event.message});
					});
					hideLoadingPopUp();
			   }
			},
			{ buffer: false, escape: false}
		);
		return deferred.promise;
	};
	/* Initialize the flex table */

	/* Initialize the flex table */
	$scope.initFlexTable = function(){
		$scope.setLoading(true);
		var deferred = $q.defer();
		var filterMapInst = j$.cookie($scope.uniqueSessionId+"filterMapInst");
		if( filterMapInst != undefined && filterMapInst !='' ) {
			$scope.filterMap = j$.parseJSON( filterMapInst );
		}
		var filterDispMap = j$.cookie($scope.uniqueSessionId+"filterDispMap");
		if( filterDispMap != undefined && filterDispMap !='' ) {
			$scope.filterDisplayMap = j$.parseJSON( filterDispMap );
		}
		var pageNumber = j$.cookie($scope.uniqueSessionId+"pageNumber");
		if( pageNumber != undefined && pageNumber !='' ) {
			$scope.pageNumber = pageNumber;
			$scope.initialParameters['PageNumber'] = $scope.pageNumber;
		}
		var pageSize = j$.cookie($scope.uniqueSessionId+"pageSize");
		if( pageSize != undefined && pageSize !='' ) {
			$scope.pageSize = pageSize;
			$scope.initialParameters['PageSize'] = $scope.pageSize;
		}
		var sortFieldName = j$.cookie($scope.uniqueSessionId+"sortFieldName");
		if( sortFieldName != undefined && sortFieldName !='' ) {
			$scope.sortFieldName = sortFieldName;
			$scope.initialParameters['OrderBy'] = $scope.sortFieldName;
		}
		var sortDirection = j$.cookie($scope.uniqueSessionId+"sortDirection");
		if( sortDirection != undefined && sortDirection !='' ) {
			$scope.sortDirection = sortDirection;
			$scope.initialParameters['SortDirection'] = $scope.sortDirection;
		}
		$scope.generateFilterString( $scope.QuickSearchReportText );
		if( $scope.newFilterClause == undefined ) {
			$scope.newFilterClause = '';
		}		
		if($scope.flexTable_isN2GGridSearch == 'true' && $scope.flexTable_filterClauseGridSearch != ''){
			console.log('new filterclause should be given to remote method: ',$scope.flexTable_filterClauseGridSearch);
			$scope.newFilterClause = $scope.flexTable_filterClauseGridSearch;
			$scope.initialParameters['FilterClause'] = $scope.flexTable_filterClauseGridSearch;
			$scope.initialParameters['isN2GGridSearch'] = $scope.flexTable_isN2GGridSearch;
		}
		console.log('$scope.initialParameters fetchInitialDataWithFilter: ',$scope.initialParameters);
		Visualforce.remoting.Manager.invokeAction(
			_RemotingFlexTableActions.fetchInitialDataWithFilter,
			$scope.flexTable_dataTableConfigName ,$scope.flexTable_keyValueMap,$scope.flexTable_listKeyValueMap,$scope.sforce1,$scope.newFilterClause,$scope.initialParameters,
			function(flexTableResult, event){
				if (event.status) {
					userTimeZone = flexTableResult.UserLocale;
					$scope.userOffset = getUserOffset(userTimeZone);
					$scope.$apply(function () {
						deferred.resolve(flexTableResult);						
						if(flexTableResult.DataTableInfo != undefined ){
							if($scope.flexTable_gridSearchTerm != ''){
								console.log('Enter into the flexabke search');
								$scope.paintFlexTable(flexTableResult);
								$scope.quickSearchCall($scope.flexTable_gridSearchTerm,null);
							}else if(flexTableResult.DataTableInfo.RecordsList != undefined ){
								$scope.paintFlexTable(flexTableResult);
							}
						}
					});
				}
				else{
					$scope.$apply(function () {
						$scope.errorCreatingTable = true;
						$scope.setLoading(false);
						$scope.messages.push({type: 'danger',msg: 'Error creating table:' + event.message});
					});
				}
				hideLoadingPopUp();
				/*if(j$('.actionColumn').text().trim() == 'Actions'){
					//j$('#leftActionColumnHeader').hide()
					j$('.actionColumn').hide();
				}*/
			},
			{ buffer: false, escape: false}
		);
		return deferred.promise;
	};

	/* Initializing history flex table*/
	$scope.initHistoryFlexTable = function(objName){
		//console.log('Into initHistoryFlexTable function!!!');
		$scope.setLoading(true);
		$scope.columns = [];
		$scope.pageSizes = [];				
		var deferred = $q.defer();
		Visualforce.remoting.Manager.invokeAction(
			_RemotingFlexTableActions.FetchInitialHistoryData,
			$scope.flexTable_dataTableConfigName ,objName,$scope.data.historyObj,$scope.flexTable_isFieldHistoryFlexTable,$scope.flexTable_parentRecord,$scope.flexTable_keyValueMap,$scope.flexTable_listKeyValueMap,$scope.sforce1,
			function(flexTableResult, event){
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(flexTableResult);
						//console.log('Into initHistoryFlexTable function '+flexTableResult.DataTableInfo.RecordsList);
						//console.log('@@@ flexTableResult.DataTableInfoMap.SObjectName '+flexTableResult.DataTableInfoMap.SObjectName);
					   if(flexTableResult.DataTableInfo.RecordsList != undefined){
							$scope.paintFlexTable(flexTableResult);
					   }
					});
				}
				else{
					$scope.$apply(function () {
						$scope.errorCreatingTable = true;
						$scope.setLoading(false);
						$scope.messages.push({type: 'danger',msg: 'Error creating table:' + event.message});
						hideLoadingPopUp();
					});
				}
				/*if(j$('.actionColumn').text().trim() == 'Actions'){
					j$('.actionColumn').hide();
				}*/
			},
			{ buffer: false, escape: false}
		);
		return deferred.promise;
	};
	
	$scope.closeFlexModal = function(){
		j$('#'+$scope.flexTableId+'modalDiv').modal('hide') ;
		$scope.getPageRecords();
	}


	/* Initialize the preview flex table */
	$scope.initFlexTablePreview = function(){
		//console.log('Initialize the preview flex table!!!');
		$scope.setLoading(true);
		var deferred = $q.defer();
		Visualforce.remoting.Manager.invokeAction(
			_RemotingFlexTableActions.FetchPreviewData,
			$scope.flexTable_dataTableConfigName ,$scope.sforce1,
			function(flexTableResult, event){
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(flexTableResult);
						$scope.paintFlexTable(flexTableResult);
					});
				}
				else{
					$scope.$apply(function () {
						$scope.errorCreatingTable = true;
						$scope.setLoading(false);
						$scope.messages.push({type: 'danger',msg: 'Error creating table:' + event.message});
						hideLoadingPopUp();
					});
				}
			},
			{ buffer: false, escape: false}
		);
		return deferred.promise;
	};

	//$scope.defaultFiscalValue = '';
	$scope.isHistory = false;
	/*Set the sforce1 varianle */
	if( (typeof sforce != 'undefined') && (sforce != null) ) {
		$scope.sforce1 = true;
	}else{
		$scope.sforce1 = false;
	}
	/* This is the initial load function called */ 
	if($scope.flexTable_dataTableConfigName  != ''){
		//console.log('flexTable_dataTableConfigName In js not null!!!');
		//console.log('$scope.flexTable_isFieldHistoryFlexTable---->>>',$scope.flexTable_isFieldHistoryFlexTable);
		$scope.isSkinnyTable = false;
		if($scope.flexTable_isPreview == 'true'){
			//console.log('flextable preview is true here!!!');
			$scope.initFlexTablePreview();
		}else if($scope.flexTable_isFieldHistoryFlexTable == 'true'){
			//console.log('flexTable_isFieldHistoryFlexTable is true calling initHistoryFlexTable!!!');
			$scope.initHistoryFlexTable($scope.flexTable_sObjectOfFieldHistory);
			$scope.isHistory = true;
		}else{
			//console.log('Entered into else part');
			$scope.initFlexTable();
		}

	}else if($scope.flexTable_searchTerm !='' && $scope.flexTable_objectName != '' && $scope.flexTable_phaseName != ''){
		$scope.isSkinnyTable = true;
		$scope.initFlexSkinnyTable();
	}
	$scope.extraParameters = '?isdtp=vw&';

	if( flexTable_FiscalYear != '' &&  flexTable_FiscalYear != undefined && flexTable_FiscalYear != 'undefined'){
		$scope.extraParameters += 'pv0='+flexTable_FiscalYear+'&';
	}
	if( flexTable_Division != '' &&  flexTable_Division != undefined && flexTable_Division != 'undefined'){
		$scope.extraParameters += 'pv1='+flexTable_Division;
	}

});
flexTableApp.filter('orderObjectBy', function() {
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
flexTableApp.filter('noFractionCurrency',[ '$filter', '$locale',
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
flexTableApp.filter('percentage', ['$filter', function ($filter) {
  return function (input, decimals) {
	return $filter('number')(input , decimals) + '%';
  };
}]);
flexTableApp.directive("customhtml", function($compile,$parse){
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
				var content = texAreaContent.replace(/PlaceHolderID/g, scope.flexTableId );
				element.html(content).show();
				element.attr('title', text);
				$compile(element.contents())(scope);
			}
		}
	}
});

flexTableApp.directive("dateTimePicker", function($compile,$filter){
	return {
		restrict: 'A',
		scope: {
			timePicker: '=',
			format:'@'
		},
		require: 'ngModel',
		link: function(scope, element, attr,ngModel){
			ngModel.$formatters.push(function(value) {
				if( value != null && value != undefined && !isNaN(value)) {
					if(scope.timePicker == false){
						return $filter('date')(value, 'MM/dd/yyyy');
					}else{
						return $filter('date')(value, 'MM/dd/yyyy h:mm a');
					}
				}
				return '';
			});
			ngModel.$parsers.push(function (value) {
				return Date.parse(value);
			});
			element.datetimepicker({
				timepicker:scope.timePicker,
				format: scope.format
			});
		}
	}
});

flexTableApp.directive("stickySearch",function($q,$compile){
    return {
        restrict : 'A',
        scope : {
            stickySearchPlaceholder : '=', 
            stickySearchLastSearchTerm : '=',
            flexTable : '=',
            flexTableIdStickySearch : '=',
            parentScope : '='
        },
        link : function(scope,element,attr){            
            scope.flexTable_dataTableConfigName = scope.flexTable;          
            scope.flexTableId = scope.flexTableIdStickySearch;
            //console.log('scope.flexTableIdStickySearch--->>>',scope.flexTableIdStickySearch);
            //var appScope = angular.element(document.getElementById(scope.flexTableId)).scope();
            //var parentScope = appScope.$$childTail;
            var parentScope = scope.parentScope;
            //console.log('parentScope--->>>',parentScope);            
            var lastSearchTerms = [];
            var initData = [];
            var counter = 0;
            if(scope.stickySearchLastSearchTerm){
                lastSearchTerms = scope.stickySearchLastSearchTerm.split(',');              
                if(lastSearchTerms.length > 0){
                    for(var i=0; i<lastSearchTerms.length; i++){
                        var temp = lastSearchTerms[i].slice(1,-1);
                        counter++;
                        initData.push({id:temp,name:temp});
                    }
                }
            }   

            var jQueryMagicSuggest = j$('#StickySearchTableId'+scope.flexTable_dataTableConfigName ).magicSuggest({
                width:250,                              
                allowFreeEntries : false,
                hideTrigger: false,
                toggleOnClick: false,
                expanded: false,
                expandOnFocus: false,
                highlight: true,
                selectionPosition:'inner', 
                selectionStacked: true,                      
                matchCase:false, 
                strictSuggest: false,  
                maxSelection : 5,
                noSuggestionText : '',                                                                                                              
                placeholder : scope.stickySearchPlaceholder                                                                
            });             
            //console.log('jQueryMagicSuggest--->>>',jQueryMagicSuggest);
            //console.log('scope.flexTable_dataTableConfigName--->>>',scope.flexTable_dataTableConfigName);
            autoSuggestionObject[scope.flexTable_dataTableConfigName ] = jQueryMagicSuggest;            
            j$('.ms-trigger').children().remove();
            j$( "input[name*='StickySearch']" ).attr('aria-label','Search');// 508 
            j$('.ms-trigger').append('<i class="fa fa-search"></i>');
            var child = j$('.ms-trigger').children()
            j$(child).css('margin-left','5px');        
            jQueryMagicSuggest.setSelection(initData);                                            
            j$(jQueryMagicSuggest).on("keyup",function(e,m,v){
            //e.preventDefault();                
            if(v.keyCode == 37 || v.keyCode == 38 || v.keyCode == 39 || v.keyCode == 40 || v.keyCode == 13){
            }else{              
                var userInput = this.input[0].value;                
                userInput = userInput.replace(/[\%\*]/g, "");
                userInput = userInput.trim();               
                if(userInput.length == 0){
                    j$(jQueryMagicSuggest)[0].setData([]);
                    j$(jQueryMagicSuggest)[0].collapse();
                }else{                  
                    this.expand(true);
                    var paramMap ={};
                    var filterClause='';
                    var suggestions = [];
                    paramMap.SearchCriteria = userInput;//this.input[0].value;
                    paramMap.ObjectName = parentScope.StickyObjectName;
                    paramMap.FieldApiName = parentScope.StickySearchFieldApiName;                       
                    paramMap.newFilterClause = parentScope.newFilterClause;                         
                    paramMap.lastSearchedTerm = scope.stickySearchLastSearchTerm;   
                    paramMap.Counter = counter;

                    if(scope.stickySearchLastSearchTerm == undefined){
                        scope.stickySearchLastSearchTerm = '';
                    }
                    paramMap.existingFilterClause = parentScope.filterClause; 
                    paramMap.Counter = counter;                              
                    var paramMapString = JSON.stringify(paramMap);      
                    //console.log('paramMapString--->>>',paramMapString);
                    var deferred = $q.defer();
                     Visualforce.remoting.Manager.invokeAction(
                    _RemotingFlexTableActions.FetchStickySearchSuggestionsData,paramMapString,
                        function(stickySearchSuggestions,event){
                            if(event.status){
                                scope.$apply(function(){
                                    deferred.resolve(stickySearchSuggestions);                                  
                                    suggestions = stickySearchSuggestions.SuggestionList;
                                    if(suggestions){                                        
                                        j$(jQueryMagicSuggest)[0].setData(suggestions); 
                                        if(v.keyCode != 13){
                                            j$(jQueryMagicSuggest)[0].expand();                          
                                        }                                                
                                    }
                                });
                            }else{
                                alert(event.message);
                            }
                        },
                        {buffer:true,escape:false}
                    );
                }                 
            }                           
        });
            
            j$(jQueryMagicSuggest).on('selectionchange', function(e,m){
                j$(jQueryMagicSuggest)[0].collapse();               
                var selected  = this.getSelection();                                             
                var searchTerm = '';
                if(selected.length > 0){
                    for(var i=0; i<selected.length; i++){
                        counter++;                      
                        var selectedName = selected[i].name.trim();
                        selectedName = selectedName.replace(/'/g,"\\'");
                        searchTerm += '\''+selectedName+'\''+',';
                    }   
                    searchTerm  = searchTerm.slice(0, -1);
                    parentScope.StickySearchCriteria = parentScope.StickySearchFieldApiName+' IN('+searchTerm+')';                             
                    parentScope.StickyUserSelection = searchTerm;
                }else{      
                    counter = 1;  
                    j$(jQueryMagicSuggest)[0].setData([]);                                                                                          
                    parentScope.StickySearchCriteria = '';
                    parentScope.StickyUserSelection = '';  
                    parentScope.StickySearchLastSearchTerm = '';                            
                } 
                scope.stickySearchLastSearchTerm = searchTerm;                      
                var quickSearchText = parentScope.QuickSearchReportText;                    
                if(!parentScope.isFilterCriteriaChanged){
                    parentScope.generateFilterString(quickSearchText);  
                    parentScope.isStickySelectionChanged = true;    
                    parentScope.getPageRecords();
                    parentScope.$apply();                               
                }                                                                           
            });                                                             
        }
    }
});                  

flexTableApp.filter('millSecondsToTimeString', function() {
	return function(millseconds) {
		var seconds = Math.floor(millseconds / 1000);
		var days = Math.floor(seconds / 86400);
		var hours = Math.floor((seconds % 86400) / 3600);
		var minutes = Math.floor(((seconds % 86400) % 3600) / 60);
		var timeString = '';
		if(days > 0) timeString += (days > 1) ? (days + " days ") : (days + " day ");
		if(hours > 0) timeString += (hours > 1) ? (hours + " hours ") : (hours + " hour ");
		if(minutes >= 0) timeString += (minutes > 1) ? (minutes + " minutes ") : (minutes + " minute ");
		return timeString;
	}
});

flexTableApp.factory('Scopes', function ($rootScope) {
    var mem = {};
 
    return {
        store: function (key, value) {
            $rootScope.$emit('scope.stored', key);
            mem[key] = value;
        },
        get: function (key) {
            return mem[key];
        }
    };
});


function closeFlexModal(){
	j$('#'+$scope.flexTableId+'modalDiv').modal('hide') ;
	angular.element(document.getElementById($scope.flexTableId)).scope().getPageRecords();
	angular.element(document.getElementById($scope.flexTableId)).scope().$apply();
}

function refreshTables() {
	var pageLayoutName = flexTable_pgLayoutName;
	if(pageLayoutName != null && pageLayoutName != '') {
		Visualforce.remoting.Manager.invokeAction(
			_RemotingFlexTableActions.refreshTables,
			pageLayoutName,
			function(result, event) {
					if(event.type === 'exception') {						
						//console.log(event);
					}
					else if (event.status) {						
						if(result != null) {
							if(result.length > 0) {
								for(var i = 0; i< result.length; i++) {
									if(document.getElementById(result[i].trim()) != null) {
										angular.element(document.getElementById(result[i].trim())).scope().refreshLayoutSpecificFlexTables();
									}
								}
							}
						}
						if(result == 'Success') {
						}
						else {
						}
					}
					else {
						//console.log(event.message);
					}
			}
		);
	}
}
// the winURL should be in this format - /apex/<PageName>?id=<ID>&header=<MODAL HEADER>&tableId=<FLEXTABLENAME>
function openFlexModal(url ){
	angular.element(document.getElementById($scope.flexTableId)).scope().openModalFromHTML(url);
	angular.element(document.getElementById($scope.flexTableId)).scope().$apply();
}

function loadingScreen(){
	j$.blockUI(
		{
			message: '<img src="/img/loading.gif" alt="Loading gif"/>'
		}
	);
	setTimeout(j$.unblockUI, 5000);
}

var userTimeZone = 0;
function formatLocalDt(dateObj) {
		tzo = -dateObj.getTimezoneOffset(),
		dif = tzo >= 0 ? '+' : '-',
		pad = function(num) {
			var norm = Math.abs(Math.floor(num));
			return (norm < 10 ? '0' : '') + norm;
		};
	return dateObj.getFullYear()
		+ '-' + pad(dateObj.getMonth()+1)
		+ '-' + pad(dateObj.getDate());
}

function formatLocalDate(dateObj) {
	tzo = -dateObj.getTimezoneOffset(),
	dif = tzo >= 0 ? '+' : '-',
	pad = function(num) {
		var norm = Math.abs(Math.floor(num));
		return (norm < 10 ? '0' : '') + norm;
	};
	return dateObj.getFullYear()
	+ '-' + pad(dateObj.getMonth()+1)
	+ '-' + pad(dateObj.getDate())
	+ 'T' + pad(dateObj.getHours())
	+ ':' + pad(dateObj.getMinutes())
	//+ ':' + pad(dateObj.getSeconds())
	+ ':00'
	//+'Z' ;
	+ getUserOffset( userTimeZone );
}

function getUserOffset(s) {
	var ms = s % 1000;
	s = (s - ms) / 1000;
	var secs = s % 60;
	s = (s - secs) / 60;
	var mins = s % 60;
	var hrs = (s - mins) / 60;
	var absHrs = Math.abs(Math.floor(hrs));
	return (hrs>=0 ? '+' : '-' ) + (absHrs <10 ? '0'+absHrs :absHrs) + ':' + (mins <10 ? '0'+mins : mins) ;
}

function autoresizeIframe() {
  //  resizeIframe(null);
}

function resizeIframe(ifr) {
	var iframe = j$("[id$='iframeContentId']");
}

function resizeParent(docHeight){
	if(resizeFlag){		
		j$('iframe').css('height', docHeight);
	}
}

function autoResize(id){	
	var newheight;
	var newwidth;
	if(document.getElementById(id) != null){
		newheight = document.getElementById(id).contentWindow.document.body.scrollHeight;
		newwidth = document.getElementById(id).contentWindow.document.body.scrollWidth;
	}
	if(newheight != null)
		document.getElementById(id).height = (newheight) + "px";
	if(newwidth != null)
		document.getElementById(id).width = (newwidth) + "px";
}

function PreventEnter(e) {                                       
	   if (e.which == 13) {
			e.preventDefault();
			//do something   
	   }
}

function closeModalAndRefreshFlexTable(flextablId, message) {
	angular.element(document.getElementById(flextablId+'modalDivCloseIcon')).trigger('click');	
	angular.element(document.getElementById(flextablId)).scope().messages.push({type: 'info',msg:message});
	angular.element(document.getElementById(flextablId)).scope().$apply();
}