public with sharing class ConnectToOrg {

    public static HttpRequest getRequest(String method, String endPoint)
    {
        HttpRequest request = new HttpRequest();
        request.setEndpoint(endPoint);
        request.setMethod(method);
        request.setHeader('Content-Type', 'application/json');
        request.setHeader('Authorization', 'Bearer {!$Other_Org.OAuthToken}');
        return request;
    }

    public static HttpResponse makePostCallout(String requestBody, String END_POINT)
    {
        Http http = new Http();
        HttpRequest request = getRequest('POST', END_POINT);
        request.setBody(requestBody);
        System.debug(request.getEndpoint());
        HttpResponse response = http.send(request);
        System.debug(response.getBody() + '     ' + response);
        return response;
    }

    public static HttpResponse makeDeleteCallout(Id ExternalId, String END_POINT)
    {
        Http http = new Http();
        HttpRequest request = getRequest('DELETE', END_POINT + ExternalId);
        HttpResponse response = http.send(request);
        System.debug(response);
        return response;
    }

    public static HttpResponse makePatchCallout(Id ExternalId, String requestBody, String END_POINT)
    {
        Http http = new Http();
        HttpRequest request = getRequest('POST', END_POINT + ExternalId + '?_HttpMethod=PATCH');
        request.setHeader('X-HTTP-Method-Override', 'PATCH');
        request.setBody(requestBody);
        HttpResponse response = http.send(request);
        System.debug(response);
        return response;
    }
}