public with sharing class ToDoControllerSecond {

    @AuraEnabled
    public static List<Todo__c> getUncompletedToDo(){
        System.debug([SELECT Name, Priority__c, Close_Date__c, Description__c, (SELECT Id, Name FROM Sub_ToDos__r)
        FROM Todo__c
        WHERE Status__c = FALSE].size() + ' size');
        return [SELECT Name, Priority__c, Close_Date__c, Description__c, (SELECT Id, Name FROM Sub_ToDos__r)
                FROM Todo__c
                WHERE Status__c = FALSE];
    }

    @AuraEnabled
    public static List<Sub_ToDo__c> getUncompletedSubToDo(){
        return [SELECT Name, Description__c FROM Sub_ToDo__c WHERE Status__c = FALSE];
    }

    @AuraEnabled
    public static List<Todo__c> getCompletedToDo(){

        return [SELECT Name, Priority__c, Close_Date__c, Description__c, (SELECT Id, Name FROM Sub_ToDos__r)
                FROM Todo__c
                WHERE Status__c = TRUE];
    }

    @AuraEnabled
    public static List<Sub_ToDo__c> getCompletedSubToDo(){
        return [SELECT Name, Description__c FROM Sub_ToDo__c WHERE Status__c = TRUE];
    }



    @AuraEnabled
    public static List<Todo__c> getAllToDo(){
        return [SELECT Name, Priority__c, Close_Date__c, Description__c FROM Todo__c];
    }

    @AuraEnabled
    public static List<Sub_ToDo__c> getAllSubToDo(){
        return [SELECT Id, Name, Description__c FROM Sub_ToDo__c];
    }

    //update methods
    @AuraEnabled
    public static Todo__c getSingleToDo(){
        return [SELECT Name, Priority__c, Close_Date__c, Description__c FROM Todo__c];
    }

    @AuraEnabled
    public static Sub_ToDo__c getSingleSubToDo() {
        return [
                SELECT Id, Name, Description__c, Status__c
                FROM Sub_ToDo__c
                WITH SECURITY_ENFORCED
                LIMIT 1
        ];
    }


    //не работает
    @AuraEnabled
    public static void refreshLists() {
        getCompletedToDo();
        getUncompletedToDo();
    }

/*
почитать про Wrapper Class in lwc
    class TodoWrapper{
        @AuraEnabled
        List<Todo__c> todoC;
    }
*/



}
