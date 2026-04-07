import { LightningElement, wire, track } from 'lwc';
import getDoctors from '@salesforce/apex/AppointmentController.getDoctors';
import getPatients from '@salesforce/apex/AppointmentController.getPatients';
import createAppointment from '@salesforce/apex/AppointmentController.createAppointment';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AppointmentBooking extends LightningElement {

    @track doctorOptions = [];
    @track patientOptions = [];

    patientId;
    doctorId;
    appointmentDate;

    // Load Doctors
    @wire(getDoctors)
    wiredDoctors({ data, error }) {
        if (data) {
            this.doctorOptions = data.map(doc => ({
                label: doc.Name,
                value: doc.Id
            }));
        } else if (error) {
            console.error(error);
        }
    }

    // Load Patients
    @wire(getPatients)
    wiredPatients({ data, error }) {
        if (data) {
            this.patientOptions = data.map(p => ({
                label: p.Name,
                value: p.Id
            }));
        } else if (error) {
            console.error(error);
        }
    }

    handlePatient(event) {
        this.patientId = event.detail.value;
    }

    handleDoctor(event) {
        this.doctorId = event.detail.value;
    }

    handleDate(event) {
        this.appointmentDate = event.target.value;
    }

    bookAppointment() {

        if (!this.patientId || !this.doctorId || !this.appointmentDate) {
            this.showToast('Error', 'Please fill all fields', 'error');
            return;
        }

        createAppointment({
            patientId: this.patientId,
            doctorId: this.doctorId,
            appDate: this.appointmentDate
        })
        .then(result => {
            if(result === 'Success'){
                this.showToast('Success', 'Appointment Booked!', 'success');
            } else {
                this.showToast('Error', result, 'error');
            }
        })
        .catch(error => {
            this.showToast('Error', error.body.message, 'error');
        });
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }
}