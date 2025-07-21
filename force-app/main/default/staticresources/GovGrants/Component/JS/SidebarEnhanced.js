var sidebarEnhancedApp = angular.module('sidebarEnhancedApp', ['ui.bootstrap']);
//User Story 110688: Internal - Enhancement - Side bar vanishes after clicking on links from the regular Email or outlook - Part2
let str = j$('[id$=currentPhaseName]');
let cookieTabName = j$.cookie('apex__govgrants_tabname');
if(str.val()){
	cookieTabName = str.val();
	j$.cookie('apex__govgrants_tabname',cookieTabName);
}
sidebarEnhancedApp.value('config', {
	recordId: escape(currentRecordId),
	urlTabName: urlTabName,
	cookieTabName: cookieTabName,
	loggedInUserProfile: '',
	currentPhase: '',
	searchResultPage: ''
});

sidebarEnhancedApp.controller('sidebarEnhancedCtrl', ['$scope', 'config', '$sce', 'UserPrefCommunicator', function($scope, config, $sce, UserPrefCommunicator) {
	$scope.components = [];
	$scope.masterHierarchy = [];

	function arrangeHierarchy(headers, subheaders, contents, collapsedHeaders) {
		if(!Array.isArray(headers)) 
			return [];

		angular.forEach(headers, function(header) {
			if(j$.inArray(header.id, collapsedHeaders) !== -1) {
				header.isExpanded = false;
			}

			if(Array.isArray(subheaders[header.id])) {
				header.subHeaders = subheaders[header.id];
				angular.forEach(header.subHeaders, function(subheader) {
					if(Array.isArray(contents[subheader.id])) {
						subheader.contents = contents[subheader.id];
					}
				});
			}
		});
		return headers;
	}

	function setCollapsedComponents(components, collapsedArray) {
		if(!Array.isArray(components)) 
			return [];

		angular.forEach(components, function (component) {
			if(j$.inArray(component.id, collapsedArray) !== -1) {
				component.isExpanded = false;
			}
		});

		return components;
	}

	Visualforce.remoting.Manager.invokeAction(                
			_RemotingSidebarActions.fetchComponents, config,
			function(result, event){
				if(event.status){
					$scope.components = setCollapsedComponents(result['components'], result['collapsedArray']);
					$scope.masterHierarchy = arrangeHierarchy(result['headers'], result['subheaders'], result['contents'], result['collapsedArray']);
					$scope.availabilityMapper = {'task': false, 'analytics': false, 'activity': false, };
					angular.forEach($scope.components, function(component){
						component['hide'] = false;
					});
					angular.forEach($scope.masterHierarchy, function(header){
						if(((header.groupName =='task') || (header.groupName =='analytics') ||(header.groupName =='activity'))) {
							$scope.availabilityMapper[header.groupName] = true;
						}
					});
					angular.forEach($scope.components, function(component){
						if(((component.name =='task') || (component.name =='analytics') ||(component.name =='activity'))) {
							if($scope.availabilityMapper[component.name] == false) {
								component['hide'] = true;
							}
						}
					});
					config['loggedInUserProfile'] = result['loggedInUserProfile'];
					config['currentPhase'] = result['currentPhase'];
					config['searchResultPage'] = result['searchResultPage'];
					$scope.$apply();
				}    
			}, 
			{escape:false, buffer:false}
		);

	$scope.getTrustedHTML = function (argument) {
		return $sce.trustAsHtml(argument);
	}

	

	$scope.getIconHTML = function(componentType) {
		switch(componentType) {
        	case 'activity' : return '<i class="fa fa-flag" aria-label="Activity"></i>';
        		break;
    		case 'analytics' : return '<i class="fa fa-pie-chart" aria-label="Analytics"></i>';
    			break;
			case 'collab' : return '<i class="fa fa-comment" aria-label="Collab"></i>';
				break;
			case 'task' : return '<i class="fa fa-tasks" aria-label="Task"></i>';
				break;
			case 'recentlyviewed' : return '<i class="fa fa-clock-o" aria-label="Recently Viewed"></i>';
				break;
			case 'search' : return '<i class="fa fa-search" aria-label="Search"></i>';
				break;
			case 'externallinks' : return '<i class="fa fa-link" aria-label="External Links"></i>';
				break;
			case 'technicalsupport' : return '<i class="fa fa-life-ring" aria-label="Technical Support"></i>';
				break;
    	}
	};

	$scope.updateCollapsedState = function (id, type, isCollapsed) {
		var componentId = 'sidebarcomponent'+id;
		j$('.componentTitle').each(function(index) {
			if(j$(this).attr('id') !== componentId) {
				j$(this).removeClass('componentExpand');
			}
		});
		j$('[id="' + componentId + '"]').toggleClass('componentExpand');
		UserPrefCommunicator.updateCollapseCache(id, type, isCollapsed);
	};

	j$(document).on('click', function (event) {
		if(j$(event.target).parents('li.componentTitle').length == 0)
		j$('.componentTitle').removeClass('componentExpand');
	})

}]);

sidebarEnhancedApp.directive('renderer', function($compile){
	return {
		transclude: true,
		restrict: 'E',
		scope: {
			data: '=',
			renderObj: '='
		},
		controller: ['$scope', function($scope) {
			$scope.getTemplate = function() {
				switch($scope.renderObj.name) {
	            	case 'activity' :
            		case 'analytics' :
        			case 'collab' :
        			case 'task' : return '<collapsible expanded="renderObj.isExpanded" category="renderObj.name" hierarchy="data"></collapsible>';
        				break;
        			case 'recentlyviewed' : return '<recently-viewed expanded="renderObj.isExpanded"></recently-viewed>';
        				break;
        			case 'search' : return '<global-search expanded="renderObj.isExpanded"></global-search>';
        				break;
        			case 'externallinks' : return '<external-links expanded="renderObj.isExpanded"></external-links>';
        				break;
        			case 'technicalsupport' : return '<technical-support-links expanded="renderObj.isExpanded"></technical-support-links>';
        				break;
            	}
			}
		}],
		link: function(scope, element, attrs) {
        	var html = scope.getTemplate();
        	var ele = $compile(html)(scope);
        	element.replaceWith(ele);
    	}
	}
});

sidebarEnhancedApp.directive('globalSearch', function(config){
	var templateHTML ='';
	templateHTML += ' <div id="textBoxSearchId" class="textBoxSearch collapse" ng-class="{\'in\' : (expanded == true)}"> ';
	templateHTML += ' 	<div> ';                                                 
    templateHTML += '         <label for="isTypeAhead" class="hidden">Enter Search Text</label> ';
    templateHTML += '         <div class="input-group" ng-show="isTypeAhead"> ';
    templateHTML += '             <input name="isTypeAheadName"  aria-label="enter the term you wish to search for" id="isTypeAhead" '; 
    templateHTML += '             	ng-enter ="search()" type="search" typeahead-on-select="openViewPage($item)" '; 
    templateHTML += '             	autocomplete="off" typeahead-min-length="2" ';  
    templateHTML += '             	typeahead="item as item.Name for item in items($viewValue,this)" '; 
    templateHTML += '             	typeahead-template-url="customTemplate.html" object-name="{{default}}" '; 
    templateHTML += '             	ng-model="searchTerm" class="form-control" placeholder="Search..."/> ';
    templateHTML += '             <a class="input-group-addon focusOutline btn sidebarSearchBtn" id="basic-addon2" tabIndex="0" '; 
    templateHTML += '             	ng-enter ="search()" ng-click="search();"> ';
    templateHTML += '             		<i class="fa fa-search" aria-label="Press Enter to Search"></i> ';
    templateHTML += '             </a> ';
    templateHTML += '         </div> ';
    templateHTML += '         <div class="input-group" ng-show="!isTypeAhead"> ';
    templateHTML += '             <input id="isTypeNotAhead" ng-enter ="search()" type="search" '; 
    templateHTML += '             		object-name="{{default}}" ng-model="searchTerm" class="form-control" '; 
    templateHTML += '             		placeholder="Search..." aria-label="enter the term you wish to search for"/> ';
    templateHTML += '             <a class="input-group-addon focusOutline btn sidebarSearchBtn" id="basic-addon2" tabIndex="0" '; 
    templateHTML += '             	ng-enter ="search()" ng-click="search();"> ';
    templateHTML += '             	<i class="fa fa-search" aria-label="Press Enter to Search" ></i> ';
    templateHTML += '             </a> ';
    templateHTML += '         </div> ';
    templateHTML += '     </div> ';
    templateHTML += '     <div> ';
    templateHTML += '         <label for="selectSearchId"  class="hidden">Select Object</label> '; 
    templateHTML += '         <select id="selectSearchId" class="form-control " ng-model="default" '; 
    templateHTML += '         		ng-options="listViewOption.Name for listViewOption in listViewOptions" data-language="en"> ';
    templateHTML += '         </select> ';                                                               
    templateHTML += '     </div> ';
    templateHTML += '     <script type="text/ng-template" id="customTemplate.html"> ';
    templateHTML += '         <a class="btnCursorCls"> ';          
    templateHTML += '             <span class = "sidebar-search-type-ahead-cls" style="" bind-html-unsafe="match.label | typeaheadHighlight:query" ></span> ';
	templateHTML += ' 			<span class="hidden508">Search</span> ';
    templateHTML += '         </a> ';
    templateHTML += '     </script> ';
    templateHTML += ' </div> ';

	return {
		replace: true,
		restrict: 'E',
		scope: {
			expanded: '='
		},
		template: templateHTML,
	    controller: ['$scope', '$q', '$filter', function ($scope, $q, $filter) {
	    	$scope.isTypeAhead = false;
	    	$scope.typeAheadSelect = false;
	    	$scope.listViewOptions = [];
	    	$scope.default = {'sobjectAPIName': '', 'Name': '', 'recordType':''};
	    	$scope.allObjects = undefined;
	    	$scope.isDefaultSet = false;

	    	Visualforce.remoting.Manager.invokeAction(                
				_RemotingSidebarActions.fetchGlobalSearchConfig, config,
				function(result, event){
					if(event.status){
						$scope.isTypeAhead = result['isTypeAhead'];
						var sobjectsConfigured = result['sobjects'];

						angular.forEach(sobjectsConfigured, function (record) {
							var listObject = {'sobjectAPIName': record.name, 'Name': record.label, 'sequence': record.sequence, 'recordType': record.recordType };
							$scope.listViewOptions.push(listObject);
							if(record.name == searchObject) {
								$scope.default = listObject;
								$scope.isDefaultSet = true;
							}
							// if($scope.allObjects == undefined){
							// 	$scope.allObjects  = record.name;
							// }else{
							// 	$scope.allObjects += ',' + record.name;
							// } 
						});
						$scope.listViewOptions = $filter('orderBy')($scope.listViewOptions, 'sequence', false);
						angular.forEach($scope.listViewOptions, function (record) {
							if($scope.allObjects == undefined){
								$scope.allObjects  = record.sobjectAPIName;
							}else{
								$scope.allObjects += ',' + record.sobjectAPIName;
							} 
						});

						$scope.listViewOptions.splice(0, 0, {'sobjectAPIName': $scope.allObjects , 'Name': 'All', 'sequence': 0});
						if($scope.isDefaultSet == false) {
							$scope.default = $scope.listViewOptions[0]; 	   
						}

						$scope.$apply();
					}    
				}, 
				{escape:false, buffer:false}
			);

			$scope.items = function(searchTerm, inputVal) {                                
			   var deferred = $q.defer();
			   var params = {};
			   params['searchTerm'] = searchTerm;
			   params['objectName'] = $scope.default.sobjectAPIName;
			   params['recordType'] = $scope.default.recordType;
			   Visualforce.remoting.Manager.invokeAction(
				   _RemotingSidebarActions.fetchSearchTypeAheadRecords, params,
				   function(records, event){                         
					   if (event.status) {
						   $scope.$apply(function () {                                                                                              
							   deferred.resolve(records);  					  
						   });                                                                                                             
					   }                                                                         
				   }, 
				   { buffer: false, escape: false, timeout: 30000 }
			   );
			   return deferred.promise;                                           
			};

			$scope.search = function(){	
				
				//Bug 144218: Internal-Multiple issues in unsaved data changes functionality.
				if(typeof preventDefaultDialogBox  !==  "undefined") {
					preventDefaultDialogBox = true;
				}
				
				if($scope.typeAheadSelect == true){
					window.open('/'+$scope.searchId,'_self');
				} else if($scope.searchTerm != undefined &&  $scope.searchTerm.replace(/[^A-Z0-9_!@#$%^&*()-/,+{}:;=|?<>]/gi, "").length > 1){
					showLoadingPopUp();
					var searchT = $scope.searchTerm.replace(/[^A-Z0-9_\s!@#$%^&*()-/,+{}:;.=|?<>]/gi, "");
					window.open( config['searchResultPage'] + '&searchText=' + searchT + '&searchObject=' + $scope.default.sobjectAPIName, '_self');
				} else {
					alert(twoCharMsg);
				}   
			};

			$scope.openViewPage= function(sideBarSearchResult){
				$scope.typeAheadSelect = true;
				$scope.searchId = sideBarSearchResult.Id;
			};
        	
        }]
	}

});

sidebarEnhancedApp.directive('collapsible', function(){
	var templateHTML = '';
	templateHTML += '<ul class="nav-second-level collapse" ng-class="{\'in\' : (expanded == true)}"> ';
	templateHTML += '       <li class="subMenu" ng-class="{\'clicked\' : header.isExpanded}" ng-repeat="header in hierarchy | filter: { groupName : category } | orderBy:\'sequence\' "> ';
	templateHTML += '           <a title="{{header.name}}" href="javascript:void(0)" ng-click="header.isExpanded = !header.isExpanded; updateCollapsedState(header.id, \'header\', !header.isExpanded);">  ';
	templateHTML += '           	<span class="subMenu" ng-bind-html="getTrustedHTML(header.iconCSS)"></span> ';
	templateHTML += '           	<span ng-bind="header.name"></span> ';
	templateHTML += '           </a> ';
	templateHTML += '           <ul class="nav-third-level collapse" ng-class="{\'in\' : header.isExpanded}"> ';
	templateHTML += '           	<li class="subMenuHeader" ng-repeat="subheader in header.subHeaders | orderBy:\'sequence\'"> ';
	templateHTML += '           		<a title="{{subheader.name}}"  href="javascript:void(0)" ng-if="!subheader.isHidden"> ';
	templateHTML += '             	<span ng-bind="subheader.name"></span> ';
	templateHTML += '             </a> ';
	templateHTML += '             <ul class="nav-fourth-level"> ';
	templateHTML += '             	<li class="subMenuLink" ng-class="{\'lastSelectedSideBarLink\' : (lastSelectedValue == content.id)}" ng-repeat="content in subheader.contents | orderBy:\'sequence\'"> ';
	templateHTML += '             		<a  title="{{content.name}}" ng-href="{{ content.url }}" ng-click="setLastSelected(content.id, content.isNewWindow, $event,content.name)" target="{{ content.isNewWindow ? \'_blank\' : \'_self\' }}"> ';
	templateHTML += '               	<span ng-bind="content.name"></span> ';
	templateHTML += '               </a> ';
	templateHTML += '             	</li> ';
	templateHTML += '             </ul> ';
	templateHTML += '           	</li> ';
	templateHTML += '           </ul> ';
	templateHTML += '       </li> ';
	templateHTML += '   </ul> ';

	return {
		replace: true,
		restrict: 'E',
		scope: {
			category: '=',
			hierarchy: '=',
			expanded: '='
		},
		template: templateHTML,
        controller: ['$scope','$sce', 'UserPrefCommunicator', function ($scope,$sce, UserPrefCommunicator) {

        	$scope.lastSelectedValue = j$.cookie('last_selected_sidebar');
        	//console.log('test123',$scope.lastSelectedValue);
        	$scope.setLastSelected = function(value, isNewWindow, event,name) {
				//Bug 144218: Internal-Multiple issues in unsaved data changes functionality.
				if(typeof preventDefaultDialogBox  !==  "undefined") {
					preventDefaultDialogBox = true;
				}
        		//var lastSelected = value +';'+name;
        		if(event.button === 0) {
	        		j$.removeCookie('last_selected_sidebar');
	        		j$.removeCookie('last_selected_sidebarname');
	                j$.cookie('last_selected_sidebar', value);
	                j$.cookie('last_selected_sidebarname',name);
	                if(!isNewWindow) {
						showLoadingPopUp();
					}
				}
        	};

        	$scope.updateCollapsedState = function (id, type, isCollapsed) {
				UserPrefCommunicator.updateCollapseCache(id, type, isCollapsed);
			};

			$scope.getTrustedHTML = function (argument) {
				return $sce.trustAsHtml(argument);
			}

        }]       
	}

});

sidebarEnhancedApp.directive('recentlyViewed', function(config){
	var templateHTML = '';
	templateHTML += ' <ul class="nav-second-level collapse" ng-class="{\'in\' : (expanded == true)}"> ';
	templateHTML += ' 	<li class="subMenuLink" ng-class="{\'lastSelectedSideBarLink\' : (lastSelectedValue == record.RecordId)}" ng-repeat="record in recentlyViewed"> ';
	templateHTML += ' 		<a id="{{\'recentView-\' + $id + \'-\' + $index}}" ng-href="{{ \'/\' + record.RecordId}}" target="_self" ';
	templateHTML += ' 			ng-blur="hideTooltip(\'recentView-\'+ $id + \'-\' + $index, record.RecordId);"  ';
	templateHTML += '  			ng-mouseover="showTooltip(\'recentView-\'+ $id + \'-\' + $index, record.RecordId);" ng-click="loader(record.RecordId, $event)"> ';
	templateHTML += ' 			<span ng-bind="record.Name"></span> ';
	templateHTML += ' 		</a> ';
	templateHTML += ' 	</li> ';
	templateHTML += ' </ul> ';
	
	return {
		replace: true,
		restrict: 'E',
		scope: {
			expanded: '='
		},
		template: templateHTML,
        controller: ['$scope', function ($scope) {
        	$scope.recentlyViewed = [];
        	$scope.lastSelectedValue = j$.cookie('last_selected_sidebar');
        	Visualforce.remoting.Manager.invokeAction(                
				_RemotingSidebarActions.fetchRecentlyViewed, config,
				function(result, event){
					if(event.status){
						$scope.recentlyViewed = result;
						$scope.$apply();
					}    
				}, 
				{escape:false, buffer:false}
			);

			$scope.showTooltip = function(thisVal, parentId) { 		
				if(parentId != null || parentId != undefined || parentId != '') {		
					j$('#'+ thisVal).tooltipster({                    
						theme: 'tooltipster-shadow',
						content :'Loading...',
						updateAnimation:false,
						contentAsHTML:true, 
						interactive:true, 
						minWidth:100, 
						position:'right',   
									  
						functionBefore: function(origin, fetchLayout) {
							fetchLayout();
							Visualforce.remoting.Manager.invokeAction(
								_RemotingSidebarActions.fetchMiniLayout, parentId,
								function(result, event){
									if (event.status) {							
										if(!jQuery.isEmptyObject(result)) {
											tooltipContent =  '<div class="tooltipWrapper" >'; 
											tooltipContent += structureMiniLayout(result,origin,tooltipContent);
											tooltipContent +='</div>';									
											origin.tooltipster('content', tooltipContent );									
										} else {									
											j$('#'+thisVal.id).tooltipster('hide');
										}
										
									}
							});
						}                   
					}); 
					j$('#'+ thisVal).tooltipster('show');                
				}
			};

			$scope.hideTooltip = function(thisVal, parentId) {
				j$('#'+thisVal).tooltipster('hide'); 
			};

			$scope.loader = function(value, event) {
				if(typeof preventDefaultDialogBox  !==  "undefined") {
					preventDefaultDialogBox = true;
				}
				if(event.button === 0) {
					j$.removeCookie('last_selected_sidebar');
	                j$.cookie('last_selected_sidebar', value);
					showLoadingPopUp();
				}
			};
			
			/*$scope.getMiniLayoutContent = function(result, origin) {
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
								if(field.hideField != 'true') {                     
									tooltip += '<div class="form-group border-ext ">';
									tooltip += ' <div class="row">';                                   
									tooltip += ' <div class="col-md-4 col-xs-4 col-sm-4">';
									tooltip += field.fieldLabel;
									tooltip += '</div>';
								  
									var fieldVal =  j$('<span/>').html(encodeURI(record [field.fieldAPIName])).text(); 
									if(field.dataType == 'CURRENCY'){
										fieldVal = '$' + fieldVal;
									}                                  
									tooltip += ' <div class="col-md-8 col-xs-8 col-sm-8" style="word-wrap:break-word; font-weight: bold;">';
									if(field.dataType == 'EMAIL') {
								        tooltip += '<a href="mailto:'+decodeURI(fieldVal)+'">' + decodeURI(fieldVal) + '</a>';
								    } else {
								        tooltip += decodeURI(fieldVal);
								    }    
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
				} else {        				
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
			};*/
			
        }] // directive controller ends here
	}
});

sidebarEnhancedApp.directive('externalLinks', function(config){

	var templateHTML = '';
	templateHTML += ' <ul class="nav-second-level collapse" ng-class="{\'in\' : (expanded == true)}"> ';
	templateHTML += ' 	<li class="subMenuLink" ng-class="{\'lastSelectedSideBarLink\' : (lastSelectedValue == link.id)}" ng-repeat="link in externalLinks"> ';
	templateHTML += ' 		<a ng-href="{{link.url}}" ng-click="loader(link.id, link.newWindow, $event,link.name)" target="{{ link.newWindow ? \'_blank\' : \'_self\'}}"> ';
	templateHTML += ' 			<span ng-bind="link.name"></span> ';
	templateHTML += ' 		</a> ';
	templateHTML += ' 	</li> ';
	templateHTML += ' </ul> ';
	return {
		replace: true,
		restrict: 'E',
		scope: {
			expanded: '='
		},
		template: templateHTML,
        controller: ['$scope', function ($scope) {
        	$scope.externalLinks = [];
        	Visualforce.remoting.Manager.invokeAction(                
				_RemotingSidebarActions.fetchExternalLinks, config,
				function(result, event){
					if(event.status){
						angular.forEach(result, function(link) {
							var linkObj = {};
							//*************************************************************
							// Note :
							// This workaround of key hardcoding is used, as a tradeoff,
							// not to expose the inner class in controller globally, 
							// and to avoid change in global method signature to fetch the links,
							// as the keys include org namespace too
							//*************************************************************

							angular.forEach(Object.keys(link), function(key) {
								if(key.indexOf('OpenNewWindow__c') !== -1) {
									linkObj['newWindow'] = angular.copy(link[key]);
								} else if (key.indexOf('URL__c') !== -1) {
									linkObj['url'] = angular.copy(link[key]);
								} else {
									linkObj['id'] = angular.copy(link.Id);
									linkObj['name'] = angular.copy(link.Name);
								}
							});
							
							$scope.externalLinks.push(linkObj);
						});
						$scope.$apply();
					}    
				}, 
				{escape:false, buffer:false}
			);

			$scope.lastSelectedValue = j$.cookie('last_selected_sidebar');

			$scope.loader = function(value, isNewWindow, event,name) {
				if(typeof preventDefaultDialogBox  !==  "undefined") {
					preventDefaultDialogBox = true;
				}
				if(event.button === 0) {
						j$.removeCookie('last_selected_sidebar');
	                	j$.removeCookie('last_selected_sidebarname');
	                	j$.cookie('last_selected_sidebar', value);
		                j$.cookie('last_selected_sidebarname',name);
	        		
	                if(!isNewWindow) {
						showLoadingPopUp();
					}
				}
			};
        }]
	}
});

sidebarEnhancedApp.directive('technicalSupportLinks', function(config){
	var templateHTML = '';
	templateHTML += ' <ul class="nav-second-level collapse" ng-class="{\'in\' : (expanded == true)}"> ';
	templateHTML += ' 	<li class="subMenuLink" ng-class="{\'lastSelectedSideBarLink\' : (lastSelectedValue == link.id)}" ng-repeat="link in techSupportLinks"> ';
	templateHTML += ' 		<a ng-href="{{link.url}}" ng-click="loader(link.id, link.newWindow, $event,link.name)" target="{{ link.newWindow ? \'_blank\' : \'_self\'}}"> ';
	templateHTML += ' 			<span ng-bind="link.name"></span> ';
	templateHTML += ' 		</a> ';
	templateHTML += ' 	</li> ';
	templateHTML += ' </ul> ';

	return {
		replace: true,
		restrict: 'E',
		scope: {
			expanded: '='
		},
		template: templateHTML,
        controller: ['$scope', function ($scope) {
        	$scope.techSupportLinks = [];
        	Visualforce.remoting.Manager.invokeAction(                
				_RemotingSidebarActions.fetchTechSupportLinks, config,
				function(result, event){
					if(event.status){
						angular.forEach(result, function(link) {
							var linkObj = {};
							//*************************************************************
							// Note :
							// This workaround of key hardcoding is used, as a tradeoff,
							// not to expose the innerq class in controller globally, 
							// and to avoid change in global method signature to fetch the links,
							// as the keys include org namespace too
							//*************************************************************

							angular.forEach(Object.keys(link), function(key) {
								if(key.indexOf('OpenNewWindow__c') !== -1) {
									linkObj['newWindow'] = angular.copy(link[key]);
								} else if (key.indexOf('URL__c') !== -1) {
									linkObj['url'] = angular.copy(link[key]);
								} else {
									linkObj['id'] = angular.copy(link.Id);
									linkObj['name'] = angular.copy(link.Name);
								}
							});
							$scope.techSupportLinks.push(linkObj);
						});
						$scope.$apply();
					}    
				}, 
				{escape:false, buffer:false}
			);

			$scope.lastSelectedValue = j$.cookie('last_selected_sidebar');

			$scope.loader = function(value, isNewWindow, event,name) {
				if(typeof preventDefaultDialogBox  !==  "undefined") {
					preventDefaultDialogBox = true;
				}
				if(event.button === 0) {
						j$.removeCookie('last_selected_sidebar');
	                	j$.removeCookie('last_selected_sidebarname');
	                	j$.cookie('last_selected_sidebar', value);
	                	j$.cookie('last_selected_sidebarname',name);
	                if(!isNewWindow) {
						showLoadingPopUp();
					}
				}
			};
        }]
	}

});

sidebarEnhancedApp.directive('ngEnter', function () {
   return function (scope, element, attrs) {
	   element.on("keydown keypress", function (event) {	   
		// Commenting out $eval function for security review if in future it does not work then we will check out for the replacement of $eval function.
		// if(event.which === 13) {
		// 	   scope.$apply(function (){
		// 		   scope.$eval(attrs.ngEnter);
		// 	   });			  
		// 	   event.preventDefault();
		//    }
	   });
   };
});

sidebarEnhancedApp.factory('UserPrefCommunicator', [ function () {
    return {
      updateCollapseCache: function (id, type, isCollapsed) {
            Visualforce.remoting.Manager.invokeAction(_RemotingSidebarActions.updateCollapsedState,
                    id, type, isCollapsed,
                    function(result, event) { 
                    }, 
                { buffer: false, escape: false});
      }
    }
  }
]);

angular.bootstrap(document.getElementById("sidebarAppId"),['sidebarEnhancedApp']);