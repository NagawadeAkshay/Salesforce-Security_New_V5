/*
    Main Controller
    This is where everything starts 
    To understand where the execution starts jump to the end of controller
*/ 
flexGrid.controller('FlexGridCtrl', function ($q, $scope, $timeout, $window, $sce,
                                                VisualForce,MessageService,ToolTipHelper,
                                                InitFlexGridConfigService,FirstPageRecordsService,
                                                AllRecordsCountService,AllRecordsService,DataBaseService,
                                                ConsoleLogger,ExpressionEvaluatorService,GridHelperService,
                                                gridfactory,griddataprovider) {
    //----------All variable declaration-------------
    $scope.initCompleted = false;

    //----------All array declaration----------------
   

    //----------All object declaration---------------
    // $scope.communicator is used for inter-directive communication for 
    // all directives created as a part of grid
    $scope.communicator = {};
    $scope.communicator.messages = [];// To show messages on top of grid
    $scope.communicator.flexGridMetaData = {}; //Handles the grid level config meta data
    $scope.communicator.currentUserInfo = {};
    $scope.communicator.parentRecordId = escape(parentId); //Id From URL 
    $scope.communicator.saveRecordsMap = {};    
    $scope.communicator.newSaveRecordsMap = {}    
    $scope.communicator.editRowIdMap = {};     //Record Id vs Is Record Edited(Boolean)
    $scope.communicator.tableObjectsMap = {}; // Table level Vs Sojbect Name of Table
    $scope.communicator.levelVsTableIdMap = {}; // Table level Vs TableId
    $scope.communicator.parentUniqueId = 0; // Used to generate new Temporary Id for new Records;
    $scope.communicator.childUniqueId = 0;
    $scope.communicator.granChildUniqueId = 0;
    $scope.communicator.parentLookupFieldMap = {};
    $scope.communicator.queryfieldsMap = {};
    $scope.communicator.tableObjectIdMap = {}; // Object Name vs TableId
    $scope.communicator.tableIdVsObjectAPIMap = {};
    $scope.communicator.mode = mode;
	$scope.communicator.userTimeFormat = typeof(UserContext) != 'undefined' ? UserContext.timeFormat : '';

    
    // Code related to message component
    $scope.removeMessage = function(index){
        $scope.communicator.messages.splice(index, 1);
    }
   
    // refresh all grids/tables
    $scope.refresh = function(){
        $scope.communicator.refreshAllGrid();
    }

    /*
        Initializes the config Info for FlexGrid
    */
    $scope.initFlexGrid = function() {
        // 1. Get the input params required for grid
        var params = griddataprovider.getInitGridDataParams($scope.sforce1);
        // 2. Invoke remote call to get all flex grid info
        gridfactory.initData(params,$scope.initFlexGridSuccessHandler,$scope.initFlexGridErrorHandler);   
    };
    $scope.initFlexGridSuccessHandler = function(initResult, event){
        InitFlexGridConfigService.success($scope,initResult, event);   
    }
    $scope.initFlexGridErrorHandler = function(initResult, event){
        InitFlexGridConfigService.error($scope,initResult, event);
    }

    
    /*
        Initializes the config Info for FlexTable
    */
   $scope.initFlexTable = function() {
        // 1. Get the input params required for Table
        var params = griddataprovider.getInitTableDataParams($scope.sforce1);
        // 2. Invoke remote call to get all flex Table info
        gridfactory.initTableData(params,$scope.initFlexTableSuccessHandler,$scope.initFlexTableErrorHandler);   
    };
    $scope.initFlexTableSuccessHandler = function(initResult, event){
        InitFlexGridConfigService.success($scope,initResult, event);   
    }
    $scope.initFlexTableErrorHandler = function(initResult, event){
        InitFlexGridConfigService.error($scope,initResult, event);
    }

    // A grid can be initialized using 3 approaches:    
    if (gridName != '' && flexGridType == 'FlexGrid') {// 1. Using a Flex grid config record
        $scope.initFlexGrid();
    }else if(gridName != '' && flexGridType == 'FlexTable'){//2. Using a flex table config record
        $scope.initFlexTable();
    }else if(inputJSONConfig != undefined){//3. Using a config JSON provided by some external source

    }  
});