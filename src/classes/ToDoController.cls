public with sharing class ToDoController {

    @AuraEnabled(cacheable=true)
    public static List<Todo__c> uncompletedToDo(){
        return [SELECT Name, Priority__c FROM Todo__c WHERE Status__c = FALSE];
    }

    @AuraEnabled(Cacheable = true)
    public static Todo__c setCompleteToDo(Id todoId){
        Todo__c todo = [SELECT Id, Status__c FROM Todo__c WHERE Id = : todoId];
        todo.Status__c = true;
        return todo;
    }
}