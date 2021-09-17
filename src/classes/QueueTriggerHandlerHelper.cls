/**
 * Created by  on .
 */

public with sharing class QueueTriggerHandlerHelper {

    static final String END_POINT = 'callout:Other_Org/services/apexrest/ToDo__c/';

    public static void assignQueue(List<Todo__c> todos) {
        List<Group> queues = [SELECT Id, Name FROM Group WHERE Type = 'Queue'];

        for (Todo__c todo : todos) {
            for (Group Queue : queues) {
                if (Queue.Name == todo.RecordTypeName__c && todo.OwnerId != Queue.Id) {
                    todo.OwnerId = Queue.Id;
                }
            }
        }
    }

    @Future(Callout = true)
    public static void insertToOtherOrg(Set<Id> todoIds)
    {
        for (Todo__c todo : [SELECT Name, Description__c, Status__c, Priority__c, Close_Date__c, RecordTypeName__c FROM Todo__c WHERE Id IN:todoIds]) {
            ConnectToOrg.makePostCallout(getRequestBody(todo, true), END_POINT);
            System.debug(getRequestBody(todo, true));
        }
    }

    @Future(Callout = true)
    public static void deleteToOtherOrg(Set<Id> todoIds)
    {
        for(Id todo : todoIds)
            ConnectToOrg.makeDeleteCallout(todo, END_POINT);
    }

    @Future(Callout = true)
    public static void updateToOtherOrg(Set<Id> todoIds)
    {
        for (Todo__c todo : [SELECT Name, Description__c, Status__c, Priority__c, Close_Date__c, RecordTypeName__c FROM Todo__c WHERE Id IN:todoIds]) {
            System.debug(todo);
            ConnectToOrg.makePatchCallout(todo.Id, getRequestBody(todo, false), END_POINT);
        }
    }

    public static String getRequestBody(Todo__c todo, Boolean operation)
    {
        String requestBody;
        if(operation)
        {
            requestBody = '{"name":"' + todo.Name + '","Description":"' + todo.Description__c + '","externalId":"' + todo.Id + '","status":"' + todo.Status__c +'","priority":"' + todo.Priority__c +'","closeDate":"' + todo.Close_Date__c.format() + '","recordType":"' + todo.RecordTypeName__c +'"}';
        } else {
            requestBody = '{"Name":"' + todo.Name + '","Description__c":"' + todo.Description__c + '","Status__c":"' + todo.Status__c + '","Priority__c":"' + todo.Priority__c +'","Close_Date__c":"' + todo.Close_Date__c.format() +'","RecordTypeName__c":"' + todo.RecordTypeName__c +'"}';
        }
        return requestBody;
    }

}