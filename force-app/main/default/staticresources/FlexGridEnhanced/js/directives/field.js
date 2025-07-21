
angular.module('field', [])

    // Refactored by Prem on 14 May 2018

    //Filter for Percentage used in Field Directive
    .filter('percentage', ['$filter',
        function(filter) {
            return function(input, decimals) {
                if ( input != 0 && (input == undefined || input == '')) {
                    return '';
                }
                let percentStringValue = input.toString() + '00000000000000';
                let percentRegex = /(\d{0,})(\.(\d{1,})?)?/g;
                let percentPartMatches = percentRegex.exec(percentStringValue);
                input = (percentPartMatches[3] != undefined && percentPartMatches[3].length > decimals) ? parseFloat((percentStringValue.substring(0,(percentStringValue.length - (percentPartMatches[3].length - decimals))))) : input;
                let finalValue = (((typeof input) == 'number') ?  (input.toFixed(decimals)) : input);

                //return finalValue;
                return  finalValue + '%';
            };
        }
    ])
    .filter('noFractionCurrency', ['$filter', '$locale',
        function(filter, locale) {
            var currencyFilter = filter('currency');
            var formats = locale.NUMBER_FORMATS;
            return function (amount, scale, currencySymbol) {
                if(amount == undefined){
                    return '';
                }
                amount = parseFloat(amount.toFixed(scale));
                let amountStringValue = amount.toString();
                let decimalRegex = /(\d{0,})(\.(\d{1,})?)?/g;
                let decimalPartMatches = decimalRegex.exec(amountStringValue);
                amount = (decimalPartMatches[3] != undefined && decimalPartMatches[3].length > scale) ? parseFloat((amountStringValue.substring(0,(amountStringValue.length - (decimalPartMatches[3].length - scale))))) : amount;
                currencySymbol = (currencySymbol != undefined) ? currencySymbol : '$';
                let finalValue = (((typeof amount) == 'number') ?  (currencySymbol + amount.toFixed(scale).replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace('-', '')) : amount);
                finalValue = (amount < 0) ? '(' + finalValue + ')' : finalValue;

                return finalValue;
            };
        }
    ])
    .filter('customNumberFilter', ['$filter', '$locale',
        function (filter, locale) {
            var numberFilter = filter('number');
            return function (number, scale) {
                if(number == undefined){
                    return '';
                }
                let numberStringValue = number.toString();
                let decimalRegex = /(\d{0,})(\.(\d{1,})?)?/g;
                let decimalPartMatches = decimalRegex.exec(numberStringValue);
                number = (decimalPartMatches[3] != undefined && decimalPartMatches[3].length > scale) ? parseFloat((numberStringValue.substring(0,(numberStringValue.length - (decimalPartMatches[3].length - scale))))) : number;

				//Bug 196752: OSPI - E-grid - Number field on E-grid is showing comma after decimal value starts
                let finalValue = (typeof number) ?  number.toFixed(scale) : number;
                let splitedValue = finalValue.split('.');
                if(splitedValue.length > 1){
                    splitedValue[0] = splitedValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    finalValue = splitedValue[0] + '.'+ splitedValue[1];
                }else{
                    finalValue = finalValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                finalValue = (typeof number) ?  finalValue.replace('-', '') : number;
                finalValue = (number < 0) ? '(' + finalValue + ')' : finalValue;
                if(((typeof finalValue) == 'string') && finalValue == "0"){
                    finalValue = 0;
                }
                return finalValue;
            };
        }
    ])
    // see this link for datetime picker

    .directive("eGridDatePicker", function($compile, $filter, $sce) {
        return {
            restrict: 'A',
            scope: {
                format: '@'
            },
            require: 'ngModel',
            link: function(scope, element, attr, ngModel) {
                ngModel.$formatters.push(function(value) { 
                    if(value == undefined || value == null || value == NaN || value == 'Invalid Date' || (Date.parse(value) < 99999999)){
                        return;
                    }              
                    let dateValue = (value != undefined) ?  ((typeof value != "object") ? value + (new Date().getTimezoneOffset() * 60000) : value) : '';
                    if(new Date(value).getTimezone() != new Date().getTimezone()){
                        dateValue = dateValue + 3600000 ; // this line for daylight saving
                    }
                    let finalDateValue = $filter('date')(dateValue, userDateFormat);
                    return finalDateValue; // 'MM/dd/yyyy');                    
                });
                ngModel.$parsers.push(function(value) {
                    let finalDateValue = value;
                    if(value == undefined || value == 'Invalid Date' || value == NaN  || (Date.parse(value) < 99999999) ){
                        return;
                    }
                    else if( (Date.parse(value)).toString() == 'NaN'){
                        return 'Invalid Date' ;
                    }
                    if (value == "") {
                        finalDateValue = "";
                    } else {
                       // value = value.dateFormat('MM/dd/yyyy');
                        let parts = value.split("/");
                        if(parts.length == 3 && parts[0].length > 0 && parts[1].length > 0 && parts[1] !='0'&& parts[0] !='0'){ 
                            if(localeBasedEnhancedDateFormat.indexOf('d/m/Y') == 0){
                                value =  toEDate(parts);
                            }
                            finalDateValue = Date.parse(value);
							if(new Date(value).getTimezone() =='EDT'){
                               finalDateValue = finalDateValue + 3600000 ; // this line for daylight saving
                            } 
                        }
                    }
                    return finalDateValue;
                });
                element.datetimepicker({
                    timepicker: false,
                    format: localeBasedEnhancedDateFormat,
                    closeOnDateSelect: true,
                    lazyInit: true
                });

            }
        }
    })
    // see this link for datetime picker
    // https://xdsoft.net/jqplugins/datetimepicker/

    .directive("eGridDateTimePicker", function($compile, $filter, $sce) {        
        return {
            restrict: 'A',
            scope: {
                format: '='
            },
            require: 'ngModel',
            link: function(scope, element, attr, ngModel) {
              
                ngModel.$formatters.push(function(value) { 
                    if(value == undefined || value == null || value == 'Invalid Date' || (Date.parse(value) < 99999999)){
                        return;
                    }              
                    let dateValue = (value != undefined) ?  ((typeof value != "object") ? value + (new Date().getTimezoneOffset() * 60000) + timeOffset : value) : '';
                    let finalDateTimeValue = $filter('date')(dateValue, userDateTimeFormat);
                    return finalDateTimeValue; // 'MM/dd/yyyy');                    
                });
                ngModel.$parsers.push(function(value) {
                    let finalDateTimeValue = value;
                    if(value == undefined || value == 'Invalid Date' || (Date.parse(value) < 99999999)){
                        return;
                    }
                    else if( (Date.parse(value)).toString() == 'NaN'){
                        return 'Invalid Date' ;
                    }
                    if (value == "") {
                        finalDateTimeValue = "";
                    } else {
                        let parts = value.split(" ");
                        if(parts.length == 3){
                            let datepart = parts[0].split("/");
                            let timepart = parts[1].split(":");
                            if(datepart.length == 3 && datepart[0].length > 0 && datepart[1].length > 0 && timepart.length == 2 && parts[2].length == 2){
                                let amPm = value.match(/(am|pm)/gi);
                                if((amPm != undefined|| amPm != null) && amPm[0].toLowerCase() == 'pm' && timepart.length == 2 && timepart[0]){
                                    timepart[0] = parseInt(timepart[0]) + 12;
                                }
                                if(localeBasedEnhancedDateTimeFormat.indexOf('d/m/Y') == 0){
                                    value =  toEDateTime(datepart, timepart);
                                }
                                finalDateTimeValue = Date.parse(value);
								if(new Date(value).getTimezone() =='EDT'){
									finalDateTimeValue = finalDateTimeValue + 3600000 ; // this line for daylight saving
								} 
                            } 
                        }                                   
                    }
                    return finalDateTimeValue;
                });
                j$(element).datetimepicker({
                    timepicker: true,
                    format: localeBasedEnhancedDateTimeFormat,
                    formatTime : localeBasedEnhancedTimeFormat,
                    closeOnDateSelect: true,
                    lazyInit:true
                });

            }
        }
    })
    .directive("eGridTimePicker", function($compile, $filter, $sce) {
        return {
            restrict: 'A',
            scope: {
                format: '@'
            },
            require: 'ngModel',
            link: function(scope, element, attr, ngModel) {
                ngModel.$formatters.push(function(value) { 
                    let finalTimeValue = value;
                    if((typeof value == "number")){
                        finalTimeValue = msToTime(value);       
                    }
                    return finalTimeValue;             
                });
                ngModel.$parsers.push(function(value) {
                    let valueParts = value.split(' ');
                    let finalTimeValue = valueParts.length > 1 && value.match(/(am|pm)/gi) == null ? valueParts[1] : valueParts[0];
                    let finalValueParts = finalTimeValue.toString().split(':');
                    if(valueParts[1] != undefined && valueParts[1].toLowerCase() == 'pm'){
                        finalValueParts[0] = (typeof finalValueParts[0] != 'string') ? finalValueParts[0] : parseInt(finalValueParts[0]);
                        finalValueParts[0] = finalValueParts[0] + 12;
                    }                    
                    finalTimeValue = ((parseInt(finalValueParts[0]) * 60) + (parseInt(finalValueParts[1]))) * 60 * 1000;
                    if(isNaN(finalTimeValue)){
                        return value;
                    }
                    return finalTimeValue;
                });
                element.datetimepicker({
                    datepicker: false,
                    formatTime : localeBasedEnhancedTimeFormat,
                    format : localeBasedEnhancedTimeFormat,
                    closeOnDateSelect: true,
                    lazyInit: true,
                    step : 30
                });

            }
        }
    })
    .directive('formattedNumberInput', function ($filter) {
        var applyNumberFormatting = function (scope, inputElement) {

            var origVal = inputElement.value.toString();
            // Capture cursor position so we can restore it later
            var caretPosition = inputElement.selectionStart; 
            if ((origVal != '' || origVal != undefined) && origVal != '-') {
                var isNegative = origVal.indexOf('-') == 0 ? true : false;
                var suffix = isNegative == true ? '-' : '';

                if (origVal.indexOf('-') != -1) {
                    typeof(origVal) === 'String' ?origVal.replaceAll("-", ""):origVal;
                    caretPosition = caretPosition + 1;
                }
                // Get rid of commas and any other bad input
                var justNumbers = origVal.replace(/[^1234567890\.]/g, "");                 
                // If there are no numbers entered, blank out the box
                if (justNumbers.length == 0) {
                    inputElement.value = '';
                    return;
                }
                // Get rid of the decimal place and capture separately
                var decimalRegex = /(\d{0,})(\.(\d{1,})?)?/g;
                var decimalPartMatches = decimalRegex.exec(justNumbers);
                var decimalPart = "";
                if (decimalPartMatches[2] && scope.scale > 0) {
                    decimalPart = decimalPartMatches[2];

                    if(decimalPartMatches[3] !=undefined && decimalPartMatches[3].length > scope.scale){
                        decimalPart = decimalPart.substring(0, scope.scale +1);
                    }
                }
                var withoutDecimal = decimalPartMatches[1];
                if (withoutDecimal.length != 0) {
                withoutDecimal = withoutDecimal.substring(0, scope.integerPartLength);
            	}

                // Assemble the final formatted value and put it in
                var final = '';
                //final += '$' // Now including this via CSS magic to avoid mucking with the form value
                final += withoutDecimal.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                final += decimalPart;
                inputElement.value = suffix + final;

                var origSelOffset = origVal.length - justNumbers.length;
                var selPosInNumber = caretPosition - origSelOffset;
                var newSelOffset = final.length - justNumbers.length;
                var newSelPos = selPosInNumber + newSelOffset;
                inputElement.setSelectionRange(newSelPos, newSelPos);
            }
        }
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attr, ngModel) {

                ngModel.$formatters.push(function (value) {
                    if(isNaN(value)){
                        return '';
                    }
                    element[0].value = value;
                    applyNumberFormatting(scope, element[0]);
                    return element[0].value;
                });

                ngModel.$parsers.push(function (value) {
                    element[0].value = value;
                    applyNumberFormatting(scope, element[0]);
                    var finalValue = '';
                    if((element[0].value != '' || element[0].value != undefined)) {
                        finalValue =  element[0].value.replace(/,/gi,'');
                    }
                    finalValue = (isNaN(finalValue) ) ? 0 : finalValue;
                    if(finalValue == '-'){
                        return finalValue;
                    }   else    {
                        return parseFloat(finalValue);
                    }
                });
                element.on('input', function (e) {
                    applyNumberFormatting(scope, element[0]);
                });
            }
        }
    })

    .directive('formattedPercentInput', function ($filter) {
        var applyNumberFormatting = function (scope, inputElement) {
            var origVal = inputElement.value.toString();
            // Capture cursor position so we can restore it later
            var caretPosition = inputElement.selectionStart; 
            if ((origVal != '' || origVal != undefined) && origVal != '-') {
                var isNegative = origVal.indexOf('-') == 0 ? true : false;
                var suffix = isNegative == true ? '-' : '';

                if (origVal.indexOf('-') != -1) {
                    typeof(origVal) === 'String' ?origVal.replaceAll("-", ""):origVal;
                    caretPosition = caretPosition + 1;
                }
                // Get rid of commas and any other bad input
                var justNumbers = origVal.replace(/[^1234567890\.]/g, "");                 
                // If there are no numbers entered, blank out the box
                if (justNumbers.length == 0) {
                    inputElement.value = '';
                    return;
                }

                // Get rid of the decimal place and capture separately
                var decimalRegex = /(\d{0,})(\.(\d{1,})?)?/g;
                var decimalPartMatches = decimalRegex.exec(justNumbers);
                var decimalPart = "";
                if (decimalPartMatches[2] && scope.scale > 0) {
                    decimalPart = decimalPartMatches[2] //+ '00000000000000';
                  //  decimalPartMatches[3] = decimalPartMatches[3] + '00000000000000';
                    if(decimalPartMatches[3] !=undefined && decimalPartMatches[3].length > scope.scale){
                        decimalPart = decimalPart.substring(0, scope.scale +1);
                    }
                }
                var withoutDecimal = decimalPartMatches[1];

                // Assemble the final formatted value and put it in
                var final = '';
                //final += '$' // Now including this via CSS magic to avoid mucking with the form value
                final += withoutDecimal
                final += decimalPart;
                inputElement.value = suffix + final;

                var origSelOffset = origVal.length - justNumbers.length;
                var selPosInNumber = caretPosition - origSelOffset;
                var newSelOffset = final.length - justNumbers.length;
                var newSelPos = selPosInNumber + newSelOffset;
                inputElement.setSelectionRange(newSelPos, newSelPos);
            }
        }
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attr, ngModel) {

                ngModel.$formatters.push(function (value) {
                    if(isNaN(value)){
                        return '';
                    }
                    element[0].value = value;
                    applyNumberFormatting(scope, element[0]);
                    return element[0].value;
                });

                ngModel.$parsers.push(function (value) {
                    element[0].value = value;
                    applyNumberFormatting(scope, element[0]);
                    var finalValue = '';
                    if((element[0].value != '' || element[0].value != undefined)) {
                        finalValue =  element[0].value.replace(/,/gi,'');
                    }
                    finalValue = (isNaN(finalValue) ) ? 0 : finalValue;
                    if(finalValue == '-'){
                        return finalValue;
                    }   else    {
                        return parseFloat(finalValue);
                    }
                });
                element.on('input', function (e) {
                    applyNumberFormatting(scope, element[0]);
                });
            }
        }
    })

    .controller('MultiSelectorController', ['$scope', '$attrs', '$timeout', '$compile', '$window', '$sce',
        function($scope, $attrs, $timeout, $compile, $window, $sce) {
            $scope.itemsList = [];
            $scope.removeItem = function(id) {
                $scope.itemsList.splice(id);
                $scope.record[$scope.field] = $scope.itemsList;
            }

        }
    ])
    .directive("multiselector", ['$compile', function($compile) {
        var getTemplate = function() {
            var template = '<div class="multi-selector-div">' +
                '<li class="multi-selector-item" ng-repeat="item in itemsList track by item.id">' +
                '<span ng-bind="item.value" />' +
                '<i  ng-click="removeItem(item.id)" class="material-icons multi-selector-item-clear cursor-pointer">clear</i>' +
                '</li>' +
                '<input ng-model="item" type="text" />' +
                '</div>';
            return template;
        }
        return {
            restrict: 'E',
            controller: 'MultiSelectorController',
            scope: {
                record: "=",
                field: '='
            },
            link: function(scope, element, attributes) {
                console.log('--multiselector--', scope.record);
                console.log('--multiselector--', scope.field);
                element.html(getTemplate()).show();
                $compile(element.contents())(scope);

                element.find('input').bind("keydown blur", function(event) {
                    console.log('----111', event);
                    if ((event.which == 13 || event.which == 9 || event.type == 'blur') && scope.item != undefined) { // when we press enter

                        var itemObj = { 'id': scope.itemsList.length, 'value': scope.item }
                        scope.$apply(function() {
                            scope.itemsList.push(itemObj);
                            scope.record[scope.field] = scope.itemsList;
                            scope.item = undefined;
                        });
                    }
                });
                scope.$watch(
                    "record",
                    function handleWatchValueChange(newValue, oldValue) {
                        console.log('----watch');
                        if (newValue != undefined && oldValue != newValue) {
                            if (newValue[scope.field] == undefined) {
                                scope.itemsList = [];
                                scope.item = undefined;
                            }
                        }
                    }
                );
            }
       }
    }])
    // .directive('dropDownMultiSelect', function() {
    //     let template = '<div class="btn-group customSelect open" toggle-display-class="open">' +
    //         '<button class="btn btn-small">Select...</button>' +
    //         '<ul class="dropdown-menu" aria-labelledby="dropdownMenu">' +
    //         '<li>' +
    //         '<a ng-click="selectAll()""><i class="fa fa-check" aria-hidden="true"></i>' +
    //         'Check All' +
    //         '</a>' +
    //         '</li>' +
    //         '<li>' +
    //         '<a ng-click=\'deselectAll();\'><i class="fa fa-times" aria-hidden="true"></i>' +
    //         'Uncheck All' +
    //         '</a>' +
    //         '</li>' +
    //         '<li class=\'divider\'></li>' +
    //         '<li ng-repeat=\'option in options\'>' +
    //         '<a ng-click="{{toggleSelectItem(option)}}">' +
    //         '<i class="{{getClassName(option)}}" aria-hidden=\'true\'></i>' +
    //         '<span ng-bind="option"></span>' +
    //         '</a>' +
    //         '</li>' +
    //         '</ul>' +
    //         '</div>';

    //     return {
    //         restrict: 'E',
    //         scope: {
    //             model: '=',
    //             options: '=',
    //         },
    //         link: function(scope, element, attrs) {
    //             // Handling Html Tag Such as Anchor Tag for HyperLink in formula Field..
    //             scope.trustAsHtml = function(viewValue) {
    //                 return $sce.trustAsHtml(viewValue);
    //             }
    //             element.html(template).show();
    //             $compile(element.contents())(scope);
    //         },
    //         controller: function($scope) {
    //             $scope.model = (angular.isDefined($scope.model) && $scope.model.constructor !== Array) ? $scope.model : [];
    //             $scope.model = $scope.model.constructor !== Array ? $scope.model.split(';') : $scope.model;
    //             $scope.openDropdown = function() {

    //                 console.log('$scope.options:', $scope.options);
    //                 $scope.open = !$scope.open;
    //             };

    //             $scope.selectAll = function() {
    //                 $scope.model = [];
    //                 angular.forEach($scope.options, function(item, index) {
    //                     $scope.model.push(item);
    //                 });
    //                 console.log('Model:==', $scope.model);
    //             };

    //             $scope.deselectAll = function() {
    //                 $scope.model = [];
    //             };

    //             $scope.toggleSelectItem = function(option) {

    //                 var intIndex = -1;
    //                 angular.forEach($scope.model, function(item, index) {
    //                     if (item === option) {
    //                         intIndex = index;
    //                     }
    //                 });

    //                 if (intIndex >= 0) {
    //                     $scope.model.splice(intIndex, 1);
    //                 } else {
    //                     $scope.model.push(option);
    //                 }
    //             };

    //             $scope.getClassName = function(option) {
    //                 var varClassName = '';
    //                 angular.forEach($scope.model, function(item, index) {
    //                     if (item === option) {
    //                         varClassName = 'fa fa-check-circle-o';
    //                     }
    //                 });
    //                 return (varClassName);
    //             };
    //         }
    //     }
    // })
    .directive("filereader", [function() {
        return {
            restrict: 'A',
            scope: {
                fileread: "=",
                record: '=',
                fieldInfo: "="
            },
            link: function(scope, element, attributes) {
                element.bind("change", function(changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function(loadEvent) {
                        scope.$apply(function() {
                            scope.fileread = loadEvent.target.result;
                            console.log('--scope.fileread--', scope.fileread);
                            scope.record[scope.fieldName] = scope.fileread;
                            if (scope.fieldInfo != undefined && scope.fieldInfo.UploadFunction != undefined) {
                                scope.fieldInfo.UploadFunction(scope.record.Id, changeEvent.target.files[0].name, scope.fileread);
                            } else {
                                console.log('Upload function not specified to file field.');
                            }
                        });
                    }
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        }
    }])
    .controller('FieldController', ['$q', '$scope', '$attrs', '$timeout', '$window', '$parse', '$sce',
        function($q, $scope, $attrs, $timeout, $compile, $window, $parse, $sce) {
            $scope.template = '';

            $scope.openRefURL = function(idValue) {
                console.log('idValue----->>>', idValue);
                window.open('/' + idValue + '?iospref=web', '_self');
            };

            $scope.openURL = function(url) {
                console.log('url----->>>', url);
                if (!/^(?:(ftp|http|https)?:\/\/)?(?:[\w-]+\.)+([a-z]|[A-Z]|[0-9]){2,6}$/gi.test(url)) {
                    url = "https://" + url;
                }
                window.open(url, '_self');
            };

            $scope.searchFieldApiName = 'Name';
            $scope.controlVariable = {};
            $scope.controlVariable.selectHandler = function(selectedItem) {
                console.log('-----selected Value----', selectedItem);
                $scope.record[$scope.fieldName] = selectedItem.id;
                //$scope.fieldOptions.refValueHandler(selectedItem, $scope.fieldOptions.fieldName);                                   
            };

            // $scope.valueChanged = function(selectedValue,value,fieldName) {      
            //  $scope.fieldOptions.valueChanged($scope.record[$scope.fieldName]);           
            // }; 

            $scope.valueChanged = function(row, orgColumnName, column, value, ViewValue) {
                console.log('value----', value);
                if (value == undefined) {
                    value = null;
                }
                console.log('value----', value);
                var newValue = value;
                if ($scope.fieldInfo.Type == 'CURRENCY' || $scope.fieldInfo.Type == 'DOUBLE') {
                    if (value == "") {
                        value = 0;
                    }
                    newValue = parseFloat(value);
                    console.log('newValue', newValue);
                    //scope.row[scope.column] = newValue;
                }

                //$scope.updatedRowsHandler($scope.fieldInfo, row, column, newValue);
            };

            $scope.totalValue = {};
            $scope.selectedFieldsMap = {};
            $scope.updatedRowsMap = {};
            $scope.updatedRowsHandler = function(obj, row, column, value) {
                $scope.totalValue[column] = 0;
                $scope.totalColumnValue = 0;
                if (!isNaN(value)) {
                    $scope.totalValue[column] = parseInt(value);
                }
                if (row[column] == undefined) {
                    row[column] = value;
                }
                if ($scope.selectedFieldsMap[row.Id] == undefined) {
                    $scope.selectedFieldsMap[row.Id] = {};
                }
                $scope.selectedFieldsMap[row.Id][column] = true;
                $scope.updatedMap = $scope.updatedRowsMap[obj.Name];
                if ($scope.updatedMap == undefined) {
                    $scope.updatedMap = {};
                }
                if ((row.Id.length != 15 && row.Id.length != 18) || row.Id == undefined) {
                    $scope.updatedMap[row.Id] = row;
                } else {
                    $scope.rowInfo = $scope.updatedMap[row.Id];
                    if ($scope.rowInfo == undefined) {
                        $scope.rowInfo = {};
                    }
                    $scope.rowInfo[column] = value;
                    $scope.rowInfo['Id'] = row.Id;
                    $scope.updatedMap[row.Id] = $scope.rowInfo;
                }
                for (var key in $scope.totalValue) {
                    if ($scope.totalValue.hasOwnProperty(key)) {
                        $scope.totalColumnValue = $scope.totalColumnValue + $scope.totalValue[key];
                    }
                }
                //$scope.totalColumnValue = $scope.totalColumnValue + $scope.totalValue[column]; 
                console.log('$scope.updatedMap functionn==', $scope.updatedMap);
                $scope.updatedRowsMap[obj.Name] = $scope.updatedMap;
                console.log('updatedmassageUpdatedRowsMap functionn==', $scope.updatedRowsMap);

            };

            $scope.getLookupData = function(fieldName, sobjName, query, filterClause) {
                var deferred = $q.defer();
                filterClause = $scope.tableCommunicator.replaceStringParamters(filterClause);
                filterClause = $scope.tableCommunicator.replaceListParamters(filterClause);
                let fetchLookupDataParamsMap = {};
                fetchLookupDataParamsMap.refField = fieldName;
                fetchLookupDataParamsMap.sobjectName = sobjName;
                fetchLookupDataParamsMap.searchTerm = query.term;
                fetchLookupDataParamsMap.filterClause = filterClause;
                fetchLookupDataParamsMapJson = angular.toJson(fetchLookupDataParamsMap);
                Visualforce.remoting.Manager.invokeAction(
                    _RemotingFlexGridEnhancedActions.FetchLookupData,
                    fetchLookupDataParamsMapJson,
                    function(lookupResult, event) {
                        if (event.status) {
                            $scope.$apply(function() {
                                deferred.resolve(lookupResult);
                                var data = {
                                    results: []
                                }
                                data.results = lookupResult.SobjList;
                            if( data != undefined && data.results != undefined){
                                data.results.unshift({id:"", text: '--None--'})
                                for (var i = 0; i < data.results.length; i++) {
                                    if(data.results[i].text == undefined){
                                        data.results[i].text = '';
                                    }
                                }
                                    query.callback(data);
                                }
                            });
                        } else {
                            $scope.$apply(function() {});
                        }
                    }, {
                        buffer: false,
                        escape: false
                    }
                );
                return deferred.promise;
            }

            $scope.toUTCDate = function(date) {
                var _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
                return _utc;
            };
            $scope.getDate = function(value) {
                console.log('Date Val : ', value);
                // if (value != undefined) {

                //          return value = $scope.toUTCDate(new Date(value+timeOffset));
                //          //return value;

                //       }
                //return value;

                return value;
            };
            $scope.getDateTime = function(value) {
                var time = undefined;
                if (value != undefined) {
                    return $scope.toUTCDate(new Date(value + timeOffset)); //             
                }
                return time;
            };
            $scope.trustSrcHTML = function(src) {
               var srcR = src;
				let returnFalse = false;
                var splitBasedOnOnclick='';
                var containsAnchorWithEvent = /<a\b[^>]*\s+on\w+\s*=\s*['"][^'"]*['"][^>]*>[\s\S]*?<\/a>/i.test(srcR);
                if (containsAnchorWithEvent) {
                    var containsClickAndWindowOpen = /click/i.test(srcR) && /window\.open/i.test(srcR);
                    if(containsClickAndWindowOpen){
                        splitBasedOnOnclick = srcR.split('onclick');
                        var chkClickAndWindowOpen = splitBasedOnOnclick[1];
                        var regextocheckanyOnEvent = /\bon\w+\s*=\s*["'][^"']*["']/i;
                        if(!regextocheckanyOnEvent.test(chkClickAndWindowOpen)){
                            if(!srcR.includes('<script') || !srcR.includes('alert') || !srcR.includes('prompt') || !srcR.includes('input') ||
                            !srcR.includes('download=') || !srcR.includes('/evil?') || !srcR.includes('referrerpolicy=')
                            || !srcR.includes('console') || !srcR.includes('popovertarget') || !srcR.includes('<meta')
                            || !srcR.includes('no-referrer') || !srcR.includes('input')){
								returnFalse =true;
                                return $scope.sce.trustAsHtml(srcR);
                            }
                        }
                        
                    }
                }else{
                    if(src?.includes("<meta")){
                        if(src.includes("no-referrer")){
                            src = src.replaceAll("no-referrer", "origin");
                            src = src.replaceAll("<", "&lt;");
                            src = src.replaceAll(">", "&gt;");
                        }			
                        srcR = DOMPurify.sanitize(src);
                    }else{
                        srcR = DOMPurify.sanitize(src);	
                        return $scope.sce.trustAsHtml(srcR);
                    }
					
                }
					
				if(!returnFalse){
                    if(src?.includes("<meta")){
                        if(src.includes("no-referrer")){
                            src = src.replaceAll("no-referrer", "origin");
                            src = src.replaceAll("<", "&lt;");
                            src = src.replaceAll(">", "&gt;");
                        }			
                        srcR = DOMPurify.sanitize(src);
                    }
					return $scope.sce.trustAsHtml(srcR);
				}else{
                    return $scope.sce.trustAsHtml(srcR);
                }			
	        }
            $scope.handleHTML = function(src) {//Bug 168262: Product - E-grid/Data table Enhanced : On hover over of rich text area fields on E-grid/Data table enhanced HTML tags are appearing
                console.log('src == ',src);
                var regex = /(<([^>]+)>)/ig                
                var res = src.replace(regex, "");
                //B30u64g78
                if(res.includes('&amp;')){  
                    res = res.replaceAll('&amp;', '&');
                }
                if(res.includes('&lt;')){
                    res = res.replaceAll('&lt;', '<');
                }
                if(res.includes('&gt;')){
                    res = res.replaceAll('&gt;', '>');
                }
                if(res.includes('&quot;')){
                    res = res.replaceAll('&quot;', '"');
                }
                if(res.includes('&#39;')){
                    res = res.replaceAll('&#39;', '\'');
                }
                console.log('res == ',res);
                return res;
            }
            
         if($scope.tableMetaData != undefined && $scope.tableMetaData.FlexTableConfigMap != undefined && $scope.tableMetaData.FlexTableConfigMap.FieldMetaData[$scope.fieldName] != undefined ){
            if( $scope.tableMetaData.FlexTableConfigMap.FieldMetaData[$scope.fieldName].fieldLength != 0)
            $scope.fieldLength = $scope.tableMetaData.FlexTableConfigMap.FieldMetaData[$scope.fieldName].fieldLength;
            if( $scope.tableMetaData.FlexTableConfigMap.FieldMetaData[$scope.fieldName].PrecisionLength != 0){
            $scope.PrecisionLength = $scope.tableMetaData.FlexTableConfigMap.FieldMetaData[$scope.fieldName].PrecisionLength;
            $scope.ScaleLength = $scope.tableMetaData.FlexTableConfigMap.FieldMetaData[$scope.fieldName].ScaleLength;
            $scope.integerPartLength = $scope.PrecisionLength - $scope.ScaleLength;
                 if($scope.PrecisionLength == 4 || $scope.PrecisionLength <= 6){
                    $scope.PrecisionLength +=1;
                 }else if($scope.PrecisionLength == 7 || $scope.PrecisionLength <= 9){
                    $scope.PrecisionLength +=2;
                 }else if($scope.PrecisionLength == 10 || $scope.PrecisionLength <= 12){
                    $scope.PrecisionLength +=3;
                 }else if($scope.PrecisionLength == 13 || $scope.PrecisionLength <= 15){
                    $scope.PrecisionLength +=4;
                 }else if($scope.PrecisionLength == 16 || $scope.PrecisionLength <= 18){
                    $scope.PrecisionLength +=5;
                 }
                 if($scope.ScaleLength != 0){
                    $scope.PrecisionLength +=1;
                 }    
            }
        }
            
            $scope.handlechange = function(record, fieldName, fieldValue) {
                if (fieldValue != undefined && fieldValue != '' && ($scope.fieldType == 'DATETIME')) {
                    let d = new Date();
                    let localOffset = d.getTimezoneOffset() * 60000;
                    if(typeof fieldValue == 'string'){
                        let parts = fieldValue.split(" ");
                        if(parts.length == 3){
                            let datepart = parts[0].split("/");
                            let timepart = parts[1].split(":");
                            if(datepart.length == 3 && timepart.length == 2 && parts[2].length == 2){
                                if(localeBasedEnhancedDateTimeFormat.indexOf('d/m/Y') == 0){
                                    fieldValue =  toEDateTime(datepart, timepart);
                                }
                                fieldValue = Date.parse(fieldValue);
                                fieldValue = fieldValue - localOffset - timeOffset;                                
                            } 
                        }
                    } else {
                        fieldValue = fieldValue - localOffset - timeOffset;
                    }
                    //record[fieldName] = fieldValue + 1 ;     // leading zero issue. change is not register so we manually change value (modal must be changed to execute the Formatter after the change).                
                }
                if (fieldValue != undefined && fieldValue != '' && ($scope.fieldType == 'DATE')) {
                    let d = new Date();
                    let localOffset = d.getTimezoneOffset() * 60000;
                    if(typeof fieldValue == 'string'){
                        let parts = fieldValue.split("/");
                        if(parts.length == 3){ 
                            if(localeBasedEnhancedDateFormat.indexOf('d/m/Y') == 0){
                                fieldValue =  toEDate(parts);
                            }
                            fieldValue = Date.parse(fieldValue);                       
                            fieldValue = fieldValue - localOffset ;
                        }
                    }else{
                        fieldValue = fieldValue - localOffset ;
                    }
                    //record[fieldName] = fieldValue;
                }            
            

                if (fieldValue != undefined && fieldValue != '' && ($scope.fieldType == 'TIME')) {
                    if(typeof fieldValue == 'string'){
                        let valueParts = fieldValue.toString().split(':');
                        if(valueParts.length == 2){
                            fieldValue = (parseInt(valueParts[0]) * 360000) + (parseInt(valueParts[1]) * 60000);
                        }
                    }
                } 
                if($scope.fieldType == 'CURRENCY' || $scope.fieldType == 'DOUBLE' || $scope.fieldType == 'PERCENT'){
                    record[fieldName] = fieldValue = isNaN(fieldValue) ? undefined : fieldValue;
                }
                
               
               /* if(isNaN(record[fieldName])){
                    delete record[fieldName];
                }*/
               
                $scope.changeHandler({
                    record: record,
                    fieldName: fieldName,
                    fieldValue: fieldValue
                });

            }
            $scope.checkCondition = function() {
                if ($scope.tableCommunicator != undefined) {
                    $scope.tableCommunicator.checkCondition();
                }
            }
            $scope.getFieldTemplate = function(isEdit) {
                let requiredTemplate = '<span class="requiredField h-line-left" ><b>|</b></span>';
                let requiredTextTemplate = '<span class="h-line-req-error" ng-if="record[fieldName] === undefined || record[fieldName] === null ||record[fieldName] === \'\'">Field is required</span>';
                let requiredReferenceTextTemplate = '<span class="h-line-req-error" ng-if="record[orgFieldName]==undefined || record[orgFieldName]==null ||record[orgFieldName]==\'\'">Field is required</span>';

                if ($scope.tableCommunicator.hideTableCellMap != undefined &&
                    $scope.tableCommunicator.hideTableCellMap[$scope.record.Id] != undefined &&
                    $scope.tableCommunicator.hideTableCellMap[$scope.record.Id][$scope.fieldName] != undefined &&
                    $scope.tableCommunicator.hideTableCellMap[$scope.record.Id][$scope.fieldName]) {
                    if($scope.fieldType == 'CURRENCY' || $scope.fieldType == 'DOUBLE' || $scope.fieldType == 'PERCENT'){
                        $scope.template = '<span class="pull-right" ng-bind="fieldValue"></span> ';
                    }else{
                        $scope.template = '<span ng-bind="fieldValue"></span> ';
                    }
                   
                } else {
                    $scope.scale = ($scope.fieldInfo != undefined && $scope.fieldInfo.Scale != undefined) ? $scope.fieldInfo.Scale : 0;
                    if($scope.fieldName.indexOf('.') != -1){
                        $scope.scale = ($scope.fieldInfo != undefined && $scope.fieldInfo.ReferenceFieldInfo != undefined && $scope.fieldInfo.ReferenceFieldInfo.Scale != undefined) ? $scope.fieldInfo.ReferenceFieldInfo.Scale : 0;
                        if($scope.tableMetaData.FlexTableConfigMap.FieldMetaData[$scope.fieldName] && $scope.tableMetaData.FlexTableConfigMap.FieldMetaData[$scope.fieldName].ReferenceFieldInfo && $scope.tableMetaData.FlexTableConfigMap.FieldMetaData[$scope.fieldName].ReferenceFieldInfo.Scale){
                            $scope.scale = $scope.tableMetaData.FlexTableConfigMap.FieldMetaData[$scope.fieldName].ReferenceFieldInfo.Scale
                        }

                    }
                    if($scope.fieldType != 'DOUBLE'){
                    $scope.scale = $scope.scale > 2 ? 2 : $scope.scale;
                    }                   
                    $scope.isString = typeof($scope.fieldValue) == 'string' ? true : false;
                    $scope.isValidValue = $scope.fieldValue != undefined;


                    $scope.fieldType = (!isEdit && $scope.refFieldType != undefined && $scope.fieldType == 'REFERENCE') ? $scope.refFieldType : $scope.fieldType;
                  //  if($scope.fieldName.indexOf('.Name')!= -1){
                    if($scope.fieldName.match( /(\.Name)$/g) || $scope.fieldName.match( /(\.Id)$/g)){                   
                        $scope.refFieldType = $scope.fieldType = 'REFERENCE';                        
                    }
                    
                    if (isEdit && !$scope.isReadOnlyField && $scope.isEditDisplayField) {    
                        
                        $scope.template = '<span><input tabindex="0" class="textAreaContent "' +
                        'change-handler="handlechange(record,fieldName,fieldValue)"' +
                        'ng-model="fieldValue" type="text"' +
                        'query-data="getLookupData(fieldName,sobjName,query,filterClause);"' +
                        'ref-obj="fieldInfo" table-meta-data="tableMetaData"' +
                        'detail-info="tableMetaData.DataTableDetailConfigMap"' +
                        'row="record" column="fieldName" field-value="fieldValue" org-field-name="orgFieldName" auto-complete="angular"></span>';
                    }else{ 
                        switch ($scope.fieldType) {
                            case 'ANYTYPE':
                                if (isEdit) {
                                    $scope.template = '<input class="form-control"  type="text" ng-model="record[fieldName]" ng-change="handlechange(record,fieldName,record[fieldName]);" />';
                                } else {
                                    $scope.template = '<span ng-bind="fieldValue"></span> ';
                                }
                                break;
                            case 'BOOLEAN':
                                if (isEdit && !$scope.isReadOnlyField) {
                                    $scope.template = '<input style="display: table;"  type="checkbox" ng-model="record[fieldName]" ng-change="handlechange(record,fieldName,record[fieldName]);" />';
                                } else {
                                    if ($scope.fieldValue == true) {
                                        $scope.template = '<i class="fa fa-check" aria-label="True"></i>';
                                    } else {
                                        if ($scope.fieldValue == false) {
                                            $scope.template = '<i class="fa fa-close" style="color:grey" aria-label="False"></i>';
                                        } else if ($scope.fieldValue == undefined || ($scope.fieldValue != undefined && ($scope.isString && $scope.fieldValue.indexOf('tableCommunicator.record') == -1))) {
                                            $scope.template = '<span ng-bind="fieldValue"></span>';
                                        }
                                    }
                                }
                                break;
                            case 'CURRENCY':
                                $scope.currencySymbol = currencySymbol;
                                if (isEdit && !$scope.isReadOnlyField) {                                
                                    $scope.template = '<input class="form-control text-right" type="text" ng-model="record[fieldName]"  formatted-number-input="angular" ng-change="handlechange(record,fieldName,record[fieldName]);" maxlength ='+ $scope.PrecisionLength+'/>';
                                } else {
                                    if ($scope.record['isTotal'] != true && $scope.record['isSubTotal'] != true) {
                                        $scope.template = '<span ng-bind="fieldValue | noFractionCurrency : {{scale}} : \'' + currencySymbol + '\'" class="pull-right"></span> ';
                                    } else if (($scope.record['isTotal'] == true || $scope.record['isSubTotal'] == true) && $scope.fieldValue == $scope.tableCommunicator.maskValue) {
                                        $scope.template = '<span class="pull-right" ng-bind="fieldValue" ></span>';
                                    } else {
                                        if($scope.fieldValue == undefined && $scope.record[$scope.orgFieldName] != undefined){
                                            $scope.fieldValue = $scope.record[$scope.orgFieldName];
                                            $scope.isString = typeof($scope.fieldValue) == 'string' ? true : false;
                                        }
                                        $scope.template = ($scope.fieldValue != undefined && isNaN($scope.fieldValue) && ($scope.isString && $scope.fieldValue.indexOf('tableCommunicator.record') == -1)) ? '<span class="pull-right" ng-bind="fieldValue"/></span> ' : '<span class="pull-right elsePart" ng-bind="a = ' + $scope.fieldValue + ' | noFractionCurrency:{{scale}} : \'' + currencySymbol + '\'; (((a == undefined || a == \'\' || a == tableCommunicator.maskValue) && isValidValue) ? 0 : a  | noFractionCurrency:{{scale}} : \'' + currencySymbol + '\')"></span>';
                                        //$scope.template = '<span ng-bind="'+$scope.fieldValue +' | noFractionCurrency"></span> ';
                                        //$scope.template = '<span ng-bind="'+$scope.fieldValue+'"></span> ';
                                
                                    }
                                }
                                break;
                            case 'DATE':
                                if (isEdit && !$scope.isReadOnlyField) {
                                    // see this to set date format in the template below for edit mode
                                    localeBasedEnhancedDateFormat = sfFormatToJSFormat(userDateFormat, false);
                                    $scope.template = '<input class="form-control"  type="text" ng-model="record[fieldName]" format="' + localeBasedEnhancedDateFormat + '" e-grid-date-picker="angular" ng-change="handlechange(record,fieldName,record[fieldName]);" />';
                                } else {
                                    if ($scope.fieldValue == '' || ($scope.fieldValue != undefined && isNaN($scope.fieldValue) && ($scope.isString && $scope.fieldValue.indexOf('tableCommunicator.record') == -1))) {
                                        $scope.template = '<span ng-bind="fieldValue" title="{{fieldValue}}/></span> ';
                                    } else {
                                        $scope.template = !($scope.fieldValue != undefined && isNaN($scope.fieldValue) && typeof $scope.fieldValue !='object' && $scope.fieldValue.indexOf('tableCommunicator.record') != -1) ? '<span ng-bind="fieldValue | date:\''+ userDateFormat +'\'"></span>' : '';                               
                                       
                                    }
                                }
                                break;
                            case 'DATETIME':
                                if (isEdit && !$scope.isReadOnlyField) {
                                    // see this to set date time format in the template below for edit mode
                                    localeBasedEnhancedDateTimeFormat = sfFormatToJSFormat(userDateTimeFormat, true);                                
                                    
                                    $scope.template = '<input class="form-control"  type="text" ng-model="record[fieldName]" format="\'' + localeBasedEnhancedDateTimeFormat + '\'" e-grid-date-time-picker="angular" ng-change="handlechange(record,fieldName,record[fieldName]);"/>';
                                } else {
                                    if ($scope.fieldValue == '' || ($scope.fieldValue != undefined && isNaN($scope.fieldValue) && ($scope.isString && $scope.fieldValue.indexOf('tableCommunicator.record') == -1))) {
                                        $scope.template = '<span ng-bind="fieldValue" title="{{fieldValue}}"/></span> ';
                                    } else {
                                        $scope.template = !($scope.fieldValue != undefined && isNaN($scope.fieldValue) && typeof $scope.fieldValue !='object' && $scope.fieldValue.indexOf('tableCommunicator.record') != -1) ? '<span ng-bind="fieldValue |  date:\'' + userDateTimeFormat + '\'"/></span>' : '';
                                    }
                                }
                                break;
                            case 'DOUBLE':
                                if (isEdit && !$scope.isReadOnlyField) {
                                    $scope.template = '<input class="form-control text-right" type="text" formatted-number-input="angular" ng-model="record[fieldName]" ng-change="handlechange(record,fieldName,record[fieldName]);" maxlength ='+$scope.PrecisionLength+'/>';
                                } else {
                                    if($scope.fieldValue == undefined && $scope.record[$scope.orgFieldName] != undefined && ($scope.record['isTotal'] == true || $scope.record['isSubTotal'] == true)){
                                        $scope.fieldValue = $scope.record[$scope.orgFieldName];
                                    }
                                    if ($scope.record['isTotal'] != true && $scope.record['isSubTotal'] != true) {
                                        $scope.template = '<span class="pull-right" ng-bind="fieldValue | customNumberFilter:{{scale}}" ></span>';
                                    } else if (($scope.record['isTotal'] == true || $scope.record['isSubTotal'] == true) && $scope.fieldValue == $scope.tableCommunicator.maskValue) {
                                        $scope.template = ($scope.fieldValue == $scope.tableCommunicator.maskValue) ? $scope.template = '<span class="pull-right" ng-bind="fieldValue"></span> ' : '<span class="pull-right" ng-model="fieldValue | customNumberFilter:{{scale}}"></span>';
                                    } else if($scope.fieldValue != undefined && (($scope.record['isTotal'] != undefined && $scope.record['isTotal'] == true) || ($scope.record['isSubTotal'] != undefined && $scope.record['isSubTotal'] == true)) && typeof $scope.fieldValue =='string' && ($scope.isString && $scope.fieldValue.indexOf('tableCommunicator.record') == -1)){
                                        $scope.template = '<span class="pull-right"> ' + $scope.fieldValue +' </span>';
                                    } else {
                                        $scope.template = !($scope.fieldValue != undefined && isNaN($scope.fieldValue) && $scope.fieldValue.indexOf('tableCommunicator.record') != -1) ? '<span class="pull-right" ng-bind="fieldValue | customNumberFilter:{{scale}}"/></span> ' : '<span class="pull-right" ng-bind="a = ' + $scope.fieldValue + ' | customNumberFilter:{{scale}}; ((a == undefined || a == \'\' || a == tableCommunicator.maskValue) && isValidValue ) ? 0 : a  | customNumberFilter:{{scale}} "></span>';
                                        //$scope.template ='<span ng-bind="'+$scope.fieldValue + ' | number"></span>';
                                    }
                                }
                                break;
                            case 'EMAIL':
                                if (isEdit && !$scope.isReadOnlyField) {
                                    $scope.template = '<input class="form-control"  type="email" ng-model="record[fieldName]" ng-change="handlechange(record,fieldName,record[fieldName]);" />';
                                } else {
                                    if ($scope.fieldValue == undefined || ($scope.fieldValue != undefined && ($scope.isString && $scope.fieldValue.indexOf('tableCommunicator.record') == -1))) {
                                            if (($scope.record['isTotal'] == true || $scope.record['isSubTotal'] == true)) {
                                                $scope.template = '<span ng-bind="fieldValue" title="{{fieldValue}}"></span>';
                                            } else{
                                                if($scope.tableMetaData.FlexTableConfigMap.FlexTableConfig.EnableHyperLinkAsText != true){
                                                    $scope.template = '<span><a tabIndex="0" class="cursor-pointer" href="mailto:' + $scope.fieldValue + '" ng-bind="fieldValue" title="{{fieldValue}}"></a></span> ';
                                                }else{
                                                    $scope.template = '<span ng-bind="fieldValue" title="{{fieldValue}}"></span> ';
                                                }
                                            
                                            }
                                        }                                   
                                }
                                break;
                            case 'FILE':
                                if (isEdit && !$scope.isReadOnlyField) {
                                    $scope.template = '<input type="file" field-info="fieldInfo" record="record"' +
                                        'filereader="angular" fileread="record[fieldName]" />';
                                } else {

                                }
                                break;
                            case 'ID':
                                {
                                    $scope.template = '<span ng-bind="fieldValue"></span>';
                                }
                                break;
                            case 'INTEGER':
                                if (isEdit && !$scope.isReadOnlyField) {
                                    $scope.template = '<input class="form-control text-right" type="text" formatted-number-input="angular" ng-model="record[fieldName]" ng-change="handlechange(record,fieldName,record[fieldName]);" maxlength ='+$scope.PrecisionLength+'/>';
                                } else {
                                    if ($scope.record['isTotal'] != true && $scope.record['isSubTotal'] != true) {
                                        $scope.template = '<span class="pull-right" ng-bind="fieldValue | customNumberFilter:{{scale}}"></span>';
                                    } else if (($scope.record['isTotal'] == true || $scope.record['isSubTotal'] == true) && $scope.fieldValue == $scope.tableCommunicator.maskValue) {
                                        $scope.template = '<span class="pull-right" ng-bind="' + $scope.fieldValue + ' | customNumberFilter:{{scale}}"></span>';
                                    } else {
                                        $scope.template = ($scope.fieldValue != undefined && isNaN($scope.fieldValue) && ($scope.isString && $scope.fieldValue.indexOf('tableCommunicator.record') == -1)) ? '<span class="pull-right" ng-bind="fieldValue | number:{{scale}}"/></span> ' : '<span class="pull-right" ng-bind="a = ' + $scope.fieldValue + ' | customNumberFilter:{{scale}}; ((a == undefined || a == \'\' || a == tableCommunicator.maskValue)  && isValidValue ) ? 0 : a | customNumberFilter:{{scale}} "></span>';
                                        //$scope.template ='<span ng-bind="'+$scope.fieldValue + ' | number"></span>';
                                    }
                                }
                                break;
                            case 'PERCENT':
                                if (isEdit && !$scope.isReadOnlyField) {
                                    $scope.template = '<input class="form-control text-right"  type="text" formatted-percent-input="angular" ng-model="record[fieldName]" ng-change="handlechange(record,fieldName,record[fieldName]);"/>';
                                } else {
                                    if($scope.fieldValue == undefined && $scope.record[$scope.orgFieldName] && ($scope.record['isTotal'] == true || $scope.record['isSubTotal'] == true)){
                                        $scope.fieldValue = $scope.record[$scope.orgFieldName];
                                    }
                                    if ($scope.record['isTotal'] != true && $scope.record['isSubTotal'] != true && $scope.record['isGrandTotal'] != true && $scope.fieldValue != $scope.tableCommunicator.maskValue) {
                                        $scope.template = '<span class="pull-right" ng-bind="fieldValue | percentage:{{scale}}"></span> ';
                                    } else if (($scope.record['isTotal'] == true || $scope.record['isSubTotal'] == true || $scope.record['isGrandTotal'] == true) && ($scope.fieldValue == $scope.tableCommunicator.maskValue || typeof $scope.fieldValue !='string')) {
                                        $scope.template = '<span class="pull-right" ng-bind="' + $scope.fieldValue + ' | percentage:{{scale}}"></span>';                                       
                                    } else {
                                        $scope.template = !($scope.fieldValue != undefined && isNaN($scope.fieldValue) && $scope.fieldValue.indexOf('tableCommunicator.record') != -1) ? '<span class="pull-right" ng-bind="fieldValue  "/></span> ' : '<span class="pull-right" ng-bind="a = ' + $scope.fieldValue + ' | percentage:{{scale}}; ((a == undefined || a == \'\' || a == tableCommunicator.maskValue) && isValidValue ) ? 0 : a  | percentage:{{scale}} "></span>';
                                        
                                        //$scope.template = '<span ng-bind="'+$scope.fieldValue +' | percentage:{{scale}}"></span> ';
                                    }
                                }
                                break;
                            case 'MULTIPICKLIST':
                                if(isEdit && !$scope.isReadOnlyField){
                                    $scope.template ='<select class="form-control"   ng-model="record[fieldName]" ng-options="opt.Value as opt.Label for opt in fieldInfo.PickListFieldInfo.PickListKeyValueMapList" ng-change="handlechange(record,fieldName,record[fieldName]);" ></select>'; 								
                                }else{
                                    $scope.template = ($scope.fieldValue != undefined && ($scope.isString && $scope.fieldValue.indexOf('tableCommunicator.record') == -1)) ? '<span ng-bind="fieldValue" title="{{fieldValue}}"></span>' : '';
                                } 
                                break;
                            case 'PHONE':
                                if (isEdit && !$scope.isReadOnlyField) {
                                    $scope.template = '<input class="form-control"  type="text" ng-model="record[fieldName]" ng-change="handlechange(record,fieldName,record[fieldName]);" />';
                                } else {
                                    //$scope.template = ($scope.fieldValue != undefined && isNaN($scope.fieldValue) && ($scope.isString && $scope.fieldValue.indexOf('tableCommunicator.record') == -1)) ? '<span ng-bind="fieldValue"/></span> ' : '';
                                    $scope.template =   '';
                                    if ($scope.fieldValue == undefined || ($scope.fieldValue != undefined && ($scope.isString && $scope.fieldValue.indexOf('tableCommunicator.record') == -1))) {
                                        $scope.template =   '<span ng-bind="fieldValue" title="{{fieldValue}}"></span>';
                                    }
                                }
                                break;
                            case 'PICKLIST':
                                if (isEdit && !$scope.isReadOnlyField && $scope.refFieldInfo == undefined) {
                                    $scope.template = '<select class="form-control" ng-change="changePicklistValue();" ng-model="pickListValue" ng-options="opt.Value as opt.Label for opt in fieldInfo.PickListFieldInfo.PickListKeyValueMapList"></select>';
                                }else if (isEdit && !$scope.isReadOnlyField && $scope.refFieldInfo != undefined) {
                                    $scope.template = '<select class="form-control" ng-change="changePicklistValue();" ng-model="pickListValue" ng-options="opt.Value as opt.Label for opt in refFieldInfo.PickListFieldInfo.PickListKeyValueMapList"></select>';
                                }else{
                                    if($scope.refFieldInfo == undefined){
                                        $scope.template = (($scope.record['isTotal'] != undefined && $scope.record['isTotal'] != true) || ($scope.record['isSubTotal'] != undefined && $scope.record['isSubTotal'] != true)) ? '<span ng-bind="fieldInfo.PickListFieldInfo.FieldPicklistValueLabelMap[fieldValue.Value != undefined? fieldValue.Value : fieldValue ]"></span> ' : '<span ng-bind="fieldValue" title="{{fieldValue}}"/></span>';
                                    }else{
                                        $scope.template = (!($scope.record['isTotal'] != undefined && $scope.record['isTotal'] != true) || ($scope.record['isSubTotal'] != undefined && $scope.record['isSubTotal'] != true)) ? '<span ng-bind="refFieldInfo.PickListFieldInfo.FieldPicklistValueLabelMap[fieldValue.Value != undefined? fieldValue.Value : fieldValue ]"></span> ' : '<span ng-bind="fieldValue" title="{{fieldValue}}"/></span>';
                                    }
                                $scope.template = ($scope.fieldValue != undefined && isNaN($scope.fieldValue) && typeof $scope.fieldValue !='object' && $scope.fieldValue.indexOf('tableCommunicator.record') == -1) ? $scope.template : $scope.template;

                                }
                                break;
                            case 'RADIO':
                                if (isEdit && !$scope.isReadOnlyField) {
                                    $scope.template = '<label class="radio-inline" ng-repeat="option in fieldInfo.RadioOptions"><input ng-model="record[fieldName]" type="radio" name="optradio" ng-change="handlechange(record,fieldName,record[fieldName]);">{{option}}</label>';
                                } else {

                                }
                                break;
                                /*******************************/
                            case 'REFERENCE':
                            if (isEdit && !$scope.isReadOnlyField) {
                                /* $scope.template =`<customautosuggest object-name="fieldInfo.RefObjectInfo.name" 
                                                    search-field-api-name="searchFieldApiName" options="refFieldOptions" />`; */
                                $scope.template = '<span><input tabindex="0" class="textAreaContent "' +
                                    'change-handler="handlechange(record,fieldName,fieldValue)"' +
                                    'ng-model="fieldValue" type="text"' +
                                    'query-data="getLookupData(fieldName,sobjName,query,filterClause);"' +
                                    'ref-obj="fieldInfo" table-meta-data="tableMetaData"' +
                                    'detail-info="tableMetaData.DataTableDetailConfigMap"' +
                                    'row="record" column="fieldName" field-value="fieldValue" org-field-name="orgFieldName" auto-complete="angular"></span>';
                            } else {
                                let isNonReferenceValue = false;
                                if($scope.tableCommunicator.hideTableCellMap != undefined && $scope.tableCommunicator.hideTableCellMap[$scope.record.Id] != undefined && $scope.tableCommunicator.hideTableCellMap[$scope.record.Id][$scope.orgFieldName] == true){
                                    isNonReferenceValue = true;
                                } else if (($scope.record['isTotal'] != undefined && $scope.record['isTotal'] == true) || ($scope.record['isSubTotal'] != undefined && $scope.record['isSubTotal'] == true) || ($scope.record['isGrandTotal'] != undefined && $scope.record['isGrandTotal'] == true)) {
                                        if($scope.record[$scope.orgFieldName] == undefined || ($scope.record[$scope.orgFieldName] != undefined && (typeof $scope.record[$scope.orgFieldName] == 'string' && $scope.record[$scope.orgFieldName].indexOf('tableCommunicator.record') == -1))){
                                            isNonReferenceValue = true; 
                                        } 
                                    } 
                                if( $scope.fieldValue == undefined && $scope.record[$scope.orgFieldName] != undefined && (($scope.record['isTotal'] != undefined && $scope.record['isTotal'] == true) || ($scope.record['isSubTotal'] != undefined && $scope.record['isSubTotal'] == true))){
                                    $scope.fieldValue = $scope.record[$scope.orgFieldName];
                                }
                                if(isNonReferenceValue == true){
                                        if($scope.tableCommunicator.enableGroupedSubTotalRow == true){ 
                                            $scope.record[$scope.orgFieldName] = $scope.fieldValue;
                                        }
                                    $scope.template = '<span ng-bind="record[orgFieldName]"></span> ';
                                } else {
                                    if($scope.fieldInfo.ReferenceTo == "User" && $scope.tableMetaData.FlexTableConfigMap.FlexTableConfig.EnableHyperLinkAsText != true){
                                        $scope.template = '<span ng-if="(refFieldType !=\'REFERENCE\' && refFieldType != \'STRING\' && refFieldType != \'TEXTAREA\'&& refFieldType != \'DOUBLE\' && refFieldType == \'CURRENCY\' && refFieldType == \'INTEGER\' && refFieldType == \'PERCENT\') && tableCommunicator.escapeHTMLMap != undefined && tableCommunicator.escapeHTMLMap[fieldName] == undefined" ng-bind="fieldValue">1</span>' +
                                        '<span ng-if="(refFieldType ==\'STRING\' || refFieldType == \'TEXTAREA\') && tableCommunicator.escapeHTMLMap[fieldName] == undefined" ng-bind="fieldValue"></span>' +
                                        '<span ng-if="(refFieldType ==\'DOUBLE\' || refFieldType == \'CURRENCY\' || refFieldType == \'INTEGER\'|| refFieldType == \'PERCENT\') "  ng-bind="fieldValue" class="pull-right">2</span>' +
                                        '<span ng-if="(refFieldType ==\'STRING\' || refFieldType == \'TEXTAREA\') && tableCommunicator.escapeHTMLMap[fieldName] != undefined" ng-bind-html="trustSrcHTML(fieldValue)">3</span>' +
                                        //hyperlink - false, detail - true, showlink as text - false
                                        '<span ng-if="refFieldType ==\'REFERENCE\' && tableMetaData.DataTableDetailConfigMap[orgFieldName]" >' +
                                        // '<span ng-if="refFieldType ==\'REFERENCE\' && tableMetaData.DataTableDetailConfigMap[orgFieldName].ShowLinkAsText == false">' +
                                        // '<a tabIndex=0 target="_blank" href="/apex/myProfileView?id={{refIdValue}}" title="{{fieldVlaue}}" ' +
                                        // 'id="{{record.Id}}{{fieldIdentifier}}{{refIdValue}}{{tableCommunicator.tableId}}"' +
                                        // 'ng-mouseover="showTooltip(refIdValue,record.Id+fieldIdentifier+refIdValue+tableCommunicator.tableId)"' +
                                        // 'ng-focus="showTooltip(refIdValue,record.Id+fieldIdentifier+refIdValue+tableCommunicator.tableId)"' +
                                        // 'ng-mouseleave="hideTooltip(refIdValue,record.Id+fieldIdentifier+refIdValue+tableCommunicator.tableId)"' +
                                        // 'ng-bind="fieldValue "></a>' +
                                        // '</span>' +
                                        // Bug 386310: OSPI issue
                                        '<span ng-if="refFieldType ==\'REFERENCE\' && tableMetaData.DataTableDetailConfigMap[orgFieldName].ShowLinkAsText == false">' +
                                        '<a ng-if="fieldValue != \'Automated Process\'" tabIndex=0 target="_blank" href="/apex/myProfileView?id={{refIdValue}}" title="{{fieldVlaue}}" ' +
                                        'id="{{record.Id}}{{fieldIdentifier}}{{refIdValue}}{{tableCommunicator.tableId}}" aria-describedby="tooltip-info">' +
                                        '<span tabindex="0" id="{{record.Id}}{{fieldIdentifier}}{{refIdValue}}{{tableCommunicator.tableId}}"' +
										'ng-mouseover="showTooltip(refIdValue,record.Id+fieldIdentifier+refIdValue+tableCommunicator.tableId)"' +
										'ng-focus="showTooltip(refIdValue,record.Id+fieldIdentifier+refIdValue+tableCommunicator.tableId)"' +
                                        
                                        'ng-blur="hideTooltip(refIdValue,record.Id+fieldIdentifier+refIdValue+tableCommunicator.tableId)" ' +
                                        'ng-bind="fieldValue "></span>'+
                                         '</a>' +
                                        '<span ng-if="fieldValue == \'Automated Process\'" ng-bind="fieldValue"></span>' +
                                        '</span>' +
                                        '</span>' +
                                        //hyperlink - false, detail - true, showlink as text - true
                                        '<span ng-if="refFieldType ==\'REFERENCE\' && tableMetaData.DataTableDetailConfigMap[orgFieldName]" >' +
                                        '<span ng-if="refFieldType ==\'REFERENCE\' && tableMetaData.DataTableDetailConfigMap[orgFieldName].ShowLinkAsText == true" ng-bind="fieldValue">' + 
                                        '</span>' +
                                        '</span>'+
                                        //hyperlink - false, detail - false, showlink as text - no matter
                                        // '<span ng-if="refFieldType ==\'REFERENCE\' && !tableMetaData.DataTableDetailConfigMap[orgFieldName]">' + 
                                        // '<a tabIndex=0 target="_blank" href="/apex/myProfileView?id={{refIdValue}}" title="{{fieldVlaue}}" ' +
                                        // 'id="{{record.Id}}{{fieldIdentifier}}{{refIdValue}}{{tableCommunicator.tableId}}"' +
                                        // 'ng-mouseover="showTooltip(refIdValue,record.Id+fieldIdentifier+refIdValue+tableCommunicator.tableId)"' +
                                        // 'ng-focus="showTooltip(refIdValue,record.Id+fieldIdentifier+refIdValue+tableCommunicator.tableId)"' +
                                        // 'ng-mouseleave="hideTooltip(refIdValue,record.Id+fieldIdentifier+refIdValue+tableCommunicator.tableId)"' +
                                        // 'ng-bind="fieldValue "></a>' +
                                        // '</span>';

                                        '<span ng-if="refFieldType ==\'REFERENCE\' && !tableMetaData.DataTableDetailConfigMap[orgFieldName]">' + 
                                        '<a ng-if="fieldValue != \'Automated Process\'" tabIndex=0 target="_blank" href="/apex/myProfileView?id={{refIdValue}}" title="{{fieldVlaue}}" ' +
                                        'id="{{record.Id}}{{fieldIdentifier}}{{refIdValue}}{{tableCommunicator.tableId}}" aria-describedby="tooltip-info">' +
                                        '<span tabindex="0" id="{{record.Id}}{{fieldIdentifier}}{{refIdValue}}{{tableCommunicator.tableId}}"' +
										'ng-mouseover="showTooltip(refIdValue,record.Id+fieldIdentifier+refIdValue+tableCommunicator.tableId)"' +
                                        'ng-focus="showTooltip(refIdValue,record.Id+fieldIdentifier+refIdValue+tableCommunicator.tableId)"' +
                                        'ng-blur="hideTooltip(refIdValue,record.Id+fieldIdentifier+refIdValue+tableCommunicator.tableId)" ' +
										
                                        
                                       
                                        'ng-bind="fieldValue "></span>'+
                                        '</a>' +
                                        '<span ng-if="fieldValue == \'Automated Process\'" ng-bind="fieldValue"></span>' +
                                        '</span>';







                                    }else{   
                                        $scope.template = '<span ng-if="(refFieldType !=\'REFERENCE\' && refFieldType != \'STRING\' && refFieldType != \'TEXTAREA\'&& refFieldType != \'DOUBLE\' && refFieldType == \'CURRENCY\' && refFieldType == \'INTEGER\' && refFieldType == \'PERCENT\') && tableCommunicator.escapeHTMLMap != undefined && tableCommunicator.escapeHTMLMap[fieldName] == undefined" ng-bind="fieldValue">11</span>' +
                                            '<span ng-if="(refFieldType ==\'STRING\' || refFieldType == \'TEXTAREA\') && tableCommunicator.escapeHTMLMap[fieldName] == undefined" ng-bind="fieldValue"></span>' +
                                            '<span ng-if="(refFieldType ==\'DOUBLE\' || refFieldType == \'CURRENCY\' || refFieldType == \'INTEGER\'|| refFieldType == \'PERCENT\') "  ng-bind="fieldValue" class="pull-right">22</span>' +
                                            '<span ng-if="(refFieldType ==\'STRING\' || refFieldType == \'TEXTAREA\') && tableCommunicator.escapeHTMLMap[fieldName] != undefined" ng-bind-html="trustSrcHTML(fieldValue)">33</span>' +
                                            //hyperlink - false, detail - true, showlink as text - false
                                            '<span ng-if="refFieldType ==\'REFERENCE\' && tableMetaData.FlexTableConfigMap.FlexTableConfig.EnableHyperLinkAsText == false">' + 
                                            '<span ng-if="refFieldType ==\'REFERENCE\' && tableMetaData.DataTableDetailConfigMap[orgFieldName]" >' +
                                            // '<span ng-if="refFieldType ==\'REFERENCE\' && tableMetaData.DataTableDetailConfigMap[orgFieldName].ShowLinkAsText == false">' +
                                            // '<a tabIndex=0 target="_blank" href="/{{refIdValue}}" title="{{fieldVlaue}}" ' +
                                            // 'id="{{record.Id}}{{fieldIdentifier}}{{refIdValue}}{{tableCommunicator.tableId}}"' +
                                            // 'ng-mouseover="showTooltip(refIdValue,record.Id+fieldIdentifier+refIdValue+tableCommunicator.tableId)"' +
                                            // 'ng-focus="showTooltip(refIdValue,record.Id+fieldIdentifier+refIdValue+tableCommunicator.tableId)"' +
                                            // 'ng-mouseleave="hideTooltip(refIdValue,record.Id+fieldIdentifier+refIdValue+tableCommunicator.tableId)"' +
                                            // 'ng-bind="fieldValue "></a>' + 
                                            // '</span>' +

                                            '<span ng-if="refFieldType ==\'REFERENCE\' && tableMetaData.DataTableDetailConfigMap[orgFieldName].ShowLinkAsText == false">' +
                                            '<a tabIndex=0 target="_blank" href="/apex/myProfileView?id={{refIdValue}}" title="{{fieldVlaue}}" ' +
                                            'id="{{record.Id}}{{fieldIdentifier}}{{refIdValue}}{{tableCommunicator.tableId}}" aria-describedby="tooltip-info">' +
                                            '<span tabindex="0" id="{{record.Id}}{{fieldIdentifier}}{{refIdValue}}{{tableCommunicator.tableId}}"' +
											 'ng-mouseover="showTooltip(refIdValue,record.Id+fieldIdentifier+refIdValue+tableCommunicator.tableId)"' +
                                            'ng-focus="showTooltip(refIdValue,record.Id+fieldIdentifier+refIdValue+tableCommunicator.tableId)"' +
                                            'ng-blur="hideTooltip(refIdValue,record.Id+fieldIdentifier+refIdValue+tableCommunicator.tableId)" ' +
											
                                           
                                            'ng-bind="fieldValue "></span>'+
                                            '</a>' + 
                                            '</span>' +



                                            '</span>'+
                                            '</span>'+
                                            //hyperlink - false, detail - true, showlink as text - true
                                            '<span ng-if="refFieldType ==\'REFERENCE\' && tableMetaData.FlexTableConfigMap.FlexTableConfig.EnableHyperLinkAsText == false">' + 
                                            '<span ng-if="refFieldType ==\'REFERENCE\' && tableMetaData.DataTableDetailConfigMap[orgFieldName]" >' +
                                            '<span ng-if="refFieldType ==\'REFERENCE\' && tableMetaData.DataTableDetailConfigMap[orgFieldName].ShowLinkAsText == true" ng-bind="fieldValue">' + 
                                            '</span>' +
                                            '</span>'+
                                            '</span>'+
                                            //hyperlink - false, detail - false, showlink as text - no matter
                                            '<span ng-if="refFieldType ==\'REFERENCE\' && tableMetaData.FlexTableConfigMap.FlexTableConfig.EnableHyperLinkAsText == false">' + 
                                            // '<span ng-if="refFieldType ==\'REFERENCE\' && !tableMetaData.DataTableDetailConfigMap[orgFieldName]" >' +
                                            // '<a tabIndex=0 target="_blank" href="/{{refIdValue}}" title="{{fieldVlaue}}" ' +
                                            // 'id="{{record.Id}}{{fieldIdentifier}}{{refIdValue}}{{tableCommunicator.tableId}}"' +
                                            // 'ng-mouseover="showTooltip(refIdValue,record.Id+fieldIdentifier+refIdValue+tableCommunicator.tableId)"' +
                                            // 'ng-focus="showTooltip(refIdValue,record.Id+fieldIdentifier+refIdValue+tableCommunicator.tableId)"' +
                                            // 'ng-mouseleave="hideTooltip(refIdValue,record.Id+fieldIdentifier+refIdValue+tableCommunicator.tableId)"' +
                                            // 'ng-bind="fieldValue "></a>' +
                                            // '</span>' +


                                            '<span ng-if="refFieldType ==\'REFERENCE\' && !tableMetaData.DataTableDetailConfigMap[orgFieldName]" >' +
                                            '<a tabIndex=0 target="_blank" href="/apex/myProfileView?id={{refIdValue}}" title="{{fieldVlaue}}" ' +
                                            'id="{{record.Id}}{{fieldIdentifier}}{{refIdValue}}{{tableCommunicator.tableId}}" aria-describedby="tooltip-info">' +
                                            '<span tabindex="0"  id="{{record.Id}}{{fieldIdentifier}}{{refIdValue}}{{tableCommunicator.tableId}}"' +
											 'ng-mouseover="showTooltip(refIdValue,record.Id+fieldIdentifier+refIdValue+tableCommunicator.tableId)"' +
                                            'ng-focus="showTooltip(refIdValue,record.Id+fieldIdentifier+refIdValue+tableCommunicator.tableId)"' +
                                            'ng-blur="hideTooltip(refIdValue,record.Id+fieldIdentifier+refIdValue+tableCommunicator.tableId)" ' +
											
                                           
                                            'ng-bind="fieldValue "></span>'+
                                            '</a>' +
                                            '</span>' +
                                            '</span>'+
                                            '<span ng-if="refFieldType ==\'REFERENCE\' && tableMetaData.FlexTableConfigMap.FlexTableConfig.EnableHyperLinkAsText == true" ng-bind="fieldValue">' +'</span>';
                                    }
                                }
                            }
                                break;
                            case 'RICHTEXTAREA':
                                if (isEdit && !$scope.isReadOnlyField) {
                                    $scope.template = '<textarea ng-model="record[fieldName]" class="form-control" rows="2" ng-change="handlechange(record,fieldName,record[fieldName]);" maxlength ='+$scope.fieldLength+'></textarea>';
                                } else {
                                    $scope.template = '<span ng-bind-html="trustSrcHTML(fieldValue)" class="richTextAreaField"></span>';
                                }
                                break;
                            case 'STRING':
                                if (isEdit && !$scope.isReadOnlyField) {
                                    $scope.template = '<input class="form-control" type="text" ng-model="record[fieldName]" ng-change="handlechange(record,fieldName,record[fieldName]);" maxlength ='+$scope.fieldLength+'/>';
                                } else {
                                    /*if ($scope.fieldName.lastIndexOf('Name') != -1 && !(($scope.record['isTotal'] != undefined && $scope.record['isTotal'] == true) || ($scope.record['isSubTotal'] != undefined && $scope.record['isSubTotal'] == true))) {
                                        if ($scope.fieldValue == undefined || ($scope.fieldValue != undefined && ($scope.isString && $scope.fieldValue.indexOf('tableCommunicator.record') == -1))) {
                                            $scope.template = '<a class="pointer" ng-href="/{{idValue}}?iospref=web" target="_self"' +
                                                'tabIndex="0" ng-bind="fieldValue"></a>';
                                        } 
                                    } else {
                                            $scope.template = '<span ng-if="tableCommunicator.escapeHTMLMap[fieldName] != undefined">' +
                                                '<span ng-bind-html="trustSrcHTML(fieldValue)"></span>' +
                                                '</span>' +
                                                '<span ng-if="tableCommunicator.escapeHTMLMap[fieldName] == undefined">' +
                                                '<span ng-bind="fieldValue" title="{{fieldValue}}"></span>' +
                                                '</span>';
                                        }*/
                                    if ($scope.fieldValue == undefined || ($scope.fieldValue != undefined && ($scope.isString && $scope.fieldValue.indexOf('tableCommunicator.record') == -1))) {
                                            if($scope.fieldValue != undefined  && $scope.fieldValue.indexOf('<img src=') != -1){//Bug 127285
                                                
                                                $scope.template =   '<span ng-if="tableCommunicator.escapeHTMLMap != undefined && tableCommunicator.escapeHTMLMap[fieldName] != undefined">' +
                                                                        '<span ng-bind-html="trustSrcHTML(fieldValue)" ></span>' +
                                                                    '</span>' +
                                                                    '<span ng-if="tableCommunicator.escapeHTMLMap != undefined && tableCommunicator.escapeHTMLMap[fieldName] == undefined">' +
                                                                        '<span ng-bind="fieldValue"></span>' +
                                                                    '</span>';
                                            }else if($scope.fieldValue != undefined  && $scope.fieldValue.indexOf('<a href') != -1){//Bug 159287: Product/NED - E-grid/FlexTable - if inside formula field Hyperlink is used, then anchor tag is getting visible on to hover over the field for tables.
                                                $scope.titleValue = $scope.fieldValue.split('>')[1].split('<')[0];
                                                $scope.template =   '<span ng-if="tableCommunicator.escapeHTMLMap != undefined && tableCommunicator.escapeHTMLMap[fieldName] != undefined">' +
                                                                        '<span ng-bind-html="trustSrcHTML(fieldValue)" title="{{trustSrcHTML(titleValue)}}"></span>' +
                                                                    '</span>' +
                                                                    '<span ng-if="tableCommunicator.escapeHTMLMap != undefined && tableCommunicator.escapeHTMLMap[fieldName] == undefined">' +
                                                                        '<span ng-bind="fieldValue" title="{{titleValue}}" ></span>' +
                                                                    '</span>';
                                            }else{
                                            $scope.template =   '<span ng-if="tableCommunicator.escapeHTMLMap != undefined && tableCommunicator.escapeHTMLMap[fieldName] != undefined">' +
                                                                    '<span ng-bind-html="trustSrcHTML(fieldValue)" title="{{handleHTML(fieldValue)}}"></span>' +
                                                                '</span>' +
                                                                '<span ng-if="tableCommunicator.escapeHTMLMap != undefined && tableCommunicator.escapeHTMLMap[fieldName] == undefined">' +
                                                                    '<span ng-bind="fieldValue" title="{{fieldValue}}" ></span>' +
                                                                '</span>';

                                            }
                                               
                                        }
                                if( $scope.fieldValue == undefined && $scope.record[$scope.orgFieldName] != undefined && (($scope.record['isTotal'] != undefined && $scope.record['isTotal'] == true) || ($scope.record['isSubTotal'] != undefined && $scope.record['isSubTotal'] == true))){
                                    $scope.fieldValue = $scope.record[$scope.orgFieldName];
                                    $scope.template = '<span ng-bind="record[orgFieldName]"></span> ';
                                }
                                }
                                break;//
                            case 'TEXTAREA':
                                if (isEdit && !$scope.isReadOnlyField) {
                                    $scope.template = '<textarea ng-model="record[fieldName]" class="form-control" rows="5" ng-change="handlechange(record,fieldName,record[fieldName]);" maxlength ='+$scope.fieldLength+'></textarea>';
                                } else {
                                    if ($scope.fieldValue == undefined || ($scope.fieldValue != undefined && ($scope.isString && $scope.fieldValue.indexOf('tableCommunicator.record') == -1))) {
                                        $scope.template =   '<span ng-if="tableCommunicator.escapeHTMLMap != undefined && tableCommunicator.escapeHTMLMap[fieldName] != undefined" class="richTextAreaField">' +
                                                                '<span ng-bind-html="trustSrcHTML(fieldValue)" title="{{handleHTML(fieldValue)}}"></span>' +
                                                            '</span>' +
                                                            '<span ng-if="tableCommunicator.escapeHTMLMap != undefined && tableCommunicator.escapeHTMLMap[fieldName] == undefined" class="richTextAreaField">' +
                                                                '<span ng-bind="fieldValue" title="{{fieldValue}}"></span>' +
                                                            '</span>';
                                    }
                                }
                                break;
                            case 'TIME':
                                if (isEdit && !$scope.isReadOnlyField) {
                                    //  see this to set date time format in the template below for edit mode
                                    localeBasedEnhancedTimeFormat = sfTimeFormatToJSTimeFormat(userTimeFormat);
                                    $scope.template = '<input id="timePicker" class="form-control"  type="text" ng-model="fieldValue" format="\'' + localeBasedEnhancedTimeFormat + '\'" e-grid-time-picker="angular" ng-change="handlechange(record,fieldName,fieldValue);"/>';
                                } else {
                                    if ($scope.fieldValue == '' || ($scope.fieldValue != undefined && isNaN($scope.fieldValue) && ($scope.isString && $scope.fieldValue.indexOf('tableCommunicator.record') == -1))) {
                                        $scope.template = '<span ng-bind="fieldValue"/></span> ';
                                    } else {
                                        $scope.template = !($scope.fieldValue != undefined && isNaN($scope.fieldValue) && typeof $scope.fieldValue !='object' && $scope.fieldValue.indexOf('tableCommunicator.record') != -1) ? '<span ng-bind="fieldValue |  date:\'' + userTimeFormat + '\'"/></span>' : '';
                                    }
                                }
                                break;
                            case 'URL':
                                if (isEdit && !$scope.isReadOnlyField) {
                                    $scope.template = '<input class="form-control" type="text" ng-model="record[fieldName]" ng-change="handlechange(record,fieldName,record[fieldName]);"/>';
                                } else {
                                    if ($scope.record['isTotal'] == true || $scope.record['isSubTotal'] == true) {
                                        if ($scope.fieldValue == undefined || ($scope.fieldValue != undefined && ($scope.isString && $scope.fieldValue.indexOf('tableCommunicator.record') == -1))) {
                                            $scope.template = '<span ng-bind="fieldValue" title="{{fieldValue}}></span>';
                                        }
                                    } else {
                                        if($scope.tableMetaData.FlexTableConfigMap.FlexTableConfig.EnableHyperLinkAsText != true){
                                            $scope.template = '<a class="cursor-pointer" ng-href="https://{{fieldValue}}" title="{{fieldValue}}>{{fieldValue}}</a>';
                                        }else{
                                            $scope.template = '<span ng-bind="fieldValue" title="{{fieldValue}}></span> ';
                                        }
                                        
                                    }
                                }
                                break;
                            case 'MULTISELECTOR':
                                if (isEdit) {
                                    $scope.template = '<multiselector class="form-control multi-selector" record="record" field="fieldName" />';
                                }
                                break;
                        }
                    }
                    if (isEdit && $scope.tableCommunicator.requiredFieldsMap[$scope.fieldName] == true) {
                        $scope.template = requiredTemplate + $scope.template + requiredTextTemplate;
                    }
                    if (isEdit && $scope.orgFieldName!= undefined && $scope.tableCommunicator.requiredFieldsMap[$scope.orgFieldName] == true) {//User Story 167525: POC - LAHSA - Enhanced Grid : Mandatory sign indicator is missing for lookup fields which are required for save.
                        $scope.template = requiredTemplate + $scope.template + requiredReferenceTextTemplate;
                    }

                }
            };

            $scope.changePicklistValue = function() {
                let fieldInfo = $scope.refFieldInfo != undefined ? $scope.refFieldInfo : $scope.fieldInfo;
                //$scope.record[$scope.fieldName] = { "Value": fieldInfo.PickListFieldInfo.FieldPicklistValueLabelMap[$scope.pickListValue], "Label": $scope.pickListValue };
                $scope.record[$scope.fieldName] =  $scope.pickListValue;
                $scope.handlechange($scope.record, $scope.fieldName, $scope.record[$scope.fieldName]);
            }

            $scope.tableCommunicator.getStandardFieldName = function(refField){
                switch(refField.toLowerCase()){
                    case 'lastmodifiedby':
                    case 'lastmodifiedbyid':    
                    case 'lastmodifiedby.id':
                        refField = 'LastModifiedBy.Name';
                        break;
                    case 'createdby':
                    case 'createdbyid':
                    case 'createdby.id':
                        refField = 'CreatedBy.Name';
                        break;
                    case 'recordtype':
                    case 'recordtypeid':
                    case 'recordtype.id':
                        refField = 'RecordType.Name';
                        break;
                    case 'owner':
                    case 'ownerid':                    
                    case 'owner.id':
                        refField = 'Owner.Name';
                    break;
                    case 'parentid':
                    case 'parent':
                    case 'parent.id':
                        refField = 'Parent.Name';
                    break;
                    default:
                        refField;
                } 
            return refField;   
            }

            $scope.handleReferenceMode = function() {
                if(!$scope.record){
                    return;
                }
                if($scope.tableCommunicator.hideTableCellMap != undefined &&
                    $scope.tableCommunicator.hideTableCellMap[$scope.record.Id] != undefined &&
                    $scope.tableCommunicator.hideTableCellMap[$scope.record.Id][ $scope.orgFieldName] != undefined &&
                    $scope.tableCommunicator.hideTableCellMap[$scope.record.Id][ $scope.orgFieldName]){
                    return;
                }
                $scope.isReadOnlyField = false;
                $scope.isEditDisplayField = false;
                if ($scope.tableMetaData != undefined && $scope.fieldName != undefined) {
                    $scope.fieldName = $scope.orgFieldName != undefined ? $scope.orgFieldName : $scope.fieldName;
                    if ($scope.tableMetaData.FlexTableConfigMap.FieldMetaData[$scope.fieldName] != undefined &&
                        $scope.tableMetaData.FlexTableConfigMap.FieldMetaData[$scope.fieldName].Type == 'REFERENCE') {

                        $scope.refFieldType = $scope.tableMetaData.FlexTableConfigMap.FieldMetaData[$scope.fieldName].ReferenceFieldInfo.Type;
                        $scope.refFieldInfo = $scope.tableMetaData.FlexTableConfigMap.FieldMetaData[$scope.fieldName].ReferenceFieldInfo;
                        let refIdField = '';
                        //Original Display Field Name
                        $scope.orgFieldName = angular.copy($scope.fieldName);
                        refIdField = $scope.fieldName;
                        $scope.tableCommunicator.ReferenceDisplayFieldMap[$scope.record.Id] = $scope.tableCommunicator.ReferenceDisplayFieldMap[$scope.record.Id] != undefined ? $scope.tableCommunicator.ReferenceDisplayFieldMap[$scope.record.Id] : {};
                        $scope.tableCommunicator.ReferenceDisplayFieldMap[$scope.record.Id][$scope.orgFieldName] = '';
                        if ($scope.fieldName.indexOf('.') == -1) {
                            if ($scope.fieldName.indexOf('__c') == -1) {
                                refIdField = $scope.fieldName + '.Id';
                            } else {
                                refIdField = $scope.fieldName.replace('__c', '__r.Id');
                            }
                        }
                        let obj = $scope.record;
                        let valueGetter = $scope.parse(refIdField.split(".")[0].replace('__r', '__c'));
                    if(refIdField.split(".").length == 3 && (obj.isTotal == false || obj.isTotal == undefined)){ //Bug 174737: LAHSA - E-Grid - Lookup field with 3 level relationships are not working
                            $scope.refIdValue = $scope.record[refIdField.split(".")[0]][refIdField.split(".")[1].replace('__r', '__c')];
                    }else if(refIdField.split(".").length > 3 && (obj.isTotal == false || obj.isTotal == undefined)){//Bug 191127: LAHSA - Data Table Enhanced - Total label formula is not working
                        if($scope.record[refIdField.split(".")[0]] != undefined && $scope.record[refIdField.split(".")[0]][refIdField.split(".")[1]] != undefined){// 273079
                            $scope.refIdValue = $scope.record[refIdField.split(".")[0]][refIdField.split(".")[1]][refIdField.split(".")[2].replace('__r', '__c')];
                        }
                    }
                    else if(obj.isTotal == false || obj.isTotal == undefined){
                        $scope.refIdValue = valueGetter(obj);
                        }                        
                        if(typeof($scope.refIdValue)=="object"){
                            $scope.refIdValue = $scope.refIdValue.Id;
                        }
                        if(refIdField== 'ownerId.Id'){
                            $scope.refIdValue = obj.OwnerId;
                        }
                        let strDisplayField = ($scope.tableMetaData.DataTableDetailConfigMap[$scope.fieldName] && $scope.tableMetaData.DataTableDetailConfigMap[$scope.fieldName].DisplayField) 
                                                ? $scope.tableMetaData.DataTableDetailConfigMap[$scope.fieldName].DisplayField 
                                                : undefined;


                        if(strDisplayField) {
                            let refField = '';
                            if ($scope.fieldName.indexOf('__c') == -1) {
                               // refField = $scope.fieldName + '.';   
                               refField =$scope.tableCommunicator.validateStandardRefFields($scope.fieldName) + '.';                       
                            }
                             else {
                                refField = $scope.fieldName.replace('__c', '__r.');
                            }
                            refField = refField + strDisplayField;
                            let valueGetter = $scope.parse(refField);
                            let lookupFiledName =  $scope.fieldName;
                            $scope.fieldName = refField;
                            if($scope.tableMetaData.DataTableDetailConfigMap[lookupFiledName].EnableEditDisplayField == true){
                               $scope.isEditDisplayField = true;
                            }                           
                            $scope.fieldValue = valueGetter(obj);
                            $scope.refFieldType = $scope.tableMetaData.FlexTableConfigMap.FieldMetaData[$scope.fieldName].ReferenceFieldInfo.Type;
                            $scope.refFieldInfo = $scope.tableMetaData.FlexTableConfigMap.FieldMetaData[$scope.fieldName].ReferenceFieldInfo;
                            //$scope.fieldInfo.ReferenceFieldInfo =  $scope.refFieldInfo;
                            // remove to provide loocukp display field editable 
                            if (refField.indexOf('.') != -1 && $scope.tableMetaData.DataTableDetailConfigMap[lookupFiledName].EnableEditDisplayField != true) {                                    
                                $scope.isReadOnlyField = true;
                            }
                            
                        } else {
                            let refField = $scope.fieldName;
                            if (refField.indexOf('.') == -1) {
                                switch(refField.toLowerCase()){
                                    case 'lastmodifiedbyid':
                                        refField = 'LastModifiedBy.Name';
                                        break;
                                    case 'createdbyid':
                                        refField = 'CreatedBy.Name';
                                        break;
                                    case 'recordtypeid':
                                        refField = 'RecordType.Name';
                                        break;
                                    case 'ownerid':
                                        refField = 'Owner.Name';
                                    break;
                                    case 'parentid':
                                        refField = 'Parent.Name';
                                    break;
                                    default:
                                        if ($scope.fieldName.indexOf('__c') == -1) {
                                            refField = $scope.fieldName + '.Name';
                                        } else {
                                            refField = $scope.fieldName.replace('__c', '__r.Name');
                                        }
                                        $scope.fieldName = refField;
                                        
                                }
                            } else {
                                //if multilevel reference field is given in DisplayFieldNames then it will readonly                                
                                if ($scope.orgFieldName.indexOf('.') != -1) {
                                    $scope.isReadOnlyField =  true;
                                }
                            }
                            if(refField.match( /(\.Id)$/g)){           
                                refField = refField.replace('.Id', '.Name');                                            
                            }
                            if($scope.isReadOnlyField && $scope.refFieldType != 'REFERENCE'){ 
                                $scope.fieldType = $scope.refFieldType    
                            }
                            refField =  $scope.tableCommunicator.getStandardFieldName(refField);
                            let valueGetter = $scope.parse(refField);
                            $scope.fieldValue = valueGetter(obj);
                            if ($scope.fieldValue != undefined && ($scope.fieldType == 'DATE' && !($scope.record['isTotal'] == true || $scope.record['isSubTotal'] == true))) {
                                if(!($scope.tableCommunicator.hideTableCellMap != undefined && $scope.tableCommunicator.hideTableCellMap[$scope.record.Id] != undefined && $scope.tableCommunicator.hideTableCellMap[$scope.record.Id][$scope.fieldName] == true)){
                                    let d = new Date();
                                    let localOffset = d.getTimezoneOffset() * 60000;
                                    let timeDifference = 0 - localOffset - timeOffset;
                                    timeDifference = (timeDifference < 0 ) ? 0 : timeDifference;                                    
                                    $scope.fieldValue = $scope.toUTCDate(new Date($scope.fieldValue));
                                }
                            }
                        }
                        $scope.tableCommunicator.ReferenceDisplayFieldMap[$scope.record.Id][$scope.orgFieldName] = $scope.fieldValue;
                        if($scope.obj != undefined && $scope.obj[$scope.orgFieldName] != undefined && isNaN($scope.obj[$scope.orgFieldName]) && ( !typeof $scope.obj[$scope.orgFieldName] && $scope.obj[$scope.orgFieldName].indexOf('tableCommunicator.record') != -1) && $scope.fieldValue != $scope.obj[$scope.orgFieldName]){
                            $scope.fieldValue = $scope.obj[$scope.orgFieldName];
                        }
                    }
                }
                if($scope.tableCommunicator.hideTableCellMap != undefined && $scope.tableCommunicator.hideTableCellMap[$scope.record.Id] != undefined && $scope.tableCommunicator.hideTableCellMap[$scope.record.Id][$scope.orgFieldName] == true){
                    $scope.fieldValue = $scope.tableCommunicator.maskValue;
                }
            }


            $scope.handleViewMode = function() {
                // 1. First get the actual value of the field
                //$scope.handleReferenceViewMode();
                if(!$scope.record){
                    return;
                }
                
                $scope.obj = $scope.record;
                viewValueGetter = $scope.parse($scope.fieldName);
                $scope.fieldValue = viewValueGetter($scope.obj);


                if($scope.tableCommunicator.fieldMetaData[$scope.fieldName] != undefined && $scope.tableCommunicator.fieldMetaData[$scope.fieldName].Type == "PICKLIST"){
                    if($scope.obj[$scope.fieldName] != undefined && $scope.obj[$scope.fieldName].Value != undefined){
                        $scope.obj[$scope.fieldName] = $scope.obj[$scope.fieldName].Value;
                    }
                }
            

                if($scope.tableCommunicator.fieldMetaData[$scope.fieldName] != undefined && $scope.tableCommunicator.fieldMetaData[$scope.fieldName].Type != "PICKLIST"){
	                if($scope.obj[$scope.fieldName] != undefined && isNaN($scope.obj[$scope.fieldName]) && typeof $scope.obj[$scope.fieldName] !='object' && $scope.obj[$scope.fieldName].indexOf('tableCommunicator.record') != -1 && $scope.fieldValue != $scope.obj[$scope.fieldName]){
	                    $scope.fieldValue = $scope.obj[$scope.fieldName];
	                }
                }


                let d = new Date();
                let localOffset = d.getTimezoneOffset() * 60000;
                if ($scope.fieldValue != undefined && ($scope.fieldType == 'DATETIME' && !($scope.record['isTotal'] == true || $scope.record['isSubTotal'] == true))) {
                    if(!($scope.tableCommunicator.hideTableCellMap != undefined && $scope.tableCommunicator.hideTableCellMap[$scope.record.Id] != undefined && $scope.tableCommunicator.hideTableCellMap[$scope.record.Id][$scope.fieldName] == true)){
                        //$scope.fieldValue = $scope.fieldValue + localOffset + timeOffset;
 
                        $scope.fieldValue = $scope.toUTCDate(new Date($scope.fieldValue + timeOffset)); 
                    }
                }                


                if ($scope.fieldValue != undefined && ($scope.fieldType == 'DATE' && !($scope.record['isTotal'] == true || $scope.record['isSubTotal'] == true))) {
                    if(!($scope.tableCommunicator.hideTableCellMap != undefined && $scope.tableCommunicator.hideTableCellMap[$scope.record.Id] != undefined && $scope.tableCommunicator.hideTableCellMap[$scope.record.Id][$scope.fieldName] == true)){
                        let timeDifference = 0 - localOffset - timeOffset;
                        timeDifference = (timeDifference < 0 ) ? 0 : timeDifference;
                        //$scope.fieldValue = $scope.fieldValue + timeDifference;
                        
                        $scope.fieldValue = $scope.toUTCDate(new Date($scope.fieldValue));
                    }
                }

                if ($scope.fieldValue != undefined && ($scope.fieldType == 'TIME' && !($scope.record['isTotal'] == true || $scope.record['isSubTotal'] == true))) {
                    if(!($scope.tableCommunicator.hideTableCellMap != undefined && $scope.tableCommunicator.hideTableCellMap[$scope.record.Id] != undefined && $scope.tableCommunicator.hideTableCellMap[$scope.record.Id][$scope.fieldName] == true)){ 
                        $scope.fieldValue = msToTime($scope.record[$scope.fieldName]);                    
                        //$scope.record[$scope.fieldName] = $scope.fieldValue;
                    }
                }
                // 2. If the field is reference, we will have to get the Id value as well
                //      This will be used when we click on it, to open in a new tab     
                if ($scope.fieldName.lastIndexOf("Name") != -1) {
                    var idField = $scope.fieldName.replace("Name", "Id");
                    viewValueGetter = $scope.parse(idField);
                    $scope.idValue = viewValueGetter($scope.obj);
                } else {
                    var idField = 'Id';
                    viewValueGetter = $scope.parse(idField);
                    $scope.idValue = viewValueGetter($scope.obj);
                }

                if(($scope.fieldValue == undefined || $scope.fieldValue == null || $scope.fieldValue == 'Invalid Date') && ($scope.fieldType == 'DATE' || $scope.fieldType == 'DATETIME')){
                    $scope.fieldValue = '';
                }

                if ($scope.fieldType == 'PICKLIST' && $scope.fieldName != undefined) {
                    if ($scope.record[$scope.fieldName] == undefined || $scope.record[$scope.fieldName] == '') {
                       // if($scope.fieldName == "Value"){
                            $scope.pickListValue = undefined;
                       // }

                        // $scope.pickListValue = $scope.fieldInfo.PickListFieldInfo.PickListKeyValueMapList[0].Value;
                        // $scope.pickListValueLabelMap = {};
                        // for (var index = 0; index < $scope.fieldInfo.PickListFieldInfo.PickListKeyValueMapList.length; index++) {
                        //     var option = $scope.fieldInfo.PickListFieldInfo.PickListKeyValueMapList[index];
                        //     $scope.pickListValueLabelMap[option.Value] = option.Label;
                        // }
                        // $scope.record[$scope.fieldName] = { "Value": $scope.pickListValue, "Label": $scope.pickListValueLabelMap[$scope.pickListValue] };
                    } else {
                        $scope.pickListValue = $scope.fieldInfo.PickListFieldInfo.FieldPicklistValueLabelMap[$scope.record[$scope.fieldName]];
                    //    $scope.pickListValue =  $scope.pickListValue ? $scope.pickListValue : $scope.record[$scope.fieldName];
                           $scope.pickListValue =  (( $scope.pickListValue && $scope.pickListValue !="null") ? $scope.pickListValue : $scope.record[$scope.fieldName]);
                        $scope.fieldValue = $scope.pickListValue;
                    }
                }
                if ($scope.fieldType == 'MULTIPICKLIST' && $scope.fieldName != undefined) {
		            if ($scope.record[$scope.fieldName] != undefined && $scope.record[$scope.fieldName] != '' && $scope.fieldInfo.PickListFieldInfo.FieldPicklistValueLabelMap !='') {
		                angular.forEach($scope.fieldInfo.PickListFieldInfo.FieldPicklistValueLabelMap, function(item, index) {
		                    if(index !='' && index != undefined){ 
                            	$scope.fieldValue = $scope.fieldValue.includes(index) ? $scope.fieldValue.replace(index,item) :  $scope.fieldValue;
                        	}
		                });
		            }
		        }
                if($scope.fieldType != "DATE" && $scope.fieldType != "DATETIME"){
                $scope.handleReferenceMode();
                }
            if($scope.record['isGrandTotal'] == true && $scope.record[$scope.fieldName] != undefined && $scope.fieldValue == undefined){ //Bug 229065
                $scope.fieldValue = $scope.record[$scope.fieldName];
            }
                // 3. Get the template based on data type and mode  
                $scope.getFieldTemplate($scope.isEdit);
            }

            $scope.handleEditMode = function() {
                if(!$scope.record){
                    return;
                }
                if($scope.fieldType != "DATE" && $scope.fieldType != "DATETIME"){
                $scope.handleReferenceMode();
                }

                //if ($scope.fieldValue != undefined && ($scope.fieldType == 'DATE' || $scope.fieldType == 'DATETIME')) {
                if ($scope.fieldType == 'DATETIME') {
                    if($scope.fieldValue == undefined || $scope.fieldValue == null || $scope.fieldValue == '' && $scope.fieldValue == 'Invalid Date'){
                        $scope.fieldValue = '';
                    }else{  
                        if(typeof $scope.fieldValue == 'object'){ 
                            $scope.fieldValue = Date.parse($scope.fieldValue);
                            let d = new Date();
                            let localOffset = d.getTimezoneOffset() * 60000;   
                            $scope.fieldValue = $scope.toUTCDate(new Date($scope.fieldValue + timeOffset));                    
                           // $scope.record[$scope.fieldName] = $scope.toUTCDate(new Date($scope.record[$scope.fieldName] + timeOffset));
                        }                      
                       
                    }
                }


                if ($scope.fieldType == 'DATE') {
                if($scope.fieldValue == undefined || $scope.fieldValue == null || $scope.fieldValue == '' || $scope.record.Id.length < 15 || $scope.fieldValue == 'Invalid Date'){ //273079 for relational date field
                        $scope.fieldValue = '';
                    }else{ 
                        if(typeof $scope.fieldValue == 'object'){ 
                            $scope.fieldValue = Date.parse($scope.fieldValue);
                        }
                        let d = new Date();
                        let localOffset = d.getTimezoneOffset() * 60000;
                        let timeDifference = 0 - localOffset - timeOffset;
                        timeDifference = (timeDifference < timeOffset ) ? timeOffset : timeDifference;

                        $scope.fieldValue = $scope.toUTCDate(new Date($scope.fieldValue + timeDifference));                    
                      //  $scope.record[$scope.fieldName] = $scope.toUTCDate(new Date($scope.record[$scope.fieldName]));
                    }
                }

                if ($scope.fieldType == 'TIME') {
                    if($scope.fieldValue == undefined || $scope.fieldValue == null || $scope.fieldValue == '' && $scope.fieldValue == 'Invalid Date'){
                        $scope.fieldValue = '';
                    }else{                        
                        let d = new Date();
                        let localOffset = d.getTimezoneOffset() * 60000;   
                        $scope.fieldValue = msToTime($scope.record[$scope.fieldName]); 
                    }
                }



                if ($scope.fieldType == 'PICKLIST' && $scope.fieldName != undefined) {
                    if ($scope.record[$scope.fieldName] == undefined || $scope.record[$scope.fieldName] == '') {
                       // if($scope.fieldName == "Value"){
                            $scope.pickListValue = undefined;
                       // }

                        // $scope.pickListValue = $scope.fieldInfo.PickListFieldInfo.PickListKeyValueMapList[0].Value;
                        // $scope.pickListValueLabelMap = {};
                        // for (var index = 0; index < $scope.fieldInfo.PickListFieldInfo.PickListKeyValueMapList.length; index++) {
                        //     var option = $scope.fieldInfo.PickListFieldInfo.PickListKeyValueMapList[index];
                        //     $scope.pickListValueLabelMap[option.Value] = option.Label;
                        // }
                        // $scope.record[$scope.fieldName] = { "Value": $scope.pickListValue, "Label": $scope.pickListValueLabelMap[$scope.pickListValue] };
                    } else {
                        $scope.pickListValue = $scope.record[$scope.fieldName];
                        $scope.fieldValue = $scope.pickListValue;
                    }
                }

                // 3. Get the template based on data type and mode      
                $scope.getFieldTemplate($scope.isEdit);
            }

            $scope.showTooltip = function(parentId, thisVal) {
                if (parentId != null || parentId != undefined || parentId != '') {
                    j$('#' + thisVal).tooltipster({
                        theme: 'tooltipster-shadow',
                        content: 'Loading...',
                        updateAnimation: false,
                        contentAsHTML: true,
                        interactive: true,
                        minWidth: 100,
                        position: 'right',
                        functionBefore: function(origin, fetchLayout) {
                            fetchLayout();
                            Visualforce.remoting.Manager.invokeAction(
                                _RemotingFlexGridEnhancedActions.fetchLayout, parentId,
                                function(result, event) {
                                    if (event.status) {
                                        if (!jQuery.isEmptyObject(result)) {
                                            tooltipContent =  '<div class="tooltipWrapper" >';
                                            tooltipContent = structureMiniLayout(result, origin, tooltipContent);
                                            tooltipContent += '</div>';
                                            origin.tooltipster('content', tooltipContent);
                                        } else {
                                            j$('#' + thisVal.id).tooltipster('hide');
                                        }
                                    }
                                });
                        }
                    });
                    j$('#' + thisVal).tooltipster('show');
                }
            };

            $scope.hideTooltip = function(parentId, thisVal) {
                j$('#' + thisVal).tooltipster('hide');
            }
            // $scope.getMiniLayoutContent = function(result, origin) {
            //     let tooltip = tooltipContent;
            //     let tab = result.Tab;
            //     let record = result.Record;
            //     if (tab != null) {
            //         j$.each(result.Tab, function(i, tabVal) {
            //             j$.each(tabVal.pageBlocks, function(j, pageBlockVal) {
            //                 tooltip += '<p class="tooltip-title">' + record['Name'] + '</p>';
            //                 tooltip += '<div id="TooltipBody" class="panel-body">';
            //                 tooltip += '<form class="form-horizontal" role="form">'
            //                 j$.each(pageBlockVal.fields, function(k, field) {
            //                     if (field.hideField != 'true') {
            //                         tooltip += '<div class="form-group border-ext ">';
            //                         tooltip += ' <div class="row">';
            //                         tooltip += ' <div class="col-md-4 col-xs-4 col-sm-4">';
            //                         tooltip += field.fieldLabel;
            //                         tooltip += '</div>';
            //                         var fieldVal = j$('<span/>').html(encodeURI(record[field.fieldAPIName])).text();
            //                         if (field.dataType == 'CURRENCY') {
            //                             fieldVal = '$' + fieldVal;
            //                         }
            //                         tooltip += ' <div class="col-md-8 col-xs-8 col-sm-8" style="word-wrap:break-word; font-weight: bold;">';
            //                         if(field.dataType == 'EMAIL'){
            //                             tooltip += '<a href="mailto:'+decodeURI(fieldVal)+'">'+decodeURI(fieldVal)+'</a>';
            //                            }
            //                            else{
            //                             tooltip += decodeURI(fieldVal);
            //                            }
            //                         //tooltip += decodeURI(fieldVal);
            //                         tooltip += '</div>';
            //                         tooltip += '</div>';
            //                         tooltip += '</div>';
            //                         tooltip += '<br/>';
            //                     }
            //                 })
            //             })
            //         })
            //         tooltip += '</form>';
            //         tooltip += '</div>';
            //     } else {

            //         tooltip += '<p class="tooltip-title">' + record['Name'] + '</p>';
            //         tooltip += '<div id="TooltipBody" class="panel-body">';
            //         tooltip += '<form class="form-horizontal" role="form">';
            //         tooltip += '<div class="form-group border-ext ">';
            //         tooltip += ' <div class="row">';
            //         tooltip += ' <div class="col-md-4 col-xs-4 col-sm-4">';
            //         tooltip += 'Name';
            //         tooltip += '</div>';
            //         tooltip += ' <div class="col-md-8 col-xs-8 col-sm-8" style="word-wrap:break-word; font-weight: bold;">';
            //         tooltip += record['Name'];
            //         tooltip += '</div>';
            //         tooltip += '</div>';
            //         tooltip += '</div>';
            //         tooltip += '</form>';
            //         tooltip += '</div>';
            //     }
            //     return tooltip;
            // };

            $scope.getQuery = function(fieldName, sobjName, query, filterClause) {
                scope.getQueryData({
                    fieldName: fieldName,
                    sobjName: sobjName,
                    query: query,
                    filterClause: filterClause
                });
            }

        }
    ])

    .directive('field', ['$compile', '$parse', '$sce',
        function($compile, $parse, $sce) {
            return {
                restrict: 'E',
                controller: 'FieldController',
                scope: {
                    fieldType: '@', // The data type for the field
                    fieldName: '@', // Name of the field, e.g. Account.Name or Title__c
                    fieldInfo: '=', // Object supplied from parent controller to call parent controller functions                   
                    record: '=', // Actual record or sobject        
                    isEdit: '=', // Whether to render in edit mode or not
                    fieldOptions: '=', //used in case of types like picklist to get the field metadata
                    tableMetaData: '=',
                    tableCommunicator: '=',
                    changeHandler: '&'
                    //event Handler
                },
                link: function(scope, element, attr) {
                    // 1. set some global variables,
                    scope.sce = $sce;
                    scope.parse = $parse;
                    if (scope.fieldInfo != undefined) {
                        scope.fieldIdentifier = scope.fieldInfo.Name.replace(/\./g, '');
                        if (scope.fieldInfo.WhereClause != undefined) {
                            scope.fieldInfo.WhereClause = scope.tableCommunicator.replaceStringParamters(scope.fieldInfo.WhereClause);
                            scope.fieldInfo.WhereClause = scope.tableCommunicator.replaceListParamters(scope.fieldInfo.WhereClause);
                        }
                    }
                    // 2. check if its in view mode or edit mode and get the html template
                    if (scope.record != undefined && scope.isEdit != true) {
                        scope.handleViewMode();
                    } else if (scope.isEdit == true) {
                        scope.handleEditMode();
                    }




                    // 3.  Inject the html in DOM
                    element.html(scope.template).show();
                    $compile(element.contents())(scope);

                    // 4. Keep a watch on value, if it changes reload the template
                    scope.$watch(
                        'record',
                        function(newValue, oldValue) {
                            if (newValue != oldValue) {
                                // 2. check if its in view mode or edit mode and get the html template
                                if (scope.record != undefined && scope.isEdit != true) {
                                    scope.handleViewMode();
                                } else if (scope.isEdit == true) {
                                    scope.handleEditMode();
                                }
                                element.html(scope.template).show();
                                $compile(element.contents())(scope);
                            }
                        }
                    );

                    scope.$watch(
                        'isEdit',
                        function(newValue, oldValue) {
                            if (scope.isEdit == true) {
                                scope.handleEditMode();
                            } else {
                                scope.handleViewMode();
                            }
                            element.html(scope.template).show();
                            $compile(element.contents())(scope);
                        }
                    );
                }
            };
        }
    ]);

    var sfFormatToJSFormat = function(dateTimeFormatVal,isdateTime){
        let finalFormat ='';
    
        let formatdateTimeMap = {'dd' : 'd', 'MM' : 'm', 'yyyy' : 'Y', 'M' : 'm', 'd' : 'd'};
    
        if(dateTimeFormatVal != '' || dateTimeFormatVal !=undefined){
            let formatSplitList = dateTimeFormatVal.split(' ');
            if(formatSplitList.length > 0 ){
                let formlatVal = formatSplitList[0];
                let formAMPMVal = formatSplitList.length > 2?formatSplitList[2]:'';
                if(formlatVal !=''){
                    if(formlatVal.indexOf('/') != -1 ){
                        let formslashlist = formlatVal.split('/');
                        if(formslashlist.length > 0){
                            if(isdateTime){
                                if( formAMPMVal !='' && formAMPMVal.indexOf('a') != -1){
                                    finalFormat = formatdateTimeMap[formslashlist[0]]+'/'+formatdateTimeMap[formslashlist[1]]+'/'+formatdateTimeMap[formslashlist[2]]+' h:i A';
                                }else{
                                    finalFormat = formatdateTimeMap[formslashlist[0]]+'/'+formatdateTimeMap[formslashlist[1]]+'/'+formatdateTimeMap[formslashlist[2]]+' H:i';
                                }                               
                            }else{
                                finalFormat = formatdateTimeMap[formslashlist[0]]+'/'+formatdateTimeMap[formslashlist[1]]+'/'+formatdateTimeMap[formslashlist[2]];
                            }
                        }
                    }else if(formlatVal.indexOf('.') != -1){
                        let formslashlist = formlatVal.split('.');
                        if(formslashlist.length > 0){
                            if(isdateTime){
                                if(formAMPMVal !='' && formAMPMVal.indexOf('a') != -1){
                                    finalFormat = formatdateTimeMap[formslashlist[0]]+'.'+formatdateTimeMap[formslashlist[1]]+'.'+formatdateTimeMap[formslashlist[2]]+' h:i A';
                                }else{
                                    finalFormat = formatdateTimeMap[formslashlist[0]]+'.'+formatdateTimeMap[formslashlist[1]]+'.'+formatdateTimeMap[formslashlist[2]]+' H:i';
                                }       
                            }else{
                                finalFormat = formatdateTimeMap[formslashlist[0]]+'.'+formatdateTimeMap[formslashlist[1]]+'.'+formatdateTimeMap[formslashlist[2]];  
                            }
                        }
                    }else if(formlatVal.indexOf('-') != -1){
                        let formslashlist = formlatVal.split('-');
                        if(formslashlist.length > 0){
                            if(isdateTime){
                                if(formAMPMVal !='' && formAMPMVal.indexOf('a') != -1){
                                    finalFormat = formatdateTimeMap[formslashlist[0]]+'-'+formatdateTimeMap[formslashlist[1]]+'-'+formatdateTimeMap[formslashlist[2]]+' h:i A';
                                }else{
                                    finalFormat = formatdateTimeMap[formslashlist[0]]+'-'+formatdateTimeMap[formslashlist[1]]+'-'+formatdateTimeMap[formslashlist[2]]+' H:i';
                                }       
                            }else{
                                finalFormat = formatdateTimeMap[formslashlist[0]]+'-'+formatdateTimeMap[formslashlist[1]]+'-'+formatdateTimeMap[formslashlist[2]];
                            }
                        }   
                    }               
                }
            }
        }
        return  finalFormat;
    } 
    var sfTimeFormatToJSTimeFormat = function(timeFormat){
        let timeFormatParts = {"HH":"H","h":"h","hh":"G","mm":"i","a":"a","i":"mm","G":"hh","h":"h","H":"HH"};
        let jsTimeFormat = timeFormat;
        for( let formatPart in timeFormatParts ){ 
            if(timeFormat.indexOf(formatPart) != -1){
                jsTimeFormat = jsTimeFormat.replace( formatPart, timeFormatParts[formatPart]);
            } 
        }
        return jsTimeFormat; 
    }

    function msToTime(s) {
        // Pad to 2 or 3 digits, default is 2
	    if(s){
	       	function pad(n, z) {
	            z = z || 2;
	            return ('00' + n).slice(-z);
	        }
	        var ms = s % 1000;
	        s = (s - ms) / 1000;
	        var secs = s % 60;
	        s = (s - secs) / 60;
	        var mins = s % 60;
	        var hrs = (s - mins) / 60;
	        var ampm = hrs >= 12 ? 'PM' : 'AM';
	        hrs = hrs > 12 ? hrs % 12 : hrs;
	        return pad(hrs) + ':' + pad(mins) + ' ' + ampm ;
    	}
    	return;
    }  

    function toEDate(parts) {
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }
      
    function toEDateTime(datepart, timepart) {
        return new Date(datepart[2], datepart[1] - 1, datepart[0],timepart[0],timepart[1]);
    }