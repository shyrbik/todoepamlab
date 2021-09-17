/**
 * Created by Me on 9/8/2021.
 */

public with sharing class QueueTriggerHandler {
    public static void onBeforeInsert(List<Todo__c> todos) {
        QueueTriggerHandlerHelper.assignmentQueue(todos);
    }
}