var expressionEvaluatorService = angular.module('expressionEvaluator', []);
expressionEvaluatorService.service('ExpressionEvaluatorService', function ($parse) {


    this.getOperator = function (operator, isLokiOperator) {
        switch (operator.toLowerCase()) {
            case "=":
                return isLokiOperator ?  '$eq' : '==';
                break;
            case "!=":
                return isLokiOperator ?  '$ne' : '!=';
                break;
            case "<":
                return isLokiOperator ?  '$lt' : '<';
                break;
            case "<=":
                return isLokiOperator ?  '$lte' : '<=';
                break;
            case ">=":
                return isLokiOperator ?  '$gte' : '>=';
                break;
            case ">":
                return isLokiOperator ?  '$gt' : '>';
                break;
            case "in":
                return isLokiOperator ?  '$in' : 'in';
                break;
            case "not in":
                return isLokiOperator ?  '$nin' : 'nin';
                break;
            case "regex":
            case "startswith":
            case "endswith":
                return isLokiOperator ?  '$regex' : undefined;
                break;
            case "contains":
            case "includes":
                return isLokiOperator ?  '$contains' : 'in';
                break;
            case "doesnotcontain":
            case "excludes":
                return isLokiOperator ?  '$containsNone' : 'nin';
                break;
        }
    }

    this.getResult  = function(result,operator){
        switch(operator){
            case 'nin':
            result = !result;
        }
        return result;
    }


    this.arithComparer = function(lOperand, expOperator, rOperand){
        if(rOperand == 'false'){
            rOperand = false;
        }if(rOperand == 'true'){
            rOperand = true;
        }
        let fieldCondition;
        switch (expOperator.toLowerCase()) {
            case "==":
                fieldCondition = (lOperand == rOperand) ? true : false;
                break;
            case "!=":
                fieldCondition = (lOperand != rOperand) ? true : false;
                break;
            case "<":
                fieldCondition = (lOperand < rOperand) ? true : false;
                break;
            case "<=":
                fieldCondition = (lOperand <= rOperand) ? true : false;
                break;
            case ">=":
                fieldCondition = (lOperand >= rOperand) ? true : false;
                break;
            case ">":
                fieldCondition = (lOperand > rOperand) ? true : false;
                break;
        }

        return fieldCondition;
    }

    this.conditionEvaluator = function (scope, condition, isColumnJSON, isParentRecord) {

        var fieldCondition = {};
        var operand = {};
        scope.tableCommunicator = scope.tableCommunicator != undefined ? scope.tableCommunicator : {};
        scope.tableCommunicator.expressionFieldsArray = scope.tableCommunicator.expressionFieldsArray != undefined && scope.tableCommunicator.expressionFieldsArray.length > 0 ? scope.tableCommunicator.expressionFieldsArray: [];
        scope.tableCommunicator.expressionUserFieldsArray = scope.tableCommunicator.expressionUserFieldsArray != undefined && scope.tableCommunicator.expressionUserFieldsArray.length > 0 ? scope.tableCommunicator.expressionUserFieldsArray: [];
        scope.tableCommunicator.expressionParentFieldsArray = scope.tableCommunicator.expressionParentFieldsArray != undefined && scope.tableCommunicator.expressionParentFieldsArray.length > 0 ? scope.tableCommunicator.expressionParentFieldsArray: [];

        if (condition && !j$.isEmptyObject(condition.LOperand)) {

            // If LOperand is User loki do not understand, so revering the condition
            if(condition.LOperand.Type == "User" && condition.ROperand.Type == "Field"){
                let lOperand = condition.LOperand;
                condition.LOperand = condition.ROperand;
                condition.ROperand = lOperand;
            }        
            let rValue
            switch (condition.LOperand.Type) {
                case 'Field':
                    {
                        (isColumnJSON == undefined) ? isColumnJSON = false : isColumnJSON;
                        if(!isColumnJSON){    
                            if (!j$.isEmptyObject(condition.ROperand)) {
                                switch (condition.ROperand.Type) {
                                    case 'Freetext':
                                        {
                                            rValue = condition.ROperand.Value;
                                            if(rValue == 'null' || rValue == 'Null' || rValue == 'NULL' || rValue == null ){
                                                rValue = undefined;
                                            }
                                            if(condition.LOperand.Value != undefined && scope.fieldMetaData[condition.LOperand.Value] != undefined && scope.fieldMetaData[condition.LOperand.Value].Type != undefined){
												let localOffset = new Date().getTimezoneOffset() * 60000;
                                                let dataType = scope.fieldMetaData[condition.LOperand.Value].Type;
                                                if(scope.fieldMetaData[condition.LOperand.Value].Type == 'REFERENCE'){
                                                    dataType = scope.fieldMetaData[condition.LOperand.Value].ReferenceFieldInfo.Type ;    
                                                }
                                                switch (dataType) {                                                    
                                                    case 'INTEGER':
                                                    case 'DOUBLE':
                                                    case 'PERCENT':
                                                    case 'CURRENCY':
                                                        if(typeof rValue == 'string' && rValue.indexOf(';')!= -1){
                                                            rValue = rValue.split(';');
                                                            let rValueArray = [];
                                                            angular.forEach(rValue, function (value, key) { 
                                                                rValueArray.push(parseFloat(value));
                                                            });
                                                            rValue = rValueArray;
                                                        }
                                                        else{
                                                            rValue = parseFloat(rValue);
                                                        }
                                                            
                                                    break;
                                                    case 'BOOLEAN':
                                                        rValue = (typeof(rValue) != typeof(true)) ? JSON.parse(rValue.toLowerCase()) : JSON.parse(rValue);
                                                    break;
                                                    case 'DATE':
                                                        rValue = new Date(rValue).getTime() - localOffset;
                                                    break;
                                                    case 'DATETIME':
                                                        rValue = new Date(rValue).getTime() - localOffset - timeOffset;
                                                    break;
                                                }
                                            }


                                            if (condition.Operator.toLowerCase() == 'StartsWith'.toLowerCase()) {
                                                operand[this.getOperator(condition.Operator, true)] = ['^(' + rValue + ')', 'i'];
                                            }
                                            else if (condition.Operator.toLowerCase() == 'EndsWith'.toLowerCase()) {
                                                    operand[this.getOperator(condition.Operator, true)] = ['(' + rValue + ')$', 'i'];
                                                }
                                            else if(condition.Operator.toLowerCase() == 'in' || condition.Operator.toLowerCase() == 'not in'){
                                                if(typeof rValue != 'number'  && rValue.indexOf(';')!= -1){
                                                    rValue = rValue.split(';');
                                                }
                                                  //  rValue = condition.ROperand.Value;
                                                  if(typeof rValue != 'object'){
                                                    let temprval = rValue;
                                                    rValue =[];
                                                    rValue.push(temprval);                                                    
                                                  }
                                                 
                                                  operand[this.getOperator(condition.Operator, true)] = rValue;   
                                            }
                                            else{
                                                operand[this.getOperator(condition.Operator, true)] = rValue;
                                            }
                                            fieldCondition[condition.LOperand.Value] = operand;
                                        }
                                        break;
                                    case 'Field':
                                        {
                                            fieldCondition = condition.ROperand.Value;
                                        }
                                        break;
                                    case 'User':
                                        {
                                            operand[this.getOperator(condition.Operator, true)] = scope.communicator.currentUserInfo.UserInfo[condition.ROperand.Value];
                                            fieldCondition[condition.LOperand.Value] = operand;
                                        }
                                        break;
                                    case 'regex':
                                        {
                                            operand[this.getOperator(condition.Operator, true)] = [condition.ROperand.Value, 'i'];
                                            fieldCondition[condition.LOperand.Value] = operand;
                                        }
                                        break;
                                }
                            }
                        }
                        if(isParentRecord){
                            let expOperator = this.getOperator(condition.Operator, false);
                            if(expOperator == undefined){
                                return undefined;
                            }
                            
                            let lOperand = $parse(condition.LOperand.Value)(scope.tableCommunicator.ParentRecord);
                            //let lOperand = scope.tableCommunicator.ParentRecord[condition.LOperand.Value];
                            let rOperand =  rValue != undefined ?  rValue : condition.ROperand.Value;
                            if(condition.ROperand.Type == "field"){
                                rOperand = $parse(condition.ROperand.Value)(scope.tableCommunicator.ParentRecord);
                            }
                            if(condition.ROperand.Type == "User"){
                                rOperand = scope.communicator.currentUserInfo.UserInfo[condition.ROperand.Value];
                            }

                            // This handle null value for picklist field
                            if(lOperand == undefined){
                                if(expOperator == 'in') {
                                    fieldCondition = false;
                                }else if(expOperator == 'nin') {
                                    fieldCondition = true;
                                } 

                            }
                            if(lOperand != undefined && isNaN(lOperand) || (lOperand instanceof Array) || (typeof lOperand === 'string' || lOperand instanceof String)){
                                let indexOfResult = rOperand.indexOf(lOperand) != -1 ? true : false;
                                if(expOperator == 'nin') {
                                    fieldCondition = !indexOfResult;
                                } else if(expOperator == 'in') {
                                    fieldCondition = indexOfResult;
                                } 
                            } /* else */ {
                                // let lOperand = scope.tableCommunicator.ParentRecord[condition.LOperand.Value];
                                // let rOperand = condition.ROperand.Value;
                                // let evaluationExpression = 'lOperand  expOperator  rOperand';
                                // fieldCondition = scope.$eval(evaluationExpression);
                                //

                                if(rOperand != undefined && isNaN(rOperand) && !(lOperand instanceof Array) && !(rOperand instanceof Array)  && (rOperand.toLowerCase() == 'true' || rOperand.toLowerCase() == 'false')){
                                    rOperand = JSON.parse(rOperand);
                                }
                                if(rOperand == 'null' || rOperand == 'Null' || rOperand == 'NULL' || rOperand == null){
                                    rOperand = undefined;
                                }
                                if(expOperator != 'in' && expOperator != 'nin'){
                                    fieldCondition = this.arithComparer(lOperand, expOperator, rOperand);    
                                }
                            }                         
                        }
                    }
                    break;
                case 'Profile':
                    {
                        fieldCondition = false;
                        let UserProfiles = condition.ROperand.Values.map(function (x) { return x.toLowerCase(); });
                        let evalResult = UserProfiles.indexOf(scope.communicator.currentUserInfo.UserProfile.toLowerCase()) != -1 ? true : false;
                        fieldCondition = this.getResult(evalResult,this.getOperator(condition.Operator,false));
                        break;
                    }
                case 'UserType':
                    {
                        fieldCondition = false;
                        let UserTypes = condition.ROperand.Values.map(function (x) { return x.toLowerCase(); });
                        let evalResult = UserTypes.indexOf(scope.communicator.currentUserInfo.UserType.toLowerCase()) != -1 ? true : false;
                        fieldCondition = this.getResult(evalResult,this.getOperator(condition.Operator,false));
                        break;
                    }
                case 'UserApp':
                    {
                        fieldCondition = false;
                        let UserAppNames = condition.ROperand.Values.map(function (x) { return x.toLowerCase(); });
                        let evalResult = UserAppNames.indexOf(scope.communicator.currentUserInfo.UserAppName.toLowerCase()) != -1 ? true : false;
                        fieldCondition = this.getResult(evalResult,this.getOperator(condition.Operator,false));
                        break;
                    }

                case 'Context':
                    {
                        fieldCondition = false;
                        let modes = condition.ROperand.Values.map(function (x) { return x.toLowerCase(); });
                        let evalResult = modes.indexOf(scope.communicator.mode.toLowerCase()) != -1 ? true : false;
                        fieldCondition = this.getResult(evalResult,this.getOperator(condition.Operator,false));
                        break;
                    }
                case 'User':
                    {
                        fieldCondition = false;
                        //scope.tableCommunicator.expressionUserFieldsArray.push(condition.LOperand.Value);
                        let lOperand = scope.communicator.currentUserInfo.UserInfo[condition.LOperand.Value];
                        lOperand = $parse(condition.LOperand.Value)(scope.communicator.currentUserInfo.UserInfo);
                        let expOperator = this.getOperator(condition.Operator, false);
                        let rOperand = condition.ROperand.Value;
                        let inNotin = ['in', 'not in'];
                        if(inNotin.indexOf(expOperator) != -1){
                            let userValues = condition.ROperand.Values.map(function(x) { return x.toLowerCase(); });
                            let evalResult = userValues.indexOf(scope.communicator.mode.toLowerCase()) != -1 ? true : false;
                            fieldCondition = this.getResult(evalResult,this.getOperator(condition.Operator,false));
                        }
                        else{
                            fieldCondition = this.arithComparer(lOperand, expOperator, rOperand);
                        }
                        break;
                    }
            }

        }
        if(!isParentRecord){
            if(fieldCondition == true){
                fieldCondition = {};
                fieldCondition= { Id : {$ne : null}}    
            }
            if(fieldCondition == false){
                fieldCondition = {};
                fieldCondition= { Id : {$eq : null}}    
            }    
        }
        return fieldCondition;
    }


    this.expressionEvaluator = function (scope, expression, isColumnJSON, isParentRecord) {
        var findCondition = {};
        var conditionsArray = [];

        if (expression.Conditions.length > 0) {
            for (let i = 0; i < expression.Conditions.length; i++) {
                //if(!isColumnJSON || (expression.Conditions[i].LOperand.Type != 'Field' && isColumnJSON))
                {
                    fieldCondition = this.conditionEvaluator(scope, expression.Conditions[i], isColumnJSON, isParentRecord);
                    conditionsArray.push(fieldCondition);

                    if(expression.Conditions[i].LOperand.Type == 'Field'){   
                        if (expression.Conditions[i].LOperand != {}) {
                            if (fieldCondition != undefined && !j$.isEmptyObject(fieldCondition)) {
                                if (!isColumnJSON && !isParentRecord && scope.tableCommunicator.expressionFieldsArray.indexOf(expression.Conditions[i].LOperand.Value) == -1) {
                                    scope.tableCommunicator.expressionFieldsArray.push(expression.Conditions[i].LOperand.Value);
                                }
                                else if ((isColumnJSON || isParentRecord) && scope.tableCommunicator.expressionParentFieldsArray.indexOf(expression.Conditions[i].LOperand.Value) == -1) {
                                    scope.tableCommunicator.expressionParentFieldsArray.push(expression.Conditions[i].LOperand.Value);
                                }
                            }
                        }   
                        if (expression.Conditions[i].ROperand != {} && expression.Conditions[i].ROperand.Type == 'Field') {
                            if (fieldCondition != undefined && !j$.isEmptyObject(fieldCondition)) {
                                if (!isColumnJSON && !isParentRecord && scope.tableCommunicator.expressionFieldsArray.indexOf(fieldCondition) == -1) {
                                    scope.tableCommunicator.expressionFieldsArray.push(fieldCondition);
                                }
                                else if ((isColumnJSON || isParentRecord) && scope.tableCommunicator.expressionParentFieldsArray.indexOf(fieldCondition) == -1) {
                                    scope.tableCommunicator.expressionParentFieldsArray.push(fieldCondition);
                                }
                            }
                        } 
                    }
                    if(expression.Conditions[i].LOperand.Type == 'User'){
                        if (!(j$.isEmptyObject(expression.Conditions[i].LOperand))) {
                            if (fieldCondition != undefined && (fieldCondition == false || !j$.isEmptyObject(fieldCondition))) {
                                if (scope.tableCommunicator.expressionUserFieldsArray.indexOf(expression.Conditions[i].LOperand.Value) == -1) {
                                    scope.tableCommunicator.expressionUserFieldsArray.push(expression.Conditions[i].LOperand.Value);
                                }
                            }
                        }                   
                        if (!(j$.isEmptyObject(expression.Conditions[i].ROperand)) && expression.Conditions[i].ROperand.Type == 'Field') {
                            if (fieldCondition != undefined && (fieldCondition == false || !j$.isEmptyObject(fieldCondition))) {
                                if (scope.tableCommunicator.expressionUserFieldsArray.indexOf(expression.Conditions[i].ROperand.Value) == -1) {
                                    scope.tableCommunicator.expressionUserFieldsArray.push(expression.Conditions[i].ROperand.Value);
                                }
                            }
                        }
                    }                  
                    if(expression.Conditions[i].ROperand.Type == 'User'){
                        if (!(j$.isEmptyObject(expression.Conditions[i].ROperand))) {
                            if (fieldCondition != undefined && (fieldCondition == false || !j$.isEmptyObject(fieldCondition))) {
                                if (scope.tableCommunicator.expressionUserFieldsArray.indexOf(expression.Conditions[i].ROperand.Value) == -1) {
                                    scope.tableCommunicator.expressionUserFieldsArray.push(expression.Conditions[i].ROperand.Value);
                                }
                            }
                        } 
                    }                
                }
            }
        }
        if (expression.Groups.length > 0) {
            for (let i = 0; i < expression.Groups.length; i++) {
                let groupFindCondition = this.expressionEvaluator(scope, expression.Groups[i], isColumnJSON, isParentRecord);
            
                if (groupFindCondition != undefined && !j$.isEmptyObject(groupFindCondition)) {
                    if (!isColumnJSON && !isParentRecord && scope.tableCommunicator.expressionFieldsArray.indexOf(groupFindCondition) != -1) {
                        scope.tableCommunicator.expressionFieldsArray.push(groupFindCondition);
                    }
                    else if ((isColumnJSON || isParentRecord) && scope.tableCommunicator.expressionParentFieldsArray.indexOf(groupFindCondition) != -1) {
                        scope.tableCommunicator.expressionParentFieldsArray.push(groupFindCondition);
                    }
                    conditionsArray.push(groupFindCondition);
                }
            }
        }
        if (expression.LogicalOperator != '') {
            if (expression.LogicalOperator == 'AND') {
                findCondition['$and'] = conditionsArray;
            }
            if (expression.LogicalOperator == 'OR') {
                findCondition['$or'] = conditionsArray;
            }
        }
        return findCondition;
    }
});