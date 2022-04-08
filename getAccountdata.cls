public class getAccountdata {
 @AuraEnabled(cacheable = true)

        public static  List < Account > getAccountRating(string searchKey) {
         List < Account >AccountList = [SELECT Id, Name, BillingCity, BillingState, Rating ,Status__c FROM Account where Rating =: searchKey];
          System.debug(AccountList);
        return AccountList;
        }
}