
pageLayoutBuilderApp.filter('noFractionCurrency',[ '$filter', '$locale',
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
]);
pageLayoutBuilderApp.directive('fieldholder', function($compile,$parse) {
    var getTemplate = function(dataType,label){                                                          
        var template;
        var fieldValue = 'Sample '+label;
        //console.log('===dataType===',dataType);
        switch(dataType) {
            case 'ID': 
            case 'DOUBLE':
            case 'INTEGER':             
            case 'STRING': 
            case 'PICKLIST': 
            case 'PERCENT':
            case 'MULTIPICKLIST':
            case 'PHONE':   
            case 'ANYTYPE':
            case 'TEXTAREA':                     
                template = 'Sample '+ label; 
                break;                                                                                        
            case 'EMAIL':                        
                template = '<span><a tabIndex="0">Sample '+ label+'</a></span> ';                         
                break;                    
            case 'BOOLEAN':  
                template = '<i class="fa fa-check"></i>'; 
                break;                
            case 'URL':  
                template = '<a tabIndex="0" value="https://login.salesforce.com">Google</a>';                                                      
                break;
            case 'DATE':                        
                template = '<span ng-bind="dateValue | date:\'MM/dd/yyyy\'"/></span> ';  
                break;
            case 'DATETIME':
                template = '<span ng-bind="dateValue  |  date:\'MM/dd/yyyy h:mm:a \'"/></span> ';                                                                          
                break;
            case 'CURRENCY':  
                template = '<span ng-bind="currencyValue | noFractionCurrency "/></span> ';                                              
                break;
            case 'REFERENCE':                                                                   
                template = '<a tabIndex="0">Sample '+ label + '</a>';                                              
                break;
        } 
        //console.log('===template===',template);
        var fieldTemplate = `<dl>
                                <dt>
                                    <span class="customLabelstyle">`+label+`</span>
                                    <span ng-if="pbdHandler.step == 2" class="pbd-actions pull-right">
                                        <a href="#" ng-click="pbdHandler.openPageBlockDetailModal(pbdConfig);"><span><i class="fa fa-cog" aria-hidden="true"></i></span></a>
                                        <a href="#"><span><i class="fa fa-trash-o" aria-hidden="true"></i></span></a>
                                    </span> 
                                </dt>
                                <dd class="field-value-dd">
                                    <span class="field-value">`+template+`</span>
                                </dd>
                            </dl>`;   
        return fieldTemplate;                                            
    };
    var linker = function(scope, element, attrs) {        
        scope.type = scope.pbdConfig.fieldInfo.dataType;
        scope.label = scope.pbdConfig.fieldInfo.fieldLabel;        
        scope.currencyValue = 123456;
        scope.dateValue = new Date().getTime();
        element.html(getTemplate(scope.type,scope.label)).show();          
        $compile(element.contents())(scope);
    }
    return {
        restrict: 'E',                              
        scope: {           
           pbdConfig:'=',
           pbdHandler:'='
        },
        link: linker
    };    
}); 