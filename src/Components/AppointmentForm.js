import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/AppointmentForm.css";
import { ToastContainer, toast } from "react-toastify";
import emailjs from 'emailjs-com';
import { db } from '../firebase/Firebase';
import { collection, addDoc } from 'firebase/firestore';

function AppointmentForm() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const [patientName, setPatientName] = useState("");
  const [patientNumber, setPatientNumber] = useState("");
  const [patientGender, setPatientGender] = useState("default");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [preferredMode, setPreferredMode] = useState("default");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    const errors = {};
    if (!patientName.trim()) {
      errors.patientName = "Patient name is required";
    } else if (patientName.trim().length < 8) {
      errors.patientName = "Patient name must be at least 8 characters";
    }

    if (!patientNumber.trim()) {
      errors.patientNumber = "Patient phone number is required";
    } else if (patientNumber.trim().length !== 10) {
      errors.patientNumber = "Patient phone number must be of 10 digits";
    }

    if (patientGender === "default") {
      errors.patientGender = "Please select patient gender";
    }
    if (!appointmentTime) {
      errors.appointmentTime = "Appointment time is required";
    } else {
      const selectedTime = new Date(appointmentTime).getTime();
      const currentTime = new Date().getTime();
      if (selectedTime <= currentTime) {
        errors.appointmentTime = "Please select a future appointment time";
      }
    }
    if (preferredMode === "default") {
      errors.preferredMode = "Please select preferred mode";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      // Format the date properly for Firestore
      const appointmentData = {
        patientName: patientName.trim(),
        patientNumber: patientNumber.trim(),
        patientGender: patientGender,
        appointmentTime: new Date(appointmentTime).toISOString(), // Convert to ISO string
        preferredMode: preferredMode,
        createdAt: new Date().toISOString(), // Convert to ISO string
        status: 'pending'
      };

      // Validate data before sending to Firestore
      if (!appointmentData.patientName || !appointmentData.patientNumber) {
        throw new Error('Required fields are missing');
      }

      try {
        // Explicitly specify the collection reference
        const appointmentsRef = collection(db, 'appointments');
        const docRef = await addDoc(appointmentsRef, appointmentData);
        console.log("Appointment saved with ID: ", docRef.id);

        // Send email only after successful database write
        await emailjs.sendForm(
          'service_izj2af6',
          'template_u2qug0h',
          e.target,
          'WDbyNCDI5NCflGOq0'
        );

        // Reset form and show success message
        setPatientName("");
        setPatientNumber("");
        setPatientGender("default");
        setAppointmentTime("");
        setPreferredMode("default");
        setFormErrors({});

        toast.success("Appointment Scheduled !", {
          position: toast.POSITION.TOP_CENTER,
          onOpen: () => setIsSubmitted(true),
          onClose: () => setIsSubmitted(false),
        });

      } catch (firestoreError) {
        console.error("Firestore Error:", firestoreError);
        throw new Error(`Database Error: ${firestoreError.message}`);
      }

    } catch (error) {
      console.error("Error Details:", error);
      toast.error(error.message || "Failed to schedule appointment");
    }
  };

  return (
    <div className="appointment-form-section">
      <h1 className="legal-siteTitle">
        <Link to="/">
          Curetica <span className="legal-siteSign">+</span>
        </Link>
      </h1>

      <div className="form-container">
        <h2 className="form-title">
          <span>Book Appointment Online</span>
        </h2>

        <form className="form-content" onSubmit={handleSubmit}>
          <label>
            Patient Full Name:
            <input
              type="text"
              name="patient_name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
            />
            {formErrors.patientName && <p className="error-message">{formErrors.patientName}</p>}
          </label>

          <br />
          <label>
            Patient Phone Number:
            <input
              type="text"
              name="patient_number"
              value={patientNumber}
              onChange={(e) => setPatientNumber(e.target.value)}
              required
            />
            {formErrors.patientNumber && <p className="error-message">{formErrors.patientNumber}</p>}
          </label>

          <br />
          <label>
            Patient Gender:
            <select
              name="patient_gender"
              value={patientGender}
              onChange={(e) => setPatientGender(e.target.value)}
              required
            >
              <option value="default">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="private">I will inform Doctor only</option>
            </select>
            {formErrors.patientGender && <p className="error-message">{formErrors.patientGender}</p>}
          </label>

          <br />
          <label>
            Preferred Appointment Time:
            <input
              type="datetime-local"
              name="appointment_time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              required
            />
            {formErrors.appointmentTime && <p className="error-message">{formErrors.appointmentTime}</p>}
          </label>

          <br />
          <label>
            Preferred Mode:
            <select
              name="preferred_mode"
              value={preferredMode}
              onChange={(e) => setPreferredMode(e.target.value)}
              required
            >
              <option value="default">Select</option>
              <option value="voice">ON-Site</option>
              <option value="video">Chat with our virtual Doctor</option>
            </select>
            {formErrors.preferredMode && <p className="error-message">{formErrors.preferredMode}</p>}
          </label>

          <br />
          <button type="submit" className="text-appointment-btn">
            Confirm Appointment
          </button>

          <p className="success-message" style={{display: isSubmitted ? "block" : "none"}}>Appointment details has been sent to the patients phone number via SMS.</p>
        </form>
      </div>

      <div className="legal-footer">
        <p>© 2024-2025 curetica . All rights reserved.</p>
      </div>

      <ToastContainer autoClose={5000} limit={1} closeButton={false} />
    </div>
  );
}

export default AppointmentForm;
