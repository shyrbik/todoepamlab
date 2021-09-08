public with sharing class ToDoControllerSecond {

    @AuraEnabled(cacheable=true)
    public static List<Todo__c> uncompletedToDo(){

        return [SELECT Name, Priority__c, Close_Date__c, Description__c FROM Todo__c WHERE Status__c = FALSE];
    }

    @AuraEnabled(cacheable=true)
    public static List<Todo__c> completedToDo(){

        return [SELECT Name, Priority__c, Close_Date__c, Description__c FROM Todo__c WHERE Status__c = TRUE];
    }

    @AuraEnabled(cacheable=true)
    public static List<Todo__c> allToDo(){
        return [SELECT Name, Priority__c, Close_Date__c, Description__c FROM Todo__c];
    }

    //update methods
    @AuraEnabled(cacheable=true)
    public static Todo__c getSingleToDo(){
        return [SELECT Name, Priority__c, Close_Date__c, Description__c FROM Todo__c];
    }

    @AuraEnabled(cacheable=true)
    public static Todo__c getSingleSubToDo(){
        return [SELECT Name, Priority__c, Close_Date__c, Description__c FROM Todo__c];
    }



}
