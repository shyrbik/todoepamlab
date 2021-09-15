public with sharing class ToDoControllerSecond {

    @AuraEnabled
    public static List<Todo__c> getUncompletedToDo() {
        return [
                SELECT Name, Priority__c, Close_Date__c, Description__c, RecordTypeName__c, (SELECT Id, Name, Status__c FROM Sub_ToDos__r)
                FROM Todo__c
                WHERE Status__c = FALSE
                ORDER BY CreatedDate DESC
        ];
    }

    @AuraEnabled
    public static List<Sub_ToDo__c> getUncompletedSubToDo() {
        return [SELECT Name, Description__c FROM Sub_ToDo__c WHERE Status__c = FALSE];
    }

    @AuraEnabled
    public static List<Todo__c> getCompletedToDo() {
        return [
                SELECT Name, Priority__c, Close_Date__c, Description__c, RecordTypeName__c, (SELECT Id, Name, Status__c FROM Sub_ToDos__r)
                FROM Todo__c
                WHERE Status__c = TRUE
                ORDER BY CreatedDate DESC
        ];
    }

    @AuraEnabled
    public static List<Sub_ToDo__c> getCompletedSubToDo() {
        return [SELECT Name, Description__c FROM Sub_ToDo__c WHERE Status__c = TRUE];
    }

    @AuraEnabled
    public static String setRecordTypeId() {

        Map<String, Id> mapRecordType = new Map<String, Id>();
        List<String> recordTypeName = new List<String>{
                'Programming', 'Testing', 'Design', 'Other'
        };

        for (String recType : recordTypeName) {
            mapRecordType.put(recType, Schema.SObjectType.Todo__c.getRecordTypeInfosByName()
                    .get(recType).getRecordTypeId());
        }
        System.debug('Id for record types Todo__c = ' + mapRecordType.keySet());

        return JSON.serialize(mapRecordType);
    }


    //не работает
    @AuraEnabled
    public static void refreshLists() {
        getCompletedToDo();
        getUncompletedToDo();
    }



}
