/**
 * Created by Me on 9/8/2021.
 */

trigger QueueTrigger on Todo__c (before insert, before update) {
    if (Trigger.isInsert && Trigger.isBefore) {
        QueueTriggerHandler.onBeforeInsert(Trigger.new);
    }
}