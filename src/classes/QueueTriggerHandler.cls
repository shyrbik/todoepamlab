public with sharing class QueueTriggerHandler {
    public static void onBeforeInsert(List<Todo__c> todos) {
        QueueTriggerHandlerHelper.assignmentQueue(todos);
    }

    public static void onAfterInsert(Map<Id, Todo__c> todos) {
        QueueTriggerHandlerHelper.insertToOtherOrg(todos.keySet());
    }

    public static void onBeforeDelete(Map<Id,Todo__c> todos) {
        QueueTriggerHandlerHelper.deleteToOtherOrg(todos.keySet());
    }

    public static void onBeforeUpdate(Map<Id, Todo__c> todos) {
        QueueTriggerHandlerHelper.updateToOtherOrg(todos.keySet());
    }
}