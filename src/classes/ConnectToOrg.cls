public with sharing class ConnectToOrg {

    static final String END_POINT = 'https://cunning-impala-2956nx-dev-ed.my.salesforce.com/services/apexrest/ToDo__c/';
    static final String ACCESS_TOKEN = '00D5g00000A3I8p!ARYAQDShB50jltB3VLXidUUBDcgVY0luZfP5E_SM0MYx4bDeSbZGlH5IWvGQbCZ5HOwxyg2oR_Xnd4jT7CPpIXCH.YY7M.mg';

    public static HttpResponse makePostCallout(String requestBody)
    {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(END_POINT);
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/json;charset=UTF-8');
        request.setHeader('Authorization', 'Bearer ' + ACCESS_TOKEN);
        request.setBody(requestBody);
        HttpResponse response = http.send(request);
        System.debug(response);
        return response;
    }

    public static HttpResponse makeDeleteCallout(String id)
    {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setHeader('Authorization', 'Bearer ' + ACCESS_TOKEN);
        request.setEndpoint(END_POINT + id);
        request.setMethod('DELETE');
        HttpResponse response = http.send(request);
        return response;
    }

    public static HttpResponse makePatchCallout(String id, String requestBody)
    {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(END_POINT + id + '?_HttpMethod=PATCH');
        request.setMethod('POST');
        request.setHeader('Authorization', 'Bearer ' + ACCESS_TOKEN);
        request.setHeader('X-HTTP-Method-Override', 'PATCH');
        request.setHeader('Content-Type', 'application/json;charset=UTF-8');
        request.setBody(requestBody);
        HttpResponse response = http.send(request);
        return response;
    }
}