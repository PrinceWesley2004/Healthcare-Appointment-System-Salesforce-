public with sharing class AppointmentController {

    // Get Doctors
    @AuraEnabled(cacheable=true)
    public static List<Doctor__c> getDoctors() {
        return [SELECT Id, Name FROM Doctor__c LIMIT 50];
    }

    // Get Patients
    @AuraEnabled(cacheable=true)
    public static List<Patient__c> getPatients() {
        return [SELECT Id, Name FROM Patient__c LIMIT 50];
    }

    // Create Appointment
    @AuraEnabled
    public static String createAppointment(Id patientId, Id doctorId, Datetime appDate) {
        try {
            Appointment__c appt = new Appointment__c(
                Patient__c = patientId,
                Doctor__c = doctorId,
                Appointment_Date__c = appDate,
                Status__c = 'Scheduled'
            );
            insert appt;
            return 'Success';
        } catch(Exception e) {
            return e.getMessage();
        }
    }
}