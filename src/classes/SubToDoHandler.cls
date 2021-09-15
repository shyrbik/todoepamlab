public with sharing class SubToDoHandler {

    static final String SUB_END_POINT = 'callout:Other_Org/services/apexrest/SubToDo__c/';

    @Future(Callout = true)
    public static void insertToOtherOrg(Set<Id> subTodoIds)
    {
        for (Sub_ToDo__c subToDo : [SELECT Name, Description__c, Status__c, Parent_ToDo__c FROM Sub_ToDo__c WHERE Id IN:subTodoIds]) {
            ConnectToOrg.makePostCallout(getRequestBody(subToDo, true), SUB_END_POINT);
        }
    }
    
    @Future(Callout = true)
    public static void deleteToOtherOrg(Set<Id> subTodoIds)
    {
        for(Id todo : subTodoIds)
            ConnectToOrg.makeDeleteCallout(todo, SUB_END_POINT);
    }

    @Future(Callout = true)
    public static void updateToOtherOrg(Set<Id> subTodoIds)
    {
        for(Sub_ToDo__c subToDo : [SELECT Name, Description__c, Status__c FROM Sub_ToDo__c WHERE Id IN:subTodoIds])
        {
            ConnectToOrg.makePatchCallout(subToDo.Id,getRequestBody(subToDo, false), SUB_END_POINT);
        }
    }

    public static String getRequestBody(Sub_ToDo__c subToDo, Boolean operation)
    {
        String requestBody;
        if(operation)
        {
            requestBody = '{"name":"' + subToDo.Name + '","Description":"' + subToDo.Description__c + '","externalId":"' + subToDo.Id + '","status":"' + subToDo.Status__c +'","todoExternalId":"' + subToDo.Parent_ToDo__c + '"}';
        } else {
            requestBody = '{"Name":"' + subToDo.Name + '","Description__c":"' + subToDo.Description__c + '","Status__c":"' + subToDo.Status__c + '"}';
        }
        return requestBody;
    }
    
}