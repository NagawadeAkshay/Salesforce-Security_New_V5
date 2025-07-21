/**
**/
global with sharing class DigitallySignedCtrl {
    global Id parentObjectId{get;set;} 
    global String titleValue{get; set; }
    global String pageBlockId {get;set;}
    global String classification {get;set;}
    global Boolean isDigiSign {get;set;}
    global Integer  timeOffset {
        get{            
            TimeZone tz = UserInfo.getTimeZone();           
            return tz.getOffset(System.now());
        }set;
    }
    global DigitallySignedCtrl() {    	

    }
    @RemoteAction
    global static Map<String,object> fetchDocuments(String parentObjectId,String pblockId,boolean isView,Boolean loadConfigData,boolean isDigiSign){
    	Map<String,object> returnMap = new Map<String,object>();
        return returnMap;
    }
   
    @RemoteAction
    global static void cancelSignature(String apiKey,String apiSig,String DocverifyId){    
    }
    
    @RemoteAction
	global static Map<String,Object> deleteDocument(String docId){
		Map<String, Object> retVal = new Map<String, Object>();
		return retVal;    
    }   
}