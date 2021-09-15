/**
 * Created by  on .
 */

public with sharing class QueueTriggerHandlerHelper {

    static final String END_POINT = 'callout:Other_Org/services/apexrest/ToDo__c/';

    public static void assignmentQueue(List<Todo__c> todos) {
        List<Group> queues = [SELECT Id, Name FROM Group WHERE Type = 'Queue'];
        List<RecordType> recTypes = [SELECT Id, Name FROM RecordType LIMIT 3];

        for (Todo__c todo : todos) {
            String recordtypeName =
                    Schema.SObjectType.ToDo__c.getRecordTypeInfosById().get(todo.RecordTypeId).getName();

            if (recordtypeName == 'Tomorrow') {
                for (Group Queue : queues) {
                    if (Queue.Name == 'Tomorrow ToDos' && todo.OwnerId != Queue.Id) {
                        todo.OwnerId = Queue.Id;
                    }
                }
            }
            else if (recordtypeName == 'Later') {
                for (Group Queue : queues) {
                    if (Queue.Name == 'Later ToDos' && todo.OwnerId != Queue.Id) {
                        todo.OwnerId = Queue.Id;
                    }
                }
            } else {
                for (Group Queue : queues) {
                    if (Queue.Name == 'Today ToDos' && todo.OwnerId != Queue.Id) {
                        todo.OwnerId = Queue.Id;
                    }
                }
            }

        }
    }

    @Future(Callout = true)
    public static void insertToOtherOrg(Set<Id> todoIds)
    {
        for (Todo__c todo : [SELECT Name, Description__c, Status__c, Priority__c FROM Todo__c WHERE Id IN:todoIds]) {
            ConnectToOrg.makePostCallout(getRequestBody(todo, true), END_POINT);
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
        for (Todo__c todo : [SELECT Name, Description__c, Status__c, Priority__c FROM Todo__c WHERE Id IN:todoIds]) {
            ConnectToOrg.makePatchCallout(todo.Id, getRequestBody(todo, false), END_POINT);
        }
    }

    public static String getRequestBody(Todo__c todo, Boolean operation)
    {
        String requestBody;
        if(operation)
        {
            requestBody = '{"name":"' + todo.Name + '","Description":"' + todo.Description__c + '","externalId":"' + todo.Id + '","status":"' + todo.Status__c +'","priority":"' + todo.Priority__c +'"}';
        } else {
            requestBody = '{"Name":"' + todo.Name + '","Description__c":"' + todo.Description__c + '","Status__c":"' + todo.Status__c + '","Priority__c":"' + todo.Priority__c +'"}';
        }
        return requestBody;
    }

}