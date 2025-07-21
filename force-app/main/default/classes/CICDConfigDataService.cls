/**
**/
@RestResource(urlMapping='/CICDConfigDataService/*')

// Deprecated 
global with sharing class CICDConfigDataService {
    @HttpPost
    global static String doDuplicateParamsTest(List<String> objectList, DateTime lastModifiedDate) {
        Map<String, Object> response = new Map<String, Object>();
        return '';
    }
}