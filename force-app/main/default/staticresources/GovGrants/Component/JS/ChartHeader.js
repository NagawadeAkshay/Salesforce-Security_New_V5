var j$ = jQuery.noConflict();
var isEnhancedView = '';
function closeRecordsModal(modalId){
	
	j$('#'+modalId+'recordsModal').addClass(' ');
	j$('#'+modalId+'recordsModal').css('display', 'none');
	j$('#'+modalId+'recordsModal').attr('aria-hidden', 'true');
	if(isEnhancedView == "true")
		j$('#'+modalId+'enhancedView').css('display', 'block');
	let scope = angular.element(document.getElementById(modalId+'selectSizePerPage')).scope();
	if(scope)
		scope.itemsPerPage = scope.sizes[0].id;
}

function closeEnhancedViewModal(modalId){
	//debugger;
	j$('#'+modalId).addClass(' ');
	j$('#'+modalId).css('display', 'none');
	j$('#'+modalId).attr('aria-hidden', 'true');
	j$('#enahncedView').attr('src','');
}

function updateIframeSource(chartId,chartNameParam,chartTypeName,recordId) {
	chartModalId =chartId;
	lastFocus = document.activeElement; 
   window.open('/apex/'+chartHeader_namespace+'ChartsEnhancedView?chartId='+chartId+'&chartName='+chartNameParam+'&chartType='+chartTypeName+'&recordId='+recordId+'&isEnhanced=true&FiscalYear='+chartHeader_parametersFiscalYear+'&phase='+chartHeader_parametersPhase, height='450',width='600');
   document.title = chartNameParam;
     //j$('#enahncedView'+chartId).attr('src','/apex/'+chartHeader_namespace+'ChartsEnhancedView?chartId='+chartId+'&chartName='+chartNameParam+'&chartType='+chartTypeName+'&isEnhanced=true&FiscalYear='+chartHeader_parametersFiscalYear+'&phase='+chartHeader_parametersPhase);
}

var asideAppCtrl = function ($scope, $q, $sce, $filter){
	var phaseNameParam = chartHeader_phaseNameParam;
	$scope.aside = {title: 'Title', content: 'Hello Aside<br />This is a multiline message!'};
	$scope.columns = [];
	$scope.inputTextFilterOptions = ["Contains","Starts with","Ends with"];
	$scope.picklistFilterOptions = ["Equals","Not equals"];
	$scope.defaultPicklistValue = '';
	$scope.showDropdown = false;
	$scope.pickListMap = {};
	$scope.orderByField;
  	$scope.reverseSort = false;
	$scope.recordValueToSearch = '';
	$scope.TableCurrencySymbol = '';
	$scope.myRecordsScope = [];
	$scope.lengthOfTable = 0;
	$scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 5;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    $scope.pagedItems = [];
	$scope.keysOfItem = [];
	$scope.firstLoad = false;
	$scope.myRecordsList = [];
	$scope.filterMap = {};
	$scope.items = [];
	$scope.allowedDeccimal = [];
	$scope.columnType = [];
	$scope.chartName = chartHeader_chartNameParam;
	$scope.chartId = chartHeader_chartId;
	$scope.ShowMangeCharts =  false;
	//$scope.isEnhancedView;
	$scope.sizes = [
	{  id: '1',  name: '5'  }, 
	{  id: '2',  name: '10' },
	{  id: '3',  name: '15' },
	{  id: '4',  name: '20' },
	{  id: '5',  name: 'All' }];

	$scope.sort = {
                sortingOrder : 'id',
                reverse : false
            };
    $scope.searchVal = '';
	$scope.gap = 5;
	$scope.sortedColumn;

	if (j$.cookie('setup') == 'present') {
		$scope.ShowMangeCharts = true;
	}
	//Added  this for sorting table data
	$scope.testIndex = function (index) {

		alert('Index of Column is ::: '+index);
	}

    $scope.changeSorting = function (col,colIndex) {
		//debugger;
		var column = $scope.removeWhiteSpace(col+colIndex);
		col = $scope.chartId+col;
        var sort = $scope.sort;
        if (sort.sortingOrder == column) {
            sort.reverse = !$scope.sort.reverse;
        } else {
            sort.sortingOrder = column;
            sort.reverse = false;
		}

		if($scope.sortedColumn != undefined){
			if($scope.sortedColumn != col+colIndex){
				let sortedColumnHeadHtml = document.getElementById($scope.sortedColumn);
				if(sortedColumnHeadHtml != null){
					if(sortedColumnHeadHtml.classList.contains('desc')){
						sortedColumnHeadHtml.classList.remove('desc');
					}
					else if(sortedColumnHeadHtml.classList.contains('asc')){
						sortedColumnHeadHtml.classList.remove('asc');
					}
				}
			}
		}

		let colHeadHtml = document.getElementById(col+colIndex);
		if(colHeadHtml.classList.contains('desc')){
			colHeadHtml.classList.remove('desc');
			colHeadHtml.classList.add('asc');
		}
		else if(colHeadHtml.classList.contains('asc')){
			colHeadHtml.classList.remove('asc');
			colHeadHtml.classList.add('desc');
		}
		else{
			colHeadHtml.classList.add('asc');
		}
		$scope.sortedColumn = col+colIndex;
        $scope.changeSearching($scope.searchVal);
    };

	//Added by Rahul for  filtering feature in Enhanced table on search
	$scope.$on("dataSenderEvent", function(evt,data,isEnhanced){ 
  		$scope.myRecordsScope = [];
  		$scope.myRecordsList = [];
  		$scope.items = [];
		$scope.filteredItems = [];
		isEnhancedView = isEnhanced;
		$scope.recordValueToSearch = '';
		//debugger;
		document.getElementById($scope.chartId+'myTableSearch').value = '';
  		$scope.itemsPerPage = 5;
  		$scope.allowedDeccimal = data.RecordsTable.ColumnDecimalAllowed;
  		var columns = data.RecordsTable.RecordTableCol;
  		$scope.columnType = data.RecordsTable.RecordTableColType;
  		$scope.TableCurrencySymbol = data.RecordsTable.TableCurrencySymbol;

  		//for(var recMap in data.RecordsTable.sortedRecIds){
		var indexOfRec;
		for(indexOfRec = 0; indexOfRec < data.RecordsTable.sortedRecIds.length; indexOfRec++){
			//debugger;
			let recMap = data.RecordsTable.sortedRecIds[indexOfRec];
  			var list = {};
  			list['id'] = recMap;
  			list['values'] = data.RecordsTable.RecordsTable[recMap];
  			$scope.myRecordsScope.push(list);
			  var myRecord = {};
			  let columnIndex = 0;
  			for(var colVal in data.RecordsTable.RecordsTable[recMap]){
  				var col = columns[colVal];
  				if(typeof col != 'function'){
  					var colmType = $scope.columnType[colVal];
  					var colRowValue = data.RecordsTable.RecordsTable[recMap][colVal];
  					if((colmType == 'DOUBLE' || colmType == 'PERCENT') && colRowValue != '' ){
  						if(colRowValue.toString().includes(".")){
							//let tmp = colRowValue.toString().substring(0, colRowValue.toString().indexOf(".") + 3).replace(',','')
							colRowValue = parseFloat(colRowValue.toString().substring(0, colRowValue.toString().indexOf(".") + 3).split(',').join(''));
						}
  						myRecord[$scope.removeWhiteSpace(col) + (columnIndex).toString()] = parseFloat(colRowValue);
  						//$scope.toFixedTrunc(String(parseFloat(colRowValue).toFixed(allowedDeccimal[colVal])));
  					}
  					else if(colmType == 'CURRENCY' && colRowValue != ''){
  						//colRowValue = colRowValue.substr(1);
  						if(colRowValue.toString().includes(".")){
							colRowValue = parseFloat(colRowValue.toString().substring(0, colRowValue.toString().indexOf(".") + 3).split(',').join(''));
						}
  						myRecord[$scope.removeWhiteSpace(col) + (columnIndex).toString()] = parseFloat(colRowValue);
  							//$scope.toFixedTrunc(String(parseFloat(colRowValue).toFixed(allowedDeccimal[colVal])));
  					}
  					else{
  						myRecord[$scope.removeWhiteSpace(col) + (columnIndex).toString()] = colRowValue;
  					}
				  }
				  columnIndex++;
  			}
  			myRecord['id'] = recMap;
  			$scope.myRecordsList.push(myRecord);

  			$scope.items.push(myRecord);
		}
		$scope.keysOfItem;
		if($scope.items[0] != undefined){
			let keysItem = Object.keys($scope.items[0]);
			keysItem.pop(keysItem.length - 1);
			$scope.keysOfItem = keysItem;
		}
		$scope.firstLoad = true;
		$scope.changeSearching('');
		$scope.firstLoad = false;
	});
	// Added by Rahul for rendering the table
	$scope.changeSearching = function (recordValueToSearch) {
		$scope.searchVal = recordValueToSearch;
		var filteredItemsss = [];
		if(recordValueToSearch == ''){
			filteredItemsss = $scope.items;
			$scope.lengthOfTable = filteredItemsss.length;
			$scope.search(filteredItemsss);
		}else{
			for(let item in $scope.items){
				if(typeof $scope.items[item] != 'function'){
					let isPresent = false;
					for(let key in $scope.keysOfItem){
						if(typeof $scope.keysOfItem[key] != 'function'){
							if($scope.columnType[key] === 'CURRENCY' || $scope.columnType[key] === 'PERCENT' || $scope.columnType[key] === 'DOUBLE' || $scope.columnType[key] === 'DATE'){
								var numbers = /(?<!\S)(?=.)(0|([1-9](\d*|\d{0,2}(,\d{3})*)))?(\.\d*[1-9])?(?!\S)/;
								var cur = /([^,0-9]\D*)([0-9]*|\d*\,\d*)$/;
								var dateRE = /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[1-2][0-9]|3[01])[\/]\d{4}$/;
								let SearchVal
								if(recordValueToSearch.match(numbers))
									SearchVal = recordValueToSearch.replace(/,/g,'');
								else if(recordValueToSearch.match(dateRE)){
										var TempDate = recordValueToSearch.split("\/");
										SearchVal = TempDate[2]+'-'+TempDate[0]+'-' +TempDate[1]+' '; 
								}else if(recordValueToSearch.match(cur))
									SearchVal = Number(recordValueToSearch.replace(/[^0-9\.-]+/g,""));
								if($scope.items[item][$scope.keysOfItem[key]] == SearchVal){
									isPresent = true;
								}
							}else{
								if($scope.items[item][$scope.keysOfItem[key]].toLowerCase().indexOf(recordValueToSearch.toLowerCase()) != -1){
									isPresent = true;
								}
							}
						}
					}
					if(isPresent){
						filteredItemsss.push($scope.items[item]);
					}
				}
			}
			$scope.lengthOfTable = filteredItemsss.length;
			$scope.search(filteredItemsss);
		}
	};

    var searchMatch = function (haystack, needle) {
        if (!needle) {
            return true;
        }
        return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    };
    // Added by Rahul for setting size for Table
    $scope.setSizeOfTable = function(sizeIndex){
    	//debugger;
    	if(sizeIndex == 1){
    		$scope.itemsPerPage = 5;
    	} else if(sizeIndex == 2){
    		$scope.itemsPerPage = 10;
    	}else if(sizeIndex == 3){
    		$scope.itemsPerPage = 15;
    	}else if(sizeIndex == 4){
    		$scope.itemsPerPage = 20;
    	}else if(sizeIndex == 5){
    		$scope.itemsPerPage = $scope.lengthOfTable;
    	}
    	$scope.changeSearching($scope.searchVal);
    };

    $scope.search = function (filteredItemsss) {
    	if($scope.firstLoad){
			$scope.filteredItems = filteredItemsss;
		}else{
			if ($scope.sort.sortingOrder !== '') {
				$scope.filteredItems = $filter('orderBy')(filteredItemsss, $scope.sort.sortingOrder, $scope.sort.reverse);
			}
		}
        $scope.currentPage = 0;
        $scope.groupToPages();
    };

    // calculate page in place
    $scope.groupToPages = function () {
        $scope.pagedItems = [];
        for (var i = 0; i < $scope.filteredItems.length; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
            }
        }
    };

    $scope.range = function (size,start, end) {
        var ret = [];        
        if (size < end) {
            end = size;
            start = size-$scope.gap;
        }
        for (var i = start; i < end; i++) {
            ret.push(i);
        }        
        return ret;
    };
    // Added following to give support to change Pages
    $scope.firstPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage = 0;
            $scope.currentPage;
        }
    };

    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };

    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
    };

	$scope.lastPage = function () {
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage = $scope.pagedItems.length - 1;
            $scope.currentPage;
        }
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    //following code is for providing the CSS arrow of sorting Order
    $scope.selectedCls2 = function (column) {
        if (column == $scope.sort.sortingOrder) {
            return ('fa fa-chevron-' + (($scope.sort.reverse) ? 'down' : 'up'));
        }
        else {
            return 'fa fa-sort'
        }
    };

	$scope.removeWhiteSpace = function(str){
		if(str != null)
			return str.replace(/\s/g, '');
		else
			return '';
	};

	$scope.DateFormat = function(colRowValue, colValueIndex){
		if(colRowValue == '' || colRowValue == undefined)
			return;
		var DateFor = new Date(colRowValue);
		if(DateFor.getHours() != 0 && DateFor.getMinutes() != 0)
			return $filter('date')(DateFor, "MM/dd/yyyy h:mm a");
		else 
			return $filter('date')(DateFor, "MM/dd/yyyy");
	}
		$scope.toFixedTrunc = function(colRowValue, colValueIndex){
		//debugger;
		if(colRowValue == ''){
			return;
		}
		if(colRowValue.toString().includes(".")){
			colRowValue = parseFloat(colRowValue.toString().substring(0, colRowValue.toString().indexOf(".") + 3));
		}
		//console.log(colRowValue);
		var parts = colRowValue.toString().split(".");
		var CommaSeparatedNum = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
		
		if($scope.columnType[colValueIndex] == 'CURRENCY')
			return $scope.TableCurrencySymbol+CommaSeparatedNum;
		else if($scope.columnType[colValueIndex] == 'PERCENT')
			return colRowValue.toFixed($scope.allowedDeccimal[colValueIndex])+'%';
		else
			return CommaSeparatedNum;
	};

	if(phaseNameParam.indexOf('Dashboard') != -1){
		phaseNameParam =  chartHeader_parametersPhase;
		if(!phaseNameParam){
			phaseNameParam = chartHeader_defaultPhase;
		}
	}
	var userPrefId = chartHeader_userPrefId;
	var retURL = chartHeader_retURL;
	var phaseNameFromURL = chartHeader_phaseNameParam;
	$scope.openRecord = function(recordId){	
		window.open('/'+escape(recordId), '_blank');
	}
	$scope.openHelp =function(){
		window.open('/apex/Help?id='+$scope.Help, '_blank','width=900, height=700')
	}
	$scope.openManageChartPage = function(){		
		window.open('/apex/'+chartHeader_namespace+'ChartPreferenceEdit?nonAdminCall=true&id='+chartHeader_userPrefId+'&phaseName='+phaseNameFromURL+'&retURL='+retURL,'_blank','width=1400, height=500');
	}

	$scope.openMetaData = function(){
		window.open('/'+$scope.resultTable.chartSFId);
	}

	$scope.trustHTML = function (html) {
		return $sce.trustAsHtml(html);
	}
	$scope.initFilterHandler = function(){
		var deferred = $q.defer();
		Visualforce.remoting.Manager.invokeAction(
			_RemotingChartsAsideFilterActions.initPieChartFilterData ,
			$scope.chartName, phaseNameParam,
			function(result, event){
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(result);						
						$scope.NoFilters = result.NoFilters;
						for(field in result){
							$scope.columns.push({"field":result[field].field, "displayName":result[field].filterFieldLabel, "type" : result[field].filterFieldType});							
							if(result[field].filterFieldType == 'PICKLIST'){
								$scope.pickListMap[field] = result[field].picklistValues;
							}							
						}
					});
				}
				else if(event.type == 'exception') {
					//console.log('initFilterHandler Exception'+event);
				}
			},
			{ buffer: false, escape: false, timeout: 30000 }
		);
		return deferred.promise;
	}


	$scope.initFilterChart = function(selectedAction){
		var chartMap = {};
		chartMap.chartName = $scope.chartName;
		chartMap.phaseName = phaseNameParam;
		chartMap.selectedAction = selectedAction;
		// console.log('chartMap----',chartMap);
		// console.log('phaseNameParam----',phaseNameParam);
		// console.log('selectedAction12345----',selectedAction);
		var deferred = $q.defer();
		Visualforce.remoting.Manager.invokeAction(
			_RemotingChartsAsideFilterActions.getChartFilter,
			chartMap,
			function(result, event){
				//console.log('result123----',result);
				if (event.status) {
					$scope.$apply(function () {
						deferred.resolve(result);						
						
					});
				}else if (event.type == 'exception') {
					//console.log('initFilterChart Exception'+event);
				}
			},
			{ buffer: false, escape: false, timeout: 30000 }
		);
		return deferred.promise;
	}

	$scope.filterStringRecords = function(fieldName,criteria,searchTerm){
		var conditionString = '';
		if(fieldName != '' && criteria != '' && searchTerm != undefined){
			if(criteria == 'Contains'){
				conditionString = fieldName + ' LIKE \'%' +  searchTerm + '%\'';
				$scope.filterMap[fieldName] = conditionString;
			}else if(criteria == 'Ends with'){
				conditionString = fieldName+ ' LIKE \'%' +  searchTerm + '\'';
				$scope.filterMap[fieldName] = conditionString;
			}else if(criteria == 'Starts with'){
				conditionString = fieldName+ ' LIKE \'' +  searchTerm + '%\'';
				$scope.filterMap[fieldName] = conditionString;
			}else if(criteria == 'Equals'){
				conditionString = fieldName+ ' = \'' +  searchTerm + '\'';
				$scope.filterMap[fieldName] = conditionString;
			}else if(criteria == 'Not equals'){
				conditionString = fieldName+ ' != \'' +  searchTerm + '\'';
				$scope.filterMap[fieldName] = conditionString;
			}
		}		
	};
	$scope.filterRangeRecords = function(field,fromField,toField){
		var conditionString = '';
		if(fromField != undefined && toField != undefined){
			conditionString = field + ' >= ' +  fromField + ' AND ' + field + ' <= ' + toField;
			$scope.filterMap[field] = conditionString;
		}else if(fromField != undefined && toField == undefined){
			conditionString = field + ' >= ' +  fromField;
			$scope.filterMap[field] = conditionString;
		}else if(fromField == undefined && toField != undefined){
			conditionString = field + ' <= ' + toField;
			$scope.filterMap[field] = conditionString;
		}		
	};

	$scope.filterDateRecords = function(field,fromDate,toDate){
		var conditionString = '';		
		if(fromDate != undefined && toDate != undefined){
			var fromDateVal = fromDate.getDate();
			var fromMonthVal = fromDate.getMonth()+1;
			var fromYearVal = fromDate.getFullYear();
			var fromDisplayDate = fromMonthVal + '/' + fromDateVal + '/' + fromYearVal;
			var toDateVal = toDate.getDate();
			var toMonthVal = toDate.getMonth()+1;
			var toYearVal = toDate.getFullYear();
			var toDisplayDate = toMonthVal + '/' + toDateVal + '/' + toYearVal ;
			conditionString = ' CALENDAR_YEAR(' + field + ')' + ' >= ' +  fromYearVal + ' AND ' + ' CALENDAR_YEAR(' + field + ')' + ' <= ' + toYearVal;
			conditionString += ' AND CALENDAR_MONTH(' + field + ')' + ' >= ' +  fromMonthVal + ' AND ' + ' CALENDAR_MONTH(' + field + ')' + ' <= ' + toMonthVal ;
			conditionString += ' AND DAY_IN_MONTH(' + field + ')' + ' >= ' +  fromDateVal + ' AND ' + ' DAY_IN_MONTH(' + field + ')' + ' <= ' + toDateVal ;
			$scope.filterMap[field] = conditionString;
		}		
	};

	$scope.filterBooleanRecords = function(field,filterTerm){
		var conditionString = field + ' = ' +  filterTerm;
		$scope.filterMap[field] = conditionString;		
	};
	$scope.clearAllFilter = function(){
		$scope.filterMap = {};
		//$scope.newFilterClause = $scope.filterClause;
		$scope.showFilterPane = false;
	};
	$scope.removeFilter = function(field){
		delete $scope.filterMap[field];		
		if(_.size(angular.copy($scope.filterMap)) == 0){
			$scope.showFilterPane = false;			
		}
		$scope.refreshAfterFilter();
	};
	$scope.filterRecords = function(){
		$scope.showFilterPane = true;
		$scope.refreshAfterFilter();
	};
	$scope.refreshAfterFilter = function(){
		var filterString = '';		
		var filterMapSize = _.size(angular.copy($scope.filterMap));
		if(filterMapSize > 0){
			for(filter in $scope.filterMap){
				filterString += ' AND '+ $scope.filterMap[filter];
			}
			if($scope.filterClause != null && $scope.filterClause != '') {
				$scope.newFilterClause = $scope.filterClause + filterString;
			}else{
				$scope.newFilterClause = filterString.substring(4,filterString.length);
			}
		}		
		$scope.fetchData(phaseNameParam ,$scope.newFilterClause,$scope.chartName,$scope.chartId);		
		$scope.clearAllFilter();
	};	
	$scope.initFilterHandler();
	//$scope.initFilterChart('');
}


function toggleDataTable() {	
	j$(".modal-body").toggle("slow");		
	j$(".btnValueToggle span").html(j$(".btnValueToggle span").html() == 'View DataTable' ? 'Hide DataTable' : 'View DataTable');
}

function closeModal() {
	if(event.keyCode==27){
		window.parent.closeModalFromModalTemplate();
    }
}