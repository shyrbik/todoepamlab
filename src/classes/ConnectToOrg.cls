public with sharing class ConnectToOrg {

    static final String END_POINT = 'callout:Other_Org/services/apexrest/ToDo__c/';

    public static HttpResponse makePostCallout(String requestBody)
    {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(END_POINT);
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/json');
        request.setHeader('Authorization', 'Bearer {!$Other_Org.OAuthToken}');
        System.debug(request.getEndpoint());
        request.setBody(requestBody);
        HttpResponse response = http.send(request);
        System.debug(response.getBody() + '     ' + response);
        return response;
    }

    public static HttpResponse makeDeleteCallout(String ExternalId)
    {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setHeader('Authorization', 'Bearer {!$Other_Org.OAuthToken}');
        request.setEndpoint(END_POINT + ExternalId);
        request.setMethod('DELETE');
        HttpResponse response = http.send(request);
        System.debug(response);
        return response;
    }

    public static HttpResponse makePatchCallout(String id, String requestBody)
    {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(END_POINT + id + '?_HttpMethod=PATCH');
        request.setMethod('POST');
        request.setHeader('Authorization', 'Bearer {!$Other_Org.OAuthToken}');
        request.setHeader('X-HTTP-Method-Override', 'PATCH');
        request.setHeader('Content-Type', 'application/json;charset=UTF-8');
        request.setBody(requestBody);
        HttpResponse response = http.send(request);
        System.debug(response);
        return response;
    }
}