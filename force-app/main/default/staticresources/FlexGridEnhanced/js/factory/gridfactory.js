flexGrid.factory('gridfactory', function (VisualForce) {
	var gridInfo = {			
	    initData : function(params,successHandler,errorHandler){
	    	VisualForce.invoke(_RemotingFlexGridEnhancedActions.GetFlexGridInfo,
	    						params,successHandler,errorHandler);	    	
		},					
	    initTableData : function(params,successHandler,errorHandler){
	    	VisualForce.invoke(_RemotingFlexGridEnhancedActions.getFlexTableInfo,
	    						params,successHandler,errorHandler);	    	
	    },
	    getPageRecords : function(params,successHandler,errorHandler){
	    	VisualForce.invoke(_RemotingFlexGridEnhancedActions.GetPageRecords,
	    						params,successHandler,errorHandler);	    	
	    },
	    getPageRecordsMap : function(params,successHandler,errorHandler){
	    	VisualForce.invoke(_RemotingFlexGridEnhancedActions.GetPageRecordsMap,
	    						params,successHandler,errorHandler);	    	
	    },
	    executeClass : function(params,successHandler,errorHandler){
	    	VisualForce.invoke(_RemotingFlexGridEnhancedActions.ExecuteClass,
	    						params,successHandler,errorHandler);	
	    },
	    fetchLookupData : function(params,successHandler,errorHandler){
	    	VisualForce.invoke(_RemotingFlexGridEnhancedActions.ExecuteClass,
	    						params,successHandler,errorHandler);	
	    },
	    deleteRecords : function(params,successHandler,errorHandler){
	    	VisualForce.invoke(_RemotingFlexGridEnhancedActions.deleteRecords,
	    						params,successHandler,errorHandler);
	    },
	     saveRecords : function(params,successHandler,errorHandler){
	    	VisualForce.invoke(_RemotingFlexGridEnhancedActions.saveRecords,
	    						params,successHandler,errorHandler);
	  	},
	   	getOverAllTotal : function(params,successHandler,errorHandler){
		  VisualForce.invoke(_RemotingFlexGridEnhancedActions.getOverAllTotal,
							  params,successHandler,errorHandler);
	    },searchWithAllRecord : function(params,successHandler,errorHandler){
	    	VisualForce.invoke(_RemotingFlexGridEnhancedActions.searchWithAllRecord,
	    						params,successHandler,errorHandler);	    	
	    }
	}
	return gridInfo;
});