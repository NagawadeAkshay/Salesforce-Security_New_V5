angular.module('ui.field', ['ui.autosuggest'])

.filter('noFractionCurrency',[ '$filter', '$locale',
	function(filter, locale) {
		var currencyFilter = filter('currency');
		var formats = locale.NUMBER_FORMATS;
		return function(amount, currencySymbol) {
			var value = currencyFilter(amount, currencySymbol);
			if(value != undefined){
				var sep = value.indexOf(formats.DECIMAL_SEP);
				if(amount >= 0) { 
					return value.substring(0, sep);
				}
				return value.substring(0, sep) + '';
			}
			return '';
		};
	} 
])
.directive("dateTimePicker1", function($compile,$filter){
	return {
		restrict: 'A',                 
		scope: {
			timePicker: '=',
			format:'@'     
		}, 
		require: 'ngModel',                               
		link: function(scope, element, attr,ngModel){
			ngModel.$formatters.push(function(value) { 
				//console.log('====time picker===false=====',scope.timePicker);
				if(scope.timePicker == false){							
					return $filter('date')(value, 'MM/dd/yyyy');					
				}else{
					return $filter('date')(value, 'MM/dd/yyyy h:mm a');
				}
			});
			ngModel.$parsers.push(function (value) {
				return Date.parse(value);
			});
			element.datetimepicker({
				timepicker:scope.timePicker,
				format: scope.format,
				closeOnDateSelect:true
			}); 
												   
		}
	} 
})
.directive("filereader", [function () {
    return {
        scope: {
            fileread: "=",
            record:'=',
            fieldInfo:"="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                    	// //console.log('====loadEvent=====',loadEvent);
                        scope.fileread = loadEvent.target.result;
                        // //console.log('====record=====',scope.record);
		                scope.record[scope.fieldName] = scope.fileread;
		                // //console.log('====record=====',scope.record);
		                scope.fieldInfo.UploadFunction(scope.record.Id,changeEvent.target.files[0].name,scope.fileread);
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
                // //console.log('====reader=====',reader);
                // //console.log('====changeEvent.target.files[0]=====',changeEvent.target.files[0]);                 
            });
        }
    }
}])
.controller('FieldController', ['$scope', '$attrs', '$timeout','$window','$parse', function($scope, $attrs, $timeout,$compile,$window,$parse) {
	$scope.template = '';
	
	$scope.openRefURL = function(value,fieldName){                		
		console.log('value----->>>',value);
		console.log('fieldName----->>>',fieldName);	
		window.open('/'+value.Id,'_blank');
	};
	$scope.searchFieldApiName = 'Name';
	$scope.controlVariable ={};
	$scope.controlVariable.selectHandler = function(selectedItem){
        console.log('-----selected Value----',selectedItem);
        $scope.value[$scope.fieldName] = selectedItem.id;
        //$scope.fieldOptions.refValueHandler(selectedItem, $scope.fieldOptions.fieldName);                                   
    };
	$scope.refFieldOptions = {
        resultTemplate :'<div class="margin-left-15">'+                                                                             
                            '<span>{{data.Name}}</span>'+                                    
                        '</div>',
        showFooter: false,
        showHeader: false, 
        inputTemplate : '<div class="input-group">'+                                                        
                            '<input data-toggle="dropdown" class="form-control" ng-disabled="options.disabled" ng-focus="init()" type="text"  placeHolder="{{options.placeHolder}}" ng-model="searchTerm" class="form-control" ></input>'+
                            '<span class="input-group-addon"><i class="fa fa-search"/></span>'+
                        '</div>',                                  
        placeHolder:'Search...',
      	showAsDropDown:true,
        controlVariable:$scope.controlVariable,
        noResultText:'No records found'
    };
	$scope.getFieldTemplateForEditMode = function(){  
		console.log('$scope.fieldType--->>>>',$scope.fieldType);
		console.log('$scope.value--->>>>',$scope.value);
		console.log('$scope.fieldInfo---->>>>',$scope.fieldInfo);
		//console.log('$scope.value----2132131322131-->>>>',$scope.value);
		if($scope.fieldInfo != undefined && ($scope.fieldType == 'PICKLIST' || $scope.fieldType == 'MULTIPICKLIST')){
			$scope.value[$scope.fieldName] = $scope.fieldInfo.PicklistValues[0].value;
			//$scope.fieldOptions.valueChanged($scope.value[$scope.fieldName]);
		}
		console.log('$scope.value[$scope.fieldName]-->>>>',$scope.value[$scope.fieldName]);
	    switch($scope.fieldType) {
			
			case 'DATE':                        
				$scope.template = '<input class="form-control"  type="text" ng-model="value[fieldName]" format="m/d/Y"  time-picker="false" date-time-picker1="angular" />';  
				break;
			case 'DATETIME':
				$scope.template = '<input class="form-control"  type="text" ng-model="value[fieldName]" format="m/d/Y h:m A" time-picker="true" date-time-picker1="angular" />';                                                                          
				break;
			case 'CURRENCY':  
				$scope.template = '<div class="input-group">'+ 
									'<span class="input-group-addon"><i class="fa fa-usd" aria-hidden="true"></i></span>'+                                                       
		                            '<input  class="form-control" type="text"  ng-model="value[fieldName]"></input>'+		                            
		                        '</div>';   						                                          
				break;
			case 'DOUBLE':                        
				$scope.template = '<input class="form-control"  type="number" ng-model="value[fieldName]" />'; 
				break;
			case 'INTEGER':                        
				$scope.template = '<input class="form-control"  type="number" ng-model="value[fieldName]" />'; 
				break;
			case 'STRING':
				$scope.template = '<input class="form-control" type="text" ng-model="value[fieldName]" />';				
				break;
			case 'PICKLIST':                        
				$scope.template = '<select class="form-control"  ng-model="value[fieldName]" ng-options="opt.value as opt.label for opt in fieldInfo.PicklistValues"></select>'; 
				break;
			case 'MULTIPICKLIST':                        
				$scope.template = '<select class="form-control"   ng-model="value[fieldName]" ng-options="opt.value as opt.label for opt in fieldInfo.PicklistValues"></select>'; 
				break;
			case 'PHONE':                         
				$scope.template = '<input class="form-control"  type="text" ng-model="value[fieldName]" />'; 
				break;
			case 'ANYTYPE':                        
				$scope.template = '<input class="form-control"  type="text" ng-model="value[fieldName]" />';
				break;
			case 'EMAIL':                        
				$scope.template = '<input class="form-control"  type="email" ng-model="value[fieldName]" />';                         
				break;                    
			case 'BOOLEAN':  
				$scope.template = '<input style="display: table;"  type="checkbox" ng-model="value[fieldName]" />';   
				break;
			case 'TEXTAREA':  
				$scope.template = '<textarea ng-model="value[fieldName]" class="form-control" rows="5"></textarea>';                                                      
				break;
			case 'URL':  
				$scope.template = '<input class="form-control"  type="url" ng-model="value[fieldName]" />';                                                      
				break;
			case 'REFERENCE':                                                                   
				$scope.template = '<autosuggest object-name="fieldInfo.RefObjectInfo.name" search-field-api-name="searchFieldApiName" options="refFieldOptions" /> ';                                              
				break;
			case 'RADIO':                                                                   
				$scope.template = '<label class="radio-inline" ng-repeat="option in fieldInfo.RadioOptions"><input ng-model="value[fieldName]" type="radio" name="optradio">{{option}}</label>';                                              
				break;
			case 'FILE':                                                                   
				$scope.template = '<input type="file" field-info="fieldInfo" record="value" fileread="record[fieldName]" />';                                              
				break;
			$scope.template += '{{value[fieldName]}}';
		}                                                                                             
	};
	$scope.valueChanged = function(selectedValue,value,fieldName) { 
		//console.log('value====',$scope.value);
		//console.log('fieldName====',$scope.fieldName); 
		//console.log('selectedValue====',selectedValue);  		
		$scope.fieldOptions.valueChanged($scope.value[$scope.fieldName]);           
	}; 
	$scope.toUTCDate = function(date){                    
		var _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());                                        
		return _utc;
	};
	$scope.getDate = function(value){    
		////console.log('value==addadatre==',value);                
		var time = undefined;
		if(value != undefined){
			return $scope.toUTCDate(new Date(value));                  
		}
		//return time;
		return value;
	};
	$scope.getDateTime = function(value){    			
		var time = undefined;
		if(value != undefined){
			// //console.log('value is defined:',scope.toUTCDate(new Date(value+scope.timeOffset)));
			//console.log('getDateTime scope.timeOffset: ',timeOffset);
			return scope.toUTCDate(new Date(value+timeOffset));     //             
		}
		return time;
	};
	$scope.getFieldTemplateForViewMode = function(){                                                          
	   switch($scope.fieldType) {
			case 'ID':                        
				$scope.template = '<span ng-bind="fieldValue"></span> '; 
				break;
			case 'DATE':                        
				$scope.template = '<span ng-bind="getDate(fieldValue) | date:\'MM/dd/yyyy\'"/></span> ';  
				break;
			case 'DATETIME':
				$scope.template = '<span ng-bind="getDateTime(fieldValue)  |  date:\'MM/dd/yyyy h:mm:a \'"/></span> ';                                                                          
				break;
			case 'CURRENCY':  
				$scope.template = '<span ng-bind="fieldValue | noFractionCurrency "/></span> ';                                              
				break;
			case 'DOUBLE':                        
				$scope.template = '<span ng-bind="fieldValue"></span> '; 
				break;
			case 'INTEGER':                        
				$scope.template = '<span ng-bind="fieldValue"></span> '; 
				break;
			case 'STRING':
				if($scope.fieldName == 'Name'){
					$scope.template = '<a class="pointer" ng-click="openRefURL(value,fieldName)" tabIndex="0"><span ng-bind="fieldValue"></span> </a>';  
				}else{
					$scope.template = '<span ng-bind="fieldValue"></span> '; 
				}
				break;
			case 'PICKLIST':                        
				$scope.template = '<span ng-bind="fieldValue"></span> '; 
				break;
			case 'MULTIPICKLIST':                        
				$scope.template = '<span ng-bind="fieldValue"></span> '; 
				break;
			case 'PHONE':                         
				$scope.template = '<span ng-bind="fieldValue"></span> '; 
				break;
			case 'ANYTYPE':                        
				$scope.template = '<span ng-bind="fieldValue"></span> ';
				break;
			case 'EMAIL':                        
				$scope.template = '<span><a tabIndex="0" href="mailto:a" ng-bind="fieldValue /></span> ';                         
				break;                    
			case 'BOOLEAN':  
				if($scope.value[$scope.fieldName] == true){                      
					$scope.template = '<i class="fa fa-check"></i>'; 
				}else{
					$scope.template = '<span>No</span> '; 
				}  
				break;
			case 'TEXTAREA': 
				$scope.template = '<span ng-bind="fieldValue"></span> ';                                                       
				break;
			case 'URL':  
				$scope.template = '<a><span ng-bind="fieldValue"></span> </a>';                                                      
				break;
			case 'REFERENCE':                                                                   
				$scope.template = '<a ng-click="openRefURL(value,fieldName)" tabIndex="0"><span ng-bind="fieldValue"></span> </a>';                                              
				break;
		}
		
						
	};

}])
  
.directive('field', function($compile,$parse) {
	return {
		restrict: 'E',
		controller: 'FieldController',                
		scope: {
			fieldType: '@',
			fieldName: '@',
			fieldInfo: '=',                    
			value: '=',			
			isEdit: '=',
			fieldOptions:'='
		},
		link: function(scope, element, attr){ 
			console.log('----111----',scope.value);
			//console.log('-----222---',scope.isEdit);
			if(scope.value != undefined && scope.isEdit != true){
				scope.obj = scope.value;			
				viewValueGetter = $parse(scope.fieldName);			
				scope.fieldValue = viewValueGetter(scope.obj);	
				//console.log('scope.fieldValue--------',scope.fieldValue);			
				scope.getFieldTemplateForViewMode();                                
			}else if(scope.isEdit == true){						
				scope.getFieldTemplateForEditMode();				  
			}
			element.html(scope.template).show();          
			$compile(element.contents())(scope);
			scope.$watch(
				'fieldType', 
				function(newValue, oldValue) {					
					if(scope.isEdit == true && newValue != oldValue){
						//scope.value = undefined;						
						scope.getFieldTemplateForEditMode();						
						element.html(scope.template).show();          
						$compile(element.contents())(scope);				  
					}						
				}
			);			                                       
		}
	};
});    