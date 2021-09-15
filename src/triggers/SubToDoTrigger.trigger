trigger SubToDoTrigger on Sub_ToDo__c (before delete, after insert, after update) {
    if (Trigger.isInsert && Trigger.isAfter){
        SubToDoHelper.onAfterInsert(Trigger.newMap);
    }
    if (Trigger.isDelete && Trigger.isBefore)
    {
        SubToDoHelper.onBeforeDelete(Trigger.oldMap);
    }
    if (Trigger.isUpdate && Trigger.isBefore)
    {
        SubToDoHelper.onBeforeUpdate(Trigger.newMap);
    }
}