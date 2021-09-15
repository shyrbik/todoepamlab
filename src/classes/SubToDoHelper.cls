public with sharing class SubToDoHelper {

    public static void onAfterInsert(Map<Id, Sub_Todo__c> subTodos) {
        SubToDoHandler.insertToOtherOrg(subTodos.keySet());
    }

    public static void onBeforeDelete(Map<Id,Sub_Todo__c> subTodos) {
        SubToDoHandler.deleteToOtherOrg(subTodos.keySet());
    }

    public static void onBeforeUpdate(Map<Id, Sub_Todo__c> subTodos) {
        SubToDoHandler.updateToOtherOrg(subTodos.keySet());
    }
}