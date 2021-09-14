trigger QueueTrigger on Todo__c (before insert, before update, after insert, before delete ) {
    if (Trigger.isInsert && Trigger.isBefore) {
        QueueTriggerHandler.onBeforeInsert(Trigger.new);
    }
    if (Trigger.isInsert && Trigger.isAfter){
        QueueTriggerHandler.onAfterInsert(Trigger.newMap);
    }
    if (Trigger.isDelete && Trigger.isBefore)
    {
        System.debug(Trigger.oldMap);
        QueueTriggerHandler.onBeforeDelete(Trigger.oldMap);
    }
    if (Trigger.isUpdate && Trigger.isBefore)
    {
        QueueTriggerHandler.onBeforeUpdate(Trigger.newMap);
    }
}